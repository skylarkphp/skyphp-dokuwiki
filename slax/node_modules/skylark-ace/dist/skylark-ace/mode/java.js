/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),o=i("./javascript").Mode,a=i("./java_highlight_rules").JavaHighlightRules,n=i("./folding/java").FoldMode,h=function(){o.call(this),this.HighlightRules=a,this.foldingRules=new n};l.inherits(h,o),function(){this.createWorker=function(i){return null},this.$id="ace/mode/java"}.call(h.prototype),t.Mode=h});
//# sourceMappingURL=../sourcemaps/mode/java.js.map
