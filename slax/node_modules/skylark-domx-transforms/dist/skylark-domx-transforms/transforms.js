/**
 * skylark-domx-transforms - The skylark transform library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser","skylark-domx-data","skylark-domx-styler"],function(a,n,t,r,o){var i=t.normalizeCssProperty("transform");function e(a,n){return a>0&&a>-n?n:a<0&&a<n?-n:0}function f(a,n){var t,r,e,f,s,c=(t=n.radian,r=n.y,e=n.x,f=Math.cos(t),s=Math.sin(t),{M11:f*r,M12:-s*e,M21:s*r,M22:f*e});o.css(a,i,"matrix("+c.M11.toFixed(16)+","+c.M21.toFixed(16)+","+c.M12.toFixed(16)+","+c.M22.toFixed(16)+", 0, 0)")}function s(a,n){if(!n)return(n=r.data(a,"transform")||{}).radian=n.radian||0,n.x=n.x||1,n.y=n.y||1,n.zoom=n.zoom||1,n;r.data(a,"transform",n)}var c={vertical:function(a){a.radian=Math.PI-a.radian,a.y*=-1},horizontal:function(a){a.radian=Math.PI-a.radian,a.x*=-1},rotate:function(a,n){a.radian=n*Math.PI/180},left:function(a){a.radian-=Math.PI/2},right:function(a){a.radian+=Math.PI/2},scale:function(a,n){var t=e(a.y,n),r=e(a.x,n);t&&r&&(a.y+=t,a.x+=r)},zoomin:function(a){c.scale(a,.1)},zoomout:function(a){c.scale(a,-.1)}};function d(){return d}return["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout"].forEach(function(a){var t;d[a]=(t=c[a],function(){var a=n.makeArray(arguments),r=a.shift(),o=s(r);a.unshift(o),t.apply(this,a),f(r,o),s(r,o)})}),n.mixin(d,{reset:function(a){var n={x:1,y:1,radian:0};f(a,n),s(a,n)}}),a.attach("domx.transforms",d)});
//# sourceMappingURL=sourcemaps/transforms.js.map
