/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./show","./hide"],function(n,i,s,t,e){return s.toggle=function(n,s,r){return i.isInvisible(n)?t(n,s,r):e(n,s,r),this}});
//# sourceMappingURL=sourcemaps/toggle.js.map
