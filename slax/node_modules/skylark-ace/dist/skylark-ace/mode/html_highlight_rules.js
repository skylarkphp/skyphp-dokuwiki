/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,a){"use strict";var i=t("../lib/oop"),l=t("../lib/lang"),s=t("./css_highlight_rules").CssHighlightRules,r=t("./javascript_highlight_rules").JavaScriptHighlightRules,n=t("./xml_highlight_rules").XmlHighlightRules,u=l.createMap({a:"anchor",button:"form",form:"form",img:"image",input:"form",label:"form",option:"form",script:"script",select:"form",textarea:"form",style:"style",table:"table",tbody:"table",td:"table",tfoot:"table",th:"table",tr:"table"}),o=function(){n.call(this),this.addRules({attributes:[{include:"tag_whitespace"},{token:"entity.other.attribute-name.xml",regex:"[-_a-zA-Z0-9:.]+"},{token:"keyword.operator.attribute-equals.xml",regex:"=",push:[{include:"tag_whitespace"},{token:"string.unquoted.attribute-value.html",regex:"[^<>='\"`\\s]+",next:"pop"},{token:"empty",regex:"",next:"pop"}]},{include:"attribute_value"}],tag:[{token:function(t,e){var a=u[e];return["meta.tag.punctuation."+("<"==t?"":"end-")+"tag-open.xml","meta.tag"+(a?"."+a:"")+".tag-name.xml"]},regex:"(</?)([-_a-zA-Z0-9:.]+)",next:"tag_stuff"}],tag_stuff:[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:"start"}]}),this.embedTagRules(s,"css-","style"),this.embedTagRules(new r({jsx:!1}).getRules(),"js-","script"),this.constructor===o&&this.normalizeRules()};i.inherits(o,n),e.HtmlHighlightRules=o});
//# sourceMappingURL=../sourcemaps/mode/html_highlight_rules.js.map
