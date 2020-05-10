/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/dom"),t=require("../../requirejs/text!./settings_menu.css");e.importCssString(t),module.exports.overlayPage=function(t,n,i,o,d,c){i=i?"top: "+i+";":"",d=d?"bottom: "+d+";":"",o=o?"right: "+o+";":"",c=c?"left: "+c+";":"";var r=document.createElement("div"),a=document.createElement("div");function l(e){27===e.keyCode&&r.click()}r.style.cssText="margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; background-color: rgba(0, 0, 0, 0.3);",r.addEventListener("click",function(){document.removeEventListener("keydown",l),r.parentNode.removeChild(r),t.focus(),r=null}),document.addEventListener("keydown",l),a.style.cssText=i+o+d+c,a.addEventListener("click",function(e){e.stopPropagation()});var s=e.createElement("div");s.style.position="relative";var p=e.createElement("div");p.className="ace_closeButton",p.addEventListener("click",function(){r.click()}),s.appendChild(p),a.appendChild(s),a.appendChild(n),r.appendChild(a),document.body.appendChild(r),t.blur()}});
//# sourceMappingURL=../../sourcemaps/ext/menu_tools/overlay_page.js.map
