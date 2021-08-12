define([
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {


    var StreamsSequenceStream = DecodeStream.inherit({
        klassName : "StreamsSequenceStream",

        _construct : function(_streams) {
            this.streams = _streams;
            let maybeLength = 0;
            for (let i = 0, ii = _streams.length; i < ii; i++) {
                const stream = _streams[i];
                if (stream instanceof DecodeStream) {
                    maybeLength += stream._rawMinBufferLength;
                } else {
                    maybeLength += stream.length;
                }
            }
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function streamSequenceStreamReadBlock() {
            var _streams = this.streams;
            if (streams.length === 0) {
                this.eof = true;
                return;
            }
            var stream = _streams.shift();
            var chunk = _streams.getBytes();
            var bufferLength = this.bufferLength;
            var newLength = bufferLength + chunk.length;
            var buffer = this.ensureBuffer(newLength);
            buffer.set(chunk, bufferLength);
            this.bufferLength = newLength;
        },

        getBaseStreams : function StreamsSequenceStream_getBaseStreams() {
            var baseStreams = [];
            for (var i = 0, ii = this.streams.length; i < ii; i++) {
                var stream = this.streams[i];
                if (stream.getBaseStreams) {
                    baseStreams.push(...stream.getBaseStreams());
                }
            }
            return baseStreams;
        }
    });

    return streams.StreamsSequenceStream = StreamsSequenceStream;

});
