var $$ = Dom7;
var database_connect = "https://3dsaja.com/";
var lokasifoto = "https://3dsaja.com/image/";
var ERRNC ="Koneksi Anda terputus!";
var PHOTO_ERR ="Foto tidak berhasil diunggah!";

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
					var captcha           = '';
			   		var characters       = '0123456789';
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
					} else if(localStorage.user_type == "Member") {
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
							} else {
								// app.dialog.alert(obj['message']);
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

					$$('#logout').on('click', function(e) {
						app.dialog.confirm('Apakah anda ingin keluar?', 'Log Out',function () {
							localStorage.clear();
							page.router.navigate('/login/');
						});
					});
					var $ptrContent = $$('.ptr-content');
					$ptrContent.on('ptr:refresh', function (e) {
						// Emulate 2s loading
						setTimeout(function () {
							mainView.router.refreshPage();
							// When loading done, we need to reset it
							app.ptr.done(); // or e.detail();
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
				}
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
						url: database_connect + "company_account/select_company_account.php", data:{ },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
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

					app.request({
						method: "POST",
						url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								$$('#bank_name_deposit').val(x[0]['bank_name']);
								$$('#user_account_name_deposit').val(x[0]['user_account_name']);
								$$('#user_account_number_deposit').val(x[0]['user_account_number']);
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

						var transaction_price = $$('#transaction_price_deposit').val();
						var bank_id = $$('#bank_id_deposit').val();
						if(transaction_price < 50000) {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert("Minimum jumlah deposit adalah IDR 50.000!");
						} else {
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
								//app.dialog.alert(obj['message']);
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
					if(localStorage.user_level == "Basic") {
						$$('#option_bonus_pasti').hide();
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
								//app.dialog.alert(obj['message']);
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
		// PROFIT
		{
			path: '/profit/',
			url: 'pages/feature/profit.html',
			on:
			{
				pageInit:function(e,page)
				{
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
					$$('#btn_setting_biaya_admin_wd').on('click', function() {
						page.router.navigate('/setting_biaya_admin_wd/');
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
		// SETTING BIAYA ADMIN WD
		{
			path: '/setting_biaya_admin_wd/',
			url: 'pages/feature/setting_biaya_admin_wd.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						var wd_sponsor = $$('#wd_sponsor_setting').val();
						var wd_pasti = $$('#wd_pasti_setting').val();

						if(wd_sponsor == "") {
							app.dialog.alert("Minimum biaya admin WD saldo bonus sponsor adalah 0!");
						} else if(wd_pasti == "") {
							app.dialog.alert("Minimum biaya admin WD saldo bonus pasti adalah 0!");
						} else {
							app.request({
								method: "POST",
								url: database_connect + "bonus/update_bonus.php",
									data:{
										bonus : "wd",
										wd_sponsor : wd_sponsor,
										wd_pasti : wd_pasti,
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
		// HISTORY BONUS
		{
			path: '/history_bonus/:username',
			url: 'pages/feature/history_bonus.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
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
		// HISTORY BY MEMBER
		{
			path: '/history/',
			url: 'pages/feature/history.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						url: database_connect + "transaction/select_transaction.php", data:{ username : localStorage.username },
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
											<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
									}

									var color = "white";
									if(x[i]['transaction_status'] == "Failed") {
										color = "red";
									} else {
										color = "green";
									}

									var price = "";
									var sell = "";
									if(x[i]['transaction_type'] == "Sell") {
										price = formatRupiah((parseInt(x[i]['transaction_price'])));
										sell = "<br> Ket/SN : ";
									} else {
										price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
									}

									$$('#listhistory').append(`
										<a href="` + url + x[i]['transaction_id'] + `">
											<div class="card demo-facebook-card">
											  <div class="card-header">
											    <div class="demo-facebook-name">` + x[i]['transaction_type'] + ` ` + sell + x[i]['transaction_message'] +
											    	`<span style="float: right; color:` + color + `">` + x[i]['transaction_status'] + `<span></div>
											    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
											    <div class="demo-facebook-price">` + price + `</div>
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
		// HISTORY BY ADMIN
		{
			path: '/list_history/:username',
			url: 'pages/feature/history.html',
			on:
			{
				pageInit:function(e,page)
				{
					var x = page.router.currentRoute.params.username;
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
						url: database_connect + "transaction/select_transaction.php", data:{ username : x },
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
											<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
									}

									var color = "white";
									if(x[i]['transaction_status'] == "Failed") {
										color = "red";
									} else {
										color = "green";
									}

									var price = "";
									var sell = "";
									if(x[i]['transaction_type'] == "Sell") {
										price = formatRupiah((parseInt(x[i]['transaction_price'])));
										sell = "<br> Ket/SN : ";
									} else {
										price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
									}

									$$('#listhistory').append(`
										<a href="` + url + x[i]['transaction_id'] + `">
											<div class="card demo-facebook-card">
											  <div class="card-header">
											    <div class="demo-facebook-name">` + x[i]['transaction_type'] + ` ` + sell + x[i]['transaction_message'] +
											    	`<span style="float: right; color:` + color + `">` + x[i]['transaction_status'] + `<span></div>
											    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
											    <div class="demo-facebook-price">` + price + `</div>
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
		// LIST TRANSACTION
		{
			path: '/list_transaction/',
			url: 'pages/feature/list_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type:'All' },
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

										var price = "";
										var sell = "";
										if(x[i]['transaction_type'] == "Sell") {
											price = formatRupiah((parseInt(x[i]['transaction_price'])));
											sell = "<br> Ket/SN : ";
										} else {
											price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
										}

										var adminfee = "";
										if(x[i]['transaction_type'] == "Deposit") {
											message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
											message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";
										} else if(x[i]['transaction_type'] == "Withdraw") {
											message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
											message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
											withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
												x[i]['user_account_number'] + `</div>`;
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										}
										$$('#listtransaction').append(`
											<div class="card demo-facebook-card">
											  <div class="card-header">
												<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + color + `">` + x[i]['transaction_status'] + `</span></div>
												<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b>` + sell +
													x[i]['transaction_message'].toUpperCase() + `</div>
												<div class="demo-facebook-price"><b>` +  x[i]['customer_number'] + `</b></div>
												<div class="demo-facebook-price">` + price + `</div>
												` + adminfee + `
												<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
											  </div>
											</div>
										`);
									} else {
										var adminfee = "";
										if(x[i]['transaction_type'] == "Deposit") {
											message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
											message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";
										} else if(x[i]['transaction_type'] == "Withdraw") {
											message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
											message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
											withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
												x[i]['user_account_number'] + `</div>`;
											adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
												<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
										}
										$$('#listtransaction').append(`
											<div class="card demo-facebook-card">
												<div class="card-header">
													<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right;">` + x[i]['transaction_status'] + `</span></div>
													<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b> ` +
														x[i]['transaction_message'].toUpperCase() + `</div>
													<div class="demo-facebook-price">` + formatRupiah((parseInt(x[i]['transaction_price']) +
												  	parseInt(x[i]['transaction_unique_code']))) + `</div>
												  	` + adminfee + `
													<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
												</div>
												<div class="card-footer">
													<a class="link color-green accept_transaction" style="width: 50%; text-align: center;" data-id="` +
														x[i]['transaction_id'] + `" data-message_accept="` + message_accept + `" data-balance="` +
														(parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])) + `" data-username="` +
														x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Selesai</a>
													<a class="link color-red decline_transaction" style="width: 50%; text-align: center;" data-id="` +
														x[i]['transaction_id'] + `" data-message_decline="` + message_decline + `" data-balance="` +
														(parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])) + `" data-username="` +
														x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Tolak</a>
												</div>
											</div>
										`);
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

					$$('#category_transaction_selection').on('change', function () {
						var category = $$('#category_transaction_selection').val();
						$$('#listtransaction').html('');
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
											var color = "";
											if(x[i]['transaction_status'] == "Failed") {
												color = "red";
											} else {
												color = "green";
											}

											var price = "";
											var sell = "";
											if(x[i]['transaction_type'] == "Sell") {
												price = formatRupiah((parseInt(x[i]['transaction_price'])));
												sell = "<br> Ket/SN : ";
											} else {
												price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
											}

											var adminfee = "";
											if(x[i]['transaction_type'] == "Deposit") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";
											} else if(x[i]['transaction_type'] == "Withdraw") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
												withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
													x[i]['user_account_number'] + `</div>`;
												adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
													<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
											}
											$$('#listtransaction').append(`
												<div class="card demo-facebook-card">
												  <div class="card-header">
													<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + color + `">` + x[i]['transaction_status'] + `</span></div>
													<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b> ` + sell +
														x[i]['transaction_message'].toUpperCase() + `</div>
													<div class="demo-facebook-price"><b>` +  x[i]['customer_number'] + `</b></div>
													<div class="demo-facebook-price">` + price + `</div>
													` + adminfee + `
													<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
												  </div>
												</div>
											`);
										} else {
											var adminfee = "";
											if(x[i]['transaction_type'] == "Deposit") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";
											} else if(x[i]['transaction_type'] == "Withdraw") {
												message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
												message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
												withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
													x[i]['user_account_number'] + `</div>`;
												adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
													<div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
											}
											$$('#listtransaction').append(`
												<div class="card demo-facebook-card">
													<div class="card-header">
														<div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right;">` + x[i]['transaction_status'] + `</span></div>
														<div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b> ` +
															x[i]['transaction_message'].toUpperCase() + `</div>
														<div class="demo-facebook-price">` + formatRupiah((parseInt(x[i]['transaction_price']) +
													  	parseInt(x[i]['transaction_unique_code']))) + `</div>
													  	` + adminfee + `
														<div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
													</div>
													<div class="card-footer">
														<a class="link color-green accept_transaction" style="width: 50%; text-align: center;" data-id="` +
															x[i]['transaction_id'] + `" data-message_accept="` + message_accept + `" data-balance="` +
															(parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])) + `" data-username="` +
															x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Selesai</a>
														<a class="link color-red decline_transaction" style="width: 50%; text-align: center;" data-id="` +
															x[i]['transaction_id'] + `" data-message_decline="` + message_decline + `" data-balance="` +
															(parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])) + `" data-username="` +
															x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Tolak</a>
													</div>
												</div>
											`);
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
		// INCREASE
		{
			path: '/increase/',
			url: 'pages/feature/increase.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						url: database_connect + "users/select_users.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								// for(var i = 0; i < x.length; i++) {
								// 	$$('#username_decrease').append(`<option value="` + x[i]['username'] + `">` + x[i]['user_name'] + `</option>`);
								// }
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#username_increase',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  // Find matched items
									  for (var i = 0; i < x.length; i++) {
										if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }
									  // Render items by passing array with result items
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
						var transaction_price = $$('#transaction_price_increase').val();
						var transaction_message = $$('#transaction_message_increase').val();
						var balance_increase = $$('#balance_increase').val();
						var username = $$('#username_increase').val();

						if(transaction_price < 1 || transaction_price == "") {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert("Minimum jumlah penambahan saldo/bonus member adalah IDR 1!");
						} else {
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
						url: database_connect + "users/select_users.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								// for(var i = 0; i < x.length; i++) {
								// 	$$('#username_decrease').append(`<option value="` + x[i]['username'] + `">` + x[i]['user_name'] + `</option>`);
								// }
								var autocompleteDropdownAll = app.autocomplete.create({
									inputEl: '#username_decrease',
									openIn: 'dropdown',
									source: function (query, render) {
									  var results = [];
									  // Find matched items
									  for (var i = 0; i < x.length; i++) {
										if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
									  }
									  // Render items by passing array with result items
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
						var transaction_price = $$('#transaction_price_decrease').val();
						var transaction_message = $$('#transaction_message_decrease').val();
						var balance_decrease = $$('#balance_decrease').val();
						var username = $$('#username_decrease').val();

						if(transaction_price < 1 || transaction_price == "") {
							determinateLoading = false;
							app.dialog.close();
							app.dialog.alert("Minimum jumlah pengurangan saldo member adalah IDR 1!");
						} else {
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
						}
					});
				},
			},
		},
		// USERS
		{
			path: '/users/',
			url: 'pages/feature/users.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						method: "GET",
						url: database_connect + "users/select_users2.php", data:{  },
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
										<td class="numeric-cell">` +x[i]['user_balance_a']+ `</td>
										<td class="numeric-cell">` +x[i]['user_balance_b']+ `</td>
										<td class="numeric-cell">` +x[i]['user_balance_c']+ `</td>
										<td class="label-cell">` +x[i]['user_date']+ `</td>
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
									for(var i = 0; i < x.length; i++)
									{
										tmphsl += `<tr>
											<td class="label-cell">` +x[i]['username']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_a']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_b']+ `</td>
											<td class="numeric-cell">` +x[i]['user_balance_c']+ `</td>
											<td class="label-cell">` +x[i]['user_date']+ `</td>
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
		// LIST MEMBER
		{
			path: '/list_member/',
			url: 'pages/feature/list_member.html',
			on:
			{
				pageInit:function(e,page)
				{
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
								if(x_data_sendiri[0]['username'] != "admin") {
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
								if(x_data_sendiri[0]['username'] != "admin") {
									sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
									$$('#back_2').show();
									$$('#back_2').on('click', function() {
										page.router.navigate('/list_member_3/' + x_data_sendiri[0]['username_upline']);
									});
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
									<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
								if(x_data_sendiri[0]['username'] != "admin") {
									sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
									$$('#back_3').show();
									$$('#back_3').on('click', function() {
										page.router.navigate('/list_member_2/' + x_data_sendiri[0]['username_upline']);
									});
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
									<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
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
										<br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"><span> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
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
								//app.dialog.alert(obj['message']);
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
									}
									else {
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
										}
										else {
											$$('#pin_id_no_usage_premium').show();
											$$('#pin_id_no_usage_basic').hide();
											document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
										}
									}
									else {
										if (basic == 0) {
											app.dialog.alert('Silahkan beli pin terlebih dahulu!',function () {
												$$('#pin_id_no_usage_premium').show();
												$$('#pin_id_no_usage_basic').hide();
												$$('#radiobas').prop('checked', false);
												$$('#radiopre').prop('checked', true);
												document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
											});
										}
										else {
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
													$$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `" selected>` +
														x2[i]['bank_name'] + `</option>`);
												} else {
													$$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `">` +
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
					// app.calendar.create({
					// 	inputEl: '#user_birthday_edit_member',
					// 	openIn: 'customModal',
					// 	header: true,
					// 	footer: true,
					// });

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
						method: "GET",
						url: database_connect + "digiflazz/price_list.php", data:{  },
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
						method: "GET",
						url: database_connect + "digiflazz/price_list.php", data:{  },
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
										var price = formatRupiah(x_price_list[i]['price']);
										var seller_name = x_price_list[i]['seller_name'];
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
									                 	<span>` + price + `</span><br>
									                 	<span>` + seller_name + `</span><br>
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
						method: "GET",
						url: database_connect + "digiflazz/price_list.php", data:{  },
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
						method: "GET",
						url: database_connect + "digiflazz/price_list.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							var x = obj['data']['data'];
							var x_profit = obj['profit'];
							if(x.length > 0) {
								determinateLoading = false;
								app.dialog.close();
								for(var i = 0; i < x.length; i++) {
									if(x[i]['category'] == category && x[i]['brand'] == brand) {
										var harga = parseInt(x_profit[i]['profit_value']) + parseInt(x[i]['price']);
										$$('#listproductdetailmember').append(`
											<div style="float: left; width: 100%;">
												<a href="/checkout/` + x[i]['buyer_sku_code'] + `" style="">
													<div class="card">
														<div class="card-content card-content-padding">
															<span>` + x[i]['product_name'] + `</span><br>
															<span>` + formatRupiah(harga) + `</span>
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
		// CHECKOUT
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
											<span>` + formatRupiah((parseInt(x[i]['price']) +
												parseInt(x_profit[i]['profit_value']))) + `</span>
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
									if(customer_no == "") {
										app.dialog.alert("Nomor telepon atau token tidak boleh kosong!");
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
										localStorage.user_balance_a = localStorage.user_balance_a - tagihan;
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
		// DEPOSIT PIN
		{
			path: '/deposit_pin/',
			url: 'pages/feature/deposit_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
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
						url: database_connect + "company_account/select_company_account.php", data:{ },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
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
									app.request({
										method: "POST",
										url: database_connect + "pin/member_accept_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
										success: function(data) {
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
								$$('#btn_no_show_deposit_pin').on('click', function() {
									app.request({
										method: "POST",
										url: database_connect + "pin/member_decline_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
										success: function(data) {
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
								determinateLoading = false;
								app.dialog.close();
								//app.dialog.alert(obj['message']);
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
		        method:"POST",
		        url:database_connect+"pin/select_request_pin_member.php", data:{ username : localStorage.username },
		        success:function(data){
		          var obj = JSON.parse(data);
		          if(obj['status'] == true) {
		            var x = obj['data'];
		            for(var i = 0; i < x.length; i++) {
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
		              for(var i=0;i<count;i++)
		              {
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
						url: database_connect + "pin/select_pin.php", data:{  },
						success: function(data) {
							var obj = JSON.parse(data);
							if(obj['status'] == true) {
								var x = obj['data'];
								determinateLoading = false;
								app.dialog.close();
								var tmphsl ='';
								for(var i = 0; i < x.length; i++)
								{
									if(x[i]['username_member']==null || x[i]['username_member']== "")
									{
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
									}
									else
									{
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

					$$('#txtsearchpin').on('keyup', function() {
						$$('#list_all_pin_user').html(``);
						var username = $$('#txtsearchpin').val();
						app.request({
							method: "POST",
							url: database_connect + "pin/find_pin.php", data:{ username : username },
							success: function(data) {
								var obj = JSON.parse(data);
								if(obj['status'] == true) {
									var x = obj['data'];
									determinateLoading = false;
									app.dialog.close();
									var tmphsl ='';
									for(var i = 0; i < x.length; i++)
									{
										if(x[i]['username_member']==null || x[i]['username_member']== "")
										{
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
										}
										else
										{
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
						method:"GET",
						url:database_connect+"pin/select_request_pin.php",
						success:function(data){
						var obj = JSON.parse(data);
						if(obj['status'] == true) {
							var x = obj['data'];
							for(var i = 0;i < x.length; i++) {
							if(x[i]['status'] == 0) {
								$$('#confirm_pin').append(`
								<li class="swipeout">
									<div class="item-content swipeout-content">
									<a href="#" class="item-media ">
										<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
									</a>
									<div class="item-inner">
										<div class="item-title-row">
										<div class="item-title" style="">`+x[i]['username']+`</div>
										<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark</i></span></div>
										</div>
										<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
										<div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
									</div>
									<div class="swipeout-actions-right">
										<a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
										`" data-type="`+x[i]['pin_type']+`" class="bg-color-green sw-accepted"><i class="f7-icons">check_round</i></a>
									</div>
									</div>
								</li>
								`);
							} else {
								$$('#confirm_pin').append(`
								<li class="swipeout">
									<div class="item-content swipeout-content">
									<a href="#" class="item-media ">
										<img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
									</a>
									<div class="item-inner">
										<div class="item-title-row">
										<div class="item-title" style="">`+x[i]['username']+`</div>
										<div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark_fill</i></span></div>
										</div>
										<div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
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

document.addEventListener("backbutton", onBackKeyDown, false);

function formatDate(date) {
  	// var monthNames = [
	  //   "Januari", "Februari", "Maret",
	  //   "April", "Mei", "Juni", "Juli",
	  //   "Agustus", "September", "Oktober",
	  //   "November", "Desember"
  	// ];

  	// var day = date.getDate();
  	// var monthIndex = date.getMonth();
  	// var year = date.getFullYear();

  	// return day + ' ' + monthNames[monthIndex] + ' ' + year;
  	return date;
}

function formatDateTime(date) {
  	// var monthNames = [
	  //   "Januari", "Februari", "Maret",
	  //   "April", "Mei", "Juni", "Juli",
	  //   "Agustus", "September", "Oktober",
	  //   "November", "Desember"
  	// ];

  	// var day = date.getDate();
  	// var monthIndex = date.getMonth();
  	// var year = date.getFullYear();
  	// var hour = now.getHours();
  	// var minute = now.getMinutes();
  	// var second = now.getSeconds();

  	// return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minute + ':' + second;
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