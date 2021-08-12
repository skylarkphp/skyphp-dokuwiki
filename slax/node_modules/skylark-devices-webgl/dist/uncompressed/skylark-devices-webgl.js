/**
 * skylark-devices-webgl - The webgl  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
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

define('skylark-devices-webgl/webgl',[
	"skylark-langx-ns"
],function(skylark){

  /**
   * @summary Tries to return a canvas webgl context
   * @returns {WebGLRenderingContext}
   */
  function getWebGLCtx() {
    var canvas = document.createElement('canvas');
    var names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
    var context = null;

    if (!canvas.getContext) {
      return null;
    }

    if (names.some(function(name) {
        try {
          context = canvas.getContext(name);
          return (context && typeof context.getParameter === 'function');
        } catch (e) {
          return false;
        }
      })) {
      return context;
    }
    else {
      return null;
    }
  }

  /**
   * @summary Detects if WebGL is supported
   * @returns {boolean}
   */
  function isWebGLSupported() {
    return !!window.WebGLRenderingContext && getWebGLCtx() !== null;
  };


  /**
   * @summary Gets max texture width in WebGL context
   * @returns {int}
   */
   function getMaxTextureWidth() {
    var ctx = getWebGLCtx();
    if (ctx !== null) {
      return ctx.getParameter(ctx.MAX_TEXTURE_SIZE);  
    }
    else {
      return 0;
    }
  };

  return skylark.attach("devices.webgl",{
  	getWebGLCtx,
  	isWebGLSupported,
  	getMaxTextureWidth
  })
	
});
define('skylark-devices-webgl/main',[
	"./webgl"
],function(webgl){
	return webgl;
});
define('skylark-devices-webgl', ['skylark-devices-webgl/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-devices-webgl.js.map
