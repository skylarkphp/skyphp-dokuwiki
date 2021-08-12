define([
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./fade"
],function(langx,styler,transits,fadeTo) {
    /*   
     * Display an element by fading them to opaque.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {String} easing
     * @param {Function} callback
     */
    function fadeIn(elm, options, callback) {
        var target = styler.css(elm, "opacity");
        if (target > 0) {
            styler.css(elm, "opacity", 0);
        } else {
            target = 1;
        }
        styler.show(elm);

        fadeTo(elm,  target,options, callback);

        return this;
    }


    return transits.fadeIn = fadeIn;
});