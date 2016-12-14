var service_id = null;
var service_name = null;
$(function(){
  service_id = getParam('service_id');
  loadServiceInfo(service_id)
  $('#btnEdit').click(function(){
    window.location.href = 'edit.html?service_id='+service_id;
  });
  $('#btnScale').click(function(){
    var scales = NoUiSliderDom.getValue($('#slider-step')[0]);
    ServiceAction.scale(service_id, scales+'');
  });
  $(document).on('click', '#containers .item .item-title', function(){
    var cid = $(this).parent().attr('data-id'), nodeId = $(this).parent().attr('data-nid');
    window.location.href = DC_CONFIG.WEBUI_CONTEXT+'/views/containers/info.html?cid='+cid+'&nid='+nodeId;
  });
});

function loadServiceInfo(){
  ServiceAction.info(service_id, function(data, status){
    if (status == 'success'){
      service_name = data.Spec.Name;
      $('small[name="service_name"]').html(service_name);
      $('#service_name').html(service_name.substring(service_name.indexOf('__')+2));
      //service state 由tasks获取
      $('#service_state').html('');
      $('#updatedAt').html(data.UpdatedAt);
      var cs = data.Spec.TaskTemplate.ContainerSpec;
      $('#image').html(cs.Image);
      if (data.Spec.Mode.hasOwnProperty('Replicated')) {
        $('#mode').html('Replicated');
        NoUiSliderDom.setValue($('#slider-step')[0], data.Spec.Mode.Replicated.Replicas);
      }
      
  var ports = data.Spec.hasOwnProperty('EndpointSpec') && data.Spec.EndpointSpec.hasOwnProperty('Ports')? data.Spec.EndpointSpec.Ports:null;
      if (ports != null && ports.length > 0){
        for (var i = 0; i < ports.length; i++) {
          var tr = '<tr><td>'+ports[i].TargetPort+'</td><td>'+ports[i].Protocol+'/'+ports[i].PublishedPort+'</td><tr>';
          $('#tblPorts tbody').append(tr);
        }
      }
      //Containers info
      var containers = data.ContainerInfo;
      $('#containers').html('');
      for (var i = 0; i < containers.length; i++) {
      	var cn = containers[i].Name;
        var item = '<div class="col-md-6 item" data-id="'+containers[i].Id+'" data-nid="'+containers[i].NodeID+'">'
                    +'<div class="col-md-6 item-title" title="'+cn+'">'+cn.substring(cn.indexOf('__')+2)+'</div>'
                    +'<div class="col-md-2 item-state '+containers[i].State+'">'+containers[i].State+'</div>'
                    +'<div class="col-md-4 item-date">'+containers[i].Status+'</div>'
                  +'</div>';
        $('#containers').append(item)
      }
      
      //Env
      $('#tblEnvs tbody').html('');
      var envs = data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Env') ? data.Spec.TaskTemplate.ContainerSpec.Env : [];
      for (var i = 0; i < envs.length; i++) {
        var env = envs[i].split('=');
        var tr = '<tr><td class="item-key">'+env[0]+'</td><td class="item-value">'+env[1]+'</td></tr>';
        $('#tblEnvs tbody').append(tr);
      }
    }
  });
}
