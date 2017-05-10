
var USER_INFO = null;
$(function(){
  //vue.js 调试模式
  Vue.config.debug = true
  
  //解析cookie，获取用户信息
  var tnt = $.fn.dcCookie('dctenant');
  if (tnt == null || tnt == 'null') {
    var itoken = $.fn.dcCookie('itoken');
    if (itoken != null && itoken != ''){
      $.ajax({
        type: 'get',
        url: '//dev.imaicloud.com/iam/v1/tenants/current',
        contentType: 'application/json',
        async: false,
        beforeSend: function(xhr){
          xhr.setRequestHeader('X-Auth-Token', itoken);
        },
        success: function(data, status){
          if (status=='success' && 'id' in data) {
            var tnt = data.id.toLowerCase();
            $.fn.dcCookie('dctenant', tnt);
          }
        }
      });
    }
  }
  DC_CONFIG.DC_API_AUTHED_PATH = DC_CONFIG.DC_API_AUTHED_PATH.replace('{tenant}', tnt);
  DC_CONFIG.DC_API_WS_PATH = DC_CONFIG.DC_API_WS_PATH.replace('{tenant}', tnt);
  DC_CONFIG.DC_API_SERVICES_PATH = DC_CONFIG.DC_API_SERVICES_PATH.replace('{tenant}', tnt);
  DC_CONFIG.DC_API_CONTAINERS_PATH = DC_CONFIG.DC_API_CONTAINERS_PATH.replace('{tenant}', tnt);
  DC_CONFIG.DC_API_IMAGES_PATH = DC_CONFIG.DC_API_IMAGES_PATH.replace('{tenant}', tnt);
  DC_CONFIG.DC_API_VOLUMES_PATH = DC_CONFIG.DC_API_VOLUMES_PATH.replace('{tenant}', tnt);
  
  var payload = $.fn.dcCookie('imaicloud_payload');
  if (payload != null && payload != '') {
    payload = $.base64.decode(payload);
    USER_INFO = JSON.parse(payload);
  }
  
  $('input[type="checkbox"].selector.selector-all').click(function(){
    if (this.checked) {
      $('input[type="checkbox"][name="selector"]').each(function(){
        $(this).prop('checked', true);
      });
    } else {
      $('input[type="checkbox"][name="selector"]:checked').each(function(){
        $(this).prop('checked', false);
      });
    }
  });
  
  LoadingDiv.init();
  BlockUI.init();
  
  DockerActionDom.init();
  NoUiSliderDom.init();
  
  /**
   * 用于转化系统时间，按照正则表达式的形式显示
   * formatStr:
   *  yyyy:年
   *  MM:月
   *  dd:日
   *  hh:小时
   *  mm:分钟
   *  ss:秒
   */
  Date.prototype.toFormatString = function(formatStr) {
      var date = this;
      var timeValues = function() {
      };
      timeValues.prototype = {
          year : function() {
              if (formatStr.indexOf("yyyy") >= 0) {
                  return date.getFullYear();
              } else {
                  return date.getFullYear().toString().substr(2);
              }
          },
          elseTime : function(val, formatVal) {
              return formatVal >= 0 ? (val < 10 ? "0" + val : val) : (val);
          },
          month : function() {
              return this.elseTime(date.getMonth() + 1, formatStr.indexOf("MM"));
          },
          day : function() {
              return this.elseTime(date.getDate(), formatStr.indexOf("dd"));
          },
        hour : function() {
            return this.elseTime(date.getHours(), formatStr.indexOf("hh"));
        },
        minute : function() {
            return this.elseTime(date.getMinutes(), formatStr.indexOf("mm"));
        },
        second : function() {
            return this.elseTime(date.getSeconds(), formatStr.indexOf("ss"));
        }
      };
      var tV = new timeValues();
      var replaceStr = {
        year : [ "yyyy", "yy" ],
        month : [ "MM", "M" ],
        day : [ "dd", "d" ],
        hour : [ "hh", "h" ],
        minute : [ "mm", "m" ],
        second : [ "ss", "s" ]
      };
      for ( var key in replaceStr) {
        formatStr = formatStr.replace(replaceStr[key][0], eval("tV." + key
                + "()"));
        formatStr = formatStr.replace(replaceStr[key][1], eval("tV." + key
                + "()"));
      }
      return formatStr;
    };
});

//获取页面传递的查询参数
function getParams(){
  var search = window.location.search;
  if (search && search != '' && search.indexOf('?')>=0) {
    var ps = search.substring(1).split('&');
    var params = {};
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i].split('=');
      params[p[0]] = p[1]; 
    }
    return params;
  }
  return null;
}
//根据key获取页面查询参数值
function getParam(keyN){
  var params = getParams();
  if (params!=null) {
    return params[keyN];
  }
  return '';
}


var DockerActionDom = {
  ServiceDom : {
    init: function(){
      this.create();
    },
    create: function(){
      $(document).on('click', '.btn.service-action.service-action-create', function(){
        window.location.href = DC_CONFIG.WEBUI_CONTEXT+ '/views/services/wizard/config.html'
      });
    }
  },
  init: function(){
    this.ServiceDom.init();
  }
}

var NoUiSliderDom = {
  init: function(){
    $('.noUiSlider.slider-step.auto-create').each(function(){
      var obj = this;
      noUiSlider.create(obj, {
        start: [0],
        step: 1,
        connect: true,
        tooltips: [ true],
        range: {'min':0, 'max':10},
        format: {
          to: function(value){
            return value!== undefined && value.toFixed(0);
          },
          from: Number
        }
      });
    });
  },
  setValue: function(obj, v){
    $(obj)[0].noUiSlider.set(v);
  },
  getValue: function(obj){
    return Math.round($(obj)[0].noUiSlider.get());
  }
}

var ToastrTool = {
	success: function(title, msg){
		toastr['success'](title, msg);
	},
	error: function(title, msg){
		toastr['error'](title, msg);
	},
	info: function(title, msg){
		toastr['info'](title, msg);
	},
	warning: function(title, msg){
		toastr['warning'](title, msg);
	}
}
var BlockUI = {
	init: function(){
		$.blockUI.defaults = {
			message:  '<h1>Please wait...</h1>',
			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)
			theme: false, // set to true to use with jQuery UI themes
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'50%',
				textAlign:	'center',
				color:		'#444444',
				border:		'none',
				backgroundColor:'transparent',
				cursor:		'wait'
			},
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'50%'
			},
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},
			cursorReset: 'default',
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
			forceIframe: false,
			baseZ: 1000,
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,
			allowBodyStretch: true,
			bindEvents: true,
			constrainTabKey: true,
			fadeIn:  200,
			fadeOut:  400,
			timeout: 0,
			showOverlay: true,
			focusInput: true,
            		focusableElements: ':input:enabled:visible',
			onBlock: null,
			onUnblock: null,
			quirksmodeOffsetHack: 4,
			blockMsgClass: 'blockMsg',
			ignoreIfBlocked: false
		}
	}
}
var LoadingDiv = {
	init: function(){
		$(document.body).append('<div class="loader" style="display:none;"><div class="loader-inner ball-clip-rotate-multiple"><div></div><div></div></div></div>');
	}
}
