define([
  "skylark-langx-urls/get-query",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-styler",
  "./iframes",
  "./create",
  "./load-real",
  "./lazy-load"
],function(getQuery,noder,geom,styler,iframes,create,loadReal,lazyLoad){
  'use strict';
  
  function replace(link,options) {
    options = options || {};

    /*
    var iframe = noder.createElement('iframe',{
      "className" : link.className, // inherit all the classes from the link
      "id" : link.id, // also inherit, giving more style control to the user
      "style" : { "border" : '1px solid #aaa'}
    });
    */

    var ifarme =create({
      "className" : link.className, // inherit all the classes from the link
      "id" : link.id, // also inherit, giving more style control to the user
      "style" : { 
        "border" : '1px solid #aaa'
      }
    });
    ///var url = link.href.replace(/edit/, 'embed');
    var url = options.url || link.href,
        size = options.size || getQuery(link.search),
        holdingUrl = options.holdingUrl;

    styler.css(iframe,"width", size.width || '100%');
    styler.css(iframe,"minHeight", size.height || '300px');
    if (size.height) {
      styler.css(iframe,"maxHeight", size.height);
    }

    // track when it comes into view and reload
    if (geom.inview(link, 100)) {
      // the iframe is full view, let's render it
      ///iframe.src = url.split('&')[0];
      ///iframe._src = url.split('&')[0]; // support for google slide embed
      ///hookMessaging(iframe);
      loadReal(iframe,{url})
    } else {
      ///iframe.setAttribute('data-url', url);
      ///iframe.src = 'https://jsbin.com/embed-holding';
      ///pending.push(iframe);
      lazyLoad(iframe,{
        url,
        holdingUrl
      });

    }

    noder.replace(iframe, link);
  }

  return iframes.replace = replace;
});