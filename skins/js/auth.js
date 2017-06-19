var USER_INFO = null;
$(function(){
  /**
  $.fn.dcCookie('itoken', 'eyJhbGciOiJOR0lOWE1ENSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3d3cuaW1haWNsb3VkLmNvbSIsImlzcyI6ImlhbS5pbnNwdXIuY29tIiwiZXhwIjoxNDk0NDYyNzUzOTQwLCJpYXQiOjE0OTQ0NjA5NTM5NDAsImFjY291bnRJZCI6InBYcGFtSGVWUXNtMkpDVDV2eTYydHciLCJlbWFpbCI6IjEyM0BxcS5jb20iLCJ1c2VybmFtZSI6IjEyM0BxcS5jb20iLCJncm91cCI6ImFkbWluIn0.JnfZ6qfJgHnWyPjOZ8SNQw');
  $.fn.dcCookie('dctenant','bxjko3rdqjevxxrxjxm63q');
  **/
  //解析cookie，获取用户信息
//var tnt = $.fn.dcCookie('tenant');
//var itoken = $.fn.dcCookie('itoken');
//if (itoken != null && itoken != ''){
//  $.ajax({
//    type: 'get',
//    url: '//dev.imaicloud.com/iam/v1/tenants/current',
//    contentType: 'application/json',
//    async: false,
//    beforeSend: function(xhr){
//      xhr.setRequestHeader('X-Auth-Token', itoken);
//    },
//    success: function(data, status){
//      if (status=='success' && 'id' in data) {
//        tnt = data.id.toLowerCase();
//        //$.fn.dcCookie('dctenant', tnt);
//      }
//    }
//  });
//}

  //Knox 用户
  var username = null;
  var authVm = new Vue({
    el: '#userInfo',
    data: {
      isLogin: 0,
      user: {}
    },
    methods: {
      loadCurUser: function(){
        $.ajax({
          url: DC_CONFIG.DC_API_HOST+'/user/current',
          type: 'get',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          success: function(data, status) {
            if (data.success) {
              authVm.user = data.data;
              authVm.isLogin = 1;
              username = data.data.username;
            } 
          },
          error: function(e,h,r){
            
          }
        });
      },
      login: function(){
        var url = DC_CONFIG.LOGIN_URL+'?originalUrl='+window.location.href;
        Router.href(url);
      },
      signout: function(){
        $.fn.dcPost(DC_CONFIG.DC_API_HOST+'/user/signout', function(data, success){
          if (data.success) {
            $.fn.dcCookie('hadoop-jwt', null);
            Router.href(DC_CONFIG.LOGIN_URL+'?originalUrl='+window.location.href);
          }
        });
      }
    }
  });
  authVm.loadCurUser();
  
  DC_CONFIG.DC_API_AUTHED_PATH = DC_CONFIG.DC_API_AUTHED_PATH.replace('{tenant}', username);
  DC_CONFIG.DC_API_WS_PATH = DC_CONFIG.DC_API_WS_PATH.replace('{tenant}', username);
  DC_CONFIG.DC_API_SERVICES_PATH = DC_CONFIG.DC_API_SERVICES_PATH.replace('{tenant}', username);
  DC_CONFIG.DC_API_CONTAINERS_PATH = DC_CONFIG.DC_API_CONTAINERS_PATH.replace('{tenant}', username);
  DC_CONFIG.DC_API_IMAGES_PATH = DC_CONFIG.DC_API_IMAGES_PATH.replace('{tenant}', username);
  DC_CONFIG.DC_API_VOLUMES_PATH = DC_CONFIG.DC_API_VOLUMES_PATH.replace('{tenant}', username);
  
//var payload = $.fn.dcCookie('imaicloud_payload');
//if (payload != null && payload != '') {
//  payload = $.base64.decode(payload);
//  USER_INFO = JSON.parse(payload);
//}
  USER_INFO = {username: username};
  
  $('input[type="checkbox"].selector.selector-all').click(function(){
    if (this.checked) {
      $('input[type="checkbox"][name="selector"]').each(function(){
        $(this).prop('checked', true);
      });
    } else {
      $('input[type="checkbox"][name="selector"]:checked').each(function(){
        $(this).prop('checked', false);
      });
    }
  });
});
