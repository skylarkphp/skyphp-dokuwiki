/**
 * skylark-domx-noder - The skylark html node library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-styler","./noder"],function(e,t){return t.overlay=function(n,i){var o=t.createElement("div",i);return e.css(o,{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:2147483647,opacity:.7}),n.appendChild(o),o}});
//# sourceMappingURL=sourcemaps/overlay.js.map
