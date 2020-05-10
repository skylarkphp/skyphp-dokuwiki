/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),i=require("./text").Mode,t=require("./graphqlschema_highlight_rules").GraphQLSchemaHighlightRules,h=require("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=t,this.foldingRules=new h};e.inherits(l,i),function(){this.lineCommentStart="#",this.$id="ace/mode/graphqlschema"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/graphqlschema.js.map
