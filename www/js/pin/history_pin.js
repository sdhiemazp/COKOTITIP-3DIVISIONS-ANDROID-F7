function load_history_pin(page) {
  loading();

  app.request({
    method:"POST",
    url:database_connect+"pin/select_request_pin_member.php", data:{ username : localStorage.username },
    success:function(data){
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        for(var i = 0; i < x.length; i++) {
          var total = "";
          if(x[0]['pin_type'] == "Basic") {
            total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
          } else {
            total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
          }

          if(x[i]['status'] == 0 || x[i]['status'] == 2) {
            $$('#history_pin').append(`
              <li>
                <div class="item-content">
                  <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
                    <img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
                  </a>
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title" style="">`+x[i]['username']+`</div>
                      <div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark</i></span></div>
                    </div>
                    <div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
                    <div class="item-subtitle" style="">`+total+`</div>
                    <div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
                  </div>
                </div>
              </li>
            `);
          } else {
            $$('#history_pin').append(`
              <li>
                <div class="item-content">
                  <a href="/show_deposit_pin/` + x[i]['id'] + `" class="item-media ">
                    <img src="img/user.png" style="height: 50px; width: 50px; border-radius:480%; alt="no image" class="skeleton-block lazy lazy-fade-in demo-lazy"/>
                  </a>
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title" style="">`+x[i]['username']+`</div>
                      <div class="item-after"> <span class=""><i class="f7-icons warna-back">bookmark_fill</i></span></div>
                    </div>
                    <div class="item-subtitle" style="">`+x[i]['date_request']+`</div>
                    <div class="item-subtitle" style="">`+total+`</div>
                    <div class="item-subtitle" style="">Jumlah: `+x[i]['count']+` `+x[i]['pin_type']+`</div>
                  </div>
                </div>
              </li>
            `);
          }
        }
        $$('.sw-accepted').on('click', function () {
          var id = $$(this).data('id');
          var count = $$(this).data('count');
          loading();

          for(var i = 0; i < count; i++) {
            var suc = 0;
            app.request({
              method: "POST",
              url: database_connect + "pin/generate_pin.php", data:{ username_sponsor:id },
              success: function(data) {
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  suc++;
                  if (suc==count) {
                    app.request({
                      method: "POST",
                      url: database_connect + "pin/update_request_pin.php", data:{ username:id },
                      success: function(data) {
                        var obj = JSON.parse(data);
                        if(obj['status'] == true) {
                          var x = obj['data'];
                          app.dialog.close();
                          app.dialog.alert(x, 'Notifikasi', function(){
                            mainView.router.refreshPage();
                          });
                        } else {
                          $$('.sw-accepted').click();
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
                        page.router.navigate('/deposit_pin/',{ force: true, ignoreCache: true });
                      }
                    });
                  }
                } else {
                  $$('.sw-accepted').click();
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
                page.router.navigate('/deposit_pin/',{ force: true, ignoreCache: true });
              }
            });
          }
        });
        determinateLoading = false;
        app.dialog.close();
      }
      else {
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