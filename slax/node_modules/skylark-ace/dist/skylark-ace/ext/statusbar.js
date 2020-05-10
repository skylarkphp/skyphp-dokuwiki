/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("ace/lib/dom"),e=require("ace/lib/lang"),n=function(n,i){this.element=t.createElement("div"),this.element.className="ace_status-indicator",this.element.style.cssText="display: inline-block;",i.appendChild(this.element);var a=e.delayedCall(function(){this.updateStatus(n)}.bind(this)).schedule.bind(null,100);n.on("changeStatus",a),n.on("changeSelection",a),n.on("keyboardActivity",a)};(function(){this.updateStatus=function(t){var e=[];function n(t,n){t&&e.push(t,n||"|")}n(t.keyBinding.getStatusText(t)),t.commands.recording&&n("REC");var i=t.selection,a=i.lead;if(!i.isEmpty()){var o=t.getSelectionRange();n("("+(o.end.row-o.start.row)+":"+(o.end.column-o.start.column)+")"," ")}n(a.row+":"+a.column," "),i.rangeCount&&n("["+i.rangeCount+"]"," "),e.pop(),this.element.textContent=e.join("")}}).call(n.prototype),exports.StatusBar=n});
//# sourceMappingURL=../sourcemaps/ext/statusbar.js.map
