/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";require("../range").Range;var t=require("../document").Document,e=require("../lib/lang"),i=exports.Mirror=function(i){this.sender=i;var n=this.doc=new t(""),s=this.deferredUpdate=e.delayedCall(this.onUpdate.bind(this)),a=this;i.on("change",function(t){var e=t.data;if(e[0].start)n.applyDeltas(e);else for(var i=0;i<e.length;i+=2){if(Array.isArray(e[i+1]))var r={action:"insert",start:e[i],lines:e[i+1]};else r={action:"remove",start:e[i],end:e[i+1]};n.applyDelta(r,!0)}if(a.$timeout)return s.schedule(a.$timeout);a.onUpdate()})};(function(){this.$timeout=500,this.setTimeout=function(t){this.$timeout=t},this.setValue=function(t){this.doc.setValue(t),this.deferredUpdate.schedule(this.$timeout)},this.getValue=function(t){this.sender.callback(this.doc.getValue(),t)},this.onUpdate=function(){},this.isPending=function(){return this.deferredUpdate.isPending()}}).call(i.prototype)});
//# sourceMappingURL=../sourcemaps/worker/mirror.js.map
