define([
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./show",
    "./hide"
],function(langx,styler,transits,show,hide) {
    /*   
     * Display or hide an element.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {Function} callbacke
     */
    function toggle(elm, speed, callback) {
        if (styler.isInvisible(elm)) {
            show(elm, speed, callback);
        } else {
            hide(elm, speed, callback);
        }
        return this;
    }

    return transits.toggle = toggle;
});