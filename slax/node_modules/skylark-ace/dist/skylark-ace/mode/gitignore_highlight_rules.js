/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var n=e("../lib/oop"),s=e("./text_highlight_rules").TextHighlightRules,r=function(){this.$rules={start:[{token:"comment",regex:/^\s*#.*$/},{token:"keyword",regex:/^\s*!.*$/}]},this.normalizeRules()};r.metaData={fileTypes:["gitignore"],name:"Gitignore"},n.inherits(r,s),i.GitignoreHighlightRules=r});
//# sourceMappingURL=../sourcemaps/mode/gitignore_highlight_rules.js.map
