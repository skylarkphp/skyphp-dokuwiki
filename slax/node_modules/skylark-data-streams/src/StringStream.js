define([
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
