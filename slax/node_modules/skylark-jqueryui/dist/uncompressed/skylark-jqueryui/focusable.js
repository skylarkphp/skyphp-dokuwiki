/*!
 * jQuery UI Focusable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/

define([ 
	"skylark-domx-query", 
	"skylark-domx-noder", 
	"./version" 
], function( $,noder ) {

	return $.ui.focusable = noder.focusable;

});
