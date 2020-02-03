function load_setting_bonus_repeat_order(page) {
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
}