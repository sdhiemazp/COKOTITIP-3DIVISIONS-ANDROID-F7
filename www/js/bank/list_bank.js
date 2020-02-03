function load_list_bank(page) {
  loading();
  
  app.request({
    method: "GET",
    url: database_connect + "bank/select_bank.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        for(var i = 0; i < x.length; i++) {
          $$('#listbank').append(`
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title-row">
                    <div class="item-title">` + x[i]['bank_name'] + `</div>
                    <div class="item-subtitle">
                      <a class="link" href="/edit_bank/` + x[i]['bank_id'] + `">Ubah</a> |
                      <a class="link color-red delete_bank" data-id="` + x[i]['bank_id'] + `">Hapus</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          `);
        }

        $$('.delete_bank').on('click', function () {
          var id = $$(this).data('id');
          app.dialog.confirm("Apakah Anda yakin untuk menghapus bank ini?",function(){
            loading();
            app.request({
              method:"POST",
              url:database_connect + "bank/delete_bank.php",
              data:{
                bank_id : id
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