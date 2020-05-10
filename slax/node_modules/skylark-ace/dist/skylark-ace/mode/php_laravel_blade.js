/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var e=require("../lib/oop"),l=require("./php_laravel_blade_highlight_rules").PHPLaravelBladeHighlightRules,i=require("./php").Mode,t=require("./javascript").Mode,a=require("./css").Mode,h=require("./html").Mode,s=function(){i.call(this),this.HighlightRules=l,this.createModeDelegates({"js-":t,"css-":a,"html-":h})};e.inherits(s,i),function(){this.$id="ace/mode/php_laravel_blade"}.call(s.prototype),exports.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/php_laravel_blade.js.map
