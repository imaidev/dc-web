var container_id = null;
var node_id = null;
var container_name = null;
var ws_client = null;
$(function(){
  container_id = getParam('cid');
  node_id = getParam('nid');
  loadContainerInfo(container_id)
  $('.container-action.container-action-start').click(function(){
  	  ContainerAction.start(container_id, node_id);
  });
  $('.container-action.container-action-stop').click(function(){
    ContainerAction.stop(container_id, node_id);
  });
  $('.container-action.container-action-restart').click(function(){
    ContainerAction.restart(container_id, node_id);
  });
  $('.container-action.container-action-terminate').click(function(){
    ContainerAction.terminate(container_id, node_id, function(data, text){
    	window.location.href = list.html;
    });
  });
});

function loadContainerInfo(){
  ContainerAction.inspect(container_id, node_id, function(data, status){
      container_name = data.Name.substring(1);
      $('small[name="container_name"]').html(container_name);
      $('#container_name').html(container_name.substring(container_name.indexOf('__')+2))
      var state = data.State, config = data.Config, labels = config.Labels, sname = labels['com.docker.swarm.service.name'];
      var ports = data.NetworkSettings.hasOwnProperty('Ports') ? data.NetworkSettings.Ports : null;
      var envs = config.hasOwnProperty('Env') ? config.Env : [];
      var mounts = data.hasOwnProperty('Mounts')?data.Mounts:[];
      $('#container_status').html(state.Status);
      $('#container_status').addClass(state.Status);
      $('#container_started').html(state.StartedAt);
      $('#service-name').html(sname.substring(sname.indexOf('__')+2));
      $('#image').html(config.Image);
      $('#command').html(config.hasOwnProperty('Cmd')?(config.Cmd!=null?config.Cmd.join(' '):''):'');
      $('#pid').html(state.Pid);
      
      if (ports != null){
	      for (var key in ports){
	      	  var target = ports[key]!=null?(ports[key][0].HostIp+':'+ports[key][0].HostPort):'';
	          var tr = '<tr><td>'+target+'</td><td>'+key+'</td><tr>';
	          $('#tblPorts tbody').append(tr);
	      }
      }
      
      //Env
      $('#tblEnvs tbody').html('');
      for (var i = 0; i < envs.length; i++) {
        var env = envs[i].split('=');
        var tr = '<tr><td class="item-key">'+env[0]+'</td><td class="item-value">'+env[1]+'</td></tr>';
        $('#tblEnvs tbody').append(tr);
      }
      //Volumes
      $('#tblVolumes tbody').html('');
      for (var i = 0; i < mounts.length; i++) {
        var env = mounts[i];
        var tr = '<tr><td>'+mounts[i].Source+'</td><td >'+mounts[i].Destination+'</td><td>'+(mounts[i].RW?'Writable':'Readable')+'</td></tr>';
        $('#tblVolumes tbody').append(tr);
      }
  });
}

function loadLogs(){
	if (ws_client != null) return;
	ws_client = new WebSocket(DC_CONFIG.DC_API_WS_PATH+'/containers/'+container_id+'/logs?node-id='+node_id);
	ws_client.onopen = function () {  
        console.log('Info: ws connection opened.');  
    };  
      
    ws_client.onmessage = function (event) {  
    	setTimeout(function(){
    		$('#divLogs').append('<p>'+event.data+'</p>');
    	}, 1000);
        
    };  
    ws_client.onclose = function (event) {  
        console.log('Info: connection closed.');  
    }; 
}