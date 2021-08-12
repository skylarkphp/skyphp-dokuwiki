/**
 * skylark-domx-animates - The skylark animates library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser"],function(n,a,i){function o(){return o}return a.mixin(o,{off:!1,speeds:{normal:400,fast:200,slow:600},animationName:i.normalizeCssProperty("animation-name"),animationDuration:i.normalizeCssProperty("animation-duration"),animationDelay:i.normalizeCssProperty("animation-delay"),animationTiming:i.normalizeCssProperty("animation-timing-function"),animationEnd:i.normalizeCssEvent("AnimationEnd"),animateBaseClass:"animated"}),n.attach("domx.animates",o)});
//# sourceMappingURL=sourcemaps/animates.js.map
