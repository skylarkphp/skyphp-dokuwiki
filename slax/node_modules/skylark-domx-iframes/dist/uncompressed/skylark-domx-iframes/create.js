define([
  "skylark-domx-noder",
  "./iframes"
],function(noder,iframes){
  'use strict';

  function create(options,parentElm) {
  	  options = options || {
  	  };

  	  let props = {},
  	  	  attrs = {};

  	  if (options.id) {
  	  	props.id = options.id;
  	  };

  	  if (options.url) {
  	  	props.src = options.url;
  	  };

  	  if (options.style) {
  	  	props.style = options.style;
  	  }

  	  if (options.onload) {
  	  	props.onload = options.onload;
  	  }

  	  if (options.onerror) {
  	  	props.onload = options.onerror;
  	  }

  	  if (options.className) {
  	  	props.className = options.className;
  	  }

  	  if (options.sandbox) {
  	  	attrs.sandbox = options.sandbox;
  	  }

  	  if (options.frameBorder) {
  	  	attrs.frameBorder = options.frameBorder;  	  	
  	  }

  	  if (options.name) {
  	  	attrs.name = options.name;
  	  }

  	  /*
      // Basic mode
      // This adds the runner iframe to the page. It's only run once.
      //if (!$live.find('iframe').length) {
        iframe = noder.create("iframe",{
          ///iframe.src = jsbin.runner;
          src : this.options.runnerUrl
        },{
          "class" : "stretch",
          "sandbox", "allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts",
          "frameBorder": '0',
          "name", "<proxy>",
        },this._elm);

        try {
          ///iframe.contentWindow.name = '/' + jsbin.state.code + '/' + jsbin.state.revision;
          iframe.contentWindow.name  = this.options.runnerName;
        } catch (e) {
          // ^- this shouldn't really fail, but if we're honest, it's a fucking mystery as to why it even works.
          // problem is: if this throws (because iframe.contentWindow is undefined), then the execution exits
          // and `var renderLivePreview` is set to undefined. The knock on effect is that the calls to renderLivePreview
          // then fail, and jsbin doesn't boot up. Tears all round, so we catch.
        }
      //}

      iframe.onload = () => {
        if (window.postMessage) {
          // setup postMessage listening to the runner
          $window.on('message', (event) => {
            this.handleMessage(event.originalEvent)
          });
          this.setup(iframe);
          this._inited.resolve();
        }
      };

      iframe.onerror = err => {
        this._inited.reject(err);
      };

      */

      let iframe = noder.create("iframe",props,attrs,parentElm);

      if (options.contentWindowName) {
      	iframe.contentWindow.name = options.contentWindowName;
      }

      return iframe;
  }

  return iframes.create = create;
});