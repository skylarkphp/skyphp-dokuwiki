/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(t){"use strict";return t.parseUrl=function(t){const o=["protocol","hostname","port","pathname","search","hash","host"];let e=document.createElement("a");e.href=t;const r=""===e.host&&"file:"!==e.protocol;let n;r&&((n=document.createElement("div")).innerHTML=`<a href="${t}"></a>`,e=n.firstChild,n.setAttribute("style","display:none; position:absolute;"),document.body.appendChild(n));const l={};for(let t=0;t<o.length;t++)l[o[t]]=e[o[t]];return"http:"===l.protocol&&(l.host=l.host.replace(/:80$/,"")),"https:"===l.protocol&&(l.host=l.host.replace(/:443$/,"")),l.protocol||(l.protocol=window.location.protocol),r&&document.body.removeChild(n),l}});
//# sourceMappingURL=sourcemaps/parse-url.js.map
