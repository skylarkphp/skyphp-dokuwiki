define([
	"../base",
	"../widget"
],function(base,Widget){
	"use strict";

	/**
	 * DOM division element.
	 * 
	 * @class Division
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var Panel = Widget.inherit({
		"_construct" : function (parent) {
			Widget.prototype._construct.call(this, parent, "div");

			//this._elm.style.overflow = "visible";
		},

		_setupChild : function(child) {
        	child.element.style.position = "absolute";
        	//child.element.style.overflow = "hidden";			
		}

	});


	return base.panels.Panel = Panel;
});