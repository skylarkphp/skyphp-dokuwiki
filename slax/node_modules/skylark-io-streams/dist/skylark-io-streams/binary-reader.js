/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-events","./streams"],function(t,i){return t.Emitter.inherit({_construct:function(t,i){this.arrayBuffer=t,this.dataView=new DataView(t),this.isLittleEndian=i,this._pos=0},position:{get:function(){return this._pos}},getByteLength:function(){return this.arrayBuffer.byteLength},skip:function(t){this._pos=this._pos+t},end:function(){return this._pos>=this.arrayBuffer.byteLength},readBoolean:function(){var t=this.dataView.getInt8(this._pos);return this._pos=this._pos+1,!!t},readCharacter:function(){var t=this.dataView.getInt8(this._pos);return this._pos=this._pos+1,t},readUnsignedCharacter:function(){var t=this.dataView.getUint8(this._pos);return this._pos=this._pos+1,t},readInteger16:function(){var t=this.dataView.getInt16(this._pos,this.isLittleEndian);return this._pos=this._pos+2,t},readUnsignedInteger16:function(){var t=this.dataView.getUint16(this._pos,this.isLittleEndian);return this._pos=this._pos+2,t},readInteger32:function(){var t=this.dataView.getInt32(this._pos,this.isLittleEndian);return this._pos=this._pos+4,t},readUnsignedInteger32:function(){var t=this.dataView.getUint32(this._pos,this.isLittleEndian);return this._pos=this._pos+4,t},readFloat32:function(){var t=this.dataView.getFloat32(this._pos,this.isLittleEndian);return this._pos=this._pos+4,t},readDouble64:function(){var t=this.dataView.getFloat64(this._pos,this.isLittleEndian);return this._pos=this._pos+8,t}})});
//# sourceMappingURL=sourcemaps/binary-reader.js.map
