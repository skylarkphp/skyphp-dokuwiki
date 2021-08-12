define([
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
