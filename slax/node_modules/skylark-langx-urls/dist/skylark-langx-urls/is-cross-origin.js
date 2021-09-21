/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls","./parse-url"],function(o,r){"use strict";return o.isCrossOrigin=function(o,t=window.location){const n=r(o);return(":"===n.protocol?t.protocol:n.protocol)+n.host!==t.protocol+t.host}});
//# sourceMappingURL=sourcemaps/is-cross-origin.js.map
