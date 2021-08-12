/**
 * skylark-io-streams - The stream features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx-ns/_attach',[],function(){
    return  function attach(obj1,path,obj2) {
        if (typeof path == "string") {
            path = path.split(".");//[path]
        };
        var length = path.length,
            ns=obj1,
            i=0,
            name = path[i++];

        while (i < length) {
            ns = ns[name] = ns[name] || {};
            name = path[i++];
        }

        ns[name] = obj2 || {};
        return ns[name];
    }
});
define('skylark-langx-ns/ns',[
    "./_attach"
], function(_attach) {
    var skylark = {
    	attach : function(path,obj) {
    		return _attach(skylark,path,obj);
    	}
    };
    return skylark;
});

define('skylark-langx-ns/main',[
	"./ns"
],function(skylark){
	return skylark;
});
define('skylark-langx-ns', ['skylark-langx-ns/main'], function (main) { return main; });

define('skylark-io-streams/streams',[
    "skylark-langx-ns"
], function(skylark) {

    return skylark.attach("io.streams");
});

define('skylark-langx-types/types',[
    "skylark-langx-ns"
],function(skylark){
    var nativeIsArray = Array.isArray, 
        toString = {}.toString;
    
    var type = (function() {
        var class2type = {};

        // Populate the class2type map
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        return function type(obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object";
        };
    })();

 
    var  isArray = nativeIsArray || function(obj) {
        return object && object.constructor === Array;
    };


    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function/string/element and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * isArrayLike([1, 2, 3])
     * // => true
     *
     * isArrayLike(document.body.children)
     * // => false
     *
     * isArrayLike('abc')
     * // => true
     *
     * isArrayLike(Function)
     * // => false
     */    
    function isArrayLike(obj) {
        return !isString(obj) && !isHtmlNode(obj) && typeof obj.length == 'number' && !isFunction(obj);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * isBoolean(false)
     * // => true
     *
     * isBoolean(null)
     * // => false
     */
    function isBoolean(obj) {
       return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
       //return typeof(obj) === "boolean";
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

   // Is a given value a DOM element?
    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }   

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            if (obj[name] !== null) {
                return false;
            }
        }
        return true;
    }


    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * isFunction(parseInt)
     * // => true
     *
     * isFunction(/abc/)
     * // => false
     */
    function isFunction(value) {
        return type(value) == "function";
    }



    function isHtmlNode(obj) {
        return obj && obj.nodeType; // obj instanceof Node; //Consider the elements in IFRAME
    }

    function isInstanceOf( /*Object*/ value, /*Type*/ type) {
        //Tests whether the value is an instance of a type.
        if (value === undefined) {
            return false;
        } else if (value === null || type == Object) {
            return true;
        } else if (typeof value === "number") {
            return type === Number;
        } else if (typeof value === "string") {
            return type === String;
        } else if (typeof value === "boolean") {
            return type === Boolean;
        } else if (typeof value === "string") {
            return type === String;
        } else {
            return (value instanceof type) || (value && value.isInstanceOf ? value.isInstanceOf(type) : false);
        }
    }

    function isNull(obj) {
        return obj === null;
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;        
        //return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isWindow(obj) {
        return obj && obj == obj.window;
    }

    function isSameOrigin(href) {
        if (href) {
            var origin = location.protocol + '//' + location.hostname;
            if (location.port) {
                origin += ':' + location.port;
            }
            return href.startsWith(origin);
        }
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    // Is a given variable undefined?
    function isUndefined(obj) {
        return obj === void 0;
    }


    var INFINITY = 1 / 0,
        MAX_SAFE_INTEGER = 9007199254740991,
        MAX_INTEGER = 1.7976931348623157e+308,
        NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }   

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }





    return skylark.attach("langx.types",{

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: isDefined,

        isDocument: isDocument,

        isElement,

        isEmpty : isEmptyObject,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isHtmlNode: isHtmlNode,

        isNaN : function (obj) {
            return isNaN(obj);
        },

        isNull: isNull,


        isNumber: isNumber,

        isNumeric: isNumber,

        isObject: isObject,

        isPlainObject: isPlainObject,

        isString: isString,

        isSameOrigin: isSameOrigin,

        isSymbol : isSymbol,

        isUndefined: isUndefined,

        isWindow: isWindow,

        type: type,

        toFinite : toFinite,
        toNumber : toNumber,
        toInteger : toInteger
        
    });

});
define('skylark-langx-types/main',[
	"./types"
],function(types){
	return types;
});
define('skylark-langx-types', ['skylark-langx-types/main'], function (main) { return main; });

define('skylark-langx-chars/chars',[
    "skylark-langx-ns",
    "skylark-langx-types"
],function(skylark,types){

    function isWhiteSpace(ch) {
        return ch === 32 || ch === 9 || ch === 13 || ch === 10;
    }

    return skylark.attach("langx.chars",{
        isWhiteSpace
    });


});
define('skylark-langx-chars/main',[
	"./chars"
],function(chars){
	return chars;
});
define('skylark-langx-chars', ['skylark-langx-chars/main'], function (main) { return main; });

define('skylark-langx-events/events',[
	"skylark-langx-ns"
],function(skylark){
	return skylark.attach("langx.events",{});
});
define('skylark-langx-objects/objects',[
    "skylark-langx-ns",
    "skylark-langx-types"
],function(skylark,types){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        isBoolean = types.isBoolean,
        isFunction = types.isFunction,
        isObject = types.isObject,
        isPlainObject = types.isPlainObject,
        isArray = types.isArray,
        isArrayLike = types.isArrayLike,
        isString = types.isString,
        toInteger = types.toInteger;

     // An internal function for creating assigner functions.
    function createAssigner(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);  
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
       };
    }


    // Retrieve all the property names of an object.
    function allKeys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    function keys(obj) {
        if (isObject(obj)) return [];
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        return keys;
    }

    function has(obj, path) {
        if (!isArray(path)) {
            return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var key = path[i];
            if (obj == null || !hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = obj[key];
        }
        return !!length;
    }


    // Returns whether an object has a given set of `key:value` pairs.
    function isMatch(object, attrs) {
        var keys = keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    }    


    function removeItem(items, item) {
        if (isArray(items)) {
            var idx = items.indexOf(item);
            if (idx != -1) {
                items.splice(idx, 1);
            }
        } else if (isPlainObject(items)) {
            for (var key in items) {
                if (items[key] == item) {
                    delete items[key];
                    break;
                }
            }
        }

        return this;
    }



    // Retrieve the values of an object's properties.
    function values(obj) {
        var keys = allKeys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    }


    return skylark.attach("langx.objects",{
        allKeys: allKeys,

        attach : skylark.attach,

        defaults : createAssigner(allKeys, true),

        has: has,

        isMatch: isMatch,

        keys: keys,

        removeItem: removeItem,

        values: values
    });


});
define('skylark-langx-objects/clone',[
    "skylark-langx-types",
    "./objects"
],function(types,objects) {
    var isPlainObject = types.isPlainObject,
        isArray = types.isArray;

    function clone( /*anything*/ src,checkCloneMethod) {
        var copy;
        if (src === undefined || src === null) {
            copy = src;
        } else if (checkCloneMethod && src.clone) {
            copy = src.clone();
        } else if (isArray(src)) {
            copy = [];
            for (var i = 0; i < src.length; i++) {
                copy.push(clone(src[i]));
            }
        } else if (isPlainObject(src)) {
            copy = {};
            for (var key in src) {
                copy[key] = clone(src[key]);
            }
        } else {
            copy = src;
        }

        return copy;

    }

    return objects.clone = clone;
});
define('skylark-langx-objects/each',[
    "./objects"
],function(objects) {

    function each(obj, callback,isForEach) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if ((isForEach ? callback.call(value, value, key) : callback.call(value, key, value) ) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if ((isForEach ? callback.call(value, value, i) : callback.call(value, i, value) )=== false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

    return objects.each = each;
});
define('skylark-langx-objects/_mixin',[
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
define('skylark-langx-objects/_parse_mixin_args',[
    "skylark-langx-types",
    "./objects"
],function(types,objects) {

    var isBoolean = types.isBoolean;

    function _parseMixinArgs(args) {
        var params = slice.call(arguments, 0),
            target = params.shift(),
            deep = false;
        if (isBoolean(params[params.length - 1])) {
            deep = params.pop();
        }

        return {
            target: target,
            sources: params,
            deep: deep
        };
    }
    
    return _parseMixinArgs;
});
define('skylark-langx-objects/mixin',[
	"skylark-langx-types",
	"./objects",
  "./_mixin",
  "./_parse_mixin_args"
],function(types,objects,_mixin,_parseMixinArgs) {


    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }


    return objects.mixin = mixin;
	
});
define('skylark-langx-objects/extend',[
    "./objects",
    "./mixin"
],function(objects,mixin) {

    function extend(target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        if (args.length == 0) {
            args = [target];
            target = this;
        }
        args.forEach(function(arg) {
            mixin(target, arg, deep);
        });
        return target;
    }

    return objects.extend = extend;
});
define('skylark-langx-objects/includes',[
    "./objects"
],function(objects) {

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }



    return objects.includes = includes;
});
define('skylark-langx-objects/is-equal',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {
    var isFunction = types.isFunction;


    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        //if (a instanceof _) a = a._wrapped;
        //if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = Object.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (Object.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(b[key]!==undefined && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };


   // Perform a deep comparison to check if two objects are equal.
    function isEqual(a, b) {
        return eq(a, b);
    }

    return objects.isEqual = isEqual;
	
});
define('skylark-langx-objects/omit',[
    "./objects"
],function(objects) {

   // Return a copy of the object without the blacklisted properties.
    function omit(obj, prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = mixin({},obj);
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                delete result[pn];
            }
        }
        return result;

    }
    
    return objects.omit = omit;
});
define('skylark-langx-objects/pick',[
    "./objects"
],function(objects) {

   // Return a copy of the object only containing the whitelisted properties.
    function pick(obj,prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = {};
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                result[pn] = obj[pn];
            }
        }
        return result;
    }
    
    return objects.pick = pick;
});
define('skylark-langx-objects/result',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {
	var isArray = types.isArray,
		isFunction = types.isFunction;

    function result(obj, path, fallback) {
        if (!isArray(path)) {
            path = path.split(".");//[path]
        };
        var length = path.length;
        if (!length) {
          return isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
          var prop = obj == null ? void 0 : obj[path[i]];
          if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
          }
          obj = isFunction(prop) ? prop.call(obj) : prop;
        }

        return obj;
    }

    return objects.result = result;
	
});
define('skylark-langx-objects/safe-mixin',[
	"./objects",
  "./_mixin",
  "./_parse_mixin_args"
],function(objects,_mixin,_parseMixinArgs) {

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
    }

    return objects.safeMixin = safeMixin;
});
define('skylark-langx-objects/scall',[
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
 define('skylark-langx-objects/shadow',[
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
define('skylark-langx-objects/main',[
	"./objects",
	"./clone",
	"./each",
	"./extend",
	"./includes",
	"./is-equal",
	"./mixin",
	"./omit",
	"./pick",
	"./result",
	"./safe-mixin",
	"./scall",
	"./shadow"
],function(objects){
	return objects;
});
define('skylark-langx-objects', ['skylark-langx-objects/main'], function (main) { return main; });

define('skylark-langx-funcs/funcs',[
  "skylark-langx-ns",
],function(skylark,types,objects){
        



    function noop() {
    }




    return skylark.attach("langx.funcs",{
        noop : noop,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        }

    });
});
define('skylark-langx-funcs/defer',[
    "skylark-langx-types",
    "./funcs"
],function(types,funcs){

    function defer(fn,trigger,args,context) {
        var ret = {
            cancel : null
        },
        fn1 = fn;

        if (!types.isNumber(trigger) && !types.isFunction(trigger)) {
            context = args;
            args = trigger;
            trigger = 0;
        }

        if (args) {
            fn1 = function() {
                fn.apply(context,args);
            };
        }

        if (types.isFunction(trigger)) {
            var canceled = false;
            trigger(function(){
                if (!canceled) {
                    fn1();
                }
            });

            ret.cancel = function() {
                canceled = true;
            }

        } else {
            var  id;
            if (trigger == 0 && requestAnimationFrame) {
                id = requestAnimationFrame(fn1);
                ret.cancel = function() {
                    return cancelAnimationFrame(id);
                };
            } else {
                id = setTimeout(fn1,trigger);
                ret.cancel = function() {
                    return clearTimeout(id);
                };
            }            
        }

        return ret;
    }

    return funcs.defer = defer;
});
define('skylark-langx-funcs/debounce',[
	"./funcs",
    "./defer"
],function(funcs,defer){
   
    function debounce(fn, wait,useAnimationFrame) {
        var timeout,
            defered,
            debounced = function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (useAnimationFrame) {
                        defered = defer(fn,args,context);
                    } else {
                        fn.apply(context, args);
                    }
                };

                cancel();
                timeout = setTimeout(later, wait);

                return {
                    cancel 
                };
            },
            cancel = debounced.cancel = function () {
                if (timeout) {
                    clearTimeout(timeout);
                }
                if (defered) {
                    defered.cancel();
                }
                timeout = void 0;
                defered = void 0;
            };

        return debounced;
    }

    return funcs.debounce = debounce;

});
define('skylark-langx-funcs/delegate',[
  "skylark-langx-objects",
  "./funcs"
],function(objects,funcs){
	var mixin = objects.mixin;

    var delegate = (function() {
        // boodman/crockford delegation w/ cornford optimization
        function TMP() {}
        return function(obj, props) {
            TMP.prototype = obj;
            var tmp = new TMP();
            TMP.prototype = null;
            if (props) {
                mixin(tmp, props);
            }
            return tmp; // Object
        };
    })();

    return funcs.delegate = delegate;

});
define('skylark-langx-funcs/loop',[
	"./funcs"
],function(funcs){

	/**
	 * Animation timer is a special type of timer that uses the requestAnimationFrame method.
	 *
	 * This timer calls the method with the same rate as the screen refesh rate.
	 * 
	 * Loop time can be changed dinamically.
	 *
	 * @class AnimationTimer
	 * @param {Function} callback Timer callback function.
	 */
	function AnimationTimer(callback)
	{
		this.callback = callback;

		this.running = false;
		this.id = -1;
	}

	/**
	 * Start timer, is the timer is already running dosen't do anything.
	 * 
	 * @method start
	 */
	AnimationTimer.prototype.start = function()
	{
		if(this.running)
		{
			return;
		}

		this.running = true;

		var self = this;
		function run()
		{
			self.callback();

			if(self.running)
			{
				self.id = requestAnimationFrame(run);
			}
		}

		run();
	};

	/**
	 * Stop animation timer.
	 * 
	 * @method stop
	 */
	AnimationTimer.prototype.stop = function()
	{
		this.running = false;
		cancelAnimationFrame(this.id);
	};

	function loop(fn) {
		return new AnimationTimer(fn);
    }

    return funcs.loop = loop;
});
define('skylark-langx-funcs/negate',[
	"./funcs"
],function(funcs){
   
    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0
     * }
     *
     * filter([1, 2, 3, 4, 5, 6], negate(isEven))
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate !== 'function') {
        throw new TypeError('Expected a function')
      }
      return function(...args) {
        return !predicate.apply(this, args)
      }
    }


    return funcs.negate = negate;

});
define('skylark-langx-funcs/proxy',[
  "skylark-langx-types",
	"./funcs"
],function(types,funcs){
    var slice = Array.prototype.slice,
        isFunction = types.isFunction,
        isString = types.isString;

    function proxy(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            }
            return proxyFn;
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return proxy.apply(null, args)
            } else {
                return proxy(fn[context], fn);
            }
        } else {
            throw new TypeError("expected function");
        }
    }

    return funcs.bind = funcs.proxy = proxy;

});
define('skylark-langx-funcs/template',[
  "skylark-langx-objects",
  "./funcs",
  "./proxy"
],function(objects,funcs,proxy){
    var slice = Array.prototype.slice;

   
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    var templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;


    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;


    function template(text, data, settings) {
        var render;
        settings = objects.defaults({}, settings,templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += text.slice(index, offset)
              .replace(escaper, function(match) { return '\\' + escapes[match]; });

          if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
          }
          if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
          }
          if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + 'return __p;\n';

        try {
          render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
          e.source = source;
          throw e;
        }

        if (data) {
          return render(data,this)
        }
        var template = proxy(function(data) {
          return render.call(this, data,this);
        },this);

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    }

    template.templateSettings = funcs.templateSettings = templateSettings;

    return funcs.template = template;

});
define('skylark-langx-funcs/throttle',[
  "./funcs"
],function(funcs){

    const throttle = function (fn, wait) {
        let last = window.performance.now();
        const throttled = function (...args) {
            const now = window.performance.now();
            if (now - last >= wait) {
                fn(...args);
                last = now;
            }
        };
        return throttled;
    };

    return funcs.throttle = throttle;
});
define('skylark-langx-funcs/main',[
	"./funcs",
	"./debounce",
	"./defer",
	"./delegate",
	"./loop",
	"./negate",
	"./proxy",
	"./template",
	"./throttle"
],function(funcs){
	return funcs;
});
define('skylark-langx-funcs', ['skylark-langx-funcs/main'], function (main) { return main; });

define('skylark-langx-arrays/arrays',[
  "skylark-langx-ns",
  "skylark-langx-types",
  "skylark-langx-objects"
],function(skylark,types,objects){
    var filter = Array.prototype.filter,
        find = Array.prototype.find,
        isArrayLike = types.isArrayLike;

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }


    function compact(array) {
        return filter.call(array, function(item) {
            return item != null;
        });
    }

    function filter2(array,func) {
      return filter.call(array,func);
    }

    function flatten(array) {
        if (isArrayLike(array)) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (isArrayLike(item)) {
                    for (var j = 0; j < item.length; j++) {
                        result.push(item[j]);
                    }
                } else {
                    result.push(item);
                }
            }
            return result;
        } else {
            return array;
        }
        //return array.length > 0 ? concat.apply([], array) : array;
    }

    function grep(array, callback) {
        var out = [];

        objects.each(array, function(i, item) {
            if (callback(item, i)) {
                out.push(item);
            }
        });

        return out;
    }

    function inArray(item, array) {
        if (!array) {
            return -1;
        }
        var i;

        if (array.indexOf) {
            return array.indexOf(item);
        }

        i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    }

    function indexOf(array,item) {
      return array.indexOf(item);
    }

    function makeArray(obj, offset, startWith) {
       if (isArrayLike(obj) ) {
        return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
      }

      // array of single index
      return [ obj ];             
    }


    function forEach (arr, fn) {
      if (arr.forEach) return arr.forEach(fn)
      for (var i = 0; i < arr.length; i++) fn(arr[i], i);
    }

    function last(arr) {
        return arr[arr.length - 1];     
    }

    function map(elements, callback) {
        var value, values = [],
            i, key
        if (isArrayLike(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback.call(elements[i], elements[i], i);
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback.call(elements[key], elements[key], key);
                if (value != null) values.push(value)
            }
        return flatten(values)
    }


    function merge( first, second ) {
      var l = second.length,
          i = first.length,
          j = 0;

      if ( typeof l === "number" ) {
        for ( ; j < l; j++ ) {
          first[ i++ ] = second[ j ];
        }
      } else {
        while ( second[j] !== undefined ) {
          first[ i++ ] = second[ j++ ];
        }
      }

      first.length = i;

      return first;
    }

    function reduce(array,callback,initialValue) {
        return Array.prototype.reduce.call(array,callback,initialValue);
    }

    function uniq(array) {
        return filter.call(array, function(item, idx) {
            return array.indexOf(item) == idx;
        })
    }

    function find2(array,func) {
      return find.call(array,func);
    }

    return skylark.attach("langx.arrays",{
        baseFindIndex: baseFindIndex,

        baseIndexOf : baseIndexOf,
        
        compact: compact,

        first : function(items,n) {
            if (n) {
                return items.slice(0,n);
            } else {
                return items[0];
            }
        },

        filter : filter2,

        find : find2,
        
        flatten: flatten,

        grep: grep,

        inArray: inArray,

        indexOf : indexOf,

        makeArray: makeArray, // 

        toArray : makeArray,

        last : last,

        merge : merge,

        forEach : forEach,

        map : map,
        
        reduce : reduce,

        uniq : uniq

    });
});
define('skylark-langx-arrays/main',[
	"./arrays"
],function(arrays){
	return arrays;
});
define('skylark-langx-arrays', ['skylark-langx-arrays/main'], function (main) { return main; });

define('skylark-langx-constructs/constructs',[
  "skylark-langx-ns"
],function(skylark){

    return skylark.attach("langx.constructs",{});
});
define('skylark-langx-constructs/inherit',[
	"./constructs"
],function(constructs){

    function inherit(ctor,base) {
        ///var f = function() {};
        ///f.prototype = base.prototype;
        ///
        ///ctor.prototype = new f();

	    if ((typeof base !== "function") && base) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    ctor.prototype = Object.create(base && base.prototype, {
	      constructor: {
	        value: ctor,
	        writable: true,
	        configurable: true
	      }
	    });

	    if (base) {
	    	//tor.__proto__ = base;
	    	Object.setPrototypeOf(ctor, base);
	    } 
    }

    return constructs.inherit = inherit
});
define('skylark-langx-constructs/klass',[
  "skylark-langx-ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "./constructs",
  "./inherit"
],function(skylark,types,objects,arrays,constructs,inherit){
    var uniq = arrays.uniq,
        has = objects.has,
        mixin = objects.mixin,
        isArray = types.isArray,
        isDefined = types.isDefined;

/* for reference 
 function klass(props,parent) {
    var ctor = function(){
        this._construct();
    };
    ctor.prototype = props;
    if (parent) {
        ctor._proto_ = parent;
        props.__proto__ = parent.prototype;
    }
    return ctor;
}

// Type some JavaScript code here.
let animal = klass({
  _construct(){
      this.name = this.name + ",hi";
  },
    
  name: "Animal",
  eat() {         // [[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
    
    
});


let rabbit = klass({
  name: "Rabbit",
  _construct(){
      super._construct();
  },
  eat() {         // [[HomeObject]] == rabbit
    super.eat();
  }
},animal);

let longEar = klass({
  name: "Long Ear",
  eat() {         // [[HomeObject]] == longEar
    super.eat();
  }
},rabbit);
*/
    


    var f1 = function() {
        function extendClass(ctor, props, options) {
            // Copy the properties to the prototype of the class.
            var proto = ctor.prototype,
                _super = ctor.superclass.prototype,
                noOverrided = options && options.noOverrided,
                overrides = options && options.overrides || {};

            for (var name in props) {
                if (name === "constructor") {
                    continue;
                }

                // Check if we're overwriting an existing function
                var prop = props[name];
                if (typeof props[name] == "function") {
                    proto[name] =  !prop._constructor && !noOverrided && typeof _super[name] == "function" ?
                          (function(name, fn, superFn) {
                            return function() {
                                var tmp = this.overrided;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this.overrided = superFn;

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);

                                this.overrided = tmp;

                                return ret;
                            };
                        })(name, prop, _super[name]) :
                        prop;
                } else if (types.isPlainObject(prop) && prop!==null && (prop.get)) {
                    Object.defineProperty(proto,name,prop);
                } else {
                    proto[name] = prop;
                }
            }
            return ctor;
        }

        function serialMixins(ctor,mixins) {
            var result = [];

            mixins.forEach(function(mixin){
                if (has(mixin,"__mixins__")) {
                     throw new Error("nested mixins");
                }
                var clss = [];
                while (mixin) {
                    clss.unshift(mixin);
                    mixin = mixin.superclass;
                }
                result = result.concat(clss);
            });

            result = uniq(result);

            result = result.filter(function(mixin){
                var cls = ctor;
                while (cls) {
                    if (mixin === cls) {
                        return false;
                    }
                    if (has(cls,"__mixins__")) {
                        var clsMixines = cls["__mixins__"];
                        for (var i=0; i<clsMixines.length;i++) {
                            if (clsMixines[i]===mixin) {
                                return false;
                            }
                        }
                    }
                    cls = cls.superclass;
                }
                return true;
            });

            if (result.length>0) {
                return result;
            } else {
                return false;
            }
        }

        function mergeMixins(ctor,mixins) {
            var newCtor =ctor;
            for (var i=0;i<mixins.length;i++) {
                var xtor = new Function();

                inherit(xtor,newCtor)
                //xtor.prototype = Object.create(newCtor.prototype);
                //xtor.__proto__ = newCtor;
                xtor.superclass = null;
                mixin(xtor.prototype,mixins[i].prototype);
                xtor.prototype.__mixin__ = mixins[i];
                newCtor = xtor;
            }

            return newCtor;
        }

        function _constructor ()  {
            if (this._construct) {
                return this._construct.apply(this, arguments);
            } else  if (this.init) {
                return this.init.apply(this, arguments);
            }
        }

        return function createClass(props, parent, mixins,options) {
            if (isArray(parent)) {
                options = mixins;
                mixins = parent;
                parent = null;
            }
            parent = parent || Object;

            if (isDefined(mixins) && !isArray(mixins)) {
                options = mixins;
                mixins = false;
            }

            var innerParent = parent;

            if (mixins) {
                mixins = serialMixins(innerParent,mixins);
            }

            if (mixins) {
                innerParent = mergeMixins(innerParent,mixins);
            }

            var klassName = props.klassName || "",
                ctor = new Function(
                    "return function " + klassName + "() {" +
                    "var inst = this," +
                    " ctor = arguments.callee;" +
                    "if (!(inst instanceof ctor)) {" +
                    "inst = Object.create(ctor.prototype);" +
                    "}" +
                    "return ctor._constructor.apply(inst, arguments) || inst;" + 
                    "}"
                )();


            // Populate our constructed prototype object
            ///ctor.prototype = Object.create(innerParent.prototype);

            // Enforce the constructor to be what we expect
            ///ctor.prototype.constructor = ctor;
  
            // And make this class extendable
            ///ctor.__proto__ = innerParent;

            inherit(ctor,innerParent);

            ctor.superclass = parent;

            if (!ctor._constructor) {
                ctor._constructor = _constructor;
            } 

            if (mixins) {
                ctor.__mixins__ = mixins;
            }

            if (!ctor.partial) {
                ctor.partial = function(props, options) {
                    return extendClass(this, props, options);
                };
            }
            if (!ctor.inherit) {
                ctor.inherit = function(props, mixins,options) {
                    return createClass(props, this, mixins,options);
                };
            }

            ctor.partial(props, options);

            return ctor;
        };
    }

    var createClass = f1();

    return constructs.klass = createClass;
});
define('skylark-langx-klass/klass',[
  "skylark-langx-ns",
  "skylark-langx-constructs/klass"
],function(skylark,klass){


    return skylark.attach("langx.klass",klass);
});
define('skylark-langx-klass/main',[
	"./klass"
],function(klass){
	return klass;
});
define('skylark-langx-klass', ['skylark-langx-klass/main'], function (main) { return main; });

define('skylark-langx-hoster/hoster',[
    "skylark-langx-ns"
],function(skylark){
	// The javascript host environment, brower and nodejs are supported.
	var hoster = {
		"isBrowser" : true, // default
		"isNode" : null,
		"global" : this,
		"browser" : null,
		"node" : null
	};

	if (typeof process == "object" && process.versions && process.versions.node && process.versions.v8) {
		hoster.isNode = true;
		hoster.isBrowser = false;
	}

	hoster.global = (function(){
		if (typeof global !== 'undefined' && typeof global !== 'function') {
			// global spec defines a reference to the global object called 'global'
			// https://github.com/tc39/proposal-global
			// `global` is also defined in NodeJS
			return global;
		} else if (typeof window !== 'undefined') {
			// window is defined in browsers
			return window;
		}
		else if (typeof self !== 'undefined') {
			// self is defined in WebWorkers
			return self;
		}
		return this;
	})();

	var _document = null;

	Object.defineProperty(hoster,"document",function(){
		if (!_document) {
			var w = typeof window === 'undefined' ? require('html-element') : window;
			_document = w.document;
		}

		return _document;
	});

	if (hoster.global.CustomEvent === undefined) {
		hoster.global.CustomEvent = function(type,props) {
			this.type = type;
			this.props = props;
		};
	}

	if (hoster.isBrowser) {
	    function uaMatch( ua ) {
		    ua = ua.toLowerCase();

			//IE11OrLess = !!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i),
			//Edge = !!navigator.userAgent.match(/Edge/i),
			//FireFox = !!navigator.userAgent.match(/firefox/i),
			//Safari = !!(navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) && !navigator.userAgent.match(/android/i)),
			//IOS = !!(navigator.userAgent.match(/iP(ad|od|hone)/i)),

		    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		      /(msie) ([\w.]+)/.exec( ua ) ||
		      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		      [];

		    return {
		      browser: match[ 1 ] || '',
		      version: match[ 2 ] || '0'
		    };
	  	};

	    var matched = uaMatch( navigator.userAgent );

	    var browser = hoster.browser = {};

	    if ( matched.browser ) {
	      browser[ matched.browser ] = true;
	      browser.version = matched.version;
	    }

	    // Chrome is Webkit, but Webkit is also Safari.
	    if ( browser.chrome ) {
	      browser.webkit = true;
	    } else if ( browser.webkit ) {
	      browser.safari = true;
	    }
	}

	hoster.detects = {};

	return  skylark.attach("langx.hoster",hoster);
});
define('skylark-langx-hoster/detects/mobile',[
    "../hoster"
],function(hoster){
    //refer : https://github.com/kaimallea/isMobile

    var appleIphone = /iPhone/i;
    var appleIpod = /iPod/i;
    var appleTablet = /iPad/i;
    var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
    var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
    var androidTablet = /Android/i;
    var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
    var amazonTablet = /Silk/i;
    var windowsPhone = /Windows Phone/i;
    var windowsTablet = /\bWindows(?:.+)ARM\b/i;
    var otherBlackBerry = /BlackBerry/i;
    var otherBlackBerry10 = /BB10/i;
    var otherOpera = /Opera Mini/i;
    var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
    var otherFirefox = /Mobile(?:.+)Firefox\b/i;
    var isAppleTabletOnIos13 = function (navigator) {
        return (typeof navigator !== 'undefined' &&
            navigator.platform === 'MacIntel' &&
            typeof navigator.maxTouchPoints === 'number' &&
            navigator.maxTouchPoints > 1 &&
            typeof MSStream === 'undefined');
    };
    function createMatch(userAgent) {
        return function (regex) { return regex.test(userAgent); };
    }
    
    function detectMobile(param) {
        var nav = {
            userAgent: '',
            platform: '',
            maxTouchPoints: 0
        };
        if (!param && typeof navigator !== 'undefined') {
            nav = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };
        }
        else if (typeof param === 'string') {
            nav.userAgent = param;
        }
        else if (param && param.userAgent) {
            nav = {
                userAgent: param.userAgent,
                platform: param.platform,
                maxTouchPoints: param.maxTouchPoints || 0
            };
        }
        var userAgent = nav.userAgent;
        var tmp = userAgent.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        tmp = userAgent.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        var match = createMatch(userAgent);
        var result = {
            apple: {
                phone: match(appleIphone) && !match(windowsPhone),
                ipod: match(appleIpod),
                tablet: !match(appleIphone) &&
                    (match(appleTablet) || isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone),
                universal: match(appleUniversal),
                device: (match(appleIphone) ||
                    match(appleIpod) ||
                    match(appleTablet) ||
                    match(appleUniversal) ||
                    isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone)
            },
            amazon: {
                phone: match(amazonPhone),
                tablet: !match(amazonPhone) && match(amazonTablet),
                device: match(amazonPhone) || match(amazonTablet)
            },
            android: {
                phone: (!match(windowsPhone) && match(amazonPhone)) ||
                    (!match(windowsPhone) && match(androidPhone)),
                tablet: !match(windowsPhone) &&
                    !match(amazonPhone) &&
                    !match(androidPhone) &&
                    (match(amazonTablet) || match(androidTablet)),
                device: (!match(windowsPhone) &&
                    (match(amazonPhone) ||
                        match(amazonTablet) ||
                        match(androidPhone) ||
                        match(androidTablet))) ||
                    match(/\bokhttp\b/i)
            },
            windows: {
                phone: match(windowsPhone),
                tablet: match(windowsTablet),
                device: match(windowsPhone) || match(windowsTablet)
            },
            other: {
                blackberry: match(otherBlackBerry),
                blackberry10: match(otherBlackBerry10),
                opera: match(otherOpera),
                firefox: match(otherFirefox),
                chrome: match(otherChrome),
                device: match(otherBlackBerry) ||
                    match(otherBlackBerry10) ||
                    match(otherOpera) ||
                    match(otherFirefox) ||
                    match(otherChrome)
            },
            any: false,
            phone: false,
            tablet: false
        };
        result.any =
            result.apple.device ||
                result.android.device ||
                result.windows.device ||
                result.other.device;
        result.phone =
            result.apple.phone || result.android.phone || result.windows.phone;
        result.tablet =
            result.apple.tablet || result.android.tablet || result.windows.tablet;
        return result;
    }

    return hoster.detects.mobile = detectMobile;
});

define('skylark-langx-hoster/isMobile',[
    "./hoster",
    "./detects/mobile"
],function(hoster,detectMobile){
    if (hoster.isMobile == undefined) {
        hoster.isMobile = detectMobile();
    }

    return hoster.isMobile;
});

define('skylark-langx-hoster/main',[
	"./hoster",
	"./isMobile"
],function(hoster){
	return hoster;
});
define('skylark-langx-hoster', ['skylark-langx-hoster/main'], function (main) { return main; });

define('skylark-langx-events/Event',[
  "skylark-langx-objects",
  "skylark-langx-funcs",
  "skylark-langx-klass",
  "skylark-langx-hoster",
    "./events"
],function(objects,funcs,klass,events){
    var eventMethods = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
     };
        

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            if (!source) {
                source = event;
            }

            objects.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                    this[predicate] = funcs.returnTrue;
                    return sourceMethod && sourceMethod.apply(source, arguments);
                }
                event[predicate] = funcs.returnFalse;
            });
        }
        return event;
    }


    /*
    var Event = klass({
        _construct : function(type,props) {
            CustomEvent.call(this,type.props);
            objects.safeMixin(this, props);
            compatible(this);
        }
    },CustomEvent);
    */

    class Event extends CustomEvent {
        constructor(type,props) {
            super(type,props);
            objects.safeMixin(this, props);
            compatible(this);
        } 
    }


    Event.compatible = compatible;

    return events.Event = Event;
    
});
define('skylark-langx-events/Listener',[
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass",
  "./events",
  "./Event"
],function(types,objects,arrays,klass,events,Event){
    var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isUndefined = types.isUndefined,
        isPlainObject = types.isPlainObject,
        isFunction = types.isFunction,
        isBoolean = types.isBoolean,
        isString = types.isString,
        isEmptyObject = types.isEmptyObject,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin;


    var Listener = klass({

        listenTo: function(obj, event, selector,callback, /*used internally*/ one) {
            if (!obj) {
                return this;
            }

            if (isBoolean(callback)) {
                one = callback;
                callback = selector;
                selector = null;
            } else if (isBoolean(selector)) {
                one = selector;
                callback = selector = null;
            } else if (isUndefined(callback)){
                one = false;
                callback = selector;
                selector = null;
            }

            if (types.isPlainObject(event)){
                //listenTo(obj,callbacks,one)
                var callbacks = event;
                for (var name in callbacks) {
                    this.listenTo(obj,name,callbacks[name],one);
                }
                return this;
            }

            if (!callback) {
                callback = "handleEvent";
            }
            
            // Bind callbacks on obj,
            if (isString(callback)) {
                callback = this[callback];
            }

            if (one) {
                if (selector) {
                    obj.one(event, selector,callback, this);
                } else {
                    obj.one(event, callback, this);
                }
            } else {
                 if (selector) {
                    obj.on(event, selector, callback, this);
                } else {
                    obj.on(event, callback, this);
                }
            }

            //keep track of them on listening.
            var listeningTo = this._listeningTo || (this._listeningTo = []),
                listening;

            for (var i = 0; i < listeningTo.length; i++) {
                if (listeningTo[i].obj == obj) {
                    listening = listeningTo[i];
                    break;
                }
            }
            if (!listening) {
                listeningTo.push(
                    listening = {
                        obj: obj,
                        events: {}
                    }
                );
            }
            var listeningEvents = listening.events,
                listeningEvent = listeningEvents[event] = listeningEvents[event] || [];
            if (listeningEvent.indexOf(callback) == -1) {
                listeningEvent.push(callback);
            }

            return this;
        },

        listenToOnce: function(obj, event,selector, callback) {
            return this.listenTo(obj, event,selector, callback, 1);
        },

        unlistenTo: function(obj, event, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }

            if (isString(callback)) {
                callback = this[callback];
            }

            for (var i = 0; i < listeningTo.length; i++) {
                var listening = listeningTo[i];

                if (obj && obj != listening.obj) {
                    continue;
                }

                var listeningEvents = listening.events;

                for (var eventName in listeningEvents) {
                    if (event && event != eventName) {
                        continue;
                    }

                    var listeningEvent = listeningEvents[eventName];

                    if (!listeningEvent) { 
                        continue;
                    }

                    for (var j = 0; j < listeningEvent.length; j++) {
                        if (!callback || callback == listeningEvent[i]) {
                            listening.obj.off(eventName, listeningEvent[i], this);
                            listeningEvent[i] = null;
                        }
                    }

                    listeningEvent = listeningEvents[eventName] = compact(listeningEvent);

                    if (isEmptyObject(listeningEvent)) {
                        listeningEvents[eventName] = null;
                    }

                }

                if (isEmptyObject(listeningEvents)) {
                    listeningTo[i] = null;
                }
            }

            listeningTo = this._listeningTo = compact(listeningTo);
            if (isEmptyObject(listeningTo)) {
                this._listeningTo = null;
            }

            return this;
        }
    });

    return events.Listener = Listener;

});
define('skylark-langx-events/Emitter',[
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass",
  "./events",
  "./Event",
  "./Listener"
],function(types,objects,arrays,klass,events,Event,Listener){
    var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isPlainObject = types.isPlainObject,
        isFunction = types.isFunction,
        isString = types.isString,
        isEmptyObject = types.isEmptyObject,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin;

    function parse(event) {
        var segs = ("" + event).split(".");
        return {
            name: segs[0],
            ns: segs.slice(1).join(" ")
        };
    }

    var Emitter = Listener.inherit({
        _prepareArgs : function(e,args) {
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
            return args;
        },

        on: function(events, selector, data, callback, ctx, /*used internally*/ one) {
            var self = this,
                _hub = this._hub || (this._hub = {});

            if (isPlainObject(events)) {
                ctx = callback;
                each(events, function(type, fn) {
                    self.on(type, selector, data, fn, ctx, one);
                });
                return this;
            }

            if (!isString(selector) && !isFunction(callback)) {
                ctx = callback;
                callback = data;
                data = selector;
                selector = undefined;
            }

            if (isFunction(data)) {
                ctx = callback;
                callback = data;
                data = null;
            }

            if (!callback ) {
                throw new Error("No callback function");
            } else if (!isFunction(callback)) {
                throw new Error("The callback  is not afunction");
            }

            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                (_hub[name] || (_hub[name] = [])).push({
                    fn: callback,
                    selector: selector,
                    data: data,
                    ctx: ctx,
                    ns : ns,
                    one: one
                });
            });

            return this;
        },

        one: function(events, selector, data, callback, ctx) {
            return this.on(events, selector, data, callback, ctx, 1);
        },

        emit: function(e /*,argument list*/ ) {
            if (!this._hub) {
                return this;
            }

            var self = this;

            if (isString(e)) {
                e = new Event(e); //new CustomEvent(e);
            }

            Object.defineProperty(e,"target",{
                value : this
            });

            var args = slice.call(arguments, 1);

            args = this._prepareArgs(e,args);

            [e.type || e.name, "all"].forEach(function(eventName) {
                var parsed = parse(eventName),
                    name = parsed.name,
                    ns = parsed.ns;

                var listeners = self._hub[name];
                if (!listeners) {
                    return;
                }

                var len = listeners.length,
                    reCompact = false;

                for (var i = 0; i < len; i++) {
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return this;
                    }
                    var listener = listeners[i];
                    if (ns && (!listener.ns ||  !listener.ns.startsWith(ns))) {
                        continue;
                    }

                    if (listener.data) {
                        e.data = mixin({}, listener.data, e.data);
                    }
                    if (args.length == 2 && isPlainObject(args[1])) {
                        e.data = e.data || {};
                        mixin(e.data,args[1]);
                    }

                    listener.fn.apply(listener.ctx, args);
                    if (listener.one) {
                        listeners[i] = null;
                        reCompact = true;
                    }
                }

                if (reCompact) {
                    self._hub[eventName] = compact(listeners);
                }

            });
            return this;
        },

        listened: function(event) {
            var evtArr = ((this._hub || (this._events = {}))[event] || []);
            return evtArr.length > 0;
        },

        off: function(events, callback) {
            if (!events) {
              this._hub = null;
              return;
            }
            var _hub = this._hub || (this._hub = {});
            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                var evts = _hub[name];

                if (evts) {
                    var liveEvents = [];

                    if (callback || ns) {
                        for (var i = 0, len = evts.length; i < len; i++) {
                            
                            if (callback && evts[i].fn !== callback && evts[i].fn._ !== callback) {
                                liveEvents.push(evts[i]);
                                continue;
                            } 

                            if (ns && (!evts[i].ns || evts[i].ns.indexOf(ns)!=0)) {
                                liveEvents.push(evts[i]);
                                continue;
                            }
                        }
                    }

                    if (liveEvents.length) {
                        _hub[name] = liveEvents;
                    } else {
                        delete _hub[name];
                    }

                }
            });

            return this;
        },
        trigger  : function() {
            return this.emit.apply(this,arguments);
        }
    });


    return events.Emitter = Emitter;

});
define('skylark-langx-events/createEvent',[
	"./events",
	"./Event"
],function(events,Event){
    function createEvent(type,props) {
        //var e = new CustomEvent(type,props);
        //return safeMixin(e, props);
        return new Event(type,props);
    };

    return events.createEvent = createEvent;	
});
define('skylark-langx-events/main',[
	"./events",
	"./Event",
	"./Listener",
	"./Emitter",
	"./createEvent"
],function(events){
	return events;
});
define('skylark-langx-events', ['skylark-langx-events/main'], function (main) { return main; });

define('skylark-io-streams/decode-stream',[
    "skylark-langx-events",
    "skylark-langx-chars",
    "./streams"
], function(events, chars, streams) {
    var emptyBuffer = new Uint8Array(0);


    var DecodeStream = events.Emitter.inherit({
        klassName : "DecodeStream",

        _construct : function(maybeMinBufferLength) {
            this._rawMinBufferLength = maybeMinBufferLength || 0;
            this.pos = 0;
            this.bufferLength = 0;
            this.eof = false;
            this.buffer = emptyBuffer;
            this.minBufferLength = 512;
            if (maybeMinBufferLength) {
                while (this.minBufferLength < maybeMinBufferLength) {
                    this.minBufferLength *= 2;
                }
            }
        },
        length : {
            get : function () {
                //util.unreachable('Should not access DecodeStream.length');    
                throw new Error('Should not access DecodeStream.length') ;               
            }
        },

        isEmpty : {
            get : function () {
                while (!this.eof && this.bufferLength === 0) {
                    this.readBlock();
                }
                return this.bufferLength === 0;
            }
        },

        ensureBuffer: function DecodeStream_ensureBuffer(requested) {
            var buffer = this.buffer;
            if (requested <= buffer.byteLength) {
                return buffer;
            }
            var size = this.minBufferLength;
            while (size < requested) {
                size *= 2;
            }
            var buffer2 = new Uint8Array(size);
            buffer2.set(buffer);
            return this.buffer = buffer2;
        },
        getByte: function DecodeStream_getByte() {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof) {
                    return -1;
                }
                this.readBlock();
            }
            return this.buffer[this.pos++];
        },
        getUint16: function DecodeStream_getUint16() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            if (b0 === -1 || b1 === -1) {
                return -1;
            }
            return (b0 << 8) + b1;
        },
        getInt32: function DecodeStream_getInt32() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            var b2 = this.getByte();
            var b3 = this.getByte();
            return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        },
        getBytes(length, forceClamped = false) {
            var end, pos = this.pos;
            if (length) {
                this.ensureBuffer(pos + length);
                end = pos + length;
                while (!this.eof && this.bufferLength < end) {
                    this.readBlock();
                }
                var bufEnd = this.bufferLength;
                if (end > bufEnd) {
                    end = bufEnd;
                }
            } else {
                while (!this.eof) {
                    this.readBlock();
                }
                end = this.bufferLength;
            }
            this.pos = end;
            const subarray = this.buffer.subarray(pos, end);
            return forceClamped && !(subarray instanceof Uint8ClampedArray) ? new Uint8ClampedArray(subarray) : subarray;
        },
        peekByte: function DecodeStream_peekByte() {
            var peekedByte = this.getByte();
            if (peekedByte !== -1) {
                this.pos--;
            }
            return peekedByte;
        },
        peekBytes(length, forceClamped = false) {
            var bytes = this.getBytes(length, forceClamped);
            this.pos -= bytes.length;
            return bytes;
        },
        makeSubStream: function DecodeStream_makeSubStream(start, length, dict) {
            var end = start + length;
            while (this.bufferLength <= end && !this.eof) {
                this.readBlock();
            }
            return new Stream(this.buffer, start, length, dict);
        },
        getByteRange(begin, end) {
            throw new Error("Should not call DecodeStream.getByteRange") ;               
            //util.unreachable('Should not call DecodeStream.getByteRange');
        },
        skip: function DecodeStream_skip(n) {
            if (!n) {
                n = 1;
            }
            this.pos += n;
        },
        reset: function DecodeStream_reset() {
            this.pos = 0;
        },
        getBaseStreams: function DecodeStream_getBaseStreams() {
            if (this.str && this.str.getBaseStreams) {
                return this.str.getBaseStreams();
            }
            return [];
        }

    });

    return streams.DecodeStream = DecodeStream;

});

define('skylark-io-streams/ascii85-stream',[
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {


    var Ascii85Stream = DecodeStream.inherit({
        klassName : "Ascii85Stream",

        _construct : function(str) {
            this.str = str;
            this.dict = str.dict;
            this.input = new Uint8Array(5);
            if (maybeLength) {
                maybeLength = 0.8 * maybeLength;
            }
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function Ascii85Stream_readBlock() {
            var TILDA_CHAR = 126;
            var Z_LOWER_CHAR = 122;
            var EOF = -1;
            var str = this.str;
            var c = str.getByte();
            while (chars.isWhiteSpace(c)) {
                c = str.getByte();
            }
            if (c === EOF || c === TILDA_CHAR) {
                this.eof = true;
                return;
            }
            var bufferLength = this.bufferLength, buffer;
            var i;
            if (c === Z_LOWER_CHAR) {
                buffer = this.ensureBuffer(bufferLength + 4);
                for (i = 0; i < 4; ++i) {
                    buffer[bufferLength + i] = 0;
                }
                this.bufferLength += 4;
            } else {
                var input = this.input;
                input[0] = c;
                for (i = 1; i < 5; ++i) {
                    c = str.getByte();
                    while (chars.isWhiteSpace(c)) {
                        c = str.getByte();
                    }
                    input[i] = c;
                    if (c === EOF || c === TILDA_CHAR) {
                        break;
                    }
                }
                buffer = this.ensureBuffer(bufferLength + i - 1);
                this.bufferLength += i - 1;
                if (i < 5) {
                    for (; i < 5; ++i) {
                        input[i] = 33 + 84;
                    }
                    this.eof = true;
                }
                var t = 0;
                for (i = 0; i < 5; ++i) {
                    t = t * 85 + (input[i] - 33);
                }
                for (i = 3; i >= 0; --i) {
                    buffer[bufferLength + i] = t & 255;
                    t >>= 8;
                }
            }
        }

    });

    return streams.Ascii85Stream = Ascii85Stream;

});

define('skylark-io-streams/ascii-hex-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var AsciiHexStream = DecodeStream.inherit({
        klassName : "AsciiHexStream",

        _construct : function AsciiHexStream(str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            this.firstDigit = -1;
            if (maybeLength) {
                maybeLength = 0.5 * maybeLength;
            }

            DecodeStream.prototype._construct.call(this,maybeLength);          
        },

        readBlock : function AsciiHexStream_readBlock() {
            var UPSTREAM_BLOCK_SIZE = 8000;
            var bytes = this.str.getBytes(UPSTREAM_BLOCK_SIZE);
            if (!bytes.length) {
                this.eof = true;
                return;
            }
            var maxDecodeLength = bytes.length + 1 >> 1;
            var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
            var bufferLength = this.bufferLength;
            var firstDigit = this.firstDigit;
            for (var i = 0, ii = bytes.length; i < ii; i++) {
                var ch = bytes[i], digit;
                if (ch >= 48 && ch <= 57) {
                    digit = ch & 15;
                } else if (ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {
                    digit = (ch & 15) + 9;
                } else if (ch === 62) {
                    this.eof = true;
                    break;
                } else {
                    continue;
                }
                if (firstDigit < 0) {
                    firstDigit = digit;
                } else {
                    buffer[bufferLength++] = firstDigit << 4 | digit;
                    firstDigit = -1;
                }
            }
            if (firstDigit >= 0 && this.eof) {
                buffer[bufferLength++] = firstDigit << 4;
                firstDigit = -1;
            }
            this.firstDigit = firstDigit;
            this.bufferLength = bufferLength;
        }
    });

    return streams.AsciiHexStream = AsciiHexStream;
});

define('skylark-io-streams/_stream',[
    "skylark-langx-events",
    "./streams"
], function(events,streams) {

   	var Stream = events.Emitter.inherit({
        klassName: "Stream",
        
        _construct: function(arrayBuffer, start, length, dict) {
            this.bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
            this.start = start || 0;
            this.pos = this.start;
            this.end = start + length || this.bytes.length;
            this.dict = dict;
        },


        length : {
        	get : function() {
                return this.end - this.start;
        	}
        },

        getByte: function () {
            if (this.pos >= this.end) {
                return -1;
            }
            return this.bytes[this.pos++];
        },

        getUint16: function Stream_getUint16() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            if (b0 === -1 || b1 === -1) {
                return -1;
            }
            return (b0 << 8) + b1;
        },

        getInt32: function Stream_getInt32() {
            var b0 = this.getByte();
            var b1 = this.getByte();
            var b2 = this.getByte();
            var b3 = this.getByte();
            return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        },

        getBytes(length, forceClamped = false) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;
            if (!length) {
                const subarray = bytes.subarray(pos, strEnd);
                return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
            }
            var end = pos + length;
            if (end > strEnd) {
                end = strEnd;
            }
            this.pos = end;
            const subarray = bytes.subarray(pos, end);
            return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
        },

        peekByte: function Stream_peekByte() {
            var peekedByte = this.getByte();
            if (peekedByte !== -1) {
                this.pos--;
            }
            return peekedByte;
        },

        peekBytes(length, forceClamped = false) {
            var bytes = this.getBytes(length, forceClamped);
            this.pos -= bytes.length;
            return bytes;
        },

        getByteRange(begin, end) {
            if (begin < 0) {
                begin = 0;
            }
            if (end > this.end) {
                end = this.end;
            }
            return this.bytes.subarray(begin, end);
        },

        skip: function Stream_skip(n) {
            if (!n) {
                n = 1;
            }
            this.pos += n;
        },

        reset: function Stream_reset() {
            this.pos = this.start;
        },

        moveStart: function Stream_moveStart() {
            this.start = this.pos;
        },
        
        makeSubStream: function Stream_makeSubStream(start, length, dict) {
            return new Stream(this.bytes.buffer, start, length, dict);
        }
    });
    
    return streams.Stream = Stream;
	
});

define('skylark-io-streams/chunked-stream',[
    "./streams",
    "./_stream"
], function(streams,Stream) {


    var ChunkedStream = Stream.inherit({
        klassName : "ChunkedStream",

        "numChunks": 0,
        "numChunksLoaded": 0,

        _construct : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype._construct.call(bytes);          
            this.dict = stream.dict;
        },

        "numChunks": function() {

        },


        getMissingChunks: function ChunkedStream_getMissingChunks() {
            var chunks = [];
            for (var chunk = 0, n = this.numChunks; chunk < n; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    chunks.push(chunk);
                }
            }
            return chunks;
        },

        getBaseStreams: function ChunkedStream_getBaseStreams() {
            return [this];
        },

        allChunksLoaded: function ChunkedStream_allChunksLoaded() {
            var _ = this._;
            return _.numChunksLoaded === _.numChunks;
        },

        onReceiveData: function(begin, chunk) {
            var end = begin + chunk.byteLength;

            assert(begin % this.chunkSize === 0, 'Bad begin offset: ' + begin);
            // Using this.length is inaccurate here since this.start can be moved
            // See ChunkedStream.moveStart()
            var length = this.bytes.length;
            assert(end % this.chunkSize === 0 || end === length,
                'Bad end offset: ' + end);

            this.bytes.set(new Uint8Array(chunk), begin);
            var chunkSize = this.chunkSize;
            var beginChunk = Math.floor(begin / chunkSize);
            var endChunk = Math.floor((end - 1) / chunkSize) + 1;

            for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    this.loadedChunks[chunk] = true;
                    ++this.numChunksLoaded;
                }
            }
        },

        onReceiveInitialData: function(data) {
            this.bytes.set(data);
            this.initialDataLength = data.length;
            var endChunk = this.end === data.length ?
                this.numChunks : Math.floor(data.length / this.chunkSize);
            for (var i = 0; i < endChunk; i++) {
                this.loadedChunks[i] = true;
                ++this.numChunksLoaded;
            }
        },

        ensureRange: function ChunkedStream_ensureRange(begin, end) {
            if (begin >= end) {
                return;
            }

            if (end <= this.initialDataLength) {
                return;
            }

            var chunkSize = this.chunkSize;
            var beginChunk = Math.floor(begin / chunkSize);
            var endChunk = Math.floor((end - 1) / chunkSize) + 1;
            for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    throw new MissingDataException(begin, end);
                }
            }
        },

        nextEmptyChunk: function ChunkedStream_nextEmptyChunk(beginChunk) {
            for (var chunk = beginChunk, n = this.numChunks; chunk < n; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    return chunk;
                }
            }
            // Wrap around to beginning
            for (var chunk = 0; chunk < beginChunk; ++chunk) {
                if (!(chunk in this.loadedChunks)) {
                    return chunk;
                }
            }
            return null;
        },

        hasChunk: function ChunkedStream_hasChunk(chunk) {
            return chunk in this._.loadedChunks;
        },

        getByte: function ChunkedStream_getByte() {
            var pos = this.pos;
            if (pos >= this.end) {
                return -1;
            }
            this.ensureRange(pos, pos + 1);
            return this.bytes[this.pos++];
        },

        // returns subarray of original buffer
        // should only be read
        getBytes: function ChunkedStream_getBytes(length) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;

            if (!length) {
                this.ensureRange(pos, strEnd);
                return bytes.subarray(pos, strEnd);
            }

            var end = pos + length;
            if (end > strEnd)
                end = strEnd;
            this.ensureRange(pos, end);

            this.pos = end;
            return bytes.subarray(pos, end);
        },

        peekBytes: function ChunkedStream_peekBytes(length) {
            var bytes = this.getBytes(length);
            this.pos -= bytes.length;
            return bytes;
        },

        getByteRange: function ChunkedStream_getBytes(begin, end) {
            this.ensureRange(begin, end);
            return this.bytes.subarray(begin, end);
        },

        skip: function ChunkedStream_skip(n) {
            if (!n)
                n = 1;
            this.pos += n;
        },

        reset: function ChunkedStream_reset() {
            this.pos = this.start;
        },

        moveStart: function ChunkedStream_moveStart() {
            this.start = this.pos;
        },

        makeSubStream: function ChunkedStream_makeSubStream(start, length, dict) {
            function ChunkedStreamSubstream() {}
            ChunkedStreamSubstream.prototype = Object.create(this);
            ChunkedStreamSubstream.prototype.getMissingChunks = function() {
                var chunkSize = this.chunkSize;
                var beginChunk = Math.floor(this.start / chunkSize);
                var endChunk = Math.floor((this.end - 1) / chunkSize) + 1;
                var missingChunks = [];
                for (var chunk = beginChunk; chunk < endChunk; ++chunk) {
                    if (!(chunk in this.loadedChunks)) {
                        missingChunks.push(chunk);
                    }
                }
                return missingChunks;
            };
            var subStream = new ChunkedStreamSubstream();
            subStream.pos = subStream.start = start;
            subStream.end = start + length || this.end;
            subStream.dict = dict;
            return subStream;
        }
    });

    return streams.ChunkedStream = ChunkedStream;

});

define('skylark-io-streams/decrypt-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var chunkSize = 512;


    var DecryptStream = DecodeStream.inherit({
        klassName : "DecryptStream",

        _construct : function (str, maybeLength, decrypt) {
            this.str = str;
            this.dict = str.dict;
            this.decrypt = decrypt;
            this.nextChunk = null;
            this.initialized = false;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        readBlock : function DecryptStream_readBlock() {
            var chunk;
            if (this.initialized) {
                chunk = this.nextChunk;
            } else {
                chunk = this.str.getBytes(chunkSize);
                this.initialized = true;
            }
            if (!chunk || chunk.length === 0) {
                this.eof = true;
                return;
            }
            this.nextChunk = this.str.getBytes(chunkSize);
            var hasMoreData = this.nextChunk && this.nextChunk.length > 0;
            var decrypt = this.decrypt;
            chunk = decrypt(chunk, !hasMoreData);
            var bufferLength = this.bufferLength;
            var i, n = chunk.length;
            var buffer = this.ensureBuffer(bufferLength + n);
            for (i = 0; i < n; i++) {
                buffer[bufferLength++] = chunk[i];
            }
            this.bufferLength = bufferLength;
        }
    });

    return streams.DecryptStream = DecryptStream;
});

define('skylark-io-streams/fake-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var FakeStream = DecodeStream.inherit({
        klassName : "FakeStream",

        _construct : function(stream) {
            this.dict = stream.dict;
            DecodeStream.prototype._construct.call(this);          
        },

        readBlock : function() {
            var bufferLength = this.bufferLength;
            bufferLength += 1024;
            var buffer = this.ensureBuffer(bufferLength);
            this.bufferLength = bufferLength;
        },

        getBytes : function (length) {
            var end, pos = this.pos;

            if (length) {
                this.ensureBuffer(pos + length);
                end = pos + length;

                while (!this.eof && this.bufferLength < end)
                    this.readBlock();

                var bufEnd = this.bufferLength;
                if (end > bufEnd)
                    end = bufEnd;
            } else {
                this.eof = true;
                end = this.bufferLength;
            }

            this.pos = end;
            return this.buffer.subarray(pos, end);
        }

    });

    return streams.FakeStream = FakeStream;
});

define('skylark-io-streams/flate-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {
    
    var codeLenCodeMap = new Int32Array([
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
    ]);
    var lengthDecode = new Int32Array([
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        65547,
        65549,
        65551,
        65553,
        131091,
        131095,
        131099,
        131103,
        196643,
        196651,
        196659,
        196667,
        262211,
        262227,
        262243,
        262259,
        327811,
        327843,
        327875,
        327907,
        258,
        258,
        258
    ]);
    var distDecode = new Int32Array([
        1,
        2,
        3,
        4,
        65541,
        65543,
        131081,
        131085,
        196625,
        196633,
        262177,
        262193,
        327745,
        327777,
        393345,
        393409,
        459009,
        459137,
        524801,
        525057,
        590849,
        591361,
        657409,
        658433,
        724993,
        727041,
        794625,
        798721,
        868353,
        876545
    ]);
    var fixedLitCodeTab = [
        new Int32Array([
            459008,
            524368,
            524304,
            524568,
            459024,
            524400,
            524336,
            590016,
            459016,
            524384,
            524320,
            589984,
            524288,
            524416,
            524352,
            590048,
            459012,
            524376,
            524312,
            589968,
            459028,
            524408,
            524344,
            590032,
            459020,
            524392,
            524328,
            590000,
            524296,
            524424,
            524360,
            590064,
            459010,
            524372,
            524308,
            524572,
            459026,
            524404,
            524340,
            590024,
            459018,
            524388,
            524324,
            589992,
            524292,
            524420,
            524356,
            590056,
            459014,
            524380,
            524316,
            589976,
            459030,
            524412,
            524348,
            590040,
            459022,
            524396,
            524332,
            590008,
            524300,
            524428,
            524364,
            590072,
            459009,
            524370,
            524306,
            524570,
            459025,
            524402,
            524338,
            590020,
            459017,
            524386,
            524322,
            589988,
            524290,
            524418,
            524354,
            590052,
            459013,
            524378,
            524314,
            589972,
            459029,
            524410,
            524346,
            590036,
            459021,
            524394,
            524330,
            590004,
            524298,
            524426,
            524362,
            590068,
            459011,
            524374,
            524310,
            524574,
            459027,
            524406,
            524342,
            590028,
            459019,
            524390,
            524326,
            589996,
            524294,
            524422,
            524358,
            590060,
            459015,
            524382,
            524318,
            589980,
            459031,
            524414,
            524350,
            590044,
            459023,
            524398,
            524334,
            590012,
            524302,
            524430,
            524366,
            590076,
            459008,
            524369,
            524305,
            524569,
            459024,
            524401,
            524337,
            590018,
            459016,
            524385,
            524321,
            589986,
            524289,
            524417,
            524353,
            590050,
            459012,
            524377,
            524313,
            589970,
            459028,
            524409,
            524345,
            590034,
            459020,
            524393,
            524329,
            590002,
            524297,
            524425,
            524361,
            590066,
            459010,
            524373,
            524309,
            524573,
            459026,
            524405,
            524341,
            590026,
            459018,
            524389,
            524325,
            589994,
            524293,
            524421,
            524357,
            590058,
            459014,
            524381,
            524317,
            589978,
            459030,
            524413,
            524349,
            590042,
            459022,
            524397,
            524333,
            590010,
            524301,
            524429,
            524365,
            590074,
            459009,
            524371,
            524307,
            524571,
            459025,
            524403,
            524339,
            590022,
            459017,
            524387,
            524323,
            589990,
            524291,
            524419,
            524355,
            590054,
            459013,
            524379,
            524315,
            589974,
            459029,
            524411,
            524347,
            590038,
            459021,
            524395,
            524331,
            590006,
            524299,
            524427,
            524363,
            590070,
            459011,
            524375,
            524311,
            524575,
            459027,
            524407,
            524343,
            590030,
            459019,
            524391,
            524327,
            589998,
            524295,
            524423,
            524359,
            590062,
            459015,
            524383,
            524319,
            589982,
            459031,
            524415,
            524351,
            590046,
            459023,
            524399,
            524335,
            590014,
            524303,
            524431,
            524367,
            590078,
            459008,
            524368,
            524304,
            524568,
            459024,
            524400,
            524336,
            590017,
            459016,
            524384,
            524320,
            589985,
            524288,
            524416,
            524352,
            590049,
            459012,
            524376,
            524312,
            589969,
            459028,
            524408,
            524344,
            590033,
            459020,
            524392,
            524328,
            590001,
            524296,
            524424,
            524360,
            590065,
            459010,
            524372,
            524308,
            524572,
            459026,
            524404,
            524340,
            590025,
            459018,
            524388,
            524324,
            589993,
            524292,
            524420,
            524356,
            590057,
            459014,
            524380,
            524316,
            589977,
            459030,
            524412,
            524348,
            590041,
            459022,
            524396,
            524332,
            590009,
            524300,
            524428,
            524364,
            590073,
            459009,
            524370,
            524306,
            524570,
            459025,
            524402,
            524338,
            590021,
            459017,
            524386,
            524322,
            589989,
            524290,
            524418,
            524354,
            590053,
            459013,
            524378,
            524314,
            589973,
            459029,
            524410,
            524346,
            590037,
            459021,
            524394,
            524330,
            590005,
            524298,
            524426,
            524362,
            590069,
            459011,
            524374,
            524310,
            524574,
            459027,
            524406,
            524342,
            590029,
            459019,
            524390,
            524326,
            589997,
            524294,
            524422,
            524358,
            590061,
            459015,
            524382,
            524318,
            589981,
            459031,
            524414,
            524350,
            590045,
            459023,
            524398,
            524334,
            590013,
            524302,
            524430,
            524366,
            590077,
            459008,
            524369,
            524305,
            524569,
            459024,
            524401,
            524337,
            590019,
            459016,
            524385,
            524321,
            589987,
            524289,
            524417,
            524353,
            590051,
            459012,
            524377,
            524313,
            589971,
            459028,
            524409,
            524345,
            590035,
            459020,
            524393,
            524329,
            590003,
            524297,
            524425,
            524361,
            590067,
            459010,
            524373,
            524309,
            524573,
            459026,
            524405,
            524341,
            590027,
            459018,
            524389,
            524325,
            589995,
            524293,
            524421,
            524357,
            590059,
            459014,
            524381,
            524317,
            589979,
            459030,
            524413,
            524349,
            590043,
            459022,
            524397,
            524333,
            590011,
            524301,
            524429,
            524365,
            590075,
            459009,
            524371,
            524307,
            524571,
            459025,
            524403,
            524339,
            590023,
            459017,
            524387,
            524323,
            589991,
            524291,
            524419,
            524355,
            590055,
            459013,
            524379,
            524315,
            589975,
            459029,
            524411,
            524347,
            590039,
            459021,
            524395,
            524331,
            590007,
            524299,
            524427,
            524363,
            590071,
            459011,
            524375,
            524311,
            524575,
            459027,
            524407,
            524343,
            590031,
            459019,
            524391,
            524327,
            589999,
            524295,
            524423,
            524359,
            590063,
            459015,
            524383,
            524319,
            589983,
            459031,
            524415,
            524351,
            590047,
            459023,
            524399,
            524335,
            590015,
            524303,
            524431,
            524367,
            590079
        ]),
        9
    ];
    var fixedDistCodeTab = [
        new Int32Array([
            327680,
            327696,
            327688,
            327704,
            327684,
            327700,
            327692,
            327708,
            327682,
            327698,
            327690,
            327706,
            327686,
            327702,
            327694,
            0,
            327681,
            327697,
            327689,
            327705,
            327685,
            327701,
            327693,
            327709,
            327683,
            327699,
            327691,
            327707,
            327687,
            327703,
            327695,
            0
        ]),
        5
    ];


    var FlateStream = DecodeStream.inherit({
        klassName : "FlateStream",

        _construct :function (str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            var cmf = str.getByte();
            var flg = str.getByte();
            if (cmf === -1 || flg === -1) {
                throw new util.FormatError(`Invalid header in flate stream: ${ cmf }, ${ flg }`);
            }
            if ((cmf & 15) !== 8) {
                throw new util.FormatError(`Unknown compression method in flate stream: ${ cmf }, ${ flg }`);
            }
            if (((cmf << 8) + flg) % 31 !== 0) {
                throw new util.FormatError(`Bad FCHECK in flate stream: ${ cmf }, ${ flg }`);
            }
            if (flg & 32) {
                throw new util.FormatError(`FDICT bit set in flate stream: ${ cmf }, ${ flg }`);
            }
            this.codeSize = 0;
            this.codeBuf = 0;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        getBits : function FlateStream_getBits(bits) {
            var str = this.str;
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var b;
            while (codeSize < bits) {
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad encoding in flate stream');
                }
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            b = codeBuf & (1 << bits) - 1;
            this.codeBuf = codeBuf >> bits;
            this.codeSize = codeSize -= bits;
            return b;
        },

        getCode : function FlateStream_getCode(table) {
            var str = this.str;
            var codes = table[0];
            var maxLen = table[1];
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var b;
            while (codeSize < maxLen) {
                if ((b = str.getByte()) === -1) {
                    break;
                }
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            var code = codes[codeBuf & (1 << maxLen) - 1];
            var codeLen = code >> 16;
            var codeVal = code & 65535;
            if (codeLen < 1 || codeSize < codeLen) {
                throw new util.FormatError('Bad encoding in flate stream');
            }
            this.codeBuf = codeBuf >> codeLen;
            this.codeSize = codeSize - codeLen;
            return codeVal;
        },

        generateHuffmanTable : function flateStreamGenerateHuffmanTable(lengths) {
            var n = lengths.length;
            var maxLen = 0;
            var i;
            for (i = 0; i < n; ++i) {
                if (lengths[i] > maxLen) {
                    maxLen = lengths[i];
                }
            }
            var size = 1 << maxLen;
            var codes = new Int32Array(size);
            for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
                for (var val = 0; val < n; ++val) {
                    if (lengths[val] === len) {
                        var code2 = 0;
                        var t = code;
                        for (i = 0; i < len; ++i) {
                            code2 = code2 << 1 | t & 1;
                            t >>= 1;
                        }
                        for (i = code2; i < size; i += skip) {
                            codes[i] = len << 16 | val;
                        }
                        ++code;
                    }
                }
            }
            return [
                codes,
                maxLen
            ];
        },

        readBlock : function FlateStream_readBlock() {
            var buffer, len;
            var str = this.str;
            var hdr = this.getBits(3);
            if (hdr & 1) {
                this.eof = true;
            }
            hdr >>= 1;
            if (hdr === 0) {
                var b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                var blockLen = b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                blockLen |= b << 8;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                var check = b;
                if ((b = str.getByte()) === -1) {
                    throw new util.FormatError('Bad block header in flate stream');
                }
                check |= b << 8;
                if (check !== (~blockLen & 65535) && (blockLen !== 0 || check !== 0)) {
                    throw new util.FormatError('Bad uncompressed block length in flate stream');
                }
                this.codeBuf = 0;
                this.codeSize = 0;
                const bufferLength = this.bufferLength, end = bufferLength + blockLen;
                buffer = this.ensureBuffer(end);
                this.bufferLength = end;
                if (blockLen === 0) {
                    if (str.peekByte() === -1) {
                        this.eof = true;
                    }
                } else {
                    const block = str.getBytes(blockLen);
                    buffer.set(block, bufferLength);
                    if (block.length < blockLen) {
                        this.eof = true;
                    }
                }
                return;
            }
            var litCodeTable;
            var distCodeTable;
            if (hdr === 1) {
                litCodeTable = fixedLitCodeTab;
                distCodeTable = fixedDistCodeTab;
            } else if (hdr === 2) {
                var numLitCodes = this.getBits(5) + 257;
                var numDistCodes = this.getBits(5) + 1;
                var numCodeLenCodes = this.getBits(4) + 4;
                var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);
                var i;
                for (i = 0; i < numCodeLenCodes; ++i) {
                    codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
                }
                var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);
                len = 0;
                i = 0;
                var codes = numLitCodes + numDistCodes;
                var codeLengths = new Uint8Array(codes);
                var bitsLength, bitsOffset, what;
                while (i < codes) {
                    var code = this.getCode(codeLenCodeTab);
                    if (code === 16) {
                        bitsLength = 2;
                        bitsOffset = 3;
                        what = len;
                    } else if (code === 17) {
                        bitsLength = 3;
                        bitsOffset = 3;
                        what = len = 0;
                    } else if (code === 18) {
                        bitsLength = 7;
                        bitsOffset = 11;
                        what = len = 0;
                    } else {
                        codeLengths[i++] = len = code;
                        continue;
                    }
                    var repeatLength = this.getBits(bitsLength) + bitsOffset;
                    while (repeatLength-- > 0) {
                        codeLengths[i++] = what;
                    }
                }
                litCodeTable = this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
                distCodeTable = this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
            } else {
                throw new util.FormatError('Unknown block type in flate stream');
            }
            buffer = this.buffer;
            var limit = buffer ? buffer.length : 0;
            var pos = this.bufferLength;
            while (true) {
                var code1 = this.getCode(litCodeTable);
                if (code1 < 256) {
                    if (pos + 1 >= limit) {
                        buffer = this.ensureBuffer(pos + 1);
                        limit = buffer.length;
                    }
                    buffer[pos++] = code1;
                    continue;
                }
                if (code1 === 256) {
                    this.bufferLength = pos;
                    return;
                }
                code1 -= 257;
                code1 = lengthDecode[code1];
                var code2 = code1 >> 16;
                if (code2 > 0) {
                    code2 = this.getBits(code2);
                }
                len = (code1 & 65535) + code2;
                code1 = this.getCode(distCodeTable);
                code1 = distDecode[code1];
                code2 = code1 >> 16;
                if (code2 > 0) {
                    code2 = this.getBits(code2);
                }
                var dist = (code1 & 65535) + code2;
                if (pos + len >= limit) {
                    buffer = this.ensureBuffer(pos + len);
                    limit = buffer.length;
                }
                for (var k = 0; k < len; ++k, ++pos) {
                    buffer[pos] = buffer[pos - dist];
                }
            }
        }
    });


    return streams.FlateStream = FlateStream;
});

define('skylark-io-streams/lzw-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {

    var LZWStream = DecodeStream.inherit({
        klassName : "LZWStream",

        _construct : function (str, maybeLength, earlyChange) {
            this.str = str;
            this.dict = str.dict;
            this.cachedData = 0;
            this.bitsCached = 0;
            var maxLzwDictionarySize = 4096;
            var lzwState = {
                earlyChange,
                codeLength: 9,
                nextCode: 258,
                dictionaryValues: new Uint8Array(maxLzwDictionarySize),
                dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
                dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
                currentSequence: new Uint8Array(maxLzwDictionarySize),
                currentSequenceLength: 0
            };
            for (var i = 0; i < 256; ++i) {
                lzwState.dictionaryValues[i] = i;
                lzwState.dictionaryLengths[i] = 1;
            }
            this.lzwState = lzwState;

            DecodeStream.prototype._construct.call(this, maybeLength);
        },

        readBits: function LZWStream_readBits(n) {
            var bitsCached = this.bitsCached;
            var cachedData = this.cachedData;
            while (bitsCached < n) {
                var c = this.str.getByte();
                if (c === -1) {
                    this.eof = true;
                    return null;
                }
                cachedData = cachedData << 8 | c;
                bitsCached += 8;
            }
            this.bitsCached = bitsCached -= n;
            this.cachedData = cachedData;
            this.lastCode = null;
            return cachedData >>> bitsCached & (1 << n) - 1;
        },

        readBlock : function LZWStream_readBlock() {
            var blockSize = 512;
            var estimatedDecodedSize = blockSize * 2, decodedSizeDelta = blockSize;
            var i, j, q;
            var lzwState = this.lzwState;
            if (!lzwState) {
                return;
            }
            var earlyChange = lzwState.earlyChange;
            var nextCode = lzwState.nextCode;
            var dictionaryValues = lzwState.dictionaryValues;
            var dictionaryLengths = lzwState.dictionaryLengths;
            var dictionaryPrevCodes = lzwState.dictionaryPrevCodes;
            var codeLength = lzwState.codeLength;
            var prevCode = lzwState.prevCode;
            var currentSequence = lzwState.currentSequence;
            var currentSequenceLength = lzwState.currentSequenceLength;
            var decodedLength = 0;
            var currentBufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
            for (i = 0; i < blockSize; i++) {
                var code = this.readBits(codeLength);
                var hasPrev = currentSequenceLength > 0;
                if (code < 256) {
                    currentSequence[0] = code;
                    currentSequenceLength = 1;
                } else if (code >= 258) {
                    if (code < nextCode) {
                        currentSequenceLength = dictionaryLengths[code];
                        for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
                            currentSequence[j] = dictionaryValues[q];
                            q = dictionaryPrevCodes[q];
                        }
                    } else {
                        currentSequence[currentSequenceLength++] = currentSequence[0];
                    }
                } else if (code === 256) {
                    codeLength = 9;
                    nextCode = 258;
                    currentSequenceLength = 0;
                    continue;
                } else {
                    this.eof = true;
                    delete this.lzwState;
                    break;
                }
                if (hasPrev) {
                    dictionaryPrevCodes[nextCode] = prevCode;
                    dictionaryLengths[nextCode] = dictionaryLengths[prevCode] + 1;
                    dictionaryValues[nextCode] = currentSequence[0];
                    nextCode++;
                    codeLength = nextCode + earlyChange & nextCode + earlyChange - 1 ? codeLength : Math.min(Math.log(nextCode + earlyChange) / 0.6931471805599453 + 1, 12) | 0;
                }
                prevCode = code;
                decodedLength += currentSequenceLength;
                if (estimatedDecodedSize < decodedLength) {
                    do {
                        estimatedDecodedSize += decodedSizeDelta;
                    } while (estimatedDecodedSize < decodedLength);
                    buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
                }
                for (j = 0; j < currentSequenceLength; j++) {
                    buffer[currentBufferLength++] = currentSequence[j];
                }
            }
            lzwState.nextCode = nextCode;
            lzwState.codeLength = codeLength;
            lzwState.prevCode = prevCode;
            lzwState.currentSequenceLength = currentSequenceLength;
            this.bufferLength = currentBufferLength;
        }
    });

    return streams.LZWStream = LZWStream;
});

define('skylark-io-streams/null-stream',[
    "./streams",
    "./_stream"
], function( streams, Stream) {

    var NullStream = Stream.inherit({
        klassName : "NullStream",

        _construct : function() {
            Stream.prototype._construct.call(this, new Uint8Array(0));        
        }
    });


    return streams.NullStream = NullStream;

});

define('skylark-io-streams/predictor-stream',[
    "./streams",
    "./decode-stream"
], function(streams, DecodeStream) {


    var PredictorStream = DecodeStream.inherit({
        klassName : "PredictorStream",

        _construct : function (str, maybeLength, params) {
            if (!primitives.isDict(params)) {
                return str;
            }
            var predictor = this.predictor = params.get('Predictor') || 1;
            if (predictor <= 1) {
                return str;
            }
            if (predictor !== 2 && (predictor < 10 || predictor > 15)) {
                //throw new util.FormatError(`Unsupported predictor: ${ predictor }`);
                throw new Error(`Unsupported predictor: ${ predictor }`);
            }
            if (predictor === 2) {
                this.readBlock = this.readBlockTiff;
            } else {
                this.readBlock = this.readBlockPng;
            }
            this.str = str;
            this.dict = str.dict;
            var colors = this.colors = params.get('Colors') || 1;
            var bits = this.bits = params.get('BitsPerComponent') || 8;
            var columns = this.columns = params.get('Columns') || 1;
            this.pixBytes = colors * bits + 7 >> 3;
            this.rowBytes = columns * colors * bits + 7 >> 3;
            DecodeStream.call(this, maybeLength);
            return this;
        },

        readBlockTiff : function predictorStreamReadBlockTiff() {
            var rowBytes = this.rowBytes;
            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var bits = this.bits;
            var colors = this.colors;
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;
            if (this.eof) {
                return;
            }
            var inbuf = 0, outbuf = 0;
            var inbits = 0, outbits = 0;
            var pos = bufferLength;
            var i;
            if (bits === 1 && colors === 1) {
                for (i = 0; i < rowBytes; ++i) {
                    var c = rawBytes[i] ^ inbuf;
                    c ^= c >> 1;
                    c ^= c >> 2;
                    c ^= c >> 4;
                    inbuf = (c & 1) << 7;
                    buffer[pos++] = c;
                }
            } else if (bits === 8) {
                for (i = 0; i < colors; ++i) {
                    buffer[pos++] = rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[pos] = buffer[pos - colors] + rawBytes[i];
                    pos++;
                }
            } else if (bits === 16) {
                var bytesPerPixel = colors * 2;
                for (i = 0; i < bytesPerPixel; ++i) {
                    buffer[pos++] = rawBytes[i];
                }
                for (; i < rowBytes; i += 2) {
                    var sum = ((rawBytes[i] & 255) << 8) + (rawBytes[i + 1] & 255) + ((buffer[pos - bytesPerPixel] & 255) << 8) + (buffer[pos - bytesPerPixel + 1] & 255);
                    buffer[pos++] = sum >> 8 & 255;
                    buffer[pos++] = sum & 255;
                }
            } else {
                var compArray = new Uint8Array(colors + 1);
                var bitMask = (1 << bits) - 1;
                var j = 0, k = bufferLength;
                var columns = this.columns;
                for (i = 0; i < columns; ++i) {
                    for (var kk = 0; kk < colors; ++kk) {
                        if (inbits < bits) {
                            inbuf = inbuf << 8 | rawBytes[j++] & 255;
                            inbits += 8;
                        }
                        compArray[kk] = compArray[kk] + (inbuf >> inbits - bits) & bitMask;
                        inbits -= bits;
                        outbuf = outbuf << bits | compArray[kk];
                        outbits += bits;
                        if (outbits >= 8) {
                            buffer[k++] = outbuf >> outbits - 8 & 255;
                            outbits -= 8;
                        }
                    }
                }
                if (outbits > 0) {
                    buffer[k++] = (outbuf << 8 - outbits) + (inbuf & (1 << 8 - outbits) - 1);
                }
            }
            this.bufferLength += rowBytes;
        },

        readBlockPng : function predictorStreamReadBlockPng() {
            var rowBytes = this.rowBytes;
            var pixBytes = this.pixBytes;
            var predictor = this.str.getByte();
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;
            if (this.eof) {
                return;
            }
            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var prevRow = buffer.subarray(bufferLength - rowBytes, bufferLength);
            if (prevRow.length === 0) {
                prevRow = new Uint8Array(rowBytes);
            }
            var i, j = bufferLength, up, c;
            switch (predictor) {
            case 0:
                for (i = 0; i < rowBytes; ++i) {
                    buffer[j++] = rawBytes[i];
                }
                break;
            case 1:
                for (i = 0; i < pixBytes; ++i) {
                    buffer[j++] = rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[j] = buffer[j - pixBytes] + rawBytes[i] & 255;
                    j++;
                }
                break;
            case 2:
                for (i = 0; i < rowBytes; ++i) {
                    buffer[j++] = prevRow[i] + rawBytes[i] & 255;
                }
                break;
            case 3:
                for (i = 0; i < pixBytes; ++i) {
                    buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
                }
                for (; i < rowBytes; ++i) {
                    buffer[j] = (prevRow[i] + buffer[j - pixBytes] >> 1) + rawBytes[i] & 255;
                    j++;
                }
                break;
            case 4:
                for (i = 0; i < pixBytes; ++i) {
                    up = prevRow[i];
                    c = rawBytes[i];
                    buffer[j++] = up + c;
                }
                for (; i < rowBytes; ++i) {
                    up = prevRow[i];
                    var upLeft = prevRow[i - pixBytes];
                    var left = buffer[j - pixBytes];
                    var p = left + up - upLeft;
                    var pa = p - left;
                    if (pa < 0) {
                        pa = -pa;
                    }
                    var pb = p - up;
                    if (pb < 0) {
                        pb = -pb;
                    }
                    var pc = p - upLeft;
                    if (pc < 0) {
                        pc = -pc;
                    }
                    c = rawBytes[i];
                    if (pa <= pb && pa <= pc) {
                        buffer[j++] = left + c;
                    } else if (pb <= pc) {
                        buffer[j++] = up + c;
                    } else {
                        buffer[j++] = upLeft + c;
                    }
                }
                break;
            default:
                //throw new util.FormatError(`Unsupported predictor: ${ predictor }`);
                throw new Error(`Unsupported predictor: ${ predictor }`);
            }
            this.bufferLength += rowBytes;
        }
    });

    return streams.PredictorStream = PredictorStream;
});

define('skylark-io-streams/run-length-stream',[
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {

    var RunLengthStream = DecodeStream.inherit({
        klassName : "RunLengthStream",

        _construct : function (str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function RunLengthStream_readBlock() {
            var repeatHeader = this.str.getBytes(2);
            if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] === 128) {
                this.eof = true;
                return;
            }
            var buffer;
            var bufferLength = this.bufferLength;
            var n = repeatHeader[0];
            if (n < 128) {
                buffer = this.ensureBuffer(bufferLength + n + 1);
                buffer[bufferLength++] = repeatHeader[1];
                if (n > 0) {
                    var source = this.str.getBytes(n);
                    buffer.set(source, bufferLength);
                    bufferLength += n;
                }
            } else {
                n = 257 - n;
                var b = repeatHeader[1];
                buffer = this.ensureBuffer(bufferLength + n + 1);
                for (var i = 0; i < n; i++) {
                    buffer[bufferLength++] = b;
                }
            }
            this.bufferLength = bufferLength;
        }
    });

    return streams.RunLengthStream = RunLengthStream;

});

define('skylark-io-streams/streams-sequence-stream',[
    "skylark-langx-chars",
    "./streams",
    "./decode-stream"
], function(chars, streams, DecodeStream) {


    var StreamsSequenceStream = DecodeStream.inherit({
        klassName : "StreamsSequenceStream",

        _construct : function(_streams) {
            this.streams = _streams;
            let maybeLength = 0;
            for (let i = 0, ii = _streams.length; i < ii; i++) {
                const stream = _streams[i];
                if (stream instanceof DecodeStream) {
                    maybeLength += stream._rawMinBufferLength;
                } else {
                    maybeLength += stream.length;
                }
            }
            DecodeStream.prototype._construct.call(this, maybeLength);       
        },

        readBlock : function streamSequenceStreamReadBlock() {
            var _streams = this.streams;
            if (streams.length === 0) {
                this.eof = true;
                return;
            }
            var stream = _streams.shift();
            var chunk = _streams.getBytes();
            var bufferLength = this.bufferLength;
            var newLength = bufferLength + chunk.length;
            var buffer = this.ensureBuffer(newLength);
            buffer.set(chunk, bufferLength);
            this.bufferLength = newLength;
        },

        getBaseStreams : function StreamsSequenceStream_getBaseStreams() {
            var baseStreams = [];
            for (var i = 0, ii = this.streams.length; i < ii; i++) {
                var stream = this.streams[i];
                if (stream.getBaseStreams) {
                    baseStreams.push(...stream.getBaseStreams());
                }
            }
            return baseStreams;
        }
    });

    return streams.StreamsSequenceStream = StreamsSequenceStream;

});

define('skylark-io-streams/string-stream',[
    "./streams",
    "./_stream"
], function(streams, Stream) {

    var StringStream = Stream.inherit({
        klassName : "StringStream",

        _construct : function(str) {
            //const bytes = util.stringToBytes(str);
            //TODO: chartCodeAt() >255
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);

            Stream.prototype._construct.call(this,bytes);          
        }
    });


    return streams.StringStream = StringStream;

});

define('skylark-io-streams/main',[
    "./streams",
    "./ascii85-stream",
    "./ascii-hex-stream",
    "./chunked-stream",
    "./decode-stream",
    "./decrypt-stream",
    "./fake-stream",
    "./flate-stream",
    "./lzw-stream",
    "./null-stream",
    "./predictor-stream",
    "./run-length-stream",
    "./_stream",
    "./streams-sequence-stream",
    "./string-stream"
], function(streams) {

	return streams;
});
define('skylark-io-streams', ['skylark-io-streams/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-io-streams-all.js.map
