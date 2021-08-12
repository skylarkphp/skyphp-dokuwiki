define([
	"skylark-domx-noder",
	"skylark-domx-data",
	"./placeholders"
],function(noder,datax,placeholders){

	function removePlaceholder( elm ) {
		var dataKey = "placeholder",
			placeholder = datax.data(elm, dataKey );

		if ( placeholder ) {
			noder.remove(placeholder);
			datax.removeData(elm,dataKey);
		}
	}

	return placeholders.remove = removePlaceholder;
});