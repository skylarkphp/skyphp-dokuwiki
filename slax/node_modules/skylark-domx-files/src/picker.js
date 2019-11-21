define([
    "skylark-langx/objects",
    "skylark-domx-eventer",
    "./files",
    "skylark-storages-diskfs/select"
],function(objects, eventer, files, select){
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

    return files.picker = picker;

});


