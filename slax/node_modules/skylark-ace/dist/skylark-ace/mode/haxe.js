/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./text").Mode,o=t("./haxe_highlight_rules").HaxeHighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/cstyle").CstyleBehaviour,c=t("./folding/cstyle").FoldMode,d=function(){this.HighlightRules=o,this.$outdent=new s,this.$behaviour=new u,this.foldingRules=new c};i.inherits(d,h),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/haxe"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/haxe.js.map
