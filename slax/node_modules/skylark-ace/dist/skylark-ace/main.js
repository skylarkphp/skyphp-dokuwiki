/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";require("./lib/fixoldbrowsers");var e=require("./lib/dom"),n=require("./lib/event"),r=require("./range").Range,t=require("./editor").Editor,i=require("./edit_session").EditSession,o=require("./undomanager").UndoManager,d=require("./virtual_renderer").VirtualRenderer;require("./worker/worker_client"),require("./keyboard/hash_handler"),require("./placeholder"),require("./multi_select"),require("./mode/folding/fold_mode"),require("./theme/textmate"),require("./ext/error_marker"),exports.config=require("./config"),exports.require=require,"function"==typeof define&&(exports.define=define),exports.edit=function(r,i){if("string"==typeof r){var o=r;if(!(r=document.getElementById(o)))throw new Error("ace.edit can't find div #"+o)}if(r&&r.env&&r.env.editor instanceof t)return r.env.editor;var a="";if(r&&/input|textarea/i.test(r.tagName)){var s=r;a=s.value,r=e.createElement("pre"),s.parentNode.replaceChild(r,s)}else r&&(a=r.textContent,r.innerHTML="");var l=exports.createEditSession(a),c=new t(new d(r),l,i),f={document:l,editor:c,onResize:c.resize.bind(c,null)};return s&&(f.textarea=s),n.addListener(window,"resize",f.onResize),c.on("destroy",function(){n.removeListener(window,"resize",f.onResize),f.editor.container.env=null}),c.container.env=c.env=f,c},exports.createEditSession=function(e,n){var r=new i(e,n);return r.setUndoManager(new o),r},exports.Range=r,exports.Editor=t,exports.EditSession=i,exports.UndoManager=o,exports.VirtualRenderer=d,exports.version="1.4.3"});
//# sourceMappingURL=sourcemaps/main.js.map
