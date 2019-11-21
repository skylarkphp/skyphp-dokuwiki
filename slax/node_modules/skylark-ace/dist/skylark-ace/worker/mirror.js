/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(t,e,i){"use strict";t("../range").Range;var n=t("../document").Document,s=t("../lib/lang"),a=e.Mirror=function(t){this.sender=t;var e=this.doc=new n(""),i=this.deferredUpdate=s.delayedCall(this.onUpdate.bind(this)),a=this;t.on("change",function(t){var n=t.data;if(n[0].start)e.applyDeltas(n);else for(var s=0;s<n.length;s+=2){if(Array.isArray(n[s+1]))var r={action:"insert",start:n[s],lines:n[s+1]};else r={action:"remove",start:n[s],end:n[s+1]};e.applyDelta(r,!0)}if(a.$timeout)return i.schedule(a.$timeout);a.onUpdate()})};(function(){this.$timeout=500,this.setTimeout=function(t){this.$timeout=t},this.setValue=function(t){this.doc.setValue(t),this.deferredUpdate.schedule(this.$timeout)},this.getValue=function(t){this.sender.callback(this.doc.getValue(),t)},this.onUpdate=function(){},this.isPending=function(){return this.deferredUpdate.isPending()}}).call(a.prototype)});
//# sourceMappingURL=../sourcemaps/worker/mirror.js.map
