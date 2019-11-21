/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("pulsate","show",function(n,i){var r=e(this),s=n.mode,t="show"===s,o=t||"hide"===s,u=2*(n.times||5)+(o?1:0),a=n.duration/u,f=0,c=1;r.queue().length;!t&&r.is(":visible")||(r.css("opacity",0).show(),f=1);var h=e.skylark.langx.Deferred,l=[];function p(e,n,i,r){return function(){var s=new h;return e.animate(n,i,r,function(){s.resolve()}),s.promise}}for(;c<u;c++)l.push(p(r,{opacity:f},a,n.easing)),f=1-f;l.push(p(r,{opacity:f},a,n.easing)),l.push(i),l.reduce(function(e,n,i,r){return e.then(n)},h.resolve())})});
//# sourceMappingURL=../sourcemaps/effects/effect-pulsate.js.map
