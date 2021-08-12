/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./transit"],function(n,t,i,a){return i.fade=function(t,i,r,s){return n.isFunction(r)&&(s=r,r={}),a(t,{opacity:i},(r=r||{}).duration,r.easing,s),this}});
//# sourceMappingURL=sourcemaps/fade.js.map
