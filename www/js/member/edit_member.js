function load_edit_member(page) {
  var x = page.router.currentRoute.params.username;
  loading();

  app.request({
    method: "POST",
    url: database_connect + "users/show_users.php", data:{ username : x },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        var x_sponsor = obj['data_sponsor'];
        var x_upline = obj['data_upline'];
        determinateLoading = false;
        app.dialog.close();
        if(x[0]['user_type'] == "Member") {
          $$('#user_name_sponsor_edit_member').val(x_sponsor[0]['user_name']);
          $$('#user_name_upline_edit_member').val(x_upline[0]['user_name']);
          $$('#position_edit_member').val(x_upline[0]['position']);
        } else {
          $$('#li_user_name_sponsor_edit_member').hide();
          $$('#li_user_name_upline_edit_member').hide();
          $$('#li_user_name_posisi_edit_member').hide();
        }
        $$('#username_edit_member').val(x[0]['username']);
        $$('#user_name_edit_member').val(x[0]['user_name']);
        $$('#user_email_edit_member').val(x[0]['user_email']);
        $$('#user_phone_edit_member').val(x[0]['user_phone']);
        $$('#user_address_edit_member').val(x[0]['user_address']);

        app.request({
          method: "POST",
          url: database_connect + "bank/select_bank.php", data:{ },
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              var x2 = obj['data'];
              determinateLoading = false;
              app.dialog.close();
              for(var i = 0; i < x2.length; i++) {
                if(x[0]['bank_id'] == x2[i]['bank_id']) {
                  $$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `" selected>` + x2[i]['bank_name'] + `</option>`);
                } else {
                  $$('#bank_id_edit_member').append(`<option value="` + x2[i]['bank_id'] + `">` + x2[i]['bank_name'] + `</option>`);
                }
              }
            } else {
              determinateLoading = false;
              app.dialog.close();
              app.dialog.alert(obj['message']);
            }
          },
          error: function(data) {
            determinateLoading = false;
            app.dialog.close();
            var toastBottom = app.toast.edit({
              text: ERRNC,
              closeTimeout: 2000,
            });
            toastBottom.open();
            page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
          }
        });

        $$('#user_account_name_edit_member').val(x[0]['user_account_name']);
        $$('#user_account_number_edit_member').val(x[0]['user_account_number']);
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

  if(localStorage.user_type != "Admin") {
    $$('.menu_admin').hide();
  }

  $$('#btneditmember').on('click', function() {
    var username = $$('#username_edit_member').val();
    var user_name = $$('#user_name_edit_member').val();
    var user_email = $$('#user_email_edit_member').val();
    var user_phone = $$('#user_phone_edit_member').val();
    var user_address = $$('#user_address_edit_member').val();
    var user_password = $$('#user_edit_password_member').val();
    var bank_id = $$('#bank_id_edit_member').val();
    var user_account_name = $$('#user_account_name_edit_member').val();
    var user_account_number = $$('#user_account_number_edit_member').val();
    if(username == "") {
      app.dialog.alert("Username tidak boleh kosong!");
    } else if(user_name == "") {
      app.dialog.alert("Nama tidak boleh kosong!");
    } else if(user_email == "") {
      app.dialog.alert("Email tidak boleh kosong!");
    } else if(user_phone == "") {
      app.dialog.alert("Telepon tidak boleh kosong!");
    } else if(user_address == "") {
      app.dialog.alert("Alamat tidak boleh kosong!");
    } else if(user_account_name == "") {
      app.dialog.alert("Nama pemilik rekening tidak boleh kosong!");
    } else if(user_account_number == "") {
      app.dialog.alert("Nomor rekening tidak boleh kosong!");
    } else {
      loading();
      
      app.request({
        method: "POST",
        url: database_connect + "users/update_users.php",
          data:{
          username: username,
          user_name: user_name,
          user_email: user_email,
          user_phone: user_phone,
          user_address: user_address,
          user_password: user_password,
          bank_id: bank_id,
          user_account_name: user_account_name,
          user_account_number: user_account_number
        },
        success: function(data) {
          var obj = JSON.parse(data);
          if(obj['status'] == true) {
            var x = obj['data'];
            determinateLoading = false;
            app.dialog.close();
            app.dialog.alert(x, 'Notifikasi', function(){
              page.router.navigate('/show_member/' + username);
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
  });
}