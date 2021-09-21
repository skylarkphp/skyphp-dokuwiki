/**
 * skylark-domx-browser - The skylark browser library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../browser"],function(e){const l={prefixed:!0},n=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror","fullscreen"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror","-webkit-full-screen"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror","-moz-full-screen"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError","-ms-fullscreen"]],r=n[0];let u;for(let e=0;e<n.length;e++)if(n[e][1]in document){u=n[e];break}if(u){for(let e=0;e<u.length;e++)l[r[e]]=u[e];l.prefixed=u[0]!==r[0],e.requestFullscreen=function(){return document.body[l.requestFullscreen].apply(this,arguments)},e.exitFullscreen=function(){return document[l.exitFullscreen].apply(this,arguments)},e.support.fullscreen=l}else e.support.fullscreen=null;return e.support.fullscreen});
//# sourceMappingURL=../sourcemaps/support/fullscreen.js.map
