var myappid = null;
var service_name = null;
var vm = null;
var sfEditor = null;
$(function(){
  myappid = getParam('pk');
  
  vm = new Vue({
		el: '#app-info',
		data: {
			myapp: {},
			app: {},
			services: []
		},
		methods: {
			loadMyApp: function(){
				$.fn.dcGet(DC_CONFIG.DC_API_AUTHED_PATH + '/app/'+myappid, function(data){
				  if (data.success) {
				    vm.myapp = data.data;
				    vm.loadApp();
				  } else {
				    ToastrTool.error('查询失败');
				  }
				});
			},
      loadApp: function(){
        $.fn.dcGet(DC_CONFIG.DC_API_HOST+'/appstore/'+vm.myapp.app_id, function(data){
            vm.app = data;
        });
      },
      loadServices: function(){
        $.fn.dcGet(DC_CONFIG.DC_API_AUTHED_PATH+'/app/'+myappid+'/services', function(data){
          if (data.success) {
            var services = data.data;
            vm.services = data.data;
            setTimeout(function(){
              for (var i = 0; i < services.length; i++) {
                var obj = $('#'+services[i].name+'_noUiSlider')[0];
                noUiSlider.create(obj, {
                  start: 0,
                  step: 1,
                  tooltips: [ true],
                  connect: true,
                  range: {'min':0, 'max':10},
                  format: {
                    to: function(value){
                      return value!== undefined && value.toFixed(0);
                    },
                    from: Number
                  }
                });
                NoUiSliderDom.setValue(obj, services[i].replicas);
              }
            }, 1000);
            
          }
        });
      },
      serviceInfo: function(sname){
        Router.open('../services/info.html?pk='+sname);
      }
		}
	});
	
  //yaml编辑器
  sfEditor = CodeMirror.fromTextArea($('#sfEditor')[0], {
    mode: {name: 'yaml'},
    tabSize: 2,
    lineNumbers: true,
    showCursorWhenSelecting: true,
    theme: 'base16-dark'
  });
  
  vm.loadMyApp();
  
  $(document).on('click', '.btn-scale', function(event){
    var sname = $(event.target).parents('tr').attr('data-sname');
    var obj = $(event.target).parents('td').find('.slider-step');
    var scales = NoUiSliderDom.getValue(obj[0]);
    ServiceAction.scale(sname, scales+'', function(data, status){
      ToastrTool.success('成功扩展服务');
      vm.loadServices();
    });
  });
  
  $('.nav.nav-tabs>li>a').each(function(){
    $(this).click(function(){
      var _index = $(this).parent().index();
      switch(_index) {
        case 0 : vm.loadServices(); break;
        case 1 : setTimeout(function(){sfEditor.setValue(vm.myapp.stackyaml)}, 1000) ; break;
      }
    });
  });
  $('.nav.nav-tabs>li:first-child>a')[0].click();
});
