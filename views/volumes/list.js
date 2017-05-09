var vm = null;
$(function(){
	$('#btnCreateSave').click(function(){
		var newVolume = $('#volumeName').val();
		VolumeAction.create(newVolume, null, function(data, status){
			console.log(status);
			$('#newVolume').modal('hide');
			vm.listVolume();
		});
	});
	vm = new Vue({
		el: '#volumeList',
		data: {
			volumes: []
		},
		methods: {
			listVolume: function(){
				VolumeAction.list(null, function(json, status){
					vm.volumes =[];
					if (json instanceof Array) {
						for (var i = 0; i < json.length; i++) {
							var data = json[i];
							var vn = data.Name, vn_short = vn.split('__')[1];
							vm.volumes.push({name: vn, shortName: vn_short});
						}	
					}
				});
			},
			trash: function(event){
				var vn = $(event.target).parents('.mt-element-overlay>li').attr('data-vn');
				VolumeAction.remove(vn, function(data,status){
			    	ToastrTool.success('Volume已删除');
		    		vm.listVolume();
			    });
			},
			info: function(){
				var vn = $(event.target).parents('.mt-element-overlay>li').attr('data-vn');
				window.location.href = 'info.html?volume='+vn;
			}
		}
	});
  vm.listVolume();
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
