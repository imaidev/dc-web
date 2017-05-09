var vm = null;
$(function(){
	vm = new Vue({
		el: '#app-list',
		data: {
			applist: []
		},
		methods: {
			loadMyApps: function(){
        $.fn.dcGet(DC_CONFIG.DC_API_AUTHED_PATH + '/app', function(data){
          if (data.success) {
            vm.applist =  data.data;
          }
        });
			},
			trash: function(id){
        $.fn.dcAjax({
          url: DC_CONFIG.DC_API_AUTHED_PATH + '/app/'+id,
          type: 'DELETE',
          success: function(data) {
            if (data.success) {
              ToastrTool.success('成功卸载');
              vm.loadMyApps();
            } else {
              ToastrTool.error('卸载失败');
            }
          }
        });
			},
			info: function(id){
        Router.href('info.html?pk='+id);
			}
		}
	});
  vm.loadMyApps();
});

