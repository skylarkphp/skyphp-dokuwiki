/**
 * skylark-io-mimes - The skylark mime type utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./mimes","./types"],function(e,t){return e.getMimeType=function(e,i){for(var n in t)if(t[n]===e&&(!i||n.startsWith(i)))return n}});
//# sourceMappingURL=sourcemaps/getMimeType.js.map
