var ContainerAction = (function(){
  var list = function(success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_CONTAINERS_PATH, function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
          error_cal(text, status);
      } else {
        ToastrTool.error('查询容器列表失败', r);
      }
    });
  };
  
  var inspect = function(cid, nodeId, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_CONTAINERS_PATH+'/'+cid+'?node-id='+nodeId, function(text, status) {
      if (typeof success_cal == 'function'){
          success_cal(text, status);
      } else {
        if (status != 'success'){
            ToastrTool.error('查询容器信息失败：' + status);
        }
      }
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
          error_cal(text, status);
      } else {
        ToastrTool.error('查询容器信息失败', r);
      }
    });
  };
  
  var start = function(cid, nodeId, success_cal){
    $.fn.dcPost(DC_CONFIG.DC_API_CONTAINERS_PATH+'/'+cid+'/start?node-id='+nodeId, function(text, status) {
      if (status == 'success') {
        if(typeof success_cal == 'function') {
          success_cal(text, status);
        } else {
          ToastrTool.success('成功启动容器');
        }
      } else {
        ToastrTool.error('启动容器失败：'+status, text);
      }
    }, function(e,h,r) {
      ToastrTool.error('启动容器失败', r);
    });
  };
  
  var stop = function(cid, nodeId, success_cal){
    $.fn.dcPost(DC_CONFIG.DC_API_CONTAINERS_PATH+'/'+cid+'/stop?node-id='+nodeId, function(text, status) {
      if (status == 'success') {
        if(typeof success_cal == 'function') {
          success_cal(text, status);
        } else {
          ToastrTool.success('成功停止容器');
        }
      } else {
        ToastrTool.error('停止容器失败：'+status, text);
      }
    }, function(e,h,r) {
      ToastrTool.error('停止容器失败', r);
    });
  };
  
  var restart = function(cid, nodeId, success_cal){
    $.fn.dcPost(DC_CONFIG.DC_API_CONTAINERS_PATH+'/'+cid+'/restart?node-id='+nodeId, function(text, status) {
      if (status == 'success') {
        if(typeof success_cal == 'function') {
          success_cal(text, status);
        } else {
          ToastrTool.success('重启成功');
        }
      } else {
        ToastrTool.error('重启失败：'+status, text);
      }
    }, function(e,h,r) {
      ToastrTool.error('重启失败', r);
    });
  };
  
  var terminate = function(cid, nodeId, success_cal, error_cal){
    $.fn.dcAjax({
      url: DC_CONFIG.DC_API_CONTAINERS_PATH+'/'+cid+'?node-id='+nodeId,
      type: 'delete',
      success: function(text, status) {
        if (status == 'success'){
          if (typeof success_cal == 'function'){
            success_cal(text, status);
          } else {
            ToastrTool.success('成功删除容器：' + cid);
          }
        } else {
          ToastrTool.error('删除容器失败: ' + status);
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal == 'function'){
          error_cal(text, status);
        } else {
          ToastrTool.error('删除容器失败', r);
        }
      }
    });
  };
  
  return {
    list: list,
    inspect: inspect,
    start: start,
    stop: stop,
    restart: restart,
    terminate: terminate
  }
})();
