/**
 * skylark-langx-objects - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects"],function(n){return n.pick=function(n,r,e){if(!n)return null;for(var t={},i=1;i<arguments.length;i++){var u=arguments[i];u in n&&(t[u]=n[u])}return t}});
//# sourceMappingURL=sourcemaps/pick.js.map
