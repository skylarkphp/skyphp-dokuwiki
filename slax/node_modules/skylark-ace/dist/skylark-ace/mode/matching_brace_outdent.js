/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../range").Range,n=function(){};(function(){this.checkOutdent=function(t,n){return!!/^\s+$/.test(t)&&/^\s*\}/.test(n)},this.autoOutdent=function(n,e){var r=n.getLine(e).match(/^(\s*\})/);if(!r)return 0;var i=r[1].length,c=n.findMatchingBracket({row:e,column:i});if(!c||c.row==e)return 0;var u=this.$getIndent(n.getLine(c.row));n.replace(new t(e,0,e,i-1),u)},this.$getIndent=function(t){return t.match(/^\s*/)[0]}}).call(n.prototype),exports.MatchingBraceOutdent=n});
//# sourceMappingURL=../sourcemaps/mode/matching_brace_outdent.js.map
