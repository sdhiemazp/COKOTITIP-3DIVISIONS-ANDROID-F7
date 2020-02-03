function load_check_transaction(page) {
  app.calendar.create({
    inputEl: '#start_date_check_transaction',
    openIn: 'customModal',
    header: true,
    footer: true,
   });

  app.calendar.create({
    inputEl: '#end_date_check_transaction',
    openIn: 'customModal',
    header: true,
    footer: true,
  });

  $$('#btnchecktransaction').on('click', function() {
    var start_date = $$('#start_date_check_transaction').val();
    var end_date = $$('#end_date_check_transaction').val();

    if(start_date == "") {
      app.dialog.alert("Tanggal mulai tidak boleh kosong!");
    } else if(end_date == null) {
      app.dialog.alert("Tanggal selesai tidak boleh kosong!");
    } else {
      loading();

      app.request({
        method: "POST",
        url: database_connect + "transaction/check_transaction_all.php",
          data:{
          start_date: start_date,
          end_date: end_date
        },
        success: function(data) {
          var obj = JSON.parse(data);
          if(obj['status'] == true) {
            var x = obj['message'];
            determinateLoading = false;
            app.dialog.close();
            app.dialog.alert(x, 'Notifikasi', function(){
              page.router.navigate('/list_transaction/');
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
    }
  });
}