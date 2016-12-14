var service_id = null;
var version = null;
var service_name = null;
var image = null;

$(function(){
  //根据image查询image详细信息
  service_id = getParam('service_id');
  loadServiceInfo(service_id)
  
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
  /*
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
  });*/
  
  //删除行操作
  $(document).on('click', '.glyphicon.glyphicon-trash', function(){
    $(this).parents('tr').remove();
  });
  
  $('#btnSave').click(function(){
    var config = configService();
    ServiceAction.update(service_id, version, config, function(data, status){
        window.location.href = info.html?service_id=service_id;
    });
  });
});

function loadServiceInfo(){
  ServiceAction.inspect(service_id, function(data, status){
    
    var sn = data.Spec.Name, sns = sn.split('__'), tenant = sns[0], s = sns[1]+(sns.length == 3 ? '__'+sns[2]:'');
    $('#titleService').html(sn);
    $('#lblTenant').html(tenant+'__')
    $('#serviceName').val(s);
    version = data.Version.Index;
    $('#containers').val(data.Spec.Mode.Replicated.Replicas);
    
    //Container
    var cs = data.Spec.TaskTemplate.ContainerSpec;
    $('#image').html(cs.Image);
    image = cs.Image;
    //Labels
    setLabel(cs.hasOwnProperty('Labels') ? cs.Labels : null);
    setVolumes(cs.hasOwnProperty('Mounts') ? cs.Mounts : null);
    setEnvs(cs.hasOwnProperty('Env') ? cs.Env : null);
    
    //setPorts(data.Endpoint.Spec.Ports);
  });
}

var configService = function(){
  var sname = $('#lblTenant').html()+$('#serviceName').val()
  , stack = $('#stackList').val()
  , containers = $('#containers').val()
  , labels = getLabelFromTbl('tblLabels'), mounts = getVolumesFromTbl('tblVolumes')
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
                }
               };
  return config;
}

function setLabel(json){
  if (json == null) return;
  var tbody = $('#tblLabels tbody');
  tbody.html('');
  for (var key in json) {
    var tr = '<tr><td>'+key+'</td><td>'+json[key]+'</td></tr>'
    tbody.append(tr);
  }
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

function setVolumes(json){
  if (json == null) return;
  var tbody = $('#tblVolumes tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var tr = '<tr><td>'+json[i].Source+'</td><td>'+json[i].Target+'</td><td>-</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
    tbody.append(tr);
  }
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

function setPorts(json){
  if (json == null) return;
  var tbody = $('#tblEpPort tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var tr = '<tr><td><input type="number" class="form-control input-no-border" name="port" value="'+json[i].TargetPort+'" /></td>'
              +'<td><select name="protocolList"><option value="tcp" '+(json[i].Protocol == 'tcp' ?'selected':'')+'>tcp</option>'
                +'<option value="udp" '+(json[i].Protocol == 'udp' ?'selected':'')+'>udp</option></select></td>'
              +'<td><input type="checkbox" name="published" '+(json[i].hasOwnProperty('PublishedPort') ?'checked':'')+'/></td>'
              +'<td><input type="text" class="form-control input-no-border" name="node_port" value="'+(json[i].hasOwnProperty('PublishedPort') ?json[i].PublishedPort:'')+'" /></td>'
              +'<td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tbody.append(tr);
  }
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

function setEnvs(json){
  if (json == null) return;
  var tbody = $('#tblEnvs tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var env = json[i].split('=');
    var tr = '<tr><td>'+env[0]+'</td><td>'+env[1]+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
    tbody.append(tr);
  }
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
