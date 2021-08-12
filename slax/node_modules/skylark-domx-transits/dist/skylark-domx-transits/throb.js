/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","skylark-domx-noder","./transits","./transit"],function(t,e,n,l,r){return l.throb=function(t,l){(l=l||{}).text,l.style;var r,a=l.time,s=l.callback,o=n.createElement("div",{class:l.className||"throbber"}),c=function(){r&&(clearTimeout(r),r=null),o&&(n.remove(o),o=null)};l.style&&e.css(o,l.style);var i=l.content||'<span class="throb"></span>';return n.html(o,i),t.appendChild(o),a&&(r=setTimeout(function(){c(),s&&s()},a)),{throbber:o,remove:c,update:function(t){t&&t.text&&o&&(textNode.nodeValue=t.text)}}}});
//# sourceMappingURL=sourcemaps/throb.js.map
