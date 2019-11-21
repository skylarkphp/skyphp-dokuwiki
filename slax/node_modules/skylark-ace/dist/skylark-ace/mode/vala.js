/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,n){"use strict";var i=t("../lib/oop"),o=t("./text").Mode,s=(t("../tokenizer").Tokenizer,t("./vala_highlight_rules").ValaHighlightRules),h=(t("./folding/cstyle").FoldMode,t("./behaviour/cstyle").CstyleBehaviour),r=t("./folding/cstyle").FoldMode,a=t("./matching_brace_outdent").MatchingBraceOutdent,u=function(){this.HighlightRules=s,this.$outdent=new a,this.$behaviour=new h,this.foldingRules=new r};i.inherits(u,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(t,e,n){var i=this.$getIndent(e),o=this.getTokenizer().getLineTokens(e,t),s=o.tokens,h=o.state;if(s.length&&"comment"==s[s.length-1].type)return i;if("start"==t||"no_regex"==t)(r=e.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/))&&(i+=n);else if("doc-start"==t){if("start"==h||"no_regex"==h)return"";var r;(r=e.match(/^\s*(\/?)\*/))&&(r[1]&&(i+=" "),i+="* ")}return i},this.checkOutdent=function(t,e,n){return this.$outdent.checkOutdent(e,n)},this.autoOutdent=function(t,e,n){this.$outdent.autoOutdent(e,n)},this.$id="ace/mode/vala"}.call(u.prototype),e.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/vala.js.map
