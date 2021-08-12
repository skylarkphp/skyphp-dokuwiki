define([
    "skylark-langx/objects",
    "skylark-domx-eventer",
    "skylark-domx-velm",
    "skylark-domx-query",   
    "./files"
],function(objects, eventer,velm,$, files){
    function pastezone(elm, params) {
        params = params || {};
        var hoverClass = params.hoverClass || "hover",
            pastedCallback = params.pasted;

        eventer.on(elm, "paste", function(e) {
            var items = e.originalEvent && e.originalEvent.clipboardData &&
                e.originalEvent.clipboardData.items,
                files = [];
            if (items && items.length) {
                objects.each(items, function(index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        files.push(file);
                    }
                });
            }
            if (pastedCallback && files.length) {
                pastedCallback(files);
            }
        });

        return this;
    }

    files.pastezone = pastezone;

    velm.delegate([
        "pastezone"
    ],files);

    $.fn.pastezone = $.wraps.wrapper_every_act(files.pastezone, files);

    return pastezone;

});
