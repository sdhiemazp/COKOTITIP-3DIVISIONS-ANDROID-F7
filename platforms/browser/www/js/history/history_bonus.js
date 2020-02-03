function load_history_bonus(page) {
  var x = page.router.currentRoute.params.username;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "history_bonus/select_history_bonus.php", data:{ username : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          $$('#listhistorybonus').append(`
            <div class="card demo-facebook-card">
              <div class="card-header">
                <div class="demo-facebook-name">` + x[i]['history_bonus_message'] + `<span></div>
                <div class="demo-facebook-price">` + formatRupiah(x[i]['history_bonus_price']) + `</div>
                <div class="demo-facebook-date">` + formatDateTime(x[i]['history_bonus_date']) + `</div>
              </div>
            </div>
          `);
        }
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj['message'],'Notifikasi',function(){
          app.views.main.router.back();
        });
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