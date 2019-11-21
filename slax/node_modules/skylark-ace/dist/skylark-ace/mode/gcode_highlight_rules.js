/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var n=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,i=function(){var e=this.createKeywordMapper({"support.function":"ATAN|ABS|ACOS|ASIN|SIN|COS|EXP|FIX|FUP|ROUND|LN|TAN",keyword:"IF|DO|WHILE|ENDWHILE|CALL|ENDIF|SUB|ENDSUB|GOTO|REPEAT|ENDREPEAT|CALL","constant.language":"PI"},"identifier",!0);this.$rules={start:[{token:"comment",regex:"\\(.*\\)"},{token:"comment",regex:"([N])([0-9]+)"},{token:"string",regex:"([G])([0-9]+\\.?[0-9]?)"},{token:"string",regex:"([M])([0-9]+\\.?[0-9]?)"},{token:"constant.numeric",regex:"([-+]?([0-9]*\\.?[0-9]+\\.?))|(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"},{token:e,regex:"[A-Z]"},{token:"keyword.operator",regex:"EQ|LT|GT|NE|GE|LE|OR|XOR"},{token:"paren.lparen",regex:"[\\[]"},{token:"paren.rparen",regex:"[\\]]"},{token:"text",regex:"\\s+"}]}};n.inherits(i,o),t.GcodeHighlightRules=i});
//# sourceMappingURL=../sourcemaps/mode/gcode_highlight_rules.js.map
