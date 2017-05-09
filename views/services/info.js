var service_id = null;
var service_name = null;
var vm = null;
$(function(){
  service_id = getParam('pk');

  vm = new Vue({
		el: '#app-service-info',
		data: {
			service: {},
			containers: [],
			envs: [],
			ports: [],
			volumes: [],
			isModify: false
		},
		methods: {
			inspectService: function(){
				ServiceAction.info(service_id, function(data, status){
			    if (status == 'success' && data instanceof Object){
			    	var sn = data.Spec.Name
			    	, ua = data.UpdateAt, url = 'https://'+sn+'.swarm.imaicloud.com'
			    	, image = data.Spec.TaskTemplate.ContainerSpec.Image;
			      vm.service = {name: sn, updateAt: ua, url:url, image: image, status: 'running'};
			      
			      vm.containers = [];
			      for (var i = 0; i < data.ContainerInfo.length; i++) {
			      	var ci = data.ContainerInfo[i], _cn = ci.Name, _cn_short = _cn.substring(_cn.indexOf('__')+2);
			      	vm.containers.push({id: ci.Id, nid: ci.NodeID, name: _cn, shortName: _cn_short, state: ci.State, status: ci.Status});
			      }
			      
			      if (data.Spec.hasOwnProperty('EndpointSpec') && data.Spec.EndpointSpec.hasOwnProperty('Ports')) {
			      	vm.ports = data.Spec.EndpointSpec.Ports;
			      }

			      if (data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Mounts')) {
			      	vm.volumes = data.Spec.TaskTemplate.ContainerSpec.Mounts;
			      }
			      
			      if (data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Env')) {
			      	var es = data.Spec.TaskTemplate.ContainerSpec.Env;
			      	vm.envs = [];
			      	for (var i = 0; i < es.length; i++) {
			      		var e = es[i].split('=');
			      		vm.envs.push({key: e[0], value: e[1]});
			      	}
			      }
			      
			      vm.isModify =false;
			      
			      if (data.Spec.Mode.hasOwnProperty('Replicated')) {
			        NoUiSliderDom.setValue($('#slider-step')[0], data.Spec.Mode.Replicated.Replicas);
			      }
			    }
			  });
			},
			addEnv: function(){
				vm.envs.push({key:'',value:''});
			},
			addPort: function(){
				vm.ports.push({TargetPort:'', Protocol:'tcp'});
			},
			addVolume: function(){
				vm.volumes.push({Source:'', Target:''});
			},
			removetr: function(event){
				if ($(event.target).parents('table')[0].rows.length == 1) return;
				
				var index = $(event.target).parents('tr').index();
				var tbl = $(event.target).parents('table')[0].id;
				switch(tbl){
					case 'tblPorts': vm.ports.splice(index, 1); break;
					case 'tblEnvs': vm.envs.splice(index, 1); break;
					case 'tblVolumes': vm.volumes.splice(index, 1); break;
				}
			},
			save: function(){
				var tmp_envs = [];
				for (var i = 0; i < vm.envs.length; i++){
					if ($.trim(vm.envs[i].key) == '') {
						vm.envs.splice(i, 1);
						i--;
					} else {
						tmp_envs.push(vm.envs[i].key+'='+vm.envs[i].value);
					}
				}
				for (var i = 0; i < vm.ports.length; i++){
					if ($.trim(vm.ports[i].TargetPort) == '') {
						vm.ports.splice(i, 1);
						i--;
					}
				}
				for (var i = 0; i < vm.volumes.length; i++){
					if ($.trim(vm.volumes[i].Source) == '' || $.trim(vm.volumes[i].Target) == '') {
						vm.volumes.splice(i, 1);
						i--;
					}
				}
				
  			var config = {Name: vm.service.name, 
                TaskTemplate:{
                  ContainerSpec:{
                    Image: vm.service.image,
                    Env: tmp_envs,
                    Mounts: vm.volumes
                  }
                },
                EndpointSpec: {
                  Ports: vm.ports
                }
               };
				ServiceAction.update(service_id, vm.service.index, config, function(sdata, status){
				  Router.reload();
				});
			}
		}
	});
  vm.inspectService();
  
  vm.$watch('envs', function(){
	  vm.isModify = true;
  });
  
  vm.$watch('ports', function(){
	  vm.isModify = true;
  });
  
  vm.$watch('volumes', function(){
	  vm.isModify = true;
  });
  
  $('.btn.btn-start').click(function(){
    ServiceAction.start(service_id, function(data, status){
    	vm.inspectService();
    });
  });
  $('.btn.btn-stop').click(function(){
    ServiceAction.stop(service_id, function(data, status){
    	vm.inspectService();
    });
  });
  $('.btn.btn-remove').click(function(){
    ServiceAction.terminate(service_id, function(data, status){
    	if (status == 'success'){
    		window.location.href = 'list.html';
    	}
    });
  });
  $('#btnScale').click(function(){
    var scales = NoUiSliderDom.getValue($('#slider-step')[0]);
    ServiceAction.scale(service_id, scales+'');
  });
  $(document).on('click', '#containers .item .item-title', function(){
    var cid = $(this).parent().attr('data-id'), nodeId = $(this).parent().attr('data-nid');
    Router.open('/views/containers/info.html?cid='+cid+'&nid='+nodeId, '_blank');
  });
});
