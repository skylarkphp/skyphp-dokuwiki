/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),s=t("./html_highlight_rules").HtmlHighlightRules,r=function(){s.call(this),this.$rules.start.unshift({token:"variable",regex:"{{",push:"curly-start"}),this.$rules["curly-start"]=[{token:"variable",regex:"}}",next:"pop"}],this.normalizeRules()};l.inherits(r,s),i.CurlyHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/curly_highlight_rules.js.map
