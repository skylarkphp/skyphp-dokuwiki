/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/objects","skylark-domx-eventer","skylark-domx-velm","skylark-domx-query","./files"],function(e,a,n,t,r){function s(n,t){(t=t||{}).hoverClass;var r=t.pasted;return a.on(n,"paste",function(a){var n=a.originalEvent&&a.originalEvent.clipboardData&&a.originalEvent.clipboardData.items,t=[];n&&n.length&&e.each(n,function(e,a){var n=a.getAsFile&&a.getAsFile();n&&t.push(n)}),r&&t.length&&r(t)}),this}return r.pastezone=s,n.delegate(["pastezone"],r),t.fn.pastezone=t.wraps.wrapper_every_act(r.pastezone,r),s});
//# sourceMappingURL=sourcemaps/pastezone.js.map
