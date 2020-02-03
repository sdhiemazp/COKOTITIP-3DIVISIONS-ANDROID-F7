function load_history_transfer_pin_member(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "pin/select_transfer_pin_member.php", data: { username : localStorage.username },
    success:function(data){
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        for(var i = 0;i < x.length; i++) {
          $$('#listhistorytransactionpinmember').append(`
            <div class="card demo-facebook-card">
              <div class="card-header">
              <div class="demo-facebook-price">Dari : <b>` + x[i]['username_sender'] + `</b><span style="float: right; color: ` + x[i]['transfer_pin_color'] + `">` + x[i]['transfer_pin_status'] + `</span></div>
              <div class="demo-facebook-price">Untuk : <b>` + x[i]['username_receiver'] + `</b> </div>
              <div class="demo-facebook-price">Jumlah : <b>` +  x[i]['transfer_pin_count'] + ` ` +  x[i]['transfer_pin_type'] + `</b></div>
              <div class="demo-facebook-date">` + formatDateTime(x[i]['transfer_pin_date']) + `</div>
              </div>
            </div>
          `);
        }

        determinateLoading = false;
        app.dialog.close();
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj['message'], 'Notifikasi', function(){
        page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
        });
      }
    },
    error:function(data){
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