/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./javascript").Mode,e=require("./gobstones_highlight_rules").GobstonesHighlightRules,o=function(){t.call(this),this.HighlightRules=e,this.$behaviour=this.$defaultBehaviour};i.inherits(o,t),function(){this.createWorker=function(i){return null},this.$id="ace/mode/gobstones"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/gobstones.js.map
