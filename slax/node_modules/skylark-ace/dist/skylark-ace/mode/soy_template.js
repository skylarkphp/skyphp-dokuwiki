/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./html").Mode,i=require("./soy_template_highlight_rules").SoyTemplateHighlightRules,l=function(){e.call(this),this.HighlightRules=i};t.inherits(l,e),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/soy_template"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/soy_template.js.map
