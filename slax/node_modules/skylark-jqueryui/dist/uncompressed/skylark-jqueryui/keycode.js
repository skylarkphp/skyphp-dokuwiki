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
