define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams"
], function(skylark, langx,streams) {

   	var Stream = langx.Evented.inherit({
        klassName: "Stream",
        init: function(arrayBuffer, start, length, dict) {
	        this.bytes = new Uint8Array(arrayBuffer);
	        this.start = start || 0;
	        this.pos = this.start;
	        this.end = (start + length) || this.bytes.length;
	        this.dict = dict;
        },


        length : {
        	get : function() {
            	return this.end - this.start;
        	}
        },

        getByte: function () {
            if (this.pos >= this.end)
                return null;
            return this.bytes[this.pos++];
        },
        // returns subarray of original buffer
        // should only be read
        getBytes: function (length) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;

            if (!length)
                return bytes.subarray(pos, strEnd);

            var end = pos + length;
            if (end > strEnd)
                end = strEnd;

            this.pos = end;
            return bytes.subarray(pos, end);
        },

        lookChar: function () {
            if (this.pos >= this.end)
                return null;
            return String.fromCharCode(this.bytes[this.pos]);
        },
        getChar: function () {
            if (this.pos >= this.end)
                return null;
            return String.fromCharCode(this.bytes[this.pos++]);
        },
        skip: function (n) {
            if (!n)
                n = 1;
            this.pos += n;
        },
        reset: function () {
            this.pos = this.start;
        },
        moveStart: function () {
            this.start = this.pos;
        },
        makeSubStream: function (start, length, dict) {
            return new Stream(this.bytes.buffer, start, length, dict);
        },
        isStream: true
    });
    
    return streams.Stream = Stream;
	
});
