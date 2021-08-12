define([
	"skylark-domx-styler",
	"skylark-domx-noder",
	"skylark-domx-geom",
	"skylark-domx-data",
	"./placeholders"
],function(styler,noder,geom,datax,placeholders){
	// Creates a placeholder element so that the original element can be made absolute
	function createPlaceholder( elm ) {
		var placeholder,
			cssPosition = styler.css(elm,"position" ),
			position = geom.relativePosition(elm);

		// Lock in margins first to account for form elements, which
		// will change margin if you explicitly set height
		// see: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// Support: Safari
		styler.css(elm, styler.css(elm,["marginTop","marginBottom","marginLeft", "marginRight"]));
		geom.size(elm,geom.size(elm));

		if ( /^(static|relative)/.test( cssPosition ) ) {
			cssPosition = "absolute";

			placeholder = noder.createElement(elm.nodeName);

			styler.css(placeholder,{
				// Convert inline to inline block to account for inline elements
				// that turn to inline block based on content (like img)
				display: /^(inline|ruby)/.test( styler.css(elm,"display" ) ) ?
					"inline-block" :
					"block",
				visibility: "hidden"
			});

			// Margins need to be set to account for margin collapse
			styler.css(placeholder, styler.css(elm,["marginTop","marginBottom","marginLeft", "marginRight","float"]));

			datax.data(elm, "placeholder", placeholder );

			geom.size(placeholder,geom.size(elm));

			noder.after(elm,placeholder);

		}

		styler.css(elm, {
			position: cssPosition,
			left: position.left,
			top: position.top
		} );

		return placeholder;
	}

	return placeholders.create = createPlaceholder;

});