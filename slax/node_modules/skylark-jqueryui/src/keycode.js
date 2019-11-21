/*!
 * jQuery UI Keycode @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/

define([ 
	"skylark-langx/objects", 
 	"skylark-domx-query", 
 	"skylark-domx-eventer", 
	"./version" 
], function( objects, $, eventer ) {
  var keyCode = $.ui.keyCode = {};
  	  
  objects.each(eventer.keys,function(name,value) {
  	keyCode[name.toUpperCase()] = value;
  });

  return keyCode;

});
