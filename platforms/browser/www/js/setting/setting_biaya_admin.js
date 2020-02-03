function load_setting_biaya_admin(page) {
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
}