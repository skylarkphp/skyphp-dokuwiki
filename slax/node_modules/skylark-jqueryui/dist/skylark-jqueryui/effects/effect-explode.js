/**
 * skylark-jqueryui - A version of backbone that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui/
 * @license MIT
 */
define(["skylark-jquery","../version","../effect"],function(e){return e.effects.define("explode","hide",function(i,t){var o,s,n,d,f,l,a=i.pieces?Math.round(Math.sqrt(i.pieces)):3,h=a,c=e(this),p="show"===i.mode,r=c.show().css("visibility","hidden").offset(),u=Math.ceil(c.outerWidth()/h),v=Math.ceil(c.outerHeight()/a),b=[];function y(){b.push(this),b.length===a*h&&(c.css({visibility:"visible"}),e(b).remove(),t())}for(o=0;o<a;o++)for(d=r.top+o*v,l=o-(a-1)/2,s=0;s<h;s++)n=r.left+s*u,f=s-(h-1)/2,c.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-s*u,top:-o*v}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:u,height:v,left:n+(p?f*u:0),top:d+(p?l*v:0),opacity:p?0:1}).animate({left:n+(p?0:f*u),top:d+(p?0:l*v),opacity:p?1:0},i.duration||500,i.easing,y)})});
//# sourceMappingURL=../sourcemaps/effects/effect-explode.js.map
