/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-iframes/iframes',[
	"skylark-langx-ns"
],function(skylark){
	return skylark.attach("domx.iframes");
});
define('skylark-domx-iframes/create',[
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
define('skylark-domx-iframes/hook-sizing',[
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
define('skylark-domx-iframes/load-real',[
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
define('skylark-domx-iframes/lazy-load',[
	"skylark-domx-eventer",
	"skylark-domx-data",
	"skylark-domx-geom",
	"./iframes",
	"./load-real"
],function(eventer,datax,geom,iframes,loadReal){
	var pending;


  	function check() {
	    var i = 0;
	    var todo = [];
	    for (i = 0; i < pending.length; i++) {
	      if (geom.inview(pending[i], 400)) {
	        todo.unshift({ iframe: pending[i], i: i });
	      }
	    }

	    for (i = todo.length -1 ; i >=0 ; i--) {
	      pending.splice(todo[i].i, 1);
	      loadReal(todo[i].iframe);
	    }
  	}

	function init() {
		if (pending) {
			return
		}

		pending = [];

		eventer.on(window,"scroll",function(){
			check();
		});
	}

	function lazyLoad(iframe,options) {
		init();

		options = options || {};
	
      	///iframe.setAttribute('data-url', url);
      	///iframe.src = 'https://jsbin.com/embed-holding';
      	if (options.url) {
      		datax.attr(iframe,(options.urlAttrName || "data-url"),options.url)
      	}

      	if (options.holdingUrl) {
      		datax.prop(iframe,"src",options.holdingUrl)      		
      	}

		pending.push(iframe);
	}

	return iframes.lazyLoad = lazyLoad
});
define('skylark-domx-iframes/replace',[
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
define('skylark-domx-iframes/main',[
	"./iframes",
	"./create",
	"./lazy-load",
	"./load-real",
	"./replace"
],function(){
	
});
define('skylark-domx-iframes', ['skylark-domx-iframes/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-iframes.js.map
