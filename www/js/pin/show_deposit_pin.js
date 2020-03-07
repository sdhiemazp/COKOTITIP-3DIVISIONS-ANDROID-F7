function load_show_deposit_pin(page) {
  var x = page.router.currentRoute.params.request_pin_id;
  loading();

  app.request({
    method: "GET",
    url: database_connect + "bonus/select_bonus.php", data:{  },
    success: function(data) {
      var obj_bonus = JSON.parse(data);
      if(obj_bonus['status'] == true) {
        var x_bonus = obj_bonus['data'];
        localStorage.harga_premium = x_bonus[65]['bonus_value'];
        localStorage.harga_basic = x_bonus[66]['bonus_value'];
        determinateLoading = false;
        app.dialog.close();
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj_bonus['message']);
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

  app.request({
    method: "POST",
    url: database_connect + "pin/show_deposit_pin.php", data:{ request_pin_id : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        var x_account = obj['data_account'];
        determinateLoading = false;
        app.dialog.close();

        var total = 0;
        if(x[0]['request_pin_type'] == "Basic") {
          total = formatRupiah(((parseInt(x[0]['request_pin_count']) * parseInt(localStorage.harga_basic))) + parseInt(x[0]['request_pin_unique']));
          $$('#harga_deposit_pin').html(formatRupiah(localStorage.harga_basic));
        } else {
          total = formatRupiah(((parseInt(x[0]['request_pin_count']) * parseInt(localStorage.harga_premium))) + parseInt(x[0]['request_pin_unique']));
          $$('#harga_deposit_pin').html(formatRupiah(localStorage.harga_premium));
        }
        $$('#tipe_deposit_pin').html(x[0]['request_pin_type']);
        $$('#jumlah_deposit_pin').html(x[0]['request_pin_count']);
        $$('#kode_unik_deposit_pin').html(x[0]['request_pin_unique']);
        $$('#total_deposit_pin').html(total);

        $$('#bank_tujuan_deposit_pin').html(x_account[0]['bank_name']);
        $$('#nama_pemilik_rekening_deposit_pin').html(x_account[0]['company_account_name']);
        $$('#nomor_rekening_deposit_pin').html(x_account[0]['company_account_number']);

        if(x[0]['request_pin_status'] == 2) {
          $$('#btn_back_show_deposit_pin').hide();
        } else {
          $$('#btn_yes_show_deposit_pin').hide();
          $$('#btn_no_show_deposit_pin').hide();
        }

        $$('#btn_back_show_deposit_pin').on('click', function() {
          page.router.navigate('/history_pin/');
        });

        $$('#btn_yes_show_deposit_pin').on('click', function() {
          app.dialog.confirm("Apakah Anda yakin untuk memproses pembelian " + x[0]['request_pin_count'] + 
            " pin " + x[0]['request_pin_type'] + "?", function() {
            app.request({
              method: "POST",
              url: database_connect + "pin/member_accept_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
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

        $$('#btn_no_show_deposit_pin').on('click', function() {
          app.dialog.confirm("Apakah Anda yakin untuk membatalkan pembelian " + x[0]['request_pin_count'] + 
            " pin " + x[0]['request_pin_type'] + "?", function() {
            app.request({
              method: "POST",
              url: database_connect + "pin/member_decline_request_pin.php", data:{ request_pin_id : x[0]['request_pin_id'] },
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