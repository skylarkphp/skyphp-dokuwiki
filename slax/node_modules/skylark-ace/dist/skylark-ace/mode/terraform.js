/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text").Mode,i=require("./terraform_highlight_rules").TerraformHighlightRules,o=require("./behaviour/cstyle").CstyleBehaviour,h=require("./folding/cstyle").FoldMode,r=require("./matching_brace_outdent").MatchingBraceOutdent,l=function(){t.call(this),this.HighlightRules=i,this.$outdent=new r,this.$behaviour=new o,this.foldingRules=new h};e.inherits(l,t),function(){this.$id="ace/mode/terraform"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/terraform.js.map
