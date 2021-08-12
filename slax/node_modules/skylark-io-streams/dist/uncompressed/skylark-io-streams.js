/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-io-streams/streams',[
    "skylark-langx-ns"
], function(skylark) {

    return skylark.attach("io.streams");
});

define('skylark-io-streams/decode-stream',[
    "skylark-langx-events",
    "skylark-langx-chars",
    "./streams"
], function(events, chars, streams) {
    var emptyBuffer = new Uint8Array(0);


    var DecodeStream = events.Emitter.inherit({
        klassName : "DecodeStream",

        _construct : function(maybeMinBufferLength) {
            this._rawMinBufferLength = maybeMinBufferLength || 0;
            this.pos = 0;
            this.bufferLength = 0;
            this.eof = false;
            this.buffer = emptyBuffer;
            this.minBufferLength = 512;
            if (maybeMinBufferLength) {
                while (this.minBufferLength < maybeMinBufferLength) {
                    this.minBufferLength *= 2;
                }
            }
        },
        length : {
            get : function () {
                //util.unreachable('Should not access DecodeStream.length');    
                throw new Error('Should not access DecodeStream.length') ;               
            }
        },

        isEmpty : {
            get : function () {
                while (!this.eof && this.bufferLength === 0) {
                    this.readBlock();
                }
                return this.bufferLength === 0;
            }
        },

        ensureBuffer: function DecodeStream_ensureBuffer(requested) {
            var buffer = this.buffer;
            if (requested <= buffer.byteLength) {
                return buffer;
            }
            var size = this.minBufferLength;
            while (size < requested) {
                size *= 2;
            }
            var buffer2 = new Uint8Array(size);
            buffer2.set(buffer);
            return this.buffer = buffer2;
        },
        getByte: function DecodeStream_getByte() {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof) {
                    return -1;
                }
                this.readBlock();
            }
            return this.buffer[this.pos++];
        },
        getUint16: function DecodeStream_getUint16() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            if (b0 === -1 || b1 === -1) {
                return -1;
            }
            return (b0 << 8) + b1;
        },
        getInt32: function DecodeStream_getInt32() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            var b2 = this.getByte();
            var b3 = this.getByte();
            return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        },
        getBytes(length, forceClamped = false) {
            var end, pos = this.pos;
            if (length) {
                this.ensureBuffer(pos + length);
                end = pos + length;
                while (!this.eof && this.bufferLength < end) {
                    this.readBlock();
                }
                var bufEnd = this.bufferLength;
                if (end > bufEnd) {
                    end = bufEnd;
                }
            } else {
                while (!this.eof) {
                    this.readBlock();
                }
                end = this.bufferLength;
            }
            this.pos = end;
            const subarray = this.buffer.subarray(pos, end);
            return forceClamped && !(subarray instanceof Uint8ClampedArray) ? new Uint8ClampedArray(subarray) : subarray;
        },
        peekByte: function DecodeStream_peekByte() {
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
        makeSubStream: function DecodeStream_makeSubStream(start, length, dict) {
            var end = start + length;
            while (this.bufferLength <= end && !this.eof) {
                this.readBlock();
            }
            return new Stream(this.buffer, start, length, dict);
        },
        getByteRange(begin, end) {
            throw new Error("Should not call DecodeStream.getByteRange") ;               
            //util.unreachable('Should not call DecodeStream.getByteRange');
        },
        skip: function DecodeStream_skip(n) {
            if (!n) {
                n = 1;
            }
            this.pos += n;
        },
        reset: function DecodeStream_reset() {
            this.pos = 0;
        },
        getBaseStreams: function DecodeStream_getBaseStreams() {
            if (this.str && this.str.getBaseStreams) {
                return this.str.getBaseStreams();
            }
            return [];
        }

    });

    return streams.DecodeStream = DecodeStream;

});

define('skylark-io-streams/ascii85-stream',[
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {


    var Ascii85Stream = DecodeStream.inherit({
        klassName : "Ascii85Stream",

        _construct : function(str) {
            this.str = str;
            this.dict = str.dict;
            this.input = new Uint8Array(5);
            if (maybeLength) {
                maybeLength = 0.8 * maybeLength;
            }
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function Ascii85Stream_readBlock() {
            var TILDA_CHAR = 126;
            var Z_LOWER_CHAR = 122;
            var EOF = -1;
            var str = this.str;
            var c = str.getByte();
            while (chars.isWhiteSpace(c)) {
                c = str.getByte();
            }
            if (c === EOF || c === TILDA_CHAR) {
                this.eof = true;
                return;
            }
            var bufferLength = this.bufferLength, buffer;
            var i;
            if (c === Z_LOWER_CHAR) {
                buffer = this.ensureBuffer(bufferLength + 4);
                for (i = 0; i < 4; ++i) {
                    buffer[bufferLength + i] = 0;
                }
                this.bufferLength += 4;
            } else {
                var input = this.input;
                input[0] = c;
                for (i = 1; i < 5; ++i) {
                    c = str.getByte();
                    while (chars.isWhiteSpace(c)) {
                        c = str.getByte();
                    }
                    input[i] = c;
                    if (c === EOF || c === TILDA_CHAR) {
                        break;
                    }
                }
                buffer = this.ensureBuffer(bufferLength + i - 1);
                this.bufferLength += i - 1;
                if (i < 5) {
                    for (; i < 5; ++i) {
                        input[i] = 33 + 84;
                    }
                    this.eof = true;
                }
                var t = 0;
                for (i = 0; i < 5; ++i) {
                    t = t * 85 + (input[i] - 33);
                }
                for (i = 3; i >= 0; --i) {
                    buffer[bufferLength + i] = t & 255;
                    t >>= 8;
                }
            }
        }

    });

    return streams.Ascii85Stream = Ascii85Stream;

});

define('skylark-io-streams/ascii-hex-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var AsciiHexStream = DecodeStream.inherit({
        klassName : "AsciiHexStream",

        _construct : function AsciiHexStream(str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            this.firstDigit = -1;
            if (maybeLength) {
                maybeLength = 0.5 * maybeLength;
            }

            DecodeStream.prototype._construct.call(this,maybeLength);          
        },

        readBlock : function AsciiHexStream_readBlock() {
            var UPSTREAM_BLOCK_SIZE = 8000;
            var bytes = this.str.getBytes(UPSTREAM_BLOCK_SIZE);
            if (!bytes.length) {
                this.eof = true;
                return;
            }
            var maxDecodeLength = bytes.length + 1 >> 1;
            var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
            var bufferLength = this.bufferLength;
            var firstDigit = this.firstDigit;
            for (var i = 0, ii = bytes.length; i < ii; i++) {
                var ch = bytes[i], digit;
                if (ch >= 48 && ch <= 57) {
                    digit = ch & 15;
                } else if (ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {
                    digit = (ch & 15) + 9;
                } else if (ch === 62) {
                    this.eof = true;
                    break;
                } else {
                    continue;
                }
                if (firstDigit < 0) {
                    firstDigit = digit;
                } else {
                    buffer[bufferLength++] = firstDigit << 4 | digit;
                    firstDigit = -1;
                }
            }
            if (firstDigit >= 0 && this.eof) {
                buffer[bufferLength++] = firstDigit << 4;
                firstDigit = -1;
            }
            this.firstDigit = firstDigit;
            this.bufferLength = bufferLength;
        }
    });

    return streams.AsciiHexStream = AsciiHexStream;
});

define('skylark-io-streams/_stream',[
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

define('skylark-io-streams/chunked-stream',[
    "./streams",
    "./_stream"
], function(streams,Stream) {


    var ChunkedStream = Stream.inherit({
        klassName : "ChunkedStream",

        "numChunks": 0,
        "numChunksLoaded": 0,

        _construct : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype._construct.call(bytes);          
            this.dict = stream.dict;
        },

        "numChunks": function() {

        },


        getMissingChunks: function ChunkedStream_getMissingChunks() {
            var chunks = [];
            for (var chunk = 0, n = this.numChunks; chunk < n; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    chunks.push(chunk);
                }
            }
            return chunks;
        },

        getBaseStreams: function ChunkedStream_getBaseStreams() {
            return [this];
        },

        allChunksLoaded: function ChunkedStream_allChunksLoaded() {
            var _ = this._;
            return _.numChunksLoaded === _.numChunks;
        },

        onReceiveData: function(begin, chunk) {
            var end = begin + chunk.byteLength;

            assert(begin % this.chunkSize === 0, 'Bad begin offset: ' + begin);
            // Using this.length is inaccurate here since this.start can be moved
            // See ChunkedStream.moveStart()
            var length = this.bytes.length;
            assert(end % this.chunkSize === 0 || end === length,
                'Bad end offset: ' + end);

            this.bytes.set(new Uint8Array(chunk), begin);
            var chunkSize = this.chunkSize;
            var beginChunk = Math.floor(begin / chunkSize);
            var endChunk = Math.floor((end - 1) / chunkSize) + 1;

            for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    this.loadedChunks[chunk] = true;
                    ++this.numChunksLoaded;
                }
            }
        },

        onReceiveInitialData: function(data) {
            this.bytes.set(data);
            this.initialDataLength = data.length;
            var endChunk = this.end === data.length ?
                this.numChunks : Math.floor(data.length / this.chunkSize);
            for (var i = 0; i < endChunk; i++) {
                this.loadedChunks[i] = true;
                ++this.numChunksLoaded;
            }
        },

        ensureRange: function ChunkedStream_ensureRange(begin, end) {
            if (begin >= end) {
                return;
            }

            if (end <= this.initialDataLength) {
                return;
            }

            var chunkSize = this.chunkSize;
            var beginChunk = Math.floor(begin / chunkSize);
            var endChunk = Math.floor((end - 1) / chunkSize) + 1;
            for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    throw new MissingDataException(begin, end);
                }
            }
        },

        nextEmptyChunk: function ChunkedStream_nextEmptyChunk(beginChunk) {
            for (var chunk = beginChunk, n = this.numChunks; chunk < n; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    return chunk;
                }
            }
            // Wrap around to beginning
            for (var chunk = 0; chunk < beginChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    return chunk;
                }
            }
            return null;
        },

        hasChunk: function ChunkedStream_hasChunk(chunk) {
            return chunk in this._.loadedChunks;
        },

        getByte: function ChunkedStream_getByte() {
            var pos = this.pos;
            if (pos >= this.end) {
                return -1;
            }
            this.ensureRange(pos, pos + 1);
            return this.bytes[this.pos++];
        },

        // returns subarray of original buffer
        // should only be read
        getBytes: function ChunkedStream_getBytes(length) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;

            if (!length) {
                this.ensureRange(pos, strEnd);
                return bytes.subarray(pos, strEnd);
            }

            var end = pos + length;
            if (end > strEnd)
                end = strEnd;
            this.ensureRange(pos, end);

            this.pos = end;
            return bytes.subarray(pos, end);
        },

        peekBytes: function ChunkedStream_peekBytes(length) {
            var bytes = this.getBytes(length);
            this.pos -= bytes.length;
            return bytes;
        },

        getByteRange: function ChunkedStream_getBytes(begin, end) {
            this.ensureRange(begin, end);
            return this.bytes.subarray(begin, end);
        },

        skip: function ChunkedStream_skip(n) {
            if (!n)
                n = 1;
            this.pos += n;
        },

        reset: function ChunkedStream_reset() {
            this.pos = this.start;
        },

        moveStart: function ChunkedStream_moveStart() {
            this.start = this.pos;
        },

        makeSubStream: function ChunkedStream_makeSubStream(start, length, dict) {
            function ChunkedStreamSubstream() {}
            ChunkedStreamSubstream.prototype = Object.create(this);
            ChunkedStreamSubstream.prototype.getMissingChunks = function() {
                var chunkSize = this.chunkSize;
                var beginChunk = Math.floor(this.start / chunkSize);
                var endChunk = Math.floor((this.end - 1) / chunkSize) + 1;
                var missingChunks = [];
                for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                    if (!(chunk in this.loadedChunks)) {
                        missingChunks.push(chunk);
                    }
                }
                return missingChunks;
            };
            var subStream = new ChunkedStreamSubstream();
            subStream.pos = subStream.start = start;
            subStream.end = start + length || this.end;
            subStream.dict = dict;
            return subStream;
        }
    });

    return streams.ChunkedStream = ChunkedStream;

});

define('skylark-io-streams/decrypt-stream',[
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

define('skylark-io-streams/fake-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var FakeStream = DecodeStream.inherit({
        klassName : "FakeStream",

        _construct : function(stream) {
            this.dict = stream.dict;
            DecodeStream.prototype._construct.call(this);          
        },

        readBlock : function() {
            var bufferLength = this.bufferLength;
            bufferLength += 1024;
            var buffer = this.ensureBuffer(bufferLength);
            this.bufferLength = bufferLength;
        },

        getBytes : function (length) {
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
                this.eof = true;
                end = this.bufferLength;
            }

            this.pos = end;
            return this.buffer.subarray(pos, end);
        }

    });

    return streams.FakeStream = FakeStream;
});

define('skylark-io-streams/flate-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {
    
    var codeLenCodeMap = new Int32Array([
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
    ]);
    var lengthDecode = new Int32Array([
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        65547,
        65549,
        65551,
        65553,
        131091,
        131095,
        131099,
        131103,
        196643,
        196651,
        196659,
        196667,
        262211,
        262227,
        262243,
        262259,
        327811,
        327843,
        327875,
        327907,
        258,
        258,
        258
    ]);
    var distDecode = new Int32Array([
        1,
        2,
        3,
        4,
        65541,
        65543,
        131081,
        131085,
        196625,
        196633,
        262177,
        262193,
        327745,
        327777,
        393345,
        393409,
        459009,
        459137,
        524801,
        525057,
        590849,
        591361,
        657409,
        658433,
        724993,
        727041,
        794625,
        798721,
        868353,
        876545
    ]);
    var fixedLitCodeTab = [
        new Int32Array([
            459008,
            524368,
            524304,
            524568,
            459024,
            524400,
            524336,
            590016,
            459016,
            524384,
            524320,
            589984,
            524288,
            524416,
            524352,
            590048,
            459012,
            524376,
            524312,
            589968,
            459028,
            524408,
            524344,
            590032,
            459020,
            524392,
            524328,
            590000,
            524296,
            524424,
            524360,
            590064,
            459010,
            524372,
            524308,
            524572,
            459026,
            524404,
            524340,
            590024,
            459018,
            524388,
            524324,
            589992,
            524292,
            524420,
            524356,
            590056,
            459014,
            524380,
            524316,
            589976,
            459030,
            524412,
            524348,
            590040,
            459022,
            524396,
            524332,
            590008,
            524300,
            524428,
            524364,
            590072,
            459009,
            524370,
            524306,
            524570,
            459025,
            524402,
            524338,
            590020,
            459017,
            524386,
            524322,
            589988,
            524290,
            524418,
            524354,
            590052,
            459013,
            524378,
            524314,
            589972,
            459029,
            524410,
            524346,
            590036,
            459021,
            524394,
            524330,
            590004,
            524298,
            524426,
            524362,
            590068,
            459011,
            524374,
            524310,
            524574,
            459027,
            524406,
            524342,
            590028,
            459019,
            524390,
            524326,
            589996,
            524294,
            524422,
            524358,
            590060,
            459015,
            524382,
            524318,
            589980,
            459031,
            524414,
            524350,
            590044,
            459023,
            524398,
            524334,
            590012,
            524302,
            524430,
            524366,
            590076,
            459008,
            524369,
            524305,
            524569,
            459024,
            524401,
            524337,
            590018,
            459016,
            524385,
            524321,
            589986,
            524289,
            524417,
            524353,
            590050,
            459012,
            524377,
            524313,
            589970,
            459028,
            524409,
            524345,
            590034,
            459020,
            524393,
            524329,
            590002,
            524297,
            524425,
            524361,
            590066,
            459010,
            524373,
            524309,
            524573,
            459026,
            524405,
            524341,
            590026,
            459018,
            524389,
            524325,
            589994,
            524293,
            524421,
            524357,
            590058,
            459014,
            524381,
            524317,
            589978,
            459030,
            524413,
            524349,
            590042,
            459022,
            524397,
            524333,
            590010,
            524301,
            524429,
            524365,
            590074,
            459009,
            524371,
            524307,
            524571,
            459025,
            524403,
            524339,
            590022,
            459017,
            524387,
            524323,
            589990,
            524291,
            524419,
            524355,
            590054,
            459013,
            524379,
            524315,
            589974,
            459029,
            524411,
            524347,
            590038,
            459021,
            524395,
            524331,
            590006,
            524299,
            524427,
            524363,
            590070,
            459011,
            524375,
            524311,
            524575,
            459027,
            524407,
            524343,
            590030,
            459019,
            524391,
            524327,
            589998,
            524295,
            524423,
            524359,
            590062,
            459015,
            524383,
            524319,
            589982,
            459031,
            524415,
            524351,
            590046,
            459023,
            524399,
            524335,
            590014,
            524303,
            524431,
            524367,
            590078,
            459008,
            524368,
            524304,
            524568,
            459024,
            524400,
            524336,
            590017,
            459016,
            524384,
            524320,
            589985,
            524288,
            524416,
            524352,
            590049,
            459012,
            524376,
            524312,
            589969,
            459028,
            524408,
            524344,
            590033,
            459020,
            524392,
            524328,
            590001,
            524296,
            524424,
            524360,
            590065,
            459010,
            524372,
            524308,
            524572,
            459026,
            524404,
            524340,
            590025,
            459018,
            524388,
            524324,
            589993,
            524292,
            524420,
            524356,
            590057,
            459014,
            524380,
            524316,
            589977,
            459030,
            524412,
            524348,
            590041,
            459022,
            524396,
            524332,
            590009,
            524300,
            524428,
            524364,
            590073,
            459009,
            524370,
            524306,
            524570,
            459025,
            524402,
            524338,
            590021,
            459017,
            524386,
            524322,
            589989,
            524290,
            524418,
            524354,
            590053,
            459013,
            524378,
            524314,
            589973,
            459029,
            524410,
            524346,
            590037,
            459021,
            524394,
            524330,
            590005,
            524298,
            524426,
            524362,
            590069,
            459011,
            524374,
            524310,
            524574,
            459027,
            524406,
            524342,
            590029,
            459019,
            524390,
            524326,
            589997,
            524294,
            524422,
            524358,
            590061,
            459015,
            524382,
            524318,
            589981,
            459031,
            524414,
            524350,
            590045,
            459023,
            524398,
            524334,
            590013,
            524302,
            524430,
            524366,
            590077,
            459008,
            524369,
            524305,
            524569,
            459024,
            524401,
            524337,
            590019,
            459016,
            524385,
            524321,
            589987,
            524289,
            524417,
            524353,
            590051,
            459012,
            524377,
            524313,
            589971,
            459028,
            524409,
            524345,
            590035,
            459020,
            524393,
            524329,
            590003,
            524297,
            524425,
            524361,
            590067,
            459010,
            524373,
            524309,
            524573,
            459026,
            524405,
            524341,
            590027,
            459018,
            524389,
            524325,
            589995,
            524293,
            524421,
            524357,
            590059,
            459014,
            524381,
            524317,
            589979,
            459030,
            524413,
            524349,
            590043,
            459022,
            524397,
            524333,
            590011,
            524301,
            524429,
            524365,
            590075,
            459009,
            524371,
            524307,
            524571,
            459025,
            524403,
            524339,
            590023,
            459017,
            524387,
            524323,
            589991,
            524291,
            524419,
            524355,
            590055,
            459013,
            524379,
            524315,
            589975,
            459029,
            524411,
            524347,
            590039,
            459021,
            524395,
            524331,
            590007,
            524299,
            524427,
            524363,
            590071,
            459011,
            524375,
            524311,
            524575,
            459027,
            524407,
            524343,
            590031,
            459019,
            524391,
            524327,
            589999,
            524295,
            524423,
            524359,
            590063,
            459015,
            524383,
            524319,
            589983,
            459031,
            524415,
            524351,
            590047,
            459023,
            524399,
            524335,
            590015,
            524303,
            524431,
            524367,
            590079
        ]),
        9
    ];
    var fixedDistCodeTab = [
        new Int32Array([
            327680,
            327696,
            327688,
            327704,
            327684,
            327700,
            327692,
            327708,
            327682,
            327698,
            327690,
            327706,
            327686,
            327702,
            327694,
            0,
            327681,
            327697,
            327689,
            327705,
            327685,
            327701,
            327693,
            327709,
            327683,
            327699,
            327691,
            327707,
            327687,
            327703,
            327695,
            0
        ]),
        5
    ];


    var FlateStream = DecodeStream.inherit({
        klassName : "FlateStream",

        _construct :function (str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            var cmf = str.getByte();
            var flg = str.getByte();
            if (cmf === -1 || flg === -1) {
                throw new util.FormatError(`Invalid header in flate stream: ${ cmf }, ${ flg }`);
            }
            if ((cmf & 15) !== 8) {
                throw new util.FormatError(`Unknown compression method in flate stream: ${ cmf }, ${ flg }`);
            }
            if (((cmf << 8) + flg) % 31 !== 0) {
                throw new util.FormatError(`Bad FCHECK in flate stream: ${ cmf }, ${ flg }`);
            }
            if (flg & 32) {
                throw new util.FormatError(`FDICT bit set in flate stream: ${ cmf }, ${ flg }`);
            }
            this.codeSize = 0;
            this.codeBuf = 0;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        getBits : function FlateStream_getBits(bits) {
            var str = this.str;
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var b;
            while (codeSize < bits) {
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad encoding in flate stream');
                }
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            b = codeBuf & (1 << bits) - 1;
            this.codeBuf = codeBuf >> bits;
            this.codeSize = codeSize -= bits;
            return b;
        },

        getCode : function FlateStream_getCode(table) {
            var str = this.str;
            var codes = table[0];
            var maxLen = table[1];
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var b;
            while (codeSize < maxLen) {
                if ((b = str.getByte()) === -1) {
                    break;
                }
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            var code = codes[codeBuf & (1 << maxLen) - 1];
            var codeLen = code >> 16;
            var codeVal = code & 65535;
            if (codeLen < 1 || codeSize < codeLen) {
                throw new util.FormatError('Bad encoding in flate stream');
            }
            this.codeBuf = codeBuf >> codeLen;
            this.codeSize = codeSize - codeLen;
            return codeVal;
        },

        generateHuffmanTable : function flateStreamGenerateHuffmanTable(lengths) {
            var n = lengths.length;
            var maxLen = 0;
            var i;
            for (i = 0; i < n; ++i) {
                if (lengths[i] > maxLen) {
                    maxLen = lengths[i];
                }
            }
            var size = 1 << maxLen;
            var codes = new Int32Array(size);
            for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
                for (var val = 0; val < n; ++val) {
                    if (lengths[val] === len) {
                        var code2 = 0;
                        var t = code;
                        for (i = 0; i < len; ++i) {
                            code2 = code2 << 1 | t & 1;
                            t >>= 1;
                        }
                        for (i = code2; i < size; i += skip) {
                            codes[i] = len << 16 | val;
                        }
                        ++code;
                    }
                }
            }
            return [
                codes,
                maxLen
            ];
        },

        readBlock : function FlateStream_readBlock() {
            var buffer, len;
            var str = this.str;
            var hdr = this.getBits(3);
            if (hdr & 1) {
                this.eof = true;
            }
            hdr >>= 1;
            if (hdr === 0) {
                var b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                var blockLen = b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                blockLen |= b << 8;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                var check = b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                check |= b << 8;
                if (check !== (~blockLen & 65535) && (blockLen !== 0 || check !== 0)) {
                    throw new util.FormatError('Bad uncompressed block length in flate stream');
                }
                this.codeBuf = 0;
                this.codeSize = 0;
                const bufferLength = this.bufferLength, end = bufferLength + blockLen;
                buffer = this.ensureBuffer(end);
                this.bufferLength = end;
                if (blockLen === 0) {
                    if (str.peekByte() === -1) {
                        this.eof = true;
                    }
                } else {
                    const block = str.getBytes(blockLen);
                    buffer.set(block, bufferLength);
                    if (block.length < blockLen) {
                        this.eof = true;
                    }
                }
                return;
            }
            var litCodeTable;
            var distCodeTable;
            if (hdr === 1) {
                litCodeTable = fixedLitCodeTab;
                distCodeTable = fixedDistCodeTab;
            } else if (hdr === 2) {
                var numLitCodes = this.getBits(5) + 257;
                var numDistCodes = this.getBits(5) + 1;
                var numCodeLenCodes = this.getBits(4) + 4;
                var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);
                var i;
                for (i = 0; i < numCodeLenCodes; ++i) {
                    codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
                }
                var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);
                len = 0;
                i = 0;
                var codes = numLitCodes + numDistCodes;
                var codeLengths = new Uint8Array(codes);
                var bitsLength, bitsOffset, what;
                while (i < codes) {
                    var code = this.getCode(codeLenCodeTab);
                    if (code === 16) {
                        bitsLength = 2;
                        bitsOffset = 3;
                        what = len;
                    } else if (code === 17) {
                        bitsLength = 3;
                        bitsOffset = 3;
                        what = len = 0;
                    } else if (code === 18) {
                        bitsLength = 7;
                        bitsOffset = 11;
                        what = len = 0;
                    } else {
                        codeLengths[i++] = len = code;
                        continue;
                    }
                    var repeatLength = this.getBits(bitsLength) + bitsOffset;
                    while (repeatLength-- > 0) {
                        codeLengths[i++] = what;
                    }
                }
                litCodeTable = this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
                distCodeTable = this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
            } else {
                throw new util.FormatError('Unknown block type in flate stream');
            }
            buffer = this.buffer;
            var limit = buffer ? buffer.length : 0;
            var pos = this.bufferLength;
            while (true) {
                var code1 = this.getCode(litCodeTable);
                if (code1 < 256) {
                    if (pos + 1 >= limit) {
                        buffer = this.ensureBuffer(pos + 1);
                        limit = buffer.length;
                    }
                    buffer[pos++] = code1;
                    continue;
                }
                if (code1 === 256) {
                    this.bufferLength = pos;
                    return;
                }
                code1 -= 257;
                code1 = lengthDecode[code1];
                var code2 = code1 >> 16;
                if (code2 > 0) {
                    code2 = this.getBits(code2);
                }
                len = (code1 & 65535) + code2;
                code1 = this.getCode(distCodeTable);
                code1 = distDecode[code1];
                code2 = code1 >> 16;
                if (code2 > 0) {
                    code2 = this.getBits(code2);
                }
                var dist = (code1 & 65535) + code2;
                if (pos + len >= limit) {
                    buffer = this.ensureBuffer(pos + len);
                    limit = buffer.length;
                }
                for (var k = 0; k < len; ++k, ++pos) {
                    buffer[pos] = buffer[pos - dist];
                }
            }
        }
    });


    return streams.FlateStream = FlateStream;
});

define('skylark-io-streams/lzw-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var LZWStream = DecodeStream.inherit({
        klassName : "LZWStream",

        _construct : function (str, maybeLength, earlyChange) {
            this.str = str;
            this.dict = str.dict;
            this.cachedData = 0;
            this.bitsCached = 0;
            var maxLzwDictionarySize = 4096;
            var lzwState = {
                earlyChange,
                codeLength: 9,
                nextCode: 258,
                dictionaryValues: new Uint8Array(maxLzwDictionarySize),
                dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
                dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
                currentSequence: new Uint8Array(maxLzwDictionarySize),
                currentSequenceLength: 0
            };
            for (var i = 0; i < 256; ++i) {
                lzwState.dictionaryValues[i] = i;
                lzwState.dictionaryLengths[i] = 1;
            }
            this.lzwState = lzwState;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        readBits: function LZWStream_readBits(n) {
            var bitsCached = this.bitsCached;
            var cachedData = this.cachedData;
            while (bitsCached < n) {
                var c = this.str.getByte();
                if (c === -1) {
                    this.eof = true;
                    return null;
                }
                cachedData = cachedData << 8 | c;
                bitsCached += 8;
            }
            this.bitsCached = bitsCached -= n;
            this.cachedData = cachedData;
            this.lastCode = null;
            return cachedData >>> bitsCached & (1 << n) - 1;
        },

        readBlock : function LZWStream_readBlock() {
            var blockSize = 512;
            var estimatedDecodedSize = blockSize * 2, decodedSizeDelta = blockSize;
            var i, j, q;
            var lzwState = this.lzwState;
            if (!lzwState) {
                return;
            }
            var earlyChange = lzwState.earlyChange;
            var nextCode = lzwState.nextCode;
            var dictionaryValues = lzwState.dictionaryValues;
            var dictionaryLengths = lzwState.dictionaryLengths;
            var dictionaryPrevCodes = lzwState.dictionaryPrevCodes;
            var codeLength = lzwState.codeLength;
            var prevCode = lzwState.prevCode;
            var currentSequence = lzwState.currentSequence;
            var currentSequenceLength = lzwState.currentSequenceLength;
            var decodedLength = 0;
            var currentBufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
            for (i = 0; i < blockSize; i++) {
                var code = this.readBits(codeLength);
                var hasPrev = currentSequenceLength > 0;
                if (code < 256) {
                    currentSequence[0] = code;
                    currentSequenceLength = 1;
                } else if (code >= 258) {
                    if (code < nextCode) {
                        currentSequenceLength = dictionaryLengths[code];
                        for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
                            currentSequence[j] = dictionaryValues[q];
                            q = dictionaryPrevCodes[q];
                        }
                    } else {
                        currentSequence[currentSequenceLength++] = currentSequence[0];
                    }
                } else if (code === 256) {
                    codeLength = 9;
                    nextCode = 258;
                    currentSequenceLength = 0;
                    continue;
                } else {
                    this.eof = true;
                    delete this.lzwState;
                    break;
                }
                if (hasPrev) {
                    dictionaryPrevCodes[nextCode] = prevCode;
                    dictionaryLengths[nextCode] = dictionaryLengths[prevCode] + 1;
                    dictionaryValues[nextCode] = currentSequence[0];
                    nextCode++;
                    codeLength = nextCode + earlyChange & nextCode + earlyChange - 1 ? codeLength : Math.min(Math.log(nextCode + earlyChange) / 0.6931471805599453 + 1, 12) | 0;
                }
                prevCode = code;
                decodedLength += currentSequenceLength;
                if (estimatedDecodedSize < decodedLength) {
                    do {
                        estimatedDecodedSize += decodedSizeDelta;
                    } while (estimatedDecodedSize < decodedLength);
                    buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
                }
                for (j = 0; j < currentSequenceLength; j++) {
                    buffer[currentBufferLength++] = currentSequence[j];
                }
            }
            lzwState.nextCode = nextCode;
            lzwState.codeLength = codeLength;
            lzwState.prevCode = prevCode;
            lzwState.currentSequenceLength = currentSequenceLength;
            this.bufferLength = currentBufferLength;
        }
    });

    return streams.LZWStream = LZWStream;
});

define('skylark-io-streams/null-stream',[
    "./streams",
    "./_stream"
], function( streams, Stream) {

    var NullStream = Stream.inherit({
        klassName : "NullStream",

        _construct : function() {
            Stream.prototype._construct.call(this, new Uint8Array(0));        
        }
    });


    return streams.NullStream = NullStream;

});

define('skylark-io-streams/predictor-stream',[
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

define('skylark-io-streams/run-length-stream',[
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

define('skylark-io-streams/streams-sequence-stream',[
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

define('skylark-io-streams/string-stream',[
    "./streams",
    "./_stream"
], function(streams, Stream) {

    var StringStream = Stream.inherit({
        klassName : "StringStream",

        _construct : function(str) {
            //const bytes = util.stringToBytes(str);
            //TODO: chartCodeAt() >255
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);

            Stream.prototype._construct.call(this,bytes);          
        }
    });


    return streams.StringStream = StringStream;

});

define('skylark-io-streams/main',[
    "./streams",
    "./ascii85-stream",
    "./ascii-hex-stream",
    "./chunked-stream",
    "./decode-stream",
    "./decrypt-stream",
    "./fake-stream",
    "./flate-stream",
    "./lzw-stream",
    "./null-stream",
    "./predictor-stream",
    "./run-length-stream",
    "./_stream",
    "./streams-sequence-stream",
    "./string-stream"
], function(streams) {

	return streams;
});
define('skylark-io-streams', ['skylark-io-streams/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-io-streams.js.map
