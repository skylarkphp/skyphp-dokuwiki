/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,r=t("./javascript_highlight_rules").JavaScriptHighlightRules,a=t("./matching_brace_outdent").MatchingBraceOutdent,s=t("../worker/worker_client").WorkerClient,c=t("./behaviour/cstyle").CstyleBehaviour,h=t("./folding/cstyle").FoldMode,u=function(){this.HighlightRules=r,this.$outdent=new a,this.$behaviour=new c,this.foldingRules=new h};i.inherits(u,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$quotes={'"':'"',"'":"'","`":"`"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),r=o.tokens,a=o.state;if(r.length&&"comment"==r[r.length-1].type)return i;if("start"==t||"no_regex"==t)(s=e.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==a||"no_regex"==a)return"";var s;(s=e.match(/^\s*(\/?)\*/))&&(s[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){var e=new s(["ace"],"ace/mode/javascript_worker","JavaScriptWorker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/javascript"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/javascript.js.map
