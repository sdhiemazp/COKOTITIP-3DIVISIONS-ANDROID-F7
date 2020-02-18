function load_setting_bonus_titik_ppob(page) {
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
        $$('#titik_ppob_1_setting').val(x[25]['bonus_value']);
        $$('#titik_ppob_2_setting').val(x[26]['bonus_value']);
        $$('#titik_ppob_3_setting').val(x[27]['bonus_value']);
        $$('#titik_ppob_4_setting').val(x[28]['bonus_value']);
        $$('#titik_ppob_5_setting').val(x[29]['bonus_value']);
        $$('#titik_ppob_6_setting').val(x[30]['bonus_value']);
        $$('#titik_ppob_7_setting').val(x[31]['bonus_value']);
        $$('#titik_ppob_8_setting').val(x[32]['bonus_value']);
        $$('#titik_ppob_9_setting').val(x[33]['bonus_value']);
        $$('#titik_ppob_10_setting').val(x[34]['bonus_value']);
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

  $$('#btnsavetitikppob').on('click', function() {
    loading();

    var titik_ppob_1 = $$('#titik_ppob_1_setting').val();
    var titik_ppob_2 = $$('#titik_ppob_2_setting').val();
    var titik_ppob_3 = $$('#titik_ppob_3_setting').val();
    var titik_ppob_4 = $$('#titik_ppob_4_setting').val();
    var titik_ppob_5 = $$('#titik_ppob_5_setting').val();
    var titik_ppob_6 = $$('#titik_ppob_6_setting').val();
    var titik_ppob_7 = $$('#titik_ppob_7_setting').val();
    var titik_ppob_8 = $$('#titik_ppob_8_setting').val();
    var titik_ppob_9 = $$('#titik_ppob_9_setting').val();
    var titik_ppob_10 = $$('#titik_ppob_10_setting').val();

    if(titik_ppob_1 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 1 adalah 0!");
    } else if(titik_ppob_2 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 2 adalah 0!");
    } else if(titik_ppob_3 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 3 adalah 0!");
    } else if(titik_ppob_4 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 4 adalah 0!");
    } else if(titik_ppob_5 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 5 adalah 0!");
    } else if(titik_ppob_6 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 6 adalah 0!");
    } else if(titik_ppob_7 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 7 adalah 0!");
    } else if(titik_ppob_8 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 8 adalah 0!");
    } else if(titik_ppob_9 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 9 adalah 0!");
    } else if(titik_ppob_10 == "") {
      app.dialog.alert("Minimum bonus titik PPOB level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "titik ppob",
            titik_ppob_1 : titik_ppob_1,
            titik_ppob_2 : titik_ppob_2,
            titik_ppob_3 : titik_ppob_3,
            titik_ppob_4 : titik_ppob_4,
            titik_ppob_5 : titik_ppob_5,
            titik_ppob_6 : titik_ppob_6,
            titik_ppob_7 : titik_ppob_7,
            titik_ppob_8 : titik_ppob_8,
            titik_ppob_9 : titik_ppob_9,
            titik_ppob_10 : titik_ppob_10,
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