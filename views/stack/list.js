var vm = null;
$(function(){
	vm = new Vue({
		el: '#stack-list',
		data: {
			stacklist: []
		},
		methods: {
			loadStacklist: function(){
        $.fn.dcGet(DC_CONFIG.DC_API_AUTHED_PATH + '/stack', function(data){
          if (data.success) {
            vm.stacklist =  data.data;
          }
        });
			},
			trashStack: function(id){
        $.fn.dcAjax({
          url: DC_CONFIG.DC_API_AUTHED_PATH + '/stack',
          type: 'DELETE',
          success: function(data) {
            if (data.success) {
              ToastrTool.success('成功移除Stack');
              vm.loadStacklist();
            }
          }
        });
			},
			info: function(id){
        Router.href('info.html?pk='+id);
			},
      createStack: function(){
        Router.href('deploy.html');
      }
		}
	});
  vm.loadStacklist();
});

