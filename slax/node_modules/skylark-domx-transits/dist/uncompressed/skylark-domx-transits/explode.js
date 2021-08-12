define([
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
