/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text_highlight_rules").TextHighlightRules,n="\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",r=function(){this.$rules={start:[{token:"keyword",regex:"\\\\[bB]",next:"no_quantifier"},{token:"regexp.keyword.operator",regex:n},{token:"string.regexp",regex:"/\\w*",next:"start"},{token:["string","string.regex"],regex:"({\\d+\\b,?\\d*}|[+*?])(\\??)",next:"no_quantifier"},{token:"keyword",regex:"[$^]|\\\\[bB]",next:"no_quantifier"},{token:"constant.language.escape",regex:/\(\?[:=!]|\)|[()$^+*?]/,next:"no_quantifier"},{token:"constant.language.delimiter",regex:/\|/,next:"no_quantifier"},{token:"constant.language.escape",regex:/\[\^?/,next:"character_class"},{token:"empty",regex:"$",next:"start"}],character_class:[{regex:/\\[dDwWsS]/},{token:"markup.list",regex:"(?:"+n+"|.)-(?:[^\\]\\\\]|"+n+")"},{token:"keyword",regex:n},{token:"constant.language.escape",regex:"]",next:"start"},{token:"constant.language.escape",regex:"-"},{token:"empty",regex:"$",next:"start"},{defaultToken:"string.regexp.charachterclass"}],no_quantifier:[{token:"invalid",regex:"({\\d+\\b,?\\d*}|[+*?])(\\??)"},{token:"invalid",regex:"",next:"start"}]}};e.inherits(r,t),exports.JsRegexHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/js_regex_highlight_rules.js.map
