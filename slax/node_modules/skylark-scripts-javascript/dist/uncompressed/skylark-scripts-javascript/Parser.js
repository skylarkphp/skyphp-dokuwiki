define([
	"skylark-langx/langx",
    "./js",
    "./primitives/acorn"
], function(langx,js, acorn) {
	var Parser = js.Parser = acorn.Parser;

	return Parser ;
});