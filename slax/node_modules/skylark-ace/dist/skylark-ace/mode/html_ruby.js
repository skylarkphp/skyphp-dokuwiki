/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./html_ruby_highlight_rules").HtmlRubyHighlightRules,i=require("./html").Mode,s=require("./javascript").Mode,l=require("./css").Mode,h=require("./ruby").Mode,o=function(){i.call(this),this.HighlightRules=e,this.createModeDelegates({"js-":s,"css-":l,"ruby-":h})};t.inherits(o,i),function(){this.$id="ace/mode/html_ruby"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/html_ruby.js.map
