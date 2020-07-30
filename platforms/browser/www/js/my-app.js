var $$ = Dom7;
var database_connect = "https://3dvisions.adampay.online/";
var lokasifoto = "https://3dvisions.adampay.online/image/";
// var database_connect = "https://3dsaja.com/";
// var lokasifoto = "https://3dsaja.com/image/";
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
					load_home(page);
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
			url: 'pages/deposit/deposit.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_deposit(page);
				},
			},
		},
		// SHOW DEPOSIT
		{
			path: '/show_deposit/:transaction_id',
			url: 'pages/deposit/show_deposit.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_show_deposit(page);
				},
			},
		},
		// WITHDRAW
		{
			path: '/withdraw/',
			url: 'pages/withdraw/withdraw.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_withdraw(page);
				},
			},
		},
		// SHOW WITHDRAW
		{
			path: '/show_withdraw/:transaction_id',
			url: 'pages/withdraw/show_withdraw.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_show_withdraw(page);
				},
			},
		},		
		// REPEAT ORDER
		{
			path: '/repeat_order/',
			url: 'pages/repeat_order/repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_repeat_order(page);
				},
			},
		},
		// SHOW REPEAT ORDER
		{
			path: '/show_repeat_order/:transaction_id',
			url: 'pages/repeat_order/show_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_show_repeat_order(page);
				},
			},
		},
		// TRANSFER E-CASH
		{
			path: '/transfer_balance_a/',
			url: 'pages/transfer/transfer_balance_a.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_transfer_balance_a(page);
				},
			},
		},
		// TRANSFER BONUS
		{
			path: '/transfer_balance_c/',
			url: 'pages/transfer/transfer_balance_c.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_transfer_balance_c(page);
				},
			},
		},
		// TRANSFER BANK
		{
			path: '/transfer_bank/',
			url: 'pages/transfer/transfer_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_transfer_bank(page);
				},
			},
		},
		// PROFIT
		{
			path: '/profit/',
			url: 'pages/setting/profit.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_profit(page);
				},
			},
		},
		// SETTING ON/OFF BONUS
		{
			path: '/setting_on_off_bonus/',
			url: 'pages/setting/setting_on_off_bonus.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_on_off_bonus(page);
				},
			},
		},
		// SETTING BONUS SPONSOR
		{
			path: '/setting_bonus_sponsor/',
			url: 'pages/setting/setting_bonus_sponsor.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_sponsor(page);
				},
			},
		},
		// SETTING BONUS PASANGAN
		{
			path: '/setting_bonus_pasangan/',
			url: 'pages/setting/setting_bonus_pasangan.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_pasangan(page);
				},
			},
		},
		// SETTING BONUS TITIK MLM
		{
			path: '/setting_bonus_titik_mlm/',
			url: 'pages/setting/setting_bonus_titik_mlm.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_titik_mlm(page);
				},
			},
		},
		// SETTING BONUS GENERASI MLM
		{
			path: '/setting_bonus_generasi_mlm/',
			url: 'pages/setting/setting_bonus_generasi_mlm.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_generasi_mlm(page);
				},
			},
		},
		// SETTING BONUS TITIK PPOB
		{
			path: '/setting_bonus_titik_ppob/',
			url: 'pages/setting/setting_bonus_titik_ppob.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_titik_ppob(page);
				},
			},
		},
		// SETTING BONUS GENERASI PPOB
		{
			path: '/setting_bonus_generasi_ppob/',
			url: 'pages/setting/setting_bonus_generasi_ppob.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_generasi_ppob(page);
				},
			},
		},
		// SETTING CASHBACK TRANSAKSI PPOB
		{
			path: '/setting_cashback_transaksi_ppob/',
			url: 'pages/setting/setting_cashback_transaksi_ppob.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_cashback_transaksi_ppob(page);
				},
			},
		},
		// SETTING BONUS REPEAT ORDER
		{
			path: '/setting_bonus_repeat_order/',
			url: 'pages/setting/setting_bonus_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_bonus_repeat_order(page);
				},
			},
		},
		// SETTING ROYALTY REPEAT ORDER
		{
			path: '/setting_royalty_repeat_order/',
			url: 'pages/setting/setting_royalty_repeat_order.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_royalty_repeat_order(page);
				},
			},
		},
		// SETTING BIAYA ADMIN
		{
			path: '/setting_biaya_admin/',
			url: 'pages/setting/setting_biaya_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_setting_biaya_admin(page);
				},
			},
		},
		// HISTORY BONUS BY MEMBER
		{
			path: '/history_bonus/:username',
			url: 'pages/history/history_bonus.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_history_bonus(page);
				},
			},
		},
		// HISTORY BONUS BY ADMIN
		{
			path: '/history_bonus_all/',
			url: 'pages/history/history_bonus_all.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_history_bonus_all(page);
				},
			},
		},
		// HISTORY TRANSACTION MEMBER BY MEMBER
		{
			path: '/history/',
			url: 'pages/history/list_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_transaction_member(page)
				},
			},
		},
		// HISTORY TRANSACTION MEMBER BY ADMIN
		{
			path: '/list_history/:username',
			url: 'pages/history/list_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_transaction_admin(page);
				},
			},
		},
		// LIST TRANSACTION BY ADMIN
		{
			path: '/list_transaction/',
			url: 'pages/history/list_transaction_all.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_transaction_all(page);
				},
			},
		},
		// CHECK TRANSACTION
		{
			path: '/check_transaction/',
			url: 'pages/history/check_transaction.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_check_transaction(page);
				},
			},
		},
		// INCREASE
		{
			path: '/increase/',
			url: 'pages/other_transaction/increase.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_increase(page);
				},
			},
		},
		// DECREASE
		{
			path: '/decrease/',
			url: 'pages/other_transaction/decrease.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_decrease(page);
				},
			},
		},
		// USERS PASCABAYAR
		{
			path: '/users_pascabayar/',
			url: 'pages/setting/users_pascabayar.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_users_pascabayar(page);
				},
			},
		},
		// LIST MEMBER ALL
		{
			path: '/users/',
			url: 'pages/member/users.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_users(page);
				},
			},
		},
		// LIST MEMBER
		{
			path: '/list_member/',
			url: 'pages/member/list_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_member(page);
				},
			},
		},
		// LIST MEMBER 2
		{
			path: '/list_member_2/:username',
			url: 'pages/member/list_member_2.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_member_2(page);
				},
			},
		},
		// LIST MEMBER 3
		{
			path: '/list_member_3/:username',
			url: 'pages/member/list_member_3.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_member_3(page);
				},
			},
		},
		// SHOW MEMBER
		{
			path: '/show_member/:username',
			url: 'pages/member/show_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_show_member(page);
				},
			},
		},
		// CREATE MEMBER
		{
			path: '/create_member/:position/:username_upline',
			url: 'pages/member/create_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_create_member(page);
				},
			},
		},
		// EDIT MEMBER
		{
			path: '/edit_member/:username',
			url: 'pages/member/edit_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_edit_member(page);
				},
			},
		},
		// EDIT MEMBER PASSWORD
		{
			path: '/edit_member_password/:username',
			url: 'pages/member/edit_member_password.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_edit_member_password(page);
				},
			},
		},
		// LIST BANK
		{
			path: '/list_bank/',
			url: 'pages/bank/list_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_bank(page);
				},
			},
		},
		// CREATE BANK
		{
			path: '/create_bank/',
			url: 'pages/bank/create_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_create_bank(page);
				},
			},
		},
		// EDIT BANK
		{
			path: '/edit_bank/:bank_id',
			url: 'pages/bank/edit_bank.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_edit_bank(page);
				},
			},
		},
		// LIST COMPANY ACCOUNT
		{
			path: '/list_company_account/',
			url: 'pages/company_account/list_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_company_account(page);
				},
			},
		},
		// CREATE COMPANY ACCOUNT
		{
			path: '/create_company_account/',
			url: 'pages/company_account/create_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_create_company_account(page);
				},
			},
		},
		// EDIT COMPANY ACCOUNT
		{
			path: '/edit_company_account/:company_account_id',
			url: 'pages/company_account/edit_company_account.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_edit_company_account(page);
				},
			},
		},
		// LIST PRODUCT ADMIN
		{
			path: '/list_product_admin/:category',
			url: 'pages/product/list_product_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_product_admin(page);
				},
			},
		},
		// LIST PRODUCT DETAIL ADMIN
		{
			path: '/list_product_detail_admin/:category/:brand',
			url: 'pages/product/list_product_detail_admin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_product_detail_admin(page);
				},
			},
		},
		// LIST PRODUCT MEMBER
		{
			path: '/list_product_member/:category',
			url: 'pages/product/list_product_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_product_member(page);
				},
			},
		},
		// LIST PRODUCT DETAIL MEMBER
		{
			path: '/list_product_detail_member/:category/:brand',
			url: 'pages/product/list_product_detail_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_product_detail_member(page);
				},
			},
		},
		// CHECKOUT PRABAYAR
		{
			path: '/checkout/:buyer_sku_code',
			url: 'pages/product/checkout_pra.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_checkout_pra(page);
				},
			},
		},
		// CHECKOUT PASCABAYAR
		{
			path: '/checkout_pasca/:buyer_sku_code',
			url: 'pages/product/checkout_pasca.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_checkout_pasca(page);
				},
			},
		},
		// CHECKOUT DETAIL PASCABAYAR
		{
			path: '/checkout_pasca_detail/:transaction_id',
			url: 'pages/product/checkout_pasca_detail.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_checkout_pasca_detail(page);
				},
			},
		},
		// DEPOSIT PIN
		{
			path: '/deposit_pin/',
			url: 'pages/pin/deposit_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_deposit_pin(page);
				},
			},
		},
		// SHOW DEPOSIT PIN
		{
			path: '/show_deposit_pin/:request_pin_id',
			url: 'pages/pin/show_deposit_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_show_deposit_pin(page);
				},
			},
		},
		// HISTORY PIN
		{
			path: '/history_pin/',
			url: 'pages/pin/history_pin.html',
			on:
			{
			    pageInit:function(e,page)
			    {
			      	load_history_pin(page);
			    },
		  	},
		},
		// LIST MY PIN
		{
			path: '/pin_pribadi/',
			url: 'pages/pin/pin_pribadi.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_pin_pribadi(page);
				},
			},
		},
		// LIST ALL PIN
		{
			path: '/list_pin/',
			url: 'pages/pin/list_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_list_pin(page);
				},
			},
		},
		// CONFIRM PIN
		{
			path: '/confirm_pin/',
			url: 'pages/pin/confirm_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_confirm_pin(page);
				},
			},
		},
		// TRANSFER PIN
		{
			path: '/transfer_pin/:type',
			url: 'pages/pin/transfer_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_transfer_pin(page);
				},
			},
		},
		// HISTORY TRANSFER PIN
		{
			path: '/history_transfer_pin/',
			url: 'pages/pin/history_transfer_pin.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_history_transfer_pin(page);
				},
			},
		},
		// HISTORY TRANSFER PIN MEMBER
		{
			path: '/history_transfer_pin_member/',
			url: 'pages/pin/history_transfer_pin_member.html',
			on:
			{
				pageInit:function(e,page)
				{
					load_history_transfer_pin_member(page);
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