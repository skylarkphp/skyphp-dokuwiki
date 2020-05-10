/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./c_cpp").Mode,e=require("./nix_highlight_rules").NixHighlightRules,l=require("./folding/cstyle").FoldMode,o=function(){t.call(this),this.HighlightRules=e,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.lineCommentStart="#",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/nix"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/nix.js.map
