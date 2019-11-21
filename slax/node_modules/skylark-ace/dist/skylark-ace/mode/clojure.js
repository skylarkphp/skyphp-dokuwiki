/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,n,e){"use strict";var i=t("../lib/oop"),u=t("./text").Mode,s=t("./clojure_highlight_rules").ClojureHighlightRules,o=t("./matching_parens_outdent").MatchingParensOutdent,r=function(){this.HighlightRules=s,this.$outdent=new o,this.$behaviour=this.$defaultBehaviour};i.inherits(r,u),function(){this.lineCommentStart=";",this.minorIndentFunctions=["defn","defn-","defmacro","def","deftest","testing"],this.$toIndent=function(t){return t.split("").map(function(t){return/\s/.exec(t)?t:" "}).join("")},this.$calculateIndent=function(t,n){for(var e,i,u=this.$getIndent(t),s=0,o=t.length-1;o>=0&&("("===(i=t[o])?(s--,e=!0):"("===i||"["===i||"{"===i?(s--,e=!1):")"!==i&&"]"!==i&&"}"!==i||s++,!(s<0));o--);if(!(s<0&&e))return s<0&&!e?this.$toIndent(t.substring(0,o+1)):s>0?u=u.substring(0,u.length-n.length):u;for(var r=o+=1,h="";;){if(" "===(i=t[o])||"\t"===i)return-1!==this.minorIndentFunctions.indexOf(h)?this.$toIndent(t.substring(0,r-1)+n):this.$toIndent(t.substring(0,o+1));if(void 0===i)return this.$toIndent(t.substring(0,r-1)+n);h+=t[o],o++}},this.getNextLineIndent=function(t,n,e){return this.$calculateIndent(n,e)},this.checkOutdent=function(t,n,e){return this.$outdent.checkOutdent(n,e)},this.autoOutdent=function(t,n,e){this.$outdent.autoOutdent(n,e)},this.$id="ace/mode/clojure"}.call(r.prototype),n.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/clojure.js.map
