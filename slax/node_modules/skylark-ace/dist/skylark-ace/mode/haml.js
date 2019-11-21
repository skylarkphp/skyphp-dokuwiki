/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var h=i("../lib/oop"),l=i("./text").Mode,o=i("./haml_highlight_rules").HamlHighlightRules,n=i("./folding/coffee").FoldMode,s=function(){this.HighlightRules=o,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};h.inherits(s,l),function(){this.lineCommentStart="//",this.$id="ace/mode/haml"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/haml.js.map
