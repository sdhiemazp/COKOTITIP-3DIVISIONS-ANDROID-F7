function load_list_product_detail_admin(page) {
  var category = page.router.currentRoute.params.category;
  var brand = page.router.currentRoute.params.brand;
  $$('#headerproductdetailadmin').html(category.toUpperCase() + " " + brand.toUpperCase());
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
      var x_price_list = obj['data']['data'];
      var x_profit = obj['profit'];
      if(x_price_list.length > 0) {
        for(var i = 0; i < x_price_list.length; i++) {
          if(x_price_list[i]['category'] == category && x_price_list[i]['brand'] == brand) {
            var status = "Ditampilkan";
            if(x_price_list[i]['buyer_product_status'] == false) {
              status = "Disembunyikan";
            }

            var product_name = x_price_list[i]['product_name'];
            var price = "";
            if(category != "Pascabayar") {
              price = formatRupiah(x_price_list[i]['price']) + "<br>";
            }
            var seller_name = x_price_list[i]['seller_name']  + "<br>";
            var buyer_sku_code = x_price_list[i]['buyer_sku_code'];

            var a_selected = "";
            var b_selected = "";
            var c_selected = "";
            var d_selected = "";
            var e_selected = "";

            if(x_profit[i]['profit_id'] == 1) {
              a_selected = "checked";
            } else if(x_profit[i]['profit_id'] == 2) {
              b_selected = "checked";
            } else if(x_profit[i]['profit_id'] == 3) {
              c_selected = "checked";
            } else if(x_profit[i]['profit_id'] == 4) {
              d_selected = "checked";
            } else if(x_profit[i]['profit_id'] == 5) {
              e_selected = "checked";
            }

            $$('#listproductdetailadmin').append(`
              <div style="float: left; width: 100%;">
                 <div class="card">
                  <div class="card-content card-content-padding">
                     <span>` + product_name + `</span><span style="float: right;">` + status + `</span><br>
                     <span>` + price + `</span>
                     <span>` + seller_name + `</span>
                     <span>
                      <input type="radio" ` +a_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="1" data-value="1"> A
                        <input type="radio" ` +b_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="2" data-value="2"> B
                        <input type="radio" ` +c_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="3" data-value="3"> C
                        <input type="radio" ` +d_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="4" data-value="4"> D
                        <input type="radio" ` +e_selected+ ` data-id="`+buyer_sku_code+`" class="pulsa_profit" name="profit`+i+`" value="5" data-value="5"> E
                    </span>
                  </div>
                 </div>
              </div>
            `);

            $$('.pulsa_profit').on('click', function () {
              var id = $$(this).data('id');
              var value = $$(this).data('value');
              app.request({
                 method:"POST",
                url:database_connect + "product_profit/update_product_profit.php",
                data:{
                  product_id : id,
                  profit_id : value
                },
                success:function(data){
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                      var x = obj['data'];
                      determinateLoading = false;
                      app.dialog.close();
                  } else {
                      determinateLoading = false;
                      app.dialog.close();
                      app.dialog.alert(obj['message']);
                  }
                },
                error:function(data){
                  determinateLoading = false;
                  app.dialog.close();
                  var toastBottom = app.toast.create({
                      text: ERRNC,
                      closeTimeout: 2000,
                  });
                  toastBottom.open();
                  page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                }
              });
            });
          }
        }
        app.dialog.close();
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