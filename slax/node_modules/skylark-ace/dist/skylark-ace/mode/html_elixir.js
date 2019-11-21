/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var l=i("../lib/oop"),s=i("./html_elixir_highlight_rules").HtmlElixirHighlightRules,h=i("./html").Mode,o=i("./javascript").Mode,r=i("./css").Mode,c=i("./elixir").Mode,d=function(){h.call(this),this.HighlightRules=s,this.createModeDelegates({"js-":o,"css-":r,"elixir-":c})};l.inherits(d,h),function(){this.$id="ace/mode/html_elixir"}.call(d.prototype),e.Mode=d});
//# sourceMappingURL=../sourcemaps/mode/html_elixir.js.map
