/**
 * skylark-domx-images - The skylark image library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-finder","./images","./watch"],function(e,n,r){return n.loaded=function(n,a){var i=[];function f(e){var n=/url\((['"])?(.*?)\1\)/gi.exec(styler.css(e,"background-image")),r=n&&n[2];if(r){var a=new Image;a.src=r,i.push(a)}}if(a=a||{},"IMG"==n.nodeName)i.push(n);else{for(var o=e.findAll(n,"img"),u=0;u<o.length;u++)i.push(o[u]);if(!0===a.background)f(n);else if("string"==typeof a.background){var d=e.findAll(n,a.background);for(u=0;u<d.length;u++)f(d[u])}}return r(i)}});
//# sourceMappingURL=sourcemaps/loaded.js.map
