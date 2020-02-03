function load_confirm_pin(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "pin/select_request_pin.php", data: { request_pin_type : 'Basic' },
    success:function(data){
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        for(var i = 0;i < x.length; i++) {
          var total = "";
          if(x[i]['pin_type'] == "Basic") {
            total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
          } else {
            total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
          }

          if(x[i]['status'] == 0) {
            $$('#confirm_pin').append(`
            <li class="swipeout">
              <div class="item-content swipeout-content">
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
                <div class="swipeout-actions-right">
                  <a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
                  `" data-type="`+x[i]['pin_type']+`" class="bg-color-green sw-accepted"><i class="f7-icons">checkmark</i></a>
                  <a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
                  `" data-type="`+x[i]['pin_type']+`" class="bg-color-red sw-deleted"><i class="f7-icons">trash</i></a>
                </div>
              </div>
            </li>
            `);
          } else {
            $$('#confirm_pin').append(`
            <li class="swipeout">
              <div class="item-content swipeout-content">
                <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
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
          var username = $$(this).data('username');
          var type = $$(this).data('type');
          var count = $$(this).data('count');

          app.dialog.confirm("Apakah Anda yakin memberikan " + count + " pin " + type + 
            " kepada " + username + "? Pastikan member telah membayar!", function() {
            var url = "";
            if(type == "Basic") {
              url = "pin/generate_pin_basic.php";
            } else {
              url = "pin/generate_pin_premium.php";
            }
            loading();

            for(var i = 0; i < count; i++) {
              var suc = 0;
              app.request({
                method: "POST",
                url: database_connect + url, data:{ username_sponsor : username },
                success: function(data) {
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data'];
                    suc++;
                    if (suc == count) {
                      app.request({
                      method: "POST",
                      url: database_connect + "pin/update_request_pin.php", data:{ request_pin_id : id },
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
                        page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
                  page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
                }
              });
            }
          });
        });

        $$('.sw-deleted').on('click', function () {
          var id = $$(this).data('id');
          var username = $$(this).data('username');
          var type = $$(this).data('type');
          var count = $$(this).data('count');

          app.dialog.confirm("Apakah Anda yakin menghapus permintaan " + count + " pin " + type + 
            " oleh " + username + "? Pastikan member belum membayar!",function(){
            var url = "pin/delete_request_pin.php";
            loading();

            app.request({
              method: "POST",
              url: database_connect + url, data:{ request_pin_id : id },
              success: function(data) {
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert(x,'Notifikasi',function(){
                    mainView.router.refreshPage();
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
          });
        });

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

  $$('#request_pin_type_confirm_selection').on('change', function () {
    var search = $$('#request_pin_type_confirm_selection').val();
    app.request({
      method:"POST",
      url:database_connect+"pin/select_request_pin.php",
      data:{request_pin_type:search},
      success:function(data){
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          $$('#confirm_pin').html('');
          var x = obj['data'];
          for(var i = 0;i < x.length; i++) {
            var total = "";
            if(x[i]['pin_type'] == "Basic") {
              total = formatRupiah(((parseInt(x[i]['count']) * 50000)) + parseInt(x[i]['unique']));
            } else {
              total = formatRupiah(((parseInt(x[i]['count']) * 300000)) + parseInt(x[i]['unique']));
            }

            if(x[i]['status'] == 0) {
              $$('#confirm_pin').append(`
              <li class="swipeout">
                <div class="item-content swipeout-content">
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
                <div class="swipeout-actions-right">
                  <a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
                  `" data-type="`+x[i]['pin_type']+`" class="bg-color-green sw-accepted"><i class="f7-icons">checkmark</i></a>
                  <a href="#" data-id="`+x[i]['id']+`" data-username="`+x[i]['username']+`" data-count="`+x[i]['count']+
                  `" data-type="`+x[i]['pin_type']+`" class="bg-color-red sw-deleted"><i class="f7-icons">trash</i></a>
                </div>
                </div>
              </li>
              `);
            } else {
              $$('#confirm_pin').append(`
              <li class="swipeout">
                <div class="item-content swipeout-content">
                  <a href="/show_deposit_pin/` + x[i]['id'] + `"class="item-media ">
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
            var username = $$(this).data('username');
            var type = $$(this).data('type');
            var count = $$(this).data('count');

            app.dialog.confirm("Apakah Anda yakin memberikan " + count + " pin " + type + 
              " kepada " + username + "? Pastikan member telah membayar!",function(){
              var url = "";
              if(type == "Basic") {
                url = "pin/generate_pin_basic.php";
              } else {
                url = "pin/generate_pin_premium.php";
              }

              showDeterminate(true);
              determinateLoading = false;
              function showDeterminate(inline)
              {
                determinateLoading = true;
                var progressBarEl;
                if (inline) {
                  progressBarEl = app.dialog.progress();
                } else {
                  progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
                }
                function simulateLoading() {
                  setTimeout(function () {
                  simulateLoading();
                  }, Math.random() * 300 + 300);
                }
                simulateLoading();
              }

              for(var i = 0; i < count; i++) {
                var suc = 0;
                app.request({
                  method: "POST",
                  url: database_connect + url, data:{ username_sponsor : username },
                  success: function(data) {
                    var obj = JSON.parse(data);
                    if(obj['status'] == true) {
                      var x = obj['data'];
                      suc++;
                      if (suc == count) {
                        app.request({
                        method: "POST",
                        url: database_connect + "pin/update_request_pin.php", data:{ request_pin_id : id },
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
                          page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
                    page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
                  }
                });
              }
            });
          });

          $$('.sw-deleted').on('click', function () {
            var id = $$(this).data('id');
            var username = $$(this).data('username');
            var type = $$(this).data('type');
            var count = $$(this).data('count');

            app.dialog.confirm("Apakah Anda yakin menghapus permintaan " + count + " pin " + type + 
              " oleh " + username + "? Pastikan member belum membayar!",function(){
              var url = "pin/delete_request_pin.php";

              showDeterminate(true);
              determinateLoading = false;
              function showDeterminate(inline)
              {
                determinateLoading = true;
                var progressBarEl;
                if (inline) {
                  progressBarEl = app.dialog.progress();
                } else {
                  progressBarEl = app.progressbar.show(0, app.theme === 'md' ? 'yellow' : 'blue');
                }
                function simulateLoading() {
                  setTimeout(function () {
                  simulateLoading();
                  }, Math.random() * 300 + 300);
                }
                simulateLoading();
              }

              app.request({
                method: "POST",
                url: database_connect + url, data:{ request_pin_id : id },
                success: function(data) {
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data'];
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(x,'Notifikasi',function(){
                      mainView.router.refreshPage();
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
            });
          });

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
  });
}