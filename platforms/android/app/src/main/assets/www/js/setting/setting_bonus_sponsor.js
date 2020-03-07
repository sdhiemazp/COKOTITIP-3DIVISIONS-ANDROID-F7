function load_setting_bonus_sponsor(page) {
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
        $$('#harga_premium_setting').val(x[65]['bonus_value']);
        $$('#harga_basic_setting').val(x[66]['bonus_value']);
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
    var harga_premium = $$('#harga_premium_setting').val();
    var harga_basic = $$('#harga_basic_setting').val();

    if(sponsor_premium == "") {
      app.dialog.alert("Minimum bonus sponsor premium adalah 0!");
    } else if(sponsor_basic == "") {
      app.dialog.alert("Minimum bonus sponsor basic adalah 0!");
    } else if(saldo_ecash_member == "") {
      app.dialog.alert("Minimum saldo e-cash member adalah 0!");
    } else if(harga_premium == "") {
      app.dialog.alert("Minimum harga premium adalah 0!");
    } else if(harga_basic == "") {
      app.dialog.alert("Minimum harga basic adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "sponsor",
            sponsor_premium : sponsor_premium,
            sponsor_basic : sponsor_basic,
            saldo_ecash_member : saldo_ecash_member,
            harga_premium : harga_premium,
            harga_basic : harga_basic,
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