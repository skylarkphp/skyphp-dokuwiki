/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("../lib/lang"),a=require("./css_highlight_rules").CssHighlightRules,i=require("./javascript_highlight_rules").JavaScriptHighlightRules,l=require("./xml_highlight_rules").XmlHighlightRules,s=e.createMap({a:"anchor",button:"form",form:"form",img:"image",input:"form",label:"form",option:"form",script:"script",select:"form",textarea:"form",style:"style",table:"table",tbody:"table",td:"table",tfoot:"table",th:"table",tr:"table"}),r=function(){l.call(this),this.addRules({attributes:[{include:"tag_whitespace"},{token:"entity.other.attribute-name.xml",regex:"[-_a-zA-Z0-9:.]+"},{token:"keyword.operator.attribute-equals.xml",regex:"=",push:[{include:"tag_whitespace"},{token:"string.unquoted.attribute-value.html",regex:"[^<>='\"`\\s]+",next:"pop"},{token:"empty",regex:"",next:"pop"}]},{include:"attribute_value"}],tag:[{token:function(t,e){var a=s[e];return["meta.tag.punctuation."+("<"==t?"":"end-")+"tag-open.xml","meta.tag"+(a?"."+a:"")+".tag-name.xml"]},regex:"(</?)([-_a-zA-Z0-9:.]+)",next:"tag_stuff"}],tag_stuff:[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:"start"}]}),this.embedTagRules(a,"css-","style"),this.embedTagRules(new i({jsx:!1}).getRules(),"js-","script"),this.constructor===r&&this.normalizeRules()};t.inherits(r,l),exports.HtmlHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/html_highlight_rules.js.map
