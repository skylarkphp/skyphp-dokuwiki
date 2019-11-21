/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,o){"use strict";var i=t("../lib/oop"),l=t("./html").Mode,n=t("./razor_highlight_rules").RazorHighlightRules,r=t("./razor_completions").RazorCompletions,h=t("./html_completions").HtmlCompletions,s=function(){l.call(this),this.$highlightRules=new n,this.$completer=new r,this.$htmlCompleter=new h};i.inherits(s,l),function(){this.getCompletions=function(t,e,o,i){var l=this.$completer.getCompletions(t,e,o,i),n=this.$htmlCompleter.getCompletions(t,e,o,i);return l.concat(n)},this.createWorker=function(t){return null},this.$id="ace/mode/razor"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/razor.js.map
