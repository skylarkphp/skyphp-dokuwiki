define([
  "./base",
  "./Widget",
  "./mixins/TextMixin"
],function(
	base,
	Widget,
	TextMixin
){
	"use strict";

	/**
	 * Text element without background.
	 * 
	 * @class Text
	 * @extends {Element}
	 * @param {Element} parent Parent element.
	 */

	var TextPane = Widget.inherit({

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent,"div");

			var skin = this.getSkin();

			this._elm.style.pointerEvents = "none";
			this._elm.style.color = skin.textColor;
			this._elm.style.display = "flex";
			
			/*
				 * 
				 * Span DOM element used to represent the text.
				 *
				 * @attribute span
				 * @type {DOM}
			 	 
				this.span = document.createElement("span");
				this.span.style.overflow = "hidden";
				this.element.appendChild(this.span);

				//Text
				this.text = document.createTextNode("");
				this.span.appendChild(this.text);

				**
				 * If set to true the text container will automatically fit the text size.
				 *
				 * @attribute fitContent
				 * @type {Boolean}
				 *
				this.fitContent = false;

				this.allowWordBreak(false);
				this.setVerticalAlignment(Text.CENTER);
				this.setAlignment(Text.CENTER);
			*/

			this._buildText();


		},
		...TextMixin
	});
	
	TextPane.CENTER = 0;
	TextPane.LEFT = 1;
	TextPane.RIGHT = 2;
	TextPane.TOP = 3;
	TextPane.BOTTOM = 4;

	TextPane.CLIP = 10;
	TextPane.ELLIPSIS = 11;

	return base.TextPane = TextPane;
});