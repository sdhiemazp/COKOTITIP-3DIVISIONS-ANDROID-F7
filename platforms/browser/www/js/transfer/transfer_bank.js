function load_transfer_bank(page) {
  $$('#available_transfer_bank').val(localStorage.user_balance_a);

  app.request({
    method: "GET",
    url: database_connect + "bank/select_bank.php", data:{ },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        $$('#bank_id_transfer_bank').append(`<option value="">-- Pilih Bank --</option>`);
        for(var i = 0; i < x.length; i++) {
          $$('#bank_id_transfer_bank').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
        }
      } else {
        determinateLoading = false;
        app.dialog.close();
        // app.dialog.alert(obj['message']);
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

  $$('#btntransferbank').on('click', function() {
    app.request({
      method: "GET",
      url: database_connect + "bonus/select_bonus.php", data:{  },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();

          var bank_id = $$('#bank_id_transfer_bank').val();
          var name = $$('#name_transfer_bank').val();
          var number = $$('#number_transfer_bank').val();
          var count = $$('#count_transfer_bank').val();
          if(parseInt(count) < 50000 || count == "") {
            app.dialog.alert("Minimum jumlah transfer adalah " + formatRupiah("50000") + "!");
          } else if((parseInt(count) + parseInt(x[52]['bonus_value'])) > parseInt(localStorage.user_balance_a)) {
            app.dialog.alert("Saldo Anda tidak cukup untuk melakukan transfer! Minimum saldo Anda yang harus tersisa adalah " + 
              formatRupiah(x[52]['bonus_value'])) + ".";
          } else {
            app.dialog.confirm("Apakah Anda yakin untuk melakukan transfer bank sebesar " + 
              formatRupiah(count) + " kepada " + number + " a/n " + name + "? Nominal transfer Anda akan " +
              "dipotong biaya admin sebesar " + formatRupiah(x[54]['bonus_value']), function() {
              loading();

              app.request({
                method: "POST",
                url: database_connect + "transaction/transfer_bank.php",
                  data:{
                    username : localStorage.username,
                    bank_id : bank_id,
                    name : name,
                    number : number,
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