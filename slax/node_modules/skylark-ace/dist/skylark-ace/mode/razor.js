/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./html").Mode,o=require("./razor_highlight_rules").RazorHighlightRules,i=require("./razor_completions").RazorCompletions,l=require("./html_completions").HtmlCompletions,n=function(){e.call(this),this.$highlightRules=new o,this.$completer=new i,this.$htmlCompleter=new l};t.inherits(n,e),function(){this.getCompletions=function(t,e,o,i){var l=this.$completer.getCompletions(t,e,o,i),n=this.$htmlCompleter.getCompletions(t,e,o,i);return l.concat(n)},this.createWorker=function(t){return null},this.$id="ace/mode/razor"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/razor.js.map
