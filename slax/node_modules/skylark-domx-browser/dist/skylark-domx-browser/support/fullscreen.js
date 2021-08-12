/**
 * skylark-domx-browser - The skylark browser library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../browser"],function(e){const l={prefixed:!0},r=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror","fullscreen"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror","-webkit-full-screen"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror","-moz-full-screen"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError","-ms-fullscreen"]],n=r[0];let u;for(let e=0;e<r.length;e++)if(r[e][1]in document){u=r[e];break}if(u){for(let e=0;e<u.length;e++)l[n[e]]=u[e];l.prefixed=u[0]!==n[0],e.requestFullscreen=document.body[l.requestFullscreen],e.exitFullscreen=document[l.exitFullscreen],e.support.fullscreen=l}else e.support.fullscreen=null;return e.support.fullscreen});
//# sourceMappingURL=../sourcemaps/support/fullscreen.js.map
