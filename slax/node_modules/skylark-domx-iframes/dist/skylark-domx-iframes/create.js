/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-noder","./iframes"],function(e,n){"use strict";return n.create=function(n,r){let o={},a={};(n=n||{}).id&&(o.id=n.id),n.url&&(o.src=n.url),n.style&&(o.style=n.style),n.onload&&(o.onload=n.onload),n.onerror&&(o.onload=n.onerror),n.className&&(o.className=n.className),n.sandbox&&(a.sandbox=n.sandbox),n.frameBorder&&(a.frameBorder=n.frameBorder),n.name&&(a.name=n.name);let d=e.create("iframe",o,a,r);return n.contentWindowName&&(d.contentWindow.name=n.contentWindowName),d}});
//# sourceMappingURL=sourcemaps/create.js.map
