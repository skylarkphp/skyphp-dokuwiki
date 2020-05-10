define([ 
	"skylark-domx-query", 
	"skylark-domx-noder", 
	"./version" 
], function( $,noder ) {

	return $.ui.focusable = noder.focusable;

});
