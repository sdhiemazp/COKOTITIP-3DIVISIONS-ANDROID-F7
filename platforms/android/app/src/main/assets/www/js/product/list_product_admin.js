function load_list_product_admin(page) {
  var category = page.router.currentRoute.params.category;
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
      if(x.length > 0) {
        determinateLoading = false;
        app.dialog.close();
        var arrProduct = new Array();
        for(var i = 0; i < x.length; i++) {
          if(x[i]['category'] == category) {
            if(arrProduct.length == 0) {
              arrProduct.push(x[i]['brand']);
              $$('#listproductadmin').append(`
                <div style="float: left; width: 100%;">
                  <a href="/list_product_detail_admin/` + category + `/` + x[i]['brand'] +
                    `" style="">
                    <div class="card">
                      <div class="card-content card-content-padding">
                        <span>` + x[i]['brand'].toUpperCase() + `</span>
                      </div>
                    </div>
                  </a>
                </div>
              `);
            } else {
              var available = false;
              for(var j = 0; j < arrProduct.length; j++) {
                if(arrProduct[j] == x[i]['brand']) {
                  available = true;
                  break;
                }
              }

              if(available == false) {
                arrProduct.push(x[i]['brand']);
                $$('#listproductadmin').append(`
                  <div style="float: left; width: 100%;">
                    <a href="/list_product_detail_admin/` + category + `/` + x[i]['brand'] +
                      `" style="">
                      <div class="card">
                        <div class="card-content card-content-padding">
                          <span>` + x[i]['brand'].toUpperCase() + `</span>
                        </div>
                      </div>
                    </a>
                  </div>
                `);
              }
            }
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