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

        return ns[name] = obj2;
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

define('skylark-langx/skylark',[
    "skylark-langx-ns"
], function(ns) {
	return ns;
});

define('skylark-io-streams/streams',[
    "skylark-langx/skylark"
], function(skylark) {

    return skylark.attach("data.streams",{});
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

        type: type
    });

});
define('skylark-langx-types/main',[
	"./types"
],function(types){
	return types;
});
define('skylark-langx-types', ['skylark-langx-types/main'], function (main) { return main; });

define('skylark-langx-numbers/numbers',[
    "skylark-langx-ns",
    "skylark-langx-types"
],function(skylark,types){
	var isObject = types.isObject,
		isSymbol = types.isSymbol;

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

	return  skylark.attach("langx.numbers",{
		toFinite : toFinite,
		toNumber : toNumber,
		toInteger : toInteger
	});
});
define('skylark-langx-numbers/main',[
	"./numbers"
],function(numbers){
	return numbers;
});
define('skylark-langx-numbers', ['skylark-langx-numbers/main'], function (main) { return main; });

define('skylark-langx-objects/objects',[
    "skylark-langx-ns/ns",
    "skylark-langx-ns/_attach",
	"skylark-langx-types",
    "skylark-langx-numbers"
],function(skylark,_attach,types,numbers){
	var hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        isBoolean = types.isBoolean,
        isFunction = types.isFunction,
		isObject = types.isObject,
		isPlainObject = types.isPlainObject,
		isArray = types.isArray,
        isArrayLike = types.isArrayLike,
        isString = types.isString,
        toInteger = numbers.toInteger;

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

    // Retrieve all the property names of an object.
    function allKeys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    function each(obj, callback) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if (callback.call(value, key, value) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if (callback.call(value, i, value) === false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

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


   // Perform a deep comparison to check if two objects are equal.
    function isEqual(a, b) {
        return eq(a, b);
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

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            //if (!source.hasOwnProperty(key)) {
            //    continue;
            //}
            if (safe && target[key] !== undefined) {
                continue;
            }
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

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

    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }

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

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
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

    return skylark.attach("langx.objects",{
        allKeys: allKeys,

        attach : _attach,

        clone: clone,

        defaults : createAssigner(allKeys, true),

        each : each,

        extend : extend,

        has: has,

        isEqual: isEqual,   

        includes: includes,

        isMatch: isMatch,

        keys: keys,

        mixin: mixin,

        omit: omit,

        pick: pick,

        removeItem: removeItem,

        result : result,
        
        safeMixin: safeMixin,

        values: values
    });


});
define('skylark-langx-objects/main',[
	"./objects"
],function(objects){
	return objects;
});
define('skylark-langx-objects', ['skylark-langx-objects/main'], function (main) { return main; });

define('skylark-langx-arrays/arrays',[
  "skylark-langx-ns/ns",
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

        makeArray: makeArray,

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

define('skylark-langx/arrays',[
	"skylark-langx-arrays"
],function(arrays){
  return arrays;
});
define('skylark-langx-klass/klass',[
  "skylark-langx-ns/ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
],function(skylark,types,objects,arrays){
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
    
    function inherit(ctor, base) {
        var f = function() {};
        f.prototype = base.prototype;

        ctor.prototype = new f();
    }

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
                xtor.prototype = Object.create(newCtor.prototype);
                xtor.__proto__ = newCtor;
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
            ctor.prototype = Object.create(innerParent.prototype);

            // Enforce the constructor to be what we expect
            ctor.prototype.constructor = ctor;
            ctor.superclass = parent;

            // And make this class extendable
            ctor.__proto__ = innerParent;


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

    return skylark.attach("langx.klass",createClass);
});
define('skylark-langx-klass/main',[
	"./klass"
],function(klass){
	return klass;
});
define('skylark-langx-klass', ['skylark-langx-klass/main'], function (main) { return main; });

define('skylark-langx/klass',[
    "skylark-langx-klass"
],function(klass){
    return klass;
});
define('skylark-langx/ArrayStore',[
    "./klass"
],function(klass){
    var SimpleQueryEngine = function(query, options){
        // summary:
        //      Simple query engine that matches using filter functions, named filter
        //      functions or objects by name-value on a query object hash
        //
        // description:
        //      The SimpleQueryEngine provides a way of getting a QueryResults through
        //      the use of a simple object hash as a filter.  The hash will be used to
        //      match properties on data objects with the corresponding value given. In
        //      other words, only exact matches will be returned.
        //
        //      This function can be used as a template for more complex query engines;
        //      for example, an engine can be created that accepts an object hash that
        //      contains filtering functions, or a string that gets evaluated, etc.
        //
        //      When creating a new dojo.store, simply set the store's queryEngine
        //      field as a reference to this function.
        //
        // query: Object
        //      An object hash with fields that may match fields of items in the store.
        //      Values in the hash will be compared by normal == operator, but regular expressions
        //      or any object that provides a test() method are also supported and can be
        //      used to match strings by more complex expressions
        //      (and then the regex's or object's test() method will be used to match values).
        //
        // options: dojo/store/api/Store.QueryOptions?
        //      An object that contains optional information such as sort, start, and count.
        //
        // returns: Function
        //      A function that caches the passed query under the field "matches".  See any
        //      of the "query" methods on dojo.stores.
        //
        // example:
        //      Define a store with a reference to this engine, and set up a query method.
        //
        //  |   var myStore = function(options){
        //  |       //  ...more properties here
        //  |       this.queryEngine = SimpleQueryEngine;
        //  |       //  define our query method
        //  |       this.query = function(query, options){
        //  |           return QueryResults(this.queryEngine(query, options)(this.data));
        //  |       };
        //  |   };

        // create our matching query function
        switch(typeof query){
            default:
                throw new Error("Can not query with a " + typeof query);
            case "object": case "undefined":
                var queryObject = query;
                query = function(object){
                    for(var key in queryObject){
                        var required = queryObject[key];
                        if(required && required.test){
                            // an object can provide a test method, which makes it work with regex
                            if(!required.test(object[key], object)){
                                return false;
                            }
                        }else if(required != object[key]){
                            return false;
                        }
                    }
                    return true;
                };
                break;
            case "string":
                // named query
                if(!this[query]){
                    throw new Error("No filter function " + query + " was found in store");
                }
                query = this[query];
                // fall through
            case "function":
                // fall through
        }
        
        function filter(arr, callback, thisObject){
            // summary:
            //      Returns a new Array with those items from arr that match the
            //      condition implemented by callback.
            // arr: Array
            //      the array to iterate over.
            // callback: Function|String
            //      a function that is invoked with three arguments (item,
            //      index, array). The return of this function is expected to
            //      be a boolean which determines whether the passed-in item
            //      will be included in the returned array.
            // thisObject: Object?
            //      may be used to scope the call to callback
            // returns: Array
            // description:
            //      This function corresponds to the JavaScript 1.6 Array.filter() method, with one difference: when
            //      run over sparse arrays, this implementation passes the "holes" in the sparse array to
            //      the callback function with a value of undefined. JavaScript 1.6's filter skips the holes in the sparse array.
            //      For more details, see:
            //      https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
            // example:
            //  | // returns [2, 3, 4]
            //  | array.filter([1, 2, 3, 4], function(item){ return item>1; });

            // TODO: do we need "Ctr" here like in map()?
            var i = 0, l = arr && arr.length || 0, out = [], value;
            if(l && typeof arr == "string") arr = arr.split("");
            if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
            if(thisObject){
                for(; i < l; ++i){
                    value = arr[i];
                    if(callback.call(thisObject, value, i, arr)){
                        out.push(value);
                    }
                }
            }else{
                for(; i < l; ++i){
                    value = arr[i];
                    if(callback(value, i, arr)){
                        out.push(value);
                    }
                }
            }
            return out; // Array
        }

        function execute(array){
            // execute the whole query, first we filter
            var results = filter(array, query);
            // next we sort
            var sortSet = options && options.sort;
            if(sortSet){
                results.sort(typeof sortSet == "function" ? sortSet : function(a, b){
                    for(var sort, i=0; sort = sortSet[i]; i++){
                        var aValue = a[sort.attribute];
                        var bValue = b[sort.attribute];
                        // valueOf enables proper comparison of dates
                        aValue = aValue != null ? aValue.valueOf() : aValue;
                        bValue = bValue != null ? bValue.valueOf() : bValue;
                        if (aValue != bValue){
                            // modified by lwf 2016/07/09
                            //return !!sort.descending == (aValue == null || aValue > bValue) ? -1 : 1;
                            return !!sort.descending == (aValue == null || aValue > bValue) ? -1 : 1;
                        }
                    }
                    return 0;
                });
            }
            // now we paginate
            if(options && (options.start || options.count)){
                var total = results.length;
                results = results.slice(options.start || 0, (options.start || 0) + (options.count || Infinity));
                results.total = total;
            }
            return results;
        }
        execute.matches = query;
        return execute;
    };

    var QueryResults = function(results){
        // summary:
        //      A function that wraps the results of a store query with additional
        //      methods.
        // description:
        //      QueryResults is a basic wrapper that allows for array-like iteration
        //      over any kind of returned data from a query.  While the simplest store
        //      will return a plain array of data, other stores may return deferreds or
        //      promises; this wrapper makes sure that *all* results can be treated
        //      the same.
        //
        //      Additional methods include `forEach`, `filter` and `map`.
        // results: Array|dojo/promise/Promise
        //      The result set as an array, or a promise for an array.
        // returns:
        //      An array-like object that can be used for iterating over.
        // example:
        //      Query a store and iterate over the results.
        //
        //  |   store.query({ prime: true }).forEach(function(item){
        //  |       //  do something
        //  |   });

        if(!results){
            return results;
        }

        var isPromise = !!results.then;
        // if it is a promise it may be frozen
        if(isPromise){
            results = Object.delegate(results);
        }
        function addIterativeMethod(method){
            // Always add the iterative methods so a QueryResults is
            // returned whether the environment is ES3 or ES5
            results[method] = function(){
                var args = arguments;
                var result = Deferred.when(results, function(results){
                    //Array.prototype.unshift.call(args, results);
                    return QueryResults(Array.prototype[method].apply(results, args));
                });
                // forEach should only return the result of when()
                // when we're wrapping a promise
                if(method !== "forEach" || isPromise){
                    return result;
                }
            };
        }

        addIterativeMethod("forEach");
        addIterativeMethod("filter");
        addIterativeMethod("map");
        if(results.total == null){
            results.total = Deferred.when(results, function(results){
                return results.length;
            });
        }
        return results; // Object
    };

    var ArrayStore = klass({
        "klassName": "ArrayStore",

        "queryEngine": SimpleQueryEngine,
        
        "idProperty": "id",


        get: function(id){
            // summary:
            //      Retrieves an object by its identity
            // id: Number
            //      The identity to use to lookup the object
            // returns: Object
            //      The object in the store that matches the given id.
            return this.data[this.index[id]];
        },

        getIdentity: function(object){
            return object[this.idProperty];
        },

        put: function(object, options){
            var data = this.data,
                index = this.index,
                idProperty = this.idProperty;
            var id = object[idProperty] = (options && "id" in options) ? options.id : idProperty in object ? object[idProperty] : Math.random();
            if(id in index){
                // object exists
                if(options && options.overwrite === false){
                    throw new Error("Object already exists");
                }
                // replace the entry in data
                data[index[id]] = object;
            }else{
                // add the new object
                index[id] = data.push(object) - 1;
            }
            return id;
        },

        add: function(object, options){
            (options = options || {}).overwrite = false;
            // call put with overwrite being false
            return this.put(object, options);
        },

        remove: function(id){
            // summary:
            //      Deletes an object by its identity
            // id: Number
            //      The identity to use to delete the object
            // returns: Boolean
            //      Returns true if an object was removed, falsy (undefined) if no object matched the id
            var index = this.index;
            var data = this.data;
            if(id in index){
                data.splice(index[id], 1);
                // now we have to reindex
                this.setData(data);
                return true;
            }
        },
        query: function(query, options){
            // summary:
            //      Queries the store for objects.
            // query: Object
            //      The query to use for retrieving objects from the store.
            // options: dojo/store/api/Store.QueryOptions?
            //      The optional arguments to apply to the resultset.
            // returns: dojo/store/api/Store.QueryResults
            //      The results of the query, extended with iterative methods.
            //
            // example:
            //      Given the following store:
            //
            //  |   var store = new Memory({
            //  |       data: [
            //  |           {id: 1, name: "one", prime: false },
            //  |           {id: 2, name: "two", even: true, prime: true},
            //  |           {id: 3, name: "three", prime: true},
            //  |           {id: 4, name: "four", even: true, prime: false},
            //  |           {id: 5, name: "five", prime: true}
            //  |       ]
            //  |   });
            //
            //  ...find all items where "prime" is true:
            //
            //  |   var results = store.query({ prime: true });
            //
            //  ...or find all items where "even" is true:
            //
            //  |   var results = store.query({ even: true });
            return QueryResults(this.queryEngine(query, options)(this.data));
        },

        setData: function(data){
            // summary:
            //      Sets the given data as the source for this store, and indexes it
            // data: Object[]
            //      An array of objects to use as the source of data.
            if(data.items){
                // just for convenience with the data format IFRS expects
                this.idProperty = data.identifier || this.idProperty;
                data = this.data = data.items;
            }else{
                this.data = data;
            }
            this.index = {};
            for(var i = 0, l = data.length; i < l; i++){
                this.index[data[i][this.idProperty]] = i;
            }
        },

        init: function(options) {
            for(var i in options){
                this[i] = options[i];
            }
            this.setData(this.data || []);
        }

    });

	return ArrayStore;
});
define('skylark-langx-aspect/aspect',[
    "skylark-langx-ns"
],function(skylark){

  var undefined, nextId = 0;
    function advise(dispatcher, type, advice, receiveArguments){
        var previous = dispatcher[type];
        var around = type == "around";
        var signal;
        if(around){
            var advised = advice(function(){
                return previous.advice(this, arguments);
            });
            signal = {
                remove: function(){
                    if(advised){
                        advised = dispatcher = advice = null;
                    }
                },
                advice: function(target, args){
                    return advised ?
                        advised.apply(target, args) :  // called the advised function
                        previous.advice(target, args); // cancelled, skip to next one
                }
            };
        }else{
            // create the remove handler
            signal = {
                remove: function(){
                    if(signal.advice){
                        var previous = signal.previous;
                        var next = signal.next;
                        if(!next && !previous){
                            delete dispatcher[type];
                        }else{
                            if(previous){
                                previous.next = next;
                            }else{
                                dispatcher[type] = next;
                            }
                            if(next){
                                next.previous = previous;
                            }
                        }

                        // remove the advice to signal that this signal has been removed
                        dispatcher = advice = signal.advice = null;
                    }
                },
                id: nextId++,
                advice: advice,
                receiveArguments: receiveArguments
            };
        }
        if(previous && !around){
            if(type == "after"){
                // add the listener to the end of the list
                // note that we had to change this loop a little bit to workaround a bizarre IE10 JIT bug
                while(previous.next && (previous = previous.next)){}
                previous.next = signal;
                signal.previous = previous;
            }else if(type == "before"){
                // add to beginning
                dispatcher[type] = signal;
                signal.next = previous;
                previous.previous = signal;
            }
        }else{
            // around or first one just replaces
            dispatcher[type] = signal;
        }
        return signal;
    }
    function aspect(type){
        return function(target, methodName, advice, receiveArguments){
            var existing = target[methodName], dispatcher;
            if(!existing || existing.target != target){
                // no dispatcher in place
                target[methodName] = dispatcher = function(){
                    var executionId = nextId;
                    // before advice
                    var args = arguments;
                    var before = dispatcher.before;
                    while(before){
                        args = before.advice.apply(this, args) || args;
                        before = before.next;
                    }
                    // around advice
                    if(dispatcher.around){
                        var results = dispatcher.around.advice(this, args);
                    }
                    // after advice
                    var after = dispatcher.after;
                    while(after && after.id < executionId){
                        if(after.receiveArguments){
                            var newResults = after.advice.apply(this, args);
                            // change the return value only if a new value was returned
                            results = newResults === undefined ? results : newResults;
                        }else{
                            results = after.advice.call(this, results, args);
                        }
                        after = after.next;
                    }
                    return results;
                };
                if(existing){
                    dispatcher.around = {advice: function(target, args){
                        return existing.apply(target, args);
                    }};
                }
                dispatcher.target = target;
            }
            var results = advise((dispatcher || existing), type, advice, receiveArguments);
            advice = null;
            return results;
        };
    }

    return skylark.attach("langx.aspect",{
        after: aspect("after"),
 
        around: aspect("around"),
        
        before: aspect("before")
    });
});
define('skylark-langx-aspect/main',[
	"./aspect"
],function(aspect){
	return aspect;
});
define('skylark-langx-aspect', ['skylark-langx-aspect/main'], function (main) { return main; });

define('skylark-langx/aspect',[
    "skylark-langx-aspect"
],function(aspect){
  return aspect;
});
define('skylark-langx-funcs/funcs',[
  "skylark-langx-ns/ns",
  "skylark-langx-types",
  "skylark-langx-objects"
],function(skylark,types,objects){
	var mixin = objects.mixin,
        slice = Array.prototype.slice,
        isFunction = types.isFunction,
        isString = types.isString;

    function defer(fn) {
        if (requestAnimationFrame) {
            requestAnimationFrame(fn);
        } else {
            setTimeoutout(fn);
        }
        return this;
    }

    function noop() {
    }

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

    function debounce(fn, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                fn.apply(context, args);
            };
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
   
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


    return skylark.attach("langx.funcs",{
        bind : proxy,
        
        debounce: debounce,

        delegate: delegate,

        defer: defer,

        negate: negate,

        noop : noop,

        proxy: proxy,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        },

        templateSettings : templateSettings,
        template : template
    });
});
define('skylark-langx-funcs/main',[
	"./funcs"
],function(funcs){
	return funcs;
});
define('skylark-langx-funcs', ['skylark-langx-funcs/main'], function (main) { return main; });

define('skylark-langx-async/Deferred',[
    "skylark-langx-arrays",
	"skylark-langx-funcs",
    "skylark-langx-objects"
],function(arrays,funcs,objects){
    "use strict";

    var slice = Array.prototype.slice,
        proxy = funcs.proxy,
        makeArray = arrays.makeArray,
        result = objects.result,
        mixin = objects.mixin;

    mixin(Promise.prototype,{
        always: function(handler) {
            //this.done(handler);
            //this.fail(handler);
            this.then(handler,handler);
            return this;
        },
        done : function() {
            for (var i = 0;i<arguments.length;i++) {
                this.then(arguments[i]);
            }
            return this;
        },
        fail : function(handler) { 
            //return mixin(Promise.prototype.catch.call(this,handler),added);
            //return this.then(null,handler);
            this.catch(handler);
            return this;
         }
    });


    var Deferred = function() {
        var self = this,
            p = this.promise = makePromise2(new Promise(function(resolve, reject) {
                self._resolve = resolve;
                self._reject = reject;
            }));

        //wrapPromise(p,self);

        //this[PGLISTENERS] = [];
        //this[PGNOTIFIES] = [];

        //this.resolve = Deferred.prototype.resolve.bind(this);
        //this.reject = Deferred.prototype.reject.bind(this);
        //this.progress = Deferred.prototype.progress.bind(this);

    };

   
    function makePromise2(promise) {
        // Don't modify any promise that has been already modified.
        if (promise.isResolved) return promise;

        // Set initial state
        var isPending = true;
        var isRejected = false;
        var isResolved = false;

        // Observe the promise, saving the fulfillment in a closure scope.
        var result = promise.then(
            function(v) {
                isResolved = true;
                isPending = false;
                return v; 
            }, 
            function(e) {
                isRejected = true;
                isPending = false;
                throw e; 
            }
        );

        result.isResolved = function() { return isResolved; };
        result.isPending = function() { return isPending; };
        result.isRejected = function() { return isRejected; };

        result.state = function() {
            if (isResolved) {
                return 'resolved';
            }
            if (isRejected) {
                return 'rejected';
            }
            return 'pending';
        };

        var notified = [],
            listeners = [];

          
        result.then = function(onResolved,onRejected,onProgress) {
            if (onProgress) {
                this.progress(onProgress);
            }
            return makePromise2(Promise.prototype.then.call(this,
                onResolved && function(args) {
                    if (args && args.__ctx__ !== undefined) {
                        return onResolved.apply(args.__ctx__,args);
                    } else {
                        return onResolved(args);
                    }
                },
                onRejected && function(args){
                    if (args && args.__ctx__ !== undefined) {
                        return onRejected.apply(args.__ctx__,args);
                    } else {
                        return onRejected(args);
                    }
                }
            ));
        };

        result.progress = function(handler) {
            notified.forEach(function (value) {
                handler(value);
            });
            listeners.push(handler);
            return this;
        };

        result.pipe = result.then;

        result.notify = function(value) {
            try {
                notified.push(value);

                return listeners.forEach(function (listener) {
                    return listener(value);
                });
            } catch (error) {
            this.reject(error);
            }
            return this;
        };

        return result;
    }

 
    Deferred.prototype.resolve = function(value) {
        var args = slice.call(arguments);
        return this.resolveWith(null,args);
    };

    Deferred.prototype.resolveWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._resolve(args);
        this._resolved = true;
        return this;
    };

    Deferred.prototype.notify = function(value) {
        var p = result(this,"promise");
        p.notify(value);
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        var args = slice.call(arguments);
        return this.rejectWith(null,args);
    };

    Deferred.prototype.rejectWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._reject(args);
        this._rejected = true;
        return this;
    };

    Deferred.prototype.isResolved = function() {
        var p = result(this,"promise");
        return p.isResolved();
    };

    Deferred.prototype.isRejected = function() {
        var p = result(this,"promise");
        return p.isRejected();
    };

    Deferred.prototype.state = function() {
        var p = result(this,"promise");
        return p.state();
    };

    Deferred.prototype.then = function(callback, errback, progback) {
        var p = result(this,"promise");
        return p.then(callback, errback, progback);
    };

    Deferred.prototype.progress = function(progback){
        var p = result(this,"promise");
        return p.progress(progback);
    };
   
    Deferred.prototype.catch = function(errback) {
        var p = result(this,"promise");
        return p.catch(errback);
    };


    Deferred.prototype.always  = function() {
        var p = result(this,"promise");
        p.always.apply(p,arguments);
        return this;
    };

    Deferred.prototype.done  = function() {
        var p = result(this,"promise");
        p.done.apply(p,arguments);
        return this;
    };

    Deferred.prototype.fail = function(errback) {
        var p = result(this,"promise");
        p.fail(errback);
        return this;
    };


    Deferred.all = function(array) {
        //return wrapPromise(Promise.all(array));
        var d = new Deferred();
        Promise.all(array).then(d.resolve.bind(d),d.reject.bind(d));
        return result(d,"promise");
    };

    Deferred.first = function(array) {
        return makePromise2(Promise.race(array));
    };


    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(proxy(deferred.resolve,deferred), proxy(deferred.reject,deferred), deferred.notify);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve.apply(d,arguments);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;


    Deferred.promise = function(callback) {
        var d = new Deferred();

        callback(d.resolve.bind(d),d.reject.bind(d),d.progress.bind(d));

        return d.promise;
    };

    return Deferred;
});
define('skylark-langx-async/async',[
    "skylark-langx-ns",
    "skylark-langx-objects",
    "./Deferred"
],function(skylark,objects,Deferred){
    var each = objects.each;
    
    var async = {
        Deferred : Deferred,

        parallel : function(arr,args,ctx) {
            var rets = [];
            ctx = ctx || null;
            args = args || [];

            each(arr,function(i,func){
                rets.push(func.apply(ctx,args));
            });

            return Deferred.all(rets);
        },

        series : function(arr,args,ctx) {
            var rets = [],
                d = new Deferred(),
                p = d.promise;

            ctx = ctx || null;
            args = args || [];

            d.resolve();
            each(arr,function(i,func){
                p = p.then(function(){
                    return func.apply(ctx,args);
                });
                rets.push(p);
            });

            return Deferred.all(rets);
        },

        waterful : function(arr,args,ctx) {
            var d = new Deferred(),
                p = d.promise;

            ctx = ctx || null;
            args = args || [];

            d.resolveWith(ctx,args);

            each(arr,function(i,func){
                p = p.then(func);
            });
            return p;
        }
    };

	return skylark.attach("langx.async",async);	
});
define('skylark-langx-async/main',[
	"./async"
],function(async){
	return async;
});
define('skylark-langx-async', ['skylark-langx-async/main'], function (main) { return main; });

define('skylark-langx/async',[
    "skylark-langx-async"
],function(async){
    return async;
});
define('skylark-langx-datetimes/datetimes',[
    "skylark-langx-ns"
],function(skylark){
     function parseMilliSeconds(str) {

        var strs = str.split(' ');
        var number = parseInt(strs[0]);

        if (isNaN(number)){
            return 0;
        }

        var min = 60000 * 60;

        switch (strs[1].trim().replace(/\./g, '')) {
            case 'minutes':
            case 'minute':
            case 'min':
            case 'mm':
            case 'm':
                return 60000 * number;
            case 'hours':
            case 'hour':
            case 'HH':
            case 'hh':
            case 'h':
            case 'H':
                return min * number;
            case 'seconds':
            case 'second':
            case 'sec':
            case 'ss':
            case 's':
                return 1000 * number;
            case 'days':
            case 'day':
            case 'DD':
            case 'dd':
            case 'd':
                return (min * 24) * number;
            case 'months':
            case 'month':
            case 'MM':
            case 'M':
                return (min * 24 * 28) * number;
            case 'weeks':
            case 'week':
            case 'W':
            case 'w':
                return (min * 24 * 7) * number;
            case 'years':
            case 'year':
            case 'yyyy':
            case 'yy':
            case 'y':
                return (min * 24 * 365) * number;
            default:
                return 0;
        }
    };
	
	return skylark.attach("langx.datetimes",{
		parseMilliSeconds
	});
});
define('skylark-langx-datetimes/main',[
	"./datetimes"
],function(datetimes){
	return datetimes;
});
define('skylark-langx-datetimes', ['skylark-langx-datetimes/main'], function (main) { return main; });

define('skylark-langx/datetimes',[
    "skylark-langx-datetimes"
],function(datetimes){
    return datetimes;
});
define('skylark-langx/Deferred',[
    "skylark-langx-async/Deferred"
],function(Deferred){
    return Deferred;
});
define('skylark-langx-emitter/Event',[
  "skylark-langx-objects",
  "skylark-langx-funcs",
  "skylark-langx-klass",
],function(objects,funcs,klass){
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

    return Event;
    
});
define('skylark-langx-emitter/Emitter',[
  "skylark-langx-ns/ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass",
  "./Event"
],function(skylark,types,objects,arrays,klass,Event){
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

    var Emitter = klass({
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
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
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
                    if (e.data) {
                        if (listener.data) {
                            e.data = mixin({}, listener.data, e.data);
                        }
                    } else {
                        e.data = listener.data || null;
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

        listenTo: function(obj, event, callback, /*used internally*/ one) {
            if (!obj) {
                return this;
            }

            // Bind callbacks on obj,
            if (isString(callback)) {
                callback = this[callback];
            }

            if (one) {
                obj.one(event, callback, this);
            } else {
                obj.on(event, callback, this);
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

        listenToOnce: function(obj, event, callback) {
            return this.listenTo(obj, event, callback, 1);
        },

        off: function(events, callback) {
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
        unlistenTo: function(obj, event, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
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
        },

        trigger  : function() {
            return this.emit.apply(this,arguments);
        }
    });

    Emitter.createEvent = function (type,props) {
        //var e = new CustomEvent(type,props);
        //return safeMixin(e, props);
        return new Event(type,props);
    };

    Emitter.Event = Event;

    return skylark.attach("langx.Emitter",Emitter);

});
define('skylark-langx-emitter/Evented',[
  "skylark-langx-ns/ns",
	"./Emitter"
],function(skylark,Emitter){
	return skylark.attach("langx.Evented",Emitter);
});
define('skylark-langx-emitter/main',[
	"./Emitter",
	"./Evented"
],function(Emitter){
	return Emitter;
});
define('skylark-langx-emitter', ['skylark-langx-emitter/main'], function (main) { return main; });

define('skylark-langx/Emitter',[
    "skylark-langx-emitter"
],function(Evented){
    return Evented;
});
define('skylark-langx/Evented',[
    "skylark-langx-emitter"
],function(Evented){
    return Evented;
});
define('skylark-langx/funcs',[
    "skylark-langx-funcs"
],function(funcs){
    return funcs;
});
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

	if (hoster.isBrowser) {
	    function uaMatch( ua ) {
		    ua = ua.toLowerCase();

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

	return  skylark.attach("langx.hoster",hoster);
});
define('skylark-langx-hoster/main',[
	"./hoster"
],function(hoster){
	return hoster;
});
define('skylark-langx-hoster', ['skylark-langx-hoster/main'], function (main) { return main; });

define('skylark-langx/hoster',[
	"skylark-langx-hoster"
],function(hoster){
	return hoster;
});
define('skylark-langx/numbers',[
	"skylark-langx-numbers"
],function(numbers){
	return numbers;
});
define('skylark-langx/objects',[
    "skylark-langx-objects"
],function(objects){
    return objects;
});
define('skylark-langx-strings/strings',[
    "skylark-langx-ns"
],function(skylark){
    // add default escape function for escaping HTML entities
    var escapeCharMap = Object.freeze({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;',
        '=': '&#x3D;',
    });
    function replaceChar(c) {
        return escapeCharMap[c];
    }
    var escapeChars = /[&<>"'`=]/g;


     /*
     * Converts camel case into dashes.
     * @param {String} str
     * @return {String}
     * @exapmle marginTop -> margin-top
     */
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function deserializeValue(value) {
        try {
            return value ?
                value == "true" ||
                (value == "false" ? false :
                    value == "null" ? null :
                    +value + "" == value ? +value :
                    /^[\[\{]/.test(value) ? JSON.parse(value) :
                    value) : value;
        } catch (e) {
            return value;
        }
    }

    function escapeHTML(str) {
        if (str == null) {
            return '';
        }
        if (!str) {
            return String(str);
        }

        return str.toString().replace(escapeChars, replaceChar);
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    }

    function trim(str) {
        return str == null ? "" : String.prototype.trim.call(str);
    }

    function substitute( /*String*/ template,
        /*Object|Array*/
        map,
        /*Function?*/
        transform,
        /*Object?*/
        thisObject) {
        // summary:
        //    Performs parameterized substitutions on a string. Throws an
        //    exception if any parameter is unmatched.
        // template:
        //    a string with expressions in the form `${key}` to be replaced or
        //    `${key:format}` which specifies a format function. keys are case-sensitive.
        // map:
        //    hash to search for substitutions
        // transform:
        //    a function to process all parameters before substitution takes


        thisObject = thisObject || window;
        transform = transform ?
            proxy(thisObject, transform) : function(v) {
                return v;
            };

        function getObject(key, map) {
            if (key.match(/\./)) {
                var retVal,
                    getValue = function(keys, obj) {
                        var _k = keys.pop();
                        if (_k) {
                            if (!obj[_k]) return null;
                            return getValue(keys, retVal = obj[_k]);
                        } else {
                            return retVal;
                        }
                    };
                return getValue(key.split(".").reverse(), map);
            } else {
                return map[key];
            }
        }

        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
            function(match, key, format) {
                var value = getObject(key, map);
                if (format) {
                    value = getObject(format, thisObject).call(thisObject, value, key);
                }
                return transform(value, key).toString();
            }); // String
    }

    var idCounter = 0;
    function uniqueId (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    }


    /**
     * https://github.com/cho45/micro-template.js
     * (c) cho45 http://cho45.github.com/mit-license
     */
    function template (id, data) {

        function include(name, args) {
            var stash = {};
            for (var key in template.context.stash) if (template.context.stash.hasOwnProperty(key)) {
                stash[key] = template.context.stash[key];
            }
            if (args) for (var key in args) if (args.hasOwnProperty(key)) {
                stash[key] = args[key];
            }
            var context = template.context;
            context.ret += template(name, stash);
            template.context = context;
        }

        function wrapper(name, fun) {
            var current = template.context.ret;
            template.context.ret = '';
            fun.apply(template.context);
            var content = template.context.ret;
            var orig_content = template.context.stash.content;
            template.context.stash.content = content;
            template.context.ret = current + template(name, template.context.stash);
            template.context.stash.content = orig_content;
        }

        var me = arguments.callee;
        if (!me.cache[id]) me.cache[id] = (function () {
            var name = id, string = /^[\w\-]+$/.test(id) ? me.get(id): (name = 'template(string)', id); // no warnings
            var line = 1, body = (
                "try { " +
                    (me.variable ?  "var " + me.variable + " = this.stash;" : "with (this.stash) { ") +
                        "this.ret += '"  +
                        string.
                            replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
                            replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
                            replace(/^\s*|\s*$/g, '').
                            replace(/\n|\r\n/g, function () { return "';\nthis.line = " + (++line) + "; this.ret += '\\n" }).
                            replace(/\x11=raw(.+?)\x13/g, "' + ($1) + '").
                            replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
                            replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
                    "'; " + (me.variable ? "" : "}") + "return this.ret;" +
                "} catch (e) { throw 'TemplateError: ' + e + ' (on " + name + "' + ' line ' + this.line + ')'; } " +
                "//@ sourceURL=" + name + "\n" // source map
            ).replace(/this\.ret \+= '';/g, '');
            var func = new Function(body);
            var map  = { '&' : '&amp;', '<' : '&lt;', '>' : '&gt;', '\x22' : '&#x22;', '\x27' : '&#x27;' };
            var escapeHTML = function (string) { return (''+string).replace(/[&<>\'\"]/g, function (_) { return map[_] }) };
            return function (stash) { return func.call(me.context = { escapeHTML: escapeHTML, line: 1, ret : '', stash: stash }) };
        })();
        return data ? me.cache[id](data) : me.cache[id];
    }

    template.cache = {};
    

    template.get = function (id) {
        return document.getElementById(id).innerHTML;
    };

    function rtrim(str) {
        return str.replace(/\s+$/g, '');
    }

    // Slugify a string
    function slugify(str) {
        str = str.replace(/^\s+|\s+$/g, '');

        // Make the string lowercase
        str = str.toLowerCase();

        // Remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        // Remove invalid chars
        //str = str.replace(/[^a-z0-9 -]/g, '') 
        // Collapse whitespace and replace by -
        str = str.replace(/\s+/g, '-') 
        // Collapse dashes
        .replace(/-+/g, '-'); 

        return str;
    }    

    // return boolean if string 'true' or string 'false', or if a parsable string which is a number
    // also supports JSON object and/or arrays parsing
    function toType(str) {
        var type = typeof str;
        if (type !== 'string') {
            return str;
        }
        var nb = parseFloat(str);
        if (!isNaN(nb) && isFinite(str)) {
            return nb;
        }
        if (str === 'false') {
            return false;
        }
        if (str === 'true') {
            return true;
        }

        try {
            str = JSON.parse(str);
        } catch (e) {}

        return str;
    }

	return skylark.attach("langx.strings",{
        camelCase: function(str) {
            return str.replace(/-([\da-z])/g, function(a) {
                return a.toUpperCase().replace('-', '');
            });
        },

        dasherize: dasherize,

        deserializeValue: deserializeValue,

        escapeHTML : escapeHTML,

        generateUUID : generateUUID,

        lowerFirst: function(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        },

        rtrim : rtrim,

        serializeValue: function(value) {
            return JSON.stringify(value)
        },


        substitute: substitute,

        slugify : slugify,

        //template : template,

        trim: trim,

        uniqueId: uniqueId,

        upperFirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
	}) ; 

});
define('skylark-langx-strings/base64',[
	"./strings"
],function(strings) {

	// private property
	const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// private method for UTF-8 encoding
	function _utf8_encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	}

	// private method for UTF-8 decoding
	function _utf8_decode(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

	// public method for encoding
	function encode(input, binary) {
		binary = (binary != null) ? binary : false;
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		if (!binary)
		{
			input = _utf8_encode(input);
		}

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	}

	// public method for decoding
	function decode(input, binary) {
		binary = (binary != null) ? binary : false;
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		if (!binary) {
			output = _utf8_decode(output);
		}

		return output;

	}


	return strings.base64 = {
		decode,
		encode
	};
	
});
define('skylark-langx-strings/main',[
	"./strings",
	"./base64"
],function(strings){
	return strings;
});
define('skylark-langx-strings', ['skylark-langx-strings/main'], function (main) { return main; });

define('skylark-langx/strings',[
    "skylark-langx-strings"
],function(strings){
    return strings;
});
define('skylark-langx/Stateful',[
	"./Evented",
  "./strings",
  "./objects"
],function(Evented,strings,objects){
    var isEqual = objects.isEqual,
        mixin = objects.mixin,
        result = objects.result,
        isEmptyObject = objects.isEmptyObject,
        clone = objects.clone,
        uniqueId = strings.uniqueId;

    var Stateful = Evented.inherit({
        _construct : function(attributes, options) {
            var attrs = attributes || {};
            options || (options = {});
            this.cid = uniqueId(this.cidPrefix);
            this.attributes = {};
            if (options.collection) this.collection = options.collection;
            if (options.parse) attrs = this.parse(attrs, options) || {};
            var defaults = result(this, 'defaults');
            attrs = mixin({}, defaults, attrs);
            this.set(attrs, options);
            this.changed = {};
        },

        // A hash of attributes whose current and previous value differ.
        changed: null,

        // The value returned during the last failed validation.
        validationError: null,

        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
        // CouchDB users may want to set this to `"_id"`.
        idAttribute: 'id',

        // The prefix is used to create the client id which is used to identify models locally.
        // You may want to override this if you're experiencing name clashes with model ids.
        cidPrefix: 'c',


        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
          return clone(this.attributes);
        },


        // Get the value of an attribute.
        get: function(attr) {
          return this.attributes[attr];
        },

        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function(attr) {
          return this.get(attr) != null;
        },

        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function(key, val, options) {
          if (key == null) return this;

          // Handle both `"key", value` and `{key: value}` -style arguments.
          var attrs;
          if (typeof key === 'object') {
            attrs = key;
            options = val;
          } else {
            (attrs = {})[key] = val;
          }

          options || (options = {});

          // Run validation.
          if (!this._validate(attrs, options)) return false;

          // Extract attributes and options.
          var unset      = options.unset;
          var silent     = options.silent;
          var changes    = [];
          var changing   = this._changing;
          this._changing = true;

          if (!changing) {
            this._previousAttributes = clone(this.attributes);
            this.changed = {};
          }

          var current = this.attributes;
          var changed = this.changed;
          var prev    = this._previousAttributes;

          // For each `set` attribute, update or delete the current value.
          for (var attr in attrs) {
            val = attrs[attr];
            if (!isEqual(current[attr], val)) changes.push(attr);
            if (!isEqual(prev[attr], val)) {
              changed[attr] = val;
            } else {
              delete changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
          }

          // Update the `id`.
          if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

          // Trigger all relevant attribute changes.
          if (!silent) {
            if (changes.length) this._pending = options;
            for (var i = 0; i < changes.length; i++) {
              this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
          }

          // You might be wondering why there's a `while` loop here. Changes can
          // be recursively nested within `"change"` events.
          if (changing) return this;
          if (!silent) {
            while (this._pending) {
              options = this._pending;
              this._pending = false;
              this.trigger('change', this, options);
            }
          }
          this._pending = false;
          this._changing = false;
          return this;
        },

        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function(attr, options) {
          return this.set(attr, void 0, mixin({}, options, {unset: true}));
        },

        // Clear all attributes on the model, firing `"change"`.
        clear: function(options) {
          var attrs = {};
          for (var key in this.attributes) attrs[key] = void 0;
          return this.set(attrs, mixin({}, options, {unset: true}));
        },

        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function(attr) {
          if (attr == null) return !isEmptyObject(this.changed);
          return this.changed[attr] !== undefined;
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
          if (!diff) return this.hasChanged() ? clone(this.changed) : false;
          var old = this._changing ? this._previousAttributes : this.attributes;
          var changed = {};
          for (var attr in diff) {
            var val = diff[attr];
            if (isEqual(old[attr], val)) continue;
            changed[attr] = val;
          }
          return !isEmptyObject(changed) ? changed : false;
        },

        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function(attr) {
          if (attr == null || !this._previousAttributes) return null;
          return this._previousAttributes[attr];
        },

        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function() {
          return clone(this._previousAttributes);
        },

        // Create a new model with identical attributes to this one.
        clone: function() {
          return new this.constructor(this.attributes);
        },

        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function() {
          return !this.has(this.idAttribute);
        },

        // Check if the model is currently in a valid state.
        isValid: function(options) {
          return this._validate({}, mixin({}, options, {validate: true}));
        },

        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function(attrs, options) {
          if (!options.validate || !this.validate) return true;
          attrs = mixin({}, this.attributes, attrs);
          var error = this.validationError = this.validate(attrs, options) || null;
          if (!error) return true;
          this.trigger('invalid', this, error, mixin(options, {validationError: error}));
          return false;
        }
    });

	return Stateful;
});
define('skylark-langx-topic/topic',[
	"skylark-langx-ns",
	"skylark-langx-emitter/Evented"
],function(skylark,Evented){
	var hub = new Evented();

	return skylark.attach("langx.topic",{
	    publish: function(name, arg1,argn) {
	        var data = [].slice.call(arguments, 1);

	        return hub.trigger({
	            type : name,
	            data : data
	        });
	    },

        subscribe: function(name, listener,ctx) {
        	var handler = function(e){
                listener.apply(ctx,e.data);
            };
            hub.on(name, handler);
            return {
            	remove : function(){
            		hub.off(name,handler);
            	}
            }

        }

	});
});
define('skylark-langx-topic/main',[
	"./topic"
],function(topic){
	return topic;
});
define('skylark-langx-topic', ['skylark-langx-topic/main'], function (main) { return main; });

define('skylark-langx/topic',[
	"skylark-langx-topic"
],function(topic){
	return topic;
});
define('skylark-langx/types',[
    "skylark-langx-types"
],function(types){
    return types;
});
define('skylark-langx/langx',[
    "./skylark",
    "./arrays",
    "./ArrayStore",
    "./aspect",
    "./async",
    "./datetimes",
    "./Deferred",
    "./Emitter",
    "./Evented",
    "./funcs",
    "./hoster",
    "./klass",
    "./numbers",
    "./objects",
    "./Stateful",
    "./strings",
    "./topic",
    "./types"
], function(skylark,arrays,ArrayStore,aspect,async,datetimes,Deferred,Emitter,Evented,funcs,hoster,klass,numbers,objects,Stateful,strings,topic,types) {
    "use strict";
    var toString = {}.toString,
        concat = Array.prototype.concat,
        indexOf = Array.prototype.indexOf,
        slice = Array.prototype.slice,
        filter = Array.prototype.filter,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin,
        isFunction = types.isFunction;


    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }

    function getQueryParams(url) {
        var url = url || window.location.href,
            segs = url.split("?"),
            params = {};

        if (segs.length > 1) {
            segs[1].split("&").forEach(function(queryParam) {
                var nv = queryParam.split('=');
                params[nv[0]] = nv[1];
            });
        }
        return params;
    }


    function toPixel(value) {
        // style values can be floats, client code may want
        // to round for integer pixels.
        return parseFloat(value) || 0;
    }


    var _uid = 1;

    function uid(obj) {
        return obj._uid || (obj._uid = _uid++);
    }

    function langx() {
        return langx;
    }

    mixin(langx, {
        createEvent : Emitter.createEvent,

        funcArg: funcArg,

        getQueryParams: getQueryParams,

        toPixel: toPixel,

        uid: uid,

        URL: typeof window !== "undefined" ? window.URL || window.webkitURL : null

    });


    mixin(langx, arrays,aspect,datetimes,funcs,numbers,objects,strings,types,{
        ArrayStore : ArrayStore,

        async : async,
        
        Deferred: Deferred,

        Emitter: Emitter,

        Evented: Evented,

        hoster : hoster,

        klass : klass,
       
        Stateful: Stateful,

        topic : topic
    });

    return skylark.langx = langx;
});
define('skylark-io-streams/Stream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams"
], function(skylark, langx,streams) {

   	var Stream = langx.Evented.inherit({
        klassName: "Stream",
        init: function(arrayBuffer, start, length, dict) {
	        this.bytes = new Uint8Array(arrayBuffer);
	        this.start = start || 0;
	        this.pos = this.start;
	        this.end = (start + length) || this.bytes.length;
	        this.dict = dict;
        },


        length : {
        	get : function() {
            	return this.end - this.start;
        	}
        },

        getByte: function () {
            if (this.pos >= this.end)
                return null;
            return this.bytes[this.pos++];
        },
        // returns subarray of original buffer
        // should only be read
        getBytes: function (length) {
            var bytes = this.bytes;
            var pos = this.pos;
            var strEnd = this.end;

            if (!length)
                return bytes.subarray(pos, strEnd);

            var end = pos + length;
            if (end > strEnd)
                end = strEnd;

            this.pos = end;
            return bytes.subarray(pos, end);
        },

        lookChar: function () {
            if (this.pos >= this.end)
                return null;
            return String.fromCharCode(this.bytes[this.pos]);
        },
        getChar: function () {
            if (this.pos >= this.end)
                return null;
            return String.fromCharCode(this.bytes[this.pos++]);
        },
        skip: function (n) {
            if (!n)
                n = 1;
            this.pos += n;
        },
        reset: function () {
            this.pos = this.start;
        },
        moveStart: function () {
            this.start = this.pos;
        },
        makeSubStream: function (start, length, dict) {
            return new Stream(this.bytes.buffer, start, length, dict);
        },
        isStream: true
    });
    
    return streams.Stream = Stream;
	
});

define('skylark-io-streams/DecodeStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx, streams, Stream) {

    var DecodeStream = Stream.inherit({
        klassName : "DecodeStream",

        init : function() {
            this.pos = 0;
            this.bufferLength = 0;
            this.eof = false;
            this.buffer = null;     
        },

        ensureBuffer: function(requested) {
            var buffer = this.buffer;
            var current = buffer ? buffer.byteLength : 0;
            if (requested < current)
                return buffer;
            var size = 512;
            while (size < requested)
                size <<= 1;
            var buffer2 = new Uint8Array(size);
            for (var i = 0; i < current; ++i)
                buffer2[i] = buffer[i];
            return (this.buffer = buffer2);
        },
        getByte: function () {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return this.buffer[this.pos++];
        },
        getBytes: function(length) {
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
                while (!this.eof)
                    this.readBlock();

                end = this.bufferLength;

                // checking if bufferLength is still 0 then
                // the buffer has to be initialized
                if (!end)
                    this.buffer = new Uint8Array(0);
            }

            this.pos = end;
            return this.buffer.subarray(pos, end);
        },
        lookChar: function() {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return String.fromCharCode(this.buffer[this.pos]);
        },
        getChar: function () {
            var pos = this.pos;
            while (this.bufferLength <= pos) {
                if (this.eof)
                    return null;
                this.readBlock();
            }
            return String.fromCharCode(this.buffer[this.pos++]);
        },
        makeSubStream: function (start, length, dict) {
            var end = start + length;
            while (this.bufferLength <= end && !this.eof)
                this.readBlock();
            return new Stream(this.buffer, start, length, dict);
        },
        skip: function (n) {
            if (!n)
                n = 1;
            this.pos += n;
        },
        reset: function () {
            this.pos = 0;
        }

    });

    return streams.DecodeStream = DecodeStream;

});

define('skylark-io-streams/Ascii85Stream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var Ascii85Stream = DecodeStream.inherit({
        klassName : "Ascii85Stream",

        init : function(str) {
            this.str = str;
            this.dict = str.dict;
            this.input = new Uint8Array(5);

            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var tildaCode = '~'.charCodeAt(0);
            var zCode = 'z'.charCodeAt(0);
            var str = this.str;

            var c = str.getByte();
            while (Lexer.isSpace(String.fromCharCode(c)))
                c = str.getByte();

            if (!c || c === tildaCode) {
                this.eof = true;
                return;
            }

            var bufferLength = this.bufferLength,
                buffer;

            // special code for z
            if (c == zCode) {
                buffer = this.ensureBuffer(bufferLength + 4);
                for (var i = 0; i < 4; ++i)
                    buffer[bufferLength + i] = 0;
                this.bufferLength += 4;
            } else {
                var input = this.input;
                input[0] = c;
                for (var i = 1; i < 5; ++i) {
                    c = str.getByte();
                    while (Lexer.isSpace(String.fromCharCode(c)))
                        c = str.getByte();

                    input[i] = c;

                    if (!c || c == tildaCode)
                        break;
                }
                buffer = this.ensureBuffer(bufferLength + i - 1);
                this.bufferLength += i - 1;

                // partial ending;
                if (i < 5) {
                    for (; i < 5; ++i)
                        input[i] = 0x21 + 84;
                    this.eof = true;
                }
                var t = 0;
                for (var i = 0; i < 5; ++i)
                    t = t * 85 + (input[i] - 0x21);

                for (var i = 3; i >= 0; --i) {
                    buffer[bufferLength + i] = t & 0xFF;
                    t >>= 8;
                }
            }

        }

    });

    return streams.Ascii85Stream = Ascii85Stream;

});

define('skylark-io-streams/AsciiHexStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {
    var hexvalueMap = {
        9: -1, // \t
        32: -1, // space
        48: 0,
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9,
        65: 10,
        66: 11,
        67: 12,
        68: 13,
        69: 14,
        70: 15,
        97: 10,
        98: 11,
        99: 12,
        100: 13,
        101: 14,
        102: 15
    };

    var AsciiHexStream = DecodeStream.inherit({
        klassName : "AsciiHexStream",

        init : function(str) {
            this.str = str;
            this.dict = str.dict;

            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var gtCode = '>'.charCodeAt(0),
                bytes = this.str.getBytes(),
                c, n,
                decodeLength, buffer, bufferLength, i, length;

            decodeLength = (bytes.length + 1) >> 1;
            buffer = this.ensureBuffer(this.bufferLength + decodeLength);
            bufferLength = this.bufferLength;

            for (i = 0, length = bytes.length; i < length; i++) {
                c = hexvalueMap[bytes[i]];
                while (c == -1 && (i + 1) < length) {
                    c = hexvalueMap[bytes[++i]];
                }

                if ((i + 1) < length && (bytes[i + 1] !== gtCode)) {
                    n = hexvalueMap[bytes[++i]];
                    buffer[bufferLength++] = c * 16 + n;
                } else {
                    // EOD marker at an odd number, behave as if a 0 followed the last
                    // digit.
                    if (bytes[i] !== gtCode) {
                        buffer[bufferLength++] = c * 16;
                    }
                }
            }

            this.bufferLength = bufferLength;
            this.eof = true;        
       }

    });

    return streams.AsciiHexStream = AsciiHexStream;
});

define('skylark-io-streams/ChunkedStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx,streams,Stream) {


    var ChunkedStream = Stream.inherit({
        klassName : "ChunkedStream",

        "numChunks": 0,
        "numChunksLoaded": 0,

        init : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype.init.call(bytes);          
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


define('skylark-io-streams/DecryptStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var chunkSize = 512;

    var DecryptStream = DecodeStream.inherit({
        klassName : "DecryptStream",

        init : function(str, decrypt) {
            this.str = str;
            this.dict = str.dict;
            this.decrypt = decrypt;
            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var chunk = this.str.getBytes(chunkSize);
            if (!chunk || chunk.length == 0) {
                this.eof = true;
                return;
            }
            var decrypt = this.decrypt;
            chunk = decrypt(chunk);

            var bufferLength = this.bufferLength;
            var i, n = chunk.length;
            var buffer = this.ensureBuffer(bufferLength + n);
            for (i = 0; i < n; i++)
                buffer[bufferLength++] = chunk[i];
            this.bufferLength = bufferLength;
        }
    });

    return streams.DecryptStream = DecryptStream;
});


define('skylark-io-streams/FakeStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var FakeStream = DecodeStream.inherit({
        klassName : "FakeStream",

        init : function(stream) {
            this.dict = stream.dict;
            Stream.prototype.init.call(this);          
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


define('skylark-io-streams/FlateStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var codeLenCodeMap = new Uint32Array([
        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
    ]);

    var lengthDecode = new Uint32Array([
        0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
        0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
        0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
        0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
    ]);

    var distDecode = new Uint32Array([
        0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
        0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
        0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
        0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
    ]);

    var fixedLitCodeTab = [new Uint32Array([
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
        0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
        0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
        0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
        0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
        0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
        0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
        0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
        0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
        0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
        0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
        0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
        0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
        0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
        0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
        0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
        0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
        0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
        0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
        0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
        0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
        0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
        0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
        0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
        0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
        0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
        0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
        0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
        0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
        0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
        0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
        0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
        0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
        0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
        0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
        0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
        0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
        0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
        0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
        0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
        0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
        0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
        0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
        0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
        0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
        0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
        0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
        0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
        0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
    ]), 9];

    var fixedDistCodeTab = [new Uint32Array([
        0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
        0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
        0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
        0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
    ]), 5];


    var FlateStream = DecodeStream.inherit({
        klassName : "FlateStream",

        init : function(stream) {
            var bytes = stream.getBytes();
            var bytesPos = 0;

            this.dict = stream.dict;
            var cmf = bytes[bytesPos++];
            var flg = bytes[bytesPos++];
            if (cmf == -1 || flg == -1)
                error('Invalid header in flate stream: ' + cmf + ', ' + flg);
            if ((cmf & 0x0f) != 0x08)
                error('Unknown compression method in flate stream: ' + cmf + ', ' + flg);
            if ((((cmf << 8) + flg) % 31) != 0)
                error('Bad FCHECK in flate stream: ' + cmf + ', ' + flg);
            if (flg & 0x20)
                error('FDICT bit set in flate stream: ' + cmf + ', ' + flg);

            this.bytes = bytes;
            this.bytesPos = bytesPos;

            this.codeSize = 0;
            this.codeBuf = 0;
            DecodeStream.prototype.init.call(this);          
        },

        getBits : function(bits) {
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var bytes = this.bytes;
            var bytesPos = this.bytesPos;

            var b;
            while (codeSize < bits) {
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad encoding in flate stream');
                codeBuf |= b << codeSize;
                codeSize += 8;
            }
            b = codeBuf & ((1 << bits) - 1);
            this.codeBuf = codeBuf >> bits;
            this.codeSize = codeSize -= bits;
            this.bytesPos = bytesPos;
            return b;
        },

        getCode : function(table) {
            var codes = table[0];
            var maxLen = table[1];
            var codeSize = this.codeSize;
            var codeBuf = this.codeBuf;
            var bytes = this.bytes;
            var bytesPos = this.bytesPos;

            while (codeSize < maxLen) {
                var b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad encoding in flate stream');
                codeBuf |= (b << codeSize);
                codeSize += 8;
            }
            var code = codes[codeBuf & ((1 << maxLen) - 1)];
            var codeLen = code >> 16;
            var codeVal = code & 0xffff;
            if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
                error('Bad encoding in flate stream');
            this.codeBuf = (codeBuf >> codeLen);
            this.codeSize = (codeSize - codeLen);
            this.bytesPos = bytesPos;
            return codeVal;
        },

        generateHuffmanTable : function(lengths) {
                var n = lengths.length;

                // find max code length
                var maxLen = 0;
                for (var i = 0; i < n; ++i) {
                    if (lengths[i] > maxLen)
                        maxLen = lengths[i];
                }

                // build the table
                var size = 1 << maxLen;
                var codes = new Uint32Array(size);
                for (var len = 1, code = 0, skip = 2; len <= maxLen;
                    ++len, code <<= 1, skip <<= 1) {
                    for (var val = 0; val < n; ++val) {
                        if (lengths[val] == len) {
                            // bit-reverse the code
                            var code2 = 0;
                            var t = code;
                            for (var i = 0; i < len; ++i) {
                                code2 = (code2 << 1) | (t & 1);
                                t >>= 1;
                            }

                            // fill the table entries
                            for (var i = code2; i < size; i += skip)
                                codes[i] = (len << 16) | val;

                            ++code;
                        }
                    }
                }

                return [codes, maxLen];
        },

        readBlock : function() {
            // read block header
            var hdr = this.getBits(3);
            if (hdr & 1)
                this.eof = true;
            hdr >>= 1;

            if (hdr == 0) { // uncompressed block
                var bytes = this.bytes;
                var bytesPos = this.bytesPos;
                var b;

                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                var blockLen = b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                blockLen |= (b << 8);
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                var check = b;
                if (typeof(b = bytes[bytesPos++]) == 'undefined')
                    error('Bad block header in flate stream');
                check |= (b << 8);
                if (check != (~blockLen & 0xffff))
                    error('Bad uncompressed block length in flate stream');

                this.codeBuf = 0;
                this.codeSize = 0;

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + blockLen);
                var end = bufferLength + blockLen;
                this.bufferLength = end;
                for (var n = bufferLength; n < end; ++n) {
                    if (typeof(b = bytes[bytesPos++]) == 'undefined') {
                        this.eof = true;
                        break;
                    }
                    buffer[n] = b;
                }
                this.bytesPos = bytesPos;
                return;
            }

            var litCodeTable;
            var distCodeTable;
            if (hdr == 1) { // compressed block, fixed codes
                litCodeTable = fixedLitCodeTab;
                distCodeTable = fixedDistCodeTab;
            } else if (hdr == 2) { // compressed block, dynamic codes
                var numLitCodes = this.getBits(5) + 257;
                var numDistCodes = this.getBits(5) + 1;
                var numCodeLenCodes = this.getBits(4) + 4;

                // build the code lengths code table
                var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);

                for (var i = 0; i < numCodeLenCodes; ++i)
                    codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
                var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

                // build the literal and distance code tables
                var len = 0;
                var i = 0;
                var codes = numLitCodes + numDistCodes;
                var codeLengths = new Uint8Array(codes);
                while (i < codes) {
                    var code = this.getCode(codeLenCodeTab);
                    if (code == 16) {
                        var bitsLength = 2,
                            bitsOffset = 3,
                            what = len;
                    } else if (code == 17) {
                        var bitsLength = 3,
                            bitsOffset = 3,
                            what = (len = 0);
                    } else if (code == 18) {
                        var bitsLength = 7,
                            bitsOffset = 11,
                            what = (len = 0);
                    } else {
                        codeLengths[i++] = len = code;
                        continue;
                    }

                    var repeatLength = this.getBits(bitsLength) + bitsOffset;
                    while (repeatLength-- > 0)
                        codeLengths[i++] = what;
                }

                litCodeTable =
                    this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
                distCodeTable =
                    this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
            } else {
                error('Unknown block type in flate stream');
            }

            var buffer = this.buffer;
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
                if (code1 == 256) {
                    this.bufferLength = pos;
                    return;
                }
                code1 -= 257;
                code1 = lengthDecode[code1];
                var code2 = code1 >> 16;
                if (code2 > 0)
                    code2 = this.getBits(code2);
                var len = (code1 & 0xffff) + code2;
                code1 = this.getCode(distCodeTable);
                code1 = distDecode[code1];
                code2 = code1 >> 16;
                if (code2 > 0)
                    code2 = this.getBits(code2);
                var dist = (code1 & 0xffff) + code2;
                if (pos + len >= limit) {
                    buffer = this.ensureBuffer(pos + len);
                    limit = buffer.length;
                }
                for (var k = 0; k < len; ++k, ++pos)
                    buffer[pos] = buffer[pos - dist];
            }
        }
    });


    return streams.FlateStream = FlateStream;
});

define('skylark-io-streams/LZWStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var LZWStream = DecodeStream.inherit({
        klassName : "LZWStream",

        init : function(str, earlyChange) {
            this.str = str;
            this.dict = str.dict;
            this.cachedData = 0;
            this.bitsCached = 0;

            var maxLzwDictionarySize = 4096;
            var lzwState = {
                earlyChange: earlyChange,
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
            DecodeStream.prototype.init.call(this);          
        },

        readBits : function(n) {
            var bitsCached = this.bitsCached;
            var cachedData = this.cachedData;
            while (bitsCached < n) {
                var c = this.str.getByte();
                if (c == null) {
                    this.eof = true;
                    return null;
                }
                cachedData = (cachedData << 8) | c;
                bitsCached += 8;
            }
            this.bitsCached = (bitsCached -= n);
            this.cachedData = cachedData;
            this.lastCode = null;
            return (cachedData >>> bitsCached) & ((1 << n) - 1);
        },

        readBlock : function() {
            var blockSize = 512;
            var estimatedDecodedSize = blockSize * 2,
                decodedSizeDelta = blockSize;
            var i, j, q;

            var lzwState = this.lzwState;
            if (!lzwState)
                return; // eof was found

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
                } else if (code == 256) {
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
                    codeLength = (nextCode + earlyChange) & (nextCode + earlyChange - 1) ?
                        codeLength : Math.min(Math.log(nextCode + earlyChange) /
                            0.6931471805599453 + 1, 12) | 0;
                }
                prevCode = code;

                decodedLength += currentSequenceLength;
                if (estimatedDecodedSize < decodedLength) {
                    do {
                        estimatedDecodedSize += decodedSizeDelta;
                    } while (estimatedDecodedSize < decodedLength);
                    buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
                }
                for (j = 0; j < currentSequenceLength; j++)
                    buffer[currentBufferLength++] = currentSequence[j];
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


define('skylark-io-streams/PredictorStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var PredictorStream = DecodeStream.inherit({
        klassName : "PredictorStream",

        init : function(stream, params) {
            var predictor = this.predictor = params.get('Predictor') || 1;

            if (predictor <= 1)
                return stream; // no prediction
            if (predictor !== 2 && (predictor < 10 || predictor > 15))
                error('Unsupported predictor: ' + predictor);

            if (predictor === 2)
                this.readBlock = this.readBlockTiff;
            else
                this.readBlock = this.readBlockPng;

            this.stream = stream;
            this.dict = stream.dict;

            var colors = this.colors = params.get('Colors') || 1;
            var bits = this.bits = params.get('BitsPerComponent') || 8;
            var columns = this.columns = params.get('Columns') || 1;

            this.pixBytes = (colors * bits + 7) >> 3;
            this.rowBytes = (columns * colors * bits + 7) >> 3;
            DecodeStream.prototype.init.call(this);          
        },

        readBlockTiff : function () {
                var rowBytes = this.rowBytes;

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + rowBytes);

                var bits = this.bits;
                var colors = this.colors;

                var rawBytes = this.stream.getBytes(rowBytes);

                var inbuf = 0,
                    outbuf = 0;
                var inbits = 0,
                    outbits = 0;
                var pos = bufferLength;

                if (bits === 1) {
                    for (var i = 0; i < rowBytes; ++i) {
                        var c = rawBytes[i];
                        inbuf = (inbuf << 8) | c;
                        // bitwise addition is exclusive or
                        // first shift inbuf and then add
                        buffer[pos++] = (c ^ (inbuf >> colors)) & 0xFF;
                        // truncate inbuf (assumes colors < 16)
                        inbuf &= 0xFFFF;
                    }
                } else if (bits === 8) {
                    for (var i = 0; i < colors; ++i)
                        buffer[pos++] = rawBytes[i];
                    for (; i < rowBytes; ++i) {
                        buffer[pos] = buffer[pos - colors] + rawBytes[i];
                        pos++;
                    }
                } else {
                    var compArray = new Uint8Array(colors + 1);
                    var bitMask = (1 << bits) - 1;
                    var j = 0,
                        k = bufferLength;
                    var columns = this.columns;
                    for (var i = 0; i < columns; ++i) {
                        for (var kk = 0; kk < colors; ++kk) {
                            if (inbits < bits) {
                                inbuf = (inbuf << 8) | (rawBytes[j++] & 0xFF);
                                inbits += 8;
                            }
                            compArray[kk] = (compArray[kk] +
                                (inbuf >> (inbits - bits))) & bitMask;
                            inbits -= bits;
                            outbuf = (outbuf << bits) | compArray[kk];
                            outbits += bits;
                            if (outbits >= 8) {
                                buffer[k++] = (outbuf >> (outbits - 8)) & 0xFF;
                                outbits -= 8;
                            }
                        }
                    }
                    if (outbits > 0) {
                        buffer[k++] = (outbuf << (8 - outbits)) +
                            (inbuf & ((1 << (8 - outbits)) - 1));
                    }
                }
                this.bufferLength += rowBytes;
        },

        readBlockPng : function() {

                var rowBytes = this.rowBytes;
                var pixBytes = this.pixBytes;

                var predictor = this.stream.getByte();
                var rawBytes = this.stream.getBytes(rowBytes);

                var bufferLength = this.bufferLength;
                var buffer = this.ensureBuffer(bufferLength + rowBytes);

                var prevRow = buffer.subarray(bufferLength - rowBytes, bufferLength);
                if (prevRow.length == 0)
                    prevRow = new Uint8Array(rowBytes);

                var j = bufferLength;
                switch (predictor) {
                    case 0:
                        for (var i = 0; i < rowBytes; ++i)
                            buffer[j++] = rawBytes[i];
                        break;
                    case 1:
                        for (var i = 0; i < pixBytes; ++i)
                            buffer[j++] = rawBytes[i];
                        for (; i < rowBytes; ++i) {
                            buffer[j] = (buffer[j - pixBytes] + rawBytes[i]) & 0xFF;
                            j++;
                        }
                        break;
                    case 2:
                        for (var i = 0; i < rowBytes; ++i)
                            buffer[j++] = (prevRow[i] + rawBytes[i]) & 0xFF;
                        break;
                    case 3:
                        for (var i = 0; i < pixBytes; ++i)
                            buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
                        for (; i < rowBytes; ++i) {
                            buffer[j] = (((prevRow[i] + buffer[j - pixBytes]) >> 1) +
                                rawBytes[i]) & 0xFF;
                            j++;
                        }
                        break;
                    case 4:
                        // we need to save the up left pixels values. the simplest way
                        // is to create a new buffer
                        for (var i = 0; i < pixBytes; ++i) {
                            var up = prevRow[i];
                            var c = rawBytes[i];
                            buffer[j++] = up + c;
                        }
                        for (; i < rowBytes; ++i) {
                            var up = prevRow[i];
                            var upLeft = prevRow[i - pixBytes];
                            var left = buffer[j - pixBytes];
                            var p = left + up - upLeft;

                            var pa = p - left;
                            if (pa < 0)
                                pa = -pa;
                            var pb = p - up;
                            if (pb < 0)
                                pb = -pb;
                            var pc = p - upLeft;
                            if (pc < 0)
                                pc = -pc;

                            var c = rawBytes[i];
                            if (pa <= pb && pa <= pc)
                                buffer[j++] = left + c;
                            else if (pb <= pc)
                                buffer[j++] = up + c;
                            else
                                buffer[j++] = upLeft + c;
                        }
                        break;
                    default:
                        error('Unsupported predictor: ' + predictor);
                }
                this.bufferLength += rowBytes;
        }
    });

    return streams.PredictorStream = PredictorStream;
});


define('skylark-io-streams/StreamsSequenceStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./DecodeStream"
], function(skylark, langx, streams, DecodeStream) {

    var StreamsSequenceStream = DecodeStream.inherit({
        klassName : "StreamsSequenceStream",

        init : function(streams) {
            this.dict = stream.dict;
            DecodeStream.prototype.init.call(this);          
        },

        readBlock : function() {
            var streams = this.streams;
            if (streams.length == 0) {
                this.eof = true;
                return;
            }
            var stream = streams.shift();
            var chunk = stream.getBytes();
            var bufferLength = this.bufferLength;
            var newLength = bufferLength + chunk.length;
            var buffer = this.ensureBuffer(newLength);
            buffer.set(chunk, bufferLength);
            this.bufferLength = newLength;
        }
    });

    return streams.StreamsSequenceStream = StreamsSequenceStream;
});

define('skylark-io-streams/StringStream',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "./streams",
    "./Stream"
], function(skylark, langx, streams, Stream) {

    var StringStream = Stream.inherit({
        klassName : "StringStream",

        init : function(str) {
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var n = 0; n < length; ++n)
                bytes[n] = str.charCodeAt(n);
            DecodeStream.prototype.init.call(this);          
        }
    });


    return streams.StringStream = StringStream;

});

define('skylark-io-streams/main',[
    "./streams",
    "./Ascii85Stream",
    "./AsciiHexStream",
    "./ChunkedStream",
    "./DecodeStream",
    "./DecryptStream",
    "./FakeStream",
    "./FlateStream",
    "./LZWStream",
    "./PredictorStream",
    "./Stream",
    "./StreamsSequenceStream",
    "./StringStream"
], function(streams) {

	return streams;
});
define('skylark-io-streams', ['skylark-io-streams/main'], function (main) { return main; });


},this);