define([
    "skylark-langx/langx",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,geom,styler,transits,transit) {

    function bounce(elm, options, done ) {
        var upAnim, downAnim, refValue,
            // Defaults:
            mode = options.mode,
            hide = mode === "hide",
            show = mode === "show",
            direction = options.direction || "up",
            start,
            distance = options.distance,
            times = options.times || 5,

            // Number of internal animations
            anims = times * 2 + ( show || hide ? 1 : 0 ),
            speed = options.duration / anims,
            easing = options.easing,

            // Utility:
            ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
            motion = ( direction === "up" || direction === "left" ),
            i = 0;

        //createPlaceholder(elm);

        var Deferred = langx.Deferred;
        var funcs = [];

        refValue = styler.css(elm,ref );

        // Default distance for the BIGGEST bounce is the outer Distance / 3
        if ( !distance ) {
            var msize = geom.size(elm);
            distance = (ref === "top" ? msize.height : msize.width) / 3;
        }

        start = geom.relativePosition(elm)[ref];

        if ( show ) {
            downAnim = { opacity: 1 };
            downAnim[ ref ] = refValue;

            // If we are showing, force opacity 0 and set the initial position
            // then do the "first" animation
            styler.css(elm, "opacity", 0 );
            styler.css(elm, ref, start + (motion ? -distance * 2 : distance * 2 ));

            funcs.push(doAnimate(elm,downAnim, speed, easing));
        }

        // Start at the smallest distance if we are hiding
        if ( hide ) {
            distance = distance / Math.pow( 2, times - 1 );
        }

        downAnim = {};
        downAnim[ ref ] = refValue;


        function doAnimate(elm,properties, duration, easing) {
            return function() {
                var d = new Deferred();

                transit(elm,properties, duration, easing ,function(){
                    d.resolve();
                });
                return d.promise;

            }
        }

        // Bounces up/down/left/right then back to 0 -- times * 2 animations happen here
        for ( ; i < times; i++ ) {
            upAnim = {};
            upAnim[ ref ] = start + ( motion ? -distance : distance) ;

            funcs.push(doAnimate(elm,upAnim, speed, easing));

            funcs.push(doAnimate(elm,downAnim, speed, easing));

            distance = hide ? distance * 2 : distance / 2;
        }

        // Last Bounce when Hiding
        if ( hide ) {
            upAnim = { opacity: 0 };
            upAnim[ ref ] = start + ( motion ? -1 * distance : distance) ;

            funcs.push(doAnimate(elm,upAnim, speed, easing ));
        }

        funcs.push(done);
        funcs.reduce(function(prev, curr, index, array) {
            return prev.then(curr);
        }, Deferred.resolve());

        return this;
    } 

    return transits.bounce = bounce;
});