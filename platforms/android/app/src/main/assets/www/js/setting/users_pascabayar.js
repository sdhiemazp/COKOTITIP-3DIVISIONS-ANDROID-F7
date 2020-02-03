function load_users_pascabayar(page) {
  loading();

  app.request({
    method: "POST",
    url: database_connect + "users/select_users.php", data:{ user_pascabayar : 'N' },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var autocompleteDropdownAll = app.autocomplete.create({
          inputEl: '#txtsearchpascabayar',
          openIn: 'dropdown',
          source: function (query, render) {
            var results = [];
            for (var i = 0; i < x.length; i++) {
              if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
            }

            if(results.length == 0) {
              $$('#btninsertpascabayar').addClass('disabled');
            } else {
              $$('#btninsertpascabayar').removeClass('disabled');
            }
            render(results);
          }
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

  $$('#btninsertpascabayar').on('click', function() {
    var username = $$('#txtsearchpascabayar').val();
    app.dialog.confirm("Apakah Anda yakin untuk menambah member ini ke whitelist akses pascabayar?", function() {
      loading();

      app.request({
        method:"POST",
        url:database_connect + "users/users_pascabayar_insert.php",
        data:{
          username : username
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

  app.request({
    method: "POST",
    url: database_connect + "users/select_users_pascabayar.php", data:{ user_pascabayar : "Y" },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var tmphsl ='';
        for(var i = 0; i < x.length; i++)
        {
          tmphsl += `<tr>
            <td class="label-cell">` +x[i]['username']+ `</td>
            <td class="numeric-cell"><a class="link color-red delete_user_pascabayar" data-id="` + 
            x[i]['username'] + `">Hapus</a></td>
          </tr>`;
        }

        $$('#list_all_member_users_pascabayar').append(`
          <div class="data-table card">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Username</th>
                  <th class="label-cell">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ` +tmphsl+ `
              </tbody>
            </table>
          </div>
        `);

        $$('.delete_user_pascabayar').on('click', function () {
          var id = $$(this).data('id');
          app.dialog.confirm("Apakah Anda yakin untuk menghapus member dari whitelist akses pascabayar?",function(){
            loading();

            app.request({
              method:"POST",
              url:database_connect + "users/users_pascabayar_delete.php",
              data:{
                username : id
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
}