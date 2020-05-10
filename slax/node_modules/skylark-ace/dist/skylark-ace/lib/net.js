/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("./dom");exports.get=function(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onreadystatechange=function(){4===n.readyState&&t(n.responseText)},n.send(null)},exports.loadScript=function(t,n){var a=e.getDocumentHead(),o=document.createElement("script");o.src=t,a.appendChild(o),o.onload=o.onreadystatechange=function(e,t){!t&&o.readyState&&"loaded"!=o.readyState&&"complete"!=o.readyState||(o=o.onload=o.onreadystatechange=null,t||n())}},exports.qualifyURL=function(e){var t=document.createElement("a");return t.href=e,t.href}});
//# sourceMappingURL=../sourcemaps/lib/net.js.map
