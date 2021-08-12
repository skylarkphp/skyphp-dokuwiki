define([
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {


    var PredictorStream = DecodeStream.inherit({
        klassName : "PredictorStream",

        _construct : function (str, maybeLength, params) {
            if (!primitives.isDict(params)) {
                return str;
            }
            var predictor = this.predictor = params.get('Predictor') || 1;
            if (predictor <= 1) {
                return str;
            }
            if (predictor !== 2 && (predictor < 10 || predictor > 15)) {
                //throw new util.FormatError(`Unsupported predictor: ${ predictor }`);
                throw new Error(`Unsupported predictor: ${ predictor }`);
            }
            if (predictor === 2) {
                this.readBlock = this.readBlockTiff;
            } else {
                this.readBlock = this.readBlockPng;
            }
            this.str = str;
            this.dict = str.dict;
            var colors = this.colors = params.get('Colors') || 1;
            var bits = this.bits = params.get('BitsPerComponent') || 8;
            var columns = this.columns = params.get('Columns') || 1;
            this.pixBytes = colors * bits + 7 >> 3;
            this.rowBytes = columns * colors * bits + 7 >> 3;
            DecodeStream.call(this, maybeLength);
            return this;
        },

        readBlockTiff : function predictorStreamReadBlockTiff() {
            var rowBytes = this.rowBytes;
            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var bits = this.bits;
            var colors = this.colors;
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;
            if (this.eof) {
                return;
            }
            var inbuf = 0, outbuf = 0;
            var inbits = 0, outbits = 0;
            var pos = bufferLength;
            var i;
            if (bits === 1 && colors === 1) {
                for (i = 0; i < rowBytes; ++i) {
                    var c = rawBytes[i] ^ inbuf;
                    c ^= c >> 1;
                    c ^= c >> 2;
                    c ^= c >> 4;
                    inbuf = (c & 1) << 7;
                    buffer[pos++] = c;
                }
            } else if (bits === 8) {
                for (i = 0; i < colors; ++i) {
                    buffer[pos++] = rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[pos] = buffer[pos - colors] + rawBytes[i];
                    pos++;
                }
            } else if (bits === 16) {
                var bytesPerPixel = colors * 2;
                for (i = 0; i < bytesPerPixel; ++i) {
                    buffer[pos++] = rawBytes[i];
                }
                for (; i < rowBytes; i += 2) {
                    var sum = ((rawBytes[i] & 255) << 8) + (rawBytes[i + 1] & 255) + ((buffer[pos - bytesPerPixel] & 255) << 8) + (buffer[pos - bytesPerPixel + 1] & 255);
                    buffer[pos++] = sum >> 8 & 255;
                    buffer[pos++] = sum & 255;
                }
            } else {
                var compArray = new Uint8Array(colors + 1);
                var bitMask = (1 << bits) - 1;
                var j = 0, k = bufferLength;
                var columns = this.columns;
                for (i = 0; i < columns; ++i) {
                    for (var kk = 0; kk < colors; ++kk) {
                        if (inbits < bits) {
                            inbuf = inbuf << 8 | rawBytes[j++] & 255;
                            inbits += 8;
                        }
                        compArray[kk] = compArray[kk] + (inbuf >> inbits - bits) & bitMask;
                        inbits -= bits;
                        outbuf = outbuf << bits | compArray[kk];
                        outbits += bits;
                        if (outbits >= 8) {
                            buffer[k++] = outbuf >> outbits - 8 & 255;
                            outbits -= 8;
                        }
                    }
                }
                if (outbits > 0) {
                    buffer[k++] = (outbuf << 8 - outbits) + (inbuf & (1 << 8 - outbits) - 1);
                }
            }
            this.bufferLength += rowBytes;
        },

        readBlockPng : function predictorStreamReadBlockPng() {
            var rowBytes = this.rowBytes;
            var pixBytes = this.pixBytes;
            var predictor = this.str.getByte();
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;
            if (this.eof) {
                return;
            }
            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var prevRow = buffer.subarray(bufferLength - rowBytes, bufferLength);
            if (prevRow.length === 0) {
                prevRow = new Uint8Array(rowBytes);
            }
            var i, j = bufferLength, up, c;
            switch (predictor) {
            case 0:
                for (i = 0; i < rowBytes; ++i) {
                    buffer[j++] = rawBytes[i];
                }
                break;
            case 1:
                for (i = 0; i < pixBytes; ++i) {
                    buffer[j++] = rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[j] = buffer[j - pixBytes] + rawBytes[i] & 255;
                    j++;
                }
                break;
            case 2:
                for (i = 0; i < rowBytes; ++i) {
                    buffer[j++] = prevRow[i] + rawBytes[i] & 255;
                }
                break;
            case 3:
                for (i = 0; i < pixBytes; ++i) {
                    buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[j] = (prevRow[i] + buffer[j - pixBytes] >> 1) + rawBytes[i] & 255;
                    j++;
                }
                break;
            case 4:
                for (i = 0; i < pixBytes; ++i) {
                    up = prevRow[i];
                    c = rawBytes[i];
                    buffer[j++] = up + c;
                }
                for (; i < rowBytes; ++i) {
                    up = prevRow[i];
                    var upLeft = prevRow[i - pixBytes];
                    var left = buffer[j - pixBytes];
                    var p = left + up - upLeft;
                    var pa = p - left;
                    if (pa < 0) {
                        pa = -pa;
                    }
                    var pb = p - up;
                    if (pb < 0) {
                        pb = -pb;
                    }
                    var pc = p - upLeft;
                    if (pc < 0) {
                        pc = -pc;
                    }
                    c = rawBytes[i];
                    if (pa <= pb && pa <= pc) {
                        buffer[j++] = left + c;
                    } else if (pb <= pc) {
                        buffer[j++] = up + c;
                    } else {
                        buffer[j++] = upLeft + c;
                    }
                }
                break;
            default:
                //throw new util.FormatError(`Unsupported predictor: ${ predictor }`);
                throw new Error(`Unsupported predictor: ${ predictor }`);
            }
            this.bufferLength += rowBytes;
        }
    });

    return streams.PredictorStream = PredictorStream;
});
