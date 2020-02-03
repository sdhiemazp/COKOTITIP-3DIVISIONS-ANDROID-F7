function load_setting_royalty_repeat_order(page) {
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
        $$('#royalty_ro_1_setting').val(x[40]['bonus_value']);
        $$('#royalty_ro_2_setting').val(x[41]['bonus_value']);
        $$('#royalty_ro_3_setting').val(x[42]['bonus_value']);
        $$('#royalty_ro_4_setting').val(x[43]['bonus_value']);
        $$('#royalty_ro_5_setting').val(x[44]['bonus_value']);
        $$('#royalty_ro_6_setting').val(x[45]['bonus_value']);
        $$('#royalty_ro_7_setting').val(x[46]['bonus_value']);
        $$('#royalty_ro_8_setting').val(x[47]['bonus_value']);
        $$('#royalty_ro_9_setting').val(x[48]['bonus_value']);
        $$('#royalty_ro_10_setting').val(x[49]['bonus_value']);
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

  $$('#btnsaveroyaltyro').on('click', function() {
    loading();

    var royalty_ro_1 = $$('#royalty_ro_1_setting').val();
    var royalty_ro_2 = $$('#royalty_ro_2_setting').val();
    var royalty_ro_3 = $$('#royalty_ro_3_setting').val();
    var royalty_ro_4 = $$('#royalty_ro_4_setting').val();
    var royalty_ro_5 = $$('#royalty_ro_5_setting').val();
    var royalty_ro_6 = $$('#royalty_ro_6_setting').val();
    var royalty_ro_7 = $$('#royalty_ro_7_setting').val();
    var royalty_ro_8 = $$('#royalty_ro_8_setting').val();
    var royalty_ro_9 = $$('#royalty_ro_9_setting').val();
    var royalty_ro_10 = $$('#royalty_ro_10_setting').val();

    if(royalty_ro_1 == "") {
      app.dialog.alert("Minimum royalty repeat order level 1 adalah 0!");
    } else if(royalty_ro_2 == "") {
      app.dialog.alert("Minimum royalty repeat order level 2 adalah 0!");
    } else if(royalty_ro_3 == "") {
      app.dialog.alert("Minimum royalty repeat order level 3 adalah 0!");
    } else if(royalty_ro_4 == "") {
      app.dialog.alert("Minimum royalty repeat order level 4 adalah 0!");
    } else if(royalty_ro_5 == "") {
      app.dialog.alert("Minimum royalty repeat order level 5 adalah 0!");
    } else if(royalty_ro_6 == "") {
      app.dialog.alert("Minimum royalty repeat order level 6 adalah 0!");
    } else if(royalty_ro_7 == "") {
      app.dialog.alert("Minimum royalty repeat order level 7 adalah 0!");
    } else if(royalty_ro_8 == "") {
      app.dialog.alert("Minimum royalty repeat order level 8 adalah 0!");
    } else if(royalty_ro_9 == "") {
      app.dialog.alert("Minimum royalty repeat order level 9 adalah 0!");
    } else if(royalty_ro_10 == "") {
      app.dialog.alert("Minimum royalty repeat order level 10 adalah 0!");
    } else {
      app.request({
        method: "POST",
        url: database_connect + "bonus/update_bonus.php",
          data:{
            bonus : "royalty ro",
            royalty_ro_1 : royalty_ro_1,
            royalty_ro_2 : royalty_ro_2,
            royalty_ro_3 : royalty_ro_3,
            royalty_ro_4 : royalty_ro_4,
            royalty_ro_5 : royalty_ro_5,
            royalty_ro_6 : royalty_ro_6,
            royalty_ro_7 : royalty_ro_7,
            royalty_ro_8 : royalty_ro_8,
            royalty_ro_9 : royalty_ro_9,
            royalty_ro_10 : royalty_ro_10,
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