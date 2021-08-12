define([
	"./mimes",
	"./types"
],function(mimes,types) { 
	function getMimeType(ext,category) {
		for (var t in types) {
			if (types[t] === ext && (!category || t.startsWith(category))) {
				return t;
			}
		}
	}	

	return mimes.getMimeType = getMimeType;
});