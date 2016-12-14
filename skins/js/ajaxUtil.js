var AjaxTool = {
  post: function(url, requestBody, success, error){
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: requestBody != null ? JSON.stringify(requestBody) : null,
	  beforeSend: function(xhr){
		$.blockUI({message:$('.loader')});
	  },
      error: function(e, h, r){
        if (typeof error != 'function'){
          ToastrTool.error('ajax post error: ' + r);
        } else {
          error(e,h,r);
        }
      },
      success: function(text, status) {
        if (typeof success == 'function') {
          success(text, status);
        } else {
          ToastrTool.success('ajax post success');
        }
      },
	  complete: function(xhr, ts){
	  	$.unblockUI();
	  }
    });
  },
  
  put: function(url, requestBody, success, error){
    $.ajax({
      url: url,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: requestBody != null ? JSON.stringify(requestBody):null,
	  beforeSend: function(xhr){
		$.blockUI({message:$('.loader')});
	  },
      error: function(e, h, r){
        if (typeof error != 'function'){
          ToastrTool.error('ajax put error: ' + r);
        } else {
          error(e,h,r);
        }
      },
      success: function(text, status) {
        if (typeof success == 'function') {
          success(text, status);
        } else {
          ToastrTool.success('ajax put success');
        }
      },
	  complete: function(xhr, ts){
	  	$.unblockUI();
	  }
    });
  },
  get: function(url, params, success, error){
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: params != null ? JSON.stringify(params):null,
	  beforeSend: function(xhr){
		$.blockUI({message:$('.loader')});
	  },
      error: error,
      success: success,
	  complete: function(xhr, ts){
	  	$.unblockUI();
	  }
    });
  },
  delete: function(url, params, success, error){
    $.ajax({
      url: url,
      type: 'DELETE',
      dataType: 'json',
      data: params != null ? JSON.stringify(params):null,
	  beforeSend: function(xhr){
		$.blockUI({message:$('.loader')});
	  },
      error: error,
      success: success,
	  complete: function(xhr, ts){
	  	$.unblockUI();
	  }
    });
  }
};
