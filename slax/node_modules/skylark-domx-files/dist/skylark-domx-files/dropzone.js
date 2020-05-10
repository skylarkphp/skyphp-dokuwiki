/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","skylark-langx/Deferred","skylark-domx-styler","skylark-domx-eventer","./files","skylark-io-diskfs/webentry"],function(e,r,a,n,t,s){return t.dropzone=function(r,t){var d=(t=t||{}).hoverClass||"dropzone",f=t.dropped,o=0;return n.on(r,"dragenter",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&(n.stop(e),o++,a.addClass(r,d))}),n.on(r,"dragover",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&n.stop(e)}),n.on(r,"dragleave",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&0==--o&&a.removeClass(r,d)}),n.on(r,"drop",function(t){if(t.dataTransfer&&t.dataTransfer.types.indexOf("Files")>-1&&(a.removeClass(r,d),n.stop(t),f)){var o=t.dataTransfer.items;o&&o.length&&(o[0].webkitGetAsEntry||o[0].getAsEntry)?s.all(e.map(o,function(e){return e.webkitGetAsEntry?e.webkitGetAsEntry():e.getAsEntry()})).then(f):f(t.dataTransfer.files)}}),this}});
//# sourceMappingURL=sourcemaps/dropzone.js.map
