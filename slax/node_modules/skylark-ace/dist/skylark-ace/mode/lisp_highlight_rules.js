/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var i=e("../lib/oop"),r=e("./text_highlight_rules").TextHighlightRules,o=function(){var e=this.createKeywordMapper({"keyword.control":"case|do|let|loop|if|else|when","keyword.operator":"eq|neq|and|or","constant.language":"null|nil","support.function":"cons|car|cdr|cond|lambda|format|setq|setf|quote|eval|append|list|listp|memberp|t|load|progn"},"identifier",!0);this.$rules={start:[{token:"comment",regex:";.*$"},{token:["storage.type.function-type.lisp","text","entity.name.function.lisp"],regex:"(?:\\b(?:(defun|defmethod|defmacro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)"},{token:["punctuation.definition.constant.character.lisp","constant.character.lisp"],regex:"(#)((?:\\w|[\\\\+-=<>'\"&#])+)"},{token:["punctuation.definition.variable.lisp","variable.other.global.lisp","punctuation.definition.variable.lisp"],regex:"(\\*)(\\S*)(\\*)"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"string",regex:'"(?=.)',next:"qqstring"}],qqstring:[{token:"constant.character.escape.lisp",regex:"\\\\."},{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:"\\\\$",next:"qqstring"},{token:"string",regex:'"|$',next:"start"}]}};i.inherits(o,r),t.LispHighlightRules=o});
//# sourceMappingURL=../sourcemaps/mode/lisp_highlight_rules.js.map
