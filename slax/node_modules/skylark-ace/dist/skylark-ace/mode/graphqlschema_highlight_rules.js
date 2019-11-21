/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,a=function(){var e=this.createKeywordMapper({keyword:"type|interface|union|enum|schema|input|implements|extends|scalar","storage.type":"Int|Float|String|ID|Boolean"},"identifier");this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}]},this.normalizeRules()};r.inherits(a,i),t.GraphQLSchemaHighlightRules=a});
//# sourceMappingURL=../sourcemaps/mode/graphqlschema_highlight_rules.js.map
