/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("slide","show",function(t,i){var o,s,c=e(this),l={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},n=t.mode,p=t.direction||"left",f="up"===p||"down"===p?"top":"left",r="up"===p||"left"===p,u=t.distance||c["top"===f?"outerHeight":"outerWidth"](!0),d={};e.effects.createPlaceholder(c),o=c.cssClip(),s=c.position()[f],d[f]=(r?-1:1)*u+s,d.clip=c.cssClip(),d.clip[l[p][1]]=d.clip[l[p][0]],"show"===n&&(c.cssClip(d.clip),c.css(f,d[f]),d.clip=o,d[f]=s),c.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:i})})});
//# sourceMappingURL=../sourcemaps/effects/effect-slide.js.map
