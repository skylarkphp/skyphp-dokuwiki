/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var s=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,o=function(){this.$rules={start:[{token:"comment",regex:"^\\s*--.*$"},{token:["keyword"],regex:/^(\s*\w.*?)(:(?:\s+|$))/},{token:"constant.numeric",regex:/[\d_]+(?:(?:[\.\d_]*)?)/},{token:"constant.language.boolean",regex:"(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"},{token:"markup.heading",regex:/^(\w.*)$/}]}};s.inherits(o,i),t.CabalHighlightRules=o});
//# sourceMappingURL=../sourcemaps/mode/haskell_cabal_highlight_rules.js.map
