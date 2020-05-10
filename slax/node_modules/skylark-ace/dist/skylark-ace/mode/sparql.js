/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./text").Mode,t=require("./sparql_highlight_rules").SPARQLHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){this.HighlightRules=t,this.foldingRules=new l};i.inherits(o,e),function(){this.$id="ace/mode/sparql"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/sparql.js.map
