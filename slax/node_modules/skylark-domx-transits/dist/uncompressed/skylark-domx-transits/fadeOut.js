define([
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./fade"
],function(langx,styler,transits,fadeTo) {
    /*   
     * Hide an element by fading them to transparent.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {String} easing
     * @param {Function} callback
     */
    function fadeOut(elm, options, callback) {

        function complete() {
            styler.css(elm,"opacity",opacity);
            styler.hide(elm);
            if (callback) {
                callback.call(elm);
            }
        }

        fadeTo(elm, 0,options,callback);

        return this;
    }

    return transits.fadeOut = fadeOut;
});