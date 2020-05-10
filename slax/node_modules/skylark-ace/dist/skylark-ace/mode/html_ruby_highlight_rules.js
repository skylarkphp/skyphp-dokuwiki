/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules,r=require("./ruby_highlight_rules").RubyHighlightRules,s=function(){t.call(this);var e=[{regex:"<%%|%%>",token:"constant.language.escape"},{token:"comment.start.erb",regex:"<%#",push:[{token:"comment.end.erb",regex:"%>",next:"pop",defaultToken:"comment"}]},{token:"support.ruby_tag",regex:"<%+(?!>)[-=]?",push:"ruby-start"}];for(var s in this.$rules)this.$rules[s].unshift.apply(this.$rules[s],e);this.embedRules(r,"ruby-",[{token:"support.ruby_tag",regex:"%>",next:"pop"},{token:"comment",regex:"#(?:[^%]|%[^>])*"}],["start"]),this.normalizeRules()};e.inherits(s,t),exports.HtmlRubyHighlightRules=s});
//# sourceMappingURL=../sourcemaps/mode/html_ruby_highlight_rules.js.map
