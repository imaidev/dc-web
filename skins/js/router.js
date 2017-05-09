var Router = {
  href: function(url){
    window.location.href = DC_CONFIG.WEBUI_CONTEXT + '/'+url;
  },
  open: function(url, title) {
    window.open(DC_CONFIG.WEBUI_CONTEXT + '/'+url, title);
  },
  reload: function(force) {
    window.location.reload();
  }
};
