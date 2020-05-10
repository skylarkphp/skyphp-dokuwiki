/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./jack_highlight_rules").JackHighlightRules,n=require("./matching_brace_outdent").MatchingBraceOutdent,h=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=i,this.$outdent=new n,this.$behaviour=new h,this.foldingRules=new o};t.inherits(u,e),function(){this.lineCommentStart="--",this.getNextLineIndent=function(t,e,i){var n=this.$getIndent(e);"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(n+=i));return n},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/jack"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/jack.js.map
