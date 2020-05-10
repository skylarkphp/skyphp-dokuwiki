/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),t=require("./text_highlight_rules").TextHighlightRules,n=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},n.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:!0}]}};e.inherits(n,t),n.getTagRule=function(e){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},n.getStartRule=function(e){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:e}},n.getEndRule=function(e){return{token:"comment.doc",regex:"\\*\\/",next:e}},exports.DocCommentHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/doc_comment_highlight_rules.js.map
