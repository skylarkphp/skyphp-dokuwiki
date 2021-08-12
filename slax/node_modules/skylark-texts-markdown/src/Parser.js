define([
	"skylark-langx/langx",
    "./markdown",
    "./primitives/marked"
], function(langx,markdown, marked) {
	var Parser = marked.Parser;

   langx.mixin(Parser,marked);

   return Parser ;
});