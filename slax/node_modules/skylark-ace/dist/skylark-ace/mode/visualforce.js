/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./html").Mode,l=require("./visualforce_highlight_rules").VisualforceHighlightRules,o=require("./behaviour/xml").XmlBehaviour,h=require("./folding/html").FoldMode;function t(){e.call(this),this.HighlightRules=l,this.foldingRules=new h,this.$behaviour=new o}i.inherits(t,e),t.prototype.emmetConfig={profile:"xhtml"},exports.Mode=t});
//# sourceMappingURL=../sourcemaps/mode/visualforce.js.map
