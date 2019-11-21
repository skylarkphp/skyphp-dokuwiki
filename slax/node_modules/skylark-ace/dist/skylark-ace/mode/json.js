/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var o=t("../lib/oop"),i=t("./text").Mode,r=t("./json_highlight_rules").JsonHighlightRules,u=t("./matching_brace_outdent").MatchingBraceOutdent,s=t("./behaviour/cstyle").CstyleBehaviour,c=t("./folding/cstyle").FoldMode,a=t("../worker/worker_client").WorkerClient,h=function(){this.HighlightRules=r,this.$outdent=new u,this.$behaviour=new s,this.foldingRules=new c};o.inherits(h,i),function(){this.getNextLineIndent=function(t,e,n){var o=this.$getIndent(e);"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(o+=n));return o},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){var e=new a(["ace"],"ace/mode/json_worker","JsonWorker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/json"}.call(h.prototype),e.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/json.js.map
