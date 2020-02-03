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
              <td class="label-cell"><b>` + x[i]['username'] + `</b></td>
              <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_a']) + `</b></td>
              <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_b']) + `</b></td>
              <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_c']) + `</b></td>
              <td class="label-cell"><b>` + x[i]['user_date'] + `</b></td>
              <td class="label-cell"><b>` + x[i]['user_date_premium'] + `</b></td>
            </tr>`;
          } else {
            tmphsl += `<tr>
              <td class="label-cell">` + x[i]['username'] + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
              <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
              <td class="label-cell">` + x[i]['user_date'] + `</td>
              <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
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
                <td class="label-cell"><b>` + x[i]['username'] + `</b></td>
                <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_a']) + `</b></td>
                <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_b']) + `</b></td>
                <td class="label-cell"><b>` + formatRupiah(x[i]['user_balance_c']) + `</b></td>
                <td class="label-cell"><b>` + x[i]['user_date'] + `</b></td>
                <td class="label-cell"><b>` + x[i]['user_date_premium'] + `</b></td>
              </tr>`;
            } else {
              tmphsl += `<tr>
                <td class="label-cell">` + x[i]['username'] + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_a']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_b']) + `</td>
                <td class="label-cell">` + formatRupiah(x[i]['user_balance_c']) + `</td>
                <td class="label-cell">` + x[i]['user_date'] + `</td>
                <td class="label-cell">` + x[i]['user_date_premium'] + `</td>
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
  });
}