/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var i=require("../lib/oop"),t=require("./html").Mode,e=require("./handlebars_highlight_rules").HandlebarsHighlightRules,h=require("./behaviour/html").HtmlBehaviour,l=(require("./folding/html").FoldMode,function(){t.call(this),this.HighlightRules=e,this.$behaviour=new h});i.inherits(l,t),function(){this.blockComment={start:"{{!--",end:"--}}"},this.$id="ace/mode/handlebars"}.call(l.prototype),exports.Mode=l});
//# sourceMappingURL=../sourcemaps/mode/handlebars.js.map
