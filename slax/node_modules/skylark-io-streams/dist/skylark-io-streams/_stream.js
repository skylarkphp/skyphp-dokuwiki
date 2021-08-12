/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-events","./streams"],function(t,e){var s=t.Emitter.inherit({klassName:"Stream",_construct:function(t,e,s,n){this.bytes=t instanceof Uint8Array?t:new Uint8Array(t),this.start=e||0,this.pos=this.start,this.end=e+s||this.bytes.length,this.dict=n},length:{get:function(){return this.end-this.start}},getByte:function(){return this.pos>=this.end?-1:this.bytes[this.pos++]},getUint16:function(){var t=this.getByte(),e=this.getByte();return-1===t||-1===e?-1:(t<<8)+e},getInt32:function(){return(this.getByte()<<24)+(this.getByte()<<16)+(this.getByte()<<8)+this.getByte()},getBytes(t,e=!1){var s=this.bytes,n=this.pos,i=this.end;if(!t){const t=s.subarray(n,i);return e?new Uint8ClampedArray(t):t}var r=n+t;r>i&&(r=i),this.pos=r;const h=s.subarray(n,r);return e?new Uint8ClampedArray(h):h},peekByte:function(){var t=this.getByte();return-1!==t&&this.pos--,t},peekBytes(t,e=!1){var s=this.getBytes(t,e);return this.pos-=s.length,s},getByteRange(t,e){return t<0&&(t=0),e>this.end&&(e=this.end),this.bytes.subarray(t,e)},skip:function(t){t||(t=1),this.pos+=t},reset:function(){this.pos=this.start},moveStart:function(){this.start=this.pos},makeSubStream:function(t,e,n){return new s(this.bytes.buffer,t,e,n)}});return e.Stream=s});
//# sourceMappingURL=sourcemaps/_stream.js.map
