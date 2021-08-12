/**
 * skylark-domx-images - The skylark image library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-noder","skylark-domx-geom","skylark-domx-styler","skylark-domx-transforms","./images"],function(o,i,e,t,n,r){return r.viewer=function(r,s){var l,a={},d=e.clientSize(r),f=s.loaded;function c(){t.css(l,{top:(d.height-l.offsetHeight)/2+"px",left:(d.width-l.offsetWidth)/2+"px"}),n.reset(l),t.css(l,{visibility:"visible"}),f&&f()}function u(){}function h(o){l.style.visibility="hidden",l.src=o}s.failered,"relative"!=(a=t.css(r,["position","overflow"])).position&&"absolute"!=a.position&&t.css(r,"position","relative"),t.css(r,"overflow","hidden"),l=new Image,t.css(l,{position:"absolute",border:0,padding:0,margin:0,width:"auto",height:"auto",visibility:"hidden"}),l.onload=c,l.onerror=u,i.append(r,l),s.url&&h(s.url);var m={load:h,dispose:function(){i.remove(l),t.css(r,a),l=l.onload=l.onerror=null}};return["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout","reset"].forEach(function(i){m[i]=function(){var e=o.makeArray(arguments);e.unshift(l),n[i].apply(null,e)}}),m}});
//# sourceMappingURL=sourcemaps/viewer.js.map
