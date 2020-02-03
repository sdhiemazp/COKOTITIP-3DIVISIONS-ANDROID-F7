function load_home(page) {
	$$('#premium').hide();
	$$('#basic').hide();
	if(localStorage.user_type == "Admin") {
		$$('.menu_member').hide();
		$$('.menu_member_premium').hide();
	} else if(localStorage.user_type == "Member") {
		if(localStorage.user_level == "Basic") {
			$$('.menu_member_premium').hide();
		}
		$$('.menu_admin').hide();
	}

	app.request({
		method: "POST",
		url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
		success: function(data) {
			var obj = JSON.parse(data);
			if(obj['status'] == true) {
				var x = obj['data'];
				$$('#user_name_home').html("Hai, " + x[0]['user_name']);
				if(x[0]['user_level'] == "Basic") {
					$$('#user_loading').hide();
					$$('#basic').show();
				} else {
					$$('#user_loading').hide();
					$$('#premium').show();
				}

				if(x[0]['user_pascabayar'] == "Y") {
					$$('#pascabayar').show();
				} else {
					$$('#pascabayar').hide();
				}

				if(localStorage.user_type == "Admin") {
					app.request({
						method: "GET",
						url: database_connect + "digiflazz/cek_saldo.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							$$('#user_balance_digiflazz').html("Saldo Digiflazz : " + formatRupiah(obj['data']['deposit']));
							$$('#user_balance_a_home').html("Saldo E-Cash : " + formatRupiah(x[0]['user_balance_a']));
							$$('#user_balance_b_home').html("Bonus Sponsor : " + formatRupiah(x[0]['user_balance_b']));
							$$('#user_balance_c_home').html("Bonus Pasti : " + formatRupiah(x[0]['user_balance_c']));
						},
						error: function(data) {
							var toastBottom = app.toast.create({
								text: ERRNC,
								closeTimeout: 2000,
							});
							toastBottom.open();
							page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
						}
					});
				} else {
					$$('#user_balance_a_home').html("Saldo E-Cash : " + formatRupiah(x[0]['user_balance_a']));
					$$('#user_balance_b_home').html("Bonus Sponsor : " + formatRupiah(x[0]['user_balance_b']));
					$$('#user_balance_c_home').html("Bonus Pasti : " + formatRupiah(x[0]['user_balance_c']));
				}

				localStorage.user_balance_a = x[0]['user_balance_a'];
				localStorage.user_balance_b = x[0]['user_balance_b'];
				localStorage.user_balance_c = x[0]['user_balance_c'];
			}
		},
		error: function(data) {
			var toastBottom = app.toast.create({
				text: ERRNC,
				closeTimeout: 2000,
			});
			toastBottom.open();
			page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
		}
	});

	$$('#edit_profile').on('click', function(e) {
		page.router.navigate('/edit_member/' + localStorage.username);
	});
	$$('#edit_profile_password').on('click', function(e) {
		page.router.navigate('/edit_member/' + localStorage.username);
	});
	$$('.show_profile').on('click', function(e) {
		page.router.navigate('/show_member/' + localStorage.username);
	});
	$$('#transfer_balance_a').on('click', function(e) {
		page.router.navigate('/transfer_balance_a/');
	});
	$$('#transfer_balance_c').on('click', function(e) {
		page.router.navigate('/transfer_balance_c/');
	});

	$$('#logout').on('click', function(e) {
		app.dialog.confirm('Apakah anda ingin keluar?', 'Log Out',function () {
			localStorage.clear();
			page.router.navigate('/login/');
		});
	});

	var $ptrContent = $$('.ptr-content');
	$ptrContent.on('ptr:refresh', function (e) {
		setTimeout(function () {
			mainView.router.refreshPage();
			app.ptr.done();
		}, 2000);
	});
}