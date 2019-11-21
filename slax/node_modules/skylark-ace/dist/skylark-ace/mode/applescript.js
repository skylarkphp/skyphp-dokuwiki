/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,e){"use strict";var l=t("../lib/oop"),o=t("./text").Mode,s=t("./applescript_highlight_rules").AppleScriptHighlightRules,h=t("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=s,this.foldingRules=new h,this.$behaviour=this.$defaultBehaviour};l.inherits(n,o),function(){this.lineCommentStart="--",this.blockComment={start:"(*",end:"*)"},this.$id="ace/mode/applescript"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/applescript.js.map
