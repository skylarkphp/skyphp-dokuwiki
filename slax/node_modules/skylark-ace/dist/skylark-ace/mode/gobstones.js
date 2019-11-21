/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,t,e){"use strict";var o=i("../lib/oop"),s=i("./javascript").Mode,h=i("./gobstones_highlight_rules").GobstonesHighlightRules,n=function(){s.call(this),this.HighlightRules=h,this.$behaviour=this.$defaultBehaviour};o.inherits(n,s),function(){this.createWorker=function(i){return null},this.$id="ace/mode/gobstones"}.call(n.prototype),t.Mode=n});
//# sourceMappingURL=../sourcemaps/mode/gobstones.js.map
