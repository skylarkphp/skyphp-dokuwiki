/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./yaml_highlight_rules").YamlHighlightRules,n=require("./matching_brace_outdent").MatchingBraceOutdent,h=require("./folding/coffee").FoldMode,o=function(){this.HighlightRules=i,this.$outdent=new n,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};t.inherits(o,e),function(){this.lineCommentStart=["#"],this.getNextLineIndent=function(t,e,i){var n=this.$getIndent(e);"start"==t&&(e.match(/^.*[\{\(\[]\s*$/)&&(n+=i));return n},this.checkOutdent=function(t,e,i){return this.$outdent.checkOutdent(e,i)},this.autoOutdent=function(t,e,i){this.$outdent.autoOutdent(e,i)},this.$id="ace/mode/yaml"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/yaml.js.map
