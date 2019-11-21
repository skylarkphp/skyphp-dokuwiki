/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var o=t("./coffee_highlight_rules").CoffeeHighlightRules,i=t("./matching_brace_outdent").MatchingBraceOutdent,r=t("./folding/coffee").FoldMode,c=(t("../range").Range,t("./text").Mode),s=t("../worker/worker_client").WorkerClient;function f(){this.HighlightRules=o,this.$outdent=new i,this.foldingRules=new r}t("../lib/oop").inherits(f,c),function(){var t=/(?:[({[=:]|[-=]>|\b(?:else|try|(?:swi|ca)tch(?:\s+[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$|^\s*(else\b\s*)?(?:if|for|while|loop)\b(?!.*\bthen\b)/;this.lineCommentStart="#",this.blockComment={start:"###",end:"###"},this.getNextLineIndent=function(e,n,o){var i=this.$getIndent(n),r=this.getTokenizer().getLineTokens(n,e).tokens;return r.length&&"comment"===r[r.length-1].type||"start"!==e||!t.test(n)||(i+=o),i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){var e=new s(["ace"],"ace/mode/coffee_worker","Worker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/coffee"}.call(f.prototype),e.Mode=f});
//# sourceMappingURL=../sourcemaps/mode/coffee.js.map
