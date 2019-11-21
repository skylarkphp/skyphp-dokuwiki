/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,i,t){"use strict";var h=e("../lib/oop"),l=e("./text").Mode,o=e("./graphqlschema_highlight_rules").GraphQLSchemaHighlightRules,s=e("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=o,this.foldingRules=new s};h.inherits(n,l),function(){this.lineCommentStart="#",this.$id="ace/mode/graphqlschema"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/graphqlschema.js.map
