/*!
 * jQuery UI Scroll Parent @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: scrollParent
//>>group: Core
//>>description: Get the closest ancestor element that is scrollable.
//>>docs: http://api.jqueryui.com/scrollParent/

define([ 
	"skylark-jquery", 
	"./version" 
], function( $ ) {
	// use skylark-utils-dom/query
	return $.fn.scrollParent ;

});
