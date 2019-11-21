/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var s=e("../lib/oop"),n=e("../lib/lang"),r=e("../worker/mirror").Mirror,l=e("./css/csslint").CSSLint,o=t.Worker=function(e){r.call(this,e),this.setTimeout(400),this.ruleset=null,this.setDisabledRules("ids|order-alphabetical"),this.setInfoRules("adjoining-classes|qualified-headings|zero-units|gradients|import|outline-none|vendor-prefix")};s.inherits(o,r),function(){this.setInfoRules=function(e){"string"==typeof e&&(e=e.split("|")),this.infoRules=n.arrayToMap(e),this.doc.getValue()&&this.deferredUpdate.schedule(100)},this.setDisabledRules=function(e){if(e){"string"==typeof e&&(e=e.split("|"));var t={};l.getRules().forEach(function(e){t[e.id]=!0}),e.forEach(function(e){delete t[e]}),this.ruleset=t}else this.ruleset=null;this.doc.getValue()&&this.deferredUpdate.schedule(100)},this.onUpdate=function(){var e=this.doc.getValue();if(!e)return this.sender.emit("annotate",[]);var t=this.infoRules,i=l.verify(e,this.ruleset);this.sender.emit("annotate",i.messages.map(function(e){return{row:e.line-1,column:e.col-1,text:e.message,type:t[e.rule.id]?"info":e.type,rule:e.rule.name}}))}}.call(o.prototype)});
//# sourceMappingURL=../sourcemaps/mode/css_worker.js.map
