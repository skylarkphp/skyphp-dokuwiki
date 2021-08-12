define([
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
