/**
 * skylark-domx-animates - The skylark animates library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-noder","skylark-domx-geom","skylark-domx-styler","skylark-domx-eventer","./animates"],function(n,a,i,e,o,s,t){var r=t.animationName,m=t.animationDuration,l=t.animationTiming,d=t.animationDelay,k=t.animationEnd,y={};return y[r]=y[m]=y[d]=y[l]="",t.animation=function(a,i,e,d,y,c){var g={};return n.isPlainObject(e)&&(d=e.easing,y=e.complete,c=e.delay,e=e.duration),n.isString(e)&&(e=t.speeds[e]),void 0===e&&(e=t.speeds.normal),e/=1e3,n.isFunction(d)?(y=d,eace="swing"):d=d||"swing",c?c/=1e3:c=0,g[r]=i,g[m]=e+"s",g[l]=d,e>0&&s.on(a,k,y),a.clientLeft,o.css(a,g),this}});
//# sourceMappingURL=sourcemaps/animation.js.map
