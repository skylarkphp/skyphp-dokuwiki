/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var a=e("./dom");t.get=function(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onreadystatechange=function(){4===n.readyState&&t(n.responseText)},n.send(null)},t.loadScript=function(e,t){var n=a.getDocumentHead(),o=document.createElement("script");o.src=e,n.appendChild(o),o.onload=o.onreadystatechange=function(e,n){!n&&o.readyState&&"loaded"!=o.readyState&&"complete"!=o.readyState||(o=o.onload=o.onreadystatechange=null,n||t())}},t.qualifyURL=function(e){var t=document.createElement("a");return t.href=e,t.href}});
//# sourceMappingURL=../sourcemaps/lib/net.js.map
