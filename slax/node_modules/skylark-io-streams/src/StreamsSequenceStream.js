
define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var StreamsSequenceStream = DecodeStream.inherit({
        klassName : "StreamsSequenceStream",

        init : function(streams) {
            this.dict = stream.dict;
            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var streams = this.streams;
            if (streams.length == 0) {
                this.eof = true;
                return;
            }
            var stream = streams.shift();
            var chunk = stream.getBytes();
            var bufferLength = this.bufferLength;
            var newLength = bufferLength + chunk.length;
            var buffer = this.ensureBuffer(newLength);
            buffer.set(chunk, bufferLength);
            this.bufferLength = newLength;
        }
    });

    return streams.StreamsSequenceStream = StreamsSequenceStream;
});
