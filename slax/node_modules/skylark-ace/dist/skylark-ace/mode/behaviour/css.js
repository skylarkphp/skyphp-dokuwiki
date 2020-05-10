/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=(require("../behaviour").Behaviour,require("./cstyle").CstyleBehaviour),n=require("../../token_iterator").TokenIterator,i=function(){this.inherit(e),this.add("colon","insertion",function(t,e,i,o,r){if(":"===r&&i.selection.isEmpty()){var s=i.getCursorPosition(),u=new n(o,s.row,s.column),c=u.getCurrentToken();if(c&&c.value.match(/\s+/)&&(c=u.stepBackward()),c&&"support.type"===c.type){var a=o.doc.getLine(s.row);if(":"===a.substring(s.column,s.column+1))return{text:"",selection:[1,1]};if(/^(\s+[^;]|\s*$)/.test(a.substring(s.column)))return{text:":;",selection:[1,1]}}}}),this.add("colon","deletion",function(t,e,i,o,r){var s=o.doc.getTextRange(r);if(!r.isMultiLine()&&":"===s){var u=i.getCursorPosition(),c=new n(o,u.row,u.column),a=c.getCurrentToken();if(a&&a.value.match(/\s+/)&&(a=c.stepBackward()),a&&"support.type"===a.type)if(";"===o.doc.getLine(r.start.row).substring(r.end.column,r.end.column+1))return r.end.column++,r}}),this.add("semicolon","insertion",function(t,e,n,i,o){if(";"===o&&n.selection.isEmpty()){var r=n.getCursorPosition();if(";"===i.doc.getLine(r.row).substring(r.column,r.column+1))return{text:"",selection:[1,1]}}}),this.add("!important","insertion",function(t,e,n,i,o){if("!"===o&&n.selection.isEmpty()){var r=n.getCursorPosition(),s=i.doc.getLine(r.row);if(/^\s*(;|}|$)/.test(s.substring(r.column)))return{text:"!important",selection:[10,10]}}})};t.inherits(i,e),exports.CssBehaviour=i});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/css.js.map
