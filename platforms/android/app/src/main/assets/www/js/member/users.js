function load_users(page) {
  loading();

  app.request({
    method: "GET",
    url: database_connect + "users/select_users2.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        determinateLoading = false;
        app.dialog.close();

        var x = obj['data'];
        var tmphsl ='';
        for(var i = 0; i < x.length; i++) {
          if(i == 0) {
            tmphsl += `<tr>
              <td class="label-cell">` + x[i]['username'] + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
              <td class="label-cell">` + x[i]['user_date'] + `</td>
              <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['debet']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['kredit']) + `</td>
              <td class="label-cell">` + (x[i]['selisih']) + `</td>
              <td class="label-cell">` + (x[i]['user_balance_adjustment_add']) + `</td>
              <td class="label-cell">` + (x[i]['user_balance_adjustment_min']) + `</td>
              <td class="label-cell">-</td>
            </tr>`;
          } else {
            tmphsl += `<tr>
              <td class="label-cell">` + x[i]['username'] + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
              <td class="label-cell">` + x[i]['user_date'] + `</td>
              <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['debet']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['kredit']) + `</td>
              <td class="label-cell">` + (x[i]['selisih']) + `</td>
              <td class="label-cell"><input type='number' id='add` + x[i]['username'] + `' value='` + (x[i]['user_balance_adjustment_add']) + `'></td>
              <td class="label-cell"><input type='number' id='min` + x[i]['username'] + `' value='` + (x[i]['user_balance_adjustment_min']) + `'></td>
              <td class="label-cell"><button class="adjustment button" data-username='` + x[i]['username'] + `'>Simpan Penyesuaian</button></td>
            </tr>`;
          }
        }

        $$('#list_all_member_users').append(`
          <div class="data-table card">
            <table>
              <thead>
                <tr>
                  <th class="label-cell"><b>Username</b></th>
                  <th class="label-cell"><b>Saldo E-Cash Member</b></th>
                  <th class="label-cell"><b>Saldo Bonus Sponsor</b></th>
                  <th class="label-cell"><b>Saldo Bonus Pasti</b></th>
                  <th class="label-cell"><b>Tanggal Masuk</b></th>
                  <th class="label-cell"><b>Tanggal Premium</b></th>
                  <th class="label-cell"><b>Debet</b></th>
                  <th class="label-cell"><b>Kredit</b></th>
                  <th class="label-cell"><b>Selisih</b></th>
                  <th class="label-cell"><b>Penyesuaian Tambah</b></th>
                  <th class="label-cell"><b>Penyesuaian Kurang</b></th>
                  <th class="label-cell"><b>Tindakan</b></th>
                </tr>
              </thead>
              <tbody>
                ` + tmphsl + `
              </tbody>
            </table>
          </div>
        `);

        $$('.adjustment').on('click', function () {
          var username = $$(this).data('username');
          var user_balance_adjustment_add = $$('#add' + username).val();
          var user_balance_adjustment_min = $$('#min' + username).val();
          app.dialog.confirm("Apakah Anda yakin untuk melakukan penyesuaian terhadap member ini?",function(){
            loading();
            app.request({
              method:"POST",
              url:database_connect + "users/update_users_adjustment.php",
              data:{
                username : username,
                user_balance_adjustment_add : user_balance_adjustment_add,
                user_balance_adjustment_min : user_balance_adjustment_min
              },
              success:function(data){
                var obj = JSON.parse(data);
                if(obj['status'] == true) {
                  var x = obj['data']
                  app.dialog.alert(x,'Notifikasi',function(){
                    mainView.router.refreshPage();
                  });
                }
                else {
                  app.dialog.alert(obj['message']);
                };
                determinateLoading = false;
                app.dialog.close();
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

  $$('#txtsearchusers').on('keyup', function() {
    var username = $$('#txtsearchusers').val();
    app.request({
      method: "POST",
      url: database_connect + "users/find_users2.php", data:{ username : username },
      success: function(data) {
        var obj = JSON.parse(data);
        if(obj['status'] == true) {
          $$('#list_all_member_users').html(``);
          var x = obj['data'];
          determinateLoading = false;
          app.dialog.close();
          var tmphsl ='';
          for(var i = 0; i < x.length; i++) {
            if(i == 0) {
              tmphsl += `<tr>
                <td class="label-cell">` + x[i]['username'] + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
                <td class="label-cell">` + x[i]['user_date'] + `</td>
                <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['debet']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['kredit']) + `</td>
                <td class="label-cell">` + (x[i]['selisih']) + `</td>
                <td class="label-cell">` + (x[i]['user_balance_adjustment_add']) + `</td>
                <td class="label-cell">` + (x[i]['user_balance_adjustment_min']) + `</td>
                <td class="label-cell">-</td>
              </tr>`;
            } else {
              tmphsl += `<tr>
                <td class="label-cell">` + x[i]['username'] + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
                <td class="label-cell">` + x[i]['user_date'] + `</td>
                <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['debet']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['kredit']) + `</td>
                <td class="label-cell">` + (x[i]['selisih']) + `</td>
                <td class="label-cell"><input type='number' id='add` + x[i]['username'] + `' value='` + (x[i]['user_balance_adjustment_add']) + `'></td>
                <td class="label-cell"><input type='number' id='min` + x[i]['username'] + `' value='` + (x[i]['user_balance_adjustment_min']) + `'></td>
                <td class="label-cell"><button class="adjustment button" data-username='` + x[i]['username'] + `'>Simpan Penyesuaian</button></td>
              </tr>`;
            }
          }

          $$('#list_all_member_users').append(`
            <div class="data-table card">
              <table>
                <thead>
                  <tr>
                    <th class="label-cell"><b>Username</b></th>
                    <th class="label-cell"><b>Saldo E-Cash Member</b></th>
                    <th class="label-cell"><b>Saldo Bonus Sponsor</b></th>
                    <th class="label-cell"><b>Saldo Bonus Pasti</b></th>
                    <th class="label-cell"><b>Tanggal Masuk</b></th>
                    <th class="label-cell"><b>Tanggal Premium</b></th>
                    <th class="label-cell"><b>Debet</b></th>
                    <th class="label-cell"><b>Kredit</b></th>
                    <th class="label-cell"><b>Selisih</b></th>
                    <th class="label-cell"><b>Penyesuaian Tambah</b></th>
                    <th class="label-cell"><b>Penyesuaian Kurang</b></th>
                    <th class="label-cell"><b>Tindakan</b></th>
                  </tr>
                </thead>
                <tbody>
                  ` +tmphsl+ `
                </tbody>
              </table>
            </div>
          `);

          $$('.adjustment').on('click', function () {
            var username = $$(this).data('username');
            var user_balance_adjustment_add = $$('#add' + username).val();
            var user_balance_adjustment_min = $$('#min' + username).val();
            app.dialog.confirm("Apakah Anda yakin untuk melakukan penyesuaian terhadap member ini?",function(){
              loading();
              app.request({
                method:"POST",
                url:database_connect + "users/update_users_adjustment.php",
                data:{
                  username : username,
                  user_balance_adjustment_add : user_balance_adjustment_add,
                  user_balance_adjustment_min : user_balance_adjustment_min
                },
                success:function(data){
                  var obj = JSON.parse(data);
                  if(obj['status'] == true) {
                    var x = obj['data']
                    app.dialog.alert(x,'Notifikasi',function(){
                      mainView.router.refreshPage();
                    });
                  }
                  else {
                    app.dialog.alert(obj['message']);
                  };
                  determinateLoading = false;
                  app.dialog.close();
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
  });
}