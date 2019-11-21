/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,i,o){"use strict";var e=t("../lib/oop"),l=t("./text").Mode,h=t("./prolog_highlight_rules").PrologHighlightRules,s=t("./folding/cstyle").FoldMode,n=function(){this.HighlightRules=h,this.foldingRules=new s,this.$behaviour=this.$defaultBehaviour};e.inherits(n,l),function(){this.lineCommentStart="%",this.blockComment={start:"/*",end:"*/"},this.$id="ace/mode/prolog"}.call(n.prototype),i.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/prolog.js.map
