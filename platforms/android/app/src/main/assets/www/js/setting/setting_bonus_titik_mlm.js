function load_setting_bonus_titik_mlm(page) {
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
        $$('#titik_mlm_1_setting').val(x[55]['bonus_value']);
        $$('#titik_mlm_2_setting').val(x[56]['bonus_value']);
        $$('#titik_mlm_3_setting').val(x[57]['bonus_value']);
        $$('#titik_mlm_4_setting').val(x[58]['bonus_value']);
        $$('#titik_mlm_5_setting').val(x[59]['bonus_value']);
        $$('#titik_mlm_6_setting').val(x[60]['bonus_value']);
        $$('#titik_mlm_7_setting').val(x[61]['bonus_value']);
        $$('#titik_mlm_8_setting').val(x[62]['bonus_value']);
        $$('#titik_mlm_9_setting').val(x[63]['bonus_value']);
        $$('#titik_mlm_10_setting').val(x[64]['bonus_value']);
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

  $$('#btnsavetitikmlm').on('click', function() {
    loading();

    var titik_mlm_1 = $$('#titik_mlm_1_setting').val();
    var titik_mlm_2 = $$('#titik_mlm_2_setting').val();
    var titik_mlm_3 = $$('#titik_mlm_3_setting').val();
    var titik_mlm_4 = $$('#titik_mlm_4_setting').val();
    var titik_mlm_5 = $$('#titik_mlm_5_setting').val();
    var titik_mlm_6 = $$('#titik_mlm_6_setting').val();
    var titik_mlm_7 = $$('#titik_mlm_7_setting').val();
    var titik_mlm_8 = $$('#titik_mlm_8_setting').val();
    var titik_mlm_9 = $$('#titik_mlm_9_setting').val();
    var titik_mlm_10 = $$('#titik_mlm_10_setting').val();

    if(titik_mlm_1 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 1 adalah 0!");
    } else if(titik_mlm_2 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 2 adalah 0!");
    } else if(titik_mlm_3 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 3 adalah 0!");
    } else if(titik_mlm_4 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 4 adalah 0!");
    } else if(titik_mlm_5 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 5 adalah 0!");
    } else if(titik_mlm_6 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 6 adalah 0!");
    } else if(titik_mlm_7 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 7 adalah 0!");
    } else if(titik_mlm_8 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 8 adalah 0!");
    } else if(titik_mlm_9 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 9 adalah 0!");
    } else if(titik_mlm_10 == "") {
      app.dialog.alert("Minimum bonus titik MLM level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "titik mlm",
            titik_mlm_1 : titik_mlm_1,
            titik_mlm_2 : titik_mlm_2,
            titik_mlm_3 : titik_mlm_3,
            titik_mlm_4 : titik_mlm_4,
            titik_mlm_5 : titik_mlm_5,
            titik_mlm_6 : titik_mlm_6,
            titik_mlm_7 : titik_mlm_7,
            titik_mlm_8 : titik_mlm_8,
            titik_mlm_9 : titik_mlm_9,
            titik_mlm_10 : titik_mlm_10,
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