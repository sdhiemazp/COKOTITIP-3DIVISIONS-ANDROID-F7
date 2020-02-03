function load_checkout_pra(page) {
  var buyer_sku_code = page.router.currentRoute.params.buyer_sku_code;
  $$('#btn_checkout').hide();
  $$('#checkout_detail').hide();
  loading();

  $$('#btncontact').on('click', function() {
    navigator.contacts.pickContact(function(contact){
      var c = JSON.stringify(contact);
      console.log(c);
      var x = JSON.parse(c);
      $$('#customer_no_checkout').val(x['phoneNumbers'][0]['value'].replace(" ", ""));
      },function(err){
          console.log('Error: ' + err);
      });
  });

  app.request({
    method: "GET",
    url: database_connect + "digiflazz/price_list.php", data:{  },
    success: function(data) {
      var tagihan = 0;
      var saldo = 0;
      var obj = JSON.parse(data);
      var x = obj['data']['data'];
      var x_profit = obj['profit'];
      if(x.length > 0) {
        for(var i = 0; i < x.length; i++) {
          if(x[i]['buyer_sku_code'] == buyer_sku_code) {
            $$('#product_checkout').append(`
              <div>
                <span>` + x[i]['product_name'] + `</span><br>
                <span>` + formatRupiah((parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']))) + `</span>
              </div>
            `);
            tagihan = parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']);
            $$('#tagihan_checkout').html(formatRupiah((parseInt(x[i]['price']) + parseInt(x_profit[i]['profit_value']))));
            break;
          }
        }

        app.request({
          method: "POST",
          url: database_connect + "users/show_users.php", data:{ username : localStorage.username },
          success: function(data) {
            var obj_show_user = JSON.parse(data);
            if(obj_show_user['status'] == true) {
              var x_show_user = obj_show_user['data'];
              determinateLoading = false;
              app.dialog.close();
              if(localStorage.user_type == "Admin") {
                app.request({
                  method: "GET",
                  url: database_connect + "digiflazz/cek_saldo.php", data:{  },
                  success: function(data) {
                    var obj_show_user_admin = JSON.parse(data);
                    $$('#saldo_checkout').html(formatRupiah(obj_show_user_admin['data']['deposit']));
                    saldo = obj_show_user_admin['data']['deposit'];
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
              } else {
                $$('#saldo_checkout').html(formatRupiah(x_show_user[0]['user_balance_a']));
                saldo = x_show_user[0]['user_balance_a'];
              }

              $$('#checkout_detail').show();
              $$('#btn_checkout').show();
              var total = saldo - tagihan;
              if(total > 0) {
                $$('#total_checkout').html('<div style="color:green;">Anda dapat melakukan transaksi!</div>');
                $$('#btn_checkout').removeClass('disabled');
              } else {
                $$('#total_checkout').html('<div style="color:red;">Saldo and kurang. Anda tidak dapat melakukan transaksi!</div>');
              }
            } else {
              determinateLoading = false;
              app.dialog.close();
              app.dialog.alert(obj_show_user['message']);
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

        $$('#btn_checkout').on('click', function() {
          var customer_no = $$('#customer_no_checkout').val();
          var user_password = $$('#password_checkout').val();
          if(customer_no == "") {
            app.dialog.alert("Nomor telepon atau token tidak boleh kosong!");
          } else if(user_password == "") {
            app.dialog.alert("Kata sandi tidak boleh kosong!");
          } else {
            app.request.post(database_connect + "login.php", { username : localStorage.username, user_password : user_password }, function(data) {
              var obj = JSON.parse(data);
              if(obj['status'] == true) {
                app.dialog.confirm("Apakah Anda yakin untuk memproses transaksi ini?",function(){
                  loading();

                  app.request({
                    method: "POST",
                    url: database_connect + "digiflazz/buy_product.php",
                      data:{
                      transaction_price : tagihan,
                      username : localStorage.username,
                      customer_no : customer_no,
                      product_id : buyer_sku_code
                    },
                    success: function(data) {
                      var obj = JSON.parse(data);
                      if(obj['status'] == true) {
                        var x = obj['data'];
                        determinateLoading = false;
                        app.dialog.close();
                        app.dialog.alert(x, 'Notifikasi', function(){
                          page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
                });
              } else {
                app.dialog.alert("Kata sandi yang Anda masukkan salah!");
              }
            });
          }
        });
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