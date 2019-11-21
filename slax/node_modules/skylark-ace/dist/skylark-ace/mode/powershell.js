/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,s=t("./powershell_highlight_rules").PowershellHighlightRules,h=t("./matching_brace_outdent").MatchingBraceOutdent,u=t("./behaviour/cstyle").CstyleBehaviour,r=t("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=s,this.$outdent=new h,this.$behaviour=new u,this.foldingRules=new r({start:"^\\s*(<#)",end:"^[#\\s]>\\s*$"})};i.inherits(l,o),function(){this.lineCommentStart="#",this.blockComment={start:"<#",end:"#>"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.createWorker=function(t){return null},this.$id="ace/mode/powershell"}.call(l.prototype),e.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/powershell.js.map
