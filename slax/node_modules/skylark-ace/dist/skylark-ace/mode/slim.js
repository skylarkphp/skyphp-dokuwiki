/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var s=require("../lib/oop"),e=require("./text").Mode,i=require("./slim_highlight_rules").SlimHighlightRules,o=function(){e.call(this),this.HighlightRules=i,this.createModeDelegates({javascript:require("./javascript").Mode,markdown:require("./markdown").Mode,coffee:require("./coffee").Mode,scss:require("./scss").Mode,sass:require("./sass").Mode,less:require("./less").Mode,ruby:require("./ruby").Mode,css:require("./css").Mode})};s.inherits(o,e),function(){this.$id="ace/mode/slim"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/slim.js.map
