var Router = {
  href: function(url){
    window.location.href = url;
  },
  open: function(url, title) {
    window.open(url, title);
  },
  reload: function(force) {
    window.location.reload();
  }
};
