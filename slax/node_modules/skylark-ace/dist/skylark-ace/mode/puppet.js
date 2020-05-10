/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./puppet_highlight_rules").PuppetHighlightRules,h=require("./behaviour/cstyle").CstyleBehaviour,o=require("./folding/cstyle").FoldMode,l=require("./matching_brace_outdent").MatchingBraceOutdent,n=function(){e.call(this),this.HighlightRules=i,this.$outdent=new l,this.$behaviour=new h,this.foldingRules=new o};t.inherits(n,e),function(){this.$id="ace/mode/puppet"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/puppet.js.map
