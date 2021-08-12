define([
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,styler,transits,transit) {
    /*   
     * Display an element.
     * @param {Object} elm  
     * @param {String} speed
     * @param {Function} callback
     */
    function show(elm, speed, callback) {
        styler.show(elm);
        if (speed) {
            if (!callback && langx.isFunction(speed)) {
                callback = speed;
                speed = "normal";
            }
            styler.css(elm, "opacity", 0)
            transit(elm, { opacity: 1, scale: "1,1" }, speed, callback);
        }
        return this;
    }

    return transits.show = show;
});