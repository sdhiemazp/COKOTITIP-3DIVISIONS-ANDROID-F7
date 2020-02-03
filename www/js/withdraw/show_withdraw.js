function load_show_withdraw(page) {
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
}