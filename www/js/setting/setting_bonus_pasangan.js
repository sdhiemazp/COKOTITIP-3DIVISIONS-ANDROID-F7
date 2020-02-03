function load_setting_bonus_pasangan(page) {
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
}