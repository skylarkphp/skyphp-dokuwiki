/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./DecodeStream"],function(e,t,s,r){var a=r.inherit({klassName:"StreamsSequenceStream",init:function(e){this.dict=stream.dict,r.prototype.init.call(this)},readBlock:function(){var e=this.streams;if(0!=e.length){var t=e.shift().getBytes(),s=this.bufferLength,r=s+t.length;this.ensureBuffer(r).set(t,s),this.bufferLength=r}else this.eof=!0}});return s.StreamsSequenceStream=a});
//# sourceMappingURL=sourcemaps/StreamsSequenceStream.js.map
