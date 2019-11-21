/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,o){"use strict";var r=e("../lib/oop"),n=(e("../lib/lang"),e("./text_highlight_rules").TextHighlightRules),a=(e("./latex_highlight_rules"),function(){this.$rules={start:[{token:"comment",regex:"%.*$"},{token:"text",regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b",next:"nospell"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])}]"},{token:"text",regex:"\\s+"}],nospell:[{token:"comment",regex:"%.*$",next:"start"},{token:"nospell.text",regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])",next:"start"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])]"},{token:"paren.keyword.operator",regex:"}",next:"start"},{token:"nospell.text",regex:"\\s+"},{token:"nospell.text",regex:"\\w+"}]}});r.inherits(a,n),t.RDocHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/rdoc_highlight_rules.js.map
