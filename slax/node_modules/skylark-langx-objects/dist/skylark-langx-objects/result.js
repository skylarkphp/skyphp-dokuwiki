/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects"],function(r,n){var l=r.isArray,t=r.isFunction;return n.result=function(r,n,i){l(n)||(n=n.split("."));var a=n.length;if(!a)return t(i)?i.call(r):i;for(var e=0;e<a;e++){var u=null==r?void 0:r[n[e]];void 0===u&&(u=i,e=a),r=t(u)?u.call(r):u}return r}});
//# sourceMappingURL=sourcemaps/result.js.map
