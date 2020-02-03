function load_list_member_3(page) {
  var username = page.router.currentRoute.params.username;
  loading();
  
  app.request({
    method: "POST",
    url: database_connect + "users/select_member.php", data:{ username : username },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x_data_sendiri = obj['data_sendiri'];
        var x_data_anak_kiri = obj['data_anak_kiri'];
        var x_data_anak_kanan = obj['data_anak_kanan'];
        var x_data_anak_kiri_cucu_kiri = obj['data_anak_kiri_cucu_kiri'];
        var x_data_anak_kiri_cucu_kanan = obj['data_anak_kiri_cucu_kanan'];
        var x_data_anak_kanan_cucu_kiri = obj['data_anak_kanan_cucu_kiri'];
        var x_data_anak_kanan_cucu_kanan = obj['data_anak_kanan_cucu_kanan'];
        determinateLoading = false;
        app.dialog.close();

        var sponsor = "";
        if(x_data_sendiri[0]['username'] != "Kanza31") {
          sponsor = `<br><span>` + x_data_sendiri[0]['username_sponsor'] + `</span></p>`;
          if(x_data_sendiri[0]['username'] == localStorage.username) {
            $$('#back_3').hide();
          } else {
            $$('#back_3').show();
            $$('#back_3').on('click', function() {
              page.router.navigate('/list_member_2/' + x_data_sendiri[0]['username_upline']);
            });
          }
        } else {
          $$('#back_3').hide();
        }

        var photo_self = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
        if(x_data_sendiri[0]['user_level'] == "Premium"){
          photo_self = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
        }

        $$('#self_3').html(photo_self  + `<br>` + x_data_sendiri[0]['username'] + 
          `<br><br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_left_count'] + ` | ` + x_data_sendiri[0]['user_right_count'] + `</span>
          <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_right_count'] + `</span>
          <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_basic_left_count'] + ` | ` + x_data_sendiri[0]['user_basic_right_count'] + `</span>
          <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_sendiri[0]['user_premium_new_left_count'] + ` | ` + x_data_sendiri[0]['user_premium_new_right_count'] + `</span>
          ` + sponsor
        );

        if(x_data_anak_kiri.length == 0) {
          $$('#left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kiri[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#left_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kiri[0]['username'] + `">` + x_data_anak_kiri[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kiri[0]['username_sponsor'] + `</span>
          `);
        }

        if(x_data_anak_kanan.length == 0) {
          $$('#right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_sendiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kanan[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#right_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kanan[0]['username'] + `">` + x_data_anak_kanan[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kanan[0]['username_sponsor'] + `</span>
          `);
        }

        if(x_data_anak_kiri_cucu_kiri.length == 0) {
          if(x_data_anak_kiri.length != 0) {
            $$('#left_left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
          }
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kiri_cucu_kiri[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#left_left_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kiri[0]['username'] + `">` + x_data_anak_kiri_cucu_kiri[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kiri_cucu_kiri[0]['username_sponsor'] + `</span>
          `);
        }

        if(x_data_anak_kiri_cucu_kanan.length == 0) {
          if(x_data_anak_kiri.length != 0) {
            $$('#left_right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kiri[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
          }
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kiri_cucu_kanan[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#left_right_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kiri_cucu_kanan[0]['username'] + `">` + x_data_anak_kiri_cucu_kanan[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kiri_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kiri_cucu_kanan[0]['username_sponsor'] + `</span>
          `);
        }

        if(x_data_anak_kanan_cucu_kiri.length == 0) {
          if(x_data_anak_kanan.length != 0) {
            $$('#right_left_child_name_3').html(`<a class="link color-black" href="/create_member/Left/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
          }
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kanan_cucu_kiri[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#right_left_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kiri[0]['username'] + `">` + x_data_anak_kanan_cucu_kiri[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kiri[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kanan_cucu_kiri[0]['username_sponsor'] + `</span>
          `);
        }

        if(x_data_anak_kanan_cucu_kanan.length == 0) {
          if(x_data_anak_kanan.length != 0) {
            $$('#right_right_child_name_3').html(`<a class="link color-black" href="/create_member/Right/` + x_data_anak_kanan[0]['username'] + `"><img src="img/icon/Register.png" style="width: 70px; height: 140px;"></a>`);
          }
        } else {
          var photo = `<img src="img/icon/basic.png" style="width: 50px; height: 60px;">`;
          if(x_data_anak_kanan_cucu_kanan[0]['user_level'] == "Premium"){
            photo = `<img src="img/icon/premium.png" style="width: 50px; height: 60px;">`
          }
          $$('#right_right_child_name_3').html(`
            <a class="link color-green menu_admin" href="/show_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">eye</i></a>
            <a class="link color-blue menu_admin" href="/edit_member/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `"><i style="font-size: 16px;" class="f7-icons">compose</i></a><br>
            ` + photo + `<br>
            <a class="link color-black" href="/list_member_2/` + x_data_anak_kanan_cucu_kanan[0]['username'] + `">` + x_data_anak_kanan_cucu_kanan[0]['username'] + `</a><br>
            <br><span><img src="img/icon/total member.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_right_count'] + `</span>
            <br><span><img src="img/icon/premium 2.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_right_count'] + `</span>
            <br><span><img src="img/icon/basic 1.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_basic_right_count'] + `</span>
            <br><span><img src="img/icon/premium red.png" style="width: 12px; height: 12px;"> ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_left_count'] + ` | ` + x_data_anak_kanan_cucu_kanan[0]['user_premium_new_right_count'] + `</span>
            <br><span>` + x_data_anak_kanan_cucu_kanan[0]['username_sponsor'] + `</span>
          `);
        }

        if(localStorage.user_type == "Member") {
          $$('.menu_admin').hide();
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
      page.router.navigate('/home/',{ animate:false, reloadAll:true , force: true, ignoreCache: true});
    }
  });

  var url = "select_users";
  if(localStorage.user_type == "Member") {
    url = "select_users_by_member";
  }

  app.request({
    method: "POST",
    url: database_connect + "users/" + url + ".php", data:{ username : localStorage.username },
    success: function(data) {
      var obj = JSON.parse(data);
      if(obj['status'] == true) {
        var x = obj['data'];
        determinateLoading = false;
        app.dialog.close();
        var autocompleteDropdownAll = app.autocomplete.create({
          inputEl: '#txtsearch_3',
          openIn: 'dropdown',
          source: function (query, render) {
            var results = [];
            for (var i = 0; i < x.length; i++) {
              if (x[i]['username'].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(x[i]['username']);
            }

            if(results.length == 0) {
              $$('#btnsearch_3').addClass('disabled');
            } else {
              $$('#btnsearch_3').removeClass('disabled');
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

  $$('#btnsearch_3').on('click', function() {
    var search = $$('#txtsearch_3').val();
    page.router.navigate('/list_member_2/' + search);
  });
}