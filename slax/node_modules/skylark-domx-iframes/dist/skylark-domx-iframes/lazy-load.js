/**
 * skylark-domx-iframes - The skylark iframes library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-eventer","skylark-domx-data","skylark-domx-geom","./iframes","./load-real"],function(r,n,l,o,a){var i;function e(){i||(i=[],r.on(window,"scroll",function(){!function(){var r=0,n=[];for(r=0;r<i.length;r++)l.inview(i[r],400)&&n.unshift({iframe:i[r],i:r});for(r=n.length-1;r>=0;r--)i.splice(n[r].i,1),a(n[r].iframe)}()}))}return o.lazyLoad=function(r,l){e(),(l=l||{}).url&&n.attr(r,l.urlAttrName||"data-url",l.url),l.holdingUrl&&n.prop(r,"src",l.holdingUrl),i.push(r)}});
//# sourceMappingURL=sourcemaps/lazy-load.js.map
