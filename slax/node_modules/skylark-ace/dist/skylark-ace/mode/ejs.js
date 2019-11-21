/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,s){"use strict";var i=e("../lib/oop"),l=e("./html_highlight_rules").HtmlHighlightRules,h=e("./javascript_highlight_rules").JavaScriptHighlightRules,o=function(e,t){for(var s in l.call(this),e||(e="(?:<%|<\\?|{{)"),t||(t="(?:%>|\\?>|}})"),this.$rules)this.$rules[s].unshift({token:"markup.list.meta.tag",regex:e+"(?![>}])[-=]?",push:"ejs-start"});this.embedRules(new h({jsx:!1}).getRules(),"ejs-",[{token:"markup.list.meta.tag",regex:"-?"+t,next:"pop"},{token:"comment",regex:"//.*?"+t,next:"pop"}]),this.normalizeRules()};i.inherits(o,l),t.EjsHighlightRules=o;i=e("../lib/oop");var r=e("./html").Mode,a=e("./javascript").Mode,n=e("./css").Mode,u=(e("./ruby").Mode,function(){r.call(this),this.HighlightRules=o,this.createModeDelegates({"js-":a,"css-":n,"ejs-":a})});i.inherits(u,r),function(){this.$id="ace/mode/ejs"}.call(u.prototype),t.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/ejs.js.map
