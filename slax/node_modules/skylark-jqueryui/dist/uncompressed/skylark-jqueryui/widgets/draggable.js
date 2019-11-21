/*!
 * jQuery UI Draggable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Draggable
//>>group: Interactions
//>>description: Enables dragging functionality for any element.
//>>docs: http://api.jqueryui.com/draggable/
//>>demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css

define( [
	"skylark-jquery",
	"skylark-jqueryui-interact/Draggable",
	"../version"
],function($, Draggable ) {

	return $.ui.draggable = Draggable;

});
