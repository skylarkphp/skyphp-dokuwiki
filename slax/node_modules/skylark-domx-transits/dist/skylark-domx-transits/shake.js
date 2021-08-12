/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-geom","skylark-domx-styler","./transits","./transit"],function(n,t,e,s,r){return s.shake=function(e,s,u){var i=1,a=s.direction||"left",o=s.distance||20,f=s.times||3,c=2*f+1,l=Math.round(s.duration/c),d="up"===a||"down"===a?"top":"left",h="up"===a||"left"===a,p={},g={},k={},m={},v=n.Deferred;function x(n,t,e,s){return function(){var u=new v;return r(n,t,e,s,function(){u.resolve()}),u.promise}}for(start=t.relativePosition(e)[d],funcs=[],p[d]=start,g[d]=start+(h?-1:1)*o,k[d]=g[d]+(h?1:-1)*o*2,m[d]=k[d]+(h?-1:1)*o*2,funcs.push(x(e,g,l,s.easing));i<f;i++)funcs.push(x(e,k,l,s.easing)),funcs.push(x(e,m,l,s.easing));return funcs.push(x(e,p,l/2,s.easing)),funcs.push(u),funcs.reduce(function(n,t,e,s){return n.then(t)},v.resolve()),this}});
//# sourceMappingURL=sourcemaps/shake.js.map
