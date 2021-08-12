/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./streams","./decode-stream"],function(t,i){var e=i.inherit({klassName:"AsciiHexStream",_construct:function(t,e){this.str=t,this.dict=t.dict,this.firstDigit=-1,e&&(e*=.5),i.prototype._construct.call(this,e)},readBlock:function(){var t=this.str.getBytes(8e3);if(t.length){for(var i=t.length+1>>1,e=this.ensureBuffer(this.bufferLength+i),s=this.bufferLength,r=this.firstDigit,f=0,h=t.length;f<h;f++){var n,c=t[f];if(c>=48&&c<=57)n=15&c;else{if(!(c>=65&&c<=70||c>=97&&c<=102)){if(62===c){this.eof=!0;break}continue}n=9+(15&c)}r<0?r=n:(e[s++]=r<<4|n,r=-1)}r>=0&&this.eof&&(e[s++]=r<<4,r=-1),this.firstDigit=r,this.bufferLength=s}else this.eof=!0}});return t.AsciiHexStream=e});
//# sourceMappingURL=sourcemaps/ascii-hex-stream.js.map
