var vm = null;
var sfEditor = null;
$(function(){
  vm = new Vue({
		el: '#app-deploy',
		data: {
			app: {type:''},
			types: []
		},
		methods: {
		  loadTypes: function(){
		    $.get(DC_CONFIG.DC_API_HOST+'/appstore/types', function(data, status){
		      if (data.success) {
		        vm.types = data.data;
		      }
		    });
		  },
		  exampleYaml: function(){
		    var ymlContent = 'version: "3" \nservices:\n  web:\n    image: "tomcat:latest"\n    deploy:\n      labels:\n        ingress.targetport: 8080';
		    sfEditor.setValue(ymlContent);
		  },
      deployApp: function(){
        var stackContent = sfEditor.getValue();
        stackContent = stackContent.replace(new RegExp(/\t/g), '  ');
        if ($.trim(vm.app.name)=='') {
          ToastrTool.warning('应用名称不能为空');
          $('#appname').focus();
          return;
        }
        if ($.trim(vm.app.type)=='') {
          ToastrTool.warning('请选择应用类型');
          return;
        }
        if ($.trim(vm.app.stackname)=='') {
          ToastrTool.warning('Stack名称不能为空');
          return;
        }
        if ($.trim(stackContent)=='') {
          ToastrTool.warning('应用的Docker YAML配置不能为空');
          $('#stackname').focus();
          return;
        }
        vm.app.stackyaml = stackContent.replace(/"/g,'\"');
        $.fn.dcPost(DC_CONFIG.DC_API_AUTHED_PATH+'/app/deploy', vm.app, function(data){
          if (data.success) {
            ToastrTool.success('应用发布成功');
            Router.href('list.html');
          } else {
            ToastrTool.error(data.message);
          }
        });
      }
		}
	});
  sfEditor = CodeMirror.fromTextArea($('#sfEditor')[0], {
    mode: {name: 'yaml'},
    tabSize: 2,
    lineNumbers: true,
    showCursorWhenSelecting: true,
    theme: 'base16-dark'
  });
  
  vm.loadTypes();
});
