 define([
	"./objects"
],function(objects) {

    function shadow(obj, prop, value) {
        Object.defineProperty(obj, prop, {
            value,
            enumerable: true,
            configurable: true,
            writable: false
        });
        return value;
    }

    return objects.shadow = shadow;
});