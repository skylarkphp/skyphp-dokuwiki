define([
    "skylark-langx-objects/mixin",
    "skylark-langx-strings",
    "../caches"
], function(mixin,strings,caches) {
    "use strict";

    var storage  = null;

    try {
        storage = window["sessiionStorage"];
    } catch (e){

    }

    function sessiionStorage() {
        return sessiionStorage;
    }

    mixin(sessiionStorage, {
        isSupported : function() {
            return !!storage;
        },

        set : function(key, val) {
            if (val === undefined) { 
                return this.remove(key) 
            }
            storage.setItem(key, strings.serializeValue(val));
            return val
        },

        get : function(key, defaultVal) {
            var val = strings.deserializeValue(storage.getItem(key))
            return (val === undefined ? defaultVal : val)
        },

        remove : function(key) { 
            storage.removeItem(key) 
        },

        clear : function() { 
            storage.clear() 
        },

        list : function() {
            var vaules = {}
            for (var i=0; i<storage.length; i++) {
                vaules[key] = storage.key(i)
            }

            return values;
        }
    });

    return  caches.storages.session = sessionStorage;

});

