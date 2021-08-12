/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects"],function(n){return n.omit=function(n,e,r){if(!n)return null;for(var t=mixin({},n),i=1;i<arguments.length;i++){var u=arguments[i];u in n&&delete t[u]}return t}});
//# sourceMappingURL=sourcemaps/omit.js.map
