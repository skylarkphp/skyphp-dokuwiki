/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(n,i,e){"use strict";var s=n("./lib/event"),t=function(n,i){this.onRender=n,this.pending=!1,this.changes=0,this.$recursionLimit=2,this.window=i||window;var e=this;this._flush=function(n){e.pending=!1;var i=e.changes;if(i&&(s.blockIdle(100),e.changes=0,e.onRender(i)),e.changes){if(e.$recursionLimit--<0)return;e.schedule()}else e.$recursionLimit=2}};(function(){this.schedule=function(n){this.changes=this.changes|n,this.changes&&!this.pending&&(s.nextFrame(this._flush),this.pending=!0)},this.clear=function(n){var i=this.changes;return this.changes=0,i}}).call(t.prototype),i.RenderLoop=t});
//# sourceMappingURL=sourcemaps/renderloop.js.map
