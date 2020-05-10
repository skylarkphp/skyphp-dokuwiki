/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),l=require("./javascript_highlight_rules").JavaScriptHighlightRules,h=require("./xml_highlight_rules").XmlHighlightRules,s=function(){h.call(this),this.embedTagRules(l,"js-","script"),this.normalizeRules()};i.inherits(s,h),exports.SvgHighlightRules=s});
//# sourceMappingURL=../sourcemaps/mode/svg_highlight_rules.js.map
