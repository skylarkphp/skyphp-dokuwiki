define([
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark,langx) {

    function transits() {
        return transits;
    }

    langx.mixin(transits, {
        off: false,
        speeds: {
            normal: 400,
            fast: 200,
            slow: 600
        }
    });

    return skylark.attach("domx.transits", transits);
});