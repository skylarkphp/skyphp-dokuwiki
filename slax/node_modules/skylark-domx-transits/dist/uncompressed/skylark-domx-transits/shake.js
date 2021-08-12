define([
    "skylark-langx/langx",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,geom,styler,transits,transit) {
	function shake(elm, options, done ) {

		var i = 1,
			direction = options.direction || "left",
			distance = options.distance || 20,
			times = options.times || 3,
			anims = times * 2 + 1,
			speed = Math.round( options.duration / anims ),
			ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
			positiveMotion = ( direction === "up" || direction === "left" ),
			animation0 = {},
			animation = {},
			animation1 = {},
			animation2 = {};

		var Deferred = langx.Deferred;
			start = geom.relativePosition(elm)[ref],
			funcs = [];

		function doAnimate(elm,properties, duration, ease) {
			return function() {
				var d = new Deferred();

				transit(elm, properties, duration, ease ,function(){
					d.resolve();
				});
				return d.promise;
			}
		}

		// Animation
		animation0[ ref ] = start;
		animation[ ref ] = start + ( positiveMotion ? -1 : 1 ) * distance;
		animation1[ ref ] = animation[ ref ] + ( positiveMotion ? 1 : -1 ) * distance * 2;
		animation2[ ref ] = animation1[ ref ] + ( positiveMotion ? -1 : 1 ) * distance * 2;

		// Animate
	    funcs.push(doAnimate(elm,animation, speed, options.easing ));

		// Shakes
		for ( ; i < times; i++ ) {
		    funcs.push(doAnimate(elm,animation1, speed, options.easing ));
		    funcs.push(doAnimate(elm,animation2, speed, options.easing ));
		}

	    funcs.push(doAnimate(elm,animation0, speed /2 , options.easing ));

		funcs.push(done);
		funcs.reduce(function(prev, curr, index, array) {
	  		return prev.then(curr);
		}, Deferred.resolve());

		return this;
	}

	return transits.shake = shake;

});
