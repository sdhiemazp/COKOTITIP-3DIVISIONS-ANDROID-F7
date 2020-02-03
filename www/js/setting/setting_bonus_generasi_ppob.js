function load_setting_bonus_generasi_ppob(page) {
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
        $$('#generasi_ppob_1_setting').val(x[5]['bonus_value']);
        $$('#generasi_ppob_2_setting').val(x[6]['bonus_value']);
        $$('#generasi_ppob_3_setting').val(x[7]['bonus_value']);
        $$('#generasi_ppob_4_setting').val(x[8]['bonus_value']);
        $$('#generasi_ppob_5_setting').val(x[9]['bonus_value']);
        $$('#generasi_ppob_6_setting').val(x[10]['bonus_value']);
        $$('#generasi_ppob_7_setting').val(x[11]['bonus_value']);
        $$('#generasi_ppob_8_setting').val(x[12]['bonus_value']);
        $$('#generasi_ppob_9_setting').val(x[13]['bonus_value']);
        $$('#generasi_ppob_10_setting').val(x[14]['bonus_value']);
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

  $$('#btnsavegenerasippob').on('click', function() {
    loading();

    var generasi_ppob_1 = $$('#generasi_ppob_1_setting').val();
    var generasi_ppob_2 = $$('#generasi_ppob_2_setting').val();
    var generasi_ppob_3 = $$('#generasi_ppob_3_setting').val();
    var generasi_ppob_4 = $$('#generasi_ppob_4_setting').val();
    var generasi_ppob_5 = $$('#generasi_ppob_5_setting').val();
    var generasi_ppob_6 = $$('#generasi_ppob_6_setting').val();
    var generasi_ppob_7 = $$('#generasi_ppob_7_setting').val();
    var generasi_ppob_8 = $$('#generasi_ppob_8_setting').val();
    var generasi_ppob_9 = $$('#generasi_ppob_9_setting').val();
    var generasi_ppob_10 = $$('#generasi_ppob_10_setting').val();

    if(generasi_ppob_1 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 1 adalah 0!");
    } else if(generasi_ppob_2 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 2 adalah 0!");
    } else if(generasi_ppob_3 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 3 adalah 0!");
    } else if(generasi_ppob_4 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 4 adalah 0!");
    } else if(generasi_ppob_5 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 5 adalah 0!");
    } else if(generasi_ppob_6 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 6 adalah 0!");
    } else if(generasi_ppob_7 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 7 adalah 0!");
    } else if(generasi_ppob_8 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 8 adalah 0!");
    } else if(generasi_ppob_9 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 9 adalah 0!");
    } else if(generasi_ppob_10 == "") {
      app.dialog.alert("Minimum bonus generasi PPOB level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "generasi ppob",
            generasi_ppob_1 : generasi_ppob_1,
            generasi_ppob_2 : generasi_ppob_2,
            generasi_ppob_3 : generasi_ppob_3,
            generasi_ppob_4 : generasi_ppob_4,
            generasi_ppob_5 : generasi_ppob_5,
            generasi_ppob_6 : generasi_ppob_6,
            generasi_ppob_7 : generasi_ppob_7,
            generasi_ppob_8 : generasi_ppob_8,
            generasi_ppob_9 : generasi_ppob_9,
            generasi_ppob_10 : generasi_ppob_10,
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