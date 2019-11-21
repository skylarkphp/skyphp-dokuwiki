/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./DecodeStream"],function(e,t,r,i){var s=i.inherit({klassName:"Ascii85Stream",init:function(e){this.str=e,this.dict=e.dict,this.input=new Uint8Array(5),i.prototype.init.call(this)},readBlock:function(){for(var e="~".charCodeAt(0),t="z".charCodeAt(0),r=this.str,i=r.getByte();Lexer.isSpace(String.fromCharCode(i));)i=r.getByte();if(i&&i!==e){var s,f=this.bufferLength;if(i==t){s=this.ensureBuffer(f+4);for(var a=0;a<4;++a)s[f+a]=0;this.bufferLength+=4}else{var n=this.input;n[0]=i;for(a=1;a<5;++a){for(i=r.getByte();Lexer.isSpace(String.fromCharCode(i));)i=r.getByte();if(n[a]=i,!i||i==e)break}if(s=this.ensureBuffer(f+a-1),this.bufferLength+=a-1,a<5){for(;a<5;++a)n[a]=117;this.eof=!0}var o=0;for(a=0;a<5;++a)o=85*o+(n[a]-33);for(a=3;a>=0;--a)s[f+a]=255&o,o>>=8}}else this.eof=!0}});return r.Ascii85Stream=s});
//# sourceMappingURL=sourcemaps/Ascii85Stream.js.map
