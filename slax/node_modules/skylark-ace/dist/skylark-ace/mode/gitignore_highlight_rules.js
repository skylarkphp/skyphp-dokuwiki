/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text_highlight_rules").TextHighlightRules,t=function(){this.$rules={start:[{token:"comment",regex:/^\s*#.*$/},{token:"keyword",regex:/^\s*!.*$/}]},this.normalizeRules()};t.metaData={fileTypes:["gitignore"],name:"Gitignore"},e.inherits(t,i),exports.GitignoreHighlightRules=t});
//# sourceMappingURL=../sourcemaps/mode/gitignore_highlight_rules.js.map
