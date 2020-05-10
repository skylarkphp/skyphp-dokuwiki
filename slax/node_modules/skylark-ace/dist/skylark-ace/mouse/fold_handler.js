/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/dom");exports.FoldHandler=function(o){o.on("click",function(t){var n=t.getDocumentPosition(),r=o.session,s=r.getFoldAt(n.row,n.column,1);s&&(t.getAccelKey()?r.removeFold(s):r.expandFold(s),t.stop());var i=t.domEvent&&t.domEvent.target;i&&e.hasCssClass(i,"ace_inline_button")&&e.hasCssClass(i,"ace_toggle_wrap")&&(r.setOption("wrap",!0),o.renderer.scrollCursorIntoView())}),o.on("gutterclick",function(e){if("foldWidgets"==o.renderer.$gutterLayer.getRegion(e)){var t=e.getDocumentPosition().row,n=o.session;n.foldWidgets&&n.foldWidgets[t]&&o.session.onFoldWidgetClick(t,e),o.isFocused()||o.focus(),e.stop()}}),o.on("gutterdblclick",function(e){if("foldWidgets"==o.renderer.$gutterLayer.getRegion(e)){var t=e.getDocumentPosition().row,n=o.session,r=n.getParentFoldRangeData(t,!0),s=r.range||r.firstRange;if(s){t=s.start.row;var i=n.getFoldAt(t,n.getLine(t).length,1);i?n.removeFold(i):(n.addFold("...",s),o.renderer.scrollCursorIntoView({row:s.start.row,column:0}))}e.stop()}})}});
//# sourceMappingURL=../sourcemaps/mouse/fold_handler.js.map
