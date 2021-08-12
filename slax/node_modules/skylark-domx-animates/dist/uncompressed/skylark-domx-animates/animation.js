define([
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