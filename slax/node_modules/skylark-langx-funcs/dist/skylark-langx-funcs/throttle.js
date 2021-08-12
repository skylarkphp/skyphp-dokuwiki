/**
 * skylark-langx-funcs - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./funcs"],function(n){return n.throttle=function(n,o){let e=window.performance.now();return function(...t){const r=window.performance.now();r-e>=o&&(n(...t),e=r)}}});
//# sourceMappingURL=sourcemaps/throttle.js.map
