/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-chars","./streams","./decode-stream"],function(e,t,s){var r=s.inherit({klassName:"StreamsSequenceStream",_construct:function(e){this.streams=e;let t=0;for(let r=0,a=e.length;r<a;r++){const a=e[r];t+=a instanceof s?a._rawMinBufferLength:a.length}s.prototype._construct.call(this,t)},readBlock:function(){var e=this.streams;if(0!==t.length){e.shift();var s=e.getBytes(),r=this.bufferLength,a=r+s.length;this.ensureBuffer(a).set(s,r),this.bufferLength=a}else this.eof=!0},getBaseStreams:function(){for(var e=[],t=0,s=this.streams.length;t<s;t++){var r=this.streams[t];r.getBaseStreams&&e.push(...r.getBaseStreams())}return e}});return t.StreamsSequenceStream=r});
//# sourceMappingURL=sourcemaps/streams-sequence-stream.js.map
