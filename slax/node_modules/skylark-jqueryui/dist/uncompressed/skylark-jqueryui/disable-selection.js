
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
