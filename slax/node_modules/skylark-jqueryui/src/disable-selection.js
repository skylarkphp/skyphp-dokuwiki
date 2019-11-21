/*!
 * jQuery UI Disable Selection @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: disableSelection
//>>group: Core
//>>description: Disable selection of text content within the set of matched elements.
//>>docs: http://api.jqueryui.com/disableSelection/

// This file is deprecated
define( [ "skylark-jquery", "./version" ], function( $ ) {

	
	return $.fn.extend( {
		disableSelection: ( function() {
			var eventType = "onselectstart" in document.createElement( "div" ) ?
				"selectstart" :
				"mousedown";

			return function() {
				return this.on( eventType + ".ui-disableSelection", function( event ) {
					event.preventDefault();
				} );
			};
		} )(),

		enableSelection: function() {
			return this.off( ".ui-disableSelection" );
		}
	});
	
	// use skylark-utils-dom/query
});
