function load_checkout_pasca(page) {
  var buyer_sku_code = page.router.currentRoute.params.buyer_sku_code;
  loading();

  app.request({
    method: "GET",
    url: database_connect + "digiflazz/price_list_pasca.php", data:{  },
    success: function(data) {
      determinateLoading = false;
      app.dialog.close();

      var obj = JSON.parse(data);
      var x = obj['data']['data'];
      var x_profit = obj['profit'];
      var name = "";
      var profit = 0;
      if(x.length > 0) {
        for(var i = 0; i < x.length; i++) {
          if(x[i]['buyer_sku_code'] == buyer_sku_code) {
            name = x[i]['product_name'];
            profit = x_profit[i]['profit_value'];
            $$('#product_checkout_pasca').append(`<div><span>` + name + `</span></div>`);
            break;
          }
        }
      }

      $$('#btn_checkbill_pasca').on('click', function() {
        var customer_code = $$('#customer_code_checkout_pasca').val();
        if(customer_code == "") {
          app.dialog.alert("Kode pelanggan tidak boleh kosong!");
        } else {
          loading();

          app.request({
            method: "POST",
            url: database_connect + "digiflazz/insert_pascabayar.php",
              data:{
              username : localStorage.username,
              customer_code : customer_code,
              product_id : buyer_sku_code,
              product_name : name
            },
            success: function(data) {
              var obj = JSON.parse(data);
              if(obj['status'] == true) {
                determinateLoading = false;
                app.dialog.close();
                var x = obj['data'];
                page.router.navigate('/checkout_pasca_detail/' + x);
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