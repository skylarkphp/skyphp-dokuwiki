/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./toml_highlight_rules").TomlHighlightRules,o=require("./folding/ini").FoldMode,l=function(){this.HighlightRules=e,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour};i.inherits(l,t),function(){this.lineCommentStart="#",this.$id="ace/mode/toml"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/toml.js.map
