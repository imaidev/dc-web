var vm = null;
$(function(){
	vm = new Vue({
		el: '#serviceList',
		data: {
			services: []
		},
		methods: {
			listService: function(){
				ServiceAction.list(null, function(data, status){
					if (data instanceof Array) {
						vm.services =data; 
					}
				});
			}
		}
	});
  vm.listService();
  $(document).on('click', '#serviceList>li .service-info .service-name', function(){
    var s_id = $(this).parents('li').attr('data-sid');
    window.location.href = 'info.html?service_id='+s_id;
  });
  $(document).on('click', '#serviceList>li .glyphicon-stop', function(){
    var s_id = $(this).parents('li').attr('data-sid');
    ServiceAction.stop(s_id);
  });
  $(document).on('click', '#serviceList>li .glyphicon-start', function(){
    var s_id = $(this).parents('li').attr('data-sid');
    ServiceAction.start(s_id);
  });
  $(document).on('click', '#serviceList>li .glyphicon-trash', function(){
    var s_id = $(this).parents('li').attr('data-sid');
    ServiceAction.terminate(s_id, function(data,status){
    	if (status == 'success'){
    		window.reload();
    	}
    });
  });
}
);

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
    ServiceAction.start(sids[i]);
  }
}

function stop(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.stop(sids[i]);
  }
}

function redeploy(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.redeploy(sids[i]);
  }
}

function terminate(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.terminate(sids[i]);
  }
}
