define([
	"skylark-langx-klass",
	"./keyboard"
],function(klass,keyboard){
	"use strict";

	/**
	 * KeyState is used by Keyboard, Mouse, etc, to represent a key state.
	 *
	 * @class KeyState
	 * @module Input
	*/
	var KeyState = klass({
		_construct : function() {
			/**
			 * Indicates if this key is currently pressed.
			 * @property pressed
			 * @default false
			 * @type {boolean}
			 */
			this.pressed = false;

			/**
			 * Indicates if this key was just pressed.
			 * @property justPressed
			 * @default false
			 * @type {boolean}
			 */
			this.justPressed = false;
			
			/**
			 * Indicates if this key was just released.
			 * @property justReleased
			 * @default false
			 * @type {boolean}
			 */
			this.justReleased = false;

		},

		/**
		 * Update Key status based on new key state.
		 * 
		 * @method update
		 */
		update : function(action)  {
			this.justPressed = false;
			this.justReleased = false;

			if(action === KeyState.DOWN)
			{
				if(this.pressed === false)
				{
					this.justPressed = true;
				}
				this.pressed = true;
			}
			else if(action === KeyState.UP)
			{
				if(this.pressed)
				{
					this.justReleased = true;
				}
				this.pressed = false;
			}
			else if(action === KeyState.RESET)
			{
				this.justReleased = false;
				this.justPressed = false;
			}
		},

		/**
		 * Set this key attributes manually.
		 * 
		 * @method set
		 */
		set : function(justPressed, pressed, justReleased){
			this.justPressed = justPressed;
			this.pressed = pressed;
			this.justReleased = justReleased;
		},

		/**
		 * Reset key to default values.
		 * 
		 * @method reset
		*/
		reset : function() 	{
			this.justPressed = false;
			this.pressed = false;
			this.justReleased = false;
		}
	});

	/**
	 * Down
	 * @attribute DOWN
	 * @type {Number}
	 */
	KeyState.DOWN = -1;

	/**
	 * Up
	 * @attribute UP
	 * @type {Number}
	 */
	KeyState.UP = 1;

	/**
	 * Reset
	 * @attribute RESET
	 * @type {Number}
	 */
	KeyState.RESET = 0;


	return keyboard.KeyState = KeyState;

});