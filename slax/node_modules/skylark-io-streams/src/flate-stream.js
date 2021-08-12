define([
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
