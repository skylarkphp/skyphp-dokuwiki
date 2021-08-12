/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./streams","./decode-stream"],function(t,e){var r=e.inherit({klassName:"FakeStream",_construct:function(t){this.dict=t.dict,e.prototype._construct.call(this)},readBlock:function(){var t=this.bufferLength;t+=1024;this.ensureBuffer(t);this.bufferLength=t},getBytes:function(t){var e,r=this.pos;if(t){for(this.ensureBuffer(r+t),e=r+t;!this.eof&&this.bufferLength<e;)this.readBlock();var s=this.bufferLength;e>s&&(e=s)}else this.eof=!0,e=this.bufferLength;return this.pos=e,this.buffer.subarray(r,e)}});return t.FakeStream=r});
//# sourceMappingURL=sourcemaps/fake-stream.js.map
