/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var n=e("../lib/oop"),o=(e("../lib/lang"),e("./text_highlight_rules").TextHighlightRules),a=function(e){e||(e="text"),this.$rules={start:[{token:"comment",regex:"%.*$"},{token:e,regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b",next:"nospell"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])}]"},{token:e,regex:"\\s+"}],nospell:[{token:"comment",regex:"%.*$",next:"start"},{token:"nospell."+e,regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])",next:"start"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])]"},{token:"paren.keyword.operator",regex:"}",next:"start"},{token:"nospell."+e,regex:"\\s+"},{token:"nospell."+e,regex:"\\w+"}]}};n.inherits(a,o),t.TexHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/tex_highlight_rules.js.map
