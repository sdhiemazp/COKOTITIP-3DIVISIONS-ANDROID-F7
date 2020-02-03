function load_edit_company_account(page) {
  var x = page.router.currentRoute.params.company_account_id;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "company_account/show_company_account.php", data:{ company_account_id : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        $$('#company_account_name_edit_company_account').val(x[0]['company_account_name']);
        $$('#company_account_number_edit_company_account').val(x[0]['company_account_number']);

        app.request({
          method: "POST",
          url: database_connect + "bank/select_bank.php", data:{ },
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              var x2 = obj['data'];
              determinateLoading = false;
              app.dialog.close();
              for(var i = 0; i < x2.length; i++) {
                if(x[0]['bank_id'] == x2[i]['bank_id']) {
                  $$('#bank_id_edit_company_account').append(`<option value="` + x2[i]['bank_id'] + `" selected>` +
                    x2[i]['bank_name'] + `</option>`);
                } else {
                  $$('#bank_id_edit_company_account').append(`<option value="` + x2[i]['bank_id'] + `">` +
                    x2[i]['bank_name'] + `</option>`);
                }
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
            var toastBottom = app.toast.edit({
              text: ERRNC,
              closeTimeout: 2000,
            });
            toastBottom.open();
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
          }
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

  $$('#btneditcompanyaccount').on('click', function() {
    loading();

    var bank_id = $$('#bank_id_edit_company_account').val();
    var company_account_name = $$('#company_account_name_edit_company_account').val();
    var company_account_number = $$('#company_account_number_edit_company_account').val();
    app.request({
      method: "POST",
      url: database_connect + "company_account/update_company_account.php",
        data:{
        company_account_id: x,
        bank_id: bank_id,
        company_account_name: company_account_name,
        company_account_number: company_account_number
      },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(x, 'Notifikasi', function(){
            page.router.navigate('/list_company_account/');
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
}