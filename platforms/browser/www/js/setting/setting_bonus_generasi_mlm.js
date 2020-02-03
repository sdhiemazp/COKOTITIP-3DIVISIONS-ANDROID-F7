function load_setting_bonus_generasi_mlm(page) {
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
        $$('#generasi_mlm_1_setting').val(x[15]['bonus_value']);
        $$('#generasi_mlm_2_setting').val(x[16]['bonus_value']);
        $$('#generasi_mlm_3_setting').val(x[17]['bonus_value']);
        $$('#generasi_mlm_4_setting').val(x[18]['bonus_value']);
        $$('#generasi_mlm_5_setting').val(x[19]['bonus_value']);
        $$('#generasi_mlm_6_setting').val(x[20]['bonus_value']);
        $$('#generasi_mlm_7_setting').val(x[21]['bonus_value']);
        $$('#generasi_mlm_8_setting').val(x[22]['bonus_value']);
        $$('#generasi_mlm_9_setting').val(x[23]['bonus_value']);
        $$('#generasi_mlm_10_setting').val(x[24]['bonus_value']);
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

  $$('#btnsavegenerasimlm').on('click', function() {
    loading();

    var generasi_mlm_1 = $$('#generasi_mlm_1_setting').val();
    var generasi_mlm_2 = $$('#generasi_mlm_2_setting').val();
    var generasi_mlm_3 = $$('#generasi_mlm_3_setting').val();
    var generasi_mlm_4 = $$('#generasi_mlm_4_setting').val();
    var generasi_mlm_5 = $$('#generasi_mlm_5_setting').val();
    var generasi_mlm_6 = $$('#generasi_mlm_6_setting').val();
    var generasi_mlm_7 = $$('#generasi_mlm_7_setting').val();
    var generasi_mlm_8 = $$('#generasi_mlm_8_setting').val();
    var generasi_mlm_9 = $$('#generasi_mlm_9_setting').val();
    var generasi_mlm_10 = $$('#generasi_mlm_10_setting').val();

    if(generasi_mlm_1 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 1 adalah 0!");
    } else if(generasi_mlm_2 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 2 adalah 0!");
    } else if(generasi_mlm_3 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 3 adalah 0!");
    } else if(generasi_mlm_4 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 4 adalah 0!");
    } else if(generasi_mlm_5 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 5 adalah 0!");
    } else if(generasi_mlm_6 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 6 adalah 0!");
    } else if(generasi_mlm_7 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 7 adalah 0!");
    } else if(generasi_mlm_8 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 8 adalah 0!");
    } else if(generasi_mlm_9 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 9 adalah 0!");
    } else if(generasi_mlm_10 == "") {
      app.dialog.alert("Minimum bonus generasi MLM level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "generasi mlm",
            generasi_mlm_1 : generasi_mlm_1,
            generasi_mlm_2 : generasi_mlm_2,
            generasi_mlm_3 : generasi_mlm_3,
            generasi_mlm_4 : generasi_mlm_4,
            generasi_mlm_5 : generasi_mlm_5,
            generasi_mlm_6 : generasi_mlm_6,
            generasi_mlm_7 : generasi_mlm_7,
            generasi_mlm_8 : generasi_mlm_8,
            generasi_mlm_9 : generasi_mlm_9,
            generasi_mlm_10 : generasi_mlm_10,
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