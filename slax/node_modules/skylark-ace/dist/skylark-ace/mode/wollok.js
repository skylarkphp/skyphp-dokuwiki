/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),l=require("./javascript").Mode,t=require("./wollok_highlight_rules").WollokHighlightRules,o=function(){l.call(this),this.HighlightRules=t};i.inherits(o,l),function(){this.createWorker=function(i){return null},this.$id="ace/mode/wollok"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/wollok.js.map
