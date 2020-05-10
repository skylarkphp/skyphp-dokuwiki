/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./text").Mode,e=require("./nginx_highlight_rules").NginxHighlightRules,n=require("./folding/cstyle").FoldMode,l=function(){t.call(this),this.HighlightRules=e,this.foldingRules=new n};i.inherits(l,t),function(){this.lineCommentStart="#",this.$id="ace/mode/nginx"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/nginx.js.map
