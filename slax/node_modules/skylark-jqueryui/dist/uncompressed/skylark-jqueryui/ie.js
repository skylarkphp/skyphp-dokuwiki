define( [ "skylark-jquery", "./version" ], function( $ ) {
	// This file is deprecated
	return $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );
});
