/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./javascript").Mode,i=require("./sjs_highlight_rules").SJSHighlightRules,n=require("./matching_brace_outdent").MatchingBraceOutdent,o=require("./behaviour/cstyle").CstyleBehaviour,s=require("./folding/cstyle").FoldMode,h=function(){this.HighlightRules=i,this.$outdent=new n,this.$behaviour=new o,this.foldingRules=new s};e.inherits(h,t),function(){this.createWorker=function(e){return null},this.$id="ace/mode/sjs"}.call(h.prototype),exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/sjs.js.map
