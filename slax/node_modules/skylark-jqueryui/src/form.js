define( [ "skylark-jquery", "./version" ], function( $ ) {

	// Support: IE8 Only
	// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
	// with a string, so we need to find the proper form.
	return $.fn._form = function() {
		return typeof this[ 0 ].form === "string" ? this.closest( "form" ) : $( this[ 0 ].form );
	};

});
