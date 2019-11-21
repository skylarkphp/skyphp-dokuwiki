/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),o=i("./text").Mode,n=i("./erlang_highlight_rules").ErlangHighlightRules,h=i("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=n,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};l.inherits(s,o),function(){this.lineCommentStart="%",this.blockComment=null,this.$id="ace/mode/erlang"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/erlang.js.map
