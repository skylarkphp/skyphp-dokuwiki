/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,l){"use strict";var o=i("../lib/oop"),t=i("./sh").Mode,h=i("./dockerfile_highlight_rules").DockerfileHighlightRules,s=i("./folding/cstyle").FoldMode,c=function(){t.call(this),this.HighlightRules=h,this.foldingRules=new s};o.inherits(c,t),function(){this.$id="ace/mode/dockerfile"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/dockerfile.js.map
