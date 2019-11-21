/*!
 * jQuery UI Mouse @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/

define( [
	"skylark-jquery",
	"skylark-jqueryui-interact/Mouse",
	"../version"
],function( $, Mouse) {
	return $.ui.mouse = Mouse;
});
