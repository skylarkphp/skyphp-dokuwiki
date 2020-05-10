/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./text_highlight_rules").TextHighlightRules,n=require("./tex_highlight_rules").TexHighlightRules,h=require("./matching_brace_outdent").MatchingBraceOutdent,u=function(t){this.HighlightRules=t?i:n,this.$outdent=new h,this.$behaviour=this.$defaultBehaviour};t.inherits(u,e),function(){this.lineCommentStart="%",this.getNextLineIndent=function(t,e,i){return this.$getIndent(e)},this.allowAutoInsert=function(){return!1},this.$id="ace/mode/tex"}.call(u.prototype),exports.Mode=u});
//# sourceMappingURL=../sourcemaps/mode/tex.js.map
