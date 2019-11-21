/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var n=i("../lib/oop"),o=i("./text").Mode,l=i("./ini_highlight_rules").IniHighlightRules,h=i("./folding/ini").FoldMode,s=function(){this.HighlightRules=l,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};n.inherits(s,o),function(){this.lineCommentStart=";",this.blockComment=null,this.$id="ace/mode/ini"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/ini.js.map
