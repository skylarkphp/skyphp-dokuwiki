/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var l=i("../lib/oop"),o=i("./text").Mode,s=i("./sparql_highlight_rules").SPARQLHighlightRules,h=i("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=s,this.foldingRules=new h};l.inherits(n,o),function(){this.$id="ace/mode/sparql"}.call(n.prototype),e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/sparql.js.map
