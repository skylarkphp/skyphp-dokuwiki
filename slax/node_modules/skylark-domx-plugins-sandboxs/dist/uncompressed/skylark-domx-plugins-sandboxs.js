/**
 * skylark-domx-plugins-sandboxs - The skylark sandbox plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx-plugins/skylark-domx-plugins-sandboxs/
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

define('skylark-domx-plugins-sandboxs/sandboxs',[
    "skylark-domx-plugins-base/plugins"
], function(plugins) {
    'use strict';

	return plugins.sandboxs = {};
});


define('skylark-domx-plugins-sandboxs/sandbox',[
    "skylark-langx",
    "skylark-domx-browser",
    "skylark-domx-noder",
    "skylark-domx-eventer",
    "skylark-domx-query",
    "skylark-domx-plugins-base",
    "./sandboxs"
], function(langx, browser, noder,eventer,  $, plugins, sandboxs) {
    'use strict';
  /** ============================================================================
   * Sandbox
   * Handles creating and insertion of dynamic iframes
   * ========================================================================== */


  var getIframeWindow = function (iframeElement) {
      return iframeElement.contentWindow || iframeElement.contentDocument.parentWindow;
  };

  var Sandbox =  plugins.Plugin.inherit({

    klassName: "Sandbox",

    pluginName : "lark.sandboxs.sandbox",

    options : {
      name: "Output",
      allows : 'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts',
      frameBorder : "0",
      cssTextTagId : 'sandbox-css'
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);

      /**
       * Save the target container element, plus the old and active iframes.
       */
      this.target = elm;
      this.old = null;
      this.active = null;
      this.state = {};
      this.guid = +new Date(); // id used to keep track of which iframe is active

    },

    /**
     * Create a new sandboxed iframe.
     */
    create : function () {
      var iframe = document.createElement('iframe');
      // iframe.src = window.location.origin + '/runner-inner';
      iframe.setAttribute('sandbox', this.options.allows);
      iframe.setAttribute('frameBorder', this.options.frameBorder);
      iframe.setAttribute('name', this.options.name);
      iframe.id = this.guid++;
      // this.active = iframe;
      return iframe;
    },

    /**
     * Add a new iframe to the page and wait until it has loaded to call the
     * requester back. Also wait until the new iframe has loaded before removing
     * the old one.
     */
    /**
     * Add a new iframe to the page and wait until it has loaded to call the
     * requester back. Also wait until the new iframe has loaded before removing
     * the old one.
     */
    use : function (iframe, done) {
      if (!this.target) {
        throw new Error('Sandbox has no target element.');

      }
      this.old = this.active;
      this.saveState(this.old);
      this.active = iframe;
      noder.prepend(this.target, iframe);
      // setTimeout allows the iframe to be rendered before other code runs,
      // allowing us access to the calculated properties like innerWidth.
      langx.defer((function () {
        // call the code that renders the iframe source
        if (done) {
          done();
        }

        // remove *all* the iframes, baring the active one
        var iframes = this.target.getElementsByTagName('iframe');
        var length = iframes.length;
        var i = 0;
        var id = this.active.id;
        var iframe;

        for (; iframe = iframes[i], i < length; i++) {
          if (iframe.id !== id) {
            noder.remove(iframe);
            length--;
          }
        }
      }).bind(this));
    },

    /**
     * Restore the state of a prvious iframe, like scroll position.
     */
    restoreState : function (iframe, state) {
      if (!iframe) return {};
      var win = getIframeWindow(iframe);
      if (!win) return {};
      if (state.scroll) {
        win.scrollTo(state.scroll.x, state.scroll.y);
      }
    },

    /**
     * Save the state of an iframe, like scroll position.
     */
    saveState : function (iframe) {
      if (!iframe) return {};
      var win = getIframeWindow(iframe);
      if (!win) return {};
      return {
        scroll: {
          x: win.scrollX,
          y: win.scrollY
        }
      };
    },

    /**
     * Attach event listeners and rpevent some default behaviour on the new
     * window during live rendering.
     */
    wrap : function (childWindow, options) {
      if (!childWindow) return;
      options = options || {};

      // Notify the parent of resize events (and send one straight away)
      ///event.on(childWindow, 'resize', utils.throttle(function () {
      ///  runner.postMessage('resize', this.getSizeProperties(childWindow));
      ///}, 25));
      ///runner.postMessage('resize', this.getSizeProperties(childWindow));

      eventer.on(childWindow, 'resize', function () {
        eventer.resized(this._elm);
      });

      // Notify the parent of a focus
      eventer.on(childWindow, 'focus', () => {
        //runner.postMessage('focus');
        eventer.trigger(this._elm,"focused");
      });
    },

    getSizeProperties : function (childWindow) {
      return {
        width: childWindow.innerWidth || childWindow.document.documentElement.clientWidth,
        height: childWindow.innerHeight || childWindow.document.documentElement.clientHeight,
        offsetWidth: childWindow.document.documentElement.offsetWidth,
        offsetHeight: childWindow.document.documentElement.offsetHeight
      };
    },

    /**
     * Evaluate a command against the active iframe, then use the proxy console
     * to fire information up to the parent
     */
    eval : function (cmd) {
      if (!this.active) throw new Error("sandbox.eval: has no active iframe.");

      var re = /(^.|\b)console\.(\S+)/g;

      if (re.test(cmd)) {
        var replaceWith = 'window.runnerWindow.proxyConsole.';
        cmd = cmd.replace(re, function (all, str, arg) {
          return replaceWith + arg;
        });
      }

      var childWindow = this.active.contentWindow;
      var output = null,
          type = 'log';
      try {
        output = childWindow.eval(cmd);
      } catch (e) {
        output = e.message;
        type = 'error';
      }

      return proxyConsole[type](output);
    },

    /**
     * Inject a script via a URL into the page
     */
    injectScript : function (url, cb) {
      if (!this.active) throw new Error("sandbox.injectScript: has no active iframe.");
      var childWindow = this.active.contentWindow,
          childDocument = childWindow.document;
      var script = childDocument.createElement('script');
      script.src = url;
      script.onload = function () {
        cb();
      };
      script.onerror = function () {
        cb('Failed to load "' + url + '"');
      };
      childDocument.body.appendChild(script);
    },

    /**
     * Inject full DOM into the page
     */
    injectDOM : function (html, cb) {
      if (!this.active) throw new Error("sandbox.injectDOM: has no active iframe.");
      var childWindow = this.active.contentWindow,
          childDocument = childWindow.document;
      try {
        childDocument.body.innerHTML = html;
      } catch (e) {
        cb("Failed to load DOM.");
      }
      cb();
    },

    injectCssText : function(cssText) {
      if (this.active) {
        var style = this.active.contentDocument.getElementById(this.options.cssTextTagId);
        if (style) {
          style.innerHTML = cssText;
          return;
        }
      }
    },

    render : function(source,options) {
      var iframe = this.create(options);
      this.use(iframe, () => {
        var childDoc = iframe.contentDocument,
            childWindow = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (!childDoc) {
          childDoc = childWindow.document;
        }

        // Reset the console to the prototype state
        let proxyConsole = options.proxyConsole,
            loopProtect = options.loopProtect;

        proxyConsole.methods.forEach(function (method) {
          delete proxyConsole[method];
        });          


        // Start writing the page. This will clear any existing document.
        childDoc.open();

        // We need to write a blank line first – Firefox blows away things you add
        // to the child window when you do the fist document.write.
        // Note that each document.write fires a DOMContentLoaded in Firefox.
        // This method exhibits synchronous and asynchronous behaviour, depending
        // on the browser. Urg.
        childDoc.write('');

        // Give the child a reference to things it needs. This has to go here so
        // that the user's code (that runs as a result of the following
        // childDoc.write) can access the objects.
        childWindow.runnerWindow = {
          proxyConsole: proxyConsole,
          protect: loopProtect,
        };

        childWindow.console = proxyConsole;

        // if there's a parse error this will fire
        childWindow.onerror = function (msg, url, line, col, error) {
          // show an error on the jsbin console, but not the browser console
          // (i.e. use _raw), because the browser will throw the native error
          // which (hopefully) includes a link to the JavaScript VM at that time.
          proxyConsole._raw('error', error && error.stack ? error.stack : msg + ' (line ' + line + ')');
        };

        // Write the source out. IE crashes if you have lots of these, so that's
        // why the source is rendered above (processor.render) – it should be one
        // string. IE's a sensitive soul.
        childDoc.write(source);
        // childDoc.documentElement.innerHTML = source;

        // Close the document. This will fire another DOMContentLoaded.
        childDoc.close();

        // Setup the new window
        this.wrap(childWindow, options);
      });      
    }

  });


  plugins.register(Sandbox);


  return sandboxs.Sandbox = Sandbox;

});


define('skylark-domx-plugins-sandboxs/main',[
	"./sandboxs",
	"./sandbox"
],function(sandboxs){
	return sandboxs;
});
define('skylark-domx-plugins-sandboxs', ['skylark-domx-plugins-sandboxs/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-sandboxs.js.map
