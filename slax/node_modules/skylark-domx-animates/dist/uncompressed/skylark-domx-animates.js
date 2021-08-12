/**
 * skylark-domx-animates - The skylark animates library for dom api extension.
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

define('skylark-domx-animates/animates',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser"
], function(skylark,langx,browser) {

    function animates() {
        return animates;
    }

    langx.mixin(animates, {
        off: false,
        speeds: {
            normal: 400,
            fast: 200,
            slow: 600
        },
        animationName : browser.normalizeCssProperty("animation-name"),
        animationDuration : browser.normalizeCssProperty("animation-duration"),
        animationDelay : browser.normalizeCssProperty("animation-delay"),
        animationTiming : browser.normalizeCssProperty("animation-timing-function"),
        animationEnd : browser.normalizeCssEvent('AnimationEnd'),

        animateBaseClass : "animated"
    });

    return skylark.attach("domx.animates", animates);
});
define('skylark-domx-animates/animation',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-noder",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "skylark-domx-eventer",
    "./animates"
], function(langx, browser, noder, geom, styler, eventer,animates) {

    var animationName = animates.animationName,
        animationDuration = animates.animationDuration,
        animationTiming = animates.animationTiming,
        animationDelay = animates.animationDelay,

        animationEnd = animates.animationEnd,

        cssReset = {};


    cssReset[animationName] =
        cssReset[animationDuration] =
        cssReset[animationDelay] =
        cssReset[animationTiming] = "";

    /*   
     * Perform a custom animation.
     * @param {Object} elm  
     * @param {String} name
     * @param {String} ease
     * @param {Number or String} duration
     * @param {Function} callback
     * @param {Number or String} delay
     */
    function animation(elm, name, duration, ease, callback, delay) {
        var cssValues = {};
        if (langx.isPlainObject(duration)) {
            ease = duration.easing;
            callback = duration.complete;
            delay = duration.delay;
            duration = duration.duration;
        }

        if (langx.isString(duration)) {
            duration = animates.speeds[duration];
        }
        if (duration === undefined) {
            duration = animates.speeds.normal;
        }
        duration = duration / 1000;

        if (langx.isFunction(ease)) {
            callback = ease;
            eace = "swing";
        } else {
            ease = ease || "swing";
        }

        if (delay) {
            delay = delay / 1000;
        } else {
            delay = 0;
        }
        // keyframe animation
        cssValues[animationName] = name;
        cssValues[animationDuration] = duration + "s";
        cssValues[animationTiming] = ease;


        if (duration > 0) {
            eventer.on(elm, animationEnd, callback);
        }

        // trigger page reflow so new elements can animate
        elm.clientLeft;

        styler.css(elm, cssValues);

        return this;
    }

    return animates.animation = animation;

});
define('skylark-domx-animates/animate',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "skylark-domx-eventer",
    "./animates"
], function(langx, styler, eventer,animates) {


    function animate(elm,className) {
        if (animates.animateBaseClass) {
          className = animates.animateBaseClass + " " + className;
        }
        styler.addClass(elm,className);
        eventer.one(elm,animates.animationEnd, function() {
            styler.removeClass(elm,className);
        });
        return this;
    }
    
    return animates.animate = animate;
});
define('skylark-domx-animates/main',[
	"./animates",
    "./animation",
    "./animate"
],function(animates){

	return animates;
});
define('skylark-domx-animates', ['skylark-domx-animates/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-animates.js.map
