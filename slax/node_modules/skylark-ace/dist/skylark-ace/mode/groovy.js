/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./javascript").Mode,o=require("./groovy_highlight_rules").GroovyHighlightRules,e=function(){t.call(this),this.HighlightRules=o};i.inherits(e,t),function(){this.createWorker=function(i){return null},this.$id="ace/mode/groovy"}.call(e.prototype),exports.Mode=e});
//# sourceMappingURL=../sourcemaps/mode/groovy.js.map
