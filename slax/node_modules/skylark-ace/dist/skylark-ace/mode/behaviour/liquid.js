/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,r){"use strict";var n=e("../../lib/oop"),a=e("../behaviour").Behaviour,i=e("./xml").XmlBehaviour,u=e("../../token_iterator").TokenIterator;e("../../lib/lang");function o(e,t){return e&&e.type.lastIndexOf(t+".xml")>-1}var l=function(){i.call(this),this.add("autoBraceTagClosing","insertion",function(e,t,r,n,a){if("}"==a){var i=r.getSelectionRange().start,l=new u(n,i.row,i.column),s=l.getCurrentToken()||l.stepBackward();if(!s||!("%"===s.value.trim()||o(s,"tag-name")||o(s,"tag-whitespace")||o(s,"attribute-name")||o(s,"attribute-equals")||o(s,"attribute-value")))return;if(o(s,"reference.attribute-value"))return;if(o(s,"attribute-value")){var c=l.getCurrentTokenColumn()+s.value.length;if(i.column<c)return;if(i.column==c){var f=l.stepForward();if(f&&o(f,"attribute-value"))return;l.stepBackward()}}if(/{%\s*%/.test(n.getLine(i.row)))return;if(/^\s*}/.test(n.getLine(i.row).slice(i.column)))return;for(;"keyword.block"!=!s.type;)if("{%"==(s=l.stepBackward()).value){for(;"keyword.block"!==(s=l.stepForward()).type;)if("%"==s.value.trim()){s=null;break}break}if(!s)return;var v=l.getCurrentTokenRow(),w=l.getCurrentTokenColumn();if(o(l.stepBackward(),"end-tag-open"))return;var d=s.value;if(v==i.row&&(d=d.substring(0,i.column-w)),this.voidElements.hasOwnProperty(d.toLowerCase()))return;return{text:"}{% end"+d+" %}",selection:[1,1]}}})};n.inherits(l,a),t.LiquidBehaviour=l});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/liquid.js.map
