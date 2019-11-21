/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,o){"use strict";var i=e("../lib/oop"),n=e("../lib/lang"),r=e("./text").Mode,l=e("./xml_highlight_rules").XmlHighlightRules,a=e("./behaviour/xml").XmlBehaviour,c=e("./folding/xml").FoldMode,h=e("../worker/worker_client").WorkerClient,s=function(){this.HighlightRules=l,this.$behaviour=new a,this.foldingRules=new c};i.inherits(s,r),function(){this.voidElements=n.arrayToMap([]),this.blockComment={start:"\x3c!--",end:"--\x3e"},this.createWorker=function(e){var t=new h(["ace"],"ace/mode/xml_worker","Worker");return t.attachToDocument(e.getDocument()),t.on("error",function(t){e.setAnnotations(t.data)}),t.on("terminate",function(){e.clearAnnotations()}),t},this.$id="ace/mode/xml"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/xml.js.map
