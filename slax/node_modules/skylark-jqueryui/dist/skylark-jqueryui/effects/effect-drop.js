/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("drop","hide",function(t,i){var o,n=e(this),r="show"===t.mode,a=t.direction||"left",c="up"===a||"down"===a?"top":"left",f="up"===a||"left"===a?-1:1,d=-1*f,s={opacity:0},u=n.position()[c];e.effects.createPlaceholder(n),o=t.distance||n["top"===c?"outerHeight":"outerWidth"](!0)/2,s[c]=u+f*o,r&&(n.css(s),s[c]=u+d*o,s.opacity=1),n.animate(s,{queue:!1,duration:t.duration,easing:t.easing,complete:i})})});
//# sourceMappingURL=../sourcemaps/effects/effect-drop.js.map
