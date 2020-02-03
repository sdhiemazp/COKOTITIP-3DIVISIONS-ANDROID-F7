function load_repeat_order(page) {
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
}