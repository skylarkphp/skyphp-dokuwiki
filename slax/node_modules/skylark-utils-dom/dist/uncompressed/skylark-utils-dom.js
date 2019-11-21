/**
 * skylark-utils-dom - An Elegant HTML5 DOM utility Library.
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
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-utils-dom/skylark',["skylark-langx/skylark"], function(skylark) {
    return skylark;
});

define('skylark-utils-dom/dom',["./skylark"], function(skylark) {
	return skylark.dom = skylark.attach("dom",{});
});

define('skylark-utils-dom/browser',[
    "./dom",
    "skylark-domx-browser"
], function(dom,browser) {
    "use strict";

    return dom.browser = browser;
});

define('skylark-utils-dom/css',[
    "./dom",
    "skylark-domx-css"
], function(dom, css) {
    "use strict";

     return dom.css = css;
});

define('skylark-utils-dom/datax',[
    "./dom",
    "skylark-domx-data"
], function(dom, datax) {
 
    return dom.datax = datax;
});
define('skylark-utils-dom/eventer',[
    "./dom",
    "skylark-domx-eventer"
], function(dom, eventer) {
 
    return dom.eventer = eventer;
});
define('skylark-utils-dom/finder',[
    "./dom",
    "skylark-domx-finder"
], function(dom, finder) {

    return dom.finder = finder;
});
define('skylark-utils-dom/fx',[
    "./dom",
    "skylark-domx-fx"
], function(dom, fx) {
    return dom.fx = fx;
});
define('skylark-utils-dom/geom',[
    "./dom",
    "skylark-domx-geom"
], function(dom, geom) {

    return dom.geom = geom;
});
define('skylark-utils-dom/images',[
    "./dom",
    "skylark-domx-images"
], function(dom,images) {
  return dom.images = images;
});

define('skylark-utils-dom/noder',[
    "./dom",
    "skylark-domx-noder"
], function(dom, noder) {

    return dom.noder = noder;
});
define('skylark-utils-dom/plugins',[
    "./dom",
    "skylark-domx-plugins"
], function(dom, plugins) {
    "use strict";


    return dom.plugins = plugins;
});
define('skylark-utils-dom/query',[
    "./dom",
    "skylark-domx-query"
], function(dom, query) {

    return dom.query = query;

});
define('skylark-utils-dom/scripter',[
    "./dom",
    "skylark-domx-scripter"
], function(dom, scripter) {

    return dom.scripter = scripter;
});
define('skylark-utils-dom/styler',[
    "./dom",
    "skylark-domx-styler"
], function(dom, styler) {

    return dom.styler = styler;
});
define('skylark-utils-dom/transforms',[
    "./dom",
    "skylark-domx-transforms"
], function(dom,transforms) {
  return dom.transforms = transforms;
});

define('skylark-utils-dom/langx',[
    "skylark-langx/langx"
], function(langx) {
    return langx;
});

define('skylark-utils-dom/elmx',[
    "./dom",
    "skylark-domx-velm"
], function(dom, elmx) {
     return dom.elmx = elmx;
});
define('skylark-utils-dom/main',[
    "./dom",
    "./browser",
    "./css",
    "./datax",
    "./eventer",
    "./finder",
    "./fx",
    "./geom",
    "./images",
    "./noder",
    "./plugins",
    "./query",
    "./scripter",
    "./styler",
    "./transforms",
    "./langx",
    "./elmx"
], function(dom) {
    return dom;
})
;
define('skylark-utils-dom', ['skylark-utils-dom/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-utils-dom.js.map
