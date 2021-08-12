define([
    "skylark-langx-types",
    "./objects"
],function(types,objects) {

    var isPlainObject = types.isPlainObject;

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            //if (!source.hasOwnProperty(key)) {
            //    continue;
            //}
            if (safe && target[key] !== undefined) {
                continue;
            }
            // if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            //    if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
            if (deep && isPlainObject(source[key])) {
                if (!isPlainObject(target[key])) {
                    target[key] = {};
                }
                //if (isArray(source[key]) && !isArray(target[key])) {
                //    target[key] = [];
                //}
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

    return _mixin;
});