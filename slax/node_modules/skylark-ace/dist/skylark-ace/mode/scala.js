/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./javascript").Mode,e=require("./scala_highlight_rules").ScalaHighlightRules,l=function(){t.call(this),this.HighlightRules=e};i.inherits(l,t),function(){this.createWorker=function(i){return null},this.$id="ace/mode/scala"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/scala.js.map
