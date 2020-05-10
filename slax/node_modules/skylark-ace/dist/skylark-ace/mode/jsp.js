/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,i=require("./jsp_highlight_rules").JspHighlightRules,o=require("./matching_brace_outdent").MatchingBraceOutdent,h=require("./behaviour/cstyle").CstyleBehaviour,n=require("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=i,this.$outdent=new o,this.$behaviour=new h,this.foldingRules=new n};e.inherits(s,t),function(){this.$id="ace/mode/jsp"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/jsp.js.map
