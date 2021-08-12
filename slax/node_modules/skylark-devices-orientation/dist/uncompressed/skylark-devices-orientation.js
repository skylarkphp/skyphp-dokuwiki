/**
 * skylark-devices-orientation - The orientation  utility library.
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

define('skylark-devices-orientation/orientation',[
  "skylark-langx-ns"
],function(skylark){

  /**
   * @summary Detects if device orientation is supported
   * @description We can only be sure device orientation is supported once received an event with coherent data
   * @returns {Promise<boolean>}
   */
   function isDeviceOrientationSupported() {
    return new Promise(function(resolve) {
      if ('DeviceOrientationEvent' in window) {
        var listener = function(e) {
          if (e && e.alpha !== null && !isNaN(e.alpha)) {
            resolve(true);
          }
          else {
            resolve(false);
          }

          window.removeEventListener('deviceorientation', listener);
        };

        window.addEventListener('deviceorientation', listener, false);

        // after 2 secs, auto-reject the promise
        setTimeout(listener, 2000);
      }
      else {
        resolve(false);
      }
    });
  }

  return skylark.attach("devices.orientation",{
    isDeviceOrientationSupported
  });
	
});
define('skylark-devices-orientation/main',["./orientation"],function(orientation){
	return orientation;
});
define('skylark-devices-orientation', ['skylark-devices-orientation/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-devices-orientation.js.map
