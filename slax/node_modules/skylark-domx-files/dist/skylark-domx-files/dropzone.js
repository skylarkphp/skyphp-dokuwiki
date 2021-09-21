/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","skylark-langx/deferred","skylark-domx-styler","skylark-domx-eventer","skylark-domx-velm","skylark-domx-query","skylark-io-diskfs/webentry","./files"],function(e,r,a,n,s,t,d,o){function f(r,s){var t=(s=s||{}).hoverClass||"hover",o=s.dropped,f=0;return n.on(r,"dragenter",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&(n.stop(e),f++,a.addClass(r,t))}),n.on(r,"dragover",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&n.stop(e)}),n.on(r,"dragleave",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&0==--f&&a.removeClass(r,t)}),n.on(r,"drop",function(s){if(s.dataTransfer&&s.dataTransfer.types.indexOf("Files")>-1&&(a.removeClass(r,t),n.stop(s),o)){var f=s.dataTransfer.items;f&&f.length&&(f[0].webkitGetAsEntry||f[0].getAsEntry)?d.all(e.map(f,function(e){return e.webkitGetAsEntry?e.webkitGetAsEntry():e.getAsEntry()})).then(o):o(s.dataTransfer.files)}}),this}return o.dropzone=f,s.delegate(["dropzone"],o),t.fn.dropzone=t.wraps.wrapper_every_act(o.dropzone,o),f});
//# sourceMappingURL=sourcemaps/dropzone.js.map
