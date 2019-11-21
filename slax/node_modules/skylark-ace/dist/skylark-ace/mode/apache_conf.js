/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(i,e,t){"use strict";var o=i("../lib/oop"),h=i("./text").Mode,l=i("./apache_conf_highlight_rules").ApacheConfHighlightRules,n=i("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=l,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};o.inherits(s,h),function(){this.lineCommentStart="#",this.$id="ace/mode/apache_conf"}.call(s.prototype),e.Mode=s});
//# sourceMappingURL=../sourcemaps/mode/apache_conf.js.map
