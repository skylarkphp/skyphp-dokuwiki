/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","./streams","./DecodeStream"],function(t,e,r,i){var s=i.inherit({klassName:"DecryptStream",init:function(t,e){this.str=t,this.dict=t.dict,this.decrypt=e,i.prototype.init.call(this)},readBlock:function(){var t=this.str.getBytes(512);if(t&&0!=t.length){t=(0,this.decrypt)(t);var e,r=this.bufferLength,i=t.length,s=this.ensureBuffer(r+i);for(e=0;e<i;e++)s[r++]=t[e];this.bufferLength=r}else this.eof=!0}});return r.DecryptStream=s});
//# sourceMappingURL=sourcemaps/DecryptStream.js.map
