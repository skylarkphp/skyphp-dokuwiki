/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";var n=t("../lib/oop"),i=t("../lib/lang"),r=t("./text").Mode,s=t("./javascript").Mode,l=t("./css").Mode,a=t("./html_highlight_rules").HtmlHighlightRules,c=t("./behaviour/xml").XmlBehaviour,h=t("./folding/html").FoldMode,m=t("./html_completions").HtmlCompletions,u=t("../worker/worker_client").WorkerClient,d=["area","base","br","col","embed","hr","img","input","keygen","link","meta","menuitem","param","source","track","wbr"],g=["li","dt","dd","p","rt","rp","optgroup","option","colgroup","td","th"],p=function(t){this.fragmentContext=t&&t.fragmentContext,this.HighlightRules=a,this.$behaviour=new c,this.$completer=new m,this.createModeDelegates({"js-":s,"css-":l}),this.foldingRules=new h(this.voidElements,i.arrayToMap(g))};n.inherits(p,r),function(){this.blockComment={start:"\x3c!--",end:"--\x3e"},this.voidElements=i.arrayToMap(d),this.getNextLineIndent=function(t,e,o){return this.$getIndent(e)},this.checkOutdent=function(t,e,o){return!1},this.getCompletions=function(t,e,o,n){return this.$completer.getCompletions(t,e,o,n)},this.createWorker=function(t){if(this.constructor==p){var e=new u(["ace"],"ace/mode/html_worker","Worker");return e.attachToDocument(t.getDocument()),this.fragmentContext&&e.call("setOptions",[{context:this.fragmentContext}]),e.on("error",function(e){t.setAnnotations(e.data)}),e.on("terminate",function(){t.clearAnnotations()}),e}},this.$id="ace/mode/html"}.call(p.prototype),e.Mode=p});
//# sourceMappingURL=../sourcemaps/mode/html.js.map
