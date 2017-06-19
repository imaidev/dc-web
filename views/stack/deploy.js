var vm = null;
var sfEditor = null;
$(function(){
  vm = new Vue({
		el: '#app-deploy',
		data: {
			app: {},
			typelist: []
		},
		methods: {
      submitStack: function(){
        var stackContent = sfEditor.getValue();
        stackContent = stackContent.replace(new RegExp(/\t/g), '  ');
        var stackName = $('#stackname').val();
        if ($.trim(stackName)) {
          ToastrTool.warning('Stack名称不能为空');
          return;
        }
        if ($.trim(stackContent)) {
          ToastrTool.warning('Stack YAML不能为空');
          return;
        }
        $.fn.dcPost('/stack/'+stackName, function(data){
          if (data.success) {
            ToastrTool.success('成功创建stack');
            Router.href('list.html');
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
});
