/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("fade","toggle",function(i,n){var t="show"===i.mode;e(this).css("opacity",t?0:1).animate({opacity:t?1:0},{queue:!1,duration:i.duration,easing:i.easing,complete:n})})});
//# sourceMappingURL=../sourcemaps/effects/effect-fade.js.map
