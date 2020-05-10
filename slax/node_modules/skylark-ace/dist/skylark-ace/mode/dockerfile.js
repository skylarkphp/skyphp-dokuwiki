/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./sh").Mode,l=require("./dockerfile_highlight_rules").DockerfileHighlightRules,o=require("./folding/cstyle").FoldMode,t=function(){e.call(this),this.HighlightRules=l,this.foldingRules=new o};i.inherits(t,e),function(){this.$id="ace/mode/dockerfile"}.call(t.prototype),exports.Mode=t});
//# sourceMappingURL=../sourcemaps/mode/dockerfile.js.map
