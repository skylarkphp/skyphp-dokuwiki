/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var s=i("../lib/oop"),o=i("./text").Mode,h=i("./sass_highlight_rules").SassHighlightRules,l=i("./folding/coffee").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};s.inherits(n,o),function(){this.lineCommentStart="//",this.$id="ace/mode/sass"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/sass.js.map
