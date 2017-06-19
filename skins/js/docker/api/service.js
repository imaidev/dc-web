var ServiceAction = (function(){
  var list = function(params, success_cal, error_cal){
    $.fn.dcAjax({
      url: DC_CONFIG.DC_API_SERVICES_PATH,
      data: params != null ? params : null,
      withAuth: true,
      success: function(text, status) {
        if (status != 'success' || text.hasOwnProperty('statusCode')){
          ToastrTool.error('服务列表查询失败');
        } else {
          success_cal(text, status);
        }
      }
    });
  };
  var create = function(service_conf, success_cal, error_cal){
    // 弹出选择image页面，选择image后，跳转到service设置页面,设置完成后点击"Create"按钮创建service
    $.fn.dcAjax({
      url: DC_CONFIG.DC_API_SERVICES_PATH,
      type: 'post',
      data: service_conf != null ? service_conf : null,
      withAuth: true, 
      success: function(text, status) {
        if (status != 'success' || text.hasOwnProperty('statusCode')){
          ToastrTool.error('成功创建服务');
        } else {
          success_cal(text, status);
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal =='function'){
          error_cal(e, h, r);
        } else {
          ToastrTool.error('创建服务失败', r);
        }
      }
    });
  };
  
  var inspect = function(sid, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid, function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      if (typeof error_cal == 'function'){
          error_cal(text, status);
      } else {
        ToastrTool.error('查询服务详情失败', r);
      }
    });
  };
  
  var update = function(service_id, version, service_conf, success_cal, error_cal){
    var url = DC_CONFIG.DC_API_SERVICES_PATH+'/'+service_id;
    if (version != null) {
      url += '?version='+version;
    }
    $.fn.dcAjax({
      url: url,
      type: 'put',
      data: service_conf != null ? service_conf : null,
      success: function(text, status) {
        if (status != 'success' || (text.hasOwnProperty('statusCode')&& text.statusCode != 200)){
          ToastrTool.error('服务更新失败： ' + status);
        } else {
          if (typeof success_cal == 'function'){
            success_cal(text, status);
          } else {
            ToastrTool.success('服务更新成功');
          }
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal == 'function'){
          error_cal(text, status);
        } else {
          ToastrTool.error('服务更新失败 ', r);
        }
      }
    });
  };
  
  var scale = function(service_id, scale_number, success_cal, error_cal){
    var url = DC_CONFIG.DC_API_SERVICES_PATH+'/'+service_id+'/scale';
    $.fn.dcAjax({
      url: url,
      type: 'post',
      data: service_conf != null ? service_conf : null,
      success: function(text, status) {
        if (typeof success_cal == 'function'){
          success_cal(text, status);
        } else {
          if (status != 'success'){
            ToastrTool.error('扩展服务失败: ' + status);
          } else {
            ToastrTool.success('扩展服务成功');
          }
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal == 'function'){
          error_cal(text, status);
        } else {
          ToastrTool.error('扩展服务失败', r);
        }
      }
    });
  };
  
  var info = function(sid, success_cal, error_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid+'/info', function(data, status){
      success_cal(data, status);
    }, function(e,h,r){
      if (typeof error_cal == 'function'){
        error_cal(data, status);
      } else {
        ToastrTool.error('查询服务详情失败', r);
      }
    });
  };
  
  var start = function(sid, success_cal){
    //根据service id查询出该service的所有task
    //tasks?filters={%22service%22:[%2294wkdf86cbyjgkthp3nsqjihn%22]}
    // 在task列表中检出container id，start container操作
    $.fn.dcPost(DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid+'/start', function(text, status){
        if (status == 'success') {
          if (typeof success_cal == 'function'){
            success_cal(text, status);
          } else {
            ToastrTool.success('成功启动服务');
          }
        } else {
          ToastrTool.error('启动服务失败：'+status, text);
        }
      }, function(e,h,r){
        ToastrTool.error('启动服务失败', r);
    });
  };
  
  var stop = function(sid, success_cal){
    $.fn.dcPost(DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid+'/stop', function(text, status){
        if (status == 'success') {
          if (typeof success_cal == 'function'){
            success_cal(text, status);
          } else {
            ToastrTool.success('成功停止服务');
          }
        } else {
          ToastrTool.error('停止服务失败：'+status, text);
        }
      }, function(e,h,r){
        ToastrTool.error('停止服务失败', r);
    });
  };
  
  var redeploy = function(sid){
    return;
    //$.post(DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid+'/redeploy', {}, function(text, status){
    //  alert(status+': '+text);
    //});
  };
  
  var terminate = function(sid, success_cal, error_cal){
    $.fn.dcAjax({
      url: DC_CONFIG.DC_API_SERVICES_PATH+'/'+sid,
      type: 'delete',
      success: function(text, status) {
        if (typeof success_cal == 'function'){
          success_cal(text, status);
        } else {
          if (status != 'success'){
              ToastrTool.error('删除服务失败: ' + status);
          }
        }
      },
      error: function(e,h,r) {
        if (typeof error_cal == 'function'){
          error_cal(text, status);
        } else {
          ToastrTool.error('删除服务失败', r);
        }
      }
    });
  };
  
  return {
    list: list,
    create: create,
    inspect: inspect,
    update: update,
    scale: scale,
    info: info,
    start: start,
    stop: stop,
    redeploy: redeploy,
    terminate: terminate
  }
})();
