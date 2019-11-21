/*!
 * jQuery UI Selectable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Selectable
//>>group: Interactions
//>>description: Allows groups of elements to be selected with the mouse.
//>>docs: http://api.jqueryui.com/selectable/
//>>demos: http://jqueryui.com/selectable/
//>>css.structure: ../../themes/base/selectable.css

define( [
	"skylark-jquery",
	"skylark-jqueryui-interact/Selectable",
	"../version"
],function( $,Selectable ) {

	return $.ui.selectable = Selectable;
});
