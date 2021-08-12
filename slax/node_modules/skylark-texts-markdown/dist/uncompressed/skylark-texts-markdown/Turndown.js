define([
	"skylark-langx/langx",
    "./markdown",
    "./primitives/turndown"
], function(langx,markdown, TurndownService) {

   return markdown.Turndown =  TurndownService;
});