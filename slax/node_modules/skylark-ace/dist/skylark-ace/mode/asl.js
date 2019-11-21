/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var l=i("../lib/oop"),o=i("./text").Mode,h=i("./asl_highlight_rules").ASLHighlightRules,s=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};l.inherits(n,o),function(){this.$id="ace/mode/asl"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/asl.js.map
