function load_list_company_account(page) {
  loading();

  app.request({
    method: "GET",
    url: database_connect + "company_account/select_company_account.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          $$('#listcompanyaccount').append(`
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title-row">
                    <div class="item-title">Bank ` + x[i]['bank_name'] + `<br>A/N ` +
                      x[i]['company_account_name'] + `<br>` +
                      x[i]['company_account_number'] + `</div>
                    <div class="item-subtitle">
                      <a class="link" href="/edit_company_account/` + x[i]['company_account_id'] + `">Ubah</a> |
                      <a class="link color-red delete_company_account" data-id="` + x[i]['company_account_id'] + `">Hapus</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          `);
        }

        $$('.delete_company_account').on('click', function () {
          var id = $$(this).data('id');
          app.dialog.confirm("Apakah Anda yakin untuk menghapus akun bank ini?",function(){
            loading();

            app.request({
              method:"POST",
              url:database_connect + "company_account/delete_company_account.php",
              data:{
                company_account_id : id
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