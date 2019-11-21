/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var s=t("../lib/oop"),a=t("./javascript_highlight_rules").JavaScriptHighlightRules,i=t("./html_highlight_rules").HtmlHighlightRules,c=function(){i.call(this),this.$rules.tag[2].token=function(t,e){var n="cf"==e.slice(0,2)?"keyword":"meta.tag";return["meta.tag.punctuation."+("<"==t?"":"end-")+"tag-open.xml",n+".tag-name.xml"]};var t=Object.keys(this.$rules).filter(function(t){return/^(js|css)-/.test(t)});this.embedRules({cfmlComment:[{regex:"\x3c!---",token:"comment.start",push:"cfmlComment"},{regex:"---\x3e",token:"comment.end",next:"pop"},{defaultToken:"comment"}]},"",[{regex:"\x3c!---",token:"comment.start",push:"cfmlComment"}],["comment","start","tag_whitespace","cdata"].concat(t)),this.$rules.cfTag=[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:"pop"}];var e={token:function(t,e){return["meta.tag.punctuation."+("<"==t?"":"end-")+"tag-open.xml","keyword.tag-name.xml"]},regex:"(</?)(cf[-_a-zA-Z0-9:.]+)",push:"cfTag"};t.forEach(function(t){this.$rules[t].unshift(e)},this),this.embedTagRules(new a({jsx:!1}).getRules(),"cfjs-","cfscript"),this.normalizeRules()};s.inherits(c,i),e.ColdfusionHighlightRules=c});
//# sourceMappingURL=../sourcemaps/mode/coldfusion_highlight_rules.js.map
