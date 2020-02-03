function load_transfer_pin(page) {
  var type = page.router.currentRoute.params.type;
  $$('#type_transfer_pin').val(type);
  loading();

  app.request({
    method: "POST",
    url: database_connect + "pin/select_pin_user_no_usage_by_type.php", data: { type: type, username : localStorage.username },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        $$('#available_transfer_pin').val(x.length);
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

  app.request({
    method: "POST",
    url: database_connect + "users/select_users.php", data:{  },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var autocompleteDropdownAll = app.autocomplete.create({
          inputEl: '#member_transfer_pin',
          openIn: 'dropdown',
          source: function (query, render) {
            var results = [];
            for (var i = 0; i < x.length; i++) {
              if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
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

  $$('#btntransferpin').on('click', function() {
    var pin_type = $$('#type_transfer_pin').val();
    var pin_available = $$('#available_transfer_pin').val();
    var pin_count = $$('#count_transfer_pin').val();
    var username = $$('#member_transfer_pin').val();

    if(parseInt(pin_count) < 1 || parseInt(pin_count) == "") {
      app.dialog.alert("Minimum jumlah transfer pin adalah 1 buah!");
    } else if (username == "") {
      app.dialog.alert("Anda belum memilih member tujuan penerima pin!");
    } else if (parseInt(pin_count) > parseInt(pin_available)) {
      app.dialog.alert("Jumlah pin yang Anda transfer melebihi jumlah pin Anda yang tersedia!");
    } else {
      app.dialog.confirm("Apakah Anda yakin melakukan transfer pin " + pin_type + " sebanyak " + 
        pin_count + " buah kepada " + username + "?",function(){
        loading();

        app.request({
          method: "POST",
          url: database_connect + "pin/transfer_pin.php",
            data:{
              pin_type : pin_type,
              pin_count : pin_count,
              username_owner : localStorage.username,
              username : username
            },
          success: function(data) {
            var obj = JSON.parse(data);
            if(obj['status'] == true) {
              var x = obj['message'];
              determinateLoading = false;
              app.dialog.close();
              app.dialog.alert(x);
              page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
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
      });
    }
  });
}