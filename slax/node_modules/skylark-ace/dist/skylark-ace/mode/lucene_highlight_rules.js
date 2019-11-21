/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var n=e("../lib/oop"),o=(e("../lib/lang"),e("./text_highlight_rules").TextHighlightRules),a=function(){this.$rules={start:[{token:"constant.language.escape",regex:/\\[\+\-&\|!\(\)\{\}\[\]^"~\*\?:\\]/},{token:"constant.character.negation",regex:"\\-"},{token:"constant.character.interro",regex:"\\?"},{token:"constant.character.required",regex:"\\+"},{token:"constant.character.asterisk",regex:"\\*"},{token:"constant.character.proximity",regex:"~(?:0\\.[0-9]+|[0-9]+)?"},{token:"keyword.operator",regex:"(AND|OR|NOT|TO)\\b"},{token:"paren.lparen",regex:"[\\(\\{\\[]"},{token:"paren.rparen",regex:"[\\)\\}\\]]"},{token:"keyword",regex:"(?:\\\\.|[^\\s:\\\\])+:"},{token:"string",regex:'"(?:\\\\"|[^"])*"'},{token:"term",regex:"\\w+"},{token:"text",regex:"\\s+"}]}};n.inherits(a,o),t.LuceneHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/lucene_highlight_rules.js.map
