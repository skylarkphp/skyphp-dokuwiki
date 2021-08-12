define([
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var AsciiHexStream = DecodeStream.inherit({
        klassName : "AsciiHexStream",

        _construct : function AsciiHexStream(str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            this.firstDigit = -1;
            if (maybeLength) {
                maybeLength = 0.5 * maybeLength;
            }

            DecodeStream.prototype._construct.call(this,maybeLength);          
        },

        readBlock : function AsciiHexStream_readBlock() {
            var UPSTREAM_BLOCK_SIZE = 8000;
            var bytes = this.str.getBytes(UPSTREAM_BLOCK_SIZE);
            if (!bytes.length) {
                this.eof = true;
                return;
            }
            var maxDecodeLength = bytes.length + 1 >> 1;
            var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
            var bufferLength = this.bufferLength;
            var firstDigit = this.firstDigit;
            for (var i = 0, ii = bytes.length; i < ii; i++) {
                var ch = bytes[i], digit;
                if (ch >= 48 && ch <= 57) {
                    digit = ch & 15;
                } else if (ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {
                    digit = (ch & 15) + 9;
                } else if (ch === 62) {
                    this.eof = true;
                    break;
                } else {
                    continue;
                }
                if (firstDigit < 0) {
                    firstDigit = digit;
                } else {
                    buffer[bufferLength++] = firstDigit << 4 | digit;
                    firstDigit = -1;
                }
            }
            if (firstDigit >= 0 && this.eof) {
                buffer[bufferLength++] = firstDigit << 4;
                firstDigit = -1;
            }
            this.firstDigit = firstDigit;
            this.bufferLength = bufferLength;
        }
    });

    return streams.AsciiHexStream = AsciiHexStream;
});
