define([
	"skylark-langx-klass",
	"./keyboard",
	"./KeyState"
],function(
	klass,
	keyboard,
	KeyState
){
	"use strict";

	/**
	 * Keyboard instance for input in sync with the running 3D application.
	 * 
	 * The keyboard object provided by scripts is automatically updated by the runtime handler.
	 * 
	 * @class Keyboard
	 * @module Input
	 * @param {Boolean} dontInitialize If true the mouse events are not created.
	 */
	var Monitor = klass({
		_construct : function (dontInitialize) 	{
			/**
			 * Array with keyboard keys status.
			 *
			 * @property keyStates
			 * @type {Array}
			 */
			this.keyStates = [];


			/**
			 * The actions array serves as a buffer for the key input actions.
			 *
			 * Until the update method is called it stores all the key stroke actions.
			 *
			 * On update the key strokes are updated and the keys array stores the correct values.
			 *
			 * @property actions
			 * @type {Array}
			 */
			this.actions = [];

			var self = this;
			var actions = this.actions;

			/**
			 * Event manager used to handle the keyup, keydown and focus events.
			 *
			 * On each event actions are added to the actions array.
			 *
			 * @property events
			 * @type {EventManager}
			 */
			//this.events = new EventManager();
			/*
			this.events.add(window, "keydown", function(event)
			{
				actions.push(event.keyCode);
				actions.push(Key.DOWN);
			});
			this.events.add(window, "keyup", function(event)
			{
				actions.push(event.keyCode);
				actions.push(Key.UP);
			});
			this.events.add(window, "focus", function(event)
			{
				self.reset();
			});
			*/
			this.handlers = {
				"keydown" : function(event) {
								actions.push(event.keyCode);
								actions.push(Key.DOWN);
							},			
				"keyup" : function(event) {
								actions.push(event.keyCode);
								actions.push(Key.UP);
							},			
				"focus" : function(event) {
								self.reset();
							},			


			};

			if(dontInitialize !== true)
			{
				this.create();
			}


		},

		/**
		 * Update key flags synchronously.
		 * 
		 * @method update
		 */
		update : function() 	{
			var end = 0;

			while(this.actions.length > end)
			{
				var key = this.actions.shift();
				var action = this.actions.shift();

				if(this.keyStates[key] === undefined)
				{
					this.keyStates[key] = new Key();
				}

				this.keyStates[key].update(action);

				if(this.keyStates[key].justReleased || this.keyStates[key].justPressed)
				{
					this.actions.push(key);
					this.actions.push(Key.RESET);
					end += 2;
				}
			}
		},

		/**
		 * Reset keyboard status to default.
		 *
		 * Does not clean the action list.
		 * 
		 * @method reset
		 */
		reset : function() {
			//Reset all keys
			for(var i = 0; i < this.keyStates.length; i++)
			{
				if(this.keyStates[i] !== undefined)
				{
					this.keyStates[i].reset();
				}
			}
		},

		/**
		 * Check if a key is pressed.
		 * 
		 * @method keyPressed
		 * @return {boolean} True is the key is currently pressed
		 */
		keyPressed : function(key){
			return this.keyStates[key] !== undefined && this.keyStates[key].pressed;
		},

		/**
		 * Check is a key as just pressed.
		 * 
		 * @method keyJustPressed
		 * @return {boolean} True is the key was just pressed
		 */
		keyJustPressed : function(key){
			return this.keyStates[key] !== undefined && this.keyStates[key].justPressed;
		},

		/**
		 * Check if a key was just released.
		 * 
		 * @method keyJustReleased
		 * @return {boolean} True is the key was just pressed
		 */
		keyJustReleased : function(key){
			return this.keyStates[key] !== undefined && this.keyStates[key].justReleased;
		},


		/**
		 * Create keyboard events.
		 * 
		 * @method dispose
		 */
		create : function(){
			//this.events.create();
			for (var event in this.handlers) {
				window.addEventListener(event,this.handlers[event]);
			}
		},

		/**
		 * Dispose keyboard events.
		 * 
		 * @method dispose
		 */
		dispose : function()	{
			//this.events.destroy();
			for (var event in this.handlers) {
				window.removeEventListener(event,this.handlers[event]);
			}
		}

	});


	return keyboard.Monitor =  Monitor;
});