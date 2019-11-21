/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var h=t("../lib/oop"),n=t("./text").Mode,o=t("./text_highlight_rules").TextHighlightRules,u=t("./behaviour").Behaviour,s=function(){this.HighlightRules=o,this.$behaviour=new u};h.inherits(s,n),function(){this.type="text",this.getNextLineIndent=function(t,e,i){return""},this.$id="ace/mode/plain_text"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/plain_text.js.map
