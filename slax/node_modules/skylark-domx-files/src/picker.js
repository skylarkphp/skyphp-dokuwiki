define([
    "skylark-langx/objects",
    "skylark-domx-eventer",
    "skylark-domx-velm",
    "skylark-domx-query",   
    "skylark-io-diskfs/select",
    "./files"
],function(objects, eventer, velm, $, select, files){
    /*
     * Make the specified element to pop-up the file selection dialog box when clicked , and read the contents the files selected from client file system by user.
     * @param {HTMLElement} elm
     * @param {PlainObject} params
     */
    function picker(elm, params) {
        eventer.on(elm, "click", function(e) {
            e.preventDefault();
            select(params);
        });
        return this;
    }

    files.picker = picker;

    velm.delegate([
        "picker"
    ],files);

    $.fn.picker = $.wraps.wrapper_every_act(files.picker, files);

    return picker;

});


