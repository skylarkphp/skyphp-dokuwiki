/**
 * skylark-domx-transits - The skylark transits library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./transits","skylark-domx-velm","skylark-domx-query","./transit","./bounce","./emulateTransitionEnd","./explode","./fadeIn","./fadeOut","./fade","./fadeToggle","./hide","./pulsate","./shake","./show","./slide","./slideDown","./slideToggle","./slideUp","./throb","./toggle"],function(e,a,r){return a.delegate(["transit","emulateTransitionEnd","fadeIn","fadeOut","fade","fadeToggle","hide","scrollToTop","slideDown","slideToggle","slideUp","show","toggle"],e),r.fn.hide=r.wraps.wrapper_every_act(e.hide,e),r.fn.transit=r.wraps.wrapper_every_act(e.transit,e),r.fn.emulateTransitionEnd=r.wraps.wrapper_every_act(e.emulateTransitionEnd,e),r.fn.show=r.wraps.wrapper_every_act(e.show,e),r.fn.hide=r.wraps.wrapper_every_act(e.hide,e),r.fn.toogle=r.wraps.wrapper_every_act(e.toogle,e),r.fn.fadeTo=r.wraps.wrapper_every_act(e.fadeTo,e),r.fn.fadeIn=r.wraps.wrapper_every_act(e.fadeIn,e),r.fn.fadeOut=r.wraps.wrapper_every_act(e.fadeOut,e),r.fn.fadeToggle=r.wraps.wrapper_every_act(e.fadeToggle,e),r.fn.slideDown=r.wraps.wrapper_every_act(e.slideDown,e),r.fn.slideToggle=r.wraps.wrapper_every_act(e.slideToggle,e),r.fn.slideUp=r.wraps.wrapper_every_act(e.slideUp,e),e});
//# sourceMappingURL=sourcemaps/main.js.map
