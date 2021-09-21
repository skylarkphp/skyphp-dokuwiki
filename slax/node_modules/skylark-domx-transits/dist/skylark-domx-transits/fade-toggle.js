/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./fade-in","./fade-out"],function(n,e,i,t,a){return i.fadeToggle=function(n,i,r,s){return e.isInvisible(n)?t(n,i,r,s):a(n,i,r,s),this}});
//# sourceMappingURL=sourcemaps/fade-toggle.js.map
