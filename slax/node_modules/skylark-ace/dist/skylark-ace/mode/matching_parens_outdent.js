/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,n,e){"use strict";var r=t("../range").Range,i=function(){};(function(){this.checkOutdent=function(t,n){return!!/^\s+$/.test(t)&&/^\s*\)/.test(n)},this.autoOutdent=function(t,n){var e=t.getLine(n).match(/^(\s*\))/);if(!e)return 0;var i=e[1].length,c=t.findMatchingBracket({row:n,column:i});if(!c||c.row==n)return 0;var a=this.$getIndent(t.getLine(c.row));t.replace(new r(n,0,n,i-1),a)},this.$getIndent=function(t){var n=t.match(/^(\s+)/);return n?n[1]:""}}).call(i.prototype),n.MatchingParensOutdent=i});
//# sourceMappingURL=../sourcemaps/mode/matching_parens_outdent.js.map
