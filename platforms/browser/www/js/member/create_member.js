function load_create_member(page) {
  var position = page.router.currentRoute.params.position;
  var username_upline = page.router.currentRoute.params.username_upline;
  $$('#pin_id_no_usage_premium').hide();
  $$('#pin_id_no_usage_basic').hide();
  loading();

  $$('#user_name_sponsor_create_member').val(localStorage.user_name);
  $$('#position_create_member').val(position);
  app.request({
    method: "POST",
    url: database_connect + "users/show_users.php", data:{ username : username_upline },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        $$('#user_name_upline_create_member').val(x[0]['user_name']);
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
      page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
    }
  });

  app.request({
    method: "POST",
    url: database_connect + "bank/select_bank.php", data:{ },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        for(var i = 0; i < x.length; i++) {
          $$('#bank_id').append(`<option value="` + x[i]['bank_id'] + `">` + x[i]['bank_name'] + `</option>`);
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
      var toastBottom = app.toast.create({
        text: ERRNC,
        closeTimeout: 2000,
      });
      toastBottom.open();
      page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
    }
  });

  $$('#username_create_member').on('keyup', function(){
    var el = $$('#username_create_member').val();
    $$('#username_create_member').val(el.replace(/\s/g, ""));
  });

  app.request({
    method: "POST",
    url: database_connect + "pin/select_pin_user_no_usage.php", data:{ username:localStorage.username},
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var premium = 0;
        var basic = 0;
        for(var i = 0; i < x.length; i++) {
          if (x[i]['pin_type'] == 'Premium') {
            $$('#pin_id_no_usage_premium').append(`<option value="` + x[i]['pin_id'] + `">` + x[i]['pin_type'] + ` - ` +
              x[i]['pin_value'] + `</option>`);
              premium ++;
          } else {
            $$('#pin_id_no_usage_basic').append(`<option value="` + x[i]['pin_id'] + `">` + x[i]['pin_type'] + ` - ` +
              x[i]['pin_value'] + `</option>`);
              basic ++;
          }
        }

        $$('.pin_id_no_usage_radio').on('click', function () {
          var name = $$(this).data('name');
          if (name == "Premium") {
            if (premium == 0) {
              app.dialog.alert('Silahkan beli pin terlebih dahulu!',function () {
                $$('#pin_id_no_usage_premium').hide();
                $$('#pin_id_no_usage_basic').show();
                $$('#radiobas').prop('checked', true);
                $$('#radiopre').prop('checked', false);
                document.getElementById("pin_id_no_usage_premium").selectedIndex=0;
              });
            } else {
              $$('#pin_id_no_usage_premium').show();
              $$('#pin_id_no_usage_basic').hide();
              document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
            }
          } else {
            if (basic == 0) {
              app.dialog.alert('Silahkan beli pin terlebih dahulu!',function () {
                $$('#pin_id_no_usage_premium').show();
                $$('#pin_id_no_usage_basic').hide();
                $$('#radiobas').prop('checked', false);
                $$('#radiopre').prop('checked', true);
                document.getElementById("pin_id_no_usage_basic").selectedIndex=0;
              });
            } else {
              $$('#pin_id_no_usage_premium').hide();
              $$('#pin_id_no_usage_basic').show();
              document.getElementById("pin_id_no_usage_premium").selectedIndex=0;
            }
          }
        });
      } else {
        determinateLoading = false;
        app.dialog.close();
        app.dialog.alert(obj['message'] + ' Silahkan beli pin terlebih dahulu!',function () {
          app.views.main.router.back();
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
      page.router.navigate('/list_member/',{ force: true, ignoreCache: true });
    }
  });

  // app.calendar.create({
  //   inputEl: '#user_birthday_create_member',
  //   openIn: 'customModal',
  //   header: true,
  //   footer: true,
  // });

  $$('#btncreatemember').on('click', function() {
    var username = $$('#username_create_member').val();
    var user_name = $$('#user_name_create_member').val();
    var user_email = $$('#user_email_create_member').val();
    var user_phone = $$('#user_phone_create_member').val();
    var user_address = $$('#user_address_create_member').val();
    var user_password = $$('#user_password_create_member').val();
    var user_account_name = $$('#user_account_name_create_member').val();
    var user_account_number = $$('#user_account_number_create_member').val();
    var bank_id = $$('#bank_id').val();
    var pin_id_no_usage = '';
    if ($$('#pin_id_no_usage_premium').val() == 0) {
      pin_id_no_usage = $$('#pin_id_no_usage_basic').val();
    } else {
      pin_id_no_usage = $$('#pin_id_no_usage_premium').val();
    }

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
    } else if(user_password == "") {
      app.dialog.alert("Password tidak boleh kosong!");
    } else if(user_account_name == "") {
      app.dialog.alert("Nama pemilik rekening tidak boleh kosong!");
    } else if(user_account_number == "") {
      app.dialog.alert("Nomor rekening tidak boleh kosong!");
    } else if($$('#pin_id_no_usage_basic').val() == 0 && $$('#pin_id_no_usage_premium').val() == 0) {
      app.dialog.alert("Pin tidak boleh kosong!");
    } else {
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
        url: database_connect + "users/insert_users.php",
          data:{
          username: username,
          user_name: user_name,
          user_email: user_email,
          user_phone: user_phone,
          user_address: user_address,
          password: user_password,
          user_account_name: user_account_name,
          user_account_number: user_account_number,
          bank_id: bank_id,
          user_balance_a: '0',
          user_balance_b: '0',
          user_balance_c: '0',
          username_sponsor: localStorage.username,
          username_upline: username_upline,
          relationship_position: position,
          pin_id:pin_id_no_usage,
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
  });
}