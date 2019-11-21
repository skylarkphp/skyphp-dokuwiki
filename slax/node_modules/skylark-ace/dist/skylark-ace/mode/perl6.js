/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),h=t("./text").Mode,o=t("./perl6_highlight_rules").Perl6HighlightRules,s=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./folding/cstyle").FoldMode,d=function(){this.HighlightRules=o,this.$outdent=new s,this.foldingRules=new u({start:"^=(begin)\\b",end:"^=(end)\\b"}),this.$behaviour=this.$defaultBehaviour};i.inherits(d,h),function(){this.lineCommentStart="#",this.blockComment=[{start:"=begin",end:"=end",lineStartOnly:!0},{start:"=item",end:"=end",lineStartOnly:!0}],this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),h=this.getTokenizer().getLineTokens(e,t).tokens;if(h.length&&"comment"==h[h.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[:]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/perl6"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/perl6.js.map
