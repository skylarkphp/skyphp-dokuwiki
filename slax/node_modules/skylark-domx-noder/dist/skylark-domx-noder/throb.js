/**
 * skylark-domx-noder - The skylark html node library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./noder"],function(e,t,n){return n.throb=function(e,l){(l=l||{}).text,l.style;var a,r=l.time,o=l.callback,s=n.createElement("div",{className:l.className||"throbber"}),c=function(){a&&(clearTimeout(a),a=null),s&&(n.remove(s),s=null)};l.style&&t.css(s,l.style);var u=l.content||'<span class="throb"></span>';return n.html(s,u),e.appendChild(s),r&&(a=setTimeout(function(){c(),o&&o()},r)),{throbber:s,remove:c,update:function(e){e&&e.text&&s&&(textNode.nodeValue=e.text)}}}});
//# sourceMappingURL=sourcemaps/throb.js.map
