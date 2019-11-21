/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";var h=t("../lib/oop"),o=t("./text").Mode,l=t("./puppet_highlight_rules").PuppetHighlightRules,n=t("./behaviour/cstyle").CstyleBehaviour,u=t("./folding/cstyle").FoldMode,s=t("./matching_brace_outdent").MatchingBraceOutdent,c=function(){o.call(this),this.HighlightRules=l,this.$outdent=new s,this.$behaviour=new n,this.foldingRules=new u};h.inherits(c,o),function(){this.$id="ace/mode/puppet"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/puppet.js.map
