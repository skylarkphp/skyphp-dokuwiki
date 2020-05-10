/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../unicode"),t=(require("../range").Range,require("../lib/oop")),i=require("./text").Mode,h=(require("./text_highlight_rules").TextHighlightRules,require("./r_highlight_rules").RHighlightRules),n=require("./matching_brace_outdent").MatchingBraceOutdent,o=function(){this.HighlightRules=h,this.$outdent=new n,this.$behaviour=this.$defaultBehaviour};t.inherits(o,i),function(){this.lineCommentStart="#",this.tokenRe=new RegExp("^["+e.wordChars+"._]+","g"),this.nonTokenRe=new RegExp("^(?:[^"+e.wordChars+"._]|s])+","g"),this.$id="ace/mode/r"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/r.js.map
