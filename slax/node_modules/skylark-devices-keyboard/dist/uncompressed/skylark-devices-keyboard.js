/**
 * skylark-devices-keyboard - The keyboard  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-devices-keyboard/keyboard',[
	"skylark-langx-ns"
],function(skylark){
	var keyboard = {};
	/**
	 * Function: isShiftDown
	 * 
	 * Returns true if the shift key is pressed for the given event.
	 */
	keyboard.isShiftDown = function (evt) {
		return (evt != null) ? evt.shiftKey : false;
	};

	/**
	 * Function: isAltDown
	 * 
	 * Returns true if the alt key is pressed for the given event.
	 */
	keyboard.isAltDown = function (evt) {
		return (evt != null) ? evt.altKey : false;
	};

	/**
	 * Function: isControlDown
	 * 
	 * Returns true if the control key is pressed for the given event.
	 */
	keyboard.isControlDown = function (evt) {
		return (evt != null) ? evt.ctrlKey : false;
	};

	/**
	 * Function: isMetaDown
	 * 
	 * Returns true if the meta key is pressed for the given event.
	 */
	keyboard.isMetaDown = function (evt){
		return (evt != null) ? evt.metaKey : false;
	};


	return skylark.attach("devices.keyboard",keyboard);	
});
define('skylark-devices-keyboard/KeyState',[
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
define('skylark-devices-keyboard/keys',[
	"./keyboard"
],function(keyboard){
	var keys = {};
	/**
	 * TAB key
	 * @attribute TAB
	 * @type {Number}
	 */
	keys.TAB = 9;

	/**
	 * ENTER key
	 * @attribute ENTER
	 * @type {Number}
	 */
	keys.ENTER = 13;

	/**
	 * SHIFT key
	 * @attribute SHIFT
	 * @type {Number}
	 */
	keys.SHIFT = 16;

	/**
	 * CTRL key
	 * @attribute CTRL
	 * @type {Number}
	 */
	keys.CTRL = 17;

	/**
	 * ALT key
	 * @attribute ALT
	 * @type {Number}
	 */
	keys.ALT = 18;

	/**
	 * CAPS_LOCK key
	 * @attribute CAPS_LOCK
	 * @type {Number}
	 */
	keys.CAPS_LOCK = 20;

	/**
	 * ESC key
	 * @attribute ESC
	 * @type {Number}
	 */
	keys.ESC = 27;

	/**
	 * SPACEBAR key
	 * @attribute SPACEBAR
	 * @type {Number}
	 */
	keys.SPACEBAR = 32;

	/**
	 * PAGE_UP key
	 * @attribute PAGE_UP
	 * @type {Number}
	 */
	keys.PAGE_UP = 33;

	/**
	 * PAGE_DOWN key
	 * @attribute PAGE_DOWN
	 * @type {Number}
	 */
	keys.PAGE_DOWN = 34;

	/**
	 * END key
	 * @attribute END
	 * @type {Number}
	 */
	keys.END = 35;

	/**
	 * HOME key
	 * @attribute HOME
	 * @type {Number}
	 */
	keys.HOME = 36;

	/**
	 * INSERT key
	 * @attribute INSERT
	 * @type {Number}
	 */
	keys.INSERT = 45;

	/**
	 * DEL key
	 * @attribute DEL
	 * @type {Number}
	 */
	keys.DEL = 46;

	/**
	 * LEFT key
	 * @attribute LEFT
	 * @type {Number}
	 */
	keys.LEFT = 37;

	/**
	 * RIGHT key
	 * @attribute RIGHT
	 * @type {Number}
	 */
	keys.RIGHT = 39;

	/**
	 * UP key
	 * @attribute UP
	 * @type {Number}
	 */
	keys.UP = 38;

	/**
	 * DOWN key
	 * @attribute DOWN
	 * @type {Number}
	 */
	keys.DOWN = 40;

	/**
	 * NUM0 key
	 * @attribute NUM0
	 * @type {Number}
	 */
	keys.NUM0 = 48;

	/**
	 * NUM1 key
	 * @attribute NUM1
	 * @type {Number}
	 */
	keys.NUM1 = 49;

	/**
	 * NUM2 key
	 * @attribute NUM2
	 * @type {Number}
	 */
	keys.NUM2 = 50;

	/**
	 * NUM3 key
	 * @attribute NUM3
	 * @type {Number}
	 */
	keys.NUM3 = 51;

	/**
	 * NUM4 key
	 * @attribute NUM4
	 * @type {Number}
	 */
	keys.NUM4 = 52;

	/**
	 * NUM5 key
	 * @attribute NUM5
	 * @type {Number}
	 */
	keys.NUM5 = 53;

	/**
	 * NUM6 key
	 * @attribute NUM6
	 * @type {Number}
	 */
	keys.NUM6 = 54;

	/**
	 * NUM7 key
	 * @attribute NUM7
	 * @type {Number}
	 */
	keys.NUM7 = 55;

	/**
	 * NUM8 key
	 * @attribute NUM8
	 * @type {Number}
	 */
	keys.NUM8 = 56;

	/**
	 * NUM9 key
	 * @attribute NUM9
	 * @type {Number}
	 */
	keys.NUM9 = 57;

	/**
	 * A key
	 * @attribute A
	 * @type {Number}
	 */
	keys.A = 65;

	/**
	 * B key
	 * @attribute B
	 * @type {Number}
	 */
	keys.B = 66;

	/**
	 * C key
	 * @attribute C
	 * @type {Number}
	 */
	keys.C = 67;

	/**
	 * D key
	 * @attribute D
	 * @type {Number}
	 */
	keys.D = 68;

	/**
	 * E key
	 * @attribute E
	 * @type {Number}
	 */
	keys.E = 69;

	/**
	 * F key
	 * @attribute F
	 * @type {Number}
	 */
	keys.F = 70;

	/**
	 * G key
	 * @attribute G
	 * @type {Number}
	 */
	keys.G = 71;

	/**
	 * H key
	 * @attribute H
	 * @type {Number}
	 */
	keys.H = 72;

	/**
	 * I key
	 * @attribute I
	 * @type {Number}
	 */
	keys.I = 73;

	/**
	 * J key
	 * @attribute J
	 * @type {Number}
	 */
	keys.J = 74;

	/**
	 * K key
	 * @attribute K
	 * @type {Number}
	 */
	keys.K = 75;

	/**
	 * L key
	 * @attribute L
	 * @type {Number}
	 */
	keys.L = 76;

	/**
	 * M key
	 * @attribute M
	 * @type {Number}
	 */
	keys.M = 77;

	/**
	 * N key
	 * @attribute N
	 * @type {Number}
	 */
	keys.N = 78;

	/**
	 * O key
	 * @attribute O
	 * @type {Number}
	 */
	keys.O = 79;

	/**
	 * P key
	 * @attribute P
	 * @type {Number}
	 */
	keys.P = 80;

	/**
	 * Q key
	 * @attribute Q
	 * @type {Number}
	 */
	keys.Q = 81;

	/**
	 * R key
	 * @attribute R
	 * @type {Number}
	 */
	keys.R = 82;

	/**
	 * S key
	 * @attribute S
	 * @type {Number}
	 */
	keys.S = 83;

	/**
	 * T key
	 * @attribute T
	 * @type {Number}
	 */
	keys.T = 84;

	/**
	 * U key
	 * @attribute U
	 * @type {Number}
	 */
	keys.U = 85;

	/**
	 * V key
	 * @attribute V
	 * @type {Number}
	 */
	keys.V = 86;

	/**
	 * W key
	 * @attribute W
	 * @type {Number}
	 */
	keys.W = 87;

	/**
	 * X key
	 * @attribute X
	 * @type {Number}
	 */
	keys.X = 88;

	/**
	 * Y key
	 * @attribute Y
	 * @type {Number}
	 */
	keys.Y = 89;

	/**
	 * Z key
	 * @attribute Z
	 * @type {Number}
	 */
	keys.Z = 90;

	/**
	 * F1 key
	 * @attribute F1
	 * @type {Number}
	 */
	keys.F1 = 112;

	/**
	 * F2 key
	 * @attribute F2
	 * @type {Number}
	 */
	keys.F2 = 113;

	/**
	 * F3 key
	 * @attribute F3
	 * @type {Number}
	 */
	keys.F3 = 114;

	/**
	 * F4 key
	 * @attribute F4
	 * @type {Number}
	 */
	keys.F4 = 115;

	/**
	 * F5 key
	 * @attribute F5
	 * @type {Number}
	 */
	keys.F5 = 116;

	/**
	 * F6 key
	 * @attribute F6
	 * @type {Number}
	 */
	keys.F6 = 117;

	/**
	 * F7 key
	 * @attribute F7
	 * @type {Number}
	 */
	keys.F7 = 118;

	/**
	 * F8 key
	 * @attribute F8
	 * @type {Number}
	 */
	keys.F8 = 119;

	/**
	 * F9 key
	 * @attribute F9
	 * @type {Number}
	 */
	keys.F9 = 120;

	/**
	 * F10 key
	 * @attribute F10
	 * @type {Number}
	 */
	keys.F10 = 121;

	/**
	 * F11 key
	 * @attribute F11
	 * @type {Number}
	 */
	keys.F11 = 122;

	/**
	 * F12 key
	 * @attribute F12
	 * @type {Number}
	 */
	keys.F12 = 123;

	return keyboard.keys = keys;
	
});
define('skylark-devices-keyboard/Monitor',[
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
define('skylark-devices-keyboard/codes',[
	"./keyboard"
],function(keyboard){

  /**
   * Get by name
   *
   *   exports.code['enter'] // => 13
   */

  var codes =  {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'pause/break': 19,
    'caps lock': 20,
    'esc': 27,
    'space': 32,
    'page up': 33,
    'page down': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'insert': 45,
    'delete': 46,
    'command': 91,
    'left command': 91,
    'right command': 93,
    'numpad *': 106,
    'numpad +': 107,
    'numpad -': 109,
    'numpad .': 110,
    'numpad /': 111,
    'num lock': 144,
    'scroll lock': 145,
    'my computer': 182,
    'my calculator': 183,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 222
  };

  /*!
   * Programatically add the following
   */

  // lower case chars a-z
  for (var i = 97; i < 123; i++) {
    codes[String.fromCharCode(i)] = i - 32;
  }

  // numbers 0-9
  for (var i = 48; i < 58; i++) {
    codes[i - 48] = i;
  }

  // function keys f1-f12
  for (var i = 1; i < 13; i++) {
    codes['f'+i] = i + 111;
  }

  // numpad keys
  for (var i = 0; i < 10; i++) {
    codes['numpad '+i] = i + 96;
  }

  // Helper aliases


  return keyboard.codes = codes;
});
define('skylark-devices-keyboard/names',[
	"./keyboard",
	"./codes"
],function(keyboard,codes){

  /**
   * Get by code
   *
   *   exports.name[13] // => 'Enter'
   */

  var names = {} ;

  // Create reverse mapping
  for (var i in codes) {
  	names[codes[i]] = i;
  }

  return keyboard.names = names;
});
define('skylark-devices-keyboard/aliases',[
	"./keyboard",
	"./codes",
    "./names"
],function(keyboard,codes){

  var aliases =  {
    'windows': 91,
    '⇧': 16,
    '⌥': 18,
    '⌃': 17,
    '⌘': 91,
    'ctl': 17,
    'control': 17,
    'option': 18,
    'pause': 19,
    'break': 19,
    'caps': 20,
    'return': 13,
    'escape': 27,
    'spc': 32,
    'spacebar': 32,
    'pgup': 33,
    'pgdn': 34,
    'ins': 45,
    'del': 46,
    'cmd': 91
  }

  return keyboard.aliases = aliases;
});
define('skylark-devices-keyboard/isEventKey',[
  "skylark-langx-types",
  "./keyboard",
  "./aliases",
  "./codes",
  "./names"
],function(types,keyboard,aliases,codes,names){

  /**
   * Compares a keyboard event with a given keyCode or keyName.
   *
   * @param {Event} event Keyboard event that should be tested
   * @param {Mixed} keyCode {Number} or keyName {String}
   * @return {Boolean}
   * @api public
   */
   function isEventKey(event, nameOrCode) {
      var keyCode = event.which || event.keyCode || event.charCode;
      if (keyCode === null || keyCode === undefined) { 
        return false; 
      }

      if (types.isString(nameOrCode)) {
        // check codes
        var foundNamedKey = codes[nameOrCode.toLowerCase()]
        if (foundNamedKey) { return foundNamedKey === keyCode; }
      
        // check aliases
        var foundNamedKey = aliases[nameOrCode.toLowerCase()]
        if (foundNamedKey) { return foundNamedKey === keyCode; }
      } else if (types.isNumber(nameOrCode)) {
        return nameOrCode === keyCode;
      }
      return false;
  }

  return keyboard.isEventKey = isEventKey;

});

define('skylark-devices-keyboard/main',[
	"./keyboard",
	"./KeyState",
	"./keys",
	"./Monitor",
	"./aliases",
	"./codes",
	"./isEventKey",
	"./names"
],function(keyboard){
	return keyboard;
});
define('skylark-devices-keyboard', ['skylark-devices-keyboard/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-devices-keyboard.js.map
