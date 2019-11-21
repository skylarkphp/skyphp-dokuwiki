/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){var r=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,g="\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})",i=function(){var e=[{name:"en",labels:"Feature|Background|Scenario(?: Outline)?|Examples",keywords:"Given|When|Then|And|But"}],t=e.map(function(e){return e.labels}).join("|"),n=e.map(function(e){return e.keywords}).join("|");this.$rules={start:[{token:"constant.numeric",regex:"(?:(?:[1-9]\\d*)|(?:0))"},{token:"comment",regex:"#.*$"},{token:"keyword",regex:"(?:"+t+"):|(?:"+n+")\\b"},{token:"keyword",regex:"\\*"},{token:"string",regex:'"{3}',next:"qqstring3"},{token:"string",regex:'"',next:"qqstring"},{token:"text",regex:"^\\s*(?=@[\\w])",next:[{token:"text",regex:"\\s+"},{token:"variable.parameter",regex:"@[\\w]+"},{token:"empty",regex:"",next:"start"}]},{token:"comment",regex:"<[^>]+>"},{token:"comment",regex:"\\|(?=.)",next:"table-item"},{token:"comment",regex:"\\|$",next:"start"}],qqstring3:[{token:"constant.language.escape",regex:g},{token:"string",regex:'"{3}',next:"start"},{defaultToken:"string"}],qqstring:[{token:"constant.language.escape",regex:g},{token:"string",regex:"\\\\$",next:"qqstring"},{token:"string",regex:'"|$',next:"start"},{defaultToken:"string"}],"table-item":[{token:"comment",regex:/$/,next:"start"},{token:"comment",regex:/\|/},{token:"string",regex:/\\./},{defaultToken:"string"}]},this.normalizeRules()};r.inherits(i,o),t.GherkinHighlightRules=i});
//# sourceMappingURL=../sourcemaps/mode/gherkin_highlight_rules.js.map
