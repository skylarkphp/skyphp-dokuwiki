define([
  "skylark-domx-eventer",
  "./iframes"
],function(eventer,iframes){
  'use strict';

  function hookSizing(iframe) {
    var onmessage = function (event) {
      if (!event) { event = window.event; }
      ///TODO : how check message source
      // * 1 to coerse to number, and + 2 to compensate for border
      iframe.style.height = (event.data.height * 1 + 2) + 'px';
    };

    eventer.on(window,'message', onmessage);
  }

  return iframes.hookSizing = hookSizing;

});