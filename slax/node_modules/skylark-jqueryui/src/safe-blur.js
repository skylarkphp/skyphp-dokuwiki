define([ 
	"skylark-domx-query", 
	"skylark-domx-noder", 
	"./version" 
], function( $,noder ) {
	/*
	return $.ui.safeBlur = function( element ) {

		// Support: IE9 - 10 only
		// If the <body> is blurred, IE will switch windows, see #9420
		if ( element && element.nodeName.toLowerCase() !== "body" ) {
			$( element ).trigger( "blur" );
		}
	};
	*/
	return $.ui.safeBlur = noder.blur;

});
