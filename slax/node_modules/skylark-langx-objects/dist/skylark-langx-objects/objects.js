/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-langx-types"],function(r,n){var t,e,a=Object.prototype.hasOwnProperty,i=(Array.prototype.slice,n.isBoolean,n.isFunction,n.isObject),l=n.isPlainObject,u=n.isArray;n.isArrayLike,n.isString,n.toInteger;function f(r){if(!i(r))return[];var n=[];for(var t in r)n.push(t);return n}function o(r,n){if(!u(n))return null!=r&&a.call(r,n);for(var t=n.length,e=0;e<t;e++){var i=n[e];if(null==r||!a.call(r,i))return!1;r=r[i]}return!!t}return r.attach("langx.objects",{allKeys:f,attach:r.attach,defaults:(t=f,e=!0,function(r){var n=arguments.length;if(e&&(r=Object(r)),n<2||null==r)return r;for(var a=1;a<n;a++)for(var i=arguments[a],l=t(i),u=l.length,f=0;f<u;f++){var o=l[f];e&&void 0!==r[o]||(r[o]=i[o])}return r}),has:o,isMatch:function(r,n){var t=t(n),e=t.length;if(null==r)return!e;for(var a=Object(r),i=0;i<e;i++){var l=t[i];if(n[l]!==a[l]||!(l in a))return!1}return!0},keys:function(r){if(i(r))return[];var n=[];for(var t in r)o(r,t)&&n.push(t);return n},removeItem:function(r,n){if(u(r)){var t=r.indexOf(n);-1!=t&&r.splice(t,1)}else if(l(r))for(var e in r)if(r[e]==n){delete r[e];break}return this},values:function(r){for(var n=f(r),t=n.length,e=Array(t),a=0;a<t;a++)e[a]=r[n[a]];return e}})});
//# sourceMappingURL=sourcemaps/objects.js.map
