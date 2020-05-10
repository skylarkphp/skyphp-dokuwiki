/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var i=require("ace/editor").Editor;function e(i){var e=i.editor;if(i.getAccelKey()){e=i.editor;var o=i.getDocumentPosition(),n=e.session.getTokenAt(o.row,o.column);exports.previousLinkingHover&&exports.previousLinkingHover!=n&&e._emit("linkHoverOut"),e._emit("linkHover",{position:o,token:n}),exports.previousLinkingHover=n}else exports.previousLinkingHover&&(e._emit("linkHoverOut"),exports.previousLinkingHover=!1)}function o(i){var e=i.getAccelKey();if(0==i.getButton()&&e){var o=i.editor,n=i.getDocumentPosition(),t=o.session.getTokenAt(n.row,n.column);o._emit("linkClick",{position:n,token:t})}}require("../config").defineOptions(i.prototype,"editor",{enableLinking:{set:function(i){i?(this.on("click",o),this.on("mousemove",e)):(this.off("click",o),this.off("mousemove",e))},value:!1}}),exports.previousLinkingHover=!1});
//# sourceMappingURL=../sourcemaps/ext/linking.js.map
