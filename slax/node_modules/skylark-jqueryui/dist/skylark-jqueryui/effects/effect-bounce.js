/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("bounce",function(t,n){var o,r,i,u,s=e(this),c=t.mode,f="hide"===c,a="show"===c,p=t.direction||"up",h=t.distance,d=t.times||5,l=2*d+(a||f?1:0),v=t.duration/l,y=t.easing,g="up"===p||"down"===p?"top":"left",k="up"===p||"left"===p,m=0;s.queue().length;e.effects.createPlaceholder(s);var w=e.skylark.langx.Deferred,q=[];function b(e,t,n,o){return function(){var o=new w;return e.animate(t,n,y,function(){o.resolve()}),o.promise}}for(i=s.css(g),h||(h=s["top"===g?"outerHeight":"outerWidth"]()/3),u=s.position()[g],a&&((r={opacity:1})[g]=i,s.css("opacity",0).css(g,u+(k?2*-h:2*h)),q.push(b(s,r,v,y))),f&&(h/=Math.pow(2,d-1)),(r={})[g]=i;m<d;m++)(o={})[g]=u+(k?-h:h),q.push(b(s,o,v)),q.push(b(s,r,v)),h=f?2*h:h/2;f&&((o={opacity:0})[g]=u+(k?-1*h:h),q.push(b(s,o,v))),q.push(n),q.reduce(function(e,t,n,o){return e.then(t)},w.resolve())})});
//# sourceMappingURL=../sourcemaps/effects/effect-bounce.js.map
