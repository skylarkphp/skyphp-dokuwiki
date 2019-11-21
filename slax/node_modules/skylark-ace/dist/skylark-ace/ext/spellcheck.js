/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var s=e("../lib/event");t.contextMenuHandler=function(e){var t=e.target,n=t.textInput.getElement();if(t.selection.isEmpty()){var i=t.getCursorPosition(),o=t.session.getWordRange(i.row,i.column),r=t.session.getTextRange(o);if(t.session.tokenRe.lastIndex=0,t.session.tokenRe.test(r)){var l=r+" ";n.value=l,n.setSelectionRange(r.length,r.length+1),n.setSelectionRange(0,0),n.setSelectionRange(0,r.length);var c=!1;s.addListener(n,"keydown",function e(){s.removeListener(n,"keydown",e),c=!0}),t.textInput.setInputHandler(function(e){if(console.log(e,l,n.selectionStart,n.selectionEnd),e==l)return"";if(0===e.lastIndexOf(l,0))return e.slice(l.length);if(e.substr(n.selectionEnd)==l)return e.slice(0,-l.length);if(""==e.slice(-2)){var s=e.slice(0,-2);if(" "==s.slice(-1))return c?s.substring(0,n.selectionEnd):(s=s.slice(0,-1),t.session.replace(o,s),"")}return e})}}};var i=e("../editor").Editor;e("../config").defineOptions(i.prototype,"editor",{spellcheck:{set:function(e){this.textInput.getElement().spellcheck=!!e,e?this.on("nativecontextmenu",t.contextMenuHandler):this.removeListener("nativecontextmenu",t.contextMenuHandler)},value:!0}})});
//# sourceMappingURL=../sourcemaps/ext/spellcheck.js.map
