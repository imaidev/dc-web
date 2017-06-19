var VolumeAction = (function(){
  var list = function(params, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_VOLUMES_PATH, params, function(text, status) {
      if (status != 'success' || text.hasOwnProperty('statusCode')){
        ToastrTool.error('查询卷列表失败');
      } else {
        success_cal(text, status);
      }
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
        error_cal(text, status);
      } else {
        ToastrTool.error('查询卷列表失败', r);
      }
    });
  };
  var create = function(volumeName, vol_conf, success_cal, error_cal){
    $.fn.dcPost(DC_CONFIG.DC_API_VOLUMES_PATH+'?volume='+volumeName, vol_conf, function(text, status) {
      if (status != 'success' || text.hasOwnProperty('statusCode')){
        ToastrTool.error('创建存储卷失败：' + status);
      } else {
        if (typeof success_cal == 'function'){
          success_cal(text, status);
        } else {
          ToastrTool.success('成功创建存储卷');
        }
      }
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
        error_cal(text, status);
      } else {
        ToastrTool.error('创建存储卷失败', r);
      }
    });
  };
  
  var inspect = function(volume, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_VOLUMES_PATH+'/'+volume, function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
        error_cal(text, status);
      } else {
        ToastrTool.error('查询存储卷失败', r);
      }
    });
  };
  
  var remove = function(volume, success_cal, error_cal){
    $.fn.dcAjax({
      url: DC_CONFIG.DC_API_VOLUMES_PATH+'/'+volume,
      type: 'delete',
      success: function(text, status) {
        if (typeof success_cal == 'function'){
          success_cal(text, status);
        } else {
          if (status != 'success'){
              ToastrTool.error('删除存储卷失败: ' + status);
          }
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal == 'function'){
          error_cal(text, status);
        } else {
          ToastrTool.error('删除存储卷失败', r);
        }
      }
    });
  };
  
  return {
    list: list,
    create: create,
    inspect: inspect,
    remove: remove
  }
})();
