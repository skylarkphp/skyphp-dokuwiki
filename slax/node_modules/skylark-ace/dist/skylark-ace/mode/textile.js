/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./textile_highlight_rules").TextileHighlightRules,n=require("./matching_brace_outdent").MatchingBraceOutdent,u=function(){this.HighlightRules=i,this.$outdent=new n,this.$behaviour=this.$defaultBehaviour};t.inherits(u,e),function(){this.type="text",this.getNextLineIndent=function(t,e,i){return"intag"==t?i:""},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/textile"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/textile.js.map
