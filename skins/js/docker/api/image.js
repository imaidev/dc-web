var ImagesAction = (function(){
  var list = function(success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_IMAGES_PATH, params, function(text, status){
        success_cal(text, status);
    }, function(e,h,r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('List images failed ', r);
    	}
    });
  };
  
  var inspect = function(image_name, success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_IMAGES_PATH+'/'+$.base64.encode(image_name), null, function(text, status){
    	if (status == 'success' && typeof text == 'object' && text.hasOwnProperty('Id')){
    	  if (typeof success_cal == 'function'){
	        success_cal(text, status);
		  } else {
		    ToastrTool.success('Inspect image success');
	      }
    	} else {
		  //ToastrTool.error('Inspect image failed', text.hasOwnProperty('message')?text.message:null);
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(e,h,r);
	    } else {
	    	//ToastrTool.error('Inspect image failed ', r);
	    }
    });
  };
  
  return {
    list: list,
    inspect: inspect
  }
})();
