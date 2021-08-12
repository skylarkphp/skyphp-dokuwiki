/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects"],function(e,n){var l=e.isPlainObject,r=e.isArray;return n.clone=function e(n,i){var s;if(void 0===n||null===n)s=n;else if(i&&n.clone)s=n.clone();else if(r(n)){s=[];for(var f=0;f<n.length;f++)s.push(e(n[f]))}else if(l(n))for(var o in s={},n)s[o]=e(n[o]);else s=n;return s}});
//# sourceMappingURL=sourcemaps/clone.js.map
