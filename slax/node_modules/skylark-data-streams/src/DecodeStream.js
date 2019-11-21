define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx, streams, Stream) {

    var DecodeStream = Stream.inherit({
        klassName : "DecodeStream",

        init : function() {
            this.pos = 0;
            this.bufferLength = 0;
            this.eof = false;
            this.buffer = null;     
        },

        ensureBuffer: function(requested) {
            var buffer = this.buffer;
            var current = buffer ? buffer.byteLength : 0;
            if (requested < current)
                return buffer;
            var size = 512;
            while (size < requested)
                size <<= 1;
            var buffer2 = new Uint8Array(size);
            for (var i = 0; i < current; ++i)
                buffer2[i] = buffer[i];
            return (this.buffer = buffer2);
        },
        getByte: function () {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return this.buffer[this.pos++];
        },
        getBytes: function(length) {
            var end, pos = this.pos;

            if (length) {
                this.ensureBuffer(pos + length);
                end = pos + length;

                while (!this.eof && this.bufferLength < end)
                    this.readBlock();

                var bufEnd = this.bufferLength;
                if (end > bufEnd)
                    end = bufEnd;
            } else {
                while (!this.eof)
                    this.readBlock();

                end = this.bufferLength;

                // checking if bufferLength is still 0 then
                // the buffer has to be initialized
                if (!end)
                    this.buffer = new Uint8Array(0);
            }

            this.pos = end;
            return this.buffer.subarray(pos, end);
        },
        lookChar: function() {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return String.fromCharCode(this.buffer[this.pos]);
        },
        getChar: function () {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return String.fromCharCode(this.buffer[this.pos++]);
        },
        makeSubStream: function (start, length, dict) {
            var end = start + length;
            while (this.bufferLength <= end && !this.eof)
                this.readBlock();
            return new Stream(this.buffer, start, length, dict);
        },
        skip: function (n) {
            if (!n)
                n = 1;
            this.pos += n;
        },
        reset: function () {
            this.pos = 0;
        }

    });

    return streams.DecodeStream = DecodeStream;

});
