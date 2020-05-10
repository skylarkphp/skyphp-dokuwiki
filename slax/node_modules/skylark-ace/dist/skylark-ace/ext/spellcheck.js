/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/event");exports.contextMenuHandler=function(t){var n=t.target,s=n.textInput.getElement();if(n.selection.isEmpty()){var i=n.getCursorPosition(),o=n.session.getWordRange(i.row,i.column),r=n.session.getTextRange(o);if(n.session.tokenRe.lastIndex=0,n.session.tokenRe.test(r)){var l=r+" ";s.value=l,s.setSelectionRange(r.length,r.length+1),s.setSelectionRange(0,0),s.setSelectionRange(0,r.length);var c=!1;e.addListener(s,"keydown",function t(){e.removeListener(s,"keydown",t),c=!0}),n.textInput.setInputHandler(function(e){if(console.log(e,l,s.selectionStart,s.selectionEnd),e==l)return"";if(0===e.lastIndexOf(l,0))return e.slice(l.length);if(e.substr(s.selectionEnd)==l)return e.slice(0,-l.length);if(""==e.slice(-2)){var t=e.slice(0,-2);if(" "==t.slice(-1))return c?t.substring(0,s.selectionEnd):(t=t.slice(0,-1),n.session.replace(o,t),"")}return e})}}};var t=require("../editor").Editor;require("../config").defineOptions(t.prototype,"editor",{spellcheck:{set:function(e){this.textInput.getElement().spellcheck=!!e,e?this.on("nativecontextmenu",exports.contextMenuHandler):this.removeListener("nativecontextmenu",exports.contextMenuHandler)},value:!0}})});
//# sourceMappingURL=../sourcemaps/ext/spellcheck.js.map
