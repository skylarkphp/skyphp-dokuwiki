/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-styler","skylark-domx-geom","skylark-domx-noder","skylark-domx-query","./transits","./transit","./show","./hide"],function(i,e,t,s,o,a,l,n,r){return a.explode=function(i,s,a){e.show(i),e.css(i,"visibility","hidden");var l,n,r,d,h,p=s.pieces?Math.round(Math.sqrt(s.pieces)):3,c=p,f="show"===s.mode,y=t.pagePosition(i),u=t.marginSize(i),v=Math.ceil(u.width/c),k=Math.ceil(u.height/p),g=[];function x(){g.push(this),g.length===p*c&&(e.css(i,{visibility:"visible"}),o(g).remove(),a())}for(var b=0;b<p;b++)for(r=y.top+b*k,h=b-(p-1)/2,l=0;l<c;l++)n=y.left+l*v,d=l-(c-1)/2,o(i).clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-l*v,top:-b*k}).parent().addClass(s.explodeClass||"ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:k,left:n+(f?d*v:0),top:r+(f?h*k:0),opacity:f?0:1}).transit({left:n+(f?0:d*v),top:r+(f?0:h*k),opacity:f?1:0},s.duration||500,s.easing,x);return this}});
//# sourceMappingURL=sourcemaps/explode.js.map
