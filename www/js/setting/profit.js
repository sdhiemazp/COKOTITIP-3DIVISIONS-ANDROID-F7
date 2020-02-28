function load_profit(page) {
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

  $$('#btn_setting_on_off_bonus').on('click', function() {
    page.router.navigate('/setting_on_off_bonus/');
  });
  $$('#btn_setting_bonus_sponsor').on('click', function() {
    page.router.navigate('/setting_bonus_sponsor/');
  });
  $$('#btn_setting_bonus_pasangan').on('click', function() {
    page.router.navigate('/setting_bonus_pasangan/');
  });
  $$('#btn_setting_bonus_titik_mlm').on('click', function() {
    page.router.navigate('/setting_bonus_titik_mlm/');
  });
  $$('#btn_setting_bonus_generasi_mlm').on('click', function() {
    page.router.navigate('/setting_bonus_generasi_mlm/');
  });
  $$('#btn_setting_bonus_titik_ppob').on('click', function() {
    page.router.navigate('/setting_bonus_titik_ppob/');
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
}