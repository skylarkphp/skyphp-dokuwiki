/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var l=i("../lib/oop"),o=i("./c_cpp").Mode,h=i("./nix_highlight_rules").NixHighlightRules,n=i("./folding/cstyle").FoldMode,s=function(){o.call(this),this.HighlightRules=h,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};l.inherits(s,o),function(){this.lineCommentStart="#",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/nix"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/nix.js.map
