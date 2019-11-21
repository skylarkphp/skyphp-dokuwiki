/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("ace/lib/dom"),a=t("ace/lib/lang"),o=function(t,e){this.element=i.createElement("div"),this.element.className="ace_status-indicator",this.element.style.cssText="display: inline-block;",e.appendChild(this.element);var n=a.delayedCall(function(){this.updateStatus(t)}.bind(this)).schedule.bind(null,100);t.on("changeStatus",n),t.on("changeSelection",n),t.on("keyboardActivity",n)};(function(){this.updateStatus=function(t){var e=[];function n(t,n){t&&e.push(t,n||"|")}n(t.keyBinding.getStatusText(t)),t.commands.recording&&n("REC");var i=t.selection,a=i.lead;if(!i.isEmpty()){var o=t.getSelectionRange();n("("+(o.end.row-o.start.row)+":"+(o.end.column-o.start.column)+")"," ")}n(a.row+":"+a.column," "),i.rangeCount&&n("["+i.rangeCount+"]"," "),e.pop(),this.element.textContent=e.join("")}}).call(o.prototype),e.StatusBar=o});
//# sourceMappingURL=../sourcemaps/ext/statusbar.js.map
