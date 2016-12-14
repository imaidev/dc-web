var image = null;
$(function(){
  //根据image查询image详细信息
  $('#image').blur(function(){
  	initPage();
    image = this.value;
    loadImageInfo();
  });
  
  $('#btnAddLabel').click(function(){
    var tb = $('#tblLabels tbody'), labelName = $('#label').val(), labelV = $('#labelV').val();
    var tr = '<tr><td>'+labelName+'</td><td>'+labelV+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $('#btnAddVolumes').click(function(){
    var tb = $('#tblVolumes tbody'), c_path = $('#c_path').val(), h_path = $('#h_path').val(), readable = $('#readable').val();
    var tr = '<tr><td>'+c_path+'</td><td>'+h_path+'</td><td>'+readable+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $('#btnAddEnv').click(function(){
    var tb = $('#tblEnvs tbody'), envName = $('#envName').val(), envValue = $('#envValue').val();
    var tr = '<tr><td>'+envName+'</td><td>'+envValue+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  /**
  $('#btnAddPort').click(function(){
    var tb = $('#tblEpPort tbody');
    var tr = '<tr><td><input type="number" class="form-control input-no-border" name="port" value="" /></td>'
              +'<td><select name="protocolList"><option value="tcp">tcp</option><option value="udp">udp</option></select></td>'
              +'<td><input type="checkbox" name="published" /></td>'
              +'<td><input type="text" class="form-control input-no-border" name="node_port" value="" /></td>'
              +'<td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $(document).on('change', 'input[name="published"]', function(){
    if ($(this).prop("checked")) {
      $('input[name="node_port"]', $(this).parents('tr')).val('dynamic');
    } else {
      $('input[name="node_port"]', $(this).parents('tr')).val('');
    }
  });
  **/
  
  $(document).on('change', 'input[name="serviceName"]', function(){
    return chksn();
  });
  
  //删除行操作
  $(document).on('click', '.glyphicon.glyphicon-trash', function(){
    $(this).parents('tr').remove();
  });
  
  $('#btnCreate').click(function(){
    var config = configService();
    ServiceAction.create(config, function(data, status){
        window.location.href = '../info.html?service_id='+data.ID;
    });
  });
  
});

function loadImageInfo(){
  //$('#btnCreate').prop('disabled','disabled');
  var image_name = $('#image').val();
  if(image_name == '') return;
  ImagesAction.inspect(image_name, function(data){
	if (data == null || typeof data != 'object' || (typeof data == 'object' && !data.hasOwnProperty('Id'))){
      return;
    }
    var config = data.Config, volumes = config.Volumes, entryPoint = config.Entrypoint
    ,/* exposedPorts = config.ExposedPorts,*/ env = config.Env, labels = config.Labels;
    image = data.RepoTags[0];
    
    if (volumes != null) {
      var tr = '';
      for (var key in volumes) {
        tr += '<tr>'
                +'<td>' + key + '</td>'
                +'<td>' + JSON.stringify(volumes[key]) + '</td>'
                +'<td></td>'
                +'</tr>';
      }
      $('#tblVolumes tbody').append(tr);
    }
    /*
    if (exposedPorts != null) {
      var tr = '';
      for (var key in exposedPorts) {
        var po = key.split('/')[0], proto = key.split('/')[1];
        tr += '<tr>'
                +'<td><input type="number" class="form-control input-no-border" name="port" value="' + po + '" /></td>'
                +'<td><select name="protocolList"><option value="tcp" '+(proto == 'tcp' ? 'selected':'')+'>tcp</option><option value="udp"'+(proto == 'udp' ? 'selected':'')+'>udp</option></select></td>'
                +'<td><input type="checkbox" name="published" /></td>'
                +'<td><input type="text" class="form-control input-no-border" name="node_port" value="" /></td>'
                +'</tr>';
      }
      $('#tblEpPort tbody').append(tr);
    }*/
    
    if (env != null && env.length > 0) {
      var tr = '';
      for (var i = 0; i < env.length; i++) {
        tr += '<tr>'
                +'<td>' + env[i].split('=')[0] + '</td>'
                +'<td>' + env[i].split('=')[1] + '</td>'
                + '</tr>';
      }
      $('#tblEnvs tbody').append(tr);
    }
    
    if (labels != null) {
      var tr = '';
      for (var key in labels) {
        tr += '<tr>'
                +'<td>' + key + '</td>'
                +'<td>' + labels[key] + '</td>'
                +'</tr>';
      }
      $('#tblLabels tbody').append(tr);
    }
    //$('#btnCreate').prop('disabled',false);
  });
}

var configService = function(){
  var sname = $('#serviceName').val()
  , stack = $('#stackList').val()
  , containers = $('#containers').val()
  , labels = getLabelFromTbl('tblLabels'), mounts = getVolumesFromTbl('tblVolumes')
  //, epPorts = getPortsFromTbl('tblEpPort')
  , envs = getEnvsFromTbl('tblEnvs');
  
  var config_mode = {Replicated:{Replicas: containers == '' ? 1 : parseInt(containers, 10)}};
  
  var config = {Name: sname, Labels: labels == null ? {}: labels, 
                TaskTemplate:{
                  ContainerSpec:{
                    Image: image,
                    Env: envs,
                    Labels: labels,
                    Mounts: mounts
                  }
                },
                Mode: config_mode/*,
                EndpointSpec: {
                  Ports: epPorts
                }*/
               };
  return config;
}

function getLabelFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return {};
  var labels = {};
  for (var i = 0; i < trs.length; i++) {
    var name = $('td', $(trs[i]))[0].innerHTML
    , key = $('td', $(trs[i]))[1].innerHTML
    labels[name] = key;
  }
  return labels;
}

function getVolumesFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var mounts = [];
  for (var i = 0; i < trs.length; i++) {
    var target = $('td', $(trs[i]))[0].innerHTML
    , src = $('td', $(trs[i]))[1].innerHTML
    , readOnly = $('td', $(trs[i]))[2].innerHTML == 'Readable' ? true : false;
    mounts.push({Target: target, Source: src, ReadOnly: readOnly});
  }
  return mounts;
}

function getPortsFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var ports = [];
  for (var i = 0; i < trs.length; i++) {
    var c_port = $('input[name="port"]', $(trs[i])).val()
    , protocol = $('select[name="protocolList"]', $(trs[i])).val()
    , published = $('input[name="published"]:checked', $(trs[i])) ? true : false
    , node_port = $('input[name="node_port"]', $(trs[i])).val();
    if (c_port == '') continue;
    var p = '{"Protocol": "'+protocol+'", "TargetPort":' + parseInt(c_port, 10);
    if (node_port != 'dynamic' && node_port != '') p += ', "PublishedPort":'+parseInt(node_port, 10);
    p += '}';
    ports.push($.parseJSON(p));
  }
  return ports;
}

function getEnvsFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var envs = [];
  for (var i = 0; i < trs.length; i++) {
    var env_name = $('td', $(trs[i]))[0].innerHTML
    , env_value = $('td', $(trs[i]))[1].innerHTML;
    envs.push(env_name+'='+env_value);
  }
  return envs;
}
function initPage(){
	$('#tblLabels tbody').html('');
	$('#tblVolumes tbody').html('');
	$('#tblEpPort tbody').html('');
	$('#tblEnvs tbody').html('');
}
function chksn(){
  var v = $('#serviceName').val(), reg = /^[a-zA-Z][a-zA-Z0-9]{1,19}(__[1-9][0-9]{0,4})?$/g;
  if (!reg.test(v)){
   	ToastrTool.warning('service名称格式：字母开头+[任意数字]+[__端口号]');
  	$('#serviceName').select();
   	return false;
  }
  return true;
}