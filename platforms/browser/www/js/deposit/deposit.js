function load_deposit(page) {
	loading();

	app.request({
		method: "POST",
		url: database_connect + "company_account/select_company_account.php", data:{ },
		success: function(data) {
			var obj = JSON.parse(data);
			if(obj['status'] == true) {
				var x = obj['data'];
				determinateLoading = false;
				app.dialog.close();
				$$('#bank_id_deposit').append(`<option value="">-- Pilih Bank --</option>`);
				for(var i = 0; i < x.length; i++) {
					$$('#bank_id_deposit').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
				}
			} else {
				determinateLoading = false;
				app.dialog.close();
				app.dialog.alert(obj['message']);
			}
		},
		error: function(data) {
			determinateLoading = false;
			app.dialog.close();
			var toastBottom = app.toast.create({
				text: ERRNC,
				closeTimeout: 2000,
			});
			toastBottom.open();
			page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
		}
	});

	$$('#btndeposit').on('click', function() {
		var transaction_price = $$('#transaction_price_deposit').val();
		var bank_id = $$('#bank_id_deposit').val();
		if(bank_id == "") {
			app.dialog.alert("Silahkan pilih bank tujuan terlebih daluhu!");
		} else if(transaction_price < 50000) {
			app.dialog.alert("Minimum jumlah deposit adalah IDR 50.000!");
		} else {
			app.dialog.confirm("Apakah Anda yakin untuk memproses transaksi deposit sebesar " + 
				formatRupiah(transaction_price) + " ini?",function() {
				loading();

				app.request({
					method: "POST",
					url: database_connect + "transaction/deposit/insert_deposit.php",
						data:{
							username : localStorage.username,
							transaction_price : transaction_price,
							bank_id : bank_id
						},
					success: function(data) {
						var obj = JSON.parse(data);
						if(obj['status'] == true) {
							var x = obj['data'];
							determinateLoading = false;
							app.dialog.close();
							page.router.navigate('/show_deposit/' + x);
						} else {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert(obj['message']);
						}
					},
					error: function(data) {
						determinateLoading = false;
						app.dialog.close();
						var toastBottom = app.toast.create({
							text: ERRNC,
							closeTimeout: 2000,
						});
						toastBottom.open();
						page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
					}
				});
			});
		}
	});
}