/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,n,e){"use strict";var r=t("../range").Range,i=function(){};(function(){this.checkOutdent=function(t,n){return!!/^\s+$/.test(t)&&/^\s*\}/.test(n)},this.autoOutdent=function(t,n){var e=t.getLine(n).match(/^(\s*\})/);if(!e)return 0;var i=e[1].length,c=t.findMatchingBracket({row:n,column:i});if(!c||c.row==n)return 0;var u=this.$getIndent(t.getLine(c.row));t.replace(new r(n,0,n,i-1),u)},this.$getIndent=function(t){return t.match(/^\s*/)[0]}}).call(i.prototype),n.MatchingBraceOutdent=i});
//# sourceMappingURL=../sourcemaps/mode/matching_brace_outdent.js.map
