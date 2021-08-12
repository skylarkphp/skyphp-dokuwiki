/**
 * skylark-domx-placeholders - The skylark placeholders library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-styler","skylark-domx-noder","skylark-domx-geom","skylark-domx-data","./placeholders"],function(e,i,t,s,a){return a.create=function(a){var o,r=e.css(a,"position"),n=t.relativePosition(a);return e.css(a,e.css(a,["marginTop","marginBottom","marginLeft","marginRight"])),t.size(a,t.size(a)),/^(static|relative)/.test(r)&&(r="absolute",o=i.createElement(a.nodeName),e.css(o,{display:/^(inline|ruby)/.test(e.css(a,"display"))?"inline-block":"block",visibility:"hidden"}),e.css(o,e.css(a,["marginTop","marginBottom","marginLeft","marginRight","float"])),s.data(a,"placeholder",o),t.size(o,t.size(a)),i.after(a,o)),e.css(a,{position:r,left:n.left,top:n.top}),o}});
//# sourceMappingURL=sourcemaps/create.js.map
