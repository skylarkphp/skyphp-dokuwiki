/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(s,e,i){"use strict";var o=s("../lib/oop"),t=s("./text").Mode,l=s("./slim_highlight_rules").SlimHighlightRules,c=function(){t.call(this),this.HighlightRules=l,this.createModeDelegates({javascript:s("./javascript").Mode,markdown:s("./markdown").Mode,coffee:s("./coffee").Mode,scss:s("./scss").Mode,sass:s("./sass").Mode,less:s("./less").Mode,ruby:s("./ruby").Mode,css:s("./css").Mode})};o.inherits(c,t),function(){this.$id="ace/mode/slim"}.call(c.prototype),e.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/slim.js.map
