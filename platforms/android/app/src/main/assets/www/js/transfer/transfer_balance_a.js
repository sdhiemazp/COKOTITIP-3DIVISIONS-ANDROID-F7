function load_transfer_balance_a(page) {
  loading();

  app.request({
    method: "GET",
    url: database_connect + "users/select_users.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();

        var autocompleteDropdownAll = app.autocomplete.create({
          inputEl: '#username_transfer_ecash',
          openIn: 'dropdown',
          source: function (query, render) {
            var results = [];
            for (var i = 0; i < x.length; i++) {
              if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
            }

            if(results.length == 0) {
              $$('#btntransferecash').addClass('disabled');
            } else {
              $$('#btntransferecash').removeClass('disabled');
            }
            render(results);
          }
        });
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

  $$('#btntransferecash').on('click', function() {
    app.request({
      method: "GET",
      url: database_connect + "bonus/select_bonus.php", data:{  },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();

          var username_receiver = $$('#username_transfer_ecash').val();
          var count = $$('#count_transfer_ecash').val();
          if(username_receiver == "") {
            app.dialog.alert("Silahkan masukkan member tujuan terlebih dahulu!");
          } else if(parseInt(count) < 50000 || count == "") {
            app.dialog.alert("Minimum jumlah transfer adalah " + formatRupiah("50000") + "!");
          } else if((parseInt(count) + parseInt(x[52]['bonus_value'])) > parseInt(localStorage.user_balance_a)) {
            app.dialog.alert("Saldo Anda tidak cukup untuk melakukan transfer! Minimum saldo Anda yang harus tersisa adalah " + 
              formatRupiah(x[52]['bonus_value'])) + ".";
          } else {
            app.dialog.confirm("Apakah Anda yakin untuk melakukan transfer sebesar " + 
              formatRupiah(count) + " kepada " + username_receiver + "? Nominal transfer Anda akan " +
              "dipotong biaya admin sebesar " + formatRupiah(x[38]['bonus_value']), function() {
              loading();

              app.request({
                method: "POST",
                url: database_connect + "transaction/transfer_balance_a.php",
                  data:{
                    username_sender : localStorage.username,
                    username_receiver : username_receiver,
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