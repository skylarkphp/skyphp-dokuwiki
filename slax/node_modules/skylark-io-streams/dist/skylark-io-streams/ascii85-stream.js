/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-chars","./streams","./decode-stream"],function(e,t,r){var i=r.inherit({klassName:"Ascii85Stream",_construct:function(e){this.str=e,this.dict=e.dict,this.input=new Uint8Array(5),maybeLength&&(maybeLength*=.8),r.prototype._construct.call(this,maybeLength)},readBlock:function(){for(var t=this.str,r=t.getByte();e.isWhiteSpace(r);)r=t.getByte();if(-1!==r&&126!==r){var i,s,f=this.bufferLength;if(122===r){for(i=this.ensureBuffer(f+4),s=0;s<4;++s)i[f+s]=0;this.bufferLength+=4}else{var n=this.input;for(n[0]=r,s=1;s<5;++s){for(r=t.getByte();e.isWhiteSpace(r);)r=t.getByte();if(n[s]=r,-1===r||126===r)break}if(i=this.ensureBuffer(f+s-1),this.bufferLength+=s-1,s<5){for(;s<5;++s)n[s]=117;this.eof=!0}var a=0;for(s=0;s<5;++s)a=85*a+(n[s]-33);for(s=3;s>=0;--s)i[f+s]=255&a,a>>=8}}else this.eof=!0}});return t.Ascii85Stream=i});
//# sourceMappingURL=sourcemaps/ascii85-stream.js.map
