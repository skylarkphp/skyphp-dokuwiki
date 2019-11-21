/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var i=e("../../lib/dom"),o=e("../../requirejs/text!./settings_menu.css");i.importCssString(o),n.exports.overlayPage=function(e,t,n,o,d,c){n=n?"top: "+n+";":"",d=d?"bottom: "+d+";":"",o=o?"right: "+o+";":"",c=c?"left: "+c+";":"";var r=document.createElement("div"),a=document.createElement("div");function l(e){27===e.keyCode&&r.click()}r.style.cssText="margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; background-color: rgba(0, 0, 0, 0.3);",r.addEventListener("click",function(){document.removeEventListener("keydown",l),r.parentNode.removeChild(r),e.focus(),r=null}),document.addEventListener("keydown",l),a.style.cssText=n+o+d+c,a.addEventListener("click",function(e){e.stopPropagation()});var s=i.createElement("div");s.style.position="relative";var p=i.createElement("div");p.className="ace_closeButton",p.addEventListener("click",function(){r.click()}),s.appendChild(p),a.appendChild(s),a.appendChild(t),r.appendChild(a),document.body.appendChild(r),e.blur()}});
//# sourceMappingURL=../../sourcemaps/ext/menu_tools/overlay_page.js.map
