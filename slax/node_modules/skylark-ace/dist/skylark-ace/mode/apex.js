/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("../mode/text").Mode,i=require("./apex_highlight_rules").ApexHighlightRules,o=require("../mode/folding/cstyle").FoldMode,l=require("../mode/behaviour/cstyle").CstyleBehaviour;function h(){t.call(this),this.HighlightRules=i,this.foldingRules=new o,this.$behaviour=new l}e.inherits(h,t),h.prototype.lineCommentStart="//",h.prototype.blockComment={start:"/*",end:"*/"},exports.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/apex.js.map
