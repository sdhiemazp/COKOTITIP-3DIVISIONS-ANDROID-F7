function load_pin_pribadi(page) {
  if(localStorage.user_type == "Member") {
    $$('#admin_generate_pin').hide();
  }
  loading();

  app.request({
    method: "POST",
    url: database_connect + "pin/select_pin_by_user.php", data:{ username:localStorage.username },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var tmphsl ='';
        for(var i=0;i<x.length;i++)
        {
          if(x[i]['username_member'] == null || x[i]['username_member'] == "") {
            tmphsl += `<tr>
              <td class="label-cell">` +x[i]['pin_value']+ `</td>
              <td class="label-cell">` +x[i]['pin_type']+ `</td>
              <td class="numeric-cell">-</td>
            </tr>`;
          } else {
            tmphsl += `<tr>
              <td class="label-cell">` +x[i]['pin_value']+ `</td>
              <td class="label-cell">` +x[i]['pin_type']+ `</td>
              <td class="numeric-cell">` +x[i]['username_member']+ `</td>
            </tr>`;
          }
        }

        $$('#pin_bribadi_user').append(`
          <div class="data-table card">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Pin</th>
                  <th class="numeric-cell">Type</th>
                  <th class="numeric-cell">Member</th>
                </tr>
              </thead>
              <tbody>
                ` +tmphsl+ `
              </tbody>
            </table>
          </div>
        `);
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj['message'], 'Notifikasi');
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

  $$('#btn_generate_pin_basic').on('click', function() {
    loading();

    app.request({
      method: "POST",
      url: database_connect + "pin/generate_pin_basic.php", data:{ username_sponsor:localStorage.username },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(x, 'Notifikasi', function(){
            mainView.router.refreshPage();
          });
        } else {
          $$('#btn_generate_pin_basic').click();
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

  $$('#btn_generate_pin_premium').on('click', function() {
    loading();

    app.request({
      method: "POST",
      url: database_connect + "pin/generate_pin_premium.php", data:{ username_sponsor:localStorage.username },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          app.dialog.alert(x, 'Notifikasi', function(){
            mainView.router.refreshPage();
          });
        } else {
          $$('#btn_generate_pin_premium').click();
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