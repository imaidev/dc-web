var TaskAction = (function(){
  var list = function(params, success_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_TASKS_PATH, function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      ToastrTool.error('查询任务列表失败', r);
    });
  }
  var inspect = function(taskId, success_cal){
    $.fn.dcGet(DC_CONFIG.DC_API_TASKS_PATH+'/'+taskId+'/inspect', function(text, status) {
      success_cal(text, status);
    }, function(e,h,r) {
      ToastrTool.error('查询任务列表失败', r);
    });
  }
  
  return {
    list: list,
    inspect: inspect
  }
})();
