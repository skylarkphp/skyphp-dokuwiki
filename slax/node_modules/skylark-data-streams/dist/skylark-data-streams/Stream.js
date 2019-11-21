/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams"],function(t,s,i){var n=s.Evented.inherit({klassName:"Stream",init:function(t,s,i,n){this.bytes=new Uint8Array(t),this.start=s||0,this.pos=this.start,this.end=s+i||this.bytes.length,this.dict=n},length:{get:function(){return this.end-this.start}},getByte:function(){return this.pos>=this.end?null:this.bytes[this.pos++]},getBytes:function(t){var s=this.bytes,i=this.pos,n=this.end;if(!t)return s.subarray(i,n);var r=i+t;return r>n&&(r=n),this.pos=r,s.subarray(i,r)},lookChar:function(){return this.pos>=this.end?null:String.fromCharCode(this.bytes[this.pos])},getChar:function(){return this.pos>=this.end?null:String.fromCharCode(this.bytes[this.pos++])},skip:function(t){t||(t=1),this.pos+=t},reset:function(){this.pos=this.start},moveStart:function(){this.start=this.pos},makeSubStream:function(t,s,i){return new n(this.bytes.buffer,t,s,i)},isStream:!0});return i.Stream=n});
//# sourceMappingURL=sourcemaps/Stream.js.map
