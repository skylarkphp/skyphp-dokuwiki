/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./javascript").Mode,e=require("./java_highlight_rules").JavaHighlightRules,l=require("./folding/java").FoldMode,o=function(){t.call(this),this.HighlightRules=e,this.foldingRules=new l};i.inherits(o,t),function(){this.createWorker=function(i){return null},this.$id="ace/mode/java"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/java.js.map
