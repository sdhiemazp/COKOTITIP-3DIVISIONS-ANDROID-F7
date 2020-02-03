function load_increase(page) {
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
          inputEl: '#username_increase',
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

  $$('#btnincrease').on('click', function() {
    var transaction_price = $$('#transaction_price_increase').val();
    var transaction_message = $$('#transaction_message_increase').val();
    var balance_increase = $$('#balance_increase').val();
    var username = $$('#username_increase').val();

    if(transaction_price < 1 || transaction_price == "") {
      determinateLoading = false;
      app.dialog.close();
      app.dialog.alert("Minimum jumlah penambahan saldo/bonus member adalah IDR 1!");
    } else {
      app.dialog.confirm("Apakah Anda yakin menambahkan saldo " + formatRupiah(transaction_price) + " kepada " + 
        username + "?", function() {
        loading();

        app.request({
          method: "POST",
          url: database_connect + "transaction/increase.php",
            data:{
              transaction_price : transaction_price,
              balance_increase : balance_increase,
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