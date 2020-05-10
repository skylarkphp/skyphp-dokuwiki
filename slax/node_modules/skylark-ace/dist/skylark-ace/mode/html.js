/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("../lib/lang"),o=require("./text").Mode,n=require("./javascript").Mode,i=require("./css").Mode,r=require("./html_highlight_rules").HtmlHighlightRules,s=require("./behaviour/xml").XmlBehaviour,l=require("./folding/html").FoldMode,a=require("./html_completions").HtmlCompletions,c=require("../worker/worker_client").WorkerClient,h=["area","base","br","col","embed","hr","img","input","keygen","link","meta","menuitem","param","source","track","wbr"],m=["li","dt","dd","p","rt","rp","optgroup","option","colgroup","td","th"],u=function(t){this.fragmentContext=t&&t.fragmentContext,this.HighlightRules=r,this.$behaviour=new s,this.$completer=new a,this.createModeDelegates({"js-":n,"css-":i}),this.foldingRules=new l(this.voidElements,e.arrayToMap(m))};t.inherits(u,o),function(){this.blockComment={start:"\x3c!--",end:"--\x3e"},this.voidElements=e.arrayToMap(h),this.getNextLineIndent=function(t,e,o){return this.$getIndent(e)},this.checkOutdent=function(t,e,o){return!1},this.getCompletions=function(t,e,o,n){return this.$completer.getCompletions(t,e,o,n)},this.createWorker=function(t){if(this.constructor==u){var e=new c(["ace"],"ace/mode/html_worker","Worker");return e.attachToDocument(t.getDocument()),this.fragmentContext&&e.call("setOptions",[{context:this.fragmentContext}]),e.on("error",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e}},this.$id="ace/mode/html"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/html.js.map
