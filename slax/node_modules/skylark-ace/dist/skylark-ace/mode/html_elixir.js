/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),e=require("./html_elixir_highlight_rules").HtmlElixirHighlightRules,t=require("./html").Mode,l=require("./javascript").Mode,s=require("./css").Mode,h=require("./elixir").Mode,o=function(){t.call(this),this.HighlightRules=e,this.createModeDelegates({"js-":l,"css-":s,"elixir-":h})};i.inherits(o,t),function(){this.$id="ace/mode/html_elixir"}.call(o.prototype),exports.Mode=o});
//# sourceMappingURL=../sourcemaps/mode/html_elixir.js.map
