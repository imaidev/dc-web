$(function(){
  listServices();
  $(document).on('click', '#serviceList>li .service-info', function(){
    var s_id = $(this).attr('data-sid');
    window.location.href = 'info.html?service_id='+s_id;
  });
}
);
function listServices(){
  var $wrapObj = $('#serviceList');
  $wrapObj.html('');
  ServiceAction.list({}, function(data,status){
    if (status == 'success'){
      var json = eval(data), len = json.length;
      for (var i = 0; i < len; i++) {
        $wrapObj.append(itemDiv(json[i]));
      }
    } else {
      alert(status);
    }
  });
}
function itemDiv(data){
  var s_id = data.ID
  , v_i = data.Version.Index
  , ct = data.CreatedAt
  , ut = data.UpdatedAt
  , name = data.Spec.Name
  , image = data.Spec.TaskTemplate.ContainerSpec.Image
  , replicas = data.Spec.Mode.hasOwnProperty('Replicated') ? data.Spec.Mode.Replicated.Replicas : '';
  var left = '<div class="col-md-1 check-col"><div class="checkbox"><label>'
              +'<input class="selector" type="checkbox" name="selector" value="'+s_id+'"/>'
              +'</label></div></div>';
  var sn = '<div class="col-md-5 service-info" data-sid="'+s_id+'">'
        +'<div class="row"><div class="col-md-12 service-name" title="'+name+'">'+name.substring(name.indexOf('__')+2)+'</div></div>'
        +'<div class="row"><div class="col-md-12 service-replicas">'+replicas+'</div></div>'
        +'<div class="row"><div class="col-md-12 service-status" name="s_stats">stat:TODO</div></div>'
        +'</div>';
  var image = '<div class="col-md-3 service-image">'+image+'</div>';
  var ct = '<div class="col-md-3 service-ut">'+ut+'</div>';
  var actions = '<div class="col-md-1 service-actions">'
                  +'<div class="btn-group">'
                    +'<a class="btn btn-elipsedropdown-toggle" data-toggle="dropdown" aria-haspopup="true">∷</a>'
                    +'<ul class="dropdown-menu">'
                      +'<li><a onclick="ServiceAction.start(\''+s_id+'\')">Start</a></li>'
                      +'<li><a onclick="ServiceAction.stop(\''+s_id+'\')">Stop</a></li>'
                      +'<li><a onclick="ServiceAction.redeploy(\''+s_id+'\')">Redeploy</a></li>'
                      +'<li><a onclick="ServiceAction.terminate(\''+s_id+'\')">Terminate</a></li>'
                    +'</ul>'
                  +'</div></div>';
  var right = '<div class="col-md-11"><div class="row">'+sn+image+ct+actions+'</div></div>';
  return '<li><div class="row">'+left+right+'</div></li>';
  
}

function selectedService(){
  var sids = new Array();
  $('input[type="checkbox"][name="selector"]:checked').each(function(){
    var v = $(this).val();
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
