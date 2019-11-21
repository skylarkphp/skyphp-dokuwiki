/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,o){"use strict";var t=i("../lib/oop"),l=i("./text").Mode,h=i("./bro_highlight_rules").BroHighlightRules,n=i("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=h,this.foldingRules=new n};t.inherits(s,l),function(){this.$id="ace/mode/bro"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/bro.js.map
