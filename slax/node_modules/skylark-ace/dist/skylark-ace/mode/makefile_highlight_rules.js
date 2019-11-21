/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,i){"use strict";var n=e("../lib/oop"),r=e("./text_highlight_rules").TextHighlightRules,o=e("./sh_highlight_rules"),a=function(){var e=this.createKeywordMapper({keyword:o.reservedKeywords,"support.function.builtin":o.languageConstructs,"invalid.deprecated":"debugger"},"string");this.$rules={start:[{token:"string.interpolated.backtick.makefile",regex:"`",next:"shell-start"},{token:"punctuation.definition.comment.makefile",regex:/#(?=.)/,next:"comment"},{token:["keyword.control.makefile"],regex:"^(?:\\s*\\b)(\\-??include|ifeq|ifneq|ifdef|ifndef|else|endif|vpath|export|unexport|define|endef|override)(?:\\b)"},{token:["entity.name.function.makefile","text"],regex:"^([^\\t ]+(?:\\s[^\\t ]+)*:)(\\s*.*)"}],comment:[{token:"punctuation.definition.comment.makefile",regex:/.+\\/},{token:"punctuation.definition.comment.makefile",regex:".+",next:"start"}],"shell-start":[{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"string",regex:"\\w+"},{token:"string.interpolated.backtick.makefile",regex:"`",next:"start"}]}};n.inherits(a,r),t.MakefileHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/makefile_highlight_rules.js.map
