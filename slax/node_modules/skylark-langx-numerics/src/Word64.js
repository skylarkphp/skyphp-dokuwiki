define([],function(){
    //ref:pdfjs>src/core/crypto.js

    function Word64(highInteger, lowInteger) {
        this.high = highInteger | 0;
        this.low = lowInteger | 0;
    }
    Word64.prototype = {
        and: function Word64_and(word) {
            this.high &= word.high;
            this.low &= word.low;
        },
        xor: function Word64_xor(word) {
            this.high ^= word.high;
            this.low ^= word.low;
        },
        or: function Word64_or(word) {
            this.high |= word.high;
            this.low |= word.low;
        },
        shiftRight: function Word64_shiftRight(places) {
            if (places >= 32) {
                this.low = this.high >>> places - 32 | 0;
                this.high = 0;
            } else {
                this.low = this.low >>> places | this.high << 32 - places;
                this.high = this.high >>> places | 0;
            }
        },
        shiftLeft: function Word64_shiftLeft(places) {
            if (places >= 32) {
                this.high = this.low << places - 32;
                this.low = 0;
            } else {
                this.high = this.high << places | this.low >>> 32 - places;
                this.low = this.low << places;
            }
        },
        rotateRight: function Word64_rotateRight(places) {
            var low, high;
            if (places & 32) {
                high = this.low;
                low = this.high;
            } else {
                low = this.low;
                high = this.high;
            }
            places &= 31;
            this.low = low >>> places | high << 32 - places;
            this.high = high >>> places | low << 32 - places;
        },
        not: function Word64_not() {
            this.high = ~this.high;
            this.low = ~this.low;
        },
        add: function Word64_add(word) {
            var lowAdd = (this.low >>> 0) + (word.low >>> 0);
            var highAdd = (this.high >>> 0) + (word.high >>> 0);
            if (lowAdd > 4294967295) {
                highAdd += 1;
            }
            this.low = lowAdd | 0;
            this.high = highAdd | 0;
        },
        copyTo: function Word64_copyTo(bytes, offset) {
            bytes[offset] = this.high >>> 24 & 255;
            bytes[offset + 1] = this.high >> 16 & 255;
            bytes[offset + 2] = this.high >> 8 & 255;
            bytes[offset + 3] = this.high & 255;
            bytes[offset + 4] = this.low >>> 24 & 255;
            bytes[offset + 5] = this.low >> 16 & 255;
            bytes[offset + 6] = this.low >> 8 & 255;
            bytes[offset + 7] = this.low & 255;
        },
        assign: function Word64_assign(word) {
            this.high = word.high;
            this.low = word.low;
        }
    };
    return Word64;
});