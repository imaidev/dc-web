(function($) {
  $.fn.dcCookie = function() {
    var args = arguments, argsLen = args.length;
    if (argsLen == 1) {
      return $.cookie(args[0]);
    } else if (argsLen == 2) {
      $.cookie(args[0], args[1], {domain: DC_CONFIG.RESOURCE_DOMAIN, path: '/'});
    } else if (argsLen == 3) {
      $.cookie(args[0], args[1], args[2]);
    }
  };
})(jQuery);