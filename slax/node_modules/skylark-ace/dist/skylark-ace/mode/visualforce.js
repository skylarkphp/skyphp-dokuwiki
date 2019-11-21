/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,l){"use strict";var o=i("../lib/oop"),h=i("./html").Mode,t=i("./visualforce_highlight_rules").VisualforceHighlightRules,s=i("./behaviour/xml").XmlBehaviour,u=i("./folding/html").FoldMode;function n(){h.call(this),this.HighlightRules=t,this.foldingRules=new u,this.$behaviour=new s}o.inherits(n,h),n.prototype.emmetConfig={profile:"xhtml"},e.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/visualforce.js.map
