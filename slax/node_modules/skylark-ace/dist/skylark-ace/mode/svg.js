/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var l=e("../lib/oop"),n=e("./xml").Mode,o=e("./javascript").Mode,s=e("./svg_highlight_rules").SvgHighlightRules,d=e("./folding/mixed").FoldMode,g=e("./folding/xml").FoldMode,h=e("./folding/cstyle").FoldMode,c=function(){n.call(this),this.HighlightRules=s,this.createModeDelegates({"js-":o}),this.foldingRules=new d(new g,{"js-":new h})};l.inherits(c,n),function(){this.getNextLineIndent=function(e,i,t){return this.$getIndent(i)},this.$id="ace/mode/svg"}.call(c.prototype),i.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/svg.js.map
