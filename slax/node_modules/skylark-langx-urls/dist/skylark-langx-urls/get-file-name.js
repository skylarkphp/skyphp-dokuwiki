/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(n){"use strict";return n.getFileName=function(n){const e=n.indexOf("#"),t=n.indexOf("?"),i=Math.min(e>0?e:n.length,t>0?t:n.length);return n.substring(n.lastIndexOf("/",i)+1,i)}});
//# sourceMappingURL=sourcemaps/get-file-name.js.map
