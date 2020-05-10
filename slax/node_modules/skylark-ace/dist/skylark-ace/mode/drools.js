/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),o=require("./text").Mode,t=require("./drools_highlight_rules").DroolsHighlightRules,e=require("./folding/drools").FoldMode,l=function(){this.HighlightRules=t,this.foldingRules=new e,this.$behaviour=this.$defaultBehaviour};i.inherits(l,o),function(){this.lineCommentStart="//",this.$id="ace/mode/drools"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/drools.js.map
