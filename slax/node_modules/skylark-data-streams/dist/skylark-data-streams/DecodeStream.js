/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./Stream"],function(r,t,e,f){var i=f.inherit({klassName:"DecodeStream",init:function(){this.pos=0,this.bufferLength=0,this.eof=!1,this.buffer=null},ensureBuffer:function(r){var t=this.buffer,e=t?t.byteLength:0;if(r<e)return t;for(var f=512;f<r;)f<<=1;for(var i=new Uint8Array(f),s=0;s<e;++s)i[s]=t[s];return this.buffer=i},getByte:function(){for(var r=this.pos;this.bufferLength<=r;){if(this.eof)return null;this.readBlock()}return this.buffer[this.pos++]},getBytes:function(r){var t,e=this.pos;if(r){for(this.ensureBuffer(e+r),t=e+r;!this.eof&&this.bufferLength<t;)this.readBlock();var f=this.bufferLength;t>f&&(t=f)}else{for(;!this.eof;)this.readBlock();(t=this.bufferLength)||(this.buffer=new Uint8Array(0))}return this.pos=t,this.buffer.subarray(e,t)},lookChar:function(){for(var r=this.pos;this.bufferLength<=r;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos])},getChar:function(){for(var r=this.pos;this.bufferLength<=r;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos++])},makeSubStream:function(r,t,e){for(var i=r+t;this.bufferLength<=i&&!this.eof;)this.readBlock();return new f(this.buffer,r,t,e)},skip:function(r){r||(r=1),this.pos+=r},reset:function(){this.pos=0}});return e.DecodeStream=i});
//# sourceMappingURL=sourcemaps/DecodeStream.js.map
