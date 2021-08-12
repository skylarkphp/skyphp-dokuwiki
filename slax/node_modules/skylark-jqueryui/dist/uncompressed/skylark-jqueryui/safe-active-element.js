define([ 
	"skylark-jquery", 
	"skylark-domx-noder",
	"./version" 
],  function($, noder) {
	return $.ui.safeActiveElement = noder.active;
});
