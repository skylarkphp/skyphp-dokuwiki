/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-chars","./streams","./decode-stream"],function(t,e,r){var s=r.inherit({klassName:"RunLengthStream",_construct:function(t,e){this.str=t,this.dict=t.dict,r.prototype._construct.call(this,e)},readBlock:function(){var t=this.str.getBytes(2);if(!t||t.length<2||128===t[0])this.eof=!0;else{var e,r=this.bufferLength,s=t[0];if(s<128){if((e=this.ensureBuffer(r+s+1))[r++]=t[1],s>0){var i=this.str.getBytes(s);e.set(i,r),r+=s}}else{s=257-s;var n=t[1];e=this.ensureBuffer(r+s+1);for(var a=0;a<s;a++)e[r++]=n}this.bufferLength=r}}});return e.RunLengthStream=s});
//# sourceMappingURL=sourcemaps/run-length-stream.js.map
