var ImagesAction = (function(){
  var list = function(success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_IMAGES_PATH, function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
          error_cal(text, status);
      } else {
        ToastrTool.error('查询镜像列表失败', r);
      }
    });
  };
  
  var inspect = function(image_name, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_IMAGES_PATH+'/'+$.base64.encode(image_name), function(text, status) {
      if (status == 'success' && typeof text == 'object' && text.hasOwnProperty('Id')){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
        }
      } else {
        if (text.hasOwnProperty('message')) {
          ToastrTool.warning(text.message);
        }
      }
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
        error_cal(text, status);
      }
    });
  };
  
  return {
    list: list,
    inspect: inspect
  }
})();
