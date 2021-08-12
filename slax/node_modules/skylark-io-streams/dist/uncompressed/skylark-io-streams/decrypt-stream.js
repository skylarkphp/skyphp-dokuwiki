define([
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var chunkSize = 512;


    var DecryptStream = DecodeStream.inherit({
        klassName : "DecryptStream",

        _construct : function (str, maybeLength, decrypt) {
            this.str = str;
            this.dict = str.dict;
            this.decrypt = decrypt;
            this.nextChunk = null;
            this.initialized = false;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        readBlock : function DecryptStream_readBlock() {
            var chunk;
            if (this.initialized) {
                chunk = this.nextChunk;
            } else {
                chunk = this.str.getBytes(chunkSize);
                this.initialized = true;
            }
            if (!chunk || chunk.length === 0) {
                this.eof = true;
                return;
            }
            this.nextChunk = this.str.getBytes(chunkSize);
            var hasMoreData = this.nextChunk && this.nextChunk.length > 0;
            var decrypt = this.decrypt;
            chunk = decrypt(chunk, !hasMoreData);
            var bufferLength = this.bufferLength;
            var i, n = chunk.length;
            var buffer = this.ensureBuffer(bufferLength + n);
            for (i = 0; i < n; i++) {
                buffer[bufferLength++] = chunk[i];
            }
            this.bufferLength = bufferLength;
        }
    });

    return streams.DecryptStream = DecryptStream;
});
