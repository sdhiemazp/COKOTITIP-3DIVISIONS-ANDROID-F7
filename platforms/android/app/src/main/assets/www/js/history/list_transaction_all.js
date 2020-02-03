function load_list_transaction_all(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type: 'Decrease' },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          var message_accept = "";
          var message_decline = "";
          var withdraw = "";

          if(x[i]['transaction_status'] == "Failed" || x[i]['transaction_status'] == "Success") {
            var color = "";
            if(x[i]['transaction_status'] == "Failed") {
              color = "red";
            } else {
              color = "green";
            }

            var price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
            $$('#listtransaction').append(`
              <div class="card demo-facebook-card">
                <div class="card-header">
                <div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + color + `">` + x[i]['transaction_status'] + `</span></div>
                <div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + `</b></div>
                <div class="demo-facebook-price">` + price + `</div>
                <div class="demo-facebook-price">` + x[i]['transaction_message'].toUpperCase() + `</div>
                <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
                </div>
              </div>
            `);
          } 
        }
      } else {
        determinateLoading = false;
        app.dialog.close();
        $$('#listtransaction').html(`<center><p style="margin-top: 40%; text-align: center;">` + 
          obj['message'] + `</p></center>`);
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

  $$('#category_transaction_selection').on('change', function () {
    var category = $$('#category_transaction_selection').val();
    $$('#listtransaction').html('');
    loading();

    app.request({
      method: "POST",
      url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type : category, username : "" },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          for(var i = 0; i < x.length; i++) {
            var message_accept = "";
            var message_decline = "";
            var withdraw = "";

            if(x[i]['transaction_status'] == "Failed" || x[i]['transaction_status'] == "Success") {
              var color = "white";
              if(x[i]['transaction_status'] == "Failed") {
                color = "red";
              } else {
                color = "green";
              }

              var price = "";
              var sell = "";
              if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
                price = formatRupiah((parseInt(x[i]['transaction_price'])));
                if(x[i]['transaction_type'] == "Sell") {
                  x[i]['transaction_type'] = "Prabayar";
                  sell = "Ket/SN : ";
                }
              } else if(x[i]['transaction_type'] == "Repeat Order") {
                price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
                x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
              } else {
                price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
              }

              var balance = "";
              if(x[i]['transaction_balance_left'] != "") {
                balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
              }

              var bank_name = "";
              var adminfee = "";
              if(x[i]['transaction_type'] == "Deposit") {
                message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
              } else if(x[i]['transaction_type'] == "Withdraw") {
                message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
                message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
                
                withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
                  x[i]['user_account_number'] + `</div>`;
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              } else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL TRANSFER : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                  parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              } else if(x[i]['transaction_type'] == "Transfer Masuk") {
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL PENERIMAAN : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                  parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              }

              $$('#listtransaction').append(`
                <div class="card demo-facebook-card">
                  <div class="card-header">
                  <div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + 
                    color + `">` + x[i]['transaction_status'] + `</span></div>
                  <div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + 
                    `</b> <span style="float: right; color: orange;">` + balance + `<span></div>
                  <div class="demo-facebook-price">` + price + `</div>
                  <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
                  <div class="demo-facebook-price">` + sell + x[i]['transaction_message'].toUpperCase() + `</div>` + adminfee + `
                  <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
                  </div>
                </div>
              `);
            } else {
              if(x[i]['transaction_type'] != "Sell" && x[i]['transaction_type'] != "Pascabayar") {
                var bank_name
                var adminfee = "";
                var price = 0;
                if(x[i]['transaction_type'] == "Deposit") {
                  message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                  message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                  price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
                  bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
                } else if(x[i]['transaction_type'] == "Withdraw") {
                  message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
                  message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
                  
                  withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
                    x[i]['user_account_number'] + `</div>`;
                  adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                    <div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
                  price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
                } if(x[i]['transaction_type'] == "Repeat Order") {
                  message_accept = "Apakah Anda telah selesai memproses repeat order ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                  message_decline = "Apakah Anda yakin ini menolak repeat order ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                  x[i]['transaction_message'] = x[i]['transaction_message'] + " buah";
                  price = ((parseInt(x[i]['transaction_price']) * (parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
                }

                $$('#listtransaction').append(`
                  <div class="card demo-facebook-card">
                    <div class="card-header">
                      <div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right;">` + x[i]['transaction_status'] + `</span></div>
                      <div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + `</b> ` + x[i]['transaction_message'].toUpperCase() + `</div>
                      <div class="demo-facebook-price">` + formatRupiah(price) + `</div>` + adminfee + `
                      <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
                    </div>
                    <div class="card-footer">
                      <a class="link color-green accept_transaction" style="width: 50%; text-align: center;" data-id="` +
                        x[i]['transaction_id'] + `" data-message_accept="` + message_accept + `" data-balance="` +
                        price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Selesai</a>
                      <a class="link color-red decline_transaction" style="width: 50%; text-align: center;" data-id="` +
                        x[i]['transaction_id'] + `" data-message_decline="` + message_decline + `" data-balance="` +
                        price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Tolak</a>
                    </div>
                  </div>
                `);
              }
            }
          }

          $$('.accept_transaction').on('click', function () {
                    var id = $$(this).data('id');
                    var message_accept = $$(this).data('message_accept');
                    var user_balance = $$(this).data('balance');
                    var username = $$(this).data('username');
                    var transaction_message = $$(this).data('message');
                    var transaction_type = $$(this).data('type');
                    app.dialog.confirm(message_accept,function(){
                      loading();
                      app.request({
                        method:"POST",
                        url:database_connect + "transaction/accept_transaction.php",
                        data:{
                          transaction_id : id,
                          user_balance : user_balance,
                          username : username,
                          transaction_message : transaction_message,
                          transaction_type : transaction_type
                        },
                        success:function(data){
                          var obj = JSON.parse(data);
                          if(obj['status'] == true) {
                            var x = obj['data'];
                            determinateLoading = false;
                            app.dialog.close();
                            app.dialog.alert(x,'Notifikasi',function(){
                              mainView.router.refreshPage();
                            });
                          }
                          else {
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
                  });

                  $$('.decline_transaction').on('click', function () {
                    var id = $$(this).data('id');
                    var message_decline = $$(this).data('message_decline');
                    var user_balance = $$(this).data('balance');
                    var username = $$(this).data('username');
                    var transaction_type = $$(this).data('type');
                    app.dialog.confirm(message_decline,function(){
                      loading();
                      app.request({
                        method:"POST",
                        url:database_connect + "transaction/decline_transaction.php",
                        data:{
                          transaction_id : id,
                          user_balance : user_balance,
                          username : username,
                          transaction_type : transaction_type
                        },
                        success:function(data){
                          var obj = JSON.parse(data);
                          if(obj['status'] == true) {
                            var x = obj['data'];
                            determinateLoading = false;
                            app.dialog.close();
                            app.dialog.alert(x,'Notifikasi',function(){
                              mainView.router.refreshPage();
                            });
                          }
                          else {
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
                  });
        } else {
          determinateLoading = false;
          app.dialog.close();
          $$('#listtransaction').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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

  $$('#txtsearchusertransaction').on('keyup', function() {
    var username = $$('#txtsearchusertransaction').val();
    var category = $$('#category_transaction_selection').val();

    app.request({
      method: "POST",
      url: database_connect + "transaction/select_transaction_all.php", data:{ transaction_type : category, username : username },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          $$('#listtransaction').html('');
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          for(var i = 0; i < x.length; i++) {
            var message_accept = "";
            var message_decline = "";
            var withdraw = "";

            if(x[i]['transaction_status'] == "Failed" || x[i]['transaction_status'] == "Success") {
              var color = "white";
              if(x[i]['transaction_status'] == "Failed") {
                color = "red";
              } else {
                color = "green";
              }

              var price = "";
              var sell = "";
              if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
                price = formatRupiah((parseInt(x[i]['transaction_price'])));
                if(x[i]['transaction_type'] == "Sell") {
                  x[i]['transaction_type'] = "Prabayar";
                  sell = "Ket/SN : ";
                }
              } else if(x[i]['transaction_type'] == "Repeat Order") {
                price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
                x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
              } else {
                price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
              }

              var balance = "";
              if(x[i]['transaction_balance_left'] != "") {
                balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
              }

              var bank_name = "";
              var adminfee = "";
              if(x[i]['transaction_type'] == "Deposit") {
                message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
              } else if(x[i]['transaction_type'] == "Withdraw") {
                message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
                message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
                
                withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
                  x[i]['user_account_number'] + `</div>`;
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              } else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL TRANSFER : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                  parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              } else if(x[i]['transaction_type'] == "Transfer Masuk") {
                adminfee = `<div class="demo-facebook-price">BIAYA ADMIN : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                  <div class="demo-facebook-price">TOTAL PENERIMAAN : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                  parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
              }

              $$('#listtransaction').append(`
                <div class="card demo-facebook-card">
                  <div class="card-header">
                  <div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right; color: ` + 
                    color + `">` + x[i]['transaction_status'] + `</span></div>
                  <div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + 
                    `</b> <span style="float: right; color: orange;">` + balance + `<span></div>
                  <div class="demo-facebook-price">` + price + `</div>
                  <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
                  <div class="demo-facebook-price">` + sell + x[i]['transaction_message'].toUpperCase() + `</div>` + adminfee + `
                  <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
                  </div>
                </div>
              `);
            } else {
              if(x[i]['transaction_type'] != "Sell" && x[i]['transaction_type'] != "Pascabayar") {
                var bank_name
                var adminfee = "";
                var price = 0;
                if(x[i]['transaction_type'] == "Deposit") {
                  message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                  message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                  price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
                  bank_name = " (" + x[i]['bank_name'].toUpperCase() + ")";
                } else if(x[i]['transaction_type'] == "Withdraw") {
                  message_accept = "Apakah Anda telah selesai memproses permintaan ini? Pastikan Anda telah melakukan transfer ke rekening member Anda!";
                  message_decline = "Apakah Anda yakin ini menolak permintaan ini? Pastikan Anda belum melakukan transfer ke rekening member Anda!";
                  
                  withdraw =  `<hr><div class='demo-facebook-name'>` + x[i]['bank_name'] + `<br>A/N ` + x[i]['user_account_name'] + `<br>` +
                    x[i]['user_account_number'] + `</div>`;
                  adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                    <div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
                  price = (parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code']));
                } if(x[i]['transaction_type'] == "Repeat Order") {
                  message_accept = "Apakah Anda telah selesai memproses repeat order ini? Pastikan member Anda telah melakukan transfer ke rekening Anda!";
                  message_decline = "Apakah Anda yakin ini menolak repeat order ini? Pastikan member Anda belum melakukan transfer ke rekening Anda!";

                  x[i]['transaction_message'] = x[i]['transaction_message'] + " buah";
                  price = ((parseInt(x[i]['transaction_price']) * (parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
                }

                $$('#listtransaction').append(`
                  <div class="card demo-facebook-card">
                    <div class="card-header">
                      <div class="demo-facebook-name">` + x[i]['username'] + `<span style="float: right;">` + x[i]['transaction_status'] + `</span></div>
                      <div class="demo-facebook-price"><b>` + x[i]['transaction_type'].toUpperCase() + bank_name + `</b> ` + x[i]['transaction_message'].toUpperCase() + `</div>
                      <div class="demo-facebook-price">` + formatRupiah(price) + `</div>` + adminfee + `
                      <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>` + withdraw + `
                    </div>
                    <div class="card-footer">
                      <a class="link color-green accept_transaction" style="width: 50%; text-align: center;" data-id="` +
                        x[i]['transaction_id'] + `" data-message_accept="` + message_accept + `" data-balance="` +
                        price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Selesai</a>
                      <a class="link color-red decline_transaction" style="width: 50%; text-align: center;" data-id="` +
                        x[i]['transaction_id'] + `" data-message_decline="` + message_decline + `" data-balance="` +
                        price + `" data-username="` + x[i]['username'] + `" data-type="` + x[i]['transaction_type'] + `" data-message="` + x[i]['transaction_message'] + `">Tolak</a>
                    </div>
                  </div>
                `);
              }
            }
          }

          $$('.accept_transaction').on('click', function () {
                    var id = $$(this).data('id');
                    var message_accept = $$(this).data('message_accept');
                    var user_balance = $$(this).data('balance');
                    var username = $$(this).data('username');
                    var transaction_message = $$(this).data('message');
                    var transaction_type = $$(this).data('type');
                    app.dialog.confirm(message_accept,function(){
                      loading();
                      app.request({
                        method:"POST",
                        url:database_connect + "transaction/accept_transaction.php",
                        data:{
                          transaction_id : id,
                          user_balance : user_balance,
                          username : username,
                          transaction_message : transaction_message,
                          transaction_type : transaction_type
                        },
                        success:function(data){
                          var obj = JSON.parse(data);
                          if(obj['status'] == true) {
                            var x = obj['data'];
                            determinateLoading = false;
                            app.dialog.close();
                            app.dialog.alert(x,'Notifikasi',function(){
                              mainView.router.refreshPage();
                            });
                          }
                          else {
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
                  });

                  $$('.decline_transaction').on('click', function () {
                    var id = $$(this).data('id');
                    var message_decline = $$(this).data('message_decline');
                    var user_balance = $$(this).data('balance');
                    var username = $$(this).data('username');
                    var transaction_type = $$(this).data('type');
                    app.dialog.confirm(message_decline,function(){
                      loading();
                      app.request({
                        method:"POST",
                        url:database_connect + "transaction/decline_transaction.php",
                        data:{
                          transaction_id : id,
                          user_balance : user_balance,
                          username : username,
                          transaction_type : transaction_type
                        },
                        success:function(data){
                          var obj = JSON.parse(data);
                          if(obj['status'] == true) {
                            var x = obj['data'];
                            determinateLoading = false;
                            app.dialog.close();
                            app.dialog.alert(x,'Notifikasi',function(){
                              mainView.router.refreshPage();
                            });
                          }
                          else {
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
                  });
        } else {
          determinateLoading = false;
          app.dialog.close();
          $$('#listtransaction').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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