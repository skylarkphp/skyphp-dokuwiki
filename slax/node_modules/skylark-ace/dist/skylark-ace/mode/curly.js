/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),i=require("./html").Mode,e=require("./matching_brace_outdent").MatchingBraceOutdent,l=require("./folding/html").FoldMode,h=require("./curly_highlight_rules").CurlyHighlightRules,n=function(){i.call(this),this.HighlightRules=h,this.$outdent=new e,this.foldingRules=new l};t.inherits(n,i),function(){this.$id="ace/mode/curly"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/curly.js.map
