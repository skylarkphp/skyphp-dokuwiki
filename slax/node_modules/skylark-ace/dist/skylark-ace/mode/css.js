/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./css_highlight_rules").CssHighlightRules,o=require("./matching_brace_outdent").MatchingBraceOutdent,i=require("../worker/worker_client").WorkerClient,s=require("./css_completions").CssCompletions,c=require("./behaviour/css").CssBehaviour,r=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=n,this.$outdent=new o,this.$behaviour=new c,this.$completer=new s,this.foldingRules=new r};t.inherits(h,e),function(){this.foldingRules="cStyle",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var o=this.$getIndent(e),i=this.getTokenizer().getLineTokens(e,t).tokens;return i.length&&"comment"==i[i.length-1].type?o:(e.match(/^.*\{\s*$/)&&(o+=n),o)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.getCompletions=function(t,e,n,o){return this.$completer.getCompletions(t,e,n,o)},this.createWorker=function(t){var e=new i(["ace"],"ace/mode/css_worker","Worker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/css"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/css.js.map
