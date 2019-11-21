/**
 * skylark-domx-eventer - The skylark eventer library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./eventer","skylark-domx-velm","skylark-domx-query"],function(e,n,r,o){r.delegate(["off","on","one","shortcuts","trigger"],n);return["keyUp","keyDown","mouseOver","mouseOut","click","dblClick","change"].forEach(function(e){var n=e;r.VisualElement.prototype[n]=function(n){return this.on(e.toLowerCase(),n),this}}),o.fn.on=o.wraps.wrapper_every_act(n.on,n),o.fn.off=o.wraps.wrapper_every_act(n.off,n),o.fn.trigger=o.wraps.wrapper_every_act(n.trigger,n),"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error transitionEnd".split(" ").forEach(function(e){o.fn[e]=function(n,r){return 0 in arguments?this.on(e,n,r):this.trigger(e)}}),o.fn.one=function(n,r,o,t){return e.isString(r)||e.isFunction(t)||(t=o,o=r,r=null),e.isFunction(o)&&(t=o,o=null),this.on(n,r,o,t,1)},o.ready=n.ready,n});
//# sourceMappingURL=sourcemaps/main.js.map
