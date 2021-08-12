define([
    "skylark-langx-ns",
    "skylark-langx-types"
],function(skylark,types){

    function isWhiteSpace(ch) {
        return ch === 32 || ch === 9 || ch === 13 || ch === 10;
    }

    return skylark.attach("langx.chars",{
        isWhiteSpace
    });


});