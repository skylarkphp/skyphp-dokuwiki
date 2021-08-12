define([
	"./base",
	"./Widget"
],function(base,Widget){
	"use strict";

	/**
	 * DOM form element.
	 * 
	 * This element should be used to encapsulate input elements that require autocompletion.
	 * 
	 * @class Form
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var SubmitForm = Widget.inherit({
		"_construct" : function(parent)
		{
			Widget.prototype._construct.call(this, parent, "form");

			this._elm.autocomplete = true;
			this._elm.noValidate = true;
			this._elm.action = "javascript:void(0)";
			this._elm.addEventListener("submit", function(event)
			{
				event.preventDefault()
				return false;
			});
		},


		/**
		 * Simulate the form submission.
		 * 
		 * Should be called when sending data to the server to trigger the browser autocomplete system.
		 * 
		 * Some form implementation might actually implement submission login under this method.
		 *
		 * @method submit
		 */
		submit : function()
		{
			this._elm.submit();
		}

	});

	return base.SubmitForm = SubmitForm;
});
