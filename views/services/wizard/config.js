var vm = null;
$(function(){
	vm = new Vue({
		el: '#app-create',
		data: {
			imageName: '',
			serviceName: '',
			containers: '',
			c_path: '',
			h_path: '',
			isReadable: true,
			envName: '',
			envValue: '',
			ports: [],
			envs: [],
			volumes: []
		},
		methods: {
			loadImage: function(){
			  if($.trim(vm.imageName) == '') return;
			  ImagesAction.inspect(vm.imageName, function(data){
					if (data == null || typeof data != 'object' || (typeof data == 'object' && !data.hasOwnProperty('Id'))){
			      return;
			    }
					var config = data.Config, volumes = config.Volumes, entryPoint = config.Entrypoint
			    , exposedPorts = config.ExposedPorts, env = config.Env;
			    
			    vm.volumes = config.Volumes ? config.Volumes : [];
			    
			    vm.ports = [];
			    if (exposedPorts != null) {
			      for (var key in exposedPorts) {
			        var po = key.split('/')[0], proto = key.split('/')[1];
			        vm.ports.push({TargetPort: parseInt(po, 10), Protocol: proto});
			      }
			    }
			    vm.envs = [];
			    if (env != null && env.length > 0) {
			      for (var i = 0; i < env.length; i++) {
			      	var e = env[i].split('=');
			      	vm.envs.push({key: e[0], value: e[1]});
			      }
					}
				});
			},
			checksn: function(){
			  var reg = /^[a-z][a-z0-9]{1,19}(__[1-9][0-9]{0,4})?$/g;
			  if (!reg.test(vm.serviceName)){
			   	ToastrTool.warning('应用名称格式：小写字母、[任意数字]任意组合+[__端口号]');
			  	$('#serviceName').select();
			   	return false;
			  }
			  return true;
			},
			addEnv: function(){
				vm.envs.push({key:vm.envName,value:vm.envValue});
				vm.envName = '';
				vm.envValue = '';
			},
			addPort: function(){
				vm.ports.push({TargetPort:'', Protocol:'tcp'});
			},
			addVolume: function(){
				vm.volumes.push({Source: vm.h_path, Target: vm.c_path});
				vm.h_path='';
				vm.c_path;
			},
			trash: function(event) {
				var index = $(event.target).parents('tr').index();
				var tbl = $(event.target).parents('table')[0].id;
				switch(tbl){
					case 'tblPorts': vm.ports.splice(index, 1); break;
					case 'tblEnvs': vm.envs.splice(index, 1); break;
					case 'tblVolumes': vm.volumes.splice(index, 1); break;
				}
			},
			submit: function(){
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
		  	var config_mode = {Replicated:{Replicas: vm.containers == '' ? 1 : vm.containers}};
				var config = {Name: vm.serviceName, 
		            TaskTemplate:{
		              ContainerSpec:{
		                Image: vm.imageName,
		                Env: tmp_envs,
		                Mounts: vm.volumes
		              }
		            },
		            Mode: config_mode,
		            EndpointSpec: {
		              Ports: vm.ports
		            }
		           };
		    ServiceAction.create(config, function(data, status){
		        window.location.href = '../info.html?service_id='+data.ID;
		    });
			}
		}
	});
});
