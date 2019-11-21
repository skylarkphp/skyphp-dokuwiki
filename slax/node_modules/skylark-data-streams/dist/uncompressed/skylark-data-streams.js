/**
 * skylark-data-streams - The stream features enhancement for skylark utils.
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
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-data-streams/streams',[
    "skylark-langx/skylark"
], function(skylark) {

    return skylark.attach("data.streams",{});
});

define('skylark-data-streams/Stream',[
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

define('skylark-data-streams/DecodeStream',[
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

define('skylark-data-streams/Ascii85Stream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var Ascii85Stream = DecodeStream.inherit({
        klassName : "Ascii85Stream",

        init : function(str) {
            this.str = str;
            this.dict = str.dict;
            this.input = new Uint8Array(5);

            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var tildaCode = '~'.charCodeAt(0);
            var zCode = 'z'.charCodeAt(0);
            var str = this.str;

            var c = str.getByte();
            while (Lexer.isSpace(String.fromCharCode(c)))
                c = str.getByte();

            if (!c || c === tildaCode) {
                this.eof = true;
                return;
            }

            var bufferLength = this.bufferLength,
                buffer;

            // special code for z
            if (c == zCode) {
                buffer = this.ensureBuffer(bufferLength + 4);
                for (var i = 0; i < 4; ++i)
                    buffer[bufferLength + i] = 0;
                this.bufferLength += 4;
            } else {
                var input = this.input;
                input[0] = c;
                for (var i = 1; i < 5; ++i) {
                    c = str.getByte();
                    while (Lexer.isSpace(String.fromCharCode(c)))
                        c = str.getByte();

                    input[i] = c;

                    if (!c || c == tildaCode)
                        break;
                }
                buffer = this.ensureBuffer(bufferLength + i - 1);
                this.bufferLength += i - 1;

                // partial ending;
                if (i < 5) {
                    for (; i < 5; ++i)
                        input[i] = 0x21 + 84;
                    this.eof = true;
                }
                var t = 0;
                for (var i = 0; i < 5; ++i)
                    t = t * 85 + (input[i] - 0x21);

                for (var i = 3; i >= 0; --i) {
                    buffer[bufferLength + i] = t & 0xFF;
                    t >>= 8;
                }
            }

        }

    });

    return streams.Ascii85Stream = Ascii85Stream;

});

define('skylark-data-streams/AsciiHexStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {
    var hexvalueMap = {
        9: -1, // \t
        32: -1, // space
        48: 0,
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9,
        65: 10,
        66: 11,
        67: 12,
        68: 13,
        69: 14,
        70: 15,
        97: 10,
        98: 11,
        99: 12,
        100: 13,
        101: 14,
        102: 15
    };

    var AsciiHexStream = DecodeStream.inherit({
        klassName : "AsciiHexStream",

        init : function(str) {
            this.str = str;
            this.dict = str.dict;

            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var gtCode = '>'.charCodeAt(0),
                bytes = this.str.getBytes(),
                c, n,
                decodeLength, buffer, bufferLength, i, length;

            decodeLength = (bytes.length + 1) >> 1;
            buffer = this.ensureBuffer(this.bufferLength + decodeLength);
            bufferLength = this.bufferLength;

            for (i = 0, length = bytes.length; i < length; i++) {
                c = hexvalueMap[bytes[i]];
                while (c == -1 && (i + 1) < length) {
                    c = hexvalueMap[bytes[++i]];
                }

                if ((i + 1) < length && (bytes[i + 1] !== gtCode)) {
                    n = hexvalueMap[bytes[++i]];
                    buffer[bufferLength++] = c * 16 + n;
                } else {
                    // EOD marker at an odd number, behave as if a 0 followed the last
                    // digit.
                    if (bytes[i] !== gtCode) {
                        buffer[bufferLength++] = c * 16;
                    }
                }
            }

            this.bufferLength = bufferLength;
            this.eof = true;        
       }

    });

    return streams.AsciiHexStream = AsciiHexStream;
});

define('skylark-data-streams/ChunkedStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx,streams,Stream) {


    var ChunkedStream = Stream.inherit({
        klassName : "ChunkedStream",

        "numChunks": 0,
        "numChunksLoaded": 0,

        init : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype.init.call(bytes);          
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


define('skylark-data-streams/DecryptStream',[
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


define('skylark-data-streams/FakeStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var FakeStream = DecodeStream.inherit({
        klassName : "FakeStream",

        init : function(stream) {
            this.dict = stream.dict;
            Stream.prototype.init.call(this);          
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


define('skylark-data-streams/FlateStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var codeLenCodeMap = new Uint32Array([
        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
    ]);

    var lengthDecode = new Uint32Array([
        0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
        0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
        0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
        0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
    ]);

    var distDecode = new Uint32Array([
        0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
        0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
        0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
        0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
    ]);

    var fixedLitCodeTab = [new Uint32Array([
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
        0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
        0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
        0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
        0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
        0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
        0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
        0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
        0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
        0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
        0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
        0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
        0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
        0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
        0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
        0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
        0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
        0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
        0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
        0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
        0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
        0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
        0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
        0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
        0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
        0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
        0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
        0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
        0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
        0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
        0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
        0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
        0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
        0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
        0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
        0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
        0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
        0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
        0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
        0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
        0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
        0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
        0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
        0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
        0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
        0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
        0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
        0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
        0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
    ]), 9];

    var fixedDistCodeTab = [new Uint32Array([
        0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
        0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
        0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
        0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
    ]), 5];


    var FlateStream = DecodeStream.inherit({
        klassName : "FlateStream",

        init : function(stream) {
            var bytes = stream.getBytes();
            var bytesPos = 0;

            this.dict = stream.dict;
            var cmf = bytes[bytesPos++];
            var flg = bytes[bytesPos++];
            if (cmf == -1 || flg == -1)
                error('Invalid header in flate stream: ' + cmf + ', ' + flg);
            if ((cmf & 0x0f) != 0x08)
                error('Unknown compression method in flate stream: ' + cmf + ', ' + flg);
            if ((((cmf << 8) + flg) % 31) != 0)
                error('Bad FCHECK in flate stream: ' + cmf + ', ' + flg);
            if (flg & 0x20)
                error('FDICT bit set in flate stream: ' + cmf + ', ' + flg);

            this.bytes = bytes;
            this.bytesPos = bytesPos;

            this.codeSize = 0;
            this.codeBuf = 0;
            DecodeStream.prototype.init.call(this);          
        },

        getBits : function(bits) {
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var bytes = this.bytes;
            var bytesPos = this.bytesPos;

            var b;
            while (codeSize < bits) {
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad encoding in flate stream');
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            b = codeBuf & ((1 << bits) - 1);
            this.codeBuf = codeBuf >> bits;
            this.codeSize = codeSize -= bits;
            this.bytesPos = bytesPos;
            return b;
        },

        getCode : function(table) {
            var codes = table[0];
            var maxLen = table[1];
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var bytes = this.bytes;
            var bytesPos = this.bytesPos;

            while (codeSize < maxLen) {
                var b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad encoding in flate stream');
                codeBuf |= (b << codeSize);
                codeSize += 8;
            }
            var code = codes[codeBuf & ((1 << maxLen) - 1)];
            var codeLen = code >> 16;
            var codeVal = code & 0xffff;
            if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
                error('Bad encoding in flate stream');
            this.codeBuf = (codeBuf >> codeLen);
            this.codeSize = (codeSize - codeLen);
            this.bytesPos = bytesPos;
            return codeVal;
        },

        generateHuffmanTable : function(lengths) {
                var n = lengths.length;

                // find max code length
                var maxLen = 0;
                for (var i = 0; i < n; ++i) {
                    if (lengths[i] > maxLen)
                        maxLen = lengths[i];
                }

                // build the table
                var size = 1 << maxLen;
                var codes = new Uint32Array(size);
                for (var len = 1, code = 0, skip = 2; len <= maxLen;
                    ++len, code <<= 1, skip <<= 1) {
                    for (var val = 0; val < n; ++val) {
                        if (lengths[val] == len) {
                            // bit-reverse the code
                            var code2 = 0;
                            var t = code;
                            for (var i = 0; i < len; ++i) {
                                code2 = (code2 << 1) | (t & 1);
                                t >>= 1;
                            }

                            // fill the table entries
                            for (var i = code2; i < size; i += skip)
                                codes[i] = (len << 16) | val;

                            ++code;
                        }
                    }
                }

                return [codes, maxLen];
        },

        readBlock : function() {
            // read block header
            var hdr = this.getBits(3);
            if (hdr & 1)
                this.eof = true;
            hdr >>= 1;

            if (hdr == 0) { // uncompressed block
                var bytes = this.bytes;
                var bytesPos = this.bytesPos;
                var b;

                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                var blockLen = b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                blockLen |= (b << 8);
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                var check = b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                check |= (b << 8);
                if (check != (~blockLen & 0xffff))
                    error('Bad uncompressed block length in flate stream');

                this.codeBuf = 0;
                this.codeSize = 0;

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + blockLen);
                var end = bufferLength + blockLen;
                this.bufferLength = end;
                for (var n = bufferLength; n < end; ++n) {
                    if (typeof(b = bytes[bytesPos++]) == 'undefined') {
                        this.eof = true;
                        break;
                    }
                    buffer[n] = b;
                }
                this.bytesPos = bytesPos;
                return;
            }

            var litCodeTable;
            var distCodeTable;
            if (hdr == 1) { // compressed block, fixed codes
                litCodeTable = fixedLitCodeTab;
                distCodeTable = fixedDistCodeTab;
            } else if (hdr == 2) { // compressed block, dynamic codes
                var numLitCodes = this.getBits(5) + 257;
                var numDistCodes = this.getBits(5) + 1;
                var numCodeLenCodes = this.getBits(4) + 4;

                // build the code lengths code table
                var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);

                for (var i = 0; i < numCodeLenCodes; ++i)
                    codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
                var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

                // build the literal and distance code tables
                var len = 0;
                var i = 0;
                var codes = numLitCodes + numDistCodes;
                var codeLengths = new Uint8Array(codes);
                while (i < codes) {
                    var code = this.getCode(codeLenCodeTab);
                    if (code == 16) {
                        var bitsLength = 2,
                            bitsOffset = 3,
                            what = len;
                    } else if (code == 17) {
                        var bitsLength = 3,
                            bitsOffset = 3,
                            what = (len = 0);
                    } else if (code == 18) {
                        var bitsLength = 7,
                            bitsOffset = 11,
                            what = (len = 0);
                    } else {
                        codeLengths[i++] = len = code;
                        continue;
                    }

                    var repeatLength = this.getBits(bitsLength) + bitsOffset;
                    while (repeatLength-- > 0)
                        codeLengths[i++] = what;
                }

                litCodeTable =
                    this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
                distCodeTable =
                    this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
            } else {
                error('Unknown block type in flate stream');
            }

            var buffer = this.buffer;
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
                if (code1 == 256) {
                    this.bufferLength = pos;
                    return;
                }
                code1 -= 257;
                code1 = lengthDecode[code1];
                var code2 = code1 >> 16;
                if (code2 > 0)
                    code2 = this.getBits(code2);
                var len = (code1 & 0xffff) + code2;
                code1 = this.getCode(distCodeTable);
                code1 = distDecode[code1];
                code2 = code1 >> 16;
                if (code2 > 0)
                    code2 = this.getBits(code2);
                var dist = (code1 & 0xffff) + code2;
                if (pos + len >= limit) {
                    buffer = this.ensureBuffer(pos + len);
                    limit = buffer.length;
                }
                for (var k = 0; k < len; ++k, ++pos)
                    buffer[pos] = buffer[pos - dist];
            }
        }
    });


    return streams.FlateStream = FlateStream;
});

define('skylark-data-streams/LZWStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var LZWStream = DecodeStream.inherit({
        klassName : "LZWStream",

        init : function(str, earlyChange) {
            this.str = str;
            this.dict = str.dict;
            this.cachedData = 0;
            this.bitsCached = 0;

            var maxLzwDictionarySize = 4096;
            var lzwState = {
                earlyChange: earlyChange,
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
            DecodeStream.prototype.init.call(this);          
        },

        readBits : function(n) {
            var bitsCached = this.bitsCached;
            var cachedData = this.cachedData;
            while (bitsCached < n) {
                var c = this.str.getByte();
                if (c == null) {
                    this.eof = true;
                    return null;
                }
                cachedData = (cachedData << 8) | c;
                bitsCached += 8;
            }
            this.bitsCached = (bitsCached -= n);
            this.cachedData = cachedData;
            this.lastCode = null;
            return (cachedData >>> bitsCached) & ((1 << n) - 1);
        },

        readBlock : function() {
            var blockSize = 512;
            var estimatedDecodedSize = blockSize * 2,
                decodedSizeDelta = blockSize;
            var i, j, q;

            var lzwState = this.lzwState;
            if (!lzwState)
                return; // eof was found

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
                } else if (code == 256) {
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
                    codeLength = (nextCode + earlyChange) & (nextCode + earlyChange - 1) ?
                        codeLength : Math.min(Math.log(nextCode + earlyChange) /
                            0.6931471805599453 + 1, 12) | 0;
                }
                prevCode = code;

                decodedLength += currentSequenceLength;
                if (estimatedDecodedSize < decodedLength) {
                    do {
                        estimatedDecodedSize += decodedSizeDelta;
                    } while (estimatedDecodedSize < decodedLength);
                    buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
                }
                for (j = 0; j < currentSequenceLength; j++)
                    buffer[currentBufferLength++] = currentSequence[j];
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


define('skylark-data-streams/PredictorStream',[
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


define('skylark-data-streams/StreamsSequenceStream',[
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

define('skylark-data-streams/StringStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx, streams, Stream) {

    var StringStream = Stream.inherit({
        klassName : "StringStream",

        init : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype.init.call(this);          
        }
    });


    return streams.StringStream = StringStream;

});

define('skylark-data-streams/main',[
    "./streams",
    "./Ascii85Stream",
    "./AsciiHexStream",
    "./ChunkedStream",
    "./DecodeStream",
    "./DecryptStream",
    "./FakeStream",
    "./FlateStream",
    "./LZWStream",
    "./PredictorStream",
    "./Stream",
    "./StreamsSequenceStream",
    "./StringStream"
], function(streams) {

	return streams;
});
define('skylark-data-streams', ['skylark-data-streams/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-data-streams.js.map
