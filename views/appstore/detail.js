var vm = null;
var appid = null;
$(function(){
  vm = new Vue({
  	el: '#app-detail',
  	data: {
  	  btnText: '部署',
  	  appId: '',
  	  app: {},
  	  judgements: [],
  	  judgestatic: {},
  	  judgetitle: '',
  	  judgeInput: '',
  	  judgeCharNumber: 512,
  	  islogin: USER_INFO ? '1' : '0'
  	},
  	methods: {
  	  loadApp: function(){
  	    $.fn.dcGet(DC_CONFIG.DC_API_HOST+'/appstore/'+vm.appId, function(data, status){
          data.stars = parseInt(data.stars, 10);
          vm.app = data;
  	    });
  	  },
  	  loadAppJudgements: function(){
  	    $.fn.dcGet(DC_CONFIG.DC_API_HOST+'/appstore/'+vm.appId+'/judgements', function(data, status){
  	      if (data.success) {
              var judgelist=data.data.judgelist, statics=data.data.statics, len = judgelist.length;
              //评论列表
              for(var i = 0; i < len; i++) {
                judgelist[i].stars = parseInt(judgelist[i].stars, 10);
              }
              vm.judgements = judgelist;
              //评论统计
              vm.judgestatic = statics;
            }
  	    });
      },
  	  install: function(){
  	    vm.btnText = '正在部署...';
  	    AjaxTool.post(DC_CONFIG.DC_API_AUTHED_PATH+'/app/'+vm.app.id+'/install', null, function(data){
  	      vm.btnText = '部署';
          if (data.success) {
            ToastrTool.success('部署应用成功');
            window.location.href='../myapp/list.html';
          } else {
            ToastrTool.error('部署应用失败', data.message);
          }
        });
  	  },
  	  submitJudge: function(){
  	    var _stars = $('#judgeWraper input[name="score"]').val();
  	    $.fn.dcPost(DC_CONFIG.DC_API_AUTHED_PATH+'/app/'+vm.app.id+'/judge', {title: vm.judgetitle, content: vm.judgeInput, stars: _stars}, function(data, status){
  	      if (data.success) {
              ToastrTool.success('评论成功');
              vm.loadAppJudgements();
            } else {
              ToastrTool.error('评论失败', data.message);
            }
  	    });
  	  }
  	}
  });
  vm.appId = getParam('app');
  vm.loadApp();
  vm.loadAppJudgements();
  vm.$watch('judgestatic.avgstars', function (val, oldVal) {
    $('#avgJudge').raty({
      number: 5,
      path: DC_CONFIG.WEBUI_CONTEXT + '/skins/plugins/raty/img/',
      score: function(){
        return vm.judgestatic.avgstars;
      }
    });
  });
  vm.$watch('judgestatic.counts_5', function (val, oldVal) {
    $('#avg5 .progress-bar').css('width', (val/vm.judgestatic.counts)*100+'%');
  });
  vm.$watch('judgestatic.counts_4', function (val, oldVal) {
    $('#avg4 .progress-bar').css('width', (val/vm.judgestatic.counts)*100+'%');
  });
  vm.$watch('judgestatic.counts_3', function (val, oldVal) {
    $('#avg3 .progress-bar').css('width', (val/vm.judgestatic.counts)*100+'%');
  });
  vm.$watch('judgestatic.counts_2', function (val, oldVal) {
    $('#avg2 .progress-bar').css('width', (val/vm.judgestatic.counts)*100+'%');
  });
  vm.$watch('judgestatic.counts_1', function (val, oldVal) {
    $('#avg1 .progress-bar').css('width', (val/vm.judgestatic.counts)*100+'%');
  });
  vm.$watch('judgeInput', function (val, oldVal) {
    var _chars = val.length;
    vm.judgeCharNumber = 512-_chars;
  });
  $('#judgeWraper').raty({ 
    number: 5, 
    path: DC_CONFIG.WEBUI_CONTEXT + '/skins/plugins/raty/img/',
    score: function() {
      return $(this).attr('data-score');
    }
  });
});
