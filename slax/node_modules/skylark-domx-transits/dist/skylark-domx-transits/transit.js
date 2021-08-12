/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-noder","skylark-domx-geom","skylark-domx-styler","skylark-domx-eventer","./transits"],function(e,r,s,t,i,n,o){var a,l,c,p,f=r.normalizeCssEvent("TransitionEnd"),d=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,u=r.css3PropPrefix+"transform",m={};return m[a=r.normalizeCssProperty("transition-property")]=m[l=r.normalizeCssProperty("transition-duration")]=m[p=r.normalizeCssProperty("transition-delay")]=m[c=r.normalizeCssProperty("transition-timing-function")]="",o.transit=function(r,s,x,y,g,k){var h,v,P,z={},b=[],T="",w=this,C=!1,j=!1;for(h in e.isPlainObject(x)&&(y=x.easing,g=x.complete,k=x.delay,x=x.duration),e.isString(x)&&(x=o.speeds[x]),void 0===x&&(x=o.speeds.normal),x/=1e3,o.off&&(x=0),e.isFunction(y)?(g=y,eace="swing"):y=y||"swing",k?k/=1e3:k=0,s){var E=s[h];if(d.test(h))T+=h+"("+E+") ";else{if("scrollTop"===h&&(j=!0),"clip"==h&&e.isPlainObject(E)){if(z[h]="rect("+E.top+"px,"+E.right+"px,"+E.bottom+"px,"+E.left+"px)","auto"==i.css(r,"clip")){var O=t.size(r);i.css(r,"clip","rect(0px,"+O.width+"px,"+O.height+"px,0px)")}}else z[h]=E;b.push(e.dasherize(h))}}return v=f,T&&(z[u]=T,b.push(u)),x>0&&(z[a]=b.join(", "),z[l]=x+"s",z[p]=k+"s",z[c]=y),P=function(e){if(C=!0,e){if(e.target!==e.currentTarget)return;n.off(e.target,v,P)}else n.off(r,v,P);i.css(r,m),g&&g.call(this)},x>0&&(n.on(r,v,P),e.debounce(function(){C||P.call(w)},1e3*(x+k)+25)()),r.clientLeft,i.css(r,z),x<=0&&e.debounce(function(){C||P.call(w)},0)(),j&&t.scrollToTop(r,s.scrollTop,x,g),this}});
//# sourceMappingURL=sourcemaps/transit.js.map
