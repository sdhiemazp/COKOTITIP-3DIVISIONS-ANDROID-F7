function load_decrease(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "users/select_users.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var autocompleteDropdownAll = app.autocomplete.create({
          inputEl: '#username_decrease',
          openIn: 'dropdown',
          source: function (query, render) {
            var results = [];
            for (var i = 0; i < x.length; i++) {
              if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
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

  $$('#btndecrease').on('click', function() {
    var transaction_price = $$('#transaction_price_decrease').val();
    var transaction_message = $$('#transaction_message_decrease').val();
    var balance_decrease = $$('#balance_decrease').val();
    var username = $$('#username_decrease').val();

    if(transaction_price < 1 || transaction_price == "") {
      determinateLoading = false;
      app.dialog.close();
      app.dialog.alert("Minimum jumlah pengurangan saldo member adalah IDR 1!");
    } else {
      app.dialog.confirm("Apakah Anda yakin mengurangi saldo sejumlah " + formatRupiah(transaction_price) + " dari " + username + 
        "?", function() {
        loading();

        app.request({
          method: "POST",
          url: database_connect + "transaction/decrease.php",
            data:{
              transaction_price : transaction_price,
              balance_decrease : balance_decrease,
              transaction_message : transaction_message,
              username : username
            },
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              var x = obj['data'];
              determinateLoading = false;
              app.dialog.close();
              app.dialog.alert(x);
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
  });
}