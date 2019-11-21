/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./DecodeStream"],function(t,e,i,r){var s={9:-1,32:-1,48:0,49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,65:10,66:11,67:12,68:13,69:14,70:15,97:10,98:11,99:12,100:13,101:14,102:15},n=r.inherit({klassName:"AsciiHexStream",init:function(t){this.str=t,this.dict=t.dict,r.prototype.init.call(this)},readBlock:function(){var t,e,i,r,n,a,h,f=">".charCodeAt(0),l=this.str.getBytes();for(i=l.length+1>>1,r=this.ensureBuffer(this.bufferLength+i),n=this.bufferLength,a=0,h=l.length;a<h;a++){for(t=s[l[a]];-1==t&&a+1<h;)t=s[l[++a]];a+1<h&&l[a+1]!==f?(e=s[l[++a]],r[n++]=16*t+e):l[a]!==f&&(r[n++]=16*t)}this.bufferLength=n,this.eof=!0}});return i.AsciiHexStream=n});
//# sourceMappingURL=sourcemaps/AsciiHexStream.js.map
