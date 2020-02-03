function load_create_bank(page) {
  $$('#btncreatebank').on('click', function() {
    loading();

    var bank_name = $$('#bank_name_create_bank').val();
    app.request({
      method: "POST",
      url: database_connect + "bank/insert_bank.php",
        data:{
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