/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,s){"use strict";var i=e("../lib/oop"),n=e("./html_highlight_rules").HtmlHighlightRules,l=e("./java_highlight_rules").JavaHighlightRules,a=function(){n.call(this);var e=[{token:"comment",regex:"<%--",push:"jsp-dcomment"},{token:"meta.tag",regex:"<%@?|<%=?|<%!?|<jsp:[^>]+>",push:"jsp-start"}],t=[{token:"meta.tag",regex:"%>|<\\/jsp:[^>]+>",next:"pop"},{token:"variable.language",regex:"request|response|out|session|application|config|pageContext|page|Exception"},{token:"keyword",regex:"page|include|taglib"}];for(var s in this.$rules)this.$rules[s].unshift.apply(this.$rules[s],e);this.embedRules(l,"jsp-",t,["start"]),this.addRules({"jsp-dcomment":[{token:"comment",regex:".*?--%>",next:"pop"}]}),this.normalizeRules()};i.inherits(a,n),t.JspHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/jsp_highlight_rules.js.map
