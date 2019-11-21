/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("highlight","show",function(o,n){var r=e(this),a={backgroundColor:r.css("backgroundColor")};"hide"===o.mode&&(a.opacity=0),e.effects.saveStyle(r),r.css({backgroundImage:"none",backgroundColor:o.color||"#ffff99"}).animate(a,{queue:!1,duration:o.duration,easing:o.easing,complete:n})})});
//# sourceMappingURL=../sourcemaps/effects/effect-highlight.js.map
