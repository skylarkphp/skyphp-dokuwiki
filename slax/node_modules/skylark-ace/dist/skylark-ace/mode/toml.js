/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),l=i("./text").Mode,h=i("./toml_highlight_rules").TomlHighlightRules,n=i("./folding/ini").FoldMode,s=function(){this.HighlightRules=h,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};o.inherits(s,l),function(){this.lineCommentStart="#",this.$id="ace/mode/toml"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/toml.js.map
