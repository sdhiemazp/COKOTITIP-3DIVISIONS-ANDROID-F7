function load_show_member(page) {
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
}