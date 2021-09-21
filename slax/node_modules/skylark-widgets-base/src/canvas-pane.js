define([
  "./base",
  "./widget"
],function(
	base,
	Widget
){
	"use strict";

	/**
	 * DOM canvas element.
	 * 
	 * @class Canvas
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var CanvasPane = Widget.inherit({
		"klassName" : "CanvasPane",

		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "canvas");

			this.preventDragEvents();
		},


		/**
		 * Get a context from this canvas.
		 * 
		 * @method getContext
		 * @param {string} type Type of context to get "2d", "webgl", etc
		 * @return {Object} Context obtained from the canvas.
		 */
		getContext : function(type)
		{
			return this._elm.getContext(type);
		},

		updateSize : function()
		{
			Widget.prototype.updateSize.call(this);

			var pixelRatio = Editor.getPixelRatio();
			
			this._elm.width = this.size.x * pixelRatio;
			this._elm.height = this.size.y * pixelRatio;
		}

	});

	return base.CanvasPane = CanvasPane;
});