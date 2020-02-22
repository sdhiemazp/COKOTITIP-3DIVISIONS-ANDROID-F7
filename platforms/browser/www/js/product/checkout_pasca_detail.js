function load_checkout_pasca_detail(page) {
  var transaction_id = page.router.currentRoute.params.transaction_id;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "digiflazz/check_bill.php", data:{ transaction_id : transaction_id },
    success: function(data) {
      determinateLoading = false;
      app.dialog.close();

      var obj = JSON.parse(data);
      var x = obj['data'];
      var x_transaction = obj['transaction'];

      if(x_transaction[0]['transaction_status'] == "Process") {
        $$('#btn_back_show_checkout_detail').hide();
        $$('#btn_yes_show_checkout_detail').show();
        $$('#btn_no_show_checkout_detail').show();
      } else {
        $$('#btn_back_show_checkout_detail').show();
        $$('#btn_yes_show_checkout_detail').hide();
        $$('#btn_no_show_checkout_detail').hide();
      }

      if(x['Ref ID'] !== undefined) {
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Ref ID </b></div>` +
          `<div class="col-50" style="text-align: right;">` + x['Ref ID'][0] + `</div>`);
      }

      if(x['Kode Pelanggan'] !== undefined) {
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Kode Pelanggan </b></div>` +
          `<div class="col-50" style="text-align: right;">` + x['Kode Pelanggan'][0] + `</div>`);
      }

      if(x['Nama Pelanggan'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Nama Pelanggan'][0] != "") {
          data = x['Nama Pelanggan'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nama Pelanggan </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Tarif'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Tarif'][0] != "") {
          data = x['Tarif'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Tarif </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Daya'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Daya'][0] != "") {
          data = x['Daya'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Daya </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Alamat'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Alamat'][0] != "") {
          data = x['Alamat'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Alamat </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Jatuh Tempo'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Jatuh Tempo'][0] != "") {
          data = x['Jatuh Tempo'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Jatuh Tempo </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Jumlah Peserta'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Jumlah Peserta'][0] != "") {
          data = x['Jumlah Peserta'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Jumlah Peserta </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + ` ORANG</div>`);
      }

      if(x['Nama Barang'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Nama Barang'][0] != "") {
          data = x['Nama Barang'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nama Barang </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['No Rangka'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['No Rangka'][0] != "") {
          data = x['No Rangka'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> No Rangka </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['No Pol'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['No Pol'][0] != "") {
          data = x['No Pol'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> No Pol </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      if(x['Tenor'] !== undefined) {
        var data = "<i>tidak ditemukan</i>";
        if(x['Tenor'][0] != "") {
          data = x['Tenor'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Tenor </b></div>` +
          `<div class="col-50" style="text-align: right;">` + data + `</div>`);
      }

      $$('#contentcheckoutdetail').append(`<br><br>`);
      if(x['Lembar Tagihan'] !== undefined) {
        for(var i = 0; i < parseInt(x['Lembar Tagihan'][0]); i++) {
          if(x['Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Periode </b></div>` +
              `<div class="col-50" style="text-align: right;">` + x['Periode'][0] + `</div>`);
          }

          if(x['Nilai Tagihan Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Nilai Tagihan </b></div>` +
              `<div class="col-50" style="text-align: right;">` + formatRupiah(x['Nilai Tagihan Periode'][0]) + `</div>`);
          }

          if(x['Meter Awal Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Meter Awal </b></div>` +
              `<div class="col-50" style="text-align: right;">` + x['Meter Awal Periode'][0] + `</div>`);
          }

          if(x['Meter Akhir Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Meter Akhir </b></div>` +
              `<div class="col-50" style="text-align: right;">` + x['Meter Akhir Periode'][0] + `</div>`);
          }

          if(x['Denda Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Denda </b></div>` +
              `<div class="col-50" style="text-align: right;">` + formatRupiah(x['Denda Periode'][0]) + `</div>`);
          }

          if(x['Biaya Admin Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Biaya Admin </b></div>` +
              `<div class="col-50" style="text-align: right;">` + formatRupiah(x['Biaya Admin Periode'][0]) + `</div>`);
          }

          if(x['Biaya Lain Periode'] !== undefined) {
            $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Biaya Lain Periode </b></div>` +
              `<div class="col-50" style="text-align: right;">` + formatRupiah(x['Biaya Lain Periode'][0]) + `</div>`);
          }

          $$('#contentcheckoutdetail').append(`<br><br>`);
        }
      } else {
        $$('#btn_yes_show_checkout_detail').hide();
      }

      if(x['Total Biaya Admin'] !== undefined) {
        var harga = 0;
        if(x['Total Biaya Admin'][0] != "") {
          harga = x['Total Biaya Admin'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Total Biaya Admin </b></div>` +
          `<div class="col-50" style="text-align: right;">` + formatRupiah(harga) + `</div>`);
      }

      if(x['Total Tagihan'] !== undefined) {
        var harga = 0;
        if(x['Total Tagihan'][0] != "") {
          harga = x['Total Tagihan'][0];
        }
        $$('#contentcheckoutdetail').append(`<div class="col-50"><b> Total Tagihan </b></div>` +
          `<div class="col-50" style="text-align: right;">` + formatRupiah(harga) + `</div>`);
      }

      if(parseInt(x['Total Tagihan'][0]) > parseInt(localStorage.user_balance_a)) {
        $$('#contentcheckoutdetail').append(`<span style="color: red;">Saldo Anda tidak cukup!</span>`);
        $$('#btn_yes_show_checkout_detail').addClass("disabled");
      }

      $$('#btn_yes_show_checkout_detail').on('click', function() {
        var user_password = $$('#password_checkout_detail').val();
        if(user_password == "") {
          app.dialog.alert("Kata sandi tidak boleh kosong!");
        } else {
          app.request.post(database_connect + "login.php", { username : localStorage.username, user_password : user_password }, function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              app.dialog.confirm("Apakah Anda yakin untuk memproses pembayaran ini?", function() {
                app.request({
                  method: "POST",
                  url: database_connect + "digiflazz/pay_pascabayar.php", 
                    data:{ 
                      buyer_sku_code : x['Buyer SKU Code'][0],
                      ref_id : x['Ref ID'][0],
                      customer_no : x['Kode Pelanggan'][0],
                      transaction_price : x['Total Tagihan'][0],
                      username : localStorage.username,
                      transaction_id : transaction_id
                    },
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
            } else {
              app.dialog.alert("Kata sandi yang Anda masukkan salah!");
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

  $$('#btn_back_show_checkout_detail').on('click', function() {
    page.router.navigate('/home/');
  });          

  $$('#btn_no_show_checkout_detail').on('click', function() {
    app.dialog.confirm("Apakah Anda yakin untuk membatalkan pembayaran ini?", function() {
      app.request({
        method: "POST",
        url: database_connect + "digiflazz/delete_pascabayar.php", data:{ transaction_id : transaction_id },
        success: function(data) {
          var obj = JSON.parse(data);
          if(obj['status'] == true) {
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
}