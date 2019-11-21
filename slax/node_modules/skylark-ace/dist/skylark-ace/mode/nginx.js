/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var n=i("../lib/oop"),l=i("./text").Mode,o=i("./nginx_highlight_rules").NginxHighlightRules,h=i("./folding/cstyle").FoldMode,s=function(){l.call(this),this.HighlightRules=o,this.foldingRules=new h};n.inherits(s,l),function(){this.lineCommentStart="#",this.$id="ace/mode/nginx"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/nginx.js.map
