/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../../lib/oop"),e=require("../behaviour").Behaviour,r=require("./cstyle").CstyleBehaviour,i=require("../behaviour/xml").XmlBehaviour,a=require("../../token_iterator").TokenIterator;function n(t,e){var r=!0,i=t.type.split(".");return e.split(".").forEach(function(t){if(-1==i.indexOf(t))return r=!1,!1}),r}var o=function(){this.inherit(r,["braces","parens","string_dquotes"]),this.inherit(i),this.add("autoclosing","insertion",function(t,e,r,i,o){if(">"==o){var u=r.getCursorPosition(),s=new a(i,u.row,u.column),l=s.getCurrentToken(),c=!1;t=JSON.parse(t).pop();if(l&&">"===l.value||"StartTag"!==t)return;if(l&&(n(l,"meta.tag")||n(l,"text")&&l.value.match("/")))c=!0;else do{l=s.stepBackward()}while(l&&(n(l,"string")||n(l,"keyword.operator")||n(l,"entity.attribute-name")||n(l,"text")));var h=s.stepBackward();if(!l||!n(l,"meta.tag")||null!==h&&h.value.match("/"))return;var v=l.value.substring(1);if(c)v=v.substring(0,u.column-l.start);return{text:"></"+v+">",selection:[1,1]}}})};t.inherits(o,e),exports.XQueryBehaviour=o});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/xquery.js.map
