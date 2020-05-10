
define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var chunkSize = 512;

    var DecryptStream = DecodeStream.inherit({
        klassName : "DecryptStream",

        init : function(str, decrypt) {
            this.str = str;
            this.dict = str.dict;
            this.decrypt = decrypt;
            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var chunk = this.str.getBytes(chunkSize);
            if (!chunk || chunk.length == 0) {
                this.eof = true;
                return;
            }
            var decrypt = this.decrypt;
            chunk = decrypt(chunk);

            var bufferLength = this.bufferLength;
            var i, n = chunk.length;
            var buffer = this.ensureBuffer(bufferLength + n);
            for (i = 0; i < n; i++)
                buffer[bufferLength++] = chunk[i];
            this.bufferLength = bufferLength;
        }
    });

    return streams.DecryptStream = DecryptStream;
});
