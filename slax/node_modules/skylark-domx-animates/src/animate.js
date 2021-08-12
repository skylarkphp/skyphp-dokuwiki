define([
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