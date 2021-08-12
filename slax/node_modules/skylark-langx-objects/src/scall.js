define([
    "./objects"
],function(objects) {

    function scall(obj,method,arg1,arg2) {
        if (obj && obj[method]) {
            var args = slice.call(arguments, 2);

            return obj[method].apply(obj,args);
        }
    }

    return objects.scall = scall;
});