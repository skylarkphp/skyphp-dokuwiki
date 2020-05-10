/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./javascript").Mode,i=require("./typescript_highlight_rules").TypeScriptHighlightRules,n=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,h=require("./matching_brace_outdent").MatchingBraceOutdent,r=function(){this.HighlightRules=i,this.$outdent=new h,this.$behaviour=new n,this.foldingRules=new o};t.inherits(r,e),function(){this.createWorker=function(t){return null},this.$id="ace/mode/typescript"}.call(r.prototype),exports.Mode=r});
//# sourceMappingURL=../sourcemaps/mode/typescript.js.map
