var vm = null;
$(function(){
  vm = new Vue({
  	el: '#containerList',
  	data: {
  	  containers: []
  	},
  	methods: {
  	  loadContainers: function(){
  	  	listContainers();
  	  },
  	  start: function(event){
  	  	var $li = $(event.target).parents('li');
  	  	var cid = $li.attr('data-cid'), nid = $li.attr('data-nid');
  	  	ContainerAction.start(cid, nid, function(data, text){
	    	ToastrTool.success('容器已成功启动.');
    		vm.loadContainers();
	    });
  	  },
  	  restart: function(event){
  	  	var $li = $(event.target).parents('li');
  	  	var cid = $li.attr('data-cid'), nid = $li.attr('data-nid');
  	  	ContainerAction.restart(cid, nid, function(data, text){
	    	ToastrTool.success('容器已重启.');
    		vm.loadContainers();
	    });
  	  },
  	  stop: function(event){
  	  	var $li = $(event.target).parents('li');
  	  	var cid = $li.attr('data-cid'), nid = $li.attr('data-nid');
  	  	ContainerAction.stop(cid, nid, function(data, text){
	    	ToastrTool.success('容器已停止.');
    		vm.loadContainers();
	    });
  	  },
  	  trash: function(event){
  	  	var $li = $(event.target).parents('li');
  	  	var cid = $li.attr('data-cid'), nid = $li.attr('data-nid');
  	  	ContainerAction.terminate(cid, nid, function(data, text){
	    	ToastrTool.success('容器已删除.');
    		vm.loadContainers();
	    });
  	  }
  	}
  });
  vm.loadContainers();
  $('.actions .container-action.container-action-start').click(function(){
  	start();
  });
  $('.actions .container-action.container-action-stop').click(function(){
  	stop();
  });
  $('.actions .container-action.container-action-restart').click(function(){
  	restart();
  });
  $('.actions .container-action.container-action-terminate').click(function(){
  	terminate();
  });
  $(document).on('click', '#containerList>li .container-info', function(){
    var c_id = $(this).parents('li').attr('data-cid'), n_id = $(this).parents('li').attr('data-nid');
    window.location.href = 'info.html?cid='+c_id+'&nid='+n_id;
  });
});
function listContainers(){
  
  ContainerAction.list(function(data,status){
    if (status == 'success' && data instanceof Array){
      var len = data.length;
      vm.containers = [];
      for (var i = 0; i < len; i++) {
      	var c = data[i], c_id = c.Id, c_n = c.Names[0].substring(1), c_short_name = c_n.substring(c_n.indexOf('__')+2)
      		, labels = c.Labels, n_id = labels['com.docker.swarm.node.id']
      		, s_id = labels['com.docker.swarm.service.id'], s_name = labels['com.docker.swarm.service.name']
      		, s_short_name = s_name.split('__')[1]
      		, status = c.Status, state = c.State, image = c.Image;
      	vm.containers.push({id: c_id, name: c_n, shortName: c_short_name
      						, service: s_name, serviceShortName: s_short_name
      						, nid: n_id, status: status, state: state, image: image});
        
      }
    }
  });
}

function selectedContainer(){
  var sids = new Array();
  $('input[type="checkbox"][name="selector"]:checked').each(function(){
    var c = $(this).parents('li'), cid = c.attr('data-cid'), nid = c.attr('data-nid');
    if (cid && nid){
      sids.push({cid:cid, nid:nid});
    }
  });
  return sids;
}

function start(){
  var cids = selectedContainer();
  if (cids.length == 0) {
  	ToastrTool.warning('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.start(cids[i].cid, cids[i].nid);
  }
}

function stop(){
  var cids = selectedContainer();
  if (cids.length == 0) {
  	ToastrTool.warning('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.stop(cids[i].cid, cids[i].nid);
  }
}

function restart(){
  var cids = selectedContainer();
  if (cids.length == 0) {
  	ToastrTool.warning('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.restart(cids[i].cid, cids[i].nid);
  }
}

function terminate(){
  var cids = selectedContainer();
  if (cids.length == 0) {
  	ToastrTool.warning('Select one container');
    return;
  }
  var counter = 0;
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.terminate(cids[i].cid, cids[i].nid, function(data, text){
    	counter++;
    	ToastrTool.warning('Delete container success.', 'container:'+cids[i]);
    	if (counter == cids.length) {
    		vm.loadContainers();
    	}
    });
  }
}

