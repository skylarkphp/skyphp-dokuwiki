/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/oop"),e=(require("../lib/lang"),require("./scss_highlight_rules").ScssHighlightRules),n=function(){e.call(this);var t=this.$rules.start;"comment"==t[1].token&&(t.splice(1,1,{onMatch:function(t,e,n){return n.unshift(this.next,-1,t.length-2,e),"comment"},regex:/^\s*\/\*/,next:"comment"},{token:"error.invalid",regex:"/\\*|[{;}]"},{token:"support.type",regex:/^\s*:[\w\-]+\s/}),this.$rules.comment=[{regex:/^\s*/,onMatch:function(t,e,n){return-1===n[1]&&(n[1]=Math.max(n[2],t.length-1)),t.length<=n[1]?(n.shift(),n.shift(),n.shift(),this.next=n.shift(),"text"):(this.next="","comment")},next:"start"},{defaultToken:"comment"}])};t.inherits(n,e),exports.SassHighlightRules=n});
//# sourceMappingURL=../sourcemaps/mode/sass_highlight_rules.js.map
