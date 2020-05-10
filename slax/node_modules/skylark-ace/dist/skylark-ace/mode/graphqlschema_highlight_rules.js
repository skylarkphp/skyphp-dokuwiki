/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text_highlight_rules").TextHighlightRules,n=function(){var e=this.createKeywordMapper({keyword:"type|interface|union|enum|schema|input|implements|extends|scalar","storage.type":"Int|Float|String|ID|Boolean"},"identifier");this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}]},this.normalizeRules()};e.inherits(n,t),exports.GraphQLSchemaHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/graphqlschema_highlight_rules.js.map
