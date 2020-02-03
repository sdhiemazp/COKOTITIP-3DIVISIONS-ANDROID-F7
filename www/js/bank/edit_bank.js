function load_edit_bank(page) {
  var x = page.router.currentRoute.params.bank_id;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "bank/show_bank.php", data:{ bank_id : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        $$('#bank_name_edit_bank').val(x[0]['bank_name']);
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

  $$('#btneditbank').on('click', function() {
    loading();
    
    var bank_name = $$('#bank_name_edit_bank').val();
    app.request({
      method: "POST",
      url: database_connect + "bank/update_bank.php",
        data:{
        bank_id: x,
        bank_name: bank_name
      },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(x, 'Notifikasi', function(){
            page.router.navigate('/list_bank/');
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