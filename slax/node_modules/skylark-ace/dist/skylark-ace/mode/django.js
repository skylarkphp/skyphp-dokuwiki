/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){var e=require("../lib/oop"),t=require("./html").Mode,n=require("./html_highlight_rules").HtmlHighlightRules,o=require("./text_highlight_rules").TextHighlightRules,g=function(){this.$rules={start:[{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"},{token:"constant",regex:"[0-9]+"},{token:"variable",regex:"[-_a-zA-Z0-9:]+"}],tag:[{token:"entity.name.function",regex:"[a-zA-Z][_a-zA-Z0-9]*",next:"start"}]}};e.inherits(g,o);var i=function(){for(var e in this.$rules=(new n).getRules(),this.$rules)this.$rules[e].unshift({token:"comment.line",regex:"\\{#.*?#\\}"},{token:"comment.block",regex:"\\{\\%\\s*comment\\s*\\%\\}",merge:!0,next:"django-comment"},{token:"constant.language",regex:"\\{\\{",next:"django-start"},{token:"constant.language",regex:"\\{\\%",next:"django-tag"}),this.embedRules(g,"django-",[{token:"comment.block",regex:"\\{\\%\\s*endcomment\\s*\\%\\}",merge:!0,next:"start"},{token:"constant.language",regex:"\\%\\}",next:"start"},{token:"constant.language",regex:"\\}\\}",next:"start"}])};e.inherits(i,n);var s=function(){t.call(this),this.HighlightRules=i};e.inherits(s,t),function(){this.$id="ace/mode/django"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/django.js.map
