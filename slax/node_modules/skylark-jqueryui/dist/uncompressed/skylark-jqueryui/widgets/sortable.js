/*!
 * jQuery UI Sortable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Sortable
//>>group: Interactions
//>>description: Enables items in a list to be sorted using the mouse.
//>>docs: http://api.jqueryui.com/sortable/
//>>demos: http://jqueryui.com/sortable/
//>>css.structure: ../../themes/base/sortable.css

define( [
	"skylark-jquery",
	"skylark-jqueryui-interact/Sortable",
	"../version"
],function( $,Sortable ) {

	return $.ui.sortable = Sortable;

});
