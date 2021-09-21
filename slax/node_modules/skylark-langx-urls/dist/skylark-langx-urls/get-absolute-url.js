/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(t){"use strict";return t.getAbsoluteUrl=function(t){if(!t.match(/^https?:\/\//)){const e=document.createElement("div");e.innerHTML=`<a href="${t}">x</a>`,t=e.firstChild.href}return t}});
//# sourceMappingURL=sourcemaps/get-absolute-url.js.map
