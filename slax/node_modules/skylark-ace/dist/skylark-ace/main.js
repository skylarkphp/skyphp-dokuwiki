/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,n,r){"use strict";e("./lib/fixoldbrowsers");var t=e("./lib/dom"),i=e("./lib/event"),o=e("./range").Range,d=e("./editor").Editor,a=e("./edit_session").EditSession,s=e("./undomanager").UndoManager,l=e("./virtual_renderer").VirtualRenderer;e("./worker/worker_client"),e("./keyboard/hash_handler"),e("./placeholder"),e("./multi_select"),e("./mode/folding/fold_mode"),e("./theme/textmate"),e("./ext/error_marker"),n.config=e("./config"),n.require=e,"function"==typeof define&&(n.define=define),n.edit=function(e,r){if("string"==typeof e){var o=e;if(!(e=document.getElementById(o)))throw new Error("ace.edit can't find div #"+o)}if(e&&e.env&&e.env.editor instanceof d)return e.env.editor;var a="";if(e&&/input|textarea/i.test(e.tagName)){var s=e;a=s.value,e=t.createElement("pre"),s.parentNode.replaceChild(e,s)}else e&&(a=e.textContent,e.innerHTML="");var c=n.createEditSession(a),f=new d(new l(e),c,r),u={document:c,editor:f,onResize:f.resize.bind(f,null)};return s&&(u.textarea=s),i.addListener(window,"resize",u.onResize),f.on("destroy",function(){i.removeListener(window,"resize",u.onResize),u.editor.container.env=null}),f.container.env=f.env=u,f},n.createEditSession=function(e,n){var r=new a(e,n);return r.setUndoManager(new s),r},n.Range=o,n.Editor=d,n.EditSession=a,n.UndoManager=s,n.VirtualRenderer=l,n.version="1.4.3"});
//# sourceMappingURL=sourcemaps/main.js.map
