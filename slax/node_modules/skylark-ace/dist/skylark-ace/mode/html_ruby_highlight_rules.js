/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var s=e("../lib/oop"),u=e("./html_highlight_rules").HtmlHighlightRules,i=e("./ruby_highlight_rules").RubyHighlightRules,n=function(){u.call(this);var e=[{regex:"<%%|%%>",token:"constant.language.escape"},{token:"comment.start.erb",regex:"<%#",push:[{token:"comment.end.erb",regex:"%>",next:"pop",defaultToken:"comment"}]},{token:"support.ruby_tag",regex:"<%+(?!>)[-=]?",push:"ruby-start"}];for(var t in this.$rules)this.$rules[t].unshift.apply(this.$rules[t],e);this.embedRules(i,"ruby-",[{token:"support.ruby_tag",regex:"%>",next:"pop"},{token:"comment",regex:"#(?:[^%]|%[^>])*"}],["start"]),this.normalizeRules()};s.inherits(n,u),t.HtmlRubyHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/html_ruby_highlight_rules.js.map
