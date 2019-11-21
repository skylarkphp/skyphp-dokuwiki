/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("shake",function(n,t){var s=1,r=e(this),u=n.direction||"left",f=n.distance||20,i=n.times||3,a=2*i+1,c=Math.round(n.duration/a),o="up"===u||"down"===u?"top":"left",h="up"===u||"left"===u,l={},d={},p={},g={};r.queue().length;e.effects.createPlaceholder(r);var v=e.skylark.langx.Deferred;function k(e,n,t,s){return function(){var r=new v;return e.animate(n,t,s,function(){r.resolve()}),r.promise}}for(start=r.position()[o],funcs=[],l[o]=start,d[o]=start+(h?-1:1)*f,p[o]=d[o]+(h?1:-1)*f*2,g[o]=p[o]+(h?-1:1)*f*2,funcs.push(k(r,d,c,n.easing));s<i;s++)funcs.push(k(r,p,c,n.easing)),funcs.push(k(r,g,c,n.easing));funcs.push(k(r,l,c/2,n.easing)),funcs.push(t),funcs.reduce(function(e,n,t,s){return e.then(n)},v.resolve())})});
//# sourceMappingURL=../sourcemaps/effects/effect-shake.js.map
