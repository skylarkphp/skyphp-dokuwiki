/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("fold","hide",function(i,n){var t=e(this),s=i.mode,c="show"===s,r="hide"===s,o=i.size||15,f=/([0-9]+)%/.exec(o),l=!!i.horizFirst?["right","bottom"]:["bottom","right"],u=i.duration/2,p=e.effects.createPlaceholder(t),a=t.cssClip(),h={clip:e.extend({},a)},d={clip:e.extend({},a)},g=[a[l[0]],a[l[1]]];t.queue().length;f&&(o=parseInt(f[1],10)/100*g[r?0:1]),h.clip[l[0]]=o,d.clip[l[0]]=o,d.clip[l[1]]=0,c&&(t.cssClip(d.clip),p&&p.css(e.effects.clipToBox(d)),d.clip=a);var x=e.skylark.langx.Deferred,v=[];function m(e,i,n,t){return function(){var s=new x;return e.animate(i,n,t,function(){s.resolve()}),s.promise}}p&&(v.push(m(p,e.effects.clipToBox(h),u,i.easing)),v.push(m(p,e.effects.clipToBox(d),u,i.easing))),v.push(m(t,h,u,i.easing)),v.push(m(t,d,u,i.easing)),v.push(n),v.reduce(function(e,i,n,t){return e.then(i)},x.resolve())})});
//# sourceMappingURL=../sourcemaps/effects/effect-fold.js.map
