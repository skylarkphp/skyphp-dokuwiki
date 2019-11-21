/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,l=i("./verilog_highlight_rules").VerilogHighlightRules,s=(i("../range").Range,function(){this.HighlightRules=l,this.$behaviour=this.$defaultBehaviour});o.inherits(s,h),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$quotes={'"':'"'},this.$id="ace/mode/verilog"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/verilog.js.map
