/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("./coffee_highlight_rules").CoffeeHighlightRules,e=require("./matching_brace_outdent").MatchingBraceOutdent,n=require("./folding/coffee").FoldMode,o=(require("../range").Range,require("./text").Mode),i=require("../worker/worker_client").WorkerClient;function r(){this.HighlightRules=t,this.$outdent=new e,this.foldingRules=new n}require("../lib/oop").inherits(r,o),function(){var t=/(?:[({[=:]|[-=]>|\b(?:else|try|(?:swi|ca)tch(?:\s+[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$|^\s*(else\b\s*)?(?:if|for|while|loop)\b(?!.*\bthen\b)/;this.lineCommentStart="#",this.blockComment={start:"###",end:"###"},this.getNextLineIndent=function(e,n,o){var i=this.$getIndent(n),r=this.getTokenizer().getLineTokens(n,e).tokens;return r.length&&"comment"===r[r.length-1].type||"start"!==e||!t.test(n)||(i+=o),i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){var e=new i(["ace"],"ace/mode/coffee_worker","Worker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/coffee"}.call(r.prototype),exports.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/coffee.js.map
