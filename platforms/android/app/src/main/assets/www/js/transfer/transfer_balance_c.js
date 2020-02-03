function load_transfer_balance_c(page) {
  $$('#available_transfer_bonus').val(localStorage.user_balance_c);

  $$('#btntransferbonus').on('click', function() {
    app.request({
      method: "GET",
      url: database_connect + "bonus/select_bonus.php", data:{  },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();

          var count = $$('#count_transfer_bonus').val();
          if(parseInt(count) < 50000 || count == "") {
            app.dialog.alert("Minimum jumlah transfer adalah " + formatRupiah("50000") + "!");
          } else if((parseInt(count) + parseInt(x[53]['bonus_value'])) > parseInt(localStorage.user_balance_c)) {
            app.dialog.alert("Saldo Anda tidak cukup untuk melakukan transfer! Minimum saldo Anda yang harus tersisa adalah " + 
              formatRupiah(x[53]['bonus_value'])) + ".";
          } else {
            app.dialog.confirm("Apakah Anda yakin untuk melakukan transfer bonus sebesar " + 
              formatRupiah(count) + " ke saldo E-Cash Anda? Nominal transfer Anda akan " +
              "dipotong biaya admin sebesar " + formatRupiah(x[50]['bonus_value']), function() {
              loading();

              app.request({
                method: "POST",
                url: database_connect + "transaction/transfer_balance_c.php",
                  data:{
                    username : localStorage.username,
                    count : count
                  },
                success: function(data) {
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(obj['data']);
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
            });  
          }
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
  });
}