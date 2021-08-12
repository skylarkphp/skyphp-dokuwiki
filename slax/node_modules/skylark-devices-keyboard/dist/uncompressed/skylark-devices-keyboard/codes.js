define([
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