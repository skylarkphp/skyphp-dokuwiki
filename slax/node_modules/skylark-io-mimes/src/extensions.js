define([
	"skylark-langx-types",
	"./mimes",
	"./types"
],function(ltypes,mimes,types) { 
	var extenstions = {};

	for (var type in types)  {
		var extNames = types[type];
		if (ltypes.isString(extNames)) {
			extNames = [extNames];
		}
		for (var i=0;i<extNames.length;i++) {
			var extName = extNames[i];
			
			if (!extenstions[extName]) {
				extenstions[extName] = type;
			} else if (ltypes.isString(extenstions[extName])) {
				extenstions[extName] = [extenstions[extName],type]
			} else {
				extenstions[extName].push(type);
			}
		}

	}


	return mimes.extenstions = extenstions;

});