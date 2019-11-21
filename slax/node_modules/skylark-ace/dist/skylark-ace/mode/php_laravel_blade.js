/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(e,l,i){"use strict";var t=e("../lib/oop"),a=e("./php_laravel_blade_highlight_rules").PHPLaravelBladeHighlightRules,h=e("./php").Mode,s=e("./javascript").Mode,o=e("./css").Mode,d=e("./html").Mode,c=function(){h.call(this),this.HighlightRules=a,this.createModeDelegates({"js-":s,"css-":o,"html-":d})};t.inherits(c,h),function(){this.$id="ace/mode/php_laravel_blade"}.call(c.prototype),l.Mode=c});
//# sourceMappingURL=../sourcemaps/mode/php_laravel_blade.js.map
