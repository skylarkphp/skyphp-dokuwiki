/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./makefile_highlight_rules").MakefileHighlightRules,h=require("./folding/coffee").FoldMode,l=function(){this.HighlightRules=t,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};i.inherits(l,e),function(){this.lineCommentStart="#",this.$indentWithTabs=!0,this.$id="ace/mode/makefile"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/makefile.js.map
