/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var n=t("../lib/oop"),u=t("./text").Mode,h=t("./textile_highlight_rules").TextileHighlightRules,o=t("./matching_brace_outdent").MatchingBraceOutdent,c=function(){this.HighlightRules=h,this.$outdent=new o,this.$behaviour=this.$defaultBehaviour};n.inherits(c,u),function(){this.type="text",this.getNextLineIndent=function(t,e,i){return"intag"==t?i:""},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/textile"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/textile.js.map
