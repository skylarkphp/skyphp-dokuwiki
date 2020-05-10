/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=require("./text").Mode,i=require("./text_highlight_rules").TextHighlightRules,h=require("./behaviour").Behaviour,n=function(){this.HighlightRules=i,this.$behaviour=new h};t.inherits(n,e),function(){this.type="text",this.getNextLineIndent=function(t,e,i){return""},this.$id="ace/mode/plain_text"}.call(n.prototype),exports.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/plain_text.js.map
