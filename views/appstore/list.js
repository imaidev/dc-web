var vm = null;
$(function(){
  vm = new Vue({
  	el: '#app-list',
  	data: {
  	  searchkey: '',
  	  searchType: '',
  	  apps: [],
  	  typelist: []
  	},
  	methods: {
  	  loadApps: function(){
  	    $.ajax({
  	      url: DC_CONFIG.DC_API_HOST+'/appstore',
  	      type: 'GET',
  	      data: {name: vm.searchkey, type: vm.searchType},
  	      success: function(data){
  	        var len = data.length;
  	        for(var i = 0; i < len; i++) {
  	          data[i].stars = parseInt(data[i].stars, 10);
  	        }
  	        vm.apps = data;
  	      }
  	    });
  	  },
  	  search: function(typeid){
  	    vm.searchType = typeid;
  	    vm.loadApps();
  	  }
  	  ,
  	  loadTypes: function(){
        $.ajax({
          url: DC_CONFIG.DC_API_HOST+'/appstore/types',
          type: 'GET',
          success: function(data){
            if (data.success) {
              vm.typelist = data.data;
            }
          }
        });
  	  },
  	  detail: function(appid){
  	    Router.href('detail.html?app='+appid);
  	  }
  	},
  	watch: {
  	  'searchkey': 'loadApps'
  	}
  });
  
  vm.loadTypes();
  vm.loadApps();

});
