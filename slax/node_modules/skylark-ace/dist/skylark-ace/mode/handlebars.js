/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var h=i("../lib/oop"),l=i("./html").Mode,o=i("./handlebars_highlight_rules").HandlebarsHighlightRules,n=i("./behaviour/html").HtmlBehaviour,s=(i("./folding/html").FoldMode,function(){l.call(this),this.HighlightRules=o,this.$behaviour=new n});h.inherits(s,l),function(){this.blockComment={start:"{{!--",end:"--}}"},this.$id="ace/mode/handlebars"}.call(s.prototype),t.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/handlebars.js.map
