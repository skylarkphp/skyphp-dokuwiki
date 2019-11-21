/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var o=t("../lib/oop"),i=t("./text").Mode,s=t("./css_highlight_rules").CssHighlightRules,c=t("./matching_brace_outdent").MatchingBraceOutdent,r=t("../worker/worker_client").WorkerClient,h=t("./css_completions").CssCompletions,u=t("./behaviour/css").CssBehaviour,a=t("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=s,this.$outdent=new c,this.$behaviour=new u,this.$completer=new h,this.foldingRules=new a};o.inherits(l,i),function(){this.foldingRules="cStyle",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var o=this.$getIndent(e),i=this.getTokenizer().getLineTokens(e,t).tokens;return i.length&&"comment"==i[i.length-1].type?o:(e.match(/^.*\{\s*$/)&&(o+=n),o)},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.getCompletions=function(t,e,n,o){return this.$completer.getCompletions(t,e,n,o)},this.createWorker=function(t){var e=new r(["ace"],"ace/mode/css_worker","Worker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/css"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/css.js.map
