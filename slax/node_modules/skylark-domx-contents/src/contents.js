define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data"
], function(skylark, langx, noder,datax) {
    "use strict";

    var contents = function() {
        return contents;
    };


    return skylark.attach("domx.contents",contents);

});