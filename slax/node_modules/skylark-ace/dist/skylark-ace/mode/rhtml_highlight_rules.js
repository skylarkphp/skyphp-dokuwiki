/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var s=t("../lib/oop"),h=t("./r_highlight_rules").RHighlightRules,l=t("./html_highlight_rules").HtmlHighlightRules,r=t("./text_highlight_rules").TextHighlightRules,n=function(){l.call(this),this.$rules.start.unshift({token:"support.function.codebegin",regex:"^\x3c!--\\s*begin.rcode\\s*(?:.*)",next:"r-start"}),this.embedRules(h,"r-",[{token:"support.function.codeend",regex:"^\\s*end.rcode\\s*--\x3e",next:"start"}],["start"]),this.normalizeRules()};s.inherits(n,r),e.RHtmlHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/rhtml_highlight_rules.js.map
