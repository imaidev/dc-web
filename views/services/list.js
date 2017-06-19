var vm = null;
$(function(){
	vm = new Vue({
		el: '#serviceList',
		data: {
			services: []
		},
		methods: {
			listService: function(){
				ServiceAction.list(null, function(json, status){
					vm.services =[];
					if (json instanceof Array) {
						for (var i = 0; i < json.length; i++) {
							var data = json[i];
							var sn = data.Spec.Name, id = data.ID
							, replicas = data.Spec.Mode.Replicated.Replicas
							, status = 'running', isRunning = status == 'running' ? true: false
							, image = data.Spec.TaskTemplate.ContainerSpec.Image
							, updatedAt = data.UpdatedAt.substring(0,19).replace('T', ' ')
							, labels = data.Spec.Labels, app = 'com.dc.app.name' in labels ? labels['com.dc.app.name']:''
							, dns = labels['ingress.dnsname'], url = '//'+dns;
							vm.services.push({name: sn, id: id, replicas: replicas, app: app
								              , url: url, status: status, isRunning: isRunning, image: image, updatedAt: updatedAt});
						}	
					}
				});
			},
			start: function(event){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.start(sid, function(data, status){
					ToastrTool.success('应用成功启动');
					vm.listService();
				});
			},
			stop: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.stop(sid, function(data, status){
					ToastrTool.success('应用已停止');
					vm.listService();
				});
			},
			trash: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.terminate(sid, function(data,status){
			    	ToastrTool.success('应用已删除');
		    		vm.listService();
			    });
			},
			info: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				window.location.href = 'info.html?pk='+sid;
			}
		}
	});
  vm.listService();
 });

function selectedService(){
  var sids = new Array();
  $('input[type="checkbox"][name="selector"]:checked').each(function(){
    var v = $(this).parents('li').attr('data-sid');
    if (v){
      sids.push(v);
    }
  });
  return sids;
}

function start(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.start(sids[i], function(data, status){
    	if(i+1 == sids.length) {
    		ToastrTool.success('应用成功启动');
    		vm.listService();
    	}
    });
  }
}

function stop(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.stop(sids[i], function(data, status){
    	if(i+1 == sids.length) {
    		ToastrTool.success('应用已停止运行');
    		vm.listService();
    	}
    });
  }
}

function terminate(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.terminate(sids[i], function(data, status){
    	if(i+1 == sids.length) {
    		ToastrTool.success('应用已删除');
    		vm.listService();
    	}
    });
  }
}
