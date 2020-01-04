define([
    "./html",
    "./primitives/beautify-html"
], function(html, beautifyHtml) {

	return html.beautify = beautifyHtml.html_beautify;
});