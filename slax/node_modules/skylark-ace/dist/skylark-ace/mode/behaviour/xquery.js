/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,r){"use strict";var i=t("../../lib/oop"),a=t("../behaviour").Behaviour,n=t("./cstyle").CstyleBehaviour,o=t("../behaviour/xml").XmlBehaviour,u=t("../../token_iterator").TokenIterator;function s(t,e){var r=!0,i=t.type.split(".");return e.split(".").forEach(function(t){if(-1==i.indexOf(t))return r=!1,!1}),r}var l=function(){this.inherit(n,["braces","parens","string_dquotes"]),this.inherit(o),this.add("autoclosing","insertion",function(t,e,r,i,a){if(">"==a){var n=r.getCursorPosition(),o=new u(i,n.row,n.column),l=o.getCurrentToken(),c=!1;t=JSON.parse(t).pop();if(l&&">"===l.value||"StartTag"!==t)return;if(l&&(s(l,"meta.tag")||s(l,"text")&&l.value.match("/")))c=!0;else do{l=o.stepBackward()}while(l&&(s(l,"string")||s(l,"keyword.operator")||s(l,"entity.attribute-name")||s(l,"text")));var h=o.stepBackward();if(!l||!s(l,"meta.tag")||null!==h&&h.value.match("/"))return;var v=l.value.substring(1);if(c)v=v.substring(0,n.column-l.start);return{text:"></"+v+">",selection:[1,1]}}})};i.inherits(l,a),e.XQueryBehaviour=l});
//# sourceMappingURL=../../sourcemaps/mode/behaviour/xquery.js.map
