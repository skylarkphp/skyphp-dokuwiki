define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams"
], function(skylark, langx,streams) {

   	var BinaryReader = langx.Evented.inherit({

		init : function (arrayBuffer, isLittleEndian) 	{
			this.arrayBuffer = arrayBuffer;
			this.dataView = new DataView (arrayBuffer);
			this.isLittleEndian = isLittleEndian;
			this._pos = 0;
		},

		position : {
			get : function () {
				return this._pos;
			}
		},

		getByteLength : function () {
			return this.arrayBuffer.byteLength;
		},

		skip : function (bytes) {
			this._pos = this._pos + bytes;
		},

		end : function () {
			return this._pos >= this.arrayBuffer.byteLength;
		},

		readBoolean : function () {
			var result = this.dataView.getInt8 (this._pos);
			this._pos = this._pos + 1;
			return result ? true : false;
		},

		readCharacter : function () {
			var result = this.dataView.getInt8 (this._pos);
			this._pos = this._pos + 1;
			return result;
		},

		readUnsignedCharacter : function () {
			var result = this.dataView.getUint8 (this._pos);
			this._pos = this._pos + 1;
			return result;
		},

		readInteger16 : function () {
			var result = this.dataView.getInt16 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 2;
			return result;
		},

		readUnsignedInteger16 : function () {
			var result = this.dataView.getUint16 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 2;
			return result;
		},

		readInteger32 : function () {
			var result = this.dataView.getInt32 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 4;
			return result;
		},

		readUnsignedInteger32 : function () {
			var result = this.dataView.getUint32 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 4;
			return result;
		},

		readFloat32 : function () {
			var result = this.dataView.getFloat32 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 4;
			return result;
		},

		readDouble64 : function () {
			var result = this.dataView.getFloat64 (this._pos, this.isLittleEndian);
			this._pos = this._pos + 8;
			return result;
		}
	});

	return BinaryReader;
});
