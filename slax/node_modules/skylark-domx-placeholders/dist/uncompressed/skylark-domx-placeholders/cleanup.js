define([
	"skylark-domx-styler",
	"skylark-domx-noder",
	"skylark-domx-geom",
	"./placeholders",
	"./remove"
],function(styler,noder,geom,placeholders,removePlaceholder){
	// Removes a placeholder if it exists and restores
	// properties that were modified during placeholder creation
	function cleanup( elm ) {
		placeholders.restoreStyle(elm);
		removePlaceholder(elm );
	}

	return placeholders.cleanup = cleanup;
});