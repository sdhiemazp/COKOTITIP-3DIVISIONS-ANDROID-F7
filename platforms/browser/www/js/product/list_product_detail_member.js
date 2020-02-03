function load_list_product_detail_member(page) {
  var category = page.router.currentRoute.params.category;
  var brand = page.router.currentRoute.params.brand;
  $$('#headerproductdetailmember').html(category.toUpperCase() + " " + brand.toUpperCase());
  loading();

  var url = "digiflazz/price_list.php";
  if(category == "Pascabayar") {
    url = "digiflazz/price_list_pasca.php";
  }

  app.request({
    method: "GET",
    url: database_connect + url, data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      var x = obj['data']['data'];
      var x_profit = obj['profit'];
      if(x.length > 0) {
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          if(x[i]['category'] == category && x[i]['brand'] == brand) {
            var harga = "";
            var url_checkout = "/checkout_pasca/";
            if(category != "Pascabayar") {
              harga = formatRupiah(parseInt(x_profit[i]['profit_value']) + parseInt(x[i]['price']));
              url_checkout = "/checkout/";
            }
            $$('#listproductdetailmember').append(`
              <div style="float: left; width: 100%;">
                <a href="` + url_checkout + x[i]['buyer_sku_code'] + `" style="">
                  <div class="card">
                    <div class="card-content card-content-padding">
                      <span>` + x[i]['product_name'] + `</span><br>
                      <span>` + harga + `</span>
                    </div>
                  </div>
                </a>
              </div>
            `);
          }
        }
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert('Tidak ada produk');
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