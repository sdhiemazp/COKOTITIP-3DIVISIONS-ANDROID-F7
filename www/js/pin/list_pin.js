function load_list_pin(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "pin/find_pin.php", data:{ username : '', pin_type : 'Basic' },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        determinateLoading = false;
        app.dialog.close();
        var x = obj['data'];
        var tmphsl ='';
        for(var i = 0; i < x.length; i++) {
          if(x[i]['username_member']==null || x[i]['username_member']== "") {
            tmphsl += `
              <tr>
                <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                <td class="label-cell">` +x[i]['pin_value']+ `</td>
                <td class="label-cell">` +x[i]['pin_type']+ `</td>
                <td class="numeric-cell">
                  <a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
                </td>
              </tr>
            `;
          } else {
            tmphsl += `
              <tr>
                <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                <td class="label-cell">` +x[i]['pin_value']+ `</td>
                <td class="label-cell">` +x[i]['pin_type']+ `</td>
                <td class="numeric-cell">` +x[i]['username_member']+ `</td>
              </tr>
            `;
          }
        }

        $$('#list_all_pin_user').append(`
          <div class="data-table card">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Pemilik</th>
                  <th class="label-cell">Pin</th>
                  <th class="label-cell">Type</th>
                  <th class="numeric-cell">Member</th>
                </tr>
              </thead>
              <tbody>
                ` +tmphsl+ `
              </tbody>
            </table>
          </div>
        `);

        $$('.delete_pin').on('click', function () {
          var id = $$(this).data('id');
          app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
            loading();

            app.request({
              method:"POST",
              url:database_connect + "pin/delete_pin.php",
              data:{
                pin_id : id
              },
              success:function(data){
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert(x,'Notifikasi',function(){
                    mainView.router.refreshPage();
                  });
                }
                else {
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert(obj['message']);
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
                page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
              }
            });
          });
        });
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj['message'], 'Notifikasi', function(){
          page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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

  $$('#pin_type_overall_selection').on('change', function () {
    var username = $$('#txtsearchpin').val();
    var search = $$('#pin_type_overall_selection').val();
    app.request({
      method: "POST",
      url: database_connect + "pin/find_pin.php", data:{ username : username, pin_type : search },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          $$('#list_all_pin_user').html('');
          determinateLoading = false;
          app.dialog.close();
          var tmphsl ='';
          for(var i = 0; i < x.length; i++) {
            if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
              tmphsl += `
                <tr>
                  <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                  <td class="label-cell">` +x[i]['pin_value']+ `</td>
                  <td class="label-cell">` +x[i]['pin_type']+ `</td>
                  <td class="numeric-cell">
                    <a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
                  </td>
                </tr>
              `;
            } else {
              tmphsl += `
                <tr>
                  <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                  <td class="label-cell">` +x[i]['pin_value']+ `</td>
                  <td class="label-cell">` +x[i]['pin_type']+ `</td>
                  <td class="numeric-cell">` +x[i]['username_member']+ `</td>
                </tr>
              `;
            }
          }

          $$('#list_all_pin_user').append(`
            <div class="data-table card">
              <table>
                <thead>
                  <tr>
                    <th class="label-cell">Pemilik</th>
                    <th class="label-cell">Pin</th>
                    <th class="label-cell">Type</th>
                    <th class="numeric-cell">Member</th>
                  </tr>
                </thead>
                <tbody>
                  ` +tmphsl+ `
                </tbody>
              </table>
            </div>
          `);

          $$('.delete_pin').on('click', function () {
            var id = $$(this).data('id');
            app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
              loading();

              app.request({
                method:"POST",
                url:database_connect + "pin/delete_pin.php", data:{ pin_id : id },
                success:function(data){
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data'];
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert(x,'Notifikasi',function(){
                  mainView.router.refreshPage();
                  });
                } else {
                  determinateLoading = false;
                  app.dialog.close();
                  app.dialog.alert(obj['message']);
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
                page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                }
              });
            });
          });
        } else {
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(obj['message'], 'Notifikasi', function(){
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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

  $$('#txtsearchpin').on('keyup', function() {
    var username = $$('#txtsearchpin').val();
    var search = $$('#pin_type_overall_selection').val();
    app.request({
      method: "POST",
      url: database_connect + "pin/find_pin.php", data:{ username : username, pin_type : search },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          determinateLoading = false;
          app.dialog.close();
          $$('#list_all_pin_user').html(``);
          var x = obj['data'];
          var tmphsl ='';
          for(var i = 0; i < x.length; i++) {
            if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
              tmphsl += `
                <tr>
                  <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                  <td class="label-cell">` +x[i]['pin_value']+ `</td>
                  <td class="label-cell">` +x[i]['pin_type']+ `</td>
                  <td class="numeric-cell">
                    <a class="link color-red delete_pin" data-id="` + x[i]['pin_id'] + `">Hapus</a>
                  </td>
                </tr>
              `;
            } else {
              tmphsl += `
                <tr>
                  <td class="label-cell">` +x[i]['username_sponsor']+ `</td>
                  <td class="label-cell">` +x[i]['pin_value']+ `</td>
                  <td class="label-cell">` +x[i]['pin_type']+ `</td>
                  <td class="numeric-cell">` +x[i]['username_member']+ `</td>
                </tr>
              `;
            }
          }

          $$('#list_all_pin_user').append(`
            <div class="data-table card">
              <table>
                <thead>
                  <tr>
                    <th class="label-cell">Pemilik</th>
                    <th class="label-cell">Pin</th>
                    <th class="label-cell">Type</th>
                    <th class="numeric-cell">Member</th>
                  </tr>
                </thead>
                <tbody>
                  ` +tmphsl+ `
                </tbody>
              </table>
            </div>
          `);

          $$('.delete_pin').on('click', function () {
            var id = $$(this).data('id');
            app.dialog.confirm("Apakah Anda yakin untuk menghapus pin ini?",function(){
              loading();

              app.request({
                method:"POST",
                url:database_connect + "pin/delete_pin.php",
                data:{
                  pin_id : id
                },
                success:function(data){
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data'];
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(x,'Notifikasi',function(){
                      mainView.router.refreshPage();
                    });
                  }
                  else {
                    determinateLoading = false;
                    app.dialog.close();
                    app.dialog.alert(obj['message']);
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
                  page.router.navigate('/home/',{ animate:false, reloadAll:true, force: true, ignoreCache: true });
                }
              });
            });
          });
        } else {
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(obj['message'], 'Notifikasi', function(){
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
}