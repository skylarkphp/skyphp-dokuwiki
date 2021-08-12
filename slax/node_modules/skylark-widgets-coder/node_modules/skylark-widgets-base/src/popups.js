define([
  "./base"
],function(base){

	var popup = null;

	function popup(widget, reference, position, data) {
		var o, 
			e, 
			x, 
			y, 
			w, 
			h, 
			dw, 
			dh, 
			position_x,
			position_y,
			cond = true;
		switch(cond) {
			case (!position && !reference):
				return false;
			case (!!position && !!reference):
				//this.reference	= reference;
				position_x	= position.x;
				position_y	= position.y;
				break;
			case (!position && !!reference):
				o = reference.offset();
				position_x	= o.left + reference.outerHeight();
				position_y	= o.top;
				break;
			case (!!position && !reference):
				position_x	= position.x;
				position_y	= position.y;
				break;
		}
		if(!!reference && !data && $(reference).data('vakata_contextmenu')) {
			data = $(reference).data('vakata_contextmenu');
		}

		var $el = $(widget._elm);

		$el.appendTo(document.body);
		x = this.position_x;
		y = this.position_y;
		w = $el.width();
		h = $el.height();
		dw = $(window).width() + $(window).scrollLeft();
		dh = $(window).height() + $(window).scrollTop();
		if(right_to_left) {
			x -= (e.outerWidth() - $(reference).outerWidth());
			if(x < $(window).scrollLeft() + 20) {
				x = $(window).scrollLeft() + 20;
			}
		}
		if(x + w + 20 > dw) {
			x = dw - (w + 20);
		}
		if(y + h + 20 > dh) {
			y = dh - (h + 20);
		}

		$el
			.css({ "left" : x, "top" : y })
			.show();


		popup = widget;

		/**
		 * triggered on the document when the contextmenu is shown
		 * @event
		 * @plugin contextmenu
		 * @name context_show.vakata
		 * @param {jQuery} reference the element that was right clicked
		 * @param {jQuery} element the DOM element of the menu itself
		 * @param {Object} position the x & y coordinates of the menu
		 */
		widget._trigger("show");
	}


	return base.popups = {
		popup : popup
	};
});