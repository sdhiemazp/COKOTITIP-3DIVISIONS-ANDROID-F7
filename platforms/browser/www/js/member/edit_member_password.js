function load_edit_member_password(page) {
  var x = page.router.currentRoute.params.username;

  $$('#btneditmember').on('click', function() {
    var user_new_password = $$('#user_edit_new_password_member').val();
    var user_confirm_new_password = $$('#user_edit_confirm_new_password_member').val();
    if (user_new_password == user_confirm_new_password) {
      loading();
      app.request({
        method: "POST",
        url: database_connect + "users/update_users_password.php",
          data:{
          username: x,
          user_password: user_new_password,
        },
        success: function(data) {
          var obj = JSON.parse(data);
          if(obj['status'] == true) {
            var x = obj['data'];
            determinateLoading = false;
            app.dialog.close();
            app.dialog.alert(x, 'Notifikasi', function(){
              page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
    else {
      app.dialog.alert('Password dan konfirmasi password tidak sama!');
    }
  });
}