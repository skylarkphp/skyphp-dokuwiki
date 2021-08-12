/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-geom","skylark-domx-styler","./transits","./transit"],function(e,n,r,s,t){return s.pulsate=function(n,s,i){var o=s.mode,a="show"===o||!o,u=a||"hide"===o,c=2*(s.times||5)+(u?1:0),l=s.duration/c,f=0,d=1;(a||r.isInvisible(n))&&(r.css(n,"opacity",0),r.show(n),f=1);var h=e.Deferred,p=[];function y(e,n,r,s){return function(){var i=new h;return t(e,n,r,s,function(){i.resolve()}),i.promise}}for(;d<c;d++)p.push(y(n,{opacity:f},l,s.easing)),f=1-f;return p.push(y(n,{opacity:f},l,s.easing)),p.push(i),p.reduce(function(e,n,r,s){return e.then(n)},h.resolve()),this}});
//# sourceMappingURL=sourcemaps/pulsate.js.map
