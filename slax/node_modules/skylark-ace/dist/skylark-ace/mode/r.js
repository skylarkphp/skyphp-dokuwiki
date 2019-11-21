/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var h=e("../unicode"),n=(e("../range").Range,e("../lib/oop")),o=e("./text").Mode,s=(e("./text_highlight_rules").TextHighlightRules,e("./r_highlight_rules").RHighlightRules),g=e("./matching_brace_outdent").MatchingBraceOutdent,r=function(){this.HighlightRules=s,this.$outdent=new g,this.$behaviour=this.$defaultBehaviour};n.inherits(r,o),function(){this.lineCommentStart="#",this.tokenRe=new RegExp("^["+h.wordChars+"._]+","g"),this.nonTokenRe=new RegExp("^(?:[^"+h.wordChars+"._]|s])+","g"),this.$id="ace/mode/r"}.call(r.prototype),t.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/r.js.map
