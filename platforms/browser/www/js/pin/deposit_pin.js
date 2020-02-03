function load_deposit_pin(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "company_account/select_company_account.php", data:{ },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        $$('#bank_id_deposit_pin').append(`<option value="">-- Pilih Bank --</option>`);
        for(var i = 0; i < x.length; i++) {
          $$('#bank_id_deposit_pin').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
        }
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

  $$('.pin_type_deposit_pin').on('click', function () {
    var pin_type = $$(this).data('type');
    $$('.warning_select_pin').hide();
    $$('#btn_request_pin').on('click', function() {
      var count = $$('#count_pin').val();
      var bank_id = $$('#bank_id_deposit_pin').val();
      if(count < 1 || count == "") {
        app.dialog.alert("Minimum order pin adalah sebanyak 1 pin!");
      } else if(bank_id == "") {
        app.dialog.alert("Silahkan pilih bank tujuan terlebih dahulu!");
      } else {
        loading();

        app.request({
          method: "POST",
          url: database_connect + "pin/request_pin.php", data:{ username:localStorage.username, count:count, bank_id:bank_id, pin_type:pin_type },
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              var x = obj['data'];
              determinateLoading = false;
              app.dialog.close();
              page.router.navigate('/show_deposit_pin/' + x,{ force: true, ignoreCache: true });
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
            page.router.navigate('/history_pin/',{ force: true, ignoreCache: true });
          }
        });
      }
    });
  });
}