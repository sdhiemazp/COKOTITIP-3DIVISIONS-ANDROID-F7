function load_show_repeat_order(page) {
  var x = page.router.currentRoute.params.transaction_id;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "transaction/repeat_order/show_repeat_order.php", data:{ transaction_id : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        var x_account = obj['data_account'];
        determinateLoading = false;
        app.dialog.close();

        $$('#jumlah_repeat_order').html(x[0]['transaction_message']);
        $$('#kode_unik_repeat_order').html(x[0]['transaction_unique_code']);
        $$('#harga_repeat_order').html(x[0]['transaction_price']);
        
        var total = formatRupiah(((parseInt(x[0]['transaction_message']) * 
          (parseInt(x[0]['transaction_price']))) + parseInt(x[0]['transaction_unique_code'])));
        $$('#total_repeat_order').html(total);
          
        $$('#bank_tujuan_repeat_order').html(x_account[0]['bank_name']);
        $$('#nama_pemilik_rekening_repeat_order').html(x_account[0]['company_account_name']);
        $$('#nomor_rekening_repeat_order').html(x_account[0]['company_account_number']);

        if(x[0]['transaction_status'] == "Process") {
          $$('#btn_back_show_repeat_order').hide();
        } else {
          $$('#btn_yes_show_repeat_order').hide();
          $$('#btn_no_show_repeat_order').hide();
        }

        $$('#btn_back_show_repeat_order').on('click', function() {
          page.router.navigate('/home/',{ animate:false, reloadAll:true });
        });

        $$('#btn_yes_show_repeat_order').on('click', function() {
          app.dialog.confirm("Apakah Anda yakin untuk melakukan repeat order sejumlah  " + 
            x[0]['transaction_message'] + " buah ini?",function(){
            app.request({
              method: "POST",
              url: database_connect + "transaction/repeat_order/member_accept_repeat_order.php", data:{ transaction_id : x[0]['transaction_id'] },
              success: function(data) {
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert("Transaksi diproses!");
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
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
          });
        });

        $$('#btn_no_show_repeat_order').on('click', function() {
          app.dialog.confirm("Apakah Anda yakin untuk membatalkan repeat order sejumlah  " + 
            x[0]['transaction_message'] + " buah ini?",function(){
            app.request({
              method: "POST",
              url: database_connect + "transaction/repeat_order/member_decline_repeat_order.php", data:{ transaction_id : x[0]['transaction_id'] },
              success: function(data) {
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert("Transaksi dibatalkan!");
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
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
          });
        });
      } else {
        determinateLoading = false;
        app.dialog.close();
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