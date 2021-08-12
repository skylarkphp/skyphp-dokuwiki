define([
    "skylark-langx-events",
    "./streams"
], function(events,streams) {

   	var Stream = events.Emitter.inherit({
        klassName: "Stream",
        
        _construct: function(arrayBuffer, start, length, dict) {
            this.bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
            this.start = start || 0;
            this.pos = this.start;
            this.end = start + length || this.bytes.length;
            this.dict = dict;
        },


        length : {
        	get : function() {
                return this.end - this.start;
        	}
        },

        getByte: function () {
            if (this.pos >= this.end) {
                return -1;
            }
            return this.bytes[this.pos++];
        },

        getUint16: function Stream_getUint16() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            if (b0 === -1 || b1 === -1) {
                return -1;
            }
            return (b0 << 8) + b1;
        },

        getInt32: function Stream_getInt32() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            var b2 = this.getByte();
            var b3 = this.getByte();
            return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        },

        getBytes(length, forceClamped = false) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;
            if (!length) {
                const subarray = bytes.subarray(pos, strEnd);
                return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
            }
            var end = pos + length;
            if (end > strEnd) {
                end = strEnd;
            }
            this.pos = end;
            const subarray = bytes.subarray(pos, end);
            return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
        },

        peekByte: function Stream_peekByte() {
            var peekedByte = this.getByte();
            if (peekedByte !== -1) {
                this.pos--;
            }
            return peekedByte;
        },

        peekBytes(length, forceClamped = false) {
            var bytes = this.getBytes(length, forceClamped);
            this.pos -= bytes.length;
            return bytes;
        },

        getByteRange(begin, end) {
            if (begin < 0) {
                begin = 0;
            }
            if (end > this.end) {
                end = this.end;
            }
            return this.bytes.subarray(begin, end);
        },

        skip: function Stream_skip(n) {
            if (!n) {
                n = 1;
            }
            this.pos += n;
        },

        reset: function Stream_reset() {
            this.pos = this.start;
        },

        moveStart: function Stream_moveStart() {
            this.start = this.pos;
        },
        
        makeSubStream: function Stream_makeSubStream(start, length, dict) {
            return new Stream(this.bytes.buffer, start, length, dict);
        }
    });
    
    return streams.Stream = Stream;
	
});
