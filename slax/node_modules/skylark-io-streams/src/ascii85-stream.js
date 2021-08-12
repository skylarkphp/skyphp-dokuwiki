define([
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {


    var Ascii85Stream = DecodeStream.inherit({
        klassName : "Ascii85Stream",

        _construct : function(str) {
            this.str = str;
            this.dict = str.dict;
            this.input = new Uint8Array(5);
            if (maybeLength) {
                maybeLength = 0.8 * maybeLength;
            }
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function Ascii85Stream_readBlock() {
            var TILDA_CHAR = 126;
            var Z_LOWER_CHAR = 122;
            var EOF = -1;
            var str = this.str;
            var c = str.getByte();
            while (chars.isWhiteSpace(c)) {
                c = str.getByte();
            }
            if (c === EOF || c === TILDA_CHAR) {
                this.eof = true;
                return;
            }
            var bufferLength = this.bufferLength, buffer;
            var i;
            if (c === Z_LOWER_CHAR) {
                buffer = this.ensureBuffer(bufferLength + 4);
                for (i = 0; i < 4; ++i) {
                    buffer[bufferLength + i] = 0;
                }
                this.bufferLength += 4;
            } else {
                var input = this.input;
                input[0] = c;
                for (i = 1; i < 5; ++i) {
                    c = str.getByte();
                    while (chars.isWhiteSpace(c)) {
                        c = str.getByte();
                    }
                    input[i] = c;
                    if (c === EOF || c === TILDA_CHAR) {
                        break;
                    }
                }
                buffer = this.ensureBuffer(bufferLength + i - 1);
                this.bufferLength += i - 1;
                if (i < 5) {
                    for (; i < 5; ++i) {
                        input[i] = 33 + 84;
                    }
                    this.eof = true;
                }
                var t = 0;
                for (i = 0; i < 5; ++i) {
                    t = t * 85 + (input[i] - 33);
                }
                for (i = 3; i >= 0; --i) {
                    buffer[bufferLength + i] = t & 255;
                    t >>= 8;
                }
            }
        }

    });

    return streams.Ascii85Stream = Ascii85Stream;

});
