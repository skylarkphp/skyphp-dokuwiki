/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,n,e){"use strict";var i=t("../lib/oop"),s=t("./text").Mode,u=t("./scheme_highlight_rules").SchemeHighlightRules,h=t("./matching_parens_outdent").MatchingParensOutdent,r=function(){this.HighlightRules=u,this.$outdent=new h,this.$behaviour=this.$defaultBehaviour};i.inherits(r,s),function(){this.lineCommentStart=";",this.minorIndentFunctions=["define","lambda","define-macro","define-syntax","syntax-rules","define-record-type","define-structure"],this.$toIndent=function(t){return t.split("").map(function(t){return/\s/.exec(t)?t:" "}).join("")},this.$calculateIndent=function(t,n){for(var e,i,s=this.$getIndent(t),u=0,h=t.length-1;h>=0&&("("===(i=t[h])?(u--,e=!0):"("===i||"["===i||"{"===i?(u--,e=!1):")"!==i&&"]"!==i&&"}"!==i||u++,!(u<0));h--);if(!(u<0&&e))return u<0&&!e?this.$toIndent(t.substring(0,h+1)):u>0?s=s.substring(0,s.length-n.length):s;for(var r=h+=1,o="";;){if(" "===(i=t[h])||"\t"===i)return-1!==this.minorIndentFunctions.indexOf(o)?this.$toIndent(t.substring(0,r-1)+n):this.$toIndent(t.substring(0,h+1));if(void 0===i)return this.$toIndent(t.substring(0,r-1)+n);o+=t[h],h++}},this.getNextLineIndent=function(t,n,e){return this.$calculateIndent(n,e)},this.checkOutdent=function(t,n,e){return this.$outdent.checkOutdent(n,e)},this.autoOutdent=function(t,n,e){this.$outdent.autoOutdent(n,e)},this.$id="ace/mode/scheme"}.call(r.prototype),n.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/scheme.js.map
