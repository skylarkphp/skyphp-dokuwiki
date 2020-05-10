/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./rdoc_highlight_rules").RDocHighlightRules,n=require("./matching_brace_outdent").MatchingBraceOutdent,h=function(t){this.HighlightRules=i,this.$outdent=new n,this.$behaviour=this.$defaultBehaviour};t.inherits(h,e),function(){this.getNextLineIndent=function(t,e,i){return this.$getIndent(e)},this.$id="ace/mode/rdoc"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/rdoc.js.map
