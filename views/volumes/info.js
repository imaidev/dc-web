var vn = null;
var vm = null;
$(function(){
  vn = getParam('volume');

  vm = new Vue({
		el: '#app-volume-info',
		data: {
			volume: {},
			services: []
		},
		methods: {
			inspectVolume: function(){
				VolumeAction.info(vn, function(data, status){
			    if (status == 'success' && data instanceof Object){
			    	var vn = data.Name, s-vn = vn.substring(vn.indexOf('__')+2);
			    	vm.volume = {name: vn, shortName: s-vn}
			    }
			  });
			},
		}
	});
  vm.inspectVolume();
});
