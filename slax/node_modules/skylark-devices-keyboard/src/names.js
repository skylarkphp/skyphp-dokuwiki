define([
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