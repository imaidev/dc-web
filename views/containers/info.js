var ws_client = null;
var vm = null;
$(function(){
  var container_id = getParam('cid');
  var node_id = getParam('nid');
  
  vm = new Vue({
  	el: '#containerInfo',
  	data: {
  		cid: container_id,
  		nid: node_id,
  		container:{},
  		logs: [],
  	},
  	methods: {
  		loadContainer: function(){
  			loadContainerInfo();
  		},
  		start: function(){
  			ContainerAction.start(vm.cid, vm.nid, function(data, status){
  				vm.loadContainer();
  			});
  		},
  		stop: function(){
  			ContainerAction.stop(vm.cid, vm.nid, function(data, status){
  				vm.loadContainer();
  			});
  		},
  		restart: function(){
  			ContainerAction.restart(vm.cid, vm.nid, function(data, status){
  				vm.loadContainer();
  			});
  		},
  		trash: function(){
  			ContainerAction.terminate(vm.cid, vm.nid, function(data, text){
		    	window.location.href = list.html;
		    });
  		},
  		loadLogs: function(){
				if (ws_client != null) return;
				ws_client = new WebSocket(DC_CONFIG.DC_API_WS_PATH+'/containers/'+vm.cid+'/logs?node-id='+vm.nid);
				ws_client.onmessage = function (event) {  
					vm.logs.push(event.data);
					$('#divLogs').animate({scrollTop: $('#divLogs')[0].scrollHeight}, 10);//滑动到指定位置
				};
  		}
  	}
  });
  vm.loadContainer();
});

function loadContainerInfo(){
  ContainerAction.inspect(vm.cid, vm.nid, function(data, status){
      var cn = data.Name.substring(1), cn_short = cn.substring(cn.indexOf('__')+2)
      , state = data.State, startAt = state.StartedAt.substring(0, 19).replace('T', ' ')
      , config = data.Config, cmd = config.Cmd && !$.isEmptyObject(config.Cmd) ? config.Cmd : [], cmd_str = cmd.join(' ')
      , labels = config.Labels, sn = labels['com.docker.swarm.service.name'];
      var ports = data.NetworkSettings.hasOwnProperty('Ports') ? data.NetworkSettings.Ports : null;
      var envs = config.hasOwnProperty('Env') ? config.Env : [];
      var mounts = data.hasOwnProperty('Mounts') ? data.Mounts: [];
      
      vm.container = {name: cn, shortName: cn_short, image: config.Image
      								, service: sn, serviceShortName: sn
      								, isRunning: state.Running, status: state.Status, error: state.Error, pid: state.Pid, startedAt: startAt
      								, cmd: cmd, cmdStr: cmd_str
      								, ports: [], envs: [], volumes: []};
      
      if (ports){
	      for (var key in ports){
	      	var cps = key.split('/'), targetPort = cps[0], protocol = cps[1];
	      	  var host_p = ports[key]!=null?(ports[key][0].HostIp+':'+ports[key][0].HostPort):'';
	          vm.container.ports.push({TargetPort: targetPort, Protocol: protocol});
	      }
      }
      //Env
      for (var i = 0; i < envs.length; i++) {
        var env = envs[i].split('=');
        vm.container.envs.push({key: env[0], value: env[1]});
      }
      //Volumes
      for (var i = 0; i < mounts.length; i++) {
        vm.container.volumes.push({Target: mounts[i].Destination, Source: mounts[i].Source
        													, RW: mounts[i].RW, RwTxt: mounts[i].RW? '读写':'只读'})
      }
  });
}
