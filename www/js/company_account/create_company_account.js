function load_create_company_account(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "bank/select_bank.php", data:{ },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          $$('#bank_id_create_company_account').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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

  $$('#btncreatecompanyaccount').on('click', function() {
    loading();

    var bank_id = $$('#bank_id_create_company_account').val();
    var company_account_name = $$('#company_account_name_create_company_account').val();
    var company_account_number = $$('#company_account_number_create_company_account').val();
    app.request({
      method: "POST",
      url: database_connect + "company_account/insert_company_account.php",
        data:{
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