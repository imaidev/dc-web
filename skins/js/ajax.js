(function($) {
  $.fn.dcAjax = function(options) {
//  if (!DC_CONFIG.DC_API_HOST) return;
    var _opt = {type: 'GET', data: null, withAuth: true, loading: false};
    options = $.extend({}, _opt, options || {});
    $.ajax({
      url: options.url,
      type: options.type ?  options.type : 'GET',
      async: options.hasOwnProperty('async') ?  options.async : true,
      cache: options.hasOwnProperty('cache') ?  options.cache : true,
      contentType: options.contentType ?  options.contentType : 'application/json',
      dataType: options.dataType ?  options.dataType : 'json',
      data: JSON.stringify(options.data),
      error: options.error ? options.error : function(e,h,r){
          toastr.error('数据请求失败');
      },
      success: options.success ? options.success : function(data, status, all){
        
      },
      beforeSend: options.beforeSend ? options.beforeSend : function(xhr){
        xhr.setRequestHeader('Set-Cookie', 'itoken='+$.cookie('itoken'));
        if (options.loading) {
          $.blockUI({message: '<div class="load-container ajaxLoad"><div class="loader">Loading...</div></div>'});
        }
      },
      complete: options.complete ? options.complete : function(xhr, ts){
        if (options.loading) {
          $.unblockUI();
        }
      }
    });
  };
  $.fn.dcGet = function(){
    var url = arguments[0];
    var data = arguments.length > 2 && typeof arguments[1] == 'object' ? arguments[1] : null;
    var success = typeof arguments[1] == 'function' ? arguments[1] : arguments[2];
    var option = {url: url, type: 'GET', data: data, success: success}
    $.fn.dcAjax(option);
  };
  $.fn.dcPost = function(){
    var url = arguments[0];
    var data = arguments.length > 2 && typeof arguments[1] == 'object' ? arguments[1] : null;
    var success = typeof arguments[1] == 'function' ? arguments[1] : arguments[2];
    var option = {url: url, type: 'POST', data: data, success: success}
    $.fn.dcAjax(option);
  };
})(jQuery);