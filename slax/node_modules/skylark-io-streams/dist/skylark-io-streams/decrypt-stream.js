/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./streams","./decode-stream"],function(t,e){var i=e.inherit({klassName:"DecryptStream",_construct:function(t,i,s){this.str=t,this.dict=t.dict,this.decrypt=s,this.nextChunk=null,this.initialized=!1,e.prototype._construct.call(this,i)},readBlock:function(){var t;if(this.initialized?t=this.nextChunk:(t=this.str.getBytes(512),this.initialized=!0),t&&0!==t.length){this.nextChunk=this.str.getBytes(512);var e=this.nextChunk&&this.nextChunk.length>0;t=(0,this.decrypt)(t,!e);var i,s=this.bufferLength,n=t.length,h=this.ensureBuffer(s+n);for(i=0;i<n;i++)h[s++]=t[i];this.bufferLength=s}else this.eof=!0}});return t.DecryptStream=i});
//# sourceMappingURL=sourcemaps/decrypt-stream.js.map
