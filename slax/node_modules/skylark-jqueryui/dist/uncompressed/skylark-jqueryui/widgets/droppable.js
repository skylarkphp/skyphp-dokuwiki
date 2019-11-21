/*!
 * jQuery UI Droppable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Droppable
//>>group: Interactions
//>>description: Enables drop targets for draggable elements.
//>>docs: http://api.jqueryui.com/droppable/
//>>demos: http://jqueryui.com/droppable/

define( [
	"skylark-jquery",
	"skylark-jqueryui-interact/Droppable",
	"../version"
],function( $, Droppable ) {

	return $.ui.droppable = Droppable;

});
