/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./html_highlight_rules").HtmlHighlightRules,s=require("./javascript_highlight_rules").JavaScriptHighlightRules,i=function(e,i){for(var l in t.call(this),e||(e="(?:<%|<\\?|{{)"),i||(i="(?:%>|\\?>|}})"),this.$rules)this.$rules[l].unshift({token:"markup.list.meta.tag",regex:e+"(?![>}])[-=]?",push:"ejs-start"});this.embedRules(new s({jsx:!1}).getRules(),"ejs-",[{token:"markup.list.meta.tag",regex:"-?"+i,next:"pop"},{token:"comment",regex:"//.*?"+i,next:"pop"}]),this.normalizeRules()};e.inherits(i,t),exports.EjsHighlightRules=i;e=require("../lib/oop");var l=require("./html").Mode,h=require("./javascript").Mode,o=require("./css").Mode,r=(require("./ruby").Mode,function(){l.call(this),this.HighlightRules=i,this.createModeDelegates({"js-":h,"css-":o,"ejs-":h})});e.inherits(r,l),function(){this.$id="ace/mode/ejs"}.call(r.prototype),exports.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/ejs.js.map
