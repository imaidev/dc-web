var VolumeAction = (function(){
  var list = function(params, success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_VOLUMES_PATH, params, function(text, status){
    	if (status != 'success' || text.hasOwnProperty('statusCode')){
    	  ToastrTool.error('List volume failed');
        } else {
          success_cal(text, status);
        }
    }, function(e,h,r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('List volume failed ', r);
    	}
	});
  };
  var create = function(volumeName, vol_conf, success_cal, error_cal){
    AjaxTool.post(DC_CONFIG.DC_API_VOLUMES_PATH+'?volume='+volumeName, vol_conf==null?{}:vol_conf, function(text, status){
		if (status != 'success' || text.hasOwnProperty('statusCode')){
		  ToastrTool.error('Create volume failed: ' + status);
		} else {
	      if (typeof success_cal == 'function'){
	    	success_cal(text, status);
		  } else {
		    ToastrTool.success('Create volume success');
		  }
		}
    }, function(e, h, r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('Create volume failed ', r);
    	}
    });
  };
  
  var inspect = function(volume, success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_VOLUMES_PATH+'/'+volume, {}, function(text, status){
    	success_cal(text, status);
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Inspect volume failed ', r);
	    }
    });
  };
  
  var remove = function(volume, success_cal, error_cal){
  	  AjaxTool.delete(DC_CONFIG.DC_API_VOLUMES_PATH+'/'+volume, {}, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Delete volume failure: ' + status);
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Get volume failure ', r);
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
