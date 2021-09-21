/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(n){"use strict";return n.isSameOrigin=function(n,i){let r;try{if(!(r=new URL(n)).origin||"null"===r.origin)return!1}catch(n){return!1}const t=new URL(i,r);return r.origin===t.origin}});
//# sourceMappingURL=sourcemaps/is_same_origin.js.map
