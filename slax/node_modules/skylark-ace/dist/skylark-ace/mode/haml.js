/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./haml_highlight_rules").HamlHighlightRules,h=require("./folding/coffee").FoldMode,l=function(){this.HighlightRules=t,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};i.inherits(l,e),function(){this.lineCommentStart="//",this.$id="ace/mode/haml"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/haml.js.map
