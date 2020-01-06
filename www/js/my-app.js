var $$ = Dom7;
var database_connect = "https://3dsaja.com/";
var lokasifoto = "https://3dsaja.com/image/";
// var database_connect = "https://adamcell.cokotitip.com/";
// var lokasifoto = "https://adamcell.cokotitip.com/image/";
var ERRNC = "Koneksi Anda terputus!";
var PHOTO_ERR = "Foto tidak berhasil diunggah!";

var app = new Framework7({
	root: '#app',
	name: '3DVISIONS',
	id: 'com.phonegap.3dvisions',
	panel: { swipe: 'left' },
	dialog: {
		buttonOk: 'Ya',
		buttonCancel: 'Tidak'
	},
	routes: [
		{
			path: '/index/',
			url: 'index.html',
		},
		// LOGIN
		{
			path: '/login/',
			url: 'pages/auth/login.html',
			on:
			{
				pageInit:function(e, page)
				{
					var captcha = '';
			   		var characters = '0123456789';
				  	var charactersLength = characters.length;
				  	for (var i = 0; i < 6; i++) {
				  		captcha += characters.charAt(Math.floor(Math.random() * charactersLength));
				  	}
					$$('#captcha_text').html(captcha);

					$$('#btnsignin').on('click', function() {
						var captcha_text = $$('#captcha').val();
						if(captcha_text == captcha) {
							if($$('#username_login').val() == '' || $$('#user_password_login').val() == '') {
								app.dialog.alert("Mohon masukkan username dan/atau password!");
							} else {
								var username = $$('#username_login').val();
								var password = $$('#user_password_login').val();
								loading();

								app.request.post(database_connect + "login.php", { username : username, user_password : password }, function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var obj = obj['data'];
										localStorage.username = obj[0]['username'];
										localStorage.user_name = obj[0]['user_name'];
										localStorage.user_type = obj[0]['user_type'];
										localStorage.user_level = obj[0]['user_level'];
										determinateLoading = false;
										app.dialog.close();
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									} else {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert("Username dan/atau password yang Anda masukkan salah!");
									}
								});
							}
						} else {
							app.dialog.alert("Captcha yang Anda masukkan salah! Silahkan coba lagi!");
						}
					});
				},
				pageAfterIn: function (event, page)
				{
					if(!localStorage.username) {
						page.router.navigate('/login/',{ animate:false, reloadAll:true });
					} else {
						page.router.navigate('/home/',{ animate:false, reloadAll:true });
					}
				}
			},
		},
		// REGISTER
		{
			path: '/register/',
			url: 'pages/auth/register.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "bank/select_bank.php", data:{ },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#bank_id').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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

					app.calendar.create({
						inputEl: '#user_birthday_register',
						openIn: 'customModal',
						header: true,
						footer: true,
					});

					$$('#btnregister').on('click', function() {
						loading();

						var username = $$('#username_register').val();
						var user_name = $$('#user_name_register').val();
						var user_email = $$('#user_email_register').val();
						var user_phone = $$('#user_phone_register').val();
						var user_birthday = $$('#user_birthday_register').val();
						var user_password = $$('#user_password_register').val();
						var user_account_name = $$('#user_account_name_register').val();
						var user_account_number = $$('#user_account_number_register').val();
						var bank_id = $$('#bank_id').val();
						app.request({
							method: "POST",
							url: database_connect + "register.php",
								data:{
								username: username,
								user_name: user_name,
								user_email: user_email,
								user_phone: user_phone,
								user_birthday: user_birthday,
								password: user_password,
								user_balance: '0',
								user_account_name: user_account_name,
								user_account_number: user_account_number,
								bank_id: bank_id
							},
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
										localStorage.username = username;
									});
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
				},
			},
		},
		// HOME
		{
			path: '/home/',
			url: 'pages/home.html',
			on:
			{
				pageInit: function (e, page)
				{
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
				},
				pageAfterIn: function (event, page)
				{
					if(!localStorage.username) {
						page.router.navigate('/login/',{ animate:false, reloadAll:true });
					} else {
						page.router.navigate('/home/',{ animate:false, reloadAll:true });
					}
				},
			},
		},
		// DEPOSIT
		{
			path: '/deposit/',
			url: 'pages/feature/deposit.html',
			on:
			{
				pageInit:function(e,page)
				{
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
				},
			},
		},
		// SHOW DEPOSIT
		{
			path: '/show_deposit/:transaction_id',
			url: 'pages/feature/show_deposit.html',
			on:
			{
				pageInit:function(e,page)
				{
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
				},
			},
		},
		// WITHDRAW
		{
			path: '/withdraw/',
			url: 'pages/feature/withdraw.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();
					if(localStorage.user_level == "Basic") {
						$$('#option_bonus_pasti').hide();
					}

					app.request({
						method: "POST",
						url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								localStorage.user_balance_b = x[0]['user_balance_b'];
								localStorage.user_balance_c = x[0]['user_balance_c'];
								$$('#user_balance_withdraw').val(x[0]['user_balance_b']);
								$$('#bank_name_withdraw').val(x[0]['bank_name']);
								$$('#user_account_name_withdraw').val(x[0]['user_account_name']);
								$$('#user_account_number_withdraw').val(x[0]['user_account_number']);
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

					$$('#user_balance_resource_withdraw').on('change', function() {
						if($$('#user_balance_resource_withdraw').val() == "Bonus Sponsor") {
							$$('#user_balance_withdraw').val(localStorage.user_balance_b);
						} else {
							$$('#user_balance_withdraw').val(localStorage.user_balance_c);
						}
					});

					$$('#btnwithdraw').on('click', function() {
						var transaction_message = $$('#user_balance_resource_withdraw').val();
						var transaction_price = $$('#transaction_price_withdraw').val();
						if($$('#user_balance_withdraw').val() < 50000) {
							app.dialog.alert("Saldo bonus yang Anda pilih kurang dari IDR 50.000!");
						} else {
							if(parseInt(transaction_price) < 50000) {
								app.dialog.alert("Minimal penarikan adalah IDR 50.000!");
							} else {
								if(parseInt(transaction_price) > parseInt($$('#user_balance_withdraw').val())) {
									app.dialog.alert("Saldo bonus yang Anda pilih tidak cukup!");
								} else {
									if(transaction_message == "Bonus Pasti" && localStorage.user_level == "Basic") {
										app.dialog.alert("Bonus pasti hanya dapat ditarik jika Anda telah mencapai level Premium!");
									} else {
										app.dialog.confirm("Apakah Anda yakin untuk memproses transaksi withdraw sebesar " + 
											formatRupiah(transaction_price) + " ini?", function() {
											loading();

											app.request({
												method: "POST",
												url: database_connect + "transaction/withdraw/insert_withdraw.php",
													data:{
														username : localStorage.username,
														transaction_price : transaction_price,
														transaction_message : transaction_message
													},
												success: function(data) {
													var obj = JSON.parse(data);
													if(obj['status'] == true) {
														var x = obj['data'];
														determinateLoading = false;
														app.dialog.close();
														page.router.navigate('/show_withdraw/' + x,{ force: true, ignoreCache: true });
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
								}
							}
						}
					});
				},
			},
		},
		// SHOW WITHDRAW
		{
			path: '/show_withdraw/:transaction_id',
			url: 'pages/feature/show_withdraw.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.transaction_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "transaction/withdraw/show_withdraw.php", data:{ transaction_id : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#sumber_withdraw').html(x[0]['transaction_message']);
								$$('#nominal_withdraw').html(formatRupiah(x[0]['transaction_price']));
								$$('#total_withdraw').html(formatRupiah(parseInt(x[0]['transaction_price']) - parseInt(x[0]['transaction_admin_fee'])));
								$$('#biaya_admin_withdraw').html(formatRupiah(x[0]['transaction_admin_fee']));
								if(x[0]['transaction_status'] == 'Pending') {
									$$('#berita_withdraw').html('Permintaan Anda sedang diproses!<br>Silahkan tunggu 1 x 24 jam!');
								} else if(x[0]['transaction_status'] == 'Success') {
									$$('#berita_withdraw').html('Permintaan Anda berhasil diproses !');
								} else if(x[0]['transaction_status'] == 'Failed') {
									$$('#berita_withdraw').html('Permintaan Anda ditolak!');
								}
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

					$$('#btn_show_withdraw_home').on('click', function() {
						page.router.navigate('/home/',{ animate:false, reloadAll:true });
					});
				},
			},
		},		
		// REPEAT ORDER
		{
			path: '/repeat_order/',
			url: 'pages/feature/repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
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
								$$('#bank_id_repeat_order').append(`<option value="">-- Pilih Bank --</option>`);
								for(var i = 0; i < x.length; i++) {
									$$('#bank_id_repeat_order').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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

					$$('#btnrepeatorder').on('click', function() {
						var transaction_count = $$('#transaction_count_repeat_order').val();
						var bank_id = $$('#bank_id_repeat_order').val();
						if(bank_id == "") {
							app.dialog.alert("Silahkan pilih bank tujuan terlebih daluhu!");
						} else if(transaction_count < 1) {
							app.dialog.alert("Minimum jumlah repeat order adalah 1 buah!");
						} else {
							loading();

							app.request({
								method: "POST",
								url: database_connect + "transaction/repeat_order/insert_repeat_order.php",
									data:{
										username : localStorage.username,
										transaction_count : transaction_count,
										bank_id : bank_id
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var x = obj['data'];
										determinateLoading = false;
										app.dialog.close();
										page.router.navigate('/show_repeat_order/' + x);
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
						}
					});
				},
			},
		},
		// SHOW REPEAT ORDER
		{
			path: '/show_repeat_order/:transaction_id',
			url: 'pages/feature/show_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.transaction_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "transaction/repeat_order/show_repeat_order.php", data:{ transaction_id : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								var x_account = obj['data_account'];
								determinateLoading = false;
								app.dialog.close();

								$$('#jumlah_repeat_order').html(x[0]['transaction_message']);
								$$('#kode_unik_repeat_order').html(x[0]['transaction_unique_code']);
								$$('#harga_repeat_order').html(x[0]['transaction_price']);
								
								var total = formatRupiah(((parseInt(x[0]['transaction_message']) * 
									(parseInt(x[0]['transaction_price']))) + parseInt(x[0]['transaction_unique_code'])));
								$$('#total_repeat_order').html(total);
									
								$$('#bank_tujuan_repeat_order').html(x_account[0]['bank_name']);
								$$('#nama_pemilik_rekening_repeat_order').html(x_account[0]['company_account_name']);
								$$('#nomor_rekening_repeat_order').html(x_account[0]['company_account_number']);

								if(x[0]['transaction_status'] == "Process") {
									$$('#btn_back_show_repeat_order').hide();
								} else {
									$$('#btn_yes_show_repeat_order').hide();
									$$('#btn_no_show_repeat_order').hide();
								}

								$$('#btn_back_show_repeat_order').on('click', function() {
									page.router.navigate('/home/',{ animate:false, reloadAll:true });
								});

								$$('#btn_yes_show_repeat_order').on('click', function() {
									app.dialog.confirm("Apakah Anda yakin untuk melakukan repeat order sejumlah  " + 
										x[0]['transaction_message'] + " buah ini?",function(){
										app.request({
											method: "POST",
											url: database_connect + "transaction/repeat_order/member_accept_repeat_order.php", data:{ transaction_id : x[0]['transaction_id'] },
											success: function(data) {
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
													var x = obj['data'];
													determinateLoading = false;
													app.dialog.close();
													app.dialog.alert("Transaksi diproses!");
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
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								});

								$$('#btn_no_show_repeat_order').on('click', function() {
									app.dialog.confirm("Apakah Anda yakin untuk membatalkan repeat order sejumlah  " + 
										x[0]['transaction_message'] + " buah ini?",function(){
										app.request({
											method: "POST",
											url: database_connect + "transaction/repeat_order/member_decline_repeat_order.php", data:{ transaction_id : x[0]['transaction_id'] },
											success: function(data) {
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
													var x = obj['data'];
													determinateLoading = false;
													app.dialog.close();
													app.dialog.alert("Transaksi dibatalkan!");
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
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								});
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
				},
			},
		},
		// TRANSFER E-CASH
		{
			path: '/transfer_balance_a/',
			url: 'pages/feature/transfer_balance_a.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "users/select_users_premium.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();

								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#username_transfer_ecash',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }

									  if(results.length == 0) {
									  	$$('#btntransferecash').addClass('disabled');
									  } else {
									  	$$('#btntransferecash').removeClass('disabled');
									  }
									  render(results);
									}
								});
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

					$$('#btntransferecash').on('click', function() {
						app.request({
							method: "GET",
							url: database_connect + "bonus/select_bonus.php", data:{  },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();

									var username_receiver = $$('#username_transfer_ecash').val();
									var count = $$('#count_transfer_ecash').val();
									if(username_receiver == "") {
										app.dialog.alert("Silahkan masukkan member tujuan terlebih dahulu!");
									} else if(parseInt(count) <= (parseInt(x[38]['bonus_value']) + 1) || count == "") {
										app.dialog.alert("Minimum jumlah transfer adalah " + formatRupiah((parseInt(x[38]['bonus_value']) + 1)) 
											+ "!");
									} else if((parseInt(count) + parseInt(x[52]['bonus_value'])) > parseInt(localStorage.user_balance_a)) {
										app.dialog.alert("Saldo Anda tidak cukup untuk melakukan transfer! Minimum saldo Anda yang harus tersisa adalah " + 
											formatRupiah(x[52]['bonus_value'])) + ".";
									} else {
										app.dialog.confirm("Apakah Anda yakin untuk melakukan transfer sebesar " + 
											formatRupiah(count) + " kepada " + username_receiver + "? Nominal transfer Anda akan " +
											"dipotong biaya admin sebesar " + formatRupiah(x[38]['bonus_value']), function() {
											loading();

											app.request({
												method: "POST",
												url: database_connect + "transaction/transfer_balance_a.php",
													data:{
														username_sender : localStorage.username,
														username_receiver : username_receiver,
														count : count
													},
												success: function(data) {
													var obj = JSON.parse(data);
													if(obj['status'] == true) {
														determinateLoading = false;
														app.dialog.close();
														app.dialog.alert(obj['data']);
														page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
				},
			},
		},
		// TRANSFER BONUS
		{
			path: '/transfer_balance_c/',
			url: 'pages/feature/transfer_balance_c.html',
			on:
			{
				pageInit:function(e,page)
				{
					$$('#available_transfer_bonus').val(localStorage.user_balance_c);

					$$('#btntransferbonus').on('click', function() {
						app.request({
							method: "GET",
							url: database_connect + "bonus/select_bonus.php", data:{  },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();

									var count = $$('#count_transfer_bonus').val();
									if(parseInt(count) <= (parseInt(x[50]['bonus_value']) + 1) || count == "") {
										app.dialog.alert("Minimum jumlah transfer adalah " + formatRupiah((parseInt(x[50]['bonus_value']) + 1)) 
											+ "!");
									} else if((parseInt(count) + parseInt(x[53]['bonus_value'])) > parseInt(localStorage.user_balance_c)) {
										app.dialog.alert("Saldo Anda tidak cukup untuk melakukan transfer! Minimum saldo Anda yang harus tersisa adalah " + 
											formatRupiah(x[53]['bonus_value'])) + ".";
									} else {
										app.dialog.confirm("Apakah Anda yakin untuk melakukan transfer bonus sebesar " + 
											formatRupiah(count) + " ke saldo E-Cash Anda? Nominal transfer Anda akan " +
											"dipotong biaya admin sebesar " + formatRupiah(x[50]['bonus_value']), function() {
											loading();

											app.request({
												method: "POST",
												url: database_connect + "transaction/transfer_balance_c.php",
													data:{
														username : localStorage.username,
														count : count
													},
												success: function(data) {
													var obj = JSON.parse(data);
													if(obj['status'] == true) {
														determinateLoading = false;
														app.dialog.close();
														app.dialog.alert(obj['data']);
														page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
				},
			},
		},
		// PROFIT
		{
			path: '/profit/',
			url: 'pages/feature/profit.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "profit/show_profit.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#profit_value_a_profit').val(x[0]['profit_value']);
								$$('#profit_value_b_profit').val(x[1]['profit_value']);
								$$('#profit_value_c_profit').val(x[2]['profit_value']);
								$$('#profit_value_d_profit').val(x[3]['profit_value']);
								$$('#profit_value_e_profit').val(x[4]['profit_value']);
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

					$$('#btnprofit').on('click', function() {
						loading();

						var profit_value_a = $$('#profit_value_a_profit').val();
						var profit_value_b = $$('#profit_value_b_profit').val();
						var profit_value_c = $$('#profit_value_c_profit').val();
						var profit_value_d = $$('#profit_value_d_profit').val();
						var profit_value_e = $$('#profit_value_e_profit').val();

						if(profit_value_a == "") {
							app.dialog.alert("Minimum profit A adalah 0!");
						} else if(profit_value_b == "") {
							app.dialog.alert("Minimum profit B adalah 0!");
						} else if(profit_value_c == "") {
							app.dialog.alert("Minimum profit C adalah 0!");
						} else if(profit_value_d == "") {
							app.dialog.alert("Minimum profit D adalah 0!");
						} else if(profit_value_e == "") {
							app.dialog.alert("Minimum profit E adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "profit/update_profit.php",
									data:{
										profit_value_a : profit_value_a,
										profit_value_b : profit_value_b,
										profit_value_c : profit_value_c,
										profit_value_d : profit_value_d,
										profit_value_e : profit_value_e
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});

					$$('#btn_setting_bonus_sponsor').on('click', function() {
						page.router.navigate('/setting_bonus_sponsor/');
					});
					$$('#btn_setting_bonus_pasangan').on('click', function() {
						page.router.navigate('/setting_bonus_pasangan/');
					});
					$$('#btn_setting_bonus_titik').on('click', function() {
						page.router.navigate('/setting_bonus_titik/');
					});
					$$('#btn_setting_bonus_generasi_mlm').on('click', function() {
						page.router.navigate('/setting_bonus_generasi_mlm/');
					});
					$$('#btn_setting_bonus_generasi_ppob').on('click', function() {
						page.router.navigate('/setting_bonus_generasi_ppob/');
					});
					$$('#btn_setting_cashback_transaksi_ppob').on('click', function() {
						page.router.navigate('/setting_cashback_transaksi_ppob/');
					});
					$$('#btn_setting_bonus_repeat_order').on('click', function() {
						page.router.navigate('/setting_bonus_repeat_order/');
					});
					$$('#btn_setting_royalty_repeat_order').on('click', function() {
						page.router.navigate('/setting_royalty_repeat_order/');
					});
					$$('#btn_setting_biaya_admin').on('click', function() {
						page.router.navigate('/setting_biaya_admin/');
					});
				},
			},
		},
		// SETTING BONUS SPONSOR
		{
			path: '/setting_bonus_sponsor/',
			url: 'pages/feature/setting_bonus_sponsor.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#sponsor_premium_setting').val(x[0]['bonus_value']);
								$$('#sponsor_basic_setting').val(x[1]['bonus_value']);
								$$('#saldo_ecash_member_setting').val(x[37]['bonus_value']);
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

					$$('#btnsavesponsor').on('click', function() {
						loading();

						var sponsor_premium = $$('#sponsor_premium_setting').val();
						var sponsor_basic = $$('#sponsor_basic_setting').val();
						var saldo_ecash_member = $$('#saldo_ecash_member_setting').val();

						if(sponsor_premium == "") {
							app.dialog.alert("Minimum bonus sponsor premium adalah 0!");
						} else if(sponsor_basic == "") {
							app.dialog.alert("Minimum bonus sponsor basic adalah 0!");
						} else if(saldo_ecash_member == "") {
							app.dialog.alert("Minimum saldo e-cash member adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "sponsor",
										sponsor_premium : sponsor_premium,
										sponsor_basic : sponsor_basic,
										saldo_ecash_member : saldo_ecash_member,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BONUS PASANGAN
		{
			path: '/setting_bonus_pasangan/',
			url: 'pages/feature/setting_bonus_pasangan.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#pasangan_ganjil_setting').val(x[2]['bonus_value']);
								$$('#pasangan_genap_setting').val(x[3]['bonus_value']);
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

					$$('#btnsavepasangan').on('click', function() {
						loading();

						var pasangan_ganjil = $$('#pasangan_ganjil_setting').val();
						var pasangan_genap = $$('#pasangan_genap_setting').val();

						if(pasangan_ganjil == "") {
							app.dialog.alert("Minimum bonus pasangan ganjil adalah 0!");
						} else if(pasangan_genap == "") {
							app.dialog.alert("Minimum bonus pasangan genap adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "pasangan",
										pasangan_ganjil : pasangan_ganjil,
										pasangan_genap : pasangan_genap,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BONUS TITIK
		{
			path: '/setting_bonus_titik/',
			url: 'pages/feature/setting_bonus_titik.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#titik_1_setting').val(x[25]['bonus_value']);
								$$('#titik_2_setting').val(x[26]['bonus_value']);
								$$('#titik_3_setting').val(x[27]['bonus_value']);
								$$('#titik_4_setting').val(x[28]['bonus_value']);
								$$('#titik_5_setting').val(x[29]['bonus_value']);
								$$('#titik_6_setting').val(x[30]['bonus_value']);
								$$('#titik_7_setting').val(x[31]['bonus_value']);
								$$('#titik_8_setting').val(x[32]['bonus_value']);
								$$('#titik_9_setting').val(x[33]['bonus_value']);
								$$('#titik_10_setting').val(x[34]['bonus_value']);
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

					$$('#btnsavetitik').on('click', function() {
						loading();

						var titik_1 = $$('#titik_1_setting').val();
						var titik_2 = $$('#titik_2_setting').val();
						var titik_3 = $$('#titik_3_setting').val();
						var titik_4 = $$('#titik_4_setting').val();
						var titik_5 = $$('#titik_5_setting').val();
						var titik_6 = $$('#titik_6_setting').val();
						var titik_7 = $$('#titik_7_setting').val();
						var titik_8 = $$('#titik_8_setting').val();
						var titik_9 = $$('#titik_9_setting').val();
						var titik_10 = $$('#titik_10_setting').val();

						if(titik_1 == "") {
							app.dialog.alert("Minimum bonus titik level 1 adalah 0!");
						} else if(titik_2 == "") {
							app.dialog.alert("Minimum bonus titik level 2 adalah 0!");
						} else if(titik_3 == "") {
							app.dialog.alert("Minimum bonus titik level 3 adalah 0!");
						} else if(titik_4 == "") {
							app.dialog.alert("Minimum bonus titik level 4 adalah 0!");
						} else if(titik_5 == "") {
							app.dialog.alert("Minimum bonus titik level 5 adalah 0!");
						} else if(titik_6 == "") {
							app.dialog.alert("Minimum bonus titik level 6 adalah 0!");
						} else if(titik_7 == "") {
							app.dialog.alert("Minimum bonus titik level 7 adalah 0!");
						} else if(titik_8 == "") {
							app.dialog.alert("Minimum bonus titik level 8 adalah 0!");
						} else if(titik_9 == "") {
							app.dialog.alert("Minimum bonus titik level 9 adalah 0!");
						} else if(titik_10 == "") {
							app.dialog.alert("Minimum bonus titik level 10 adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "titik",
										titik_1 : titik_1,
										titik_2 : titik_2,
										titik_3 : titik_3,
										titik_4 : titik_4,
										titik_5 : titik_5,
										titik_6 : titik_6,
										titik_7 : titik_7,
										titik_8 : titik_8,
										titik_9 : titik_9,
										titik_10 : titik_10,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BONUS GENERASI MLM
		{
			path: '/setting_bonus_generasi_mlm/',
			url: 'pages/feature/setting_bonus_generasi_mlm.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#generasi_mlm_1_setting').val(x[15]['bonus_value']);
								$$('#generasi_mlm_2_setting').val(x[16]['bonus_value']);
								$$('#generasi_mlm_3_setting').val(x[17]['bonus_value']);
								$$('#generasi_mlm_4_setting').val(x[18]['bonus_value']);
								$$('#generasi_mlm_5_setting').val(x[19]['bonus_value']);
								$$('#generasi_mlm_6_setting').val(x[20]['bonus_value']);
								$$('#generasi_mlm_7_setting').val(x[21]['bonus_value']);
								$$('#generasi_mlm_8_setting').val(x[22]['bonus_value']);
								$$('#generasi_mlm_9_setting').val(x[23]['bonus_value']);
								$$('#generasi_mlm_10_setting').val(x[24]['bonus_value']);
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

					$$('#btnsavegenerasimlm').on('click', function() {
						loading();

						var generasi_mlm_1 = $$('#generasi_mlm_1_setting').val();
						var generasi_mlm_2 = $$('#generasi_mlm_2_setting').val();
						var generasi_mlm_3 = $$('#generasi_mlm_3_setting').val();
						var generasi_mlm_4 = $$('#generasi_mlm_4_setting').val();
						var generasi_mlm_5 = $$('#generasi_mlm_5_setting').val();
						var generasi_mlm_6 = $$('#generasi_mlm_6_setting').val();
						var generasi_mlm_7 = $$('#generasi_mlm_7_setting').val();
						var generasi_mlm_8 = $$('#generasi_mlm_8_setting').val();
						var generasi_mlm_9 = $$('#generasi_mlm_9_setting').val();
						var generasi_mlm_10 = $$('#generasi_mlm_10_setting').val();

						if(generasi_mlm_1 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 1 adalah 0!");
						} else if(generasi_mlm_2 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 2 adalah 0!");
						} else if(generasi_mlm_3 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 3 adalah 0!");
						} else if(generasi_mlm_4 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 4 adalah 0!");
						} else if(generasi_mlm_5 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 5 adalah 0!");
						} else if(generasi_mlm_6 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 6 adalah 0!");
						} else if(generasi_mlm_7 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 7 adalah 0!");
						} else if(generasi_mlm_8 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 8 adalah 0!");
						} else if(generasi_mlm_9 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 9 adalah 0!");
						} else if(generasi_mlm_10 == "") {
							app.dialog.alert("Minimum bonus generasi MLM level 10 adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "generasi mlm",
										generasi_mlm_1 : generasi_mlm_1,
										generasi_mlm_2 : generasi_mlm_2,
										generasi_mlm_3 : generasi_mlm_3,
										generasi_mlm_4 : generasi_mlm_4,
										generasi_mlm_5 : generasi_mlm_5,
										generasi_mlm_6 : generasi_mlm_6,
										generasi_mlm_7 : generasi_mlm_7,
										generasi_mlm_8 : generasi_mlm_8,
										generasi_mlm_9 : generasi_mlm_9,
										generasi_mlm_10 : generasi_mlm_10,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BONUS GENERASI PPOB
		{
			path: '/setting_bonus_generasi_ppob/',
			url: 'pages/feature/setting_bonus_generasi_ppob.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#generasi_ppob_1_setting').val(x[5]['bonus_value']);
								$$('#generasi_ppob_2_setting').val(x[6]['bonus_value']);
								$$('#generasi_ppob_3_setting').val(x[7]['bonus_value']);
								$$('#generasi_ppob_4_setting').val(x[8]['bonus_value']);
								$$('#generasi_ppob_5_setting').val(x[9]['bonus_value']);
								$$('#generasi_ppob_6_setting').val(x[10]['bonus_value']);
								$$('#generasi_ppob_7_setting').val(x[11]['bonus_value']);
								$$('#generasi_ppob_8_setting').val(x[12]['bonus_value']);
								$$('#generasi_ppob_9_setting').val(x[13]['bonus_value']);
								$$('#generasi_ppob_10_setting').val(x[14]['bonus_value']);
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

					$$('#btnsavegenerasippob').on('click', function() {
						loading();

						var generasi_ppob_1 = $$('#generasi_ppob_1_setting').val();
						var generasi_ppob_2 = $$('#generasi_ppob_2_setting').val();
						var generasi_ppob_3 = $$('#generasi_ppob_3_setting').val();
						var generasi_ppob_4 = $$('#generasi_ppob_4_setting').val();
						var generasi_ppob_5 = $$('#generasi_ppob_5_setting').val();
						var generasi_ppob_6 = $$('#generasi_ppob_6_setting').val();
						var generasi_ppob_7 = $$('#generasi_ppob_7_setting').val();
						var generasi_ppob_8 = $$('#generasi_ppob_8_setting').val();
						var generasi_ppob_9 = $$('#generasi_ppob_9_setting').val();
						var generasi_ppob_10 = $$('#generasi_ppob_10_setting').val();

						if(generasi_ppob_1 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 1 adalah 0!");
						} else if(generasi_ppob_2 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 2 adalah 0!");
						} else if(generasi_ppob_3 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 3 adalah 0!");
						} else if(generasi_ppob_4 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 4 adalah 0!");
						} else if(generasi_ppob_5 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 5 adalah 0!");
						} else if(generasi_ppob_6 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 6 adalah 0!");
						} else if(generasi_ppob_7 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 7 adalah 0!");
						} else if(generasi_ppob_8 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 8 adalah 0!");
						} else if(generasi_ppob_9 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 9 adalah 0!");
						} else if(generasi_ppob_10 == "") {
							app.dialog.alert("Minimum bonus generasi PPOB level 10 adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "generasi ppob",
										generasi_ppob_1 : generasi_ppob_1,
										generasi_ppob_2 : generasi_ppob_2,
										generasi_ppob_3 : generasi_ppob_3,
										generasi_ppob_4 : generasi_ppob_4,
										generasi_ppob_5 : generasi_ppob_5,
										generasi_ppob_6 : generasi_ppob_6,
										generasi_ppob_7 : generasi_ppob_7,
										generasi_ppob_8 : generasi_ppob_8,
										generasi_ppob_9 : generasi_ppob_9,
										generasi_ppob_10 : generasi_ppob_10,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING CASHBACK TRANSAKSI PPOB
		{
			path: '/setting_cashback_transaksi_ppob/',
			url: 'pages/feature/setting_cashback_transaksi_ppob.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#cashback_ppob_setting').val(x[4]['bonus_value']);
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

					$$('#btnsavecashbackppob').on('click', function() {
						loading();

						var cashback_ppob = $$('#cashback_ppob_setting').val();

						if(cashback_ppob == "") {
							app.dialog.alert("Minimum bonus cashback transaksi ppob adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "cashback ppob",
										cashback_ppob : cashback_ppob,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BONUS REPEAT ORDER
		{
			path: '/setting_bonus_repeat_order/',
			url: 'pages/feature/setting_bonus_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#bonus_ro_setting').val(x[39]['bonus_value']);
								$$('#price_ro_setting').val(x[51]['bonus_value']);
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

					$$('#btnsavebonusro').on('click', function() {
						loading();

						var price_ro = $$('#price_ro_setting').val();
						var bonus_ro = $$('#bonus_ro_setting').val();

						if(price_ro == "") {
							app.dialog.alert("Minimum harga repeat order adalah 0!");
						} else if(bonus_ro == "") {
							app.dialog.alert("Minimum bonus repeat order adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "bonus ro",
										price_ro : price_ro,
										bonus_ro : bonus_ro,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING ROYALTY REPEAT ORDER
		{
			path: '/setting_royalty_repeat_order/',
			url: 'pages/feature/setting_royalty_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#royalty_ro_1_setting').val(x[40]['bonus_value']);
								$$('#royalty_ro_2_setting').val(x[41]['bonus_value']);
								$$('#royalty_ro_3_setting').val(x[42]['bonus_value']);
								$$('#royalty_ro_4_setting').val(x[43]['bonus_value']);
								$$('#royalty_ro_5_setting').val(x[44]['bonus_value']);
								$$('#royalty_ro_6_setting').val(x[45]['bonus_value']);
								$$('#royalty_ro_7_setting').val(x[46]['bonus_value']);
								$$('#royalty_ro_8_setting').val(x[47]['bonus_value']);
								$$('#royalty_ro_9_setting').val(x[48]['bonus_value']);
								$$('#royalty_ro_10_setting').val(x[49]['bonus_value']);
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

					$$('#btnsaveroyaltyro').on('click', function() {
						loading();

						var royalty_ro_1 = $$('#royalty_ro_1_setting').val();
						var royalty_ro_2 = $$('#royalty_ro_2_setting').val();
						var royalty_ro_3 = $$('#royalty_ro_3_setting').val();
						var royalty_ro_4 = $$('#royalty_ro_4_setting').val();
						var royalty_ro_5 = $$('#royalty_ro_5_setting').val();
						var royalty_ro_6 = $$('#royalty_ro_6_setting').val();
						var royalty_ro_7 = $$('#royalty_ro_7_setting').val();
						var royalty_ro_8 = $$('#royalty_ro_8_setting').val();
						var royalty_ro_9 = $$('#royalty_ro_9_setting').val();
						var royalty_ro_10 = $$('#royalty_ro_10_setting').val();

						if(royalty_ro_1 == "") {
							app.dialog.alert("Minimum royalty repeat order level 1 adalah 0!");
						} else if(royalty_ro_2 == "") {
							app.dialog.alert("Minimum royalty repeat order level 2 adalah 0!");
						} else if(royalty_ro_3 == "") {
							app.dialog.alert("Minimum royalty repeat order level 3 adalah 0!");
						} else if(royalty_ro_4 == "") {
							app.dialog.alert("Minimum royalty repeat order level 4 adalah 0!");
						} else if(royalty_ro_5 == "") {
							app.dialog.alert("Minimum royalty repeat order level 5 adalah 0!");
						} else if(royalty_ro_6 == "") {
							app.dialog.alert("Minimum royalty repeat order level 6 adalah 0!");
						} else if(royalty_ro_7 == "") {
							app.dialog.alert("Minimum royalty repeat order level 7 adalah 0!");
						} else if(royalty_ro_8 == "") {
							app.dialog.alert("Minimum royalty repeat order level 8 adalah 0!");
						} else if(royalty_ro_9 == "") {
							app.dialog.alert("Minimum royalty repeat order level 9 adalah 0!");
						} else if(royalty_ro_10 == "") {
							app.dialog.alert("Minimum royalty repeat order level 10 adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "royalty ro",
										royalty_ro_1 : royalty_ro_1,
										royalty_ro_2 : royalty_ro_2,
										royalty_ro_3 : royalty_ro_3,
										royalty_ro_4 : royalty_ro_4,
										royalty_ro_5 : royalty_ro_5,
										royalty_ro_6 : royalty_ro_6,
										royalty_ro_7 : royalty_ro_7,
										royalty_ro_8 : royalty_ro_8,
										royalty_ro_9 : royalty_ro_9,
										royalty_ro_10 : royalty_ro_10,
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// SETTING BIAYA ADMIN
		{
			path: '/setting_biaya_admin/',
			url: 'pages/feature/setting_biaya_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "bonus/select_bonus.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#wd_sponsor_setting').val(x[35]['bonus_value']);
								$$('#wd_pasti_setting').val(x[36]['bonus_value']);
								$$('#transfer_ecash_setting').val(x[38]['bonus_value']);
								$$('#transfer_bonus_setting').val(x[50]['bonus_value']);
								$$('#minimum_ecash_setting').val(x[52]['bonus_value']);
								$$('#minimum_bonus_setting').val(x[53]['bonus_value']);
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

					$$('#btnsavebiayawd').on('click', function() {
						loading();

						var wd_sponsor = $$('#wd_sponsor_setting').val();
						var wd_pasti = $$('#wd_pasti_setting').val();
						var transfer_ecash = $$('#transfer_ecash_setting').val();
						var transfer_bonus = $$('#transfer_bonus_setting').val();
						var minimum_ecash = $$('#minimum_ecash_setting').val();
						var minimum_bonus = $$('#minimum_bonus_setting').val();

						if(wd_sponsor == "") {
							app.dialog.alert("Minimum biaya admin WD saldo bonus sponsor adalah 0!");
						} else if(wd_pasti == "") {
							app.dialog.alert("Minimum biaya admin WD saldo bonus pasti adalah 0!");
						} else if(transfer_ecash == "") {
							app.dialog.alert("Minimum biaya admin transfer e-cash adalah 0!");
						} else if(transfer_bonus == "") {
							app.dialog.alert("Minimum biaya admin transfer bonus adalah 0!");
						} else if(minimum_ecash == "") {
							app.dialog.alert("Minimum saldo ecash minimum adalah 0!");
						} else if(minimum_bonus == "") {
							app.dialog.alert("Minimum saldo bonus pasti minimum adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "wd",
										wd_sponsor : wd_sponsor,
										wd_pasti : wd_pasti,
										transfer_ecash : transfer_ecash,
										transfer_bonus : transfer_bonus,
										minimum_ecash : minimum_ecash,
										minimum_bonus : minimum_bonus
									},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(obj['message']);
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
						}
					});
				},
			},
		},
		// HISTORY BONUS BY MEMBER
		{
			path: '/history_bonus/:username',
			url: 'pages/feature/history_bonus.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "history_bonus/select_history_bonus.php", data:{ username : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#listhistorybonus').append(`
										<div class="card demo-facebook-card">
										  <div class="card-header">
										    <div class="demo-facebook-name">` + x[i]['history_bonus_message'] + `<span></div>
										    <div class="demo-facebook-price">` + formatRupiah(x[i]['history_bonus_price']) + `</div>
										    <div class="demo-facebook-date">` + formatDateTime(x[i]['history_bonus_date']) + `</div>
										  </div>
										</div>
									`);
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'],'Notifikasi',function(){
                  app.views.main.router.back();
                });
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
				},
			},
		},
		// LIST HISTORY BONUS
		{
			path: '/history_bonus_all/',
			url: 'pages/feature/history_bonus_all.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "history_bonus/select_history_bonus_all.php", data:{ category : "Bonus Sponsor" },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#listhistorybonusall').append(`
										<div class="card demo-facebook-card">
										  <div class="card-header">
										    <div class="demo-facebook-name">` + x[i]['history_bonus_username'] + `<span></div>
										    <div class="demo-facebook-name">` + x[i]['history_bonus_message'] + `<span></div>
										    <div class="demo-facebook-price">` + formatRupiah(x[i]['history_bonus_price']) + `</div>
										    <div class="demo-facebook-date">` + formatDateTime(x[i]['history_bonus_date']) + `</div>
										  </div>
										</div>
									`);
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'],'Notifikasi',function(){
                  app.views.main.router.back();
                });
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

					$$('#category_bonus_selection').on('change', function () {
						var category = $$('#category_bonus_selection').val();
						$$('#listhistorybonusall').html('');

						app.request({
							method: "POST",
							url: database_connect + "history_bonus/select_history_bonus_all.php", data:{ category : category },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									for(var i = 0; i < x.length; i++) {
										$$('#listhistorybonusall').append(`
											<div class="card demo-facebook-card">
											  <div class="card-header">
											    <div class="demo-facebook-name">` + x[i]['history_bonus_username'] + `<span></div>
											    <div class="demo-facebook-name">` + x[i]['history_bonus_message'] + `<span></div>
											    <div class="demo-facebook-price">` + formatRupiah(x[i]['history_bonus_price']) + `</div>
											    <div class="demo-facebook-date">` + formatDateTime(x[i]['history_bonus_date']) + `</div>
											  </div>
											</div>
										`);
									}
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'],'Notifikasi',function(){
                    app.views.main.router.back();
                  });
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
				},
			},
		},
		// HISTORY TRANSACTION BY MEMBER
		{
			path: '/history/',
			url: 'pages/feature/history.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "transaction/select_transaction.php", data:{ username : localStorage.username, 
							transaction_type : "Sell" },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									var color = "white";
									if(x[i]['transaction_status'] == "Failed") {
										color = "red";
									} else {
										color = "green";
									}

									var price = formatRupiah((parseInt(x[i]['transaction_price'])));
									var sell = "Ket/SN : ";

									var balance = "";
									if(x[i]['transaction_balance_left'] != "") {
										balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
									}

									if(x[i]['transaction_type'] == "Sell") {
										x[i]['transaction_type'] = "Prabayar";
									}

									$$('#listhistory').append(`
										<a>
											<div class="card demo-facebook-card">
											  <div class="card-header">
											    <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
											    	color + `">` + x[i]['transaction_status'] + `</span></div>
											    <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
											    	`<span></div>
											    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
											    <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
											    <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
											  </div>
											</div>
										</a>
									`);
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								$$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + 
									obj['message'] + `</p></center>`);
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

					$$('#category_transaction_selection_history').on('change', function () {
						var category = $$('#category_transaction_selection_history').val();
						$$('#listhistory').html('');
						loading();

						app.request({
							method: "POST",
							url: database_connect + "transaction/select_transaction.php", data:{ username : localStorage.username, 
								transaction_type : category },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									for(var i = 0; i < x.length; i++) {
										var url = "#";
										var adminfee = "";
										if(x[i]['transaction_type'] == "Deposit") {
											url = "/show_deposit/";
										} else if(x[i]['transaction_type'] == "Withdraw") {
											url = "/show_withdraw/";
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										} else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total Transfer : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										}  else if(x[i]['transaction_type'] == "Transfer Masuk") {
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total Penerimaan : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										} else if(x[i]['transaction_type'] == "Repeat Order") {
											url = "/show_repeat_order/";
										} else if(x[i]['transaction_type'] == "Pascabayar") {
											url = "/checkout_pasca_detail/";
										}

										var color = "white";
										if(x[i]['transaction_status'] == "Failed") {
											color = "red";
										} else {
											color = "green";
										}

										var price = "";
										var sell = "";
										if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || 
											x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
											price = formatRupiah((parseInt(x[i]['transaction_price'])));
											if(x[i]['transaction_type'] == "Sell") {
												x[i]['transaction_type'] = "Prabayar";
												sell = "Ket/SN : ";
											}
										} else if(x[i]['transaction_type'] == "Repeat Order") {
											price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
											x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
											if(x[i]['transaction_status'] == "Process") {
												color = "purple";
												x[i]['transaction_status'] = "Waiting Confirmation";
											}
										} else if(x[i]['transaction_type'] == "Pascabayar") {
											
										} else {
											price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
										}

										var balance = "";
										if(x[i]['transaction_balance_left'] != "") {
											balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
										}

										$$('#listhistory').append(`
											<a href="` + url + x[i]['transaction_id'] + `">
												<div class="card demo-facebook-card">
												  <div class="card-header">
												    <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
												    	color + `">` + x[i]['transaction_status'] + `</span></div>
												    <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
												    	`<span></div>
												    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
												    <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
												    ` + adminfee + `
												    <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
												  </div>
												</div>
											</a>
										`);
									}
								} else {
									determinateLoading = false;
									app.dialog.close();
									$$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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
				},
			},
		},
		// HISTORY TRANSACTION BY ADMIN
		{
			path: '/list_history/:username',
			url: 'pages/feature/history.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "transaction/select_transaction.php", data:{ username : x, transaction_type : "Sell" },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									var color = "white";
									if(x[i]['transaction_status'] == "Failed") {
										color = "red";
									} else {
										color = "green";
									}

									var price = formatRupiah((parseInt(x[i]['transaction_price'])));
									var sell = "Ket/SN : ";

									var balance = "";
									if(x[i]['transaction_balance_left'] != "") {
										balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
									}

									if(x[i]['transaction_type'] == "Sell") {
										x[i]['transaction_type'] = "Prabayar";
									}

									$$('#listhistory').append(`
										<a>
											<div class="card demo-facebook-card">
											  <div class="card-header">
											    <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
											    	color + `">` + x[i]['transaction_status'] + `</span></div>
											    <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
											    	`<span></div>
											    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
											    <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
											    <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
											  </div>
											</div>
										</a>
									`);
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								$$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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

					$$('#category_transaction_selection_history').on('change', function () {
						var category = $$('#category_transaction_selection_history').val();
						$$('#listhistory').html('');
						loading();

						app.request({
							method: "POST",
							url: database_connect + "transaction/select_transaction.php", data:{ username : x, 
								transaction_type : category },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									for(var i = 0; i < x.length; i++) {
										var url = "#";
										var adminfee = "";
										if(x[i]['transaction_type'] == "Deposit") {
											url = "/show_deposit/";
										} else if(x[i]['transaction_type'] == "Withdraw") {
											url = "/show_withdraw/";
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										} else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total Transfer : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										}  else if(x[i]['transaction_type'] == "Transfer Masuk") {
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total Penerimaan : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
												parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										} else if(x[i]['transaction_type'] == "Repeat Order") {
											url = "/show_repeat_order/";
										} else if(x[i]['transaction_type'] == "Pascabayar") {
											url = "/checkout_pasca_detail/";
										}

										var color = "white";
										if(x[i]['transaction_status'] == "Failed") {
											color = "red";
										} else {
											color = "green";
										}

										var price = "";
										var sell = "";
										if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || 
											x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
											price = formatRupiah((parseInt(x[i]['transaction_price'])));
											if(x[i]['transaction_type'] == "Sell") {
												x[i]['transaction_type'] = "Prabayar";
												sell = "Ket/SN : ";
											}
										} else if(x[i]['transaction_type'] == "Repeat Order") {
											price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
											x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
											if(x[i]['transaction_status'] == "Process") {
												color = "purple";
												x[i]['transaction_status'] = "Waiting Confirmation";
											}
										} else if(x[i]['transaction_type'] == "Pascabayar") {
											
										} else {
											price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
										}

										var balance = "";
										if(x[i]['transaction_balance_left'] != "") {
											balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
										}

										$$('#listhistory').append(`
											<a href="` + url + x[i]['transaction_id'] + `">
												<div class="card demo-facebook-card">
												  <div class="card-header">
												    <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
												    	color + `">` + x[i]['transaction_status'] + `</span></div>
												    <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
												    	`<span></div>
												    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
												    <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
												    ` + adminfee + `
												    <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
												  </div>
												</div>
											</a>
										`);
									}
								} else {
									determinateLoading = false;
									app.dialog.close();
									$$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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
				},
			},
		},
		// LIST HISTORY TRANSACTION
		{
			path: '/list_transaction/',
			url: 'pages/feature/list_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type: 'Decrease' },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									var message_accept = "";
									var message_decline = "";
									var withdraw = "";

									if(x[i]['transaction_status'] == "Failed" || x[i]['transaction_status'] == "Success") {
										var color = "";
										if(x[i]['transaction_status'] == "Failed") {
											color = "red";
										} else {
											color = "green";
										}

										var price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
										$$('#listtransaction').append(`
											<div class="card demo-facebook-card">
											  <div class="card-header">
												<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + color + `">` + x[i]['transaction_status'] + `</span></div>
												<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b></div>
												<div class="demo-facebook-price">` + price + `</div>
												<div class="demo-facebook-price">` + x[i]['transaction_message'].toUpperCase() + `</div>
												<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
											  </div>
											</div>
										`);
									} 
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								$$('#listtransaction').html(`<center><p style="margin-top: 40%; text-align: center;">` + 
									obj['message'] + `</p></center>`);
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

					$$('#category_transaction_selection').on('change', function () {
						var category = $$('#category_transaction_selection').val();
						$$('#listtransaction').html('');
						loading();

						app.request({
							method: "POST",
							url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type:category },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									for(var i = 0; i < x.length; i++) {
										var message_accept = "";
										var message_decline = "";
										var withdraw = "";

										if(x[i]['transaction_status'] == "Failed" || x[i]['transaction_status'] == "Success") {
											var color = "white";
											if(x[i]['transaction_status'] == "Failed") {
												color = "red";
											} else {
												color = "green";
											}

											var price = "";
											var sell = "";
											if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
												price = formatRupiah((parseInt(x[i]['transaction_price'])));
												if(x[i]['transaction_type'] == "Sell") {
													x[i]['transaction_type'] = "Prabayar";
													sell = "Ket/SN : ";
												}
											} else if(x[i]['transaction_type'] == "Repeat Order") {
												price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
												x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
											} else {
												price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
											}

											var balance = "";
											if(x[i]['transaction_balance_left'] != "") {
												balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
											}

											var bank_name = "";
											var adminfee = "";
											if(x[i]['transaction_type'] == "Deposit") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

												bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
											} else if(x[i]['transaction_type'] == "Withdraw") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
												
												withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
													x[i]['user_account_number'] + `</div>`;
												adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
													<div class="demo-facebook-price">TOTAL WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
											} else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
												adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
													<div class="demo-facebook-price">TOTAL TRANSFER : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
													parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
											} else if(x[i]['transaction_type'] == "Transfer Masuk") {
												adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
													<div class="demo-facebook-price">TOTAL PENERIMAAN : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
													parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
											}

											$$('#listtransaction').append(`
												<div class="card demo-facebook-card">
												  <div class="card-header">
													<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + 
														color + `">` + x[i]['transaction_status'] + `</span></div>
													<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + 
														`</b> <span style="float: right; color: orange;">` + balance + `<span></div>
													<div class="demo-facebook-price">` + price + `</div>
													<div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
													<div class="demo-facebook-price">` + sell + x[i]['transaction_message'].toUpperCase() + `</div>` + adminfee + `
													<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
												  </div>
												</div>
											`);
										} else {
											if(x[i]['transaction_type'] != "Sell" && x[i]['transaction_type'] != "Pascabayar") {
												var bank_name
												var adminfee = "";
												var price = 0;
												if(x[i]['transaction_type'] == "Deposit") {
													message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
													message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

													price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
													bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
												} else if(x[i]['transaction_type'] == "Withdraw") {
													message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
													message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
													
													withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
														x[i]['user_account_number'] + `</div>`;
													adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
														<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
													price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
												} if(x[i]['transaction_type'] == "Repeat Order") {
													message_accept = "Apakah Anda telah selesai memproses repeat order ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
													message_decline = "Apakah Anda yakin ini menolak repeat order ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

													x[i]['transaction_message'] = x[i]['transaction_message'] + " buah";
													price = ((parseInt(x[i]['transaction_price']) * (parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
												}

												$$('#listtransaction').append(`
													<div class="card demo-facebook-card">
														<div class="card-header">
															<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right;">` + x[i]['transaction_status'] + `</span></div>
															<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + `</b> ` + x[i]['transaction_message'].toUpperCase() + `</div>
															<div class="demo-facebook-price">` + formatRupiah(price) + `</div>` + adminfee + `
															<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
														</div>
														<div class="card-footer">
															<a class="link color-green accept_transaction" style="width: 50%; text-align: center;" data-id="` +
																x[i]['transaction_id'] + `" data-message_accept="` + message_accept + `" data-balance="` +
																price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Selesai</a>
															<a class="link color-red decline_transaction" style="width: 50%; text-align: center;" data-id="` +
																x[i]['transaction_id'] + `" data-message_decline="` + message_decline + `" data-balance="` +
																price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Tolak</a>
														</div>
													</div>
												`);
											}
										}
									}

									$$('.accept_transaction').on('click', function () {
					                  var id = $$(this).data('id');
					                  var message_accept = $$(this).data('message_accept');
					                  var user_balance = $$(this).data('balance');
					                  var username = $$(this).data('username');
					                  var transaction_message = $$(this).data('message');
					                  var transaction_type = $$(this).data('type');
					                  app.dialog.confirm(message_accept,function(){
					                    loading();
					                    app.request({
					                      method:"POST",
					                      url:database_connect + "transaction/accept_transaction.php",
					                      data:{
					                        transaction_id : id,
					                        user_balance : user_balance,
					                        username : username,
					                        transaction_message : transaction_message,
					                        transaction_type : transaction_type
					                      },
					                      success:function(data){
					                        var obj = JSON.parse(data);
					                        if(obj['status'] == true) {
					                          var x = obj['data'];
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(x,'Notifikasi',function(){
					                            mainView.router.refreshPage();
					                          });
					                        }
					                        else {
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(obj['message']);
					                        }
					                      },
					                      error:function(data){
					                        determinateLoading = false;
					                        app.dialog.close();
					                        var toastBottom = app.toast.create({
					                          text: ERRNC,
					                          closeTimeout: 2000,
					                        });
					                        toastBottom.open();
					                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
					                      }
					                    });
					                  });
					                });

					                $$('.decline_transaction').on('click', function () {
					                  var id = $$(this).data('id');
					                  var message_decline = $$(this).data('message_decline');
					                  var user_balance = $$(this).data('balance');
					                  var username = $$(this).data('username');
					                  var transaction_type = $$(this).data('type');
					                  app.dialog.confirm(message_decline,function(){
					                    loading();
					                    app.request({
					                      method:"POST",
					                      url:database_connect + "transaction/decline_transaction.php",
					                      data:{
					                        transaction_id : id,
					                        user_balance : user_balance,
					                        username : username,
					                        transaction_type : transaction_type
					                      },
					                      success:function(data){
					                        var obj = JSON.parse(data);
					                        if(obj['status'] == true) {
					                          var x = obj['data'];
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(x,'Notifikasi',function(){
					                            mainView.router.refreshPage();
					                          });
					                        }
					                        else {
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(obj['message']);
					                        }
					                      },
					                      error:function(data){
					                        determinateLoading = false;
					                        app.dialog.close();
					                        var toastBottom = app.toast.create({
					                          text: ERRNC,
					                          closeTimeout: 2000,
					                        });
					                        toastBottom.open();
					                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
					                      }
					                    });
					                  });
					                });
								} else {
									determinateLoading = false;
									app.dialog.close();
									$$('#listtransaction').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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
				},
			},
		},
		// CHECK TRANSACTION
		{
			path: '/check_transaction/',
			url: 'pages/feature/check_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
					app.calendar.create({
		            inputEl: '#start_date_check_transaction',
		            openIn: 'customModal',
		            header: true,
		            footer: true,
		         	});

							app.calendar.create({
		            inputEl: '#end_date_check_transaction',
		            openIn: 'customModal',
		            header: true,
		            footer: true,
		        	});

					$$('#btnchecktransaction').on('click', function() {
						var start_date = $$('#start_date_check_transaction').val();
						var end_date = $$('#end_date_check_transaction').val();

						if(start_date == "") {
							app.dialog.alert("Tanggal mulai tidak boleh kosong!");
						} else if(end_date == null) {
							app.dialog.alert("Tanggal selesai tidak boleh kosong!");
						} else {
							loading();

							app.request({
								method: "POST",
								url: database_connect + "transaction/check_transaction_all.php",
									data:{
									start_date: start_date,
									end_date: end_date
								},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var x = obj['message'];
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(x, 'Notifikasi', function(){
											page.router.navigate('/list_transaction/');
										});
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
						}
					});
				},
			},
		},
		// INCREASE
		{
			path: '/increase/',
			url: 'pages/feature/increase.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();
					
					app.request({
						method: "POST",
						url: database_connect + "users/select_users.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();

								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#username_increase',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }
									  render(results);
									}
								});
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

					$$('#btnincrease').on('click', function() {
						var transaction_price = $$('#transaction_price_increase').val();
						var transaction_message = $$('#transaction_message_increase').val();
						var balance_increase = $$('#balance_increase').val();
						var username = $$('#username_increase').val();

						if(transaction_price < 1 || transaction_price == "") {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert("Minimum jumlah penambahan saldo/bonus member adalah IDR 1!");
						} else {
							app.dialog.confirm("Apakah Anda yakin menambahkan saldo " + formatRupiah(transaction_price) + " kepada " + 
								username + "?", function() {
								loading();

								app.request({
									method: "POST",
									url: database_connect + "transaction/increase.php",
										data:{
											transaction_price : transaction_price,
											balance_increase : balance_increase,
											transaction_message : transaction_message,
											username : username
										},
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x = obj['data'];
											determinateLoading = false;
											app.dialog.close();
											app.dialog.alert(x);
											page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
				},
			},
		},
		// DECREASE
		{
			path: '/decrease/',
			url: 'pages/feature/decrease.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "users/select_users.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#username_decrease',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }
									  render(results);
									}
								});
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

					$$('#btndecrease').on('click', function() {
						var transaction_price = $$('#transaction_price_decrease').val();
						var transaction_message = $$('#transaction_message_decrease').val();
						var balance_decrease = $$('#balance_decrease').val();
						var username = $$('#username_decrease').val();

						if(transaction_price < 1 || transaction_price == "") {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert("Minimum jumlah pengurangan saldo member adalah IDR 1!");
						} else {
							app.dialog.confirm("Apakah Anda yakin mengurangi saldo sejumlah " + formatRupiah(transaction_price) + " dari " + username + 
								"?", function() {
								loading();

								app.request({
									method: "POST",
									url: database_connect + "transaction/decrease.php",
										data:{
											transaction_price : transaction_price,
											balance_decrease : balance_decrease,
											transaction_message : transaction_message,
											username : username
										},
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x = obj['data'];
											determinateLoading = false;
											app.dialog.close();
											app.dialog.alert(x);
											page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
				},
			},
		},
		// USERS ALL
		{
			path: '/users/',
			url: 'pages/feature/users.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "users/select_users2.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								determinateLoading = false;
								app.dialog.close();

								var x = obj['data'];
								var tmphsl ='';
								for(var i = 0; i < x.length; i++) {
									tmphsl += `<tr>
										<td class="label-cell">` +x[i]['username']+ `</td>
										<td class="numeric-cell">` +x[i]['user_balance_a']+ `</td>
										<td class="numeric-cell">` +x[i]['user_balance_b']+ `</td>
										<td class="numeric-cell">` +x[i]['user_balance_c']+ `</td>
										<td class="label-cell">` +x[i]['user_date']+ `</td>
										<td class="label-cell">` +x[i]['user_date_premium']+ `</td>
									</tr>`;
								}

								$$('#list_all_member_users').append(`
									<div class="data-table card">
										<table>
											<thead>
												<tr>
													<th class="label-cell">Username</th>
													<th class="label-cell">Saldo E-Cash</th>
													<th class="label-cell">Saldo Bonus Sponsor</th>
													<th class="label-cell">Saldo Bonus Pasti</th>
													<th class="label-cell">Tanggal Masuk</th>
													<th class="label-cell">Tanggal Premium</th>
												</tr>
											</thead>
											<tbody>
												` +tmphsl+ `
											</tbody>
										</table>
									</div>
								`);
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi');
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

					$$('#txtsearchusers').on('keyup', function() {
						$$('#list_all_member_users').html(``);
						var username = $$('#txtsearchusers').val();
						app.request({
							method: "POST",
							url: database_connect + "users/find_users2.php", data:{ username : username },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									var tmphsl ='';
									for(var i = 0; i < x.length; i++) {
										tmphsl += `<tr>
											<td class="label-cell">` +x[i]['username']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_a']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_b']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_c']+ `</td>
											<td class="label-cell">` +x[i]['user_date']+ `</td>
											<td class="label-cell">` +x[i]['user_date_premium']+ `</td>
										</tr>`;
									}

									$$('#list_all_member_users').append(`
										<div class="data-table card">
											<table>
												<thead>
													<tr>
														<th class="label-cell">Username</th>
														<th class="label-cell">Saldo E-Cash</th>
														<th class="label-cell">Saldo Bonus Sponsor</th>
														<th class="label-cell">Saldo Bonus Pasti</th>
														<th class="label-cell">Tanggal Masuk</th>
														<th class="label-cell">Tanggal Premium</th>
													</tr>
												</thead>
												<tbody>
													` +tmphsl+ `
												</tbody>
											</table>
										</div>
									`);
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'], 'Notifikasi');
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
				},
			},
		},
		// USERS PASCABAYAR
		{
			path: '/users_pascabayar/',
			url: 'pages/feature/users_pascabayar.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "users/select_users.php", data:{ user_pascabayar : 'N' },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#txtsearchpascabayar',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }

									  if(results.length == 0) {
									  	$$('#btninsertpascabayar').addClass('disabled');
									  } else {
									  	$$('#btninsertpascabayar').removeClass('disabled');
									  }
									  render(results);
									}
								});
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

					$$('#btninsertpascabayar').on('click', function() {
						var username = $$('#txtsearchpascabayar').val();
						app.dialog.confirm("Apakah Anda yakin untuk menambah member ini ke whitelist akses pascabayar?", function() {
              loading();
		
              app.request({
                method:"POST",
                url:database_connect + "users/users_pascabayar_insert.php",
                data:{
                  username : username
                },
                success:function(data){
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data'];
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(x,'Notifikasi',function(){
                      mainView.router.refreshPage();
                    });
                  } else {
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(obj['message']);
                  }
                },
                error:function(data){
                  determinateLoading = false;
                  app.dialog.close();
                  var toastBottom = app.toast.create({
                    text: ERRNC,
                    closeTimeout: 2000,
                  });
                  toastBottom.open();
                  page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                }
              });
		        });
					});

					app.request({
						method: "POST",
						url: database_connect + "users/select_users_pascabayar.php", data:{ user_pascabayar : "Y" },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var tmphsl ='';
								for(var i = 0; i < x.length; i++)
								{
									tmphsl += `<tr>
										<td class="label-cell">` +x[i]['username']+ `</td>
										<td class="numeric-cell"><a class="link color-red delete_user_pascabayar" data-id="` + 
										x[i]['username'] + `">Hapus</a></td>
									</tr>`;
								}

								$$('#list_all_member_users_pascabayar').append(`
									<div class="data-table card">
										<table>
											<thead>
												<tr>
													<th class="label-cell">Username</th>
													<th class="label-cell">Aksi</th>
												</tr>
											</thead>
											<tbody>
												` +tmphsl+ `
											</tbody>
										</table>
									</div>
								`);

								$$('.delete_user_pascabayar').on('click', function () {
                  var id = $$(this).data('id');
                  app.dialog.confirm("Apakah Anda yakin untuk menghapus member dari whitelist akses pascabayar?",function(){
                    loading();

                    app.request({
                      method:"POST",
                      url:database_connect + "users/users_pascabayar_delete.php",
                      data:{
                        username : id
                      },
                      success:function(data){
                        var obj = JSON.parse(data);
                        if(obj['status'] == true) {
                          var x = obj['data'];
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(x,'Notifikasi',function(){
                            mainView.router.refreshPage();
                          });
                        }
                        else {
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(obj['message']);
                        }
                      },
                      error:function(data){
                        determinateLoading = false;
                        app.dialog.close();
                        var toastBottom = app.toast.create({
                          text: ERRNC,
                          closeTimeout: 2000,
                        });
                        toastBottom.open();
                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                      }
                    });
                  });
                });
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi');
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
				},
			},
		},
		// LIST MEMBER
		{
			path: '/list_member/',
			url: 'pages/feature/list_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "users/select_member.php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x_data_sendiri = obj['data_sendiri'];
								var x_data_anak_kiri = obj['data_anak_kiri'];
								var x_data_anak_kanan = obj['data_anak_kanan'];
								var x_data_anak_kiri_cucu_kiri = obj['data_anak_kiri_cucu_kiri'];
								var x_data_anak_kiri_cucu_kanan = obj['data_anak_kiri_cucu_kanan'];
								var x_data_anak_kanan_cucu_kiri = obj['data_anak_kanan_cucu_kiri'];
								var x_data_anak_kanan_cucu_kanan = obj['data_anak_kanan_cucu_kanan'];
								determinateLoading = false;
								app.dialog.close();

								var sponsor = "";
								if(x_data_sendiri[0]['username'] != "Kanza31") {
									sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
								}

								var photo_self = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
								if(x_data_sendiri[0]['user_level'] == "Premium"){
									photo_self = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
								}

								$$('#self').html(photo_self + `<br>` + localStorage.username + 
									`<br><br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_left_count'] + ` | ` + x_data_sendiri[0]['user_right_count'] + `</span>
									<br><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"><span> ` + x_data_sendiri[0]['user_premium_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_right_count'] + `</span>
									<br><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
									<br><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"><span> ` + x_data_sendiri[0]['user_premium_new_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_new_right_count'] + `</span>
									` + sponsor + `</p>`
								);

								if(x_data_anak_kiri.length == 0) {
									$$('#left_child_name').html(`<a class="link color-black" href="/create_member/Left/` + localStorage.username + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri[0]['username'] + `">` + x_data_anak_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan.length == 0) {
									$$('#right_child_name').html(`<a class="link color-black" href="/create_member/Right/` + localStorage.username + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan[0]['username'] + `">` + x_data_anak_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kiri.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_left_child_name').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_left_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `">` + x_data_anak_kiri_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kanan.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_right_child_name').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_right_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `">` + x_data_anak_kiri_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kiri.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_left_child_name').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan_cucu_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_left_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `">` + x_data_anak_kanan_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kanan.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_right_child_name').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_right_child_name').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `">` + x_data_anak_kanan_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(localStorage.user_type == "Member") {
									$$('.menu_admin').hide();
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
					
					var url = "select_users";
					if(localStorage.user_type == "Member") {
						url = "select_users_by_member";
					}

					app.request({
						method: "POST",
						url: database_connect + "users/" + url + ".php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#txtsearch',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }

									  if(results.length == 0) {
									  	$$('#btnsearch').addClass('disabled');
									  } else {
									  	$$('#btnsearch').removeClass('disabled');
									  }
									  render(results);
									}
								});
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

					$$('#btnsearch').on('click', function() {
						var search = $$('#txtsearch').val();
						page.router.navigate('/list_member_2/' + search);
					});
				},
			},
		},
		// LIST MEMBER 2
		{
			path: '/list_member_2/:username',
			url: 'pages/feature/list_member_2.html',
			on:
			{
				pageInit:function(e,page)
				{
					var username = page.router.currentRoute.params.username;
					loading();
					app.request({
						method: "POST",
						url: database_connect + "users/select_member.php", data:{ username : username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x_data_sendiri = obj['data_sendiri'];
								var x_data_anak_kiri = obj['data_anak_kiri'];
								var x_data_anak_kanan = obj['data_anak_kanan'];
								var x_data_anak_kiri_cucu_kiri = obj['data_anak_kiri_cucu_kiri'];
								var x_data_anak_kiri_cucu_kanan = obj['data_anak_kiri_cucu_kanan'];
								var x_data_anak_kanan_cucu_kiri = obj['data_anak_kanan_cucu_kiri'];
								var x_data_anak_kanan_cucu_kanan = obj['data_anak_kanan_cucu_kanan'];
								determinateLoading = false;
								app.dialog.close();

								var sponsor = "";
								if(x_data_sendiri[0]['username'] != "Kanza31") {
									sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
									if(x_data_sendiri[0]['username'] == localStorage.username) {
										$$('#back_2').hide();
									} else {
										$$('#back_2').show();
										$$('#back_2').on('click', function() {
											page.router.navigate('/list_member_3/' + x_data_sendiri[0]['username_upline']);
										});
									}
								} else {
									$$('#back_2').hide();
								}

								var photo_self = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
								if(x_data_sendiri[0]['user_level'] == "Premium"){
									photo_self = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
								}

								$$('#self_2').html(photo_self + `<br>` + x_data_sendiri[0]['username'] + 
									`<br><br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_left_count'] + ` | ` + x_data_sendiri[0]['user_right_count'] + `</span>
									<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_right_count'] + `</span>
									<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
									<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_new_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_new_right_count'] + `</span>
									` + sponsor
								);

								if(x_data_anak_kiri.length == 0) {
									$$('#left_child_name_2').html(`<a class="link color-black" href="/create_member/Left/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kiri[0]['username'] + `">` + x_data_anak_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan.length == 0) {
									$$('#right_child_name_2').html(`<a class="link color-black" href="/create_member/Right/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kanan[0]['username'] + `">` + x_data_anak_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kiri.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_left_child_name_2').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_left_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `">` + x_data_anak_kiri_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kanan.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_right_child_name_2').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_right_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `">` + x_data_anak_kiri_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kiri.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_left_child_name_2').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var classs = "clr-basic";
									if(x_data_anak_kanan_cucu_kiri[0]['user_level'] == "Premium"){
										classs = "clr-premium";
									}
									$$('#right_left_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `">` + x_data_anak_kanan_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kanan.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_right_child_name_2').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_right_child_name_2').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_3/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `">` + x_data_anak_kanan_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(localStorage.user_type == "Member") {
									$$('.menu_admin').hide();
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

					var url = "select_users";
					if(localStorage.user_type == "Member") {
						url = "select_users_by_member";
					}

					app.request({
						method: "POST",
						url: database_connect + "users/" + url + ".php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#txtsearch_2',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }

									  if(results.length == 0) {
									  	$$('#btnsearch_2').addClass('disabled');
									  } else {
									  	$$('#btnsearch_2').removeClass('disabled');
									  }
									  render(results);
									}
								});
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

					$$('#btnsearch_2').on('click', function() {
						var search = $$('#txtsearch_2').val();
						page.router.navigate('/list_member_3/' + search);
					});
				},
			},
		},
		// LIST MEMBER 3
		{
			path: '/list_member_3/:username',
			url: 'pages/feature/list_member_3.html',
			on:
			{
				pageInit:function(e,page)
				{
					var username = page.router.currentRoute.params.username;
					loading();
					app.request({
						method: "POST",
						url: database_connect + "users/select_member.php", data:{ username : username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x_data_sendiri = obj['data_sendiri'];
								var x_data_anak_kiri = obj['data_anak_kiri'];
								var x_data_anak_kanan = obj['data_anak_kanan'];
								var x_data_anak_kiri_cucu_kiri = obj['data_anak_kiri_cucu_kiri'];
								var x_data_anak_kiri_cucu_kanan = obj['data_anak_kiri_cucu_kanan'];
								var x_data_anak_kanan_cucu_kiri = obj['data_anak_kanan_cucu_kiri'];
								var x_data_anak_kanan_cucu_kanan = obj['data_anak_kanan_cucu_kanan'];
								determinateLoading = false;
								app.dialog.close();

								var sponsor = "";
								if(x_data_sendiri[0]['username'] != "Kanza31") {
									sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
									if(x_data_sendiri[0]['username'] == localStorage.username) {
										$$('#back_3').hide();
									} else {
										$$('#back_3').show();
										$$('#back_3').on('click', function() {
											page.router.navigate('/list_member_2/' + x_data_sendiri[0]['username_upline']);
										});
									}
								} else {
									$$('#back_3').hide();
								}

								var photo_self = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
								if(x_data_sendiri[0]['user_level'] == "Premium"){
									photo_self = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
								}

								$$('#self_3').html(photo_self  + `<br>` + x_data_sendiri[0]['username'] + 
									`<br><br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_left_count'] + ` | ` + x_data_sendiri[0]['user_right_count'] + `</span>
									<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_right_count'] + `</span>
									<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
									<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_new_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_new_right_count'] + `</span>
									` + sponsor
								);

								if(x_data_anak_kiri.length == 0) {
									$$('#left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri[0]['username'] + `">` + x_data_anak_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan.length == 0) {
									$$('#right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan[0]['username'] + `">` + x_data_anak_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kiri.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_left_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `">` + x_data_anak_kiri_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kiri_cucu_kanan.length == 0) {
									if(x_data_anak_kiri.length != 0) {
										$$('#left_right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kiri_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#left_right_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `">` + x_data_anak_kiri_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kiri_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kiri.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan_cucu_kiri[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_left_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `">` + x_data_anak_kanan_cucu_kiri[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kiri[0]['username_sponsor'] + `</span>
									`);
								}

								if(x_data_anak_kanan_cucu_kanan.length == 0) {
									if(x_data_anak_kanan.length != 0) {
										$$('#right_right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
									}
								} else {
									var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
									if(x_data_anak_kanan_cucu_kanan[0]['user_level'] == "Premium"){
										photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
									}
									$$('#right_right_child_name_3').html(`
										<a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
										<a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
										` + photo + `<br>
										<a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `">` + x_data_anak_kanan_cucu_kanan[0]['username'] + `</a><br>
										<br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_right_count'] + `</span>
										<br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_right_count'] + `</span>
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
										<br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
										<br><span>` + x_data_anak_kanan_cucu_kanan[0]['username_sponsor'] + `</span>
									`);
								}

								if(localStorage.user_type == "Member") {
									$$('.menu_admin').hide();
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

					var url = "select_users";
					if(localStorage.user_type == "Member") {
						url = "select_users_by_member";
					}

					app.request({
						method: "POST",
						url: database_connect + "users/" + url + ".php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#txtsearch_3',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }

									  if(results.length == 0) {
									  	$$('#btnsearch_3').addClass('disabled');
									  } else {
									  	$$('#btnsearch_3').removeClass('disabled');
									  }
									  render(results);
									}
								});
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

					$$('#btnsearch_3').on('click', function() {
						var search = $$('#txtsearch_3').val();
						page.router.navigate('/list_member_2/' + search);
					});
				},
			},
		},
		// SHOW MEMBER
		{
			path: '/show_member/:username',
			url: 'pages/feature/show_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "users/show_users.php", data:{ username : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('.user_name_show_member').html(x[0]['user_name']);
								$$('#username_show_member').html(x[0]['username']);
								$$('#user_address_show_member').html(x[0]['user_address']);
								$$('#user_phone_show_member').html(x[0]['user_phone']);
								$$('#user_email_show_member').html(x[0]['user_email']);
								$$('#user_balance_a_show_member').html(formatRupiah(x[0]['user_balance_a']));
								$$('#user_balance_b_show_member').html(formatRupiah(x[0]['user_balance_b']));
								$$('#user_balance_c_show_member').html(formatRupiah(x[0]['user_balance_c']));
								$$('#user_account_number_show_member').html(x[0]['user_account_number']);
								$$('#user_bank_name_show_member').html(x[0]['bank_name']);
								$$('#user_account_name_show_member').html("A/N " + x[0]['user_account_name']);

								$$('#action_show_member').html(`
									<a class="button menu_admin" href="/edit_member/` + x[0]['username'] + `">Ubah Data</a>
									<a class="button" href="/list_history/` + x[0]['username'] + `">Riwayat Transaksi</a>
									<a class="button" href="/history_bonus/` + x[0]['username'] + `">Riwayat Bonus</a>
								`);

								if(localStorage.user_type == "Member") {
									$$('.menu_admin').hide();
								}
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
				},
			},
		},
		// CREATE MEMBER
		{
			path: '/create_member/:position/:username_upline',
			url: 'pages/feature/create_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					var position = page.router.currentRoute.params.position;
					var username_upline = page.router.currentRoute.params.username_upline;
					$$('#pin_id_no_usage_premium').hide();
					$$('#pin_id_no_usage_basic').hide();
					loading();

					$$('#user_name_sponsor_create_member').val(localStorage.user_name);
					$$('#position_create_member').val(position);
					app.request({
						method: "POST",
						url: database_connect + "users/show_users.php", data:{ username : username_upline },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								$$('#user_name_upline_create_member').val(x[0]['user_name']);
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
							page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
						}
					});

					app.request({
						method: "POST",
						url: database_connect + "bank/select_bank.php", data:{ },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								for(var i = 0; i < x.length; i++) {
									$$('#bank_id').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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
							page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
						}
					});

					$$('#username_create_member').on('keyup', function(){
						var el = $$('#username_create_member').val();
						$$('#username_create_member').val(el.replace(/\s/g, ""));
					});

					app.request({
						method: "POST",
						url: database_connect + "pin/select_pin_user_no_usage.php", data:{ username:localStorage.username},
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var premium = 0;
								var basic = 0;
								for(var i = 0; i < x.length; i++) {
									if (x[i]['pin_type'] == 'Premium') {
										$$('#pin_id_no_usage_premium').append(`<option value="` + x[i]['pin_id'] + `">` + x[i]['pin_type'] + ` - ` +
											x[i]['pin_value'] + `</option>`);
											premium ++;
									} else {
										$$('#pin_id_no_usage_basic').append(`<option value="` + x[i]['pin_id'] + `">` + x[i]['pin_type'] + ` - ` +
											x[i]['pin_value'] + `</option>`);
											basic ++;
									}
								}

								$$('.pin_id_no_usage_radio').on('click', function () {
									var name = $$(this).data('name');
									if (name == "Premium") {
										if (premium == 0) {
											app.dialog.alert('Silahkan beli pin terlebih dahulu!',function () {
												$$('#pin_id_no_usage_premium').hide();
												$$('#pin_id_no_usage_basic').show();
												$$('#radiobas').prop('checked', true);
												$$('#radiopre').prop('checked', false);
												document.getElementById("pin_id_no_usage_premium").selectedIndex=0;
											});
										} else {
											$$('#pin_id_no_usage_premium').show();
											$$('#pin_id_no_usage_basic').hide();
											document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
										}
									} else {
										if (basic == 0) {
											app.dialog.alert('Silahkan beli pin terlebih dahulu!',function () {
												$$('#pin_id_no_usage_premium').show();
												$$('#pin_id_no_usage_basic').hide();
												$$('#radiobas').prop('checked', false);
												$$('#radiopre').prop('checked', true);
												document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
											});
										} else {
											$$('#pin_id_no_usage_premium').hide();
											$$('#pin_id_no_usage_basic').show();
											document.getElementById("pin_id_no_usage_premium").selectedIndex=0;
										}
									}
								});
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'] + ' Silahkan beli pin terlebih dahulu!',function () {
									app.views.main.router.back();
								});
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
							page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
						}
					});

					// app.calendar.create({
					// 	inputEl: '#user_birthday_create_member',
					// 	openIn: 'customModal',
					// 	header: true,
					// 	footer: true,
					// });

					$$('#btncreatemember').on('click', function() {
						var username = $$('#username_create_member').val();
						var user_name = $$('#user_name_create_member').val();
						var user_email = $$('#user_email_create_member').val();
						var user_phone = $$('#user_phone_create_member').val();
						var user_address = $$('#user_address_create_member').val();
						var user_password = $$('#user_password_create_member').val();
						var user_account_name = $$('#user_account_name_create_member').val();
						var user_account_number = $$('#user_account_number_create_member').val();
						var bank_id = $$('#bank_id').val();
						var pin_id_no_usage = '';
						if ($$('#pin_id_no_usage_premium').val() == 0) {
							pin_id_no_usage = $$('#pin_id_no_usage_basic').val();
						} else {
							pin_id_no_usage = $$('#pin_id_no_usage_premium').val();
						}

						if(username == "") {
							app.dialog.alert("Username tidak boleh kosong!");
						} else if(user_name == "") {
							app.dialog.alert("Nama tidak boleh kosong!");
						} else if(user_email == "") {
							app.dialog.alert("Email tidak boleh kosong!");
						} else if(user_phone == "") {
							app.dialog.alert("Telepon tidak boleh kosong!");
						} else if(user_address == "") {
							app.dialog.alert("Alamat tidak boleh kosong!");
						} else if(user_password == "") {
							app.dialog.alert("Password tidak boleh kosong!");
						} else if(user_account_name == "") {
							app.dialog.alert("Nama pemilik rekening tidak boleh kosong!");
						} else if(user_account_number == "") {
							app.dialog.alert("Nomor rekening tidak boleh kosong!");
						} else if($$('#pin_id_no_usage_basic').val() == 0 && $$('#pin_id_no_usage_premium').val() == 0) {
							app.dialog.alert("Pin tidak boleh kosong!");
						} else {
							showDeterminate(true);
							determinateLoading = false;
							function showDeterminate(inline)
							{
							  determinateLoading = true;
							  var progressBarEl;
							  if (inline) {
							    progressBarEl = app.dialog.progress();
							  } else {
							    progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
							  }
							  function simulateLoading() {
							    setTimeout(function () {
							      simulateLoading();
							    }, Math.random() * 300 + 300);
							  }
							  simulateLoading();
							}

							app.request({
								method: "POST",
								url: database_connect + "users/insert_users.php",
									data:{
									username: username,
									user_name: user_name,
									user_email: user_email,
									user_phone: user_phone,
									user_address: user_address,
									password: user_password,
									user_account_name: user_account_name,
									user_account_number: user_account_number,
									bank_id: bank_id,
									user_balance_a: '0',
									user_balance_b: '0',
									user_balance_c: '0',
									username_sponsor: localStorage.username,
									username_upline: username_upline,
									relationship_position: position,
									pin_id:pin_id_no_usage,
								},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var x = obj['data'];
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(x, 'Notifikasi', function(){
											page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
										});
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
						}
					});
				},
			},
		},
		// EDIT MEMBER
		{
			path: '/edit_member/:username',
			url: 'pages/feature/edit_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "users/show_users.php", data:{ username : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								var x_sponsor = obj['data_sponsor'];
								var x_upline = obj['data_upline'];
								determinateLoading = false;
								app.dialog.close();
								if(x[0]['user_type'] == "Member") {
									$$('#user_name_sponsor_edit_member').val(x_sponsor[0]['user_name']);
									$$('#user_name_upline_edit_member').val(x_upline[0]['user_name']);
									$$('#position_edit_member').val(x_upline[0]['position']);
								} else {
									$$('#li_user_name_sponsor_edit_member').hide();
									$$('#li_user_name_upline_edit_member').hide();
									$$('#li_user_name_posisi_edit_member').hide();
								}
								$$('#username_edit_member').val(x[0]['username']);
								$$('#user_name_edit_member').val(x[0]['user_name']);
								$$('#user_email_edit_member').val(x[0]['user_email']);
								$$('#user_phone_edit_member').val(x[0]['user_phone']);
								$$('#user_address_edit_member').val(x[0]['user_address']);

								app.request({
									method: "POST",
									url: database_connect + "bank/select_bank.php", data:{ },
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x2 = obj['data'];
											determinateLoading = false;
											app.dialog.close();
											for(var i = 0; i < x2.length; i++) {
												if(x[0]['bank_id'] == x2[i]['bank_id']) {
													$$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `" selected>` + x2[i]['bank_name'] + `</option>`);
												} else {
													$$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `">` + x2[i]['bank_name'] + `</option>`);
												}
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
										var toastBottom = app.toast.edit({
											text: ERRNC,
											closeTimeout: 2000,
										});
										toastBottom.open();
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									}
								});

								$$('#user_account_name_edit_member').val(x[0]['user_account_name']);
								$$('#user_account_number_edit_member').val(x[0]['user_account_number']);
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

					if(localStorage.user_type != "Admin") {
						$$('.menu_admin').hide();
					}

					$$('#btneditmember').on('click', function() {
						var username = $$('#username_edit_member').val();
						var user_name = $$('#user_name_edit_member').val();
						var user_email = $$('#user_email_edit_member').val();
						var user_phone = $$('#user_phone_edit_member').val();
						var user_address = $$('#user_address_edit_member').val();
						var user_password = $$('#user_edit_password_member').val();
						var bank_id = $$('#bank_id_edit_member').val();
						var user_account_name = $$('#user_account_name_edit_member').val();
						var user_account_number = $$('#user_account_number_edit_member').val();
						if(username == "") {
							app.dialog.alert("Username tidak boleh kosong!");
						} else if(user_name == "") {
							app.dialog.alert("Nama tidak boleh kosong!");
						} else if(user_email == "") {
							app.dialog.alert("Email tidak boleh kosong!");
						} else if(user_phone == "") {
							app.dialog.alert("Telepon tidak boleh kosong!");
						} else if(user_address == "") {
							app.dialog.alert("Alamat tidak boleh kosong!");
						} else if(user_account_name == "") {
							app.dialog.alert("Nama pemilik rekening tidak boleh kosong!");
						} else if(user_account_number == "") {
							app.dialog.alert("Nomor rekening tidak boleh kosong!");
						} else {
							loading();
							
							app.request({
								method: "POST",
								url: database_connect + "users/update_users.php",
									data:{
									username: username,
									user_name: user_name,
									user_email: user_email,
									user_phone: user_phone,
									user_address: user_address,
									user_password: user_password,
									bank_id: bank_id,
									user_account_name: user_account_name,
									user_account_number: user_account_number
								},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var x = obj['data'];
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(x, 'Notifikasi', function(){
											page.router.navigate('/show_member/' + username);
										});
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
						}
					});
				},
			},
		},
		// EDIT MEMBER PASSWORD
		{
			path: '/edit_member_password/:username',
			url: 'pages/feature/edit_member_password.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;

					$$('#btneditmember').on('click', function() {
						var user_new_password = $$('#user_edit_new_password_member').val();
						var user_confirm_new_password = $$('#user_edit_confirm_new_password_member').val();
						if (user_new_password == user_confirm_new_password) {
							loading();
							app.request({
								method: "POST",
								url: database_connect + "users/update_users_password.php",
									data:{
									username: x,
									user_password: user_new_password,
								},
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										var x = obj['data'];
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert(x, 'Notifikasi', function(){
											page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
										});
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
						}
						else {
							app.dialog.alert('Password dan konfirmasi password tidak sama!');
						}
					});
				},
			},
		},
		// LIST BANK
		{
			path: '/list_bank/',
			url: 'pages/feature/list_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();
					app.request({
						method: "GET",
						url: database_connect + "bank/select_bank.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#listbank').append(`
										<li>
								      <div class="item-content">
								        <div class="item-inner">
								          <div class="item-title-row">
								            <div class="item-title">` + x[i]['bank_name'] + `</div>
								            <div class="item-subtitle">
								            	<a class="link" href="/edit_bank/` + x[i]['bank_id'] + `">Ubah</a> |
								            	<a class="link color-red delete_bank" data-id="` + x[i]['bank_id'] + `">Hapus</a>
								            </div>
								          </div>
								        </div>
								      </div>
								    </li>
									`);
								}

								$$('.delete_bank').on('click', function () {
                  var id = $$(this).data('id');
                  app.dialog.confirm("Apakah Anda yakin untuk menghapus bank ini?",function(){
                    loading();
                    app.request({
                      method:"POST",
                      url:database_connect + "bank/delete_bank.php",
                      data:{
                        bank_id : id
                      },
                      success:function(data){
                        var obj = JSON.parse(data);
                        if(obj['status'] == true) {
                          var x = obj['data'];
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(x,'Notifikasi',function(){
                            mainView.router.refreshPage();
                          });
                        }
                        else {
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(obj['message']);
                        }
                      },
                      error:function(data){
                        determinateLoading = false;
                        app.dialog.close();
                        var toastBottom = app.toast.create({
                          text: ERRNC,
                          closeTimeout: 2000,
                        });
                        toastBottom.open();
                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                      }
                    });
                  });
                });
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
				},
			},
		},
		// CREATE BANK
		{
			path: '/create_bank/',
			url: 'pages/feature/create_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					$$('#btncreatebank').on('click', function() {
						loading();

						var bank_name = $$('#bank_name_create_bank').val();
						app.request({
							method: "POST",
							url: database_connect + "bank/insert_bank.php",
								data:{
								bank_name: bank_name
							},
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										page.router.navigate('/list_bank/');
									});
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
				},
			},
		},
		// EDIT BANK
		{
			path: '/edit_bank/:bank_id',
			url: 'pages/feature/edit_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.bank_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "bank/show_bank.php", data:{ bank_id : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#bank_name_edit_bank').val(x[0]['bank_name']);
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

					$$('#btneditbank').on('click', function() {
						showDeterminate(true);
						determinateLoading = false;
						function showDeterminate(inline)
						{
						determinateLoading = true;
						var progressBarEl;
						if (inline) {
							progressBarEl = app.dialog.progress();
						} else {
							progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
						}
						function simulateLoading() {
							setTimeout(function () {
							simulateLoading();
							}, Math.random() * 300 + 300);
						}
						simulateLoading();
						}
						var bank_name = $$('#bank_name_edit_bank').val();
						app.request({
							method: "POST",
							url: database_connect + "bank/update_bank.php",
								data:{
								bank_id: x,
								bank_name: bank_name
							},
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										page.router.navigate('/list_bank/');
									});
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
				},
			},
		},
		// LIST COMPANY ACCOUNT
		{
			path: '/list_company_account/',
			url: 'pages/feature/list_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "GET",
						url: database_connect + "company_account/select_company_account.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#listcompanyaccount').append(`
										<li>
								      <div class="item-content">
								        <div class="item-inner">
								          <div class="item-title-row">
								            <div class="item-title">Bank ` + x[i]['bank_name'] + `<br>A/N ` +
								            	x[i]['company_account_name'] + `<br>` +
								            	x[i]['company_account_number'] + `</div>
								            <div class="item-subtitle">
								            	<a class="link" href="/edit_company_account/` + x[i]['company_account_id'] + `">Ubah</a> |
								            	<a class="link color-red delete_company_account" data-id="` + x[i]['company_account_id'] + `">Hapus</a>
								            </div>
								          </div>
								        </div>
								      </div>
								    </li>
									`);
								}

								$$('.delete_company_account').on('click', function () {
                  var id = $$(this).data('id');
                  app.dialog.confirm("Apakah Anda yakin untuk menghapus akun bank ini?",function(){
                    loading();

                    app.request({
                      method:"POST",
                      url:database_connect + "company_account/delete_company_account.php",
                      data:{
                        company_account_id : id
                      },
                      success:function(data){
                        var obj = JSON.parse(data);
                        if(obj['status'] == true) {
                          var x = obj['data'];
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(x,'Notifikasi',function(){
                            mainView.router.refreshPage();
                          });
                        }
                        else {
                          determinateLoading = false;
                          app.dialog.close();
                          app.dialog.alert(obj['message']);
                        }
                      },
                      error:function(data){
                        determinateLoading = false;
                        app.dialog.close();
                        var toastBottom = app.toast.create({
                          text: ERRNC,
                          closeTimeout: 2000,
                        });
                        toastBottom.open();
                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                      }
                    });
                  });
                });
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
				},
			},
		},
		// CREATE COMPANY ACCOUNT
		{
			path: '/create_company_account/',
			url: 'pages/feature/create_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "bank/select_bank.php", data:{ },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									$$('#bank_id_create_company_account').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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

					$$('#btncreatecompanyaccount').on('click', function() {
						loading();

						var bank_id = $$('#bank_id_create_company_account').val();
						var company_account_name = $$('#company_account_name_create_company_account').val();
						var company_account_number = $$('#company_account_number_create_company_account').val();
						app.request({
							method: "POST",
							url: database_connect + "company_account/insert_company_account.php",
								data:{
								bank_id: bank_id,
								company_account_name: company_account_name,
								company_account_number: company_account_number
							},
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										page.router.navigate('/list_company_account/');
									});
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
				},
			},
		},
		// EDIT COMPANY ACCOUNT
		{
			path: '/edit_company_account/:company_account_id',
			url: 'pages/feature/edit_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.company_account_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "company_account/show_company_account.php", data:{ company_account_id : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#company_account_name_edit_company_account').val(x[0]['company_account_name']);
								$$('#company_account_number_edit_company_account').val(x[0]['company_account_number']);

								app.request({
									method: "POST",
									url: database_connect + "bank/select_bank.php", data:{ },
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x2 = obj['data'];
											determinateLoading = false;
											app.dialog.close();
											for(var i = 0; i < x2.length; i++) {
												if(x[0]['bank_id'] == x2[i]['bank_id']) {
													$$('#bank_id_edit_company_account').append(`<option value="` + x2[i]['bank_id'] + `" selected>` +
														x2[i]['bank_name'] + `</option>`);
												} else {
													$$('#bank_id_edit_company_account').append(`<option value="` + x2[i]['bank_id'] + `">` +
														x2[i]['bank_name'] + `</option>`);
												}
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
										var toastBottom = app.toast.edit({
											text: ERRNC,
											closeTimeout: 2000,
										});
										toastBottom.open();
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									}
								});
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

					$$('#btneditcompanyaccount').on('click', function() {
						loading();

						var bank_id = $$('#bank_id_edit_company_account').val();
						var company_account_name = $$('#company_account_name_edit_company_account').val();
						var company_account_number = $$('#company_account_number_edit_company_account').val();
						app.request({
							method: "POST",
							url: database_connect + "company_account/update_company_account.php",
								data:{
								company_account_id: x,
								bank_id: bank_id,
								company_account_name: company_account_name,
								company_account_number: company_account_number
							},
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										page.router.navigate('/list_company_account/');
									});
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
				},
			},
		},
		// LIST PRODUCT ADMIN
		{
			path: '/list_product_admin/:category',
			url: 'pages/feature/list_product_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					var category = page.router.currentRoute.params.category;
					loading();

					var url = "digiflazz/price_list.php";
					if(category == "Pascabayar") {
						url = "digiflazz/price_list_pasca.php";
					}

					app.request({
						method: "GET",
						url: database_connect + url, data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							if(x.length > 0) {
								determinateLoading = false;
								app.dialog.close();
								var arrProduct = new Array();
								for(var i = 0; i < x.length; i++) {
									if(x[i]['category'] == category) {
										if(arrProduct.length == 0) {
											arrProduct.push(x[i]['brand']);
											$$('#listproductadmin').append(`
												<div style="float: left; width: 100%;">
													<a href="/list_product_detail_admin/` + category + `/` + x[i]['brand'] +
														`" style="">
														<div class="card">
															<div class="card-content card-content-padding">
																<span>` + x[i]['brand'].toUpperCase() + `</span>
															</div>
														</div>
													</a>
												</div>
											`);
										} else {
											var available = false;
											for(var j = 0; j < arrProduct.length; j++) {
												if(arrProduct[j] == x[i]['brand']) {
													available = true;
													break;
												}
											}

											if(available == false) {
												arrProduct.push(x[i]['brand']);
												$$('#listproductadmin').append(`
													<div style="float: left; width: 100%;">
														<a href="/list_product_detail_admin/` + category + `/` + x[i]['brand'] +
															`" style="">
															<div class="card">
																<div class="card-content card-content-padding">
																	<span>` + x[i]['brand'].toUpperCase() + `</span>
																</div>
															</div>
														</a>
													</div>
												`);
											}
										}
									}
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert('Tidak ada produk');
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
				},
			},
		},
		// LIST PRODUCT DETAIL ADMIN
		{
			path: '/list_product_detail_admin/:category/:brand',
			url: 'pages/feature/list_product_detail_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					var category = page.router.currentRoute.params.category;
					var brand = page.router.currentRoute.params.brand;
					$$('#headerproductdetailadmin').html(category.toUpperCase() + " " + brand.toUpperCase());
					loading();

					var url = "digiflazz/price_list.php";
					if(category == "Pascabayar") {
						url = "digiflazz/price_list_pasca.php";
					}

					app.request({
						method: "GET",
						url: database_connect + url, data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							var x_price_list = obj['data']['data'];
							var x_profit = obj['profit'];
							if(x_price_list.length > 0) {
								for(var i = 0; i < x_price_list.length; i++) {
									if(x_price_list[i]['category'] == category && x_price_list[i]['brand'] == brand) {
										var status = "Ditampilkan";
										if(x_price_list[i]['buyer_product_status'] == false) {
											status = "Disembunyikan";
										}

										var product_name = x_price_list[i]['product_name'];
										var price = "";
										if(category != "Pascabayar") {
											price = formatRupiah(x_price_list[i]['price']) + "<br>";
										}
										var seller_name = x_price_list[i]['seller_name']  + "<br>";
										var buyer_sku_code = x_price_list[i]['buyer_sku_code'];

										var a_selected = "";
										var b_selected = "";
										var c_selected = "";
										var d_selected = "";
										var e_selected = "";

										if(x_profit[i]['profit_id'] == 1) {
											a_selected = "checked";
										} else if(x_profit[i]['profit_id'] == 2) {
											b_selected = "checked";
										} else if(x_profit[i]['profit_id'] == 3) {
											c_selected = "checked";
										} else if(x_profit[i]['profit_id'] == 4) {
											d_selected = "checked";
										} else if(x_profit[i]['profit_id'] == 5) {
											e_selected = "checked";
										}

		              	$$('#listproductdetailadmin').append(`
			              	<div style="float: left; width: 100%;">
			               		<div class="card">
			                		<div class="card-content card-content-padding">
					                 	<span>` + product_name + `</span><span style="float: right;">` + status + `</span><br>
					                 	<span>` + price + `</span>
					                 	<span>` + seller_name + `</span>
					                 	<span>
						                	<input type="radio" ` +a_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="1" data-value="1"> A
						                  	<input type="radio" ` +b_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="2" data-value="2"> B
						                  	<input type="radio" ` +c_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="3" data-value="3"> C
						                  	<input type="radio" ` +d_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="4" data-value="4"> D
			                  				<input type="radio" ` +e_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="5" data-value="5"> E
			                			</span>
			                		</div>
			               		</div>
			              	</div>
		            		`);

						        $$('.pulsa_profit').on('click', function () {
	                  	var id = $$(this).data('id');
	                  	var value = $$(this).data('value');
	                  	app.request({
	                     	method:"POST",
                      	url:database_connect + "product_profit/update_product_profit.php",
                      	data:{
                        	product_id : id,
                        	profit_id : value
                      	},
                      	success:function(data){
	                        var obj = JSON.parse(data);
	                        if(obj['status'] == true) {
	                          	var x = obj['data'];
	                          	determinateLoading = false;
	                          	app.dialog.close();
	                        } else {
	                          	determinateLoading = false;
	                          	app.dialog.close();
	                          	app.dialog.alert(obj['message']);
	                        }
                      	},
                      	error:function(data){
	                        determinateLoading = false;
	                        app.dialog.close();
	                        var toastBottom = app.toast.create({
	                          	text: ERRNC,
	                          	closeTimeout: 2000,
	                        });
	                        toastBottom.open();
	                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                      	}
	                    });
		                });
									}
								}
								app.dialog.close();
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert('Tidak ada produk');
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
				},
			},
		},
		// LIST PRODUCT MEMBER
		{
			path: '/list_product_member/:category',
			url: 'pages/feature/list_product_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					var category = page.router.currentRoute.params.category;
					loading();

					var url = "digiflazz/price_list.php";
					if(category == "Pascabayar") {
						url = "digiflazz/price_list_pasca.php";
					}
					app.request({
						method: "GET",
						url: database_connect + url, data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							if(x.length > 0) {
								determinateLoading = false;
								app.dialog.close();
								var arrProduct = new Array();
								for(var i = 0; i < x.length; i++) {
									if(x[i]['category'] == category) {
										if(arrProduct.length == 0) {
											arrProduct.push(x[i]['brand']);
											$$('#listproductmember').append(`
												<div style="float: left; width: 100%;">
													<a href="/list_product_detail_member/` + category + `/` + x[i]['brand'] +
														`" style="">
														<div class="card">
															<div class="card-content card-content-padding">
																<span>` + x[i]['brand'].toUpperCase() + `</span>
															</div>
														</div>
													</a>
												</div>
											`);
										} else {
											var available = false;
											for(var j = 0; j < arrProduct.length; j++) {
												if(arrProduct[j] == x[i]['brand']) {
													available = true;
													break;
												}
											}

											if(available == false) {
												arrProduct.push(x[i]['brand']);
												$$('#listproductmember').append(`
													<div style="float: left; width: 100%;">
														<a href="/list_product_detail_member/` + category + `/` + x[i]['brand'] +
															`" style="">
															<div class="card">
																<div class="card-content card-content-padding">
																	<span>` + x[i]['brand'].toUpperCase() + `</span>
																</div>
															</div>
														</a>
													</div>
												`);
											}
										}
									}
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert('Tidak ada produk');
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
				},
			},
		},
		// LIST PRODUCT DETAIL MEMBER
		{
			path: '/list_product_detail_member/:category/:brand',
			url: 'pages/feature/list_product_detail_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					var category = page.router.currentRoute.params.category;
					var brand = page.router.currentRoute.params.brand;
					$$('#headerproductdetailmember').html(category.toUpperCase() + " " + brand.toUpperCase());
					loading();

					var url = "digiflazz/price_list.php";
					if(category == "Pascabayar") {
						url = "digiflazz/price_list_pasca.php";
					}

					app.request({
						method: "GET",
						url: database_connect + url, data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							var x_profit = obj['profit'];
							if(x.length > 0) {
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									if(x[i]['category'] == category && x[i]['brand'] == brand) {
										var harga = "";
										var url_checkout = "/checkout_pasca/";
										if(category != "Pascabayar") {
											harga = formatRupiah(parseInt(x_profit[i]['profit_value']) + parseInt(x[i]['price']));
											url_checkout = "/checkout/";
										}
										$$('#listproductdetailmember').append(`
											<div style="float: left; width: 100%;">
												<a href="` + url_checkout + x[i]['buyer_sku_code'] + `" style="">
													<div class="card">
														<div class="card-content card-content-padding">
															<span>` + x[i]['product_name'] + `</span><br>
															<span>` + harga + `</span>
														</div>
													</div>
												</a>
											</div>
										`);
									}
								}
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert('Tidak ada produk');
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
				},
			},
		},
		// CHECKOUT PRABAYAR
		{
			path: '/checkout/:buyer_sku_code',
			url: 'pages/feature/checkout.html',
			on:
			{
				pageInit:function(e,page)
				{
					var buyer_sku_code = page.router.currentRoute.params.buyer_sku_code;
					$$('#btn_checkout').hide();
					$$('#checkout_detail').hide();
					loading();

					app.request({
						method: "GET",
						url: database_connect + "digiflazz/price_list.php", data:{  },
						success: function(data) {
							var tagihan = 0;
							var saldo = 0;
							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							var x_profit = obj['profit'];
							if(x.length > 0) {
								for(var i = 0; i < x.length; i++) {
									if(x[i]['buyer_sku_code'] == buyer_sku_code) {
										$$('#product_checkout').append(`
											<div>
												<span>` + x[i]['product_name'] + `</span><br>
												<span>` + formatRupiah((parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']))) + `</span>
											</div>
										`);
										tagihan = parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']);
										$$('#tagihan_checkout').html(formatRupiah((parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']))));
										break;
									}
								}

								app.request({
									method: "POST",
									url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
									success: function(data) {
										var obj_show_user = JSON.parse(data);
										if(obj_show_user['status'] == true) {
											var x_show_user = obj_show_user['data'];
											determinateLoading = false;
											app.dialog.close();
											if(localStorage.user_type == "Admin") {
												app.request({
													method: "GET",
													url: database_connect + "digiflazz/cek_saldo.php", data:{  },
													success: function(data) {
														var obj_show_user_admin = JSON.parse(data);
														$$('#saldo_checkout').html(formatRupiah(obj_show_user_admin['data']['deposit']));
														saldo = obj_show_user_admin['data']['deposit'];
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
											} else {
												$$('#saldo_checkout').html(formatRupiah(x_show_user[0]['user_balance_a']));
												saldo = x_show_user[0]['user_balance_a'];
											}

											$$('#checkout_detail').show();
											$$('#btn_checkout').show();
											var total = saldo - tagihan;
											if(total > 0) {
												$$('#total_checkout').html('<div style="color:green;">Anda dapat melakukan transaksi!</div>');
												$$('#btn_checkout').removeClass('disabled');
											} else {
												$$('#total_checkout').html('<div style="color:red;">Saldo and kurang. Anda tidak dapat melakukan transaksi!</div>');
											}
										} else {
											determinateLoading = false;
											app.dialog.close();
											app.dialog.alert(obj_show_user['message']);
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

								$$('#btn_checkout').on('click', function() {
									var customer_no = $$('#customer_no_checkout').val();
									var user_password = $$('#password_checkout').val();
									if(customer_no == "") {
										app.dialog.alert("Nomor telepon atau token tidak boleh kosong!");
									} else if(user_password == "") {
										app.dialog.alert("Kata sandi tidak boleh kosong!");
									} else {
										app.request.post(database_connect + "login.php", { username : localStorage.username, user_password : user_password }, function(data) {
											var obj = JSON.parse(data);
											if(obj['status'] == true) {
												app.dialog.confirm("Apakah Anda yakin untuk memproses transaksi ini?",function(){
													loading();

													app.request({
														method: "POST",
														url: database_connect + "digiflazz/buy_product.php",
															data:{
															transaction_price : tagihan,
															username : localStorage.username,
															customer_no : customer_no,
															product_id : buyer_sku_code
														},
														success: function(data) {
															var obj = JSON.parse(data);
															if(obj['status'] == true) {
																var x = obj['data'];
																determinateLoading = false;
																app.dialog.close();
																app.dialog.alert(x, 'Notifikasi', function(){
																	page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
																});
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
											} else {
												app.dialog.alert("Kata sandi yang Anda masukkan salah!");
											}
										});
									}
								});
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert('Tidak ada produk');
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
				},
			},
		},
		// CHECKOUT PASCABAYAR
		{
			path: '/checkout_pasca/:buyer_sku_code',
			url: 'pages/feature/checkout_pasca.html',
			on:
			{
				pageInit:function(e,page)
				{
					var buyer_sku_code = page.router.currentRoute.params.buyer_sku_code;
					loading();

					app.request({
						method: "GET",
						url: database_connect + "digiflazz/price_list_pasca.php", data:{  },
						success: function(data) {
							determinateLoading = false;
							app.dialog.close();

							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							var x_profit = obj['profit'];
							var name = "";
							var profit = 0;
							if(x.length > 0) {
								for(var i = 0; i < x.length; i++) {
									if(x[i]['buyer_sku_code'] == buyer_sku_code) {
										name = x[i]['product_name'];
										profit = x_profit[i]['profit_value'];
										$$('#product_checkout_pasca').append(`<div><span>` + name + `</span></div>`);
										break;
									}
								}
							}

							$$('#btn_checkbill_pasca').on('click', function() {
								var customer_code = $$('#customer_code_checkout_pasca').val();
								if(customer_code == "") {
									app.dialog.alert("Kode pelanggan tidak boleh kosong!");
								} else {
									loading();

									app.request({
										method: "POST",
										url: database_connect + "digiflazz/insert_pascabayar.php",
											data:{
											username : localStorage.username,
											customer_code : customer_code,
											product_id : buyer_sku_code,
											product_name : name
										},
										success: function(data) {
											var obj = JSON.parse(data);
											if(obj['status'] == true) {
												determinateLoading = false;
												app.dialog.close();
												var x = obj['data'];
												page.router.navigate('/checkout_pasca_detail/' + x);
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
								}
							});
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
				},
			},
		},
		// CHECKOUT DETAIL PASCABAYAR
		{
			path: '/checkout_pasca_detail/:transaction_id',
			url: 'pages/feature/checkout_pasca_detail.html',
			on:
			{
				pageInit:function(e,page)
				{
					var transaction_id = page.router.currentRoute.params.transaction_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "digiflazz/check_bill.php", data:{ transaction_id : transaction_id },
						success: function(data) {
							determinateLoading = false;
							app.dialog.close();

							var obj = JSON.parse(data);
							var x = obj['data'];
							var x_transaction = obj['transaction'];

							if(x_transaction[0]['transaction_status'] == "Process") {
								$$('#btn_back_show_checkout_detail').hide();
								$$('#btn_yes_show_checkout_detail').show();
								$$('#btn_no_show_checkout_detail').show();
							} else {
								$$('#btn_back_show_checkout_detail').show();
								$$('#btn_yes_show_checkout_detail').hide();
								$$('#btn_no_show_checkout_detail').hide();
							}

							if(x['Ref ID'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Ref ID </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Ref ID'][0] + `</div>`);
							}

							if(x['Kode Pelanggan'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Kode Pelanggan </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Kode Pelanggan'][0] + `</div>`);
							}

							if(x['Nama Pelanggan'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nama Pelanggan </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Nama Pelanggan'][0] + `</div>`);
							}

							if(x['Tarif'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Tarif </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Tarif'][0] + `</div>`);
							}

							if(x['Daya'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Daya </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Daya'][0] + `</div>`);
							}

							if(x['Alamat'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Alamat </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Alamat'][0] + `</div>`);
							}

							if(x['Jatuh Tempo'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Jatuh Tempo </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Jatuh Tempo'][0] + `</div>`);
							}

							if(x['Jumlah Peserta'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Jumlah Peserta </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Jumlah Peserta'][0] + ` ORANG</div>`);
							}

							if(x['Nama Barang'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nama Barang </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Nama Barang'][0] + `</div>`);
							}

							if(x['No Rangka'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> No Rangka </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['No Rangka'][0] + `</div>`);
							}

							if(x['No Pol'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> No Pol </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['No Pol'][0] + `</div>`);
							}

							if(x['Tenor'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Tenor </b></div>` +
									`<div class="col-50" style="text-align: right;">` + x['Tenor'][0] + `</div>`);
							}

							$$('#contentcheckoutdetail').append(`<br><br>`);
							for(var i = 0; i < parseInt(x['Lembar Tagihan'][0]); i++) {
								if(x['Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Periode </b></div>` +
										`<div class="col-50" style="text-align: right;">` + x['Periode'][0] + `</div>`);
								}

								if(x['Nilai Tagihan Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nilai Tagihan </b></div>` +
										`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Nilai Tagihan Periode'][0]) + `</div>`);
								}

								if(x['Meter Awal Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Meter Awal </b></div>` +
										`<div class="col-50" style="text-align: right;">` + x['Meter Awal Periode'][0] + `</div>`);
								}

								if(x['Meter Akhir Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Meter Akhir </b></div>` +
										`<div class="col-50" style="text-align: right;">` + x['Meter Akhir Periode'][0] + `</div>`);
								}

								if(x['Denda Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Denda </b></div>` +
										`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Denda Periode'][0]) + `</div>`);
								}

								if(x['Biaya Admin Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Biaya Admin </b></div>` +
										`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Biaya Admin Periode'][0]) + `</div>`);
								}

								if(x['Biaya Lain Periode'] !== undefined) {
									$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Biaya Lain Periode </b></div>` +
										`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Biaya Lain Periode'][0]) + `</div>`);
								}

								$$('#contentcheckoutdetail').append(`<br><br>`);
							}

							if(x['Total Biaya Admin'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Total Biaya Admin </b></div>` +
									`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Total Biaya Admin'][0]) + `</div>`);
							}

							if(x['Total Tagihan'] !== undefined) {
								$$('#contentcheckoutdetail').append(`<div class="col-50"><b> Total Tagihan </b></div>` +
									`<div class="col-50" style="text-align: right;">` + formatRupiah(x['Total Tagihan'][0]) + `</div>`);
							}

							if(parseInt(x['Total Tagihan'][0]) > parseInt(localStorage.user_balance_a)) {
								$$('#contentcheckoutdetail').append(`<span style="color: red;">Saldo Anda tidak cukup!</span>`);
								$$('#btn_yes_show_checkout_detail').addClass("disabled");
							}

							$$('#btn_yes_show_checkout_detail').on('click', function() {
								var user_password = $$('#password_checkout_detail').val();
								if(user_password == "") {
									app.dialog.alert("Kata sandi tidak boleh kosong!");
								} else {
									app.request.post(database_connect + "login.php", { username : localStorage.username, user_password : user_password }, function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											app.dialog.confirm("Apakah Anda yakin untuk memproses pembayaran ini?", function() {
												app.request({
													method: "POST",
													url: database_connect + "digiflazz/pay_pascabayar.php", 
														data:{ 
															buyer_sku_code : x['Buyer SKU Code'][0],
															ref_id : x['Ref ID'][0],
															customer_no : x['Kode Pelanggan'][0],
															transaction_price : x['Total Tagihan'][0],
															username : localStorage.username,
															transaction_id : transaction_id
														},
													success: function(data) {
														var obj = JSON.parse(data);
														if(obj['status'] == true) {
															var x = obj['data'];
															determinateLoading = false;
															app.dialog.close();
															app.dialog.alert("Transaksi diproses!");
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
												page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
											});
										} else {
											app.dialog.alert("Kata sandi yang Anda masukkan salah!");
										}
									});
								}
							});
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

					$$('#btn_back_show_checkout_detail').on('click', function() {
						page.router.navigate('/home/');
					});					

					$$('#btn_no_show_checkout_detail').on('click', function() {
						app.dialog.confirm("Apakah Anda yakin untuk membatalkan pembayaran ini?", function() {
							app.request({
								method: "POST",
								url: database_connect + "digiflazz/delete_pascabayar.php", data:{ transaction_id : transaction_id },
								success: function(data) {
									var obj = JSON.parse(data);
									if(obj['status'] == true) {
										determinateLoading = false;
										app.dialog.close();
										app.dialog.alert("Transaksi dibatalkan!");
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
							page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
						});
					});
				},
			},
		},
		// DEPOSIT PIN
		{
			path: '/deposit_pin/',
			url: 'pages/feature/deposit_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
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
								$$('#bank_id_deposit_pin').append(`<option value="">-- Pilih Bank --</option>`);
								for(var i = 0; i < x.length; i++) {
									$$('#bank_id_deposit_pin').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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

					$$('.pin_type_deposit_pin').on('click', function () {
						var pin_type = $$(this).data('type');
						$$('.warning_select_pin').hide();
						$$('#btn_request_pin').on('click', function() {
							var count = $$('#count_pin').val();
							var bank_id = $$('#bank_id_deposit_pin').val();
							if(count < 1 || count == "") {
								app.dialog.alert("Minimum order pin adalah sebanyak 1 pin!");
							} else if(bank_id == "") {
								app.dialog.alert("Silahkan pilih bank tujuan terlebih dahulu!");
							} else {
								loading();

								app.request({
									method: "POST",
									url: database_connect + "pin/request_pin.php", data:{ username:localStorage.username, count:count, bank_id:bank_id, pin_type:pin_type },
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x = obj['data'];
											determinateLoading = false;
											app.dialog.close();
											page.router.navigate('/show_deposit_pin/' + x,{ force: true, ignoreCache: true });
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
										page.router.navigate('/history_pin/',{ force: true, ignoreCache: true });
									}
								});
							}
						});
					});
				},
			},
		},
		// SHOW DEPOSIT PIN
		{
			path: '/show_deposit_pin/:request_pin_id',
			url: 'pages/feature/show_deposit_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.request_pin_id;
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/show_deposit_pin.php", data:{ request_pin_id : x },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								var x_account = obj['data_account'];
								determinateLoading = false;
								app.dialog.close();

								var total = 0;
								if(x[0]['request_pin_type'] == "Basic") {
									total = formatRupiah(((parseInt(x[0]['request_pin_count']) * 50000)) + parseInt(x[0]['request_pin_unique']));
									$$('#harga_deposit_pin').html("IDR 50.000");
								} else {
									total = formatRupiah(((parseInt(x[0]['request_pin_count']) * 300000)) + parseInt(x[0]['request_pin_unique']));
									$$('#harga_deposit_pin').html("IDR 300.000");
								}
								$$('#tipe_deposit_pin').html(x[0]['request_pin_type']);
								$$('#jumlah_deposit_pin').html(x[0]['request_pin_count']);
								$$('#kode_unik_deposit_pin').html(x[0]['request_pin_unique']);
								$$('#total_deposit_pin').html(total);

								$$('#bank_tujuan_deposit_pin').html(x_account[0]['bank_name']);
								$$('#nama_pemilik_rekening_deposit_pin').html(x_account[0]['company_account_name']);
								$$('#nomor_rekening_deposit_pin').html(x_account[0]['company_account_number']);

								if(x[0]['request_pin_status'] == 2) {
									$$('#btn_back_show_deposit_pin').hide();
								} else {
									$$('#btn_yes_show_deposit_pin').hide();
									$$('#btn_no_show_deposit_pin').hide();
								}

								$$('#btn_back_show_deposit_pin').on('click', function() {
									page.router.navigate('/history_pin/');
								});

								$$('#btn_yes_show_deposit_pin').on('click', function() {
									app.dialog.confirm("Apakah Anda yakin untuk memproses pembelian " + x[0]['request_pin_count'] + 
										" pin " + x[0]['request_pin_type'] + "?", function() {
										app.request({
											method: "POST",
											url: database_connect + "pin/member_accept_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
											success: function(data) {
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
													var x = obj['data'];
													determinateLoading = false;
													app.dialog.close();
													app.dialog.alert("Transaksi diproses!");
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
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								});

								$$('#btn_no_show_deposit_pin').on('click', function() {
									app.dialog.confirm("Apakah Anda yakin untuk membatalkan pembelian " + x[0]['request_pin_count'] + 
										" pin " + x[0]['request_pin_type'] + "?", function() {
										app.request({
											method: "POST",
											url: database_connect + "pin/member_decline_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
											success: function(data) {
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
													var x = obj['data'];
													determinateLoading = false;
													app.dialog.close();
													app.dialog.alert("Transaksi dibatalkan!");
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
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								});
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
				},
			},
		},
		// HISTORY PIN
		{
			path: '/history_pin/',
			url: 'pages/feature/history_pin.html',
			on:
			{
		    pageInit:function(e,page)
		    {
		      loading();

		      app.request({
		        method:"POST",
		        url:database_connect+"pin/select_request_pin_member.php", data:{ username : localStorage.username },
		        success:function(data){
		          var obj = JSON.parse(data);
		          if(obj['status'] == true) {
		            var x = obj['data'];
		            for(var i = 0; i < x.length; i++) {
		              var total = "";
		              if(x[0]['pin_type'] == "Basic") {
										total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
								  } else {
										total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
								  }

		              if(x[i]['status'] == 0 || x[i]['status'] == 2) {
		                $$('#history_pin').append(`
		                  <li>
		                    <div class="item-content">
		                      <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
		                        <img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
		                      </a>
		                      <div class="item-inner">
		                        <div class="item-title-row">
		                          <div class="item-title" style="">`+x[i]['username']+`</div>
		                          <div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark</i></span></div>
		                        </div>
		                        <div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
		                        <div class="item-subtitle" style="">`+total+`</div>
		                        <div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
		                      </div>
		                    </div>
		                  </li>
		                `);
		              } else {
		                $$('#history_pin').append(`
		                  <li>
		                    <div class="item-content">
		                      <a href="/show_deposit_pin/` + x[i]['id'] + `" class="item-media ">
		                        <img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
		                      </a>
		                      <div class="item-inner">
		                        <div class="item-title-row">
		                          <div class="item-title" style="">`+x[i]['username']+`</div>
		                          <div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark_fill</i></span></div>
		                        </div>
		                        <div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
		                        <div class="item-subtitle" style="">`+total+`</div>
		                        <div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
		                      </div>
		                    </div>
		                  </li>
		                `);
		              }
		            }
		            $$('.sw-accepted').on('click', function () {
		              var id = $$(this).data('id');
		              var count = $$(this).data('count');
		              loading();

		              for(var i = 0; i < count; i++) {
		                var suc = 0;
		                app.request({
		                  method: "POST",
		                  url: database_connect + "pin/generate_pin.php", data:{ username_sponsor:id },
		                  success: function(data) {
		                    var obj = JSON.parse(data);
		                    if(obj['status'] == true) {
		                      var x = obj['data'];
		                      suc++;
		                      if (suc==count) {
		                        app.request({
		                          method: "POST",
		                          url: database_connect + "pin/update_request_pin.php", data:{ username:id },
		                          success: function(data) {
		                            var obj = JSON.parse(data);
		                            if(obj['status'] == true) {
		                              var x = obj['data'];
		                              app.dialog.close();
		                              app.dialog.alert(x, 'Notifikasi', function(){
		                                mainView.router.refreshPage();
		                              });
		                            } else {
		                              $$('.sw-accepted').click();
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
		                            page.router.navigate('/deposit_pin/',{ force: true, ignoreCache: true });
		                          }
		                        });
		                      }
		                    } else {
		                      $$('.sw-accepted').click();
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
		                    page.router.navigate('/deposit_pin/',{ force: true, ignoreCache: true });
		                  }
		                });
		              }
		            });
		            determinateLoading = false;
		            app.dialog.close();
		          }
		          else {
		            determinateLoading = false;
		            app.dialog.close();
		            app.dialog.alert(obj['message'], 'Notifikasi', function(){
		              page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
		            });
		          }
		        },
		        error:function(data){
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
		    },
		  },
		},
		// LIST MY PIN
		{
			path: '/pin_pribadi/',
			url: 'pages/feature/pin_pribadi.html',
			on:
			{
				pageInit:function(e,page)
				{
					if(localStorage.user_type == "Member") {
						$$('#admin_generate_pin').hide();
					}
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/select_pin_by_user.php", data:{ username:localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var tmphsl ='';
								for(var i=0;i<x.length;i++)
								{
									if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
										tmphsl += `<tr>
											<td class="label-cell">` +x[i]['pin_value']+ `</td>
											<td class="label-cell">` +x[i]['pin_type']+ `</td>
											<td class="numeric-cell">-</td>
										</tr>`;
									} else {
										tmphsl += `<tr>
											<td class="label-cell">` +x[i]['pin_value']+ `</td>
											<td class="label-cell">` +x[i]['pin_type']+ `</td>
											<td class="numeric-cell">` +x[i]['username_member']+ `</td>
										</tr>`;
									}
								}

								$$('#pin_bribadi_user').append(`
									<div class="data-table card">
										<table>
											<thead>
												<tr>
													<th class="label-cell">Pin</th>
													<th class="numeric-cell">Type</th>
													<th class="numeric-cell">Member</th>
												</tr>
											</thead>
											<tbody>
												` +tmphsl+ `
											</tbody>
										</table>
									</div>
								`);
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi');
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

					$$('#btn_generate_pin_basic').on('click', function() {
						loading();

						app.request({
							method: "POST",
							url: database_connect + "pin/generate_pin_basic.php", data:{ username_sponsor:localStorage.username },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										mainView.router.refreshPage();
									});
								} else {
									$$('#btn_generate_pin_basic').click();
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

					$$('#btn_generate_pin_premium').on('click', function() {
						loading();

						app.request({
							method: "POST",
							url: database_connect + "pin/generate_pin_premium.php", data:{ username_sponsor:localStorage.username },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(x, 'Notifikasi', function(){
										mainView.router.refreshPage();
									});
								} else {
									$$('#btn_generate_pin_premium').click();
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
				},
			},
		},
		// LIST ALL PIN
		{
			path: '/list_pin/',
			url: 'pages/feature/list_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/find_pin.php", data:{ username : '', pin_type : 'Basic' },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								determinateLoading = false;
								app.dialog.close();
								var x = obj['data'];
								var tmphsl ='';
								for(var i = 0; i < x.length; i++) {
									if(x[i]['username_member']==null || x[i]['username_member']== "") {
										tmphsl += `
											<tr>
												<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
												<td class="label-cell">` +x[i]['pin_value']+ `</td>
												<td class="label-cell">` +x[i]['pin_type']+ `</td>
												<td class="numeric-cell">
													<a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
												</td>
											</tr>
										`;
									} else {
										tmphsl += `
											<tr>
												<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
												<td class="label-cell">` +x[i]['pin_value']+ `</td>
												<td class="label-cell">` +x[i]['pin_type']+ `</td>
												<td class="numeric-cell">` +x[i]['username_member']+ `</td>
											</tr>
										`;
									}
								}

								$$('#list_all_pin_user').append(`
									<div class="data-table card">
										<table>
											<thead>
												<tr>
													<th class="label-cell">Pemilik</th>
													<th class="label-cell">Pin</th>
													<th class="label-cell">Type</th>
													<th class="numeric-cell">Member</th>
												</tr>
											</thead>
											<tbody>
												` +tmphsl+ `
											</tbody>
										</table>
									</div>
								`);

								$$('.delete_pin').on('click', function () {
				                  var id = $$(this).data('id');
				                  app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
				                    loading();

				                    app.request({
				                      method:"POST",
				                      url:database_connect + "pin/delete_pin.php",
				                      data:{
				                        pin_id : id
				                      },
				                      success:function(data){
				                        var obj = JSON.parse(data);
				                        if(obj['status'] == true) {
				                          var x = obj['data'];
				                          determinateLoading = false;
				                          app.dialog.close();
				                          app.dialog.alert(x,'Notifikasi',function(){
				                            mainView.router.refreshPage();
				                          });
				                        }
				                        else {
				                          determinateLoading = false;
				                          app.dialog.close();
				                          app.dialog.alert(obj['message']);
				                        }
				                      },
				                      error:function(data){
				                        determinateLoading = false;
				                        app.dialog.close();
				                        var toastBottom = app.toast.create({
				                          text: ERRNC,
				                          closeTimeout: 2000,
				                        });
				                        toastBottom.open();
				                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
				                      }
				                    });
				                  });
				                });
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi', function(){
									page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
								});
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

					$$('#pin_type_overall_selection').on('change', function () {
						var username = $$('#txtsearchpin').val();
						var search = $$('#pin_type_overall_selection').val();
						app.request({
							method: "POST",
							url: database_connect + "pin/find_pin.php", data:{ username : username, pin_type : search },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									$$('#list_all_pin_user').html('');
									determinateLoading = false;
									app.dialog.close();
									var tmphsl ='';
									for(var i = 0; i < x.length; i++) {
										if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
											tmphsl += `
												<tr>
													<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
													<td class="label-cell">` +x[i]['pin_value']+ `</td>
													<td class="label-cell">` +x[i]['pin_type']+ `</td>
													<td class="numeric-cell">
														<a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
													</td>
												</tr>
											`;
										} else {
											tmphsl += `
												<tr>
													<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
													<td class="label-cell">` +x[i]['pin_value']+ `</td>
													<td class="label-cell">` +x[i]['pin_type']+ `</td>
													<td class="numeric-cell">` +x[i]['username_member']+ `</td>
												</tr>
											`;
										}
									}
	
									$$('#list_all_pin_user').append(`
										<div class="data-table card">
											<table>
												<thead>
													<tr>
														<th class="label-cell">Pemilik</th>
														<th class="label-cell">Pin</th>
														<th class="label-cell">Type</th>
														<th class="numeric-cell">Member</th>
													</tr>
												</thead>
												<tbody>
													` +tmphsl+ `
												</tbody>
											</table>
										</div>
									`);
	
									$$('.delete_pin').on('click', function () {
									  var id = $$(this).data('id');
									  app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
											loading();

											app.request({
											  method:"POST",
											  url:database_connect + "pin/delete_pin.php", data:{ pin_id : id },
											  success:function(data){
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
												  var x = obj['data'];
												  determinateLoading = false;
												  app.dialog.close();
												  app.dialog.alert(x,'Notifikasi',function(){
													mainView.router.refreshPage();
												  });
												} else {
												  determinateLoading = false;
												  app.dialog.close();
												  app.dialog.alert(obj['message']);
												}
											  },
											  error:function(data){
												determinateLoading = false;
												app.dialog.close();
												var toastBottom = app.toast.create({
												  text: ERRNC,
												  closeTimeout: 2000,
												});
												toastBottom.open();
												page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
											  }
											});
									  });
									});
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'], 'Notifikasi', function(){
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
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

					$$('#txtsearchpin').on('keyup', function() {
						var username = $$('#txtsearchpin').val();
						var search = $$('#pin_type_overall_selection').val();
						app.request({
							method: "POST",
							url: database_connect + "pin/find_pin.php", data:{ username : username, pin_type : search },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									determinateLoading = false;
									app.dialog.close();
									$$('#list_all_pin_user').html(``);
									var x = obj['data'];
									var tmphsl ='';
									for(var i = 0; i < x.length; i++) {
										if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
											tmphsl += `
												<tr>
													<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
													<td class="label-cell">` +x[i]['pin_value']+ `</td>
													<td class="label-cell">` +x[i]['pin_type']+ `</td>
													<td class="numeric-cell">
														<a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
													</td>
												</tr>
											`;
										} else {
											tmphsl += `
												<tr>
													<td class="label-cell">` +x[i]['username_sponsor']+ `</td>
													<td class="label-cell">` +x[i]['pin_value']+ `</td>
													<td class="label-cell">` +x[i]['pin_type']+ `</td>
													<td class="numeric-cell">` +x[i]['username_member']+ `</td>
												</tr>
											`;
										}
									}

									$$('#list_all_pin_user').append(`
										<div class="data-table card">
											<table>
												<thead>
													<tr>
														<th class="label-cell">Pemilik</th>
														<th class="label-cell">Pin</th>
														<th class="label-cell">Type</th>
														<th class="numeric-cell">Member</th>
													</tr>
												</thead>
												<tbody>
													` +tmphsl+ `
												</tbody>
											</table>
										</div>
									`);

									$$('.delete_pin').on('click', function () {
					                  var id = $$(this).data('id');
					                  app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
					                    loading();

					                    app.request({
					                      method:"POST",
					                      url:database_connect + "pin/delete_pin.php",
					                      data:{
					                        pin_id : id
					                      },
					                      success:function(data){
					                        var obj = JSON.parse(data);
					                        if(obj['status'] == true) {
					                          var x = obj['data'];
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(x,'Notifikasi',function(){
					                            mainView.router.refreshPage();
					                          });
					                        }
					                        else {
					                          determinateLoading = false;
					                          app.dialog.close();
					                          app.dialog.alert(obj['message']);
					                        }
					                      },
					                      error:function(data){
					                        determinateLoading = false;
					                        app.dialog.close();
					                        var toastBottom = app.toast.create({
					                          text: ERRNC,
					                          closeTimeout: 2000,
					                        });
					                        toastBottom.open();
					                        page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
					                      }
					                    });
					                  });
					                });
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'], 'Notifikasi', function(){
										page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
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
				},
			},
		},
		// CONFIRM PIN
		{
			path: '/confirm_pin/',
			url: 'pages/feature/confirm_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/select_request_pin.php", data: { request_pin_type : 'Basic' },
						success:function(data){
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								for(var i = 0;i < x.length; i++) {
									var total = "";
						      if(x[i]['pin_type'] == "Basic") {
										total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
									} else {
										total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
									}

									if(x[i]['status'] == 0) {
										$$('#confirm_pin').append(`
										<li class="swipeout">
											<div class="item-content swipeout-content">
				                <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
													<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
												</a>
												<div class="item-inner">
													<div class="item-title-row">
													<div class="item-title" style="">`+x[i]['username']+`</div>
													<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark</i></span></div>
													</div>
													<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
													<div class="item-subtitle" style="">`+total+`</div>
													<div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
												</div>
												<div class="swipeout-actions-right">
													<a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
													`" data-type="`+x[i]['pin_type']+`" class="bg-color-green sw-accepted"><i class="f7-icons">checkmark</i></a>
													<a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
													`" data-type="`+x[i]['pin_type']+`" class="bg-color-red sw-deleted"><i class="f7-icons">trash</i></a>
												</div>
											</div>
										</li>
										`);
									} else {
										$$('#confirm_pin').append(`
										<li class="swipeout">
											<div class="item-content swipeout-content">
				                <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
													<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
												</a>
												<div class="item-inner">
													<div class="item-title-row">
													<div class="item-title" style="">`+x[i]['username']+`</div>
													<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark_fill</i></span></div>
													</div>
													<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
													<div class="item-subtitle" style="">`+total+`</div>
													<div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
												</div>
											</div>
										</li>
										`);
									}
								}

								$$('.sw-accepted').on('click', function () {
									var id = $$(this).data('id');
									var username = $$(this).data('username');
									var type = $$(this).data('type');
									var count = $$(this).data('count');

									app.dialog.confirm("Apakah Anda yakin memberikan " + count + " pin " + type + 
										" kepada " + username + "? Pastikan member telah membayar!", function() {
										var url = "";
										if(type == "Basic") {
											url = "pin/generate_pin_basic.php";
										} else {
											url = "pin/generate_pin_premium.php";
										}
										loading();

										for(var i = 0; i < count; i++) {
											var suc = 0;
											app.request({
												method: "POST",
												url: database_connect + url, data:{ username_sponsor : username },
												success: function(data) {
													var obj = JSON.parse(data);
													if(obj['status'] == true) {
														var x = obj['data'];
														suc++;
														if (suc == count) {
															app.request({
															method: "POST",
															url: database_connect + "pin/update_request_pin.php", data:{ request_pin_id : id },
															success: function(data) {
																var obj = JSON.parse(data);
																if(obj['status'] == true) {
																	var x = obj['data'];
																	app.dialog.close();
																	app.dialog.alert(x, 'Notifikasi', function(){
																		mainView.router.refreshPage();
																	});
																} else {
																	$$('.sw-accepted').click();
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
														}
													} else {
														$$('.sw-accepted').click();
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
										}
									});
								});

								$$('.sw-deleted').on('click', function () {
									var id = $$(this).data('id');
									var username = $$(this).data('username');
									var type = $$(this).data('type');
									var count = $$(this).data('count');

									app.dialog.confirm("Apakah Anda yakin menghapus permintaan " + count + " pin " + type + 
										" oleh " + username + "? Pastikan member belum membayar!",function(){
										var url = "pin/delete_request_pin.php";
										loading();

										app.request({
											method: "POST",
											url: database_connect + url, data:{ request_pin_id : id },
											success: function(data) {
												var obj = JSON.parse(data);
												if(obj['status'] == true) {
													var x = obj['data'];
													determinateLoading = false;
													app.dialog.close();
													app.dialog.alert(x,'Notifikasi',function(){
	                          mainView.router.refreshPage();
	                        });
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
								});

								determinateLoading = false;
								app.dialog.close();
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi', function(){
								page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
								});
							}
						},
						error:function(data){
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

					$$('#request_pin_type_confirm_selection').on('change', function () {
						var search = $$('#request_pin_type_confirm_selection').val();
						app.request({
							method:"POST",
							url:database_connect+"pin/select_request_pin.php",
							data:{request_pin_type:search},
							success:function(data){
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									$$('#confirm_pin').html('');
									var x = obj['data'];
									for(var i = 0;i < x.length; i++) {
										var total = "";
										if(x[i]['pin_type'] == "Basic") {
											total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
										} else {
											total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
										}
	
										if(x[i]['status'] == 0) {
											$$('#confirm_pin').append(`
											<li class="swipeout">
												<div class="item-content swipeout-content">
												  <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
													<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
												</a>
												<div class="item-inner">
													<div class="item-title-row">
													<div class="item-title" style="">`+x[i]['username']+`</div>
													<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark</i></span></div>
													</div>
													<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
													<div class="item-subtitle" style="">`+total+`</div>
													<div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
												</div>
												<div class="swipeout-actions-right">
													<a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
													`" data-type="`+x[i]['pin_type']+`" class="bg-color-green sw-accepted"><i class="f7-icons">checkmark</i></a>
													<a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
													`" data-type="`+x[i]['pin_type']+`" class="bg-color-red sw-deleted"><i class="f7-icons">trash</i></a>
												</div>
												</div>
											</li>
											`);
										} else {
											$$('#confirm_pin').append(`
											<li class="swipeout">
												<div class="item-content swipeout-content">
												  <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
													<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
												</a>
												<div class="item-inner">
													<div class="item-title-row">
													<div class="item-title" style="">`+x[i]['username']+`</div>
													<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark_fill</i></span></div>
													</div>
													<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
													<div class="item-subtitle" style="">`+total+`</div>
													<div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
												</div>
												</div>
											</li>
											`);
										}
									}
	
									$$('.sw-accepted').on('click', function () {
										var id = $$(this).data('id');
										var username = $$(this).data('username');
										var type = $$(this).data('type');
										var count = $$(this).data('count');
	
										app.dialog.confirm("Apakah Anda yakin memberikan " + count + " pin " + type + 
											" kepada " + username + "? Pastikan member telah membayar!",function(){
											var url = "";
											if(type == "Basic") {
												url = "pin/generate_pin_basic.php";
											} else {
												url = "pin/generate_pin_premium.php";
											}
	
											showDeterminate(true);
											determinateLoading = false;
											function showDeterminate(inline)
											{
												determinateLoading = true;
												var progressBarEl;
												if (inline) {
													progressBarEl = app.dialog.progress();
												} else {
													progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
												}
												function simulateLoading() {
													setTimeout(function () {
													simulateLoading();
													}, Math.random() * 300 + 300);
												}
												simulateLoading();
											}
	
											for(var i = 0; i < count; i++) {
												var suc = 0;
												app.request({
													method: "POST",
													url: database_connect + url, data:{ username_sponsor : username },
													success: function(data) {
														var obj = JSON.parse(data);
														if(obj['status'] == true) {
															var x = obj['data'];
															suc++;
															if (suc == count) {
																app.request({
																method: "POST",
																url: database_connect + "pin/update_request_pin.php", data:{ request_pin_id : id },
																success: function(data) {
																	var obj = JSON.parse(data);
																	if(obj['status'] == true) {
																		var x = obj['data'];
																		app.dialog.close();
																		app.dialog.alert(x, 'Notifikasi', function(){
																			mainView.router.refreshPage();
																		});
																	} else {
																		$$('.sw-accepted').click();
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
															}
														} else {
															$$('.sw-accepted').click();
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
											}
										});
									});
	
									$$('.sw-deleted').on('click', function () {
										var id = $$(this).data('id');
										var username = $$(this).data('username');
										var type = $$(this).data('type');
										var count = $$(this).data('count');
	
										app.dialog.confirm("Apakah Anda yakin menghapus permintaan " + count + " pin " + type + 
											" oleh " + username + "? Pastikan member belum membayar!",function(){
											var url = "pin/delete_request_pin.php";
	
											showDeterminate(true);
											determinateLoading = false;
											function showDeterminate(inline)
											{
												determinateLoading = true;
												var progressBarEl;
												if (inline) {
													progressBarEl = app.dialog.progress();
												} else {
													progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
												}
												function simulateLoading() {
													setTimeout(function () {
													simulateLoading();
													}, Math.random() * 300 + 300);
												}
												simulateLoading();
											}
	
											app.request({
												method: "POST",
												url: database_connect + url, data:{ request_pin_id : id },
												success: function(data) {
													var obj = JSON.parse(data);
													if(obj['status'] == true) {
														var x = obj['data'];
														determinateLoading = false;
														app.dialog.close();
														app.dialog.alert(x,'Notifikasi',function(){
															mainView.router.refreshPage();
														});
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
									});
	
									determinateLoading = false;
									app.dialog.close();
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'], 'Notifikasi', function(){
									page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								}
							},
							error:function(data){
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
				},
			},
		},
		// TRANSFER PIN
		{
			path: '/transfer_pin/:type',
			url: 'pages/feature/transfer_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					var type = page.router.currentRoute.params.type;
					$$('#type_transfer_pin').val(type);
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/select_pin_user_no_usage_by_type.php", data: { type: type, username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								$$('#available_transfer_pin').val(x.length);
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

					app.request({
						method: "POST",
						url: database_connect + "users/select_users.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#member_transfer_pin',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  for (var i = 0; i < x.length; i++) {
											if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }
									  render(results);
									}
								});
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

					$$('#btntransferpin').on('click', function() {
						var pin_type = $$('#type_transfer_pin').val();
						var pin_available = $$('#available_transfer_pin').val();
						var pin_count = $$('#count_transfer_pin').val();
						var username = $$('#member_transfer_pin').val();

						if(parseInt(pin_count) < 1 || parseInt(pin_count) == "") {
							app.dialog.alert("Minimum jumlah transfer pin adalah 1 buah!");
						} else if (username == "") {
							app.dialog.alert("Anda belum memilih member tujuan penerima pin!");
						} else if (parseInt(pin_count) > parseInt(pin_available)) {
							app.dialog.alert("Jumlah pin yang Anda transfer melebihi jumlah pin Anda yang tersedia!");
						} else {
							app.dialog.confirm("Apakah Anda yakin melakukan transfer pin " + pin_type + " sebanyak " + 
								pin_count + " buah kepada " + username + "?",function(){
								loading();

								app.request({
									method: "POST",
									url: database_connect + "pin/transfer_pin.php",
										data:{
											pin_type : pin_type,
											pin_count : pin_count,
											username_owner : localStorage.username,
											username : username
										},
									success: function(data) {
										var obj = JSON.parse(data);
										if(obj['status'] == true) {
											var x = obj['message'];
											determinateLoading = false;
											app.dialog.close();
											app.dialog.alert(x);
											page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
				},
			},
		},
		// HISTORY TRANSFER PIN
		{
			path: '/history_transfer_pin/',
			url: 'pages/feature/history_transfer_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/select_transfer_pin.php", data: { pin_type : 'Basic' },
						success:function(data){
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								for(var i = 0;i < x.length; i++) {
									$$('#listhistorytransactionpin').append(`
										<div class="card demo-facebook-card">
											<div class="card-header">
											<div class="demo-facebook-price">Dari : <b>` + x[i]['username_sender'] + `</b><span style="float: right; color: green">` + x[i]['transfer_pin_type'] + `</span></div>
											<div class="demo-facebook-price">Untuk : <b>` + x[i]['username_receiver'] + `</b> </div>
											<div class="demo-facebook-price">Jumlah : <b>` +  x[i]['transfer_pin_count'] + ` Buah</b></div>
											<div class="demo-facebook-date">` + formatDateTime(x[i]['transfer_pin_date']) + `</div>
											</div>
										</div>
									`);
								}

								determinateLoading = false;
								app.dialog.close();
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi', function(){
								page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
								});
							}
						},
						error:function(data){
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

					$$('#history_transfer_pin_selection').on('change', function () {
						var search = $$('#history_transfer_pin_selection').val();
						app.request({
							method: "POST",
							url: database_connect+"pin/select_transfer_pin.php", data:{ pin_type : search },
							success:function(data){
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									$$('#listhistorytransactionpin').html('');
									for(var i = 0;i < x.length; i++) {
										$$('#listhistorytransactionpin').append(`
											<div class="card demo-facebook-card">
												<div class="card-header">
												<div class="demo-facebook-name">Dari : ` + x[i]['username_sender'] + `<span style="float: right; color: green">` + x[i]['transfer_pin_type'] + `</span></div>
												<div class="demo-facebook-price">Untuk : <b>` + x[i]['username_receiver'] + `</b> </div>
												<div class="demo-facebook-price"><b>` +  x[i]['transfer_pin_count'] + `</b></div>
												<div class="demo-facebook-date">` + formatDateTime(x[i]['transfer_pin_date']) + `</div>
												</div>
											</div>
										`);
									}
	
									determinateLoading = false;
									app.dialog.close();
								} else {
									determinateLoading = false;
									app.dialog.close();
									app.dialog.alert(obj['message'], 'Notifikasi', function(){
									page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
									});
								}
							},
							error:function(data){
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
				},
			},
		},
		// HISTORY TRANSFER PIN MEMBER
		{
			path: '/history_transfer_pin_member/',
			url: 'pages/feature/history_transfer_pin_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					loading();

					app.request({
						method: "POST",
						url: database_connect + "pin/select_transfer_pin_member.php", data: { username : localStorage.username },
						success:function(data){
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								for(var i = 0;i < x.length; i++) {
									$$('#listhistorytransactionpinmember').append(`
										<div class="card demo-facebook-card">
											<div class="card-header">
											<div class="demo-facebook-price">Dari : <b>` + x[i]['username_sender'] + `</b><span style="float: right; color: ` + x[i]['transfer_pin_color'] + `">` + x[i]['transfer_pin_status'] + `</span></div>
											<div class="demo-facebook-price">Untuk : <b>` + x[i]['username_receiver'] + `</b> </div>
											<div class="demo-facebook-price">Jumlah : <b>` +  x[i]['transfer_pin_count'] + ` ` +  x[i]['transfer_pin_type'] + `</b></div>
											<div class="demo-facebook-date">` + formatDateTime(x[i]['transfer_pin_date']) + `</div>
											</div>
										</div>
									`);
								}

								determinateLoading = false;
								app.dialog.close();
							} else {
								determinateLoading = false;
								app.dialog.close();
								app.dialog.alert(obj['message'], 'Notifikasi', function(){
								page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
								});
							}
						},
						error:function(data){
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
				},
			},
		},
	]
});
var mainView = app.views.create('.view-main', { url: '/home/'});

function onBackKeyDown() {
	if(app.views.main.history.length == 1 || app.views.main.router.url == '/home/' || app.views.main.router.url == '/login/'){
		navigator.app.exitApp();
	} else{
		app.dialog.close();
		app.views.main.router.back({
			url: /home/,
			force: true,
			ignoreCache: true
		});
		return false;
	}
}

function loading() {
	showDeterminate(true);
	determinateLoading = false;
	function showDeterminate(inline)
	{
		determinateLoading = true;
		var progressBarEl;
		if (inline) {
			progressBarEl = app.dialog.progress();
		} else {
			progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
		}
		function simulateLoading() {
			setTimeout(function () {
			simulateLoading();
			}, Math.random() * 300 + 300);
		}
		simulateLoading();
	}
}

document.addEventListener("backbutton", onBackKeyDown, false);

function formatDate(date) {
  	return date;
}

function formatDateTime(date) {
  	return date;
}

function formatRupiah(angka){
	var number_string = angka.toString();
	sisa  = number_string.length % 3;
	rupiah  = number_string.substr(0, sisa);
	ribuan  = number_string.substr(sisa).match(/\d{3}/g);

	if (ribuan) {
	 	separator = sisa ? '.' : '';
	 	rupiah += separator + ribuan.join('.');
	}
	return 'IDR '+rupiah;
}