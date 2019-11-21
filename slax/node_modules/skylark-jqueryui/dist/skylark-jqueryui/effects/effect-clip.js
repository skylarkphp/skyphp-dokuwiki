/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(t){return t.effects.define("clip","hide",function(e,i){var o,r={},c=t(this),l=e.direction||"vertical",n="both"===l,f=n||"horizontal"===l,a=n||"vertical"===l;o=c.cssClip(),r.clip={top:a?(o.bottom-o.top)/2:o.top,right:f?(o.right-o.left)/2:o.right,bottom:a?(o.bottom-o.top)/2:o.bottom,left:f?(o.right-o.left)/2:o.left},t.effects.createPlaceholder(c),"show"===e.mode&&(c.cssClip(r.clip),r.clip=o),c.animate(r,{queue:!1,duration:e.duration,easing:e.easing,complete:i})})});
//# sourceMappingURL=../sourcemaps/effects/effect-clip.js.map
