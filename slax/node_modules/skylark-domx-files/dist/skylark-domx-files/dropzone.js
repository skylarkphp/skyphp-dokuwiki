/**
 * skylark-domx-files - The filer features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","skylark-langx/Deferred","skylark-domx-styler","skylark-domx-eventer","./files","skylark-storages-diskfs/webentry"],function(e,r,a,n,s,t){return s.dropzone=function(r,s){var d=(s=s||{}).hoverClass||"dropzone",f=s.dropped,o=0;return n.on(r,"dragenter",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&(n.stop(e),o++,a.addClass(r,d))}),n.on(r,"dragover",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&n.stop(e)}),n.on(r,"dragleave",function(e){e.dataTransfer&&e.dataTransfer.types.indexOf("Files")>-1&&0==--o&&a.removeClass(r,d)}),n.on(r,"drop",function(s){if(s.dataTransfer&&s.dataTransfer.types.indexOf("Files")>-1&&(a.removeClass(r,d),n.stop(s),f)){var o=s.dataTransfer.items;o&&o.length&&(o[0].webkitGetAsEntry||o[0].getAsEntry)?t.all(e.map(o,function(e){return e.webkitGetAsEntry?e.webkitGetAsEntry():e.getAsEntry()})).then(f):f(s.dataTransfer.files)}}),this}});
//# sourceMappingURL=sourcemaps/dropzone.js.map
