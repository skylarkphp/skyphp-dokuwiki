/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-geom","skylark-domx-styler","./transits","./transit"],function(e,t,n,r,i){return r.bounce=function(r,s,o){var u,a,c,p,h=s.mode,d="hide"===h,f="show"===h,l=s.direction||"up",y=s.distance,k=s.times||5,m=2*k+(f||d?1:0),v=s.duration/m,g=s.easing,w="up"===l||"down"===l?"top":"left",x="up"===l||"left"===l,b=0,z=e.Deferred,D=[];if(c=n.css(r,w),!y){var M=t.size(r);y=("top"===w?M.height:M.width)/3}function P(e,t,n,r){return function(){var s=new z;return i(e,t,n,r,function(){s.resolve()}),s.promise}}for(p=t.relativePosition(r)[w],f&&((a={opacity:1})[w]=c,n.css(r,"opacity",0),n.css(r,w,p+(x?2*-y:2*y)),D.push(P(r,a,v,g))),d&&(y/=Math.pow(2,k-1)),(a={})[w]=c;b<k;b++)(u={})[w]=p+(x?-y:y),D.push(P(r,u,v,g)),D.push(P(r,a,v,g)),y=d?2*y:y/2;return d&&((u={opacity:0})[w]=p+(x?-1*y:y),D.push(P(r,u,v,g))),D.push(o),D.reduce(function(e,t,n,r){return e.then(t)},z.resolve()),this}});
//# sourceMappingURL=sourcemaps/bounce.js.map
