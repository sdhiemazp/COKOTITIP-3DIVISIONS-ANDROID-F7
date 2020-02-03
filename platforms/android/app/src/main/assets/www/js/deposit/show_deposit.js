function load_show_deposit(page) {
	var x = page.router.currentRoute.params.transaction_id;
	loading();

	app.request({
		method: "POST",
		url: database_connect + "transaction/deposit/show_deposit.php", data:{ transaction_id : x },
		success: function(data) {
			var obj = JSON.parse(data);
			if(obj['status'] == true) {
				var x = obj['data'];
				var x_account = obj['data_account'];
				determinateLoading = false;
				app.dialog.close();

				$$('#nominal_deposit').html(formatRupiah(x[0]['transaction_price']));
				$$('#kode_unik_deposit').html(formatRupiah(x[0]['transaction_unique_code']));
				$$('#total_deposit').html(formatRupiah((parseInt(x[0]['transaction_price']) + parseInt(x[0]['transaction_unique_code']))));
				$$('#berita_deposit').html(x[0]['transaction_code']);

				$$('#bank_tujuan').html(x_account[0]['bank_name']);
				$$('#nama_pemilik_rekening').html(x_account[0]['company_account_name']);
				$$('#nomor_rekening').html(x_account[0]['company_account_number']);
			} else {
				determinateLoading = false;
				app.dialog.close();
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

	$$('#btn_show_deposit_home').on('click', function() {
		page.router.navigate('/home/',{ animate:false, reloadAll:true });
	});
}