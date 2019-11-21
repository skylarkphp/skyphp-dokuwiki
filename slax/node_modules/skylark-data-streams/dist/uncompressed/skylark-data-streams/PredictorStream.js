
define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var PredictorStream = DecodeStream.inherit({
        klassName : "PredictorStream",

        init : function(stream, params) {
            var predictor = this.predictor = params.get('Predictor') || 1;

            if (predictor <= 1)
                return stream; // no prediction
            if (predictor !== 2 && (predictor < 10 || predictor > 15))
                error('Unsupported predictor: ' + predictor);

            if (predictor === 2)
                this.readBlock = this.readBlockTiff;
            else
                this.readBlock = this.readBlockPng;

            this.stream = stream;
            this.dict = stream.dict;

            var colors = this.colors = params.get('Colors') || 1;
            var bits = this.bits = params.get('BitsPerComponent') || 8;
            var columns = this.columns = params.get('Columns') || 1;

            this.pixBytes = (colors * bits + 7) >> 3;
            this.rowBytes = (columns * colors * bits + 7) >> 3;
            DecodeStream.prototype.init.call(this);          
        },

        readBlockTiff : function () {
                var rowBytes = this.rowBytes;

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + rowBytes);

                var bits = this.bits;
                var colors = this.colors;

                var rawBytes = this.stream.getBytes(rowBytes);

                var inbuf = 0,
                    outbuf = 0;
                var inbits = 0,
                    outbits = 0;
                var pos = bufferLength;

                if (bits === 1) {
                    for (var i = 0; i < rowBytes; ++i) {
                        var c = rawBytes[i];
                        inbuf = (inbuf << 8) | c;
                        // bitwise addition is exclusive or
                        // first shift inbuf and then add
                        buffer[pos++] = (c ^ (inbuf >> colors)) & 0xFF;
                        // truncate inbuf (assumes colors < 16)
                        inbuf &= 0xFFFF;
                    }
                } else if (bits === 8) {
                    for (var i = 0; i < colors; ++i)
                        buffer[pos++] = rawBytes[i];
                    for (; i < rowBytes; ++i) {
                        buffer[pos] = buffer[pos - colors] + rawBytes[i];
                        pos++;
                    }
                } else {
                    var compArray = new Uint8Array(colors + 1);
                    var bitMask = (1 << bits) - 1;
                    var j = 0,
                        k = bufferLength;
                    var columns = this.columns;
                    for (var i = 0; i < columns; ++i) {
                        for (var kk = 0; kk < colors; ++kk) {
                            if (inbits < bits) {
                                inbuf = (inbuf << 8) | (rawBytes[j++] & 0xFF);
                                inbits += 8;
                            }
                            compArray[kk] = (compArray[kk] +
                                (inbuf >> (inbits - bits))) & bitMask;
                            inbits -= bits;
                            outbuf = (outbuf << bits) | compArray[kk];
                            outbits += bits;
                            if (outbits >= 8) {
                                buffer[k++] = (outbuf >> (outbits - 8)) & 0xFF;
                                outbits -= 8;
                            }
                        }
                    }
                    if (outbits > 0) {
                        buffer[k++] = (outbuf << (8 - outbits)) +
                            (inbuf & ((1 << (8 - outbits)) - 1));
                    }
                }
                this.bufferLength += rowBytes;
        },

        readBlockPng : function() {

                var rowBytes = this.rowBytes;
                var pixBytes = this.pixBytes;

                var predictor = this.stream.getByte();
                var rawBytes = this.stream.getBytes(rowBytes);

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + rowBytes);

                var prevRow = buffer.subarray(bufferLength - rowBytes, bufferLength);
                if (prevRow.length == 0)
                    prevRow = new Uint8Array(rowBytes);

                var j = bufferLength;
                switch (predictor) {
                    case 0:
                        for (var i = 0; i < rowBytes; ++i)
                            buffer[j++] = rawBytes[i];
                        break;
                    case 1:
                        for (var i = 0; i < pixBytes; ++i)
                            buffer[j++] = rawBytes[i];
                        for (; i < rowBytes; ++i) {
                            buffer[j] = (buffer[j - pixBytes] + rawBytes[i]) & 0xFF;
                            j++;
                        }
                        break;
                    case 2:
                        for (var i = 0; i < rowBytes; ++i)
                            buffer[j++] = (prevRow[i] + rawBytes[i]) & 0xFF;
                        break;
                    case 3:
                        for (var i = 0; i < pixBytes; ++i)
                            buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
                        for (; i < rowBytes; ++i) {
                            buffer[j] = (((prevRow[i] + buffer[j - pixBytes]) >> 1) +
                                rawBytes[i]) & 0xFF;
                            j++;
                        }
                        break;
                    case 4:
                        // we need to save the up left pixels values. the simplest way
                        // is to create a new buffer
                        for (var i = 0; i < pixBytes; ++i) {
                            var up = prevRow[i];
                            var c = rawBytes[i];
                            buffer[j++] = up + c;
                        }
                        for (; i < rowBytes; ++i) {
                            var up = prevRow[i];
                            var upLeft = prevRow[i - pixBytes];
                            var left = buffer[j - pixBytes];
                            var p = left + up - upLeft;

                            var pa = p - left;
                            if (pa < 0)
                                pa = -pa;
                            var pb = p - up;
                            if (pb < 0)
                                pb = -pb;
                            var pc = p - upLeft;
                            if (pc < 0)
                                pc = -pc;

                            var c = rawBytes[i];
                            if (pa <= pb && pa <= pc)
                                buffer[j++] = left + c;
                            else if (pb <= pc)
                                buffer[j++] = up + c;
                            else
                                buffer[j++] = upLeft + c;
                        }
                        break;
                    default:
                        error('Unsupported predictor: ' + predictor);
                }
                this.bufferLength += rowBytes;
        }
    });

    return streams.PredictorStream = PredictorStream;
});
