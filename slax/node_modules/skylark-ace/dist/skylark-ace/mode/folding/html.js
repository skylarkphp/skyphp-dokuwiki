/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../../lib/oop"),o=require("./mixed").FoldMode,d=require("./xml").FoldMode,i=require("./cstyle").FoldMode,l=exports.FoldMode=function(e,l){o.call(this,new d(e,l),{"js-":new i,"css-":new i})};e.inherits(l,o)});
//# sourceMappingURL=../../sourcemaps/mode/folding/html.js.map
