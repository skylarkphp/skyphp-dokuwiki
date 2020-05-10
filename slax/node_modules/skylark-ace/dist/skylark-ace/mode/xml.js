/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("../lib/lang"),o=require("./text").Mode,i=require("./xml_highlight_rules").XmlHighlightRules,n=require("./behaviour/xml").XmlBehaviour,r=require("./folding/xml").FoldMode,l=require("../worker/worker_client").WorkerClient,a=function(){this.HighlightRules=i,this.$behaviour=new n,this.foldingRules=new r};e.inherits(a,o),function(){this.voidElements=t.arrayToMap([]),this.blockComment={start:"\x3c!--",end:"--\x3e"},this.createWorker=function(e){var t=new l(["ace"],"ace/mode/xml_worker","Worker");return t.attachToDocument(e.getDocument()),t.on("error",function(t){e.setAnnotations(t.data)}),t.on("terminate",function(){e.clearAnnotations()}),t},this.$id="ace/mode/xml"}.call(a.prototype),exports.Mode=a});
//# sourceMappingURL=../sourcemaps/mode/xml.js.map
