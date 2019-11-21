/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){var o=e("../lib/oop"),g=e("./html").Mode,i=e("./html_highlight_rules").HtmlHighlightRules,s=e("./text_highlight_rules").TextHighlightRules,a=function(){this.$rules={start:[{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"},{token:"constant",regex:"[0-9]+"},{token:"variable",regex:"[-_a-zA-Z0-9:]+"}],tag:[{token:"entity.name.function",regex:"[a-zA-Z][_a-zA-Z0-9]*",next:"start"}]}};o.inherits(a,s);var r=function(){for(var e in this.$rules=(new i).getRules(),this.$rules)this.$rules[e].unshift({token:"comment.line",regex:"\\{#.*?#\\}"},{token:"comment.block",regex:"\\{\\%\\s*comment\\s*\\%\\}",merge:!0,next:"django-comment"},{token:"constant.language",regex:"\\{\\{",next:"django-start"},{token:"constant.language",regex:"\\{\\%",next:"django-tag"}),this.embedRules(a,"django-",[{token:"comment.block",regex:"\\{\\%\\s*endcomment\\s*\\%\\}",merge:!0,next:"start"},{token:"constant.language",regex:"\\%\\}",next:"start"},{token:"constant.language",regex:"\\}\\}",next:"start"}])};o.inherits(r,i);var l=function(){g.call(this),this.HighlightRules=r};o.inherits(l,g),function(){this.$id="ace/mode/django"}.call(l.prototype),t.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/django.js.map
