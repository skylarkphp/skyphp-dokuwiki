/*!
 * jQuery UI Tabbable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :tabbable Selector
//>>group: Core
//>>description: Selects elements which can be tabbed to.
//>>docs: http://api.jqueryui.com/tabbable-selector/

define([ 
	"skylark-jquery", 
	"./version", 
	"./focusable" 
], function( $ ) {
	//use skylark-utils-dom
	return $.expr.pseudos;

});
