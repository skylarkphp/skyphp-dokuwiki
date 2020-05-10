/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),t=require("../behaviour").Behaviour,r=require("./xml").XmlBehaviour,n=require("../../token_iterator").TokenIterator;require("../../lib/lang");function a(e,t){return e&&e.type.lastIndexOf(t+".xml")>-1}var i=function(){r.call(this),this.add("autoBraceTagClosing","insertion",function(e,t,r,i,u){if("}"==u){var o=r.getSelectionRange().start,l=new n(i,o.row,o.column),s=l.getCurrentToken()||l.stepBackward();if(!s||!("%"===s.value.trim()||a(s,"tag-name")||a(s,"tag-whitespace")||a(s,"attribute-name")||a(s,"attribute-equals")||a(s,"attribute-value")))return;if(a(s,"reference.attribute-value"))return;if(a(s,"attribute-value")){var c=l.getCurrentTokenColumn()+s.value.length;if(o.column<c)return;if(o.column==c){var f=l.stepForward();if(f&&a(f,"attribute-value"))return;l.stepBackward()}}if(/{%\s*%/.test(i.getLine(o.row)))return;if(/^\s*}/.test(i.getLine(o.row).slice(o.column)))return;for(;"keyword.block"!=!s.type;)if("{%"==(s=l.stepBackward()).value){for(;"keyword.block"!==(s=l.stepForward()).type;)if("%"==s.value.trim()){s=null;break}break}if(!s)return;var v=l.getCurrentTokenRow(),w=l.getCurrentTokenColumn();if(a(l.stepBackward(),"end-tag-open"))return;var d=s.value;if(v==o.row&&(d=d.substring(0,o.column-w)),this.voidElements.hasOwnProperty(d.toLowerCase()))return;return{text:"}{% end"+d+" %}",selection:[1,1]}}})};e.inherits(i,t),exports.LiquidBehaviour=i});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/liquid.js.map
