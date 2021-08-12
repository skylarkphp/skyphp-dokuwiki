define([
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark,langx) {
    "use strict";

    var browser = langx.hoster.browser;


    langx.mixin(browser, {

        isIE : !!/msie/i.exec( window.navigator.userAgent ),

        location: function() {
            return window.location;
        },

        support : {

        }

    });



    return skylark.attach("domx.browser",browser);
});
