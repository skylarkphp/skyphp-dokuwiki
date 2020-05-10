/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,n=require("./json_highlight_rules").JsonHighlightRules,o=require("./matching_brace_outdent").MatchingBraceOutdent,i=require("./behaviour/cstyle").CstyleBehaviour,r=require("./folding/cstyle").FoldMode,u=require("../worker/worker_client").WorkerClient,s=function(){this.HighlightRules=n,this.$outdent=new o,this.$behaviour=new i,this.foldingRules=new r};t.inherits(s,e),function(){this.getNextLineIndent=function(t,e,n){var o=this.$getIndent(e);"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(o+=n));return o},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){var e=new u(["ace"],"ace/mode/json_worker","JsonWorker");return e.attachToDocument(t.getDocument()),e.on("annotate",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e},this.$id="ace/mode/json"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/json.js.map
