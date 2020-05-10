/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var n=require("./lib/event"),i=function(i,e){this.onRender=i,this.pending=!1,this.changes=0,this.$recursionLimit=2,this.window=e||window;var s=this;this._flush=function(i){s.pending=!1;var e=s.changes;if(e&&(n.blockIdle(100),s.changes=0,s.onRender(e)),s.changes){if(s.$recursionLimit--<0)return;s.schedule()}else s.$recursionLimit=2}};(function(){this.schedule=function(i){this.changes=this.changes|i,this.changes&&!this.pending&&(n.nextFrame(this._flush),this.pending=!0)},this.clear=function(n){var i=this.changes;return this.changes=0,i}}).call(i.prototype),exports.RenderLoop=i});
//# sourceMappingURL=sourcemaps/renderloop.js.map
