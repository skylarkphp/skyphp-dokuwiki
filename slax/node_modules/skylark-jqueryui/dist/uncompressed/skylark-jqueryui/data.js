define([ 
	"skylark-jquery", 
	"./version"
], function( $ ) {
	/*
	return $.extend( $.expr.pseudos, {
	//	data: $.expr.createPseudo ?
	//		$.expr.createPseudo( function( dataName ) {
	//			return function( elem ) {
	//				return !!$.data( elem, dataName );
	//			};
	//		} ) :
	//
	//		// Support: jQuery <1.8
	//		function( elem, i, match ) {
	//			return !!$.data( elem, match[ 3 ] );
	//		}
		data : function( elem, i, match,dataName ) {
			return !!$.data( elem, dataName || match[3]);
		}
	});
	*/
	// use skylark-utils-dom
	return $.expr.pseudos;	
});
