/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(e){"use strict";return e.getQuery=function(e){for(var t={},n=e.split("&"),o=n.length,r=[],c=0;c<o;c++){r=n[c].split("=",2);try{r[0]=decodeURIComponent(r[0]),r[1]=decodeURIComponent(r[1])}catch(e){}void 0===t[r[0]]?t[r[0]]=r[1]:t[r[0]]+=","+r[1]}return t}});
//# sourceMappingURL=sourcemaps/get-query.js.map
