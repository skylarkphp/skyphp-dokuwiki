/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects"],function(e){return e.includes=function(e,n,i,t){e=isArrayLike(e)?e:values(e),i=i&&!t?toInteger(i):0;var r=e.length;return i<0&&(i=nativeMax(r+i,0)),isString(e)?i<=r&&e.indexOf(n,i)>-1:!!r&&baseIndexOf(e,n,i)>-1}});
//# sourceMappingURL=sourcemaps/includes.js.map
