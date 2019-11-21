/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var l=t("../lib/oop"),o=t("./html").Mode,h=t("./soy_template_highlight_rules").SoyTemplateHighlightRules,s=function(){o.call(this),this.HighlightRules=h};l.inherits(s,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/soy_template"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/soy_template.js.map
