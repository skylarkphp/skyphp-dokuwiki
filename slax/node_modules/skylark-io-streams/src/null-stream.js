define([
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
