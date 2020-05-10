/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./xml").Mode,t=require("./javascript").Mode,l=require("./svg_highlight_rules").SvgHighlightRules,n=require("./folding/mixed").FoldMode,o=require("./folding/xml").FoldMode,s=require("./folding/cstyle").FoldMode,d=function(){i.call(this),this.HighlightRules=l,this.createModeDelegates({"js-":t}),this.foldingRules=new n(new o,{"js-":new s})};e.inherits(d,i),function(){this.getNextLineIndent=function(e,i,t){return this.$getIndent(i)},this.$id="ace/mode/svg"}.call(d.prototype),exports.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/svg.js.map
