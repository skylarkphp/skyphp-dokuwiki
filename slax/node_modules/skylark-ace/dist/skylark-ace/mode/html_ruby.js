/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var s=t("../lib/oop"),l=t("./html_ruby_highlight_rules").HtmlRubyHighlightRules,h=t("./html").Mode,o=t("./javascript").Mode,u=t("./css").Mode,c=t("./ruby").Mode,r=function(){h.call(this),this.HighlightRules=l,this.createModeDelegates({"js-":o,"css-":u,"ruby-":c})};s.inherits(r,h),function(){this.$id="ace/mode/html_ruby"}.call(r.prototype),e.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/html_ruby.js.map
