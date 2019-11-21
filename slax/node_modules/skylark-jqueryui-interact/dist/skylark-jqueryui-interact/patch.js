/**
 * skylark-jqueryui-interact - A version of jqueryui interact that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-jqueryui-interact/
 * @license MIT
 */
define([],function(){return{add:function(e,n,t){var p,o=e.prototype;for(p in t)o.patches[p]=o.patches[p]||[],o.patches[p].push([n,t[p]])},call:function(e,n,t,p){var o,a=e.patches[n];if(a&&(p||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(o=0;o<a.length;o++)e.options[a[o][0]]&&a[o][1].apply(e.element,t)}}});
//# sourceMappingURL=sourcemaps/patch.js.map
