define([
	"skylark-langx-numerics/vector2",
	"../widget"
],function(
	Vector2,
	Widget
){
	"use strict";

	var ImageMixin = {
		_buildImage : function (parent) {
			/**
			 * Button icon.
			 * 
			 * @attribute icon
			 * @type {DOM}
			 */
			this.icon = document.createElement("img");
			this.icon.style.pointerEvents = "none";
			this.icon.style.position = "absolute";
			this.icon.style.top = "15%";
			this.icon.style.left = "15%";
			this.icon.style.width = "70%";
			this.icon.style.height = "70%";
			this._elm.appendChild(this.icon);
		},


		/**
		 * Set button drawer icon.
		 *
		 * @method setImage
		 * @param {String} image Image URL.
		 */
		setImage : function(image) {
			this.icon.src = image;
		},

		/**
		 * Set icon scale, the icon will be centered.
		 *
		 * @method setImageScale
		 */
		setImageScale : function(x, y){
			this.icon.style.top = ((1 - y) / 2 * 100) + "%";
			this.icon.style.left = ((1 - x) / 2 * 100) + "%";
			this.icon.style.width = (x * 100) + "%";
			this.icon.style.height = (y * 100) + "%";
		}

	};

	return ImageMixin;
});