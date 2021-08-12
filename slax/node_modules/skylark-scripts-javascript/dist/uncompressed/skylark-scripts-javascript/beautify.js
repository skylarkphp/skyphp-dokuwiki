define([
    "./js",
    "./primitives/beautify-js"
], function(js, beautifyJs) {

	return js.beautify = beautifyJs.js_beautify;
});