define([
	"skylark-langx-funcs",
	"./base",
	"./Widget",
	"./TextPane",
	"./ImagePane"
],function(
	funcs,
	base,

	Widget,
	TextPane,
	ImagePane
){
	"use strict";

	/**
	 * Loading box, used to force the user to wait for data from a request.
	 *
	 * Blocks every input event (cancels propagation).
	 * 
	 * @class LoadingModal
	 * @extends {Element}
	 * @param {Element} parent Parent element.
	 */
	 var LoadingModal = Widget.inherit({
		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "div");
			
			var self = this;

			this._elm.style.backgroundColor = "rgba(0.0, 0.0, 0.0, 0.3)"
			this._elm.style.zIndex = "200";

			/**
			 * Counter keeps the amount of requests to show the loadingBox.
			 *
			 * Is is incremented each time the box is show and decremented each time it is hidden.
			 *
			 * The box is only hidden if counter goes bellow 1.
			 *
			 * @attribute counter
			 * @type {Number}
			 */
			this.counter = 0;

			/**
			 * Loading text.
			 *
			 * @attribute text
			 * @type {Text}
			 */
			this.text = new TextPane(this);
			this.text.setText("Loading data");
			this.text.setStyle("color", "#FFFFFF");

			/**
			 * Message presented in the loading box.
			 *
			 * @attribute message
			 * @type {Text}
			 */
			this.message = new TextPane(this);
			this.message.setText("Please wait");
			this.message.setStyle("color", "#FFFFFF");
			this.message.allowWordBreak(true);

			//Icon
			this.icon = new ImagePane(this);
			this.icon.setImage("files/loading.png");  // modified by lwf
			
			var rotation = 0.0;
			
			//Animation
			this.timer = new funcs.loop(function()
			{
				rotation += 0.05;
				self.icon.setStyle("transform", "rotate(" + rotation + "rad)");
			});
			
			//Event manager
			//this.manager = new EventManager();
			this.listenTo(this.$(window), "resize", function(event)
			{
				self.updateInterface();
			});
		},


		/**
		 * Show the loading box.
		 * 
		 * @method show
		 * @param {Boolean} showCancel If true shows the cancel button.
		 * @param {Function} callback Callback function.
		 */
		show : function()
		{	
			this.counter++;

			if(this.counter === 1)
			{
				this.timer.start();
				//this.manager.create();
				this.visible = true;
				this.updateInterface();
			}
		},

		/**
		 * Hide modal box.
		 *
		 * @method hide
		 * @param {Boolean} force Hide box and reset counter;
		 */
		hide : function(force)
		{
			this.counter--;

			if(this.counter < 1 || force === true)
			{
				this.counter = 0;
				this.timer.stop();
				//this.manager.destroy();
				this.setVisibility(false);
			}
		},

		destroy : function()
		{
			Widget.prototype.destroy.call(this);

			this.counter = 0;
			this.timer.stop();
			this.manager.destroy();
		},

		updateSize : function()
		{
			this.size.copy(this.parent.size);

			Widget.prototype.updateSize.call(this);

			//Text
			this.text.setStyle("fontSize", "38px");
			this.text.size.set(this.size.x, 100);
			this.text.center();
			this.text.position.y -= this.text.size.y;
			this.text.updateInterface();
			
			//Message
			this.message.setStyle("fontSize", "20px");
			this.message.size.set(this.size.x, 100);
			this.message.center();
			this.message.position.y -= this.message.size.y / 2;
			this.message.updateInterface();

			//Icon
			this.icon.size.set(80, 80);
			this.icon.center();
			this.icon.position.y += 30;
			this.icon.updateInterface();
		}

	 });

	return base.LoadingModal = LoadingModal;
});