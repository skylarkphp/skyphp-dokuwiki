/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,o){var n=i("ace/editor").Editor;function t(i){var o=i.editor;if(i.getAccelKey()){o=i.editor;var n=i.getDocumentPosition(),t=o.session.getTokenAt(n.row,n.column);e.previousLinkingHover&&e.previousLinkingHover!=t&&o._emit("linkHoverOut"),o._emit("linkHover",{position:n,token:t}),e.previousLinkingHover=t}else e.previousLinkingHover&&(o._emit("linkHoverOut"),e.previousLinkingHover=!1)}function r(i){var e=i.getAccelKey();if(0==i.getButton()&&e){var o=i.editor,n=i.getDocumentPosition(),t=o.session.getTokenAt(n.row,n.column);o._emit("linkClick",{position:n,token:t})}}i("../config").defineOptions(n.prototype,"editor",{enableLinking:{set:function(i){i?(this.on("click",r),this.on("mousemove",t)):(this.off("click",r),this.off("mousemove",t))},value:!1}}),e.previousLinkingHover=!1});
//# sourceMappingURL=../sourcemaps/ext/linking.js.map
