define([
  "skylark-domx-noder",
  "skylark-domx-data",
  "./iframes",
  "./hook-sizing"
],function(noder,datax,iframes,hookSizing){

  function loadReal(iframe,options) {
    options = options || {};
    var clone = noder.clone(iframe);
    var url = options.url;
    if (!url) {
      url = datax.attr(clone,options.urlAttrName || 'data-url');
    }
    url = url.split('&')[0];
    datax.prop(clone,"src",url);
    datax.prop(clone,"_src",url); // support for google slide embed
    noder.replace(clone,ifame);
    ///hookSizing(clone);
  }

  return iframes.loadReal = loadReal;  
});