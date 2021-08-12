/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","./transits","./fade"],function(n,s,a,t){return a.fadeIn=function(n,a,r){var e=s.css(n,"opacity");return e>0?s.css(n,"opacity",0):e=1,s.show(n),t(n,e,a,r),this}});
//# sourceMappingURL=sourcemaps/fadeIn.js.map
