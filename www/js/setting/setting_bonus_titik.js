function load_setting_bonus_titik(page) {
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
        $$('#titik_1_setting').val(x[25]['bonus_value']);
        $$('#titik_2_setting').val(x[26]['bonus_value']);
        $$('#titik_3_setting').val(x[27]['bonus_value']);
        $$('#titik_4_setting').val(x[28]['bonus_value']);
        $$('#titik_5_setting').val(x[29]['bonus_value']);
        $$('#titik_6_setting').val(x[30]['bonus_value']);
        $$('#titik_7_setting').val(x[31]['bonus_value']);
        $$('#titik_8_setting').val(x[32]['bonus_value']);
        $$('#titik_9_setting').val(x[33]['bonus_value']);
        $$('#titik_10_setting').val(x[34]['bonus_value']);
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

  $$('#btnsavetitik').on('click', function() {
    loading();

    var titik_1 = $$('#titik_1_setting').val();
    var titik_2 = $$('#titik_2_setting').val();
    var titik_3 = $$('#titik_3_setting').val();
    var titik_4 = $$('#titik_4_setting').val();
    var titik_5 = $$('#titik_5_setting').val();
    var titik_6 = $$('#titik_6_setting').val();
    var titik_7 = $$('#titik_7_setting').val();
    var titik_8 = $$('#titik_8_setting').val();
    var titik_9 = $$('#titik_9_setting').val();
    var titik_10 = $$('#titik_10_setting').val();

    if(titik_1 == "") {
      app.dialog.alert("Minimum bonus titik level 1 adalah 0!");
    } else if(titik_2 == "") {
      app.dialog.alert("Minimum bonus titik level 2 adalah 0!");
    } else if(titik_3 == "") {
      app.dialog.alert("Minimum bonus titik level 3 adalah 0!");
    } else if(titik_4 == "") {
      app.dialog.alert("Minimum bonus titik level 4 adalah 0!");
    } else if(titik_5 == "") {
      app.dialog.alert("Minimum bonus titik level 5 adalah 0!");
    } else if(titik_6 == "") {
      app.dialog.alert("Minimum bonus titik level 6 adalah 0!");
    } else if(titik_7 == "") {
      app.dialog.alert("Minimum bonus titik level 7 adalah 0!");
    } else if(titik_8 == "") {
      app.dialog.alert("Minimum bonus titik level 8 adalah 0!");
    } else if(titik_9 == "") {
      app.dialog.alert("Minimum bonus titik level 9 adalah 0!");
    } else if(titik_10 == "") {
      app.dialog.alert("Minimum bonus titik level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "titik",
            titik_1 : titik_1,
            titik_2 : titik_2,
            titik_3 : titik_3,
            titik_4 : titik_4,
            titik_5 : titik_5,
            titik_6 : titik_6,
            titik_7 : titik_7,
            titik_8 : titik_8,
            titik_9 : titik_9,
            titik_10 : titik_10,
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