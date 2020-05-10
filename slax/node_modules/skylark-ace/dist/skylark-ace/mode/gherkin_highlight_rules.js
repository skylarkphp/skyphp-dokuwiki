/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var e=require("../lib/oop"),t=require("./text_highlight_rules").TextHighlightRules,n="\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})",r=function(){var e=[{name:"en",labels:"Feature|Background|Scenario(?: Outline)?|Examples",keywords:"Given|When|Then|And|But"}],t=e.map(function(e){return e.labels}).join("|"),r=e.map(function(e){return e.keywords}).join("|");this.$rules={start:[{token:"constant.numeric",regex:"(?:(?:[1-9]\\d*)|(?:0))"},{token:"comment",regex:"#.*$"},{token:"keyword",regex:"(?:"+t+"):|(?:"+r+")\\b"},{token:"keyword",regex:"\\*"},{token:"string",regex:'"{3}',next:"qqstring3"},{token:"string",regex:'"',next:"qqstring"},{token:"text",regex:"^\\s*(?=@[\\w])",next:[{token:"text",regex:"\\s+"},{token:"variable.parameter",regex:"@[\\w]+"},{token:"empty",regex:"",next:"start"}]},{token:"comment",regex:"<[^>]+>"},{token:"comment",regex:"\\|(?=.)",next:"table-item"},{token:"comment",regex:"\\|$",next:"start"}],qqstring3:[{token:"constant.language.escape",regex:n},{token:"string",regex:'"{3}',next:"start"},{defaultToken:"string"}],qqstring:[{token:"constant.language.escape",regex:n},{token:"string",regex:"\\\\$",next:"qqstring"},{token:"string",regex:'"|$',next:"start"},{defaultToken:"string"}],"table-item":[{token:"comment",regex:/$/,next:"start"},{token:"comment",regex:/\|/},{token:"string",regex:/\\./},{defaultToken:"string"}]},this.normalizeRules()};e.inherits(r,t),exports.GherkinHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/gherkin_highlight_rules.js.map
