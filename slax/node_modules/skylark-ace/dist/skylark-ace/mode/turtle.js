/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var l=t("../lib/oop"),o=t("./text").Mode,h=t("./turtle_highlight_rules").TurtleHighlightRules,n=t("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=h,this.foldingRules=new n};l.inherits(s,o),function(){this.$id="ace/mode/turtle"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/turtle.js.map
