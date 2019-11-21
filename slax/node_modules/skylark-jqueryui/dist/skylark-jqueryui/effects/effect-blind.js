/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("blind","hide",function(t,i){var o={up:["bottom","top"],vertical:["bottom","top"],down:["top","bottom"],left:["right","left"],horizontal:["right","left"],right:["left","right"]},c=e(this),n=t.direction||"up",l=c.cssClip(),f={clip:e.extend({},l)},r=e.effects.createPlaceholder(c);f.clip[o[n][0]]=f.clip[o[n][1]],"show"===t.mode&&(c.cssClip(f.clip),r&&r.css(e.effects.clipToBox(f)),f.clip=l),r&&r.animate(e.effects.clipToBox(f),t.duration,t.easing),c.animate(f,{queue:!1,duration:t.duration,easing:t.easing,complete:i})})});
//# sourceMappingURL=../sourcemaps/effects/effect-blind.js.map
