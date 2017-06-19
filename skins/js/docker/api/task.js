var TaskAction = (function(){
  var list = function(params, success){
    $.get(DC_CONFIG.DC_API_TASKS_PATH, params, function(text, status){
      if (typeof success == 'function'){
        success(text, status);
      }
    });
  }
  var inspect = function(taskId, success){
    $.get(DC_CONFIG.DC_API_TASKS_PATH+'/'+taskId+'/inspect', {}, function(text, status){
        if (typeof success == 'function'){
          success(text, status);
        }
    });
  }
  
  return {
    list: list,
    inspect: inspect
  }
})();
