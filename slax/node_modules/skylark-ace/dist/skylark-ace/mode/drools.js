/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,o,t){"use strict";var e=i("../lib/oop"),l=i("./text").Mode,s=i("./drools_highlight_rules").DroolsHighlightRules,h=i("./folding/drools").FoldMode,d=function(){this.HighlightRules=s,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};e.inherits(d,l),function(){this.lineCommentStart="//",this.$id="ace/mode/drools"}.call(d.prototype),o.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/drools.js.map
