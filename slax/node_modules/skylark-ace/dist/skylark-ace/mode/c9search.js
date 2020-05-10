/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./c9search_highlight_rules").C9SearchHighlightRules,i=require("./matching_brace_outdent").MatchingBraceOutdent,h=require("./folding/c9search").FoldMode,c=function(){this.HighlightRules=n,this.$outdent=new i,this.foldingRules=new h};t.inherits(c,e),function(){this.getNextLineIndent=function(t,e,n){return this.$getIndent(e)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/c9search"}.call(c.prototype),exports.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/c9search.js.map
