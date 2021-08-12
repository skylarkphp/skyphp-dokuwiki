/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./fadeIn","./fadeOut"],function(n,e,t,a,i){return t.fadeToggle=function(n,t,r,s){return e.isInvisible(n)?a(n,t,r,s):i(n,t,r,s),this}});
//# sourceMappingURL=sourcemaps/fadeToggle.js.map
