function load_withdraw(page) {
  loading();
  
  if(localStorage.user_level == "Basic") {
    $$('#option_bonus_pasti').hide();
  }

  app.request({
    method: "POST",
    url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        localStorage.user_balance_b = x[0]['user_balance_b'];
        localStorage.user_balance_c = x[0]['user_balance_c'];
        $$('#user_balance_withdraw').val(x[0]['user_balance_b']);
        $$('#bank_name_withdraw').val(x[0]['bank_name']);
        $$('#user_account_name_withdraw').val(x[0]['user_account_name']);
        $$('#user_account_number_withdraw').val(x[0]['user_account_number']);
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

  $$('#user_balance_resource_withdraw').on('change', function() {
    if($$('#user_balance_resource_withdraw').val() == "Bonus Sponsor") {
      $$('#user_balance_withdraw').val(localStorage.user_balance_b);
    } else {
      $$('#user_balance_withdraw').val(localStorage.user_balance_c);
    }
  });

  $$('#btnwithdraw').on('click', function() {
    var transaction_message = $$('#user_balance_resource_withdraw').val();
    var transaction_price = $$('#transaction_price_withdraw').val();
    if($$('#user_balance_withdraw').val() < 50000) {
      app.dialog.alert("Saldo bonus yang Anda pilih kurang dari IDR 50.000!");
    } else {
      if(parseInt(transaction_price) < 50000) {
        app.dialog.alert("Minimal penarikan adalah IDR 50.000!");
      } else {
        if(parseInt(transaction_price) > parseInt($$('#user_balance_withdraw').val())) {
          app.dialog.alert("Saldo bonus yang Anda pilih tidak cukup!");
        } else {
          if(transaction_message == "Bonus Pasti" && localStorage.user_level == "Basic") {
            app.dialog.alert("Bonus pasti hanya dapat ditarik jika Anda telah mencapai level Premium!");
          } else {
            app.dialog.confirm("Apakah Anda yakin untuk memproses transaksi withdraw sebesar " + 
              formatRupiah(transaction_price) + " ini?", function() {
              loading();

              app.request({
                method: "POST",
                url: database_connect + "transaction/withdraw/insert_withdraw.php",
                  data:{
                    username : localStorage.username,
                    transaction_price : transaction_price,
                    transaction_message : transaction_message
                  },
                success: function(data) {
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data'];
                    determinateLoading = false;
                    app.dialog.close();
                    page.router.navigate('/show_withdraw/' + x,{ force: true, ignoreCache: true });
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
        }
      }
    }
  });
}