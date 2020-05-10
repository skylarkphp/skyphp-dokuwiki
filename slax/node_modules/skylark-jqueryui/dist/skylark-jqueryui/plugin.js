/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","./version"],function(n){return n.ui.plugin={add:function(module,e,i){var p,l=n.ui[module].prototype;for(p in i)l.plugins[p]=l.plugins[p]||[],l.plugins[p].push([e,i[p]])},call:function(n,e,i,p){var l,o=n.plugins[e];if(o&&(p||n.element[0].parentNode&&11!==n.element[0].parentNode.nodeType))for(l=0;l<o.length;l++)n.options[o[l][0]]&&o[l][1].apply(n.element,i)}}});
//# sourceMappingURL=sourcemaps/plugin.js.map
