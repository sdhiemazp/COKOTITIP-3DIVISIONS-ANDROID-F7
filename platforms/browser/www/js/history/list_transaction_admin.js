function load_list_transaction_admin(page) {
  var x = page.router.currentRoute.params.username;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "transaction/select_transaction.php", data:{ username : x, transaction_type : "Sell" },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          var color = "white";
          if(x[i]['transaction_status'] == "Failed") {
            color = "red";
          } else {
            color = "green";
          }

          var price = formatRupiah((parseInt(x[i]['transaction_price'])));
          var sell = "Ket/SN : ";

          var balance = "";
          if(x[i]['transaction_balance_left'] != "") {
            balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
          }

          if(x[i]['transaction_type'] == "Sell") {
            x[i]['transaction_type'] = "Prabayar";
          }

          $$('#listhistory').append(`
            <a>
              <div class="card demo-facebook-card">
                <div class="card-header">
                  <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
                    color + `">` + x[i]['transaction_status'] + `</span></div>
                  <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
                    `<span></div>
                  <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
                  <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
                  <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
                </div>
              </div>
            </a>
          `);
        }
      } else {
        determinateLoading = false;
        app.dialog.close();
        $$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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

  $$('#category_transaction_selection_history').on('change', function () {
    var category = $$('#category_transaction_selection_history').val();
    $$('#listhistory').html('');
    loading();

    app.request({
      method: "POST",
      url: database_connect + "transaction/select_transaction.php", data:{ username : x, 
        transaction_type : category },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          for(var i = 0; i < x.length; i++) {
            var url = "#";
            var adminfee = "";
            if(x[i]['transaction_type'] == "Deposit") {
              url = "/show_deposit/";
            } else if(x[i]['transaction_type'] == "Withdraw") {
              url = "/show_withdraw/";
              adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                <div class="demo-facebook-price">Total WD : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
            } else if(x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
              adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                <div class="demo-facebook-price">Total Transfer : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
            }  else if(x[i]['transaction_type'] == "Transfer Masuk") {
              adminfee = `<div class="demo-facebook-price">Biaya Admin : ` + formatRupiah(x[i]['transaction_admin_fee']) + `</div>
                <div class="demo-facebook-price">Total Penerimaan : ` + formatRupiah((parseInt(x[i]['transaction_price']) - 
                parseInt(x[i]['transaction_admin_fee']))) + `</div>`;
            } else if(x[i]['transaction_type'] == "Repeat Order") {
              url = "/show_repeat_order/";
            } else if(x[i]['transaction_type'] == "Pascabayar") {
              url = "/checkout_pasca_detail/";
            }

            var color = "white";
            if(x[i]['transaction_status'] == "Failed") {
              color = "red";
            } else {
              color = "green";
            }

            var price = "";
            var sell = "";
            if(x[i]['transaction_type'] == "Sell" || x[i]['transaction_type'] == "Transfer Masuk" || 
              x[i]['transaction_type'] == "Transfer Keluar" || x[i]['transaction_type'] == "Transfer Bonus") {
              price = formatRupiah((parseInt(x[i]['transaction_price'])));
              if(x[i]['transaction_type'] == "Sell") {
                x[i]['transaction_type'] = "Prabayar";
                sell = "Ket/SN : ";
              }
            } else if(x[i]['transaction_type'] == "Repeat Order") {
              price = formatRupiah(((parseInt(x[i]['transaction_price']) * parseInt(x[i]['transaction_message'])) + parseInt(x[i]['transaction_unique_code'])));
              x[i]['transaction_message'] = "Jumlah : " + x[i]['transaction_message'] + " buah";
              if(x[i]['transaction_status'] == "Process") {
                color = "purple";
                x[i]['transaction_status'] = "Waiting Confirmation";
              }
            } else if(x[i]['transaction_type'] == "Pascabayar") {
              
            } else {
              price = formatRupiah((parseInt(x[i]['transaction_price']) + parseInt(x[i]['transaction_unique_code'])));
            }

            var balance = "";
            if(x[i]['transaction_balance_left'] != "") {
              balance = formatRupiah(parseInt(x[i]['transaction_balance_left']));
            }

            $$('#listhistory').append(`
              <a href="` + url + x[i]['transaction_id'] + `">
                <div class="card demo-facebook-card">
                  <div class="card-header">
                    <div class="demo-facebook-name">` + x[i]['transaction_type'] + `<span style="float: right; color:` + 
                      color + `">` + x[i]['transaction_status'] + `</span></div>
                    <div class="demo-facebook-price">` + price + `<span style="float: right; color: orange;">` + balance + 
                      `<span></div>
                    <div class="demo-facebook-price">` +  x[i]['customer_number'] + `</div>
                    <div class="demo-facebook-price">` + sell + x[i]['transaction_message'] + `</div>
                    ` + adminfee + `
                    <div class="demo-facebook-date">` + formatDateTime(x[i]['transaction_date']) + `</div>
                  </div>
                </div>
              </a>
            `);
          }
        } else {
          determinateLoading = false;
          app.dialog.close();
          $$('#listhistory').html(`<center><p style="margin-top: 40%; text-align: center;">` + obj['message'] + `</p></center>`);
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