/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../../lib/oop"),o=(t("../behaviour").Behaviour,t("./cstyle").CstyleBehaviour),r=t("../../token_iterator").TokenIterator,s=function(){this.inherit(o),this.add("colon","insertion",function(t,e,n,i,o){if(":"===o&&n.selection.isEmpty()){var s=n.getCursorPosition(),u=new r(i,s.row,s.column),c=u.getCurrentToken();if(c&&c.value.match(/\s+/)&&(c=u.stepBackward()),c&&"support.type"===c.type){var a=i.doc.getLine(s.row);if(":"===a.substring(s.column,s.column+1))return{text:"",selection:[1,1]};if(/^(\s+[^;]|\s*$)/.test(a.substring(s.column)))return{text:":;",selection:[1,1]}}}}),this.add("colon","deletion",function(t,e,n,i,o){var s=i.doc.getTextRange(o);if(!o.isMultiLine()&&":"===s){var u=n.getCursorPosition(),c=new r(i,u.row,u.column),a=c.getCurrentToken();if(a&&a.value.match(/\s+/)&&(a=c.stepBackward()),a&&"support.type"===a.type)if(";"===i.doc.getLine(o.start.row).substring(o.end.column,o.end.column+1))return o.end.column++,o}}),this.add("semicolon","insertion",function(t,e,n,i,o){if(";"===o&&n.selection.isEmpty()){var r=n.getCursorPosition();if(";"===i.doc.getLine(r.row).substring(r.column,r.column+1))return{text:"",selection:[1,1]}}}),this.add("!important","insertion",function(t,e,n,i,o){if("!"===o&&n.selection.isEmpty()){var r=n.getCursorPosition(),s=i.doc.getLine(r.row);if(/^\s*(;|}|$)/.test(s.substring(r.column)))return{text:"!important",selection:[10,10]}}})};i.inherits(s,o),e.CssBehaviour=s});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/css.js.map
