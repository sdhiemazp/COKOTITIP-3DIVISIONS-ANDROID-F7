function load_setting_on_off_bonus(page) {
  loading();

  app.request({
    method: "GET",
    url: database_connect + "setting/select_setting.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        $$('#bonus_sponsor_mlm_setting_on_off').val(x[0]['setting_status']);
        $$('#bonus_pasangan_mlm_setting_on_off').val(x[1]['setting_status']);
        $$('#bonus_titik_mlm_setting_on_off').val(x[5]['setting_status']);
        $$('#bonus_generasi_mlm_setting_on_off').val(x[2]['setting_status']);
        $$('#bonus_titik_ppob_setting_on_off').val(x[3]['setting_status']);
        $$('#bonus_generasi_ppob_setting_on_off').val(x[4]['setting_status']);
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

  $$('#btnsaveonoffbonus').on('click', function() {
    var bonus_sponsor_mlm = $$('#bonus_sponsor_mlm_setting_on_off').val();
    var bonus_pasangan_mlm = $$('#bonus_pasangan_mlm_setting_on_off').val();
    var bonus_titik_mlm = $$('#bonus_titik_mlm_setting_on_off').val();
    var bonus_generasi_mlm = $$('#bonus_generasi_mlm_setting_on_off').val();
    var bonus_titik_ppob = $$('#bonus_titik_ppob_setting_on_off').val();
    var bonus_generasi_ppob = $$('#bonus_generasi_ppob_setting_on_off').val();

    if(bonus_sponsor_mlm != "On" && bonus_sponsor_mlm != "Off") {
      app.dialog.alert("Status bonus sponsor yang diisi harus 'On' atau 'Off'!");
    } else if(bonus_pasangan_mlm != "On" && bonus_pasangan_mlm != "Off") {
      app.dialog.alert("Status bonus pasangan yang diisi harus 'On' atau 'Off'!");
    } else if(bonus_titik_mlm != "On" && bonus_titik_mlm != "Off") {
      app.dialog.alert("Status bonus titik MLM yang diisi harus 'On' atau 'Off'!");
    } else if(bonus_generasi_mlm != "On" && bonus_generasi_mlm != "Off") {
      app.dialog.alert("Status bonus generasi MLM yang diisi harus 'On' atau 'Off'!");
    } else if(bonus_titik_ppob != "On" && bonus_titik_ppob != "Off") {
      app.dialog.alert("Status yang titik PPOB diisi harus 'On' atau 'Off'!");
    } else if(bonus_generasi_ppob != "On" && bonus_generasi_ppob != "Off") {
      app.dialog.alert("Status yang generasi PPOB diisi harus 'On' atau 'Off'!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "setting/update_setting.php",
          data:{
            bonus_sponsor_mlm : bonus_sponsor_mlm,
            bonus_pasangan_mlm : bonus_pasangan_mlm,
            bonus_titik_mlm : bonus_titik_mlm,
            bonus_generasi_mlm : bonus_generasi_mlm,
            bonus_titik_ppob : bonus_titik_ppob,
            bonus_generasi_ppob : bonus_generasi_ppob
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