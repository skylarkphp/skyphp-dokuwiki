/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
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

define('skylark-domx-transits/transits',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark,langx) {

    function transits() {
        return transits;
    }

    langx.mixin(transits, {
        off: false,
        speeds: {
            normal: 400,
            fast: 200,
            slow: 600
        }
    });

    return skylark.attach("domx.transits", transits);
});
define('skylark-domx-transits/transit',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-noder",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "skylark-domx-eventer",
    "./transits"
], function(langx, browser, noder, geom, styler, eventer,transits) {

    var transitionProperty,
        transitionDuration,
        transitionTiming,
        transitionDelay,

        transitionEnd = browser.normalizeCssEvent('TransitionEnd'),

        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform = browser.css3PropPrefix + "transform",
        cssReset = {};

    cssReset[transitionProperty = browser.normalizeCssProperty("transition-property")] =
        cssReset[transitionDuration = browser.normalizeCssProperty("transition-duration")] =
        cssReset[transitionDelay = browser.normalizeCssProperty("transition-delay")] =
        cssReset[transitionTiming = browser.normalizeCssProperty("transition-timing-function")] = "";

    /*   
     * Perform a custom animation of a set of CSS properties.
     * @param {Object} elm  
     * @param {Number or String} properties
     * @param {String} ease
     * @param {Number or String} duration
     * @param {Function} callback
     * @param {Number or String} delay
     */
    function transit(elm, properties, duration, ease, callback, delay) {
        var key,
            cssValues = {},
            cssProperties = [],
            transforms = "",
            that = this,
            endEvent,
            wrappedCallback,
            fired = false,
            hasScrollTop = false,
            resetClipAuto = false;

        if (langx.isPlainObject(duration)) {
            ease = duration.easing;
            callback = duration.complete;
            delay = duration.delay;
            duration = duration.duration;
        }

        if (langx.isString(duration)) {
            duration = transits.speeds[duration];
        }
        if (duration === undefined) {
            duration = transits.speeds.normal;
        }
        duration = duration / 1000;
        if (transits.off) {
            duration = 0;
        }

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

        // CSS transitions
        for (key in properties) {
            var v = properties[key];
            if (supportedTransforms.test(key)) {
                transforms += key + "(" + v + ") ";
            } else {
                if (key === "scrollTop") {
                    hasScrollTop = true;
                }
                if (key == "clip" && langx.isPlainObject(v)) {
                    cssValues[key] = "rect(" + v.top+"px,"+ v.right +"px,"+ v.bottom +"px,"+ v.left+"px)";
                    if (styler.css(elm,"clip") == "auto") {
                        var size = geom.size(elm);
                        styler.css(elm,"clip","rect("+"0px,"+ size.width +"px,"+ size.height +"px,"+"0px)");  
                        resetClipAuto = true;
                    }

                } else {
                    cssValues[key] = v;
                }
                cssProperties.push(langx.dasherize(key));
            }
        }
        endEvent = transitionEnd;

        if (transforms) {
            cssValues[transform] = transforms;
            cssProperties.push(transform);
        }

        if (duration > 0) {
            cssValues[transitionProperty] = cssProperties.join(", ");
            cssValues[transitionDuration] = duration + "s";
            cssValues[transitionDelay] = delay + "s";
            cssValues[transitionTiming] = ease;
        }

        wrappedCallback = function(event) {
            fired = true;
            if (event) {
                if (event.target !== event.currentTarget) {
                    return // makes sure the event didn't bubble from "below"
                }
                eventer.off(event.target, endEvent, wrappedCallback)
            } else {
                eventer.off(elm, endEvent, wrappedCallback) // triggered by setTimeout
            }
            styler.css(elm, cssReset);
            if (resetClipAuto) {
 //               styler.css(elm,"clip","auto");
            }
            callback && callback.call(this);
        };

        if (duration > 0) {
            eventer.on(elm, endEvent, wrappedCallback);
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired
            langx.debounce(function() {
                if (fired) {
                    return;
                }
                wrappedCallback.call(that);
            }, ((duration + delay) * 1000) + 25)();
        }

        // trigger page reflow so new elements can transit
        elm.clientLeft;

        styler.css(elm, cssValues);

        if (duration <= 0) {
            langx.debounce(function() {
                if (fired) {
                    return;
                }
                wrappedCallback.call(that);
            }, 0)();
        }

        if (hasScrollTop) {
            geom.scrollToTop(elm, properties["scrollTop"], duration, callback);
        }

        return this;
    }

    return transits.transit = transit;

});
define('skylark-domx-transits/bounce',[
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
define('skylark-domx-transits/emulateTransitionEnd',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-eventer",
    "./transits"
],function(langx,browser,eventer,transits) {
    
    function emulateTransitionEnd(elm,duration) {
        var called = false;
        eventer.one(elm,'transitionEnd', function () { 
            called = true;
        })
        var callback = function () { 
            if (!called) {
                eventer.trigger(elm,browser.support.transition.end) 
            }
        };
        setTimeout(callback, duration);
        
        return this;
    } 



    return transits.emulateTransitionEnd = emulateTransitionEnd;
});
define('skylark-domx-transits/show',[
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
define('skylark-domx-transits/hide',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,styler,transits,transit) {
    /*   
     * Hide an element.
     * @param {Object} elm  
     * @param {String} speed
     * @param {Function} callback
     */
    function hide(elm, speed, callback) {
        if (speed) {
            if (!callback && langx.isFunction(speed)) {
                callback = speed;
                speed = "normal";
            }
            transit(elm, { opacity: 0, scale: "0,0" }, speed, function() {
                styler.hide(elm);
                if (callback) {
                    callback.call(elm);
                }
            });
        } else {
            styler.hide(elm);
        }
        return this;
    }

    return transits.hide = hide;
});
define('skylark-domx-transits/explode',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "skylark-domx-geom",
    "skylark-domx-noder",
    "skylark-domx-query",
    "./transits",
    "./transit",
    "./show",
    "./hide"
],function(langx,styler,geom,noder,$,transits,transit,show,hide) {

    function explode( elm,options, done ) {

		// Show and then visibility:hidden the element before calculating offset
		styler.show(elm);
		styler.css(elm, "visibility", "hidden" );

		var i, j, left, top, mx, my,
			rows = options.pieces ? Math.round( Math.sqrt( options.pieces ) ) : 3,
			cells = rows,
			mode = options.mode,
			show = mode === "show",
			offset = geom.pagePosition(elm),

			// Width and height of a piece
			size = geom.marginSize(elm),
			width = Math.ceil( size.width / cells ),
			height = Math.ceil( size.height / rows ),
			pieces = [];

		// Children transit complete:
		function childComplete() {
			pieces.push( this );
			if ( pieces.length === rows * cells ) {
				animComplete();
			}
		}

		// Clone the element for each row and cell.
		for ( var i = 0; i < rows; i++ ) { // ===>
			top = offset.top + i * height;
			my = i - ( rows - 1 ) / 2;

			for ( j = 0; j < cells; j++ ) { // |||
				left = offset.left + j * width;
				mx = j - ( cells - 1 ) / 2;

				// Create a clone of the now hidden main element that will be absolute positioned
				// within a wrapper div off the -left and -top equal to size of our pieces
				$(elm)
					.clone()
					.appendTo( "body" )
					.wrap( "<div></div>" )
					.css( {
						position: "absolute",
						visibility: "visible",
						left: -j * width,
						top: -i * height
					} )

					// Select the wrapper - make it overflow: hidden and absolute positioned based on
					// where the original was located +left and +top equal to the size of pieces
					.parent()
						.addClass( options.explodeClass || "ui-effects-explode" )
						.css( {
							position: "absolute",
							overflow: "hidden",
							width: width,
							height: height,
							left: left + ( show ? mx * width : 0 ),
							top: top + ( show ? my * height : 0 ),
							opacity: show ? 0 : 1
						} )
						.transit( {
							left: left + ( show ? 0 : mx * width ),
							top: top + ( show ? 0 : my * height ),
							opacity: show ? 1 : 0
						}, options.duration || 500, options.easing, childComplete );
			}
		}

		function animComplete() {
			styler.css(elm, {
				visibility: "visible"
			} );
			$( pieces ).remove();
			done();
		}

		return this;
	}


	return transits.explode = explode;
});

define('skylark-domx-transits/fade',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,styler,transits,transit) {
    /*   
     * Adjust the opacity of an element.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {Number or String} opacity
     * @param {String} easing
     * @param {Function} callback
     */
    function fade(elm, opacity,options, callback) {
        if (langx.isFunction(options)) {
            callback = options;
            options = {};
        }
        options = options || {};
        
        transit(elm, { opacity: opacity }, options.duration, options.easing, callback);
        return this;
    }


    return transits.fade = fade;
});
define('skylark-domx-transits/fadeIn',[
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
define('skylark-domx-transits/fadeOut',[
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
define('skylark-domx-transits/fadeToggle',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./fadeIn",
    "./fadeOut"
],function(langx,styler,transits,fadeIn,fadeOut) {

    /*   
     * Display or hide an element by animating its opacity.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {String} ceasing
     * @param {Function} callback
     */
    function fadeToggle(elm, speed, easing, callback) {
        if (styler.isInvisible(elm)) {
            fadeIn(elm, speed, easing, callback);
        } else {
            fadeOut(elm, speed, easing, callback);
        }
        return this;
    }


    return transits.fadeToggle = fadeToggle;
});
define('skylark-domx-transits/pulsate',[
    "skylark-langx/langx",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,geom,styler,transits,transit) {

	function pulsate(elm, options, done ) {
		var 
			mode = options.mode,
			show = mode === "show" || !mode,
			hide = mode === "hide",
			showhide = show || hide,

			// Showing or hiding leaves off the "last" animation
			anims = ( ( options.times || 5 ) * 2 ) + ( showhide ? 1 : 0 ),
			duration = options.duration / anims,
			animateTo = 0,
			i = 1;

		if ( show || styler.isInvisible(elm) ) {
			styler.css(elm, "opacity", 0 );
			styler.show(elm);
			animateTo = 1;
		}

		// Anims - 1 opacity "toggles"

		var Deferred = langx.Deferred;
		var funcs = [];

		function doAnimate(elm,properties, duration, ease) {
			return function() {
				var d = new Deferred();

				transit( elm,properties, duration, ease ,function(){
					d.resolve();
				});
				return d.promise;

			}
		}


		for ( ; i < anims; i++ ) {
			funcs.push(doAnimate(elm,{ opacity: animateTo }, duration, options.easing ));
			animateTo = 1 - animateTo;
		}

	    funcs.push(doAnimate(elm,{ opacity: animateTo }, duration, options.easing ));

		funcs.push(done);
		funcs.reduce(function(prev, curr, index, array) {
	  		return prev.then(curr);
		}, Deferred.resolve());

		return this;

	}

	return transits.pulsate = pulsate;

});

define('skylark-domx-transits/shake',[
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

define('skylark-domx-transits/slide',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "./transits",
    "./transit"
],function(langx,styler,transits,transit) {

    function slide(elm,options,callback ) {
    	if (langx.isFunction(options)) {
    		callback = options;
    		options = {};
    	}
    	options = options || {};
		var direction = options.direction || "down",
			isHide = ( direction === "up" || direction === "left" ),
			isVert = ( direction === "up" || direction === "down" ),
			duration = options.duration || transits.speeds.normal;


        // get the element position to restore it then
        var position = styler.css(elm, 'position');

        if (isHide) {
            // active the function only if the element is visible
        	if (styler.isInvisible(elm)) {
        		return this;
        	}
        } else {
	        // show element if it is hidden
	        styler.show(elm);        	
	        // place it so it displays as usually but hidden
	        styler.css(elm, {
	            position: 'absolute',
	            visibility: 'hidden'
	        });
        }



        if (isVert) { // up--down
	        // get naturally height, margin, padding
	        var marginTop = styler.css(elm, 'margin-top');
	        var marginBottom = styler.css(elm, 'margin-bottom');
	        var paddingTop = styler.css(elm, 'padding-top');
	        var paddingBottom = styler.css(elm, 'padding-bottom');
	        var height = styler.css(elm, 'height');

	        if (isHide) {  	// slideup
	            // set initial css for animation
	            styler.css(elm, {
	                visibility: 'visible',
	                overflow: 'hidden',
	                height: height,
	                marginTop: marginTop,
	                marginBottom: marginBottom,
	                paddingTop: paddingTop,
	                paddingBottom: paddingBottom
	            });

	            // transit element height, margin and padding to zero
	            transit(elm, {
	                height: 0,
	                marginTop: 0,
	                marginBottom: 0,
	                paddingTop: 0,
	                paddingBottom: 0
	            }, {
	                // callback : restore the element position, height, margin and padding to original values
	                duration: duration,
	                queue: false,
	                complete: function() {
	                    styler.hide(elm);
	                    styler.css(elm, {
	                        visibility: 'visible',
	                        overflow: 'hidden',
	                        height: height,
	                        marginTop: marginTop,
	                        marginBottom: marginBottom,
	                        paddingTop: paddingTop,
	                        paddingBottom: paddingBottom
	                    });
	                    if (callback) {
	                        callback.apply(elm);
	                    }
	                }
	            });
	        } else {     	// slidedown
		        // set initial css for animation
		        styler.css(elm, {
		            position: position,
		            visibility: 'visible',
		            overflow: 'hidden',
		            height: 0,
		            marginTop: 0,
		            marginBottom: 0,
		            paddingTop: 0,
		            paddingBottom: 0
		        });

		        // transit to gotten height, margin and padding
		        transit(elm, {
		            height: height,
		            marginTop: marginTop,
		            marginBottom: marginBottom,
		            paddingTop: paddingTop,
		            paddingBottom: paddingBottom
		        }, {
		            duration: duration,
		            complete: function() {
		                if (callback) {
		                    callback.apply(elm);
		                }
		            }
		        });

	        }

        } else { // left--right
	        // get naturally height, margin, padding
	        var marginLeft = styler.css(elm, 'margin-left');
	        var marginRight = styler.css(elm, 'margin-right');
	        var paddingLeft = styler.css(elm, 'padding-left');
	        var paddingRight = styler.css(elm, 'padding-right');
	        var width = styler.css(elm, 'width');

	        if (isHide) {  	// slideleft
	            // set initial css for animation
	            styler.css(elm, {
	                visibility: 'visible',
	                overflow: 'hidden',
	                width: width,
	                marginLeft: marginLeft,
	                marginRight: marginRight,
	                paddingLeft: paddingLeft,
	                paddingRight: paddingRight
	            });

	            // transit element height, margin and padding to zero
	            transit(elm, {
	                width: 0,
	                marginLeft: 0,
	                marginRight: 0,
	                paddingLeft: 0,
	                paddingRight: 0
	            }, {
	                // callback : restore the element position, height, margin and padding to original values
	                duration: duration,
	                queue: false,
	                complete: function() {
	                    styler.hide(elm);
	                    styler.css(elm, {
	                        visibility: 'visible',
	                        overflow: 'hidden',
	                        width: width,
	                        marginLeft: marginLeft,
	                        marginRight: marginRight,
	                        paddingLeft: paddingLeft,
	                        paddingRight: paddingRight
	                    });
	                    if (callback) {
	                        callback.apply(elm);
	                    }
	                }
	            });
	        } else {     	// slideright
		        // set initial css for animation
		        styler.css(elm, {
		            position: position,
		            visibility: 'visible',
		            overflow: 'hidden',
		            width: 0,
		            marginLeft: 0,
		            marginRight: 0,
		            paddingLeft: 0,
		            paddingRight: 0
		        });

		        // transit to gotten width, margin and padding
		        transit(elm, {
		            width: width,
		            marginLeft: marginLeft,
		            marginRight: marginRight,
		            paddingLeft: paddingLeft,
		            paddingRight: paddingRight
		        }, {
		            duration: duration,
		            complete: function() {
		                if (callback) {
		                    callback.apply(elm);
		                }
		            }
		        });

	        }       	
        }

        return this;
    }

    return transits.slide = slide;

});

define('skylark-domx-transits/slideDown',[
    "./transits",
    "./slide"
],function(transits,slide) {
    /*   
     * Display an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideDown(elm, duration, callback) {
        return slide(elm,{
            direction : "down",
            duration : duration
        },callback);
    }

    return transits.slideDown = slideDown;
});
define('skylark-domx-transits/slideUp',[
    "./transits",
    "./slide"
],function(transits,slide) {
    /*   
     * Hide an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideUp(elm, duration, callback) {
        return slide(elm,{
            direction : "up",
            duration : duration
        },callback);
    }



    return transits.slideUp = slideUp;
});
define('skylark-domx-transits/slideToggle',[
    "skylark-langx/langx",
    "skylark-domx-geom",
    "./transits",
    "./slideDown",
    "./slideUp"
],function(langx,geom,transits,slideDown,slideUp) {

    /*   
     * Display or hide an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideToggle(elm, duration, callback) {

        // if the element is hidden, slideDown !
        if (geom.height(elm) == 0) {
            slideDown(elm, duration, callback);
        }
        // if the element is visible, slideUp !
        else {
            slideUp(elm, duration, callback);
        }
        return this;
    }

    return transits.slideToggle = slideToggle;
});
define('skylark-domx-transits/throb',[
    "skylark-langx/langx",
    "skylark-domx-styler",
    "skylark-domx-noder",
    "./transits",
    "./transit"
],function(langx,styler,noder,transits,transit) {

    
    /*   
     * Replace an old node with the specified node.
     * @param {HTMLElement} elm
     * @param {Node} params
     */
    function throb(elm, params) {
        params = params || {};

        var self = this,
            text = params.text,
            style = params.style,
            time = params.time,
            callback = params.callback,
            timer,

            throbber = noder.createElement("div", {
                "class": params.className || "throbber"
            }),
            //_overlay = overlay(throbber, {
            //    "class": 'overlay fade'
            //}),
            remove = function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (throbber) {
                    noder.remove(throbber);
                    throbber = null;
                }
            },
            update = function(params) {
                if (params && params.text && throbber) {
                    textNode.nodeValue = params.text;
                }
            };

        if (params.style) {
            styler.css(throbber,params.style);
        }

        //throb = noder.createElement("div", {
        //   "class": params.throb && params.throb.className || "throb"
        //}),
        //textNode = noder.createTextNode(text || ""),
 
        var content = params.content ||  '<span class="throb"></span>';

        //throb.appendChild(textNode);
        //throbber.appendChild(throb);

        noder.html(throbber,content);
        
        elm.appendChild(throbber);

        var end = function() {
            remove();
            if (callback) callback();
        };
        if (time) {
            timer = setTimeout(end, time);
        }

        return {
            throbber : throbber,
            remove: remove,
            update: update
        };
    }

    return transits.throb = throb;
});
define('skylark-domx-transits/toggle',[
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
define('skylark-domx-transits/main',[
	"./transits",
	"skylark-domx-velm",
	"skylark-domx-query",
    "./transit",
    "./bounce",
    "./emulateTransitionEnd",
    "./explode",
    "./fadeIn",
    "./fadeOut",
    "./fade",
    "./fadeToggle",
    "./hide",
    "./pulsate",
    "./shake",
    "./show",
    "./slide",
    "./slideDown",
    "./slideToggle",
    "./slideUp",
    "./throb",
    "./toggle"
],function(transits,velm,$){
    // from ./transits
    velm.delegate([
        "transit",
        "emulateTransitionEnd",
        "fadeIn",
        "fadeOut",
        "fade",
        "fadeToggle",
        "hide",
        "scrollToTop",
        "slideDown",
        "slideToggle",
        "slideUp",
        "show",
        "toggle"
    ], transits);

    $.fn.hide =  $.wraps.wrapper_every_act(transits.hide, transits);

    $.fn.transit = $.wraps.wrapper_every_act(transits.transit, transits);
    $.fn.emulateTransitionEnd = $.wraps.wrapper_every_act(transits.emulateTransitionEnd, transits);

    $.fn.show = $.wraps.wrapper_every_act(transits.show, transits);
    $.fn.hide = $.wraps.wrapper_every_act(transits.hide, transits);
    $.fn.toogle = $.wraps.wrapper_every_act(transits.toogle, transits);
    $.fn.fadeTo = $.wraps.wrapper_every_act(transits.fadeTo, transits);
    $.fn.fadeIn = $.wraps.wrapper_every_act(transits.fadeIn, transits);
    $.fn.fadeOut = $.wraps.wrapper_every_act(transits.fadeOut, transits);
    $.fn.fadeToggle = $.wraps.wrapper_every_act(transits.fadeToggle, transits);

    $.fn.slideDown = $.wraps.wrapper_every_act(transits.slideDown, transits);
    $.fn.slideToggle = $.wraps.wrapper_every_act(transits.slideToggle, transits);
    $.fn.slideUp = $.wraps.wrapper_every_act(transits.slideUp, transits);

	return transits;
});
define('skylark-domx-transits', ['skylark-domx-transits/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-transits.js.map
