Vue.component('vue-grid', {
	template: '<table><thead>'
					      +'<tr>'
					        +'<th v-for="key in colnames"'
					          +'@click="sortBy(key)"'
					          +':class="{ active: sortKey == key }">'
					          +'{{ key | capitalize }}'
					          +'<span class="arrow" :class="sortOrders[key] > 0 ? \'asc\':\'dsc\'"></span>'
					        +'</th>'
					      +'</tr>'
					    +'</thead>'
					    +'<tbody>'
					      +'<tr v-for="entry in filterData">'
					        +'<td v-for="key in colkeys">'
					          +'{{entry[key]}}'
					        +'</td>'
					      +'</tr>'
					    +'</tbody>'
					  +'</table>',
	props:{
		data: Array,
		colkeys: Array,
		colnames: Array,
		filterkey: String
	},
	data: function(){
		var sortOrders = {};
		this.colkeys.forEach(function(key){
			sortOrders[key] = 1;
		});
		return {
			sortKey: '',
			sortOrders: sortOrders
		}
	},
	computed: {
		filterData: function(){
			var sortKey = this.sortKey, filterKey = this.filterkey && this.filterkey.toLowerCase()
			, order = this.sortOrders[sortKey] || 1, data = this.data;
			if(filterKey) {
				data = data.filter(function(row){
					return Object.keys(row).some(function(key){
						return String(row[key]).toLowerCase().indexOf(filterKey) > 1;
					});
				});
			}
			if (sortKey){
				data = data.slice().sort(function(a,b){
					a = a[sortKey], b = b[sortKey];
					return (a===b ? 0 : a>b ? 1 : -1)*order;
				});
			}
			return data;
		}
	},
	filters: {
		capitalize: function(str){
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	},
	methods: {
		sortBy: function(key){
			this.sortKey = key;
			this.sortOrders[key] = this.sortOrders[key]*-1;
		}
	}
});