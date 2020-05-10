/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules,s=require("./java_highlight_rules").JavaHighlightRules,i=function(){t.call(this);var e=[{token:"comment",regex:"<%--",push:"jsp-dcomment"},{token:"meta.tag",regex:"<%@?|<%=?|<%!?|<jsp:[^>]+>",push:"jsp-start"}],i=[{token:"meta.tag",regex:"%>|<\\/jsp:[^>]+>",next:"pop"},{token:"variable.language",regex:"request|response|out|session|application|config|pageContext|page|Exception"},{token:"keyword",regex:"page|include|taglib"}];for(var n in this.$rules)this.$rules[n].unshift.apply(this.$rules[n],e);this.embedRules(s,"jsp-",i,["start"]),this.addRules({"jsp-dcomment":[{token:"comment",regex:".*?--%>",next:"pop"}]}),this.normalizeRules()};e.inherits(i,t),exports.JspHighlightRules=i});
//# sourceMappingURL=../sourcemaps/mode/jsp_highlight_rules.js.map
