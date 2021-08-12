define([
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {

    var RunLengthStream = DecodeStream.inherit({
        klassName : "RunLengthStream",

        _construct : function (str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function RunLengthStream_readBlock() {
            var repeatHeader = this.str.getBytes(2);
            if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] === 128) {
                this.eof = true;
                return;
            }
            var buffer;
            var bufferLength = this.bufferLength;
            var n = repeatHeader[0];
            if (n < 128) {
                buffer = this.ensureBuffer(bufferLength + n + 1);
                buffer[bufferLength++] = repeatHeader[1];
                if (n > 0) {
                    var source = this.str.getBytes(n);
                    buffer.set(source, bufferLength);
                    bufferLength += n;
                }
            } else {
                n = 257 - n;
                var b = repeatHeader[1];
                buffer = this.ensureBuffer(bufferLength + n + 1);
                for (var i = 0; i < n; i++) {
                    buffer[bufferLength++] = b;
                }
            }
            this.bufferLength = bufferLength;
        }
    });

    return streams.RunLengthStream = RunLengthStream;

});
