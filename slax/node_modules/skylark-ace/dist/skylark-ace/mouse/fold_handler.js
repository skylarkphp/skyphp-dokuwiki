/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,o,t){"use strict";var n=e("../lib/dom");o.FoldHandler=function(e){e.on("click",function(o){var t=o.getDocumentPosition(),r=e.session,s=r.getFoldAt(t.row,t.column,1);s&&(o.getAccelKey()?r.removeFold(s):r.expandFold(s),o.stop());var i=o.domEvent&&o.domEvent.target;i&&n.hasCssClass(i,"ace_inline_button")&&n.hasCssClass(i,"ace_toggle_wrap")&&(r.setOption("wrap",!0),e.renderer.scrollCursorIntoView())}),e.on("gutterclick",function(o){if("foldWidgets"==e.renderer.$gutterLayer.getRegion(o)){var t=o.getDocumentPosition().row,n=e.session;n.foldWidgets&&n.foldWidgets[t]&&e.session.onFoldWidgetClick(t,o),e.isFocused()||e.focus(),o.stop()}}),e.on("gutterdblclick",function(o){if("foldWidgets"==e.renderer.$gutterLayer.getRegion(o)){var t=o.getDocumentPosition().row,n=e.session,r=n.getParentFoldRangeData(t,!0),s=r.range||r.firstRange;if(s){t=s.start.row;var i=n.getFoldAt(t,n.getLine(t).length,1);i?n.removeFold(i):(n.addFold("...",s),e.renderer.scrollCursorIntoView({row:s.start.row,column:0}))}o.stop()}})}});
//# sourceMappingURL=../sourcemaps/mouse/fold_handler.js.map
