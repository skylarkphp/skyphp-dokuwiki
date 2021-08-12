/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-types","./objects"],function(t,e){var r,n,o=t.isFunction,c="undefined"!=typeof Symbol?Symbol.prototype:null;return r=function(t,e,r,o){if(t===e)return 0!==t||1/t==1/e;if(null==t||null==e)return!1;if(t!=t)return e!=e;var c=typeof t;return("function"===c||"object"===c||"object"==typeof e)&&n(t,e,r,o)},n=function(t,e,n,u){var f=toString.call(t);if(f!==toString.call(e))return!1;switch(f){case"[object RegExp]":case"[object String]":return""+t==""+e;case"[object Number]":return+t!=+t?+e!=+e:0==+t?1/+t==1/e:+t==+e;case"[object Date]":case"[object Boolean]":return+t==+e;case"[object Symbol]":return c.valueOf.call(t)===c.valueOf.call(e)}var i="[object Array]"===f;if(!i){if("object"!=typeof t||"object"!=typeof e)return!1;var l=t.constructor,a=e.constructor;if(l!==a&&!(o(l)&&l instanceof l&&o(a)&&a instanceof a)&&"constructor"in t&&"constructor"in e)return!1}n=n||[],u=u||[];for(var s=n.length;s--;)if(n[s]===t)return u[s]===e;if(n.push(t),u.push(e),i){if((s=t.length)!==e.length)return!1;for(;s--;)if(!r(t[s],e[s],n,u))return!1}else{var b,p=Object.keys(t);if(s=p.length,Object.keys(e).length!==s)return!1;for(;s--;)if(void 0===e[b=p[s]]||!r(t[b],e[b],n,u))return!1}return n.pop(),u.pop(),!0},e.isEqual=function(t,e){return r(t,e)}});
//# sourceMappingURL=sourcemaps/is-equal.js.map
