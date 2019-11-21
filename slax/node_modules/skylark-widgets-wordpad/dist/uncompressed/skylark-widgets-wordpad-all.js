/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
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
    var skylarkjs = require("skylark-langx/skylark");

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

define('skylark-langx-types/types',[
    "skylark-langx-ns"
],function(skylark){
    var toString = {}.toString;
    
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

    function isArray(object) {
        return object && object.constructor === Array;
    }


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
        return typeof(obj) === "boolean";
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
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

    function isNull(value) {
      return type(value) === "null";
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isObject(obj) {
        return type(obj) == "object";
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

    function isUndefined(value) {
      return value === undefined
    }

    return skylark.attach("langx.types",{

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: isDefined,

        isDocument: isDocument,

        isEmpty : isEmptyObject,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isHtmlNode: isHtmlNode,

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

  var templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };


  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
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
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

    return skylark.attach("langx.funcs",{
        debounce: debounce,

        delegate: delegate,

        defer: defer,

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
    
    var  PGLISTENERS = Symbol ? Symbol() : '__pglisteners',
         PGNOTIFIES = Symbol ? Symbol() : '__pgnotifies';

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
            p = this.promise = new Promise(function(resolve, reject) {
                self._resolve = resolve;
                self._reject = reject;
            });

        wrapPromise(p,self);

        this[PGLISTENERS] = [];
        this[PGNOTIFIES] = [];

        //this.resolve = Deferred.prototype.resolve.bind(this);
        //this.reject = Deferred.prototype.reject.bind(this);
        //this.progress = Deferred.prototype.progress.bind(this);

    };

    function wrapPromise(p,d) {
        var   added = {
                state : function() {
                    if (d.isResolved()) {
                        return 'resolved';
                    }
                    if (d.isRejected()) {
                        return 'rejected';
                    }
                    return 'pending';
                },
                then : function(onResolved,onRejected,onProgress) {
                    if (onProgress) {
                        this.progress(onProgress);
                    }
                    return wrapPromise(Promise.prototype.then.call(this,
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
                            }));
                },
                progress : function(handler) {
                    d[PGNOTIFIES].forEach(function (value) {
                        handler(value);
                    });
                    d[PGLISTENERS].push(handler);
                    return this;
                }

            };

        added.pipe = added.then;
        return mixin(p,added);

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
        try {
            this[PGNOTIFIES].push(value);

            return this[PGLISTENERS].forEach(function (listener) {
                return listener(value);
            });
        } catch (error) {
          this.reject(error);
        }
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
        return !!this._resolved;
    };

    Deferred.prototype.isRejected = function() {
        return !!this._rejected;
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


    Deferred.prototype.done  = function() {
        var p = result(this,"promise");
        return p.done.apply(p,arguments);
    };

    Deferred.prototype.fail = function(errback) {
        var p = result(this,"promise");
        return p.fail(errback);
    };


    Deferred.all = function(array) {
        //return wrapPromise(Promise.all(array));
        var d = new Deferred();
        Promise.all(array).then(d.resolve.bind(d),d.reject.bind(d));
        return result(d,"promise");
    };

    Deferred.first = function(array) {
        return wrapPromise(Promise.race(array));
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
define('skylark-langx-emitter/Emitter',[
  "skylark-langx-ns/ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass"
],function(skylark,types,objects,arrays,klass){
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
                e = new CustomEvent(e);
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
        var e = new CustomEvent(type,props);
        return safeMixin(e, props);
    };

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

        template : template,

        trim: trim,

        uniqueId: uniqueId,

        upperFirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
	}) ; 

});
define('skylark-langx-strings/main',[
	"./strings"
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
define('skylark-domx-browser/browser',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark,langx) {
    "use strict";

    var browser = langx.hoster.browser;
 
    var checkedCssProperties = {
            "transitionproperty": "TransitionProperty",
        },
        transEndEventNames = {
          WebkitTransition : 'webkitTransitionEnd',
          MozTransition    : 'transitionend',
          OTransition      : 'oTransitionEnd otransitionend',
          transition       : 'transitionend'
        },
        transEndEventName = null;


    var css3PropPrefix = "",
        css3StylePrefix = "",
        css3EventPrefix = "",

        cssStyles = {},
        cssProps = {},

        vendorPrefix,
        vendorPrefixRE,
        vendorPrefixesRE = /^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,

        document = window.document,
        testEl = document.createElement("div"),

        matchesSelector = testEl.webkitMatchesSelector ||
                          testEl.mozMatchesSelector ||
                          testEl.oMatchesSelector ||
                          testEl.matchesSelector,

        requestFullScreen = testEl.requestFullscreen || 
                            testEl.webkitRequestFullscreen || 
                            testEl.mozRequestFullScreen || 
                            testEl.msRequestFullscreen,

        exitFullScreen =  document.exitFullscreen ||
                          document.webkitCancelFullScreen ||
                          document.mozCancelFullScreen ||
                          document.msExitFullscreen,

        testStyle = testEl.style;

    for (var name in testStyle) {
        var matched = name.match(vendorPrefixRE || vendorPrefixesRE);
        if (matched) {
            if (!vendorPrefixRE) {
                vendorPrefix = matched[1];
                vendorPrefixRE = new RegExp("^(" + vendorPrefix + ")(.*)$");

                css3StylePrefix = vendorPrefix;
                css3PropPrefix = '-' + vendorPrefix.toLowerCase() + '-';
                css3EventPrefix = vendorPrefix.toLowerCase();
            }

            cssStyles[langx.lowerFirst(matched[2])] = name;
            var cssPropName = langx.dasherize(matched[2]);
            cssProps[cssPropName] = css3PropPrefix + cssPropName;

            if (transEndEventNames[name]) {
              transEndEventName = transEndEventNames[name];
            }
        }
    }

    if (!transEndEventName) {
        if (testStyle["transition"] !== undefined) {
            transEndEventName = transEndEventNames["transition"];
        }
    }

    function normalizeCssEvent(name) {
        return css3EventPrefix ? css3EventPrefix + name : name.toLowerCase();
    }

    function normalizeCssProperty(name) {
        return cssProps[name] || name;
    }

    function normalizeStyleProperty(name) {
        return cssStyles[name] || name;
    }

    langx.mixin(browser, {
        css3PropPrefix: css3PropPrefix,

        isIE : !!/msie/i.exec( window.navigator.userAgent ),

        normalizeStyleProperty: normalizeStyleProperty,

        normalizeCssProperty: normalizeCssProperty,

        normalizeCssEvent: normalizeCssEvent,

        matchesSelector: matchesSelector,

        requestFullScreen : requestFullScreen,

        exitFullscreen : requestFullScreen,

        location: function() {
            return window.location;
        },

        support : {

        }

    });

    if  (transEndEventName) {
        browser.support.transition = {
            end : transEndEventName
        };
    }

    testEl = null;

    return skylark.attach("domx.browser",browser);
});

define('skylark-domx-browser/main',[
	"./browser"
],function(browser){
	return browser;
});
define('skylark-domx-browser', ['skylark-domx-browser/main'], function (main) { return main; });

define('skylark-domx-noder/noder',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser"
], function(skylark, langx, browser) {
    var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g),
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        div = document.createElement("div"),
        table = document.createElement('table'),
        tableBody = document.createElement('tbody'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': tableBody,
            'tbody': table,
            'thead': table,
            'tfoot': table,
            'td': tableRow,
            'th': tableRow,
            '*': div
        },
        rootNodeRE = /^(?:body|html)$/i,
        map = Array.prototype.map,
        slice = Array.prototype.slice;

    function ensureNodes(nodes, copyByClone) {
        if (!langx.isArrayLike(nodes)) {
            nodes = [nodes];
        }
        if (copyByClone) {
            nodes = map.call(nodes, function(node) {
                return node.cloneNode(true);
            });
        }
        return langx.flatten(nodes);
    }

    function nodeName(elm, chkName) {
        var name = elm.nodeName && elm.nodeName.toLowerCase();
        if (chkName !== undefined) {
            return name === chkName.toLowerCase();
        }
        return name;
    };


    function activeElement(doc) {
        doc = doc || document;
        var el;

        // Support: IE 9 only
        // IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
        try {
            el = doc.activeElement;
        } catch ( error ) {
            el = doc.body;
        }

        // Support: IE 9 - 11 only
        // IE may return null instead of an element
        // Interestingly, this only seems to occur when NOT in an iframe
        if ( !el ) {
            el = doc.body;
        }

        // Support: IE 11 only
        // IE11 returns a seemingly empty object in some cases when accessing
        // document.activeElement from an <iframe>
        if ( !el.nodeName ) {
            el = doc.body;
        }

        return el;
    };

    function enhancePlaceContent(placing,node) {
        if (langx.isFunction(placing)) {
            return placing.apply(node,[]);
        }
        if (langx.isArrayLike(placing)) {
            var neddsFlattern;
            for (var i=0;i<placing.length;i++) {
                if (langx.isFunction(placing[i])) {
                    placing[i] = placing[i].apply(node,[]);
                    if (langx.isArrayLike(placing[i])) {
                        neddsFlattern = true;
                    }
                }
            }
            if (neddsFlattern) {
                placing = langx.flatten(placing);
            }
        }
        return placing;
    }
    function after(node, placing, copyByClone) {
        placing = enhancePlaceContent(placing,node);
        var refNode = node,
            parent = refNode.parentNode;
        if (parent) {
            var nodes = ensureNodes(placing, copyByClone),
                refNode = refNode.nextSibling;

            for (var i = 0; i < nodes.length; i++) {
                if (refNode) {
                    parent.insertBefore(nodes[i], refNode);
                } else {
                    parent.appendChild(nodes[i]);
                }
            }
        }
        return this;
    }

    function append(node, placing, copyByClone) {
        placing = enhancePlaceContent(placing,node);
        var parentNode = node,
            nodes = ensureNodes(placing, copyByClone);
        for (var i = 0; i < nodes.length; i++) {
            parentNode.appendChild(nodes[i]);
        }
        return this;
    }

    function before(node, placing, copyByClone) {
        placing = enhancePlaceContent(placing,node);
        var refNode = node,
            parent = refNode.parentNode;
        if (parent) {
            var nodes = ensureNodes(placing, copyByClone);
            for (var i = 0; i < nodes.length; i++) {
                parent.insertBefore(nodes[i], refNode);
            }
        }
        return this;
    }
    /*   
     * Get the children of the specified node, including text and comment nodes.
     * @param {HTMLElement} elm
     */
    function contents(elm) {
        if (nodeName(elm, "iframe")) {
            return elm.contentDocument;
        }
        return elm.childNodes;
    }

    /*   
     * Create a element and set attributes on it.
     * @param {HTMLElement} tag
     * @param {props} props
     * @param } parent
     */
    function createElement(tag, props, parent) {
        var node = document.createElement(tag);
        if (props) {
            for (var name in props) {
                node.setAttribute(name, props[name]);
            }
        }
        if (parent) {
            append(parent, node);
        }
        return node;
    }

    /*   
     * Create a DocumentFragment from the HTML fragment.
     * @param {String} html
     */
    function createFragment(html) {
        // A special case optimization for a single tag
        html = langx.trim(html);
        if (singleTagRE.test(html)) {
            return [createElement(RegExp.$1)];
        }

        var name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) {
            name = "*"
        }
        var container = containers[name];
        container.innerHTML = "" + html;
        dom = slice.call(container.childNodes);

        dom.forEach(function(node) {
            container.removeChild(node);
        })

        return dom;
    }

    /*   
     * Create a deep copy of the set of matched elements.
     * @param {HTMLElement} node
     * @param {Boolean} deep
     */
    function clone(node, deep) {
        var self = this,
            clone;

        // TODO: Add feature detection here in the future
        if (!isIE || node.nodeType !== 1 || deep) {
            return node.cloneNode(deep);
        }

        // Make a HTML5 safe shallow copy
        if (!deep) {
            clone = document.createElement(node.nodeName);

            // Copy attribs
            each(self.getAttribs(node), function(attr) {
                self.setAttrib(clone, attr.nodeName, self.getAttrib(node, attr.nodeName));
            });

            return clone;
        }
    }

    /*   
     * Check to see if a dom node is a descendant of another dom node .
     * @param {String} node
     * @param {Node} child
     */
    function contains(node, child) {
        return isChildOf(child, node);
    }

    /*   
     * Create a new Text node.
     * @param {String} text
     * @param {Node} child
     */
    function createTextNode(text) {
        return document.createTextNode(text);
    }

    /*   
     * Get the current document object.
     */
    function doc() {
        return document;
    }

    /*   
     * Remove all child nodes of the set of matched elements from the DOM.
     * @param {Object} node
     */
    function empty(node) {
        while (node.hasChildNodes()) {
            var child = node.firstChild;
            node.removeChild(child);
        }
        return this;
    }

    var fulledEl = null;

    function fullScreen(el) {
        if (el === false) {
            browser.exitFullScreen.apply(document);
        } else if (el) {
            browser.requestFullScreen.apply(el);
            fulledEl = el;
        } else {
            return (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            )
        }
    }


    // Selectors
    function focusable( element, hasTabindex ) {
        var map, mapName, img, focusableIfVisible, fieldset,
            nodeName = element.nodeName.toLowerCase();

        if ( "area" === nodeName ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap='#" + mapName + "']" );
            return img.length > 0 && img.is( ":visible" );
        }

        if ( /^(input|select|textarea|button|object)$/.test( nodeName ) ) {
            focusableIfVisible = !element.disabled;

            if ( focusableIfVisible ) {

                // Form controls within a disabled fieldset are disabled.
                // However, controls within the fieldset's legend do not get disabled.
                // Since controls generally aren't placed inside legends, we skip
                // this portion of the check.
                fieldset = $( element ).closest( "fieldset" )[ 0 ];
                if ( fieldset ) {
                    focusableIfVisible = !fieldset.disabled;
                }
            }
        } else if ( "a" === nodeName ) {
            focusableIfVisible = element.href || hasTabindex;
        } else {
            focusableIfVisible = hasTabindex;
        }

        return focusableIfVisible && $( element ).is( ":visible" ) && visible( $( element ) );
    };


   var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
 
    /*   
     * Get the HTML contents of the first element in the set of matched elements.
     * @param {HTMLElement} node
     * @param {String} html
     */
    function html(node, html) {
        if (html === undefined) {
            return node.innerHTML;
        } else {
            this.empty(node);
            html = html || "";
            if (langx.isString(html)) {
                html = html.replace( rxhtmlTag, "<$1></$2>" );
            }
            if (langx.isString(html) || langx.isNumber(html)) {               
                node.innerHTML = html;
            } else if (langx.isArrayLike(html)) {
                for (var i = 0; i < html.length; i++) {
                    node.appendChild(html[i]);
                }
            } else {
                node.appendChild(html);
            }

            return this;
        }
    }


    /*   
     * Check to see if a dom node is a descendant of another dom node.
     * @param {Node} node
     * @param {Node} parent
     * @param {Node} directly
     */
    function isChildOf(node, parent, directly) {
        if (directly) {
            return node.parentNode === parent;
        }
        if (document.documentElement.contains) {
            return parent.contains(node);
        }
        while (node) {
            if (parent === node) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    }

    /*   
     * Check to see if a dom node is a document.
     * @param {Node} node
     */
    function isDocument(node) {
        return node != null && node.nodeType == node.DOCUMENT_NODE
    }

    /*   
     * Check to see if a dom node is in the document
     * @param {Node} node
     */
    function isInDocument(node) {
      return (node === document.body) ? true : document.body.contains(node);
    }        

    var blockNodes = ["div", "p", "ul", "ol", "li", "blockquote", "hr", "pre", "h1", "h2", "h3", "h4", "h5", "table"];

    function isBlockNode(node) {
        if (!node || node.nodeType === 3) {
          return false;
        }
        return new RegExp("^(" + (blockNodes.join('|')) + ")$").test(node.nodeName.toLowerCase());
    }


    /*   
     * Get the owner document object for the specified element.
     * @param {Node} elm
     */
    function ownerDoc(elm) {
        if (!elm) {
            return document;
        }

        if (elm.nodeType == 9) {
            return elm;
        }

        return elm.ownerDocument;
    }

    /*   
     *
     * @param {Node} elm
     */
    function ownerWindow(elm) {
        var doc = ownerDoc(elm);
        return doc.defaultView || doc.parentWindow;
    }

    /*   
     * insert one or more nodes as the first children of the specified node.
     * @param {Node} node
     * @param {Node or ArrayLike} placing
     * @param {Boolean Optional} copyByClone
     */
    function prepend(node, placing, copyByClone) {
        var parentNode = node,
            refNode = parentNode.firstChild,
            nodes = ensureNodes(placing, copyByClone);
        for (var i = 0; i < nodes.length; i++) {
            if (refNode) {
                parentNode.insertBefore(nodes[i], refNode);
            } else {
                parentNode.appendChild(nodes[i]);
            }
        }
        return this;
    }

    /*   
     *
     * @param {Node} elm
     */
    function offsetParent(elm) {
        var parent = elm.offsetParent || document.body;
        while (parent && !rootNodeRE.test(parent.nodeName) && document.defaultView.getComputedStyle(parent).position == "static") {
            parent = parent.offsetParent;
        }
        return parent;
    }

    /*   
     * Remove the set of matched elements from the DOM.
     * @param {Node} node
     */
    function remove(node) {
        if (node && node.parentNode) {
            try {
                node.parentNode.removeChild(node);
            } catch (e) {
                console.warn("The node is already removed", e);
            }
        }
        return this;
    }

    function removeChild(node,children) {
        if (!langx.isArrayLike(children)) {
            children = [children];
        }
        for (var i=0;i<children.length;i++) {
            node.removeChild(children[i]);
        }

        return this;
    }

    function scrollParent( elm, includeHidden ) {
        var position = document.defaultView.getComputedStyle(elm).position,
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = this.parents().filter( function() {
                var parent = $( this );
                if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                    return false;
                }
                return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
                    parent.css( "overflow-x" ) );
            } ).eq( 0 );

        return position === "fixed" || !scrollParent.length ?
            $( this[ 0 ].ownerDocument || document ) :
            scrollParent;
    };


    function reflow(elm) {
        if (el == null) {
          elm = document;
        }
        elm.offsetHeight;

        return this;      
    }

    /*   
     * Replace an old node with the specified node.
     * @param {Node} node
     * @param {Node} oldNode
     */
    function replace(node, oldNode) {
        oldNode.parentNode.replaceChild(node, oldNode);
        return this;
    }


    /*   
     * traverse the specified node and its descendants, perform the callback function on each
     * @param {Node} node
     * @param {Function} fn
     */
    function traverse(node, fn) {
        fn(node)
        for (var i = 0, len = node.childNodes.length; i < len; i++) {
            traverse(node.childNodes[i], fn);
        }
        return this;
    }

    /*   
     *
     * @param {Node} node
     */
    function reverse(node) {
        var firstChild = node.firstChild;
        for (var i = node.children.length - 1; i > 0; i--) {
            if (i > 0) {
                var child = node.children[i];
                node.insertBefore(child, firstChild);
            }
        }
    }

    /*   
     * Wrap an HTML structure around each element in the set of matched elements.
     * @param {Node} node
     * @param {Node} wrapperNode
     */
    function wrapper(node, wrapperNode) {
        if (langx.isString(wrapperNode)) {
            wrapperNode = this.createFragment(wrapperNode).firstChild;
        }
        node.parentNode.insertBefore(wrapperNode, node);
        wrapperNode.appendChild(node);
    }

    /*   
     * Wrap an HTML structure around the content of each element in the set of matched
     * @param {Node} node
     * @param {Node} wrapperNode
     */
    function wrapperInner(node, wrapperNode) {
        var childNodes = slice.call(node.childNodes);
        node.appendChild(wrapperNode);
        for (var i = 0; i < childNodes.length; i++) {
            wrapperNode.appendChild(childNodes[i]);
        }
        return this;
    }

    /*   
     * Remove the parents of the set of matched elements from the DOM, leaving the matched
     * @param {Node} node
     */
    function unwrap(node) {
        var child, parent = node.parentNode;
        if (parent) {
            if (this.isDoc(parent.parentNode)) return;
            parent.parentNode.insertBefore(node, parent);
        }
    }

    function noder() {
        return noder;
    }

    langx.mixin(noder, {
        active  : activeElement,

        blur : function(el) {
            el.blur();
        },

        body: function() {
            return document.body;
        },

        clone: clone,
        contents: contents,

        createElement: createElement,

        createFragment: createFragment,

        contains: contains,

        createTextNode: createTextNode,

        doc: doc,

        empty: empty,

        fullScreen: fullScreen,

        focusable: focusable,

        html: html,

        isChildOf: isChildOf,

        isDocument: isDocument,

        isInDocument: isInDocument,

        isWindow: langx.isWindow,

        nodeName : nodeName,

        offsetParent: offsetParent,

        ownerDoc: ownerDoc,

        ownerWindow: ownerWindow,

        after: after,

        before: before,

        prepend: prepend,

        append: append,

        reflow: reflow,

        remove: remove,

        removeChild : removeChild,

        replace: replace,

        traverse: traverse,

        reverse: reverse,

        wrapper: wrapper,

        wrapperInner: wrapperInner,

        unwrap: unwrap
    });

    return skylark.attach("domx.noder" , noder);
});
define('skylark-domx-noder/main',[
	"./noder"
],function(noder){
	return noder;
});
define('skylark-domx-noder', ['skylark-domx-noder/main'], function (main) { return main; });

define('skylark-domx-finder/finder',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-noder"
], function(skylark, langx, browser, noder) {
    var local = {},
        filter = Array.prototype.filter,
        slice = Array.prototype.slice,
        nativeMatchesSelector = browser.matchesSelector;

    /*
    ---
    name: Slick.Parser
    description: Standalone CSS3 Selector parser
    provides: Slick.Parser
    ...
    */
    ;
    (function() {

        var parsed,
            separatorIndex,
            combinatorIndex,
            reversed,
            cache = {},
            reverseCache = {},
            reUnescape = /\\/g;

        var parse = function(expression, isReversed) {
            if (expression == null) return null;
            if (expression.Slick === true) return expression;
            expression = ('' + expression).replace(/^\s+|\s+$/g, '');
            reversed = !!isReversed;
            var currentCache = (reversed) ? reverseCache : cache;
            if (currentCache[expression]) return currentCache[expression];
            parsed = {
                Slick: true,
                expressions: [],
                raw: expression,
                reverse: function() {
                    return parse(this.raw, true);
                }
            };
            separatorIndex = -1;
            while (expression != (expression = expression.replace(regexp, parser)));
            parsed.length = parsed.expressions.length;
            return currentCache[parsed.raw] = (reversed) ? reverse(parsed) : parsed;
        };

        var reverseCombinator = function(combinator) {
            if (combinator === '!') return ' ';
            else if (combinator === ' ') return '!';
            else if ((/^!/).test(combinator)) return combinator.replace(/^!/, '');
            else return '!' + combinator;
        };

        var reverse = function(expression) {
            var expressions = expression.expressions;
            for (var i = 0; i < expressions.length; i++) {
                var exp = expressions[i];
                var last = {
                    parts: [],
                    tag: '*',
                    combinator: reverseCombinator(exp[0].combinator)
                };

                for (var j = 0; j < exp.length; j++) {
                    var cexp = exp[j];
                    if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
                    cexp.combinator = cexp.reverseCombinator;
                    delete cexp.reverseCombinator;
                }

                exp.reverse().push(last);
            }
            return expression;
        };

        var escapeRegExp = (function() {
            // Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
            var from = /(?=[\-\[\]{}()*+?.\\\^$|,#\s])/g,
                to = '\\';
            return function(string) {
                return string.replace(from, to)
            }
        }())

        var regexp = new RegExp(
            "^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)"
            .replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
            .replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
            .replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
        );

        function parser(
            rawMatch,

            separator,
            combinator,
            combinatorChildren,

            tagName,
            id,
            className,

            attributeKey,
            attributeOperator,
            attributeQuote,
            attributeValue,

            pseudoMarker,
            pseudoClass,
            pseudoQuote,
            pseudoClassQuotedValue,
            pseudoClassValue
        ) {
            if (separator || separatorIndex === -1) {
                parsed.expressions[++separatorIndex] = [];
                combinatorIndex = -1;
                if (separator) return '';
            }

            if (combinator || combinatorChildren || combinatorIndex === -1) {
                combinator = combinator || ' ';
                var currentSeparator = parsed.expressions[separatorIndex];
                if (reversed && currentSeparator[combinatorIndex])
                    currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
                currentSeparator[++combinatorIndex] = {
                    combinator: combinator,
                    tag: '*'
                };
            }

            var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

            if (tagName) {
                currentParsed.tag = tagName.replace(reUnescape, '');

            } else if (id) {
                currentParsed.id = id.replace(reUnescape, '');

            } else if (className) {
                className = className.replace(reUnescape, '');

                if (!currentParsed.classList) currentParsed.classList = [];
                if (!currentParsed.classes) currentParsed.classes = [];
                currentParsed.classList.push(className);
                currentParsed.classes.push({
                    value: className,
                    regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
                });

            } else if (pseudoClass) {
                pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
                pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

                if (!currentParsed.pseudos) currentParsed.pseudos = [];
                currentParsed.pseudos.push({
                    key: pseudoClass.replace(reUnescape, ''),
                    value: pseudoClassValue,
                    type: pseudoMarker.length == 1 ? 'class' : 'element'
                });

            } else if (attributeKey) {
                attributeKey = attributeKey.replace(reUnescape, '');
                attributeValue = (attributeValue || '').replace(reUnescape, '');

                var test, regexp;

                switch (attributeOperator) {
                    case '^=':
                        regexp = new RegExp('^' + escapeRegExp(attributeValue));
                        break;
                    case '$=':
                        regexp = new RegExp(escapeRegExp(attributeValue) + '$');
                        break;
                    case '~=':
                        regexp = new RegExp('(^|\\s)' + escapeRegExp(attributeValue) + '(\\s|$)');
                        break;
                    case '|=':
                        regexp = new RegExp('^' + escapeRegExp(attributeValue) + '(-|$)');
                        break;
                    case '=':
                        test = function(value) {
                            return attributeValue == value;
                        };
                        break;
                    case '*=':
                        test = function(value) {
                            return value && value.indexOf(attributeValue) > -1;
                        };
                        break;
                    case '!=':
                        test = function(value) {
                            return attributeValue != value;
                        };
                        break;
                    default:
                        test = function(value) {
                            return !!value;
                        };
                }

                if (attributeValue == '' && (/^[*$^]=$/).test(attributeOperator)) test = function() {
                    return false;
                };

                if (!test) test = function(value) {
                    return value && regexp.test(value);
                };

                if (!currentParsed.attributes) currentParsed.attributes = [];
                currentParsed.attributes.push({
                    key: attributeKey,
                    operator: attributeOperator,
                    value: attributeValue,
                    test: test
                });

            }

            return '';
        };

        // Slick NS

        var Slick = (this.Slick || {});

        Slick.parse = function(expression) {
            return parse(expression);
        };

        Slick.escapeRegExp = escapeRegExp;

        if (!this.Slick) this.Slick = Slick;

    }).apply(local);


    var simpleClassSelectorRE = /^\.([\w-]*)$/,
        simpleIdSelectorRE = /^#([\w-]*)$/,
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
        slice = Array.prototype.slice;


    local.parseSelector = local.Slick.parse;


    var pseudos = local.pseudos = {
        // custom pseudos
        "button": function(elem) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === "button" || name === "button";
        },

        'checked': function(elm) {
            return !!elm.checked;
        },

        'contains': function(elm, idx, nodes, text) {
            if ($(this).text().indexOf(text) > -1) return this
        },

        'disabled': function(elm) {
            return !!elm.disabled;
        },

        'enabled': function(elm) {
            return !elm.disabled;
        },

        'eq': function(elm, idx, nodes, value) {
            return (idx == value);
        },

        'even': function(elm, idx, nodes, value) {
            return (idx % 2) === 0;
        },

        'focus': function(elm) {
            return document.activeElement === elm && (elm.href || elm.type || elm.tabindex);
        },

        'focusable': function( elm ) {
            return noder.focusable(elm, elm.tabindex != null );
        },

        'first': function(elm, idx) {
            return (idx === 0);
        },

        'gt': function(elm, idx, nodes, value) {
            return (idx > value);
        },

        'has': function(elm, idx, nodes, sel) {
            return find(elm, sel);
        },

        // Element/input types
        "header": function(elem) {
            return rheader.test(elem.nodeName);
        },

        'hidden': function(elm) {
            return !local.pseudos["visible"](elm);
        },

        "input": function(elem) {
            return rinputs.test(elem.nodeName);
        },

        'last': function(elm, idx, nodes) {
            return (idx === nodes.length - 1);
        },

        'lt': function(elm, idx, nodes, value) {
            return (idx < value);
        },

        'not': function(elm, idx, nodes, sel) {
            return !matches(elm, sel);
        },

        'odd': function(elm, idx, nodes, value) {
            return (idx % 2) === 1;
        },

        /*   
         * Get the parent of each element in the current set of matched elements.
         * @param {Object} elm
         */
        'parent': function(elm) {
            return !!elm.parentNode;
        },

        'selected': function(elm) {
            return !!elm.selected;
        },

        'tabbable': function(elm) {
            var tabIndex = elm.tabindex,
                hasTabindex = tabIndex != null;
            return ( !hasTabindex || tabIndex >= 0 ) && noder.focusable( element, hasTabindex );
        },

        'text': function(elm) {
            return elm.type === "text";
        },

        'visible': function(elm) {
            return elm.offsetWidth && elm.offsetWidth
        }
    };

    ["first", "eq", "last"].forEach(function(item) {
        pseudos[item].isArrayFilter = true;
    });



    pseudos["nth"] = pseudos["eq"];

    function createInputPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }

    function createButtonPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }

    // Add button/input type pseudos
    for (i in {
        radio: true,
        checkbox: true,
        file: true,
        password: true,
        image: true
    }) {
        pseudos[i] = createInputPseudo(i);
    }
    for (i in {
        submit: true,
        reset: true
    }) {
        pseudos[i] = createButtonPseudo(i);
    }


    local.divide = function(cond) {
        var nativeSelector = "",
            customPseudos = [],
            tag,
            id,
            classes,
            attributes,
            pseudos;


        if (id = cond.id) {
            nativeSelector += ("#" + id);
        }
        if (classes = cond.classes) {
            for (var i = classes.length; i--;) {
                nativeSelector += ("." + classes[i].value);
            }
        }
        if (attributes = cond.attributes) {
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].operator) {
                    nativeSelector += ("[" + attributes[i].key + attributes[i].operator + JSON.stringify(attributes[i].value) + "]");
                } else {
                    nativeSelector += ("[" + attributes[i].key + "]");
                }
            }
        }
        if (pseudos = cond.pseudos) {
            for (i = pseudos.length; i--;) {
                part = pseudos[i];
                if (this.pseudos[part.key]) {
                    customPseudos.push(part);
                } else {
                    if (part.value !== undefined) {
                        nativeSelector += (":" + part.key + "(" + JSON.stringify(part))
                    }
                }
            }
        }

        if (tag = cond.tag) {
            if (tag !== "*") {
                nativeSelector = tag.toUpperCase() + nativeSelector;
            }
        }

        if (!nativeSelector) {
            nativeSelector = "*";
        }

        return {
            nativeSelector: nativeSelector,
            customPseudos: customPseudos
        }

    };

    local.check = function(node, cond, idx, nodes, arrayFilte) {
        var tag,
            id,
            classes,
            attributes,
            pseudos,

            i, part, cls, pseudo;

        if (!arrayFilte) {
            if (tag = cond.tag) {
                var nodeName = node.nodeName.toUpperCase();
                if (tag == '*') {
                    if (nodeName < '@') return false; // Fix for comment nodes and closed nodes
                } else {
                    if (nodeName != (tag || "").toUpperCase()) return false;
                }
            }

            if (id = cond.id) {
                if (node.getAttribute('id') != id) {
                    return false;
                }
            }


            if (classes = cond.classes) {
                for (i = classes.length; i--;) {
                    cls = node.getAttribute('class');
                    if (!(cls && classes[i].regexp.test(cls))) return false;
                }
            }

            if (attributes = cond.attributes) {
                for (i = attributes.length; i--;) {
                    part = attributes[i];
                    if (part.operator ? !part.test(node.getAttribute(part.key)) : !node.hasAttribute(part.key)) return false;
                }
            }

        }
        if (pseudos = cond.pseudos) {
            for (i = pseudos.length; i--;) {
                part = pseudos[i];
                if (pseudo = this.pseudos[part.key]) {
                    if ((arrayFilte && pseudo.isArrayFilter) || (!arrayFilte && !pseudo.isArrayFilter)) {
                        if (!pseudo(node, idx, nodes, part.value)) {
                            return false;
                        }
                    }
                } else {
                    if (!arrayFilte && !nativeMatchesSelector.call(node, part.key)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    local.match = function(node, selector) {

        var parsed;

        if (langx.isString(selector)) {
            parsed = local.Slick.parse(selector);
        } else {
            parsed = selector;
        }

        if (!parsed) {
            return true;
        }

        // simple (single) selectors
        var expressions = parsed.expressions,
            simpleExpCounter = 0,
            i,
            currentExpression;
        for (i = 0;
            (currentExpression = expressions[i]); i++) {
            if (currentExpression.length == 1) {
                var exp = currentExpression[0];
                if (this.check(node, exp)) {
                    return true;
                }
                simpleExpCounter++;
            }
        }

        if (simpleExpCounter == parsed.length) {
            return false;
        }

        var nodes = this.query(document, parsed),
            item;
        for (i = 0; item = nodes[i++];) {
            if (item === node) {
                return true;
            }
        }
        return false;
    };


    local.filterSingle = function(nodes, exp) {
        var matchs = filter.call(nodes, function(node, idx) {
            return local.check(node, exp, idx, nodes, false);
        });

        matchs = filter.call(matchs, function(node, idx) {
            return local.check(node, exp, idx, matchs, true);
        });
        return matchs;
    };

    local.filter = function(nodes, selector) {
        var parsed;

        if (langx.isString(selector)) {
            parsed = local.Slick.parse(selector);
        } else {
            return local.filterSingle(nodes, selector);
        }

        // simple (single) selectors
        var expressions = parsed.expressions,
            i,
            currentExpression,
            ret = [];
        for (i = 0;
            (currentExpression = expressions[i]); i++) {
            if (currentExpression.length == 1) {
                var exp = currentExpression[0];

                var matchs = local.filterSingle(nodes, exp);

                ret = langx.uniq(ret.concat(matchs));
            } else {
                throw new Error("not supported selector:" + selector);
            }
        }

        return ret;

    };

    local.combine = function(elm, bit) {
        var op = bit.combinator,
            cond = bit,
            node1,
            nodes = [];

        switch (op) {
            case '>': // direct children
                nodes = children(elm, cond);
                break;
            case '+': // next sibling
                node1 = nextSibling(elm, cond, true);
                if (node1) {
                    nodes.push(node1);
                }
                break;
            case '^': // first child
                node1 = firstChild(elm, cond, true);
                if (node1) {
                    nodes.push(node1);
                }
                break;
            case '~': // next siblings
                nodes = nextSiblings(elm, cond);
                break;
            case '++': // next sibling and previous sibling
                var prev = previousSibling(elm, cond, true),
                    next = nextSibling(elm, cond, true);
                if (prev) {
                    nodes.push(prev);
                }
                if (next) {
                    nodes.push(next);
                }
                break;
            case '~~': // next siblings and previous siblings
                nodes = siblings(elm, cond);
                break;
            case '!': // all parent nodes up to document
                nodes = ancestors(elm, cond);
                break;
            case '!>': // direct parent (one level)
                node1 = parent(elm, cond);
                if (node1) {
                    nodes.push(node1);
                }
                break;
            case '!+': // previous sibling
                nodes = previousSibling(elm, cond, true);
                break;
            case '!^': // last child
                node1 = lastChild(elm, cond, true);
                if (node1) {
                    nodes.push(node1);
                }
                break;
            case '!~': // previous siblings
                nodes = previousSiblings(elm, cond);
                break;
            default:
                var divided = this.divide(bit);
                nodes = slice.call(elm.querySelectorAll(divided.nativeSelector));
                if (divided.customPseudos) {
                    for (var i = divided.customPseudos.length - 1; i >= 0; i--) {
                        nodes = filter.call(nodes, function(item, idx) {
                            return local.check(item, {
                                pseudos: [divided.customPseudos[i]]
                            }, idx, nodes, false)
                        });

                        nodes = filter.call(nodes, function(item, idx) {
                            return local.check(item, {
                                pseudos: [divided.customPseudos[i]]
                            }, idx, nodes, true)
                        });
                    }
                }
                break;

        }
        return nodes;
    }

    local.query = function(node, selector, single) {


        var parsed = this.Slick.parse(selector);

        var
            founds = [],
            currentExpression, currentBit,
            expressions = parsed.expressions;

        for (var i = 0;
            (currentExpression = expressions[i]); i++) {
            var currentItems = [node],
                found;
            for (var j = 0;
                (currentBit = currentExpression[j]); j++) {
                found = langx.map(currentItems, function(item, i) {
                    return local.combine(item, currentBit)
                });
                if (found) {
                    currentItems = found;
                }
            }
            if (found) {
                founds = founds.concat(found);
            }
        }

        return founds;
    }

    /*
     * Get the nearest ancestor of the specified element,optional matched by a selector.
     * @param {HTMLElement} node
     * @param {String Optional } selector
     * @param {Object} root
     */
    function ancestor(node, selector, root) {
        var rootIsSelector = root && langx.isString(root);
        while (node = node.parentNode) {
            if (matches(node, selector)) {
                return node;
            }
            if (root) {
                if (rootIsSelector) {
                    if (matches(node, root)) {
                        break;
                    }
                } else if (node == root) {
                    break;
                }
            }
        }
        return null;
    }

    /*
     * Get the ancestors of the specitied element , optionally filtered by a selector.
     * @param {HTMLElement} node
     * @param {String Optional } selector
     * @param {Object} root
     */
    function ancestors(node, selector, root) {
        var ret = [],
            rootIsSelector = root && langx.isString(root);
        while ((node = node.parentNode) && (node.nodeType !== 9)) {
            if (root) {
                if (rootIsSelector) {
                    if (matches(node, root)) {
                        break;
                    }
                } else if (langx.isArrayLike(root)) {
                    if (langx.inArray(node,root)>-1) {
                        break;
                    }
                } else if (node == root) {
                    break;
                }
            }
            ret.push(node); // TODO
        }

        if (selector) {
            ret = local.filter(ret, selector);
        }
        return ret;
    }

    /*
     * Returns a element by its ID.
     * @param {string} id
     */
    function byId(id, doc) {
        doc = doc || noder.doc();
        return doc.getElementById(id);
    }

    /*
     * Get the children of the specified element , optionally filtered by a selector.
     * @param {string} node
     * @param {String optionlly} selector
     */
    function children(node, selector) {
        var childNodes = node.childNodes,
            ret = [];
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType == 1) {
                ret.push(node);
            }
        }
        if (selector) {
            ret = local.filter(ret, selector);
        }
        return ret;
    }

    function closest(node, selector) {
        while (node && !(matches(node, selector))) {
            node = node.parentNode;
        }

        return node;
    }

    /*
     * Get the decendant of the specified element , optionally filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function descendants(elm, selector) {
        // Selector
        try {
            return slice.call(elm.querySelectorAll(selector));
        } catch (matchError) {
            //console.log(matchError);
        }
        return local.query(elm, selector);
    }

    /*
     * Get the nearest decendent of the specified element,optional matched by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function descendant(elm, selector) {
        // Selector
        try {
            return elm.querySelector(selector);
        } catch (matchError) {
            //console.log(matchError);
        }
        var nodes = local.query(elm, selector);
        if (nodes.length > 0) {
            return nodes[0];
        } else {
            return null;
        }
    }

    /*
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function find(elm, selector) {
        if (!selector) {
            selector = elm;
            elm = document.body;
        }
        if (matches(elm, selector)) {
            return elm;
        } else {
            return descendant(elm, selector);
        }
    }

    /*
     * Get the findAll of the specified element , optionally filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function findAll(elm, selector) {
        if (!selector) {
            selector = elm;
            elm = document.body;
        }
        return descendants(elm, selector);
    }

    /*
     * Get the first child of the specified element , optionally filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     * @param {String} first
     */
    function firstChild(elm, selector, first) {
        var childNodes = elm.childNodes,
            node = childNodes[0];
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    return node;
                }
                if (first) {
                    break;
                }
            }
            node = node.nextSibling;
        }

        return null;
    }

    /*
     * Get the last child of the specified element , optionally filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     * @param {String } last
     */
    function lastChild(elm, selector, last) {
        var childNodes = elm.childNodes,
            node = childNodes[childNodes.length - 1];
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    return node;
                }
                if (last) {
                    break;
                }
            }
            node = node.previousSibling;
        }

        return null;
    }

    /*
     * Check the specified element against a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function matches(elm, selector) {
        if (!selector || !elm || elm.nodeType !== 1) {
            return false
        }

        if (langx.isString(selector)) {
            try {
                return nativeMatchesSelector.call(elm, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
            } catch (matchError) {
                //console.log(matchError);
            }
            return local.match(elm, selector);
        } else if (langx.isArrayLike(selector)) {
            return langx.inArray(elm, selector) > -1;
        } else if (langx.isPlainObject(selector)) {
            return local.check(elm, selector);
        } else {
            return elm === selector;
        }

    }

    /*
     * Get the nearest next sibing of the specitied element , optional matched by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     * @param {Boolean Optional} adjacent
     */
    function nextSibling(elm, selector, adjacent) {
        var node = elm.nextSibling;
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    return node;
                }
                if (adjacent) {
                    break;
                }
            }
            node = node.nextSibling;
        }
        return null;
    }

    /*
     * Get the next siblings of the specified element , optional filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function nextSiblings(elm, selector) {
        var node = elm.nextSibling,
            ret = [];
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    ret.push(node);
                }
            }
            node = node.nextSibling;
        }
        return ret;
    }

    /*
     * Get the parent element of the specified element. if a selector is provided, it retrieves the parent element only if it matches that selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function parent(elm, selector) {
        var node = elm.parentNode;
        if (node && (!selector || matches(node, selector))) {
            return node;
        }

        return null;
    }

    /*
     * Get hte nearest previous sibling of the specified element ,optional matched by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     * @param {Boolean Optional } adjacent
     */
    function previousSibling(elm, selector, adjacent) {
        var node = elm.previousSibling;
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    return node;
                }
                if (adjacent) {
                    break;
                }
            }
            node = node.previousSibling;
        }
        return null;
    }

    /*
     * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function previousSiblings(elm, selector) {
        var node = elm.previousSibling,
            ret = [];
        while (node) {
            if (node.nodeType == 1) {
                if (!selector || matches(node, selector)) {
                    ret.push(node);
                }
            }
            node = node.previousSibling;
        }
        return ret;
    }

    /*
     * Selects all sibling elements that follow after the “prev” element, have the same parent, and match the filtering “siblings” selector.
     * @param {HTMLElement} elm
     * @param {String optionlly} selector
     */
    function siblings(elm, selector) {
        var node = elm.parentNode.firstChild,
            ret = [];
        while (node) {
            if (node.nodeType == 1 && node !== elm) {
                if (!selector || matches(node, selector)) {
                    ret.push(node);
                }
            }
            node = node.nextSibling;
        }
        return ret;
    }

    var finder = function() {
        return finder;
    };

    langx.mixin(finder, {

        ancestor: ancestor,

        ancestors: ancestors,

        byId: byId,

        children: children,

        closest: closest,

        descendant: descendant,

        descendants: descendants,

        find: find,

        findAll: findAll,

        firstChild: firstChild,

        lastChild: lastChild,

        matches: matches,

        nextSibling: nextSibling,

        nextSiblings: nextSiblings,

        parent: parent,

        previousSibling,

        previousSiblings,

        pseudos: local.pseudos,

        siblings: siblings
    });

    return skylark.attach("domx.finder", finder);
});
define('skylark-domx-finder/main',[
	"./finder"
],function(finder){

	return finder;
});
define('skylark-domx-finder', ['skylark-domx-finder/main'], function (main) { return main; });

define('skylark-domx-query/query',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-finder"
], function(skylark, langx, noder, finder) {
    var some = Array.prototype.some,
        push = Array.prototype.push,
        every = Array.prototype.every,
        concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        map = Array.prototype.map,
        filter = Array.prototype.filter,
        forEach = Array.prototype.forEach,
        indexOf = Array.prototype.indexOf,
        sort = Array.prototype.sort,
        isQ;

    var rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;

    var funcArg = langx.funcArg,
        isArrayLike = langx.isArrayLike,
        isString = langx.isString,
        uniq = langx.uniq,
        isFunction = langx.isFunction;

    var type = langx.type,
        isArray = langx.isArray,

        isWindow = langx.isWindow,

        isDocument = langx.isDocument,

        isObject = langx.isObject,

        isPlainObject = langx.isPlainObject,

        compact = langx.compact,

        flatten = langx.flatten,

        camelCase = langx.camelCase,

        dasherize = langx.dasherize,
        children = finder.children;

    function wrapper_node_operation(func, context, oldValueFunc) {
        return function(html) {
            var argType, nodes = langx.map(arguments, function(arg) {
                argType = type(arg)
                return argType == "function" || argType == "object" || argType == "array" || arg == null ?
                    arg : noder.createFragment(arg)
            });
            if (nodes.length < 1) {
                return this
            }
            this.each(function(idx) {
                func.apply(context, [this, nodes, idx > 0]);
            });
            return this;
        }
    }

    function wrapper_map(func, context) {
        return function() {
            var self = this,
                params = slice.call(arguments);
            var result = langx.map(self, function(elem, idx) {
                return func.apply(context, [elem].concat(params));
            });
            return query(uniq(result));
        }
    }

    function wrapper_selector(func, context, last) {
        return function(selector) {
            var self = this,
                params = slice.call(arguments);
            var result = this.map(function(idx, elem) {
                // if (elem.nodeType == 1) {
                //if (elem.querySelector) {
                    return func.apply(context, last ? [elem] : [elem, selector]);
                //}
            });
            if (last && selector) {
                return result.filter(selector);
            } else {
                return result;
            }
        }
    }

    function wrapper_selector_until(func, context, last) {
        return function(util, selector) {
            var self = this,
                params = slice.call(arguments);
            //if (selector === undefined) { //TODO : needs confirm?
            //    selector = util;
            //    util = undefined;
            //}
            var result = this.map(function(idx, elem) {
                // if (elem.nodeType == 1) { // TODO
                //if (elem.querySelector) {
                    return func.apply(context, last ? [elem, util] : [elem, selector, util]);
                //}
            });
            if (last && selector) {
                return result.filter(selector);
            } else {
                return result;
            }
        }
    }


    function wrapper_every_act(func, context) {
        return function() {
            var self = this,
                params = slice.call(arguments);
            this.each(function(idx,node) {
                func.apply(context, [this].concat(params));
            });
            return self;
        }
    }

    function wrapper_every_act_firstArgFunc(func, context, oldValueFunc) {
        return function(arg1) {
            var self = this,
                params = slice.call(arguments);
            forEach.call(self, function(elem, idx) {
                var newArg1 = funcArg(elem, arg1, idx, oldValueFunc(elem));
                func.apply(context, [elem, arg1].concat(params.slice(1)));
            });
            return self;
        }
    }

    function wrapper_some_chk(func, context) {
        return function() {
            var self = this,
                params = slice.call(arguments);
            return some.call(self, function(elem) {
                return func.apply(context, [elem].concat(params));
            });
        }
    }

    function wrapper_name_value(func, context, oldValueFunc) {
        return function(name, value) {
            var self = this,
                params = slice.call(arguments);

            if (langx.isPlainObject(name) || langx.isDefined(value)) {
                forEach.call(self, function(elem, idx) {
                    var newValue;
                    if (oldValueFunc) {
                        newValue = funcArg(elem, value, idx, oldValueFunc(elem, name));
                    } else {
                        newValue = value
                    }
                    func.apply(context, [elem].concat(params));
                });
                return self;
            } else {
                if (self[0]) {
                    return func.apply(context, [self[0], name]);
                }
            }

        }
    }

    function wrapper_value(func, context, oldValueFunc) {
        return function(value) {
            var self = this;

            if (langx.isDefined(value)) {
                forEach.call(self, function(elem, idx) {
                    var newValue;
                    if (oldValueFunc) {
                        newValue = funcArg(elem, value, idx, oldValueFunc(elem));
                    } else {
                        newValue = value
                    }
                    func.apply(context, [elem, newValue]);
                });
                return self;
            } else {
                if (self[0]) {
                    return func.apply(context, [self[0]]);
                }
            }

        }
    }

    var NodeList = langx.klass({
        klassName: "SkNodeList",
        init: function(selector, context) {
            var self = this,
                match, nodes, node, props;

            if (selector) {
                self.context = context = context || noder.doc();

                if (isString(selector)) {
                    // a html string or a css selector is expected
                    self.selector = selector;

                    if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                        match = [null, selector, null];
                    } else {
                        match = rquickExpr.exec(selector);
                    }

                    if (match) {
                        if (match[1]) {
                            // if selector is html
                            nodes = noder.createFragment(selector);

                            if (langx.isPlainObject(context)) {
                                props = context;
                            }

                        } else {
                            node = finder.byId(match[2], noder.ownerDoc(context));

                            if (node) {
                                // if selector is id
                                nodes = [node];
                            }

                        }
                    } else {
                        // if selector is css selector
                        if (langx.isString(context)) {
                            context = finder.find(context);
                        }

                        nodes = finder.descendants(context, selector);
                    }
                } else {
                    if (selector !== window && isArrayLike(selector)) {
                        // a dom node array is expected
                        nodes = selector;
                    } else {
                        // a dom node is expected
                        nodes = [selector];
                    }
                    //self.add(selector, false);
                }
            }


            if (nodes) {

                push.apply(self, nodes);

                if (props) {
                    for ( var name  in props ) {
                        // Properties of context are called as methods if possible
                        if ( langx.isFunction( this[ name ] ) ) {
                            this[ name ]( props[ name ] );
                        } else {
                            this.attr( name, props[ name ] );
                        }
                    }
                }
            }

            return self;
        }
    });

    var query = (function() {
        isQ = function(object) {
            return object instanceof NodeList;
        }
        init = function(selector, context) {
            return new NodeList(selector, context);
        }

        var $ = function(selector, context) {
            if (isFunction(selector)) {
                $.ready(function() {
                    selector($);
                });
            } else if (isQ(selector)) {
                return selector;
            } else {
                if (context && isQ(context) && isString(selector)) {
                    return context.find(selector);
                }
                return init(selector, context);
            }
        };

        $.fn = NodeList.prototype;
        langx.mixin($.fn, {
            // `map` and `slice` in the jQuery API work differently
            // from their array counterparts
            length : 0,

            map: function(fn) {
                return $(uniq(langx.map(this, function(el, i) {
                    return fn.call(el, i, el)
                })));
            },

            slice: function() {
                return $(slice.apply(this, arguments))
            },

            forEach: function() {
                return forEach.apply(this,arguments);
            },

            get: function(idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
            },

            indexOf: function() {
                return indexOf.apply(this,arguments);
            },

            sort : function() {
                return sort.apply(this,arguments);
            },

            toArray: function() {
                return slice.call(this);
            },

            size: function() {
                return this.length
            },

            //remove: wrapper_every_act(noder.remove, noder),
            remove : function(selector) {
                if (selector) {
                    return this.find(selector).remove();
                }
                this.each(function(i,node){
                    noder.remove(node);
                });
                return this;
            },

            each: function(callback) {
                langx.each(this, callback);
                return this;
            },

            filter: function(selector) {
                if (isFunction(selector)) return this.not(this.not(selector))
                return $(filter.call(this, function(element) {
                    return finder.matches(element, selector)
                }))
            },

            add: function(selector, context) {
                return $(uniq(this.toArray().concat($(selector, context).toArray())));
            },

            is: function(selector) {
                if (this.length > 0) {
                    var self = this;
                    if (langx.isString(selector)) {
                        return some.call(self,function(elem) {
                            return finder.matches(elem, selector);
                        });
                    } else if (langx.isArrayLike(selector)) {
                       return some.call(self,function(elem) {
                            return langx.inArray(elem, selector) > -1;
                        });
                    } else if (langx.isHtmlNode(selector)) {
                       return some.call(self,function(elem) {
                            return elem ==  selector;
                        });
                    }
                }
                return false;
            },
            
            not: function(selector) {
                var nodes = []
                if (isFunction(selector) && selector.call !== undefined)
                    this.each(function(idx,node) {
                        if (!selector.call(this, idx,node)) nodes.push(this)
                    })
                else {
                    var excludes = typeof selector == 'string' ? this.filter(selector) :
                        (isArrayLike(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                    this.forEach(function(el) {
                        if (excludes.indexOf(el) < 0) nodes.push(el)
                    })
                }
                return $(nodes)
            },

            has: function(selector) {
                return this.filter(function() {
                    return isObject(selector) ?
                        noder.contains(this, selector) :
                        $(this).find(selector).size()
                })
            },

            eq: function(idx) {
                return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
            },

            first: function() {
                return this.eq(0);
            },

            last: function() {
                return this.eq(-1);
            },

            find: wrapper_selector(finder.descendants, finder),

            closest: wrapper_selector(finder.closest, finder),
            /*
                        closest: function(selector, context) {
                            var node = this[0],
                                collection = false
                            if (typeof selector == 'object') collection = $(selector)
                            while (node && !(collection ? collection.indexOf(node) >= 0 : finder.matches(node, selector)))
                                node = node !== context && !isDocument(node) && node.parentNode
                            return $(node)
                        },
            */


            parents: wrapper_selector(finder.ancestors, finder),

            parentsUntil: wrapper_selector_until(finder.ancestors, finder),


            parent: wrapper_selector(finder.parent, finder),

            children: wrapper_selector(finder.children, finder),

            contents: wrapper_map(noder.contents, noder),

            empty: wrapper_every_act(noder.empty, noder),

            html: wrapper_value(noder.html, noder),

            // `pluck` is borrowed from Prototype.js
            pluck: function(property) {
                return langx.map(this, function(el) {
                    return el[property]
                })
            },

            pushStack : function(elms) {
                var ret = $(elms);
                ret.prevObject = this;
                return ret;
            },
            
            replaceWith: function(newContent) {
                return this.before(newContent).remove();
            },

            wrap: function(structure) {
                var func = isFunction(structure)
                if (this[0] && !func)
                    var dom = $(structure).get(0),
                        clone = dom.parentNode || this.length > 1

                return this.each(function(index,node) {
                    $(this).wrapAll(
                        func ? structure.call(this, index,node) :
                        clone ? dom.cloneNode(true) : dom
                    )
                })
            },

            wrapAll: function(wrappingElement) {
                if (this[0]) {
                    $(this[0]).before(wrappingElement = $(wrappingElement));
                    var children;
                    // drill down to the inmost element
                    while ((children = wrappingElement.children()).length) {
                        wrappingElement = children.first();
                    }
                    $(wrappingElement).append(this);
                }
                return this
            },

            wrapInner: function(wrappingElement) {
                var func = isFunction(wrappingElement)
                return this.each(function(index,node) {
                    var self = $(this),
                        contents = self.contents(),
                        dom = func ? wrappingElement.call(this, index,node) : wrappingElement
                    contents.length ? contents.wrapAll(dom) : self.append(dom)
                })
            },

            unwrap: function(selector) {
                if (this.parent().children().length === 0) {
                    // remove dom without text
                    this.parent(selector).not("body").each(function() {
                        $(this).replaceWith(document.createTextNode(this.childNodes[0].textContent));
                    });
                } else {
                    this.parent().each(function() {
                        $(this).replaceWith($(this).children())
                    });
                }
                return this
            },

            clone: function() {
                return this.map(function() {
                    return this.cloneNode(true)
                })
            },


            toggle: function(setting) {
                return this.each(function() {
                    var el = $(this);
                    (setting === undefined ? el.css("display") == "none" : setting) ? el.show(): el.hide()
                })
            },

            prev: function(selector) {
                return $(this.pluck('previousElementSibling')).filter(selector || '*')
            },

            prevAll: wrapper_selector(finder.previousSiblings, finder),

            next: function(selector) {
                return $(this.pluck('nextElementSibling')).filter(selector || '*')
            },

            nextAll: wrapper_selector(finder.nextSiblings, finder),

            siblings: wrapper_selector(finder.siblings, finder),

            index: function(elem) {
                if (elem) {
                    return this.indexOf($(elem)[0]);
                } else {
                    return this.parent().children().indexOf(this[0]);
                }
            }
        });

        // for now
        $.fn.detach = $.fn.remove;

        $.fn.hover = function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        };


        var traverseNode = noder.traverse;


        $.fn.after = wrapper_node_operation(noder.after, noder);

        $.fn.prepend = wrapper_node_operation(noder.prepend, noder);

        $.fn.before = wrapper_node_operation(noder.before, noder);

        $.fn.append = wrapper_node_operation(noder.append, noder);


        langx.each( {
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function( name, original ) {
            $.fn[ name ] = function( selector ) {
                var elems,
                    ret = [],
                    insert = $( selector ),
                    last = insert.length - 1,
                    i = 0;

                for ( ; i <= last; i++ ) {
                    elems = i === last ? this : this.clone( true );
                    $( insert[ i ] )[ original ]( elems );

                    // Support: Android <=4.0 only, PhantomJS 1 only
                    // .get() because push.apply(_, arraylike) throws on ancient WebKit
                    push.apply( ret, elems.get() );
                }

                return this.pushStack( ret );
            };
        } );

/*
        $.fn.insertAfter = function(html) {
            $(html).after(this);
            return this;
        };

        $.fn.insertBefore = function(html) {
            $(html).before(this);
            return this;
        };

        $.fn.appendTo = function(html) {
            $(html).append(this);
            return this;
        };

        $.fn.prependTo = function(html) {
            $(html).prepend(this);
            return this;
        };

        $.fn.replaceAll = function(selector) {
            $(selector).replaceWith(this);
            return this;
        };
*/
        return $;
    })();

    (function($) {
        $.fn.scrollParent = function( includeHidden ) {
            var position = this.css( "position" ),
                excludeStaticParent = position === "absolute",
                overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                scrollParent = this.parents().filter( function() {
                    var parent = $( this );
                    if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                        return false;
                    }
                    return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
                        parent.css( "overflow-x" ) );
                } ).eq( 0 );

            return position === "fixed" || !scrollParent.length ?
                $( this[ 0 ].ownerDocument || document ) :
                scrollParent;
        };

    })(query);


    (function($) {
        $.fn.end = function() {
            return this.prevObject || $()
        }

        $.fn.andSelf = function() {
            return this.add(this.prevObject || $())
        }

        $.fn.addBack = function(selector) {
            if (this.prevObject) {
                if (selector) {
                    return this.add(this.prevObject.filter(selector));
                } else {
                    return this.add(this.prevObject);
                }
            } else {
                return this;
            }
        }

        'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings,prev,prevAll,next,nextAll'.split(',').forEach(function(property) {
            var fn = $.fn[property]
            $.fn[property] = function() {
                var ret = fn.apply(this, arguments)
                ret.prevObject = this
                return ret
            }
        })
    })(query);


    (function($) {
        $.fn.query = $.fn.find;

        $.fn.place = function(refNode, position) {
            // summary:
            //      places elements of this node list relative to the first element matched
            //      by queryOrNode. Returns the original NodeList. See: `dojo/dom-construct.place`
            // queryOrNode:
            //      may be a string representing any valid CSS3 selector or a DOM node.
            //      In the selector case, only the first matching element will be used
            //      for relative positioning.
            // position:
            //      can be one of:
            //
            //      -   "last" (default)
            //      -   "first"
            //      -   "before"
            //      -   "after"
            //      -   "only"
            //      -   "replace"
            //
            //      or an offset in the childNodes
            if (langx.isString(refNode)) {
                refNode = finder.descendant(refNode);
            } else if (isQ(refNode)) {
                refNode = refNode[0];
            }
            return this.each(function(i, node) {
                switch (position) {
                    case "before":
                        noder.before(refNode, node);
                        break;
                    case "after":
                        noder.after(refNode, node);
                        break;
                    case "replace":
                        noder.replace(refNode, node);
                        break;
                    case "only":
                        noder.empty(refNode);
                        noder.append(refNode, node);
                        break;
                    case "first":
                        noder.prepend(refNode, node);
                        break;
                        // else fallthrough...
                    default: // aka: last
                        noder.append(refNode, node);
                }
            });
        };

        $.fn.addContent = function(content, position) {
            if (content.template) {
                content = langx.substitute(content.template, content);
            }
            return this.append(content);
        };



        $.fn.disableSelection = ( function() {
            var eventType = "onselectstart" in document.createElement( "div" ) ?
                "selectstart" :
                "mousedown";

            return function() {
                return this.on( eventType + ".ui-disableSelection", function( event ) {
                    event.preventDefault();
                } );
            };
        } )();

        $.fn.enableSelection = function() {
            return this.off( ".ui-disableSelection" );
        };

        $.fn.reflow = function() {
            return noder.flow(this[0]);
        };

        $.fn.isBlockNode = function() {
            return noder.isBlockNode(this[0]);
        };
       

    })(query);

    query.fn.plugin = function(name,options) {
        var args = slice.call( arguments, 1 ),
            self = this,
            returnValue = this;

        this.each(function(){
            returnValue = plugins.instantiate.apply(self,[this,name].concat(args));
        });
        return returnValue;
    };


    query.wraps = {
        wrapper_node_operation,
        wrapper_map,
        wrapper_value,
        wrapper_selector,
        wrapper_some_chk,
        wrapper_selector_until,
        wrapper_every_act_firstArgFunc,
        wrapper_every_act,
        wrapper_name_value

    };

    return skylark.attach("domx.query", query);

});
define('skylark-domx-query/main',[
	"./query"
],function(query){
	return query;
});
define('skylark-domx-query', ['skylark-domx-query/main'], function (main) { return main; });

define('skylark-domx-data/data',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-finder",
    "skylark-domx-noder"
], function(skylark, langx, finder,noder) {
    var map = Array.prototype.map,
        filter = Array.prototype.filter,
        camelCase = langx.camelCase,
        deserializeValue = langx.deserializeValue,

        capitalRE = /([A-Z])/g,
        propMap = {
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        };

    // Strip and collapse whitespace according to HTML spec
    function stripAndCollapse( value ) {
      var tokens = value.match( /[^\x20\t\r\n\f]+/g ) || [];
      return tokens.join( " " );
    }


    var valHooks = {
      option: {
        get: function( elem ) {
          var val = elem.getAttribute( "value" );
          return val != null ?  val :  stripAndCollapse(text( elem ) );
        }
      },
      select: {
        get: function( elem ) {
          var value, option, i,
            options = elem.options,
            index = elem.selectedIndex,
            one = elem.type === "select-one",
            values = one ? null : [],
            max = one ? index + 1 : options.length;

          if ( index < 0 ) {
            i = max;

          } else {
            i = one ? index : 0;
          }

          // Loop through all the selected options
          for ( ; i < max; i++ ) {
            option = options[ i ];

            if ( option.selected &&

                // Don't return options that are disabled or in a disabled optgroup
                !option.disabled &&
                ( !option.parentNode.disabled ||
                  !noder.nodeName( option.parentNode, "optgroup" ) ) ) {

              // Get the specific value for the option
              value = val(option);

              // We don't need an array for one selects
              if ( one ) {
                return value;
              }

              // Multi-Selects return an array
              values.push( value );
            }
          }

          return values;
        },

        set: function( elem, value ) {
          var optionSet, option,
            options = elem.options,
            values = langx.makeArray( value ),
            i = options.length;

          while ( i-- ) {
            option = options[ i ];

            /* eslint-disable no-cond-assign */

            if ( option.selected =
              langx.inArray( valHooks.option.get( option ), values ) > -1
            ) {
              optionSet = true;
            }

            /* eslint-enable no-cond-assign */
          }

          // Force browsers to behave consistently when non-matching value is set
          if ( !optionSet ) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    };


    // Radios and checkboxes getter/setter
    langx.each( [ "radio", "checkbox" ], function() {
      valHooks[ this ] = {
        set: function( elem, value ) {
          if ( langx.isArray( value ) ) {
            return ( elem.checked = langx.inArray( val(elem), value ) > -1 );
          }
        }
      };
    });



    /*
     * Set property values
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */

    function setAttribute(elm, name, value) {
        if (value == null) {
            elm.removeAttribute(name);
        } else {
            elm.setAttribute(name, value);
        }
    }

    function aria(elm, name, value) {
        return this.attr(elm, "aria-" + name, value);
    }

    /*
     * Set property values
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */

    function attr(elm, name, value) {
        if (value === undefined) {
            if (typeof name === "object") {
                for (var attrName in name) {
                    attr(elm, attrName, name[attrName]);
                }
                return this;
            } else {
                if (elm.hasAttribute && elm.hasAttribute(name)) {
                    return elm.getAttribute(name);
                }
            }
        } else {
            elm.setAttribute(name, value);
            return this;
        }
    }


    /*
     *  Read all "data-*" attributes from a node
     * @param {Object} elm  
     */

    function _attributeData(elm) {
        var store = {}
        langx.each(elm.attributes || [], function(i, attr) {
            if (attr.name.indexOf('data-') == 0) {
                store[camelCase(attr.name.replace('data-', ''))] = deserializeValue(attr.value);
            }
        })
        return store;
    }

    function _store(elm, confirm) {
        var store = elm["_$_store"];
        if (!store && confirm) {
            store = elm["_$_store"] = _attributeData(elm);
        }
        return store;
    }

    function _getData(elm, name) {
        if (name === undefined) {
            return _store(elm, true);
        } else {
            var store = _store(elm);
            if (store) {
                if (name in store) {
                    return store[name];
                }
                var camelName = camelCase(name);
                if (camelName in store) {
                    return store[camelName];
                }
            }
            var attrName = 'data-' + name.replace(capitalRE, "-$1").toLowerCase()
            return attr(elm, attrName);
        }

    }

    function _setData(elm, name, value) {
        var store = _store(elm, true);
        store[camelCase(name)] = value;
    }


    /*
     * xxx
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */
    function data(elm, name, value) {

        if (value === undefined) {
            if (typeof name === "object") {
                for (var dataAttrName in name) {
                    _setData(elm, dataAttrName, name[dataAttrName]);
                }
                return this;
            } else {
                return _getData(elm, name);
            }
        } else {
            _setData(elm, name, value);
            return this;
        }
    } 
    /*
     * Remove from the element all items that have not yet been run. 
     * @param {Object} elm  
     */

    function cleanData(elm) {
        if (elm["_$_store"]) {
            delete elm["_$_store"];
        }
    }

    /*
     * Remove a previously-stored piece of data. 
     * @param {Object} elm  
     * @param {Array} names
     */
    function removeData(elm, names) {
        if (names) {
            if (langx.isString(names)) {
                names = names.split(/\s+/);
            }
            var store = _store(elm, true);
            names.forEach(function(name) {
                delete store[name];
            });            
        } else {
            cleanData(elm);
        }
        return this;
    }

    /*
     * xxx 
     * @param {Object} elm  
     * @param {Array} names
     */
    function pluck(nodes, property) {
        return map.call(nodes, function(elm) {
            return elm[property];
        });
    }

    /*
     * Get or set the value of an property for the specified element.
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */
    function prop(elm, name, value) {
        name = propMap[name] || name;
        if (value === undefined) {
            return elm[name];
        } else {
            elm[name] = value;
            return this;
        }
    }

    /*
     * remove Attributes  
     * @param {Object} elm  
     * @param {String} name
     */
    function removeAttr(elm, name) {
        name.split(' ').forEach(function(attr) {
            setAttribute(elm, attr);
        });
        return this;
    }


    /*
     * Remove the value of a property for the first element in the set of matched elements or set one or more properties for every matched element.
     * @param {Object} elm  
     * @param {String} name
     */
    function removeProp(elm, name) {
        name.split(' ').forEach(function(prop) {
            delete elm[prop];
        });
        return this;
    }

    /*   
     * Get the combined text contents of each element in the set of matched elements, including their descendants, or set the text contents of the matched elements.  
     * @param {Object} elm  
     * @param {String} txt
     */
    function text(elm, txt) {
        if (txt === undefined) {
            return elm.textContent;
        } else {
            elm.textContent = txt == null ? '' : '' + txt;
            return this;
        }
    }

    /*   
     * Get the current value of the first element in the set of matched elements or set the value of every matched element.
     * @param {Object} elm  
     * @param {String} value
     */
    function val(elm, value) {
        var hooks = valHooks[ elm.type ] || valHooks[ elm.nodeName.toLowerCase() ];
        if (value === undefined) {
/*
            if (elm.multiple) {
                // select multiple values
                var selectedOptions = filter.call(finder.find(elm, "option"), (function(option) {
                    return option.selected;
                }));
                return pluck(selectedOptions, "value");
            } else {
                if (/input|textarea/i.test(elm.tagName)) {
                  return elm.value;
                }
                return text(elm);
            }
*/

          if ( hooks &&  "get" in hooks &&  ( ret = hooks.get( elm, "value" ) ) !== undefined ) {
            return ret;
          }

          ret = elm.value;

          // Handle most common string cases
          if ( typeof ret === "string" ) {
            return ret.replace( /\r/g, "" );
          }

          // Handle cases where value is null/undef or number
          return ret == null ? "" : ret;

        } else {
/*          
            if (/input|textarea/i.test(elm.tagName)) {
              elm.value = value;
            } else {
              text(elm,value);
            }
            return this;
*/
          // Treat null/undefined as ""; convert numbers to string
          if ( value == null ) {
            value = "";

          } else if ( typeof value === "number" ) {
            value += "";

          } else if ( langx.isArray( value ) ) {
            value = langx.map( value, function( value1 ) {
              return value1 == null ? "" : value1 + "";
            } );
          }

          // If set returns undefined, fall back to normal setting
          if ( !hooks || !( "set" in hooks ) || hooks.set( elm, value, "value" ) === undefined ) {
            elm.value = value;
          }
        }      
    }


    finder.pseudos.data = function( elem, i, match,dataName ) {
        return !!data( elem, dataName || match[3]);
    };
   

    function datax() {
        return datax;
    }

    langx.mixin(datax, {
        aria: aria,

        attr: attr,

        cleanData: cleanData,

        data: data,

        pluck: pluck,

        prop: prop,

        removeAttr: removeAttr,

        removeData: removeData,

        removeProp: removeProp,

        text: text,

        val: val,

        valHooks : valHooks
    });

    return skylark.attach("domx.data", datax);
});
define('skylark-domx-velm/velm',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-finder",
    "skylark-domx-query"
], function(skylark, langx, noder, finder, $) {
    var map = Array.prototype.map,
        slice = Array.prototype.slice;
    /*
     * VisualElement is a skylark class type wrapping a visule dom node,
     * provides a number of prototype methods and supports chain calls.
     */
    var VisualElement = langx.klass({
        klassName: "VisualElement",

        "_construct": function(node) {
            if (langx.isString(node)) {
                if (node.charAt(0) === "<") {
                    //html
                    node = noder.createFragment(node)[0];
                } else {
                    // id
                    node = document.getElementById(node);
                }
            }
            this._elm = node;
        }
    });

    VisualElement.prototype.$ = VisualElement.prototype.query = function(selector) {
        return $(selector,this._elm);
    };

    VisualElement.prototype.elm = function() {
        return this._elm;
    };

    /*
     * the VisualElement object wrapping document.body
     */
    var root = new VisualElement(document.body),
        velm = function(node) {
            if (node) {
                return new VisualElement(node);
            } else {
                return root;
            }
        };
    /*
     * Extend VisualElement prototype with wrapping the specified methods.
     * @param {ArrayLike} fn
     * @param {Object} context
     */
    function _delegator(fn, context) {
        return function() {
            var self = this,
                elem = self._elm,
                ret = fn.apply(context, [elem].concat(slice.call(arguments)));

            if (ret) {
                if (ret === context) {
                    return self;
                } else {
                    if (ret instanceof HTMLElement) {
                        ret = new VisualElement(ret);
                    } else if (langx.isArrayLike(ret)) {
                        ret = map.call(ret, function(el) {
                            if (el instanceof HTMLElement) {
                                return new VisualElement(el);
                            } else {
                                return el;
                            }
                        })
                    }
                }
            }
            return ret;
        };
    }

    langx.mixin(velm, {
        batch: function(nodes, action, args) {
            nodes.forEach(function(node) {
                var elm = (node instanceof VisualElement) ? node : velm(node);
                elm[action].apply(elm, args);
            });

            return this;
        },

        root: new VisualElement(document.body),

        VisualElement: VisualElement,

        partial: function(name, fn) {
            var props = {};

            props[name] = fn;

            VisualElement.partial(props);
        },

        delegate: function(names, context) {
            var props = {};

            names.forEach(function(name) {
                props[name] = _delegator(context[name], context);
            });

            VisualElement.partial(props);
        }
    });

    // from ./finder
    velm.delegate([
        "ancestor",
        "ancestors",
        "children",
        "descendant",
        "find",
        "findAll",
        "firstChild",
        "lastChild",
        "matches",
        "nextSibling",
        "nextSiblings",
        "parent",
        "previousSibling",
        "previousSiblings",
        "siblings"
    ], finder);

    /*
     * find a dom element matched by the specified selector.
     * @param {String} selector
     */
    velm.find = function(selector) {
        if (selector === "body") {
            return this.root;
        } else {
            return this.root.descendant(selector);
        }
    };


    // from ./noder
    velm.delegate([
        "after",
        "append",
        "before",
        "clone",
        "contains",
        "contents",
        "empty",
        "html",
        "isChildOf",
        "isDocument",
        "isInDocument",
        "isWindow",
        "ownerDoc",
        "prepend",
        "remove",
        "removeChild",
        "replace",
        "reverse",
        "throb",
        "traverse",
        "wrapper",
        "wrapperInner",
        "unwrap"
    ], noder);


    return skylark.attach("domx.velm", velm);
});
define('skylark-domx-velm/main',[
	"./velm"
],function(velm){
	return velm;
});
define('skylark-domx-velm', ['skylark-domx-velm/main'], function (main) { return main; });

define('skylark-domx-data/main',[
    "./data",
    "skylark-domx-velm",
    "skylark-domx-query"    
],function(data,velm,$){
    // from ./data
    velm.delegate([
        "attr",
        "data",
        "prop",
        "removeAttr",
        "removeData",
        "text",
        "val"
    ], data);

    $.fn.text = $.wraps.wrapper_value(data.text, data, data.text);

    $.fn.attr = $.wraps.wrapper_name_value(data.attr, data, data.attr);

    $.fn.removeAttr = $.wraps.wrapper_every_act(data.removeAttr, data);

    $.fn.prop = $.wraps.wrapper_name_value(data.prop, data, data.prop);

    $.fn.removeProp = $.wraps.wrapper_every_act(data.removeProp, data);

    $.fn.data = $.wraps.wrapper_name_value(data.data, data, data.data);

    $.fn.removeData = $.wraps.wrapper_every_act(data.removeData, data);

    $.fn.val = $.wraps.wrapper_value(data.val, data, data.val);


    return data;
});
define('skylark-domx-data', ['skylark-domx-data/main'], function (main) { return main; });

define('skylark-domx-contents/contents',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data"
], function(skylark, langx, noder,datax) {
    "use strict";

    var contents = function() {
        return contents;
    };


    return skylark.attach("domx.contents",contents);

});
define('skylark-domx-contents/Hotkeys',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 


  var Hotkeys = langx.Evented.inherit({

  });


  Hotkeys.count = 0;

  Hotkeys.keyNameMap = {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Esc",
    32: "Spacebar",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    45: "Insert",
    46: "Del",
    91: "Meta",
    93: "Meta",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    96: "0",
    97: "1",
    98: "2",
    99: "3",
    100: "4",
    101: "5",
    102: "6",
    103: "7",
    104: "8",
    105: "9",
    106: "Multiply",
    107: "Add",
    109: "Subtract",
    110: "Decimal",
    111: "Divide",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",
    59: ";",
    61: "=",
    186: ";",
    187: "=",
    188: ",",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
  };

  Hotkeys.aliases = {
    "escape": "esc",
    "delete": "del",
    "return": "enter",
    "ctrl": "control",
    "space": "spacebar",
    "ins": "insert",
    "cmd": "meta",
    "command": "meta",
    "wins": "meta",
    "windows": "meta"
  };

  Hotkeys.normalize = function(shortcut) {
    var i, j, key, keyname, keys, len;
    keys = shortcut.toLowerCase().replace(/\s+/gi, "").split("+");
    for (i = j = 0, len = keys.length; j < len; i = ++j) {
      key = keys[i];
      keys[i] = this.aliases[key] || key;
    }
    keyname = keys.pop();
    keys.sort().push(keyname);
    return keys.join("_");
  };

  Hotkeys.prototype.opts = {
    el: document
  };

  Hotkeys.prototype.init = function() {
    this.id = ++this.constructor.count;
    this._map = {};
    this._delegate = typeof this.opts.el === "string" ? document : this.opts.el;
    $(this._delegate).on("keydown.simple-hotkeys-" + this.id, this.opts.el, (function(_this) {
      return function(e) {
        var ref;
        return (ref = _this._getHander(e)) != null ? ref.call(_this, e) : void 0;
      };
    })(this));
  };

  Hotkeys.prototype._getHander = function(e) {
    var keyname, shortcut;
    if (!(keyname = this.constructor.keyNameMap[e.which])) {
      return;
    }
    shortcut = "";
    if (e.altKey) {
      shortcut += "alt_";
    }
    if (e.ctrlKey) {
      shortcut += "control_";
    }
    if (e.metaKey) {
      shortcut += "meta_";
    }
    if (e.shiftKey) {
      shortcut += "shift_";
    }
    shortcut += keyname.toLowerCase();
    return this._map[shortcut];
  };

  Hotkeys.prototype.respondTo = function(subject) {
    if (typeof subject === 'string') {
      return this._map[this.constructor.normalize(subject)] != null;
    } else {
      return this._getHander(subject) != null;
    }
  };

  Hotkeys.prototype.add = function(shortcut, handler) {
    this._map[this.constructor.normalize(shortcut)] = handler;
    return this;
  };

  Hotkeys.prototype.remove = function(shortcut) {
    delete this._map[this.constructor.normalize(shortcut)];
    return this;
  };

  Hotkeys.prototype.destroy = function() {
    $(this._delegate).off(".simple-hotkeys-" + this.id);
    this._map = {};
    return this;
  };

  return  contents.Hotkeys = Hotkeys;

});


define('skylark-domx-contents/Util',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Util = langx.Evented.inherit({
    init : function(editor,opts) {
      this.editor = editor; // this._module;
      this.opts = langx.extend({}, this.opts, opts);
      if (this.browser.msie && this.browser.version < 11) {
        return this.phBr = '';
      }
    }

  });

  Util.pluginName = 'Util';

  Util.prototype.phBr = '<br/>';

  Util.prototype.os = (function() {
    var os;
    os = {};
    if (/Mac/.test(navigator.appVersion)) {
      os.mac = true;
    } else if (/Linux/.test(navigator.appVersion)) {
      os.linux = true;
    } else if (/Win/.test(navigator.appVersion)) {
      os.win = true;
    } else if (/X11/.test(navigator.appVersion)) {
      os.unix = true;
    }
    if (/Mobi/.test(navigator.appVersion)) {
      os.mobile = true;
    }
    return os;
  })();

  Util.prototype.browser = (function() {
    var chrome, edge, firefox, ie, ref, ref1, ref2, ref3, ref4, safari, ua;
    ua = navigator.userAgent;
    ie = /(msie|trident)/i.test(ua);
    chrome = /chrome|crios/i.test(ua);
    safari = /safari/i.test(ua) && !chrome;
    firefox = /firefox/i.test(ua);
    edge = /edge/i.test(ua);
    if (ie) {
      return {
        msie: true,
        version: ((ref = ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)) != null ? ref[2] : void 0) * 1
      };
    } else if (edge) {
      return {
        edge: true,
        webkit: true,
        version: ((ref1 = ua.match(/edge\/(\d+(\.\d+)?)/i)) != null ? ref1[1] : void 0) * 1
      };
    } else if (chrome) {
      return {
        webkit: true,
        chrome: true,
        version: ((ref2 = ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)) != null ? ref2[1] : void 0) * 1
      };
    } else if (safari) {
      return {
        webkit: true,
        safari: true,
        version: ((ref3 = ua.match(/version\/(\d+(\.\d+)?)/i)) != null ? ref3[1] : void 0) * 1
      };
    } else if (firefox) {
      return {
        mozilla: true,
        firefox: true,
        version: ((ref4 = ua.match(/firefox\/(\d+(\.\d+)?)/i)) != null ? ref4[1] : void 0) * 1
      };
    } else {
      return {};
    }
  })();

  Util.prototype.support = (function() {
    return {
      onselectionchange: (function() {
        var e, onselectionchange;
        onselectionchange = document.onselectionchange;
        if (onselectionchange !== void 0) {
          try {
            document.onselectionchange = 0;
            return document.onselectionchange === null;
          } catch (_error) {
            e = _error;
          } finally {
            document.onselectionchange = onselectionchange;
          }
        }
        return false;
      })(),
      oninput: (function() {
        return !/(msie|trident)/i.test(navigator.userAgent);
      })()
    };
  })();

  Util.prototype.reflow = function(el) {
    if (el == null) {
      el = document;
    }
    return $(el)[0].offsetHeight;
  };

  Util.prototype.metaKey = function(e) {
    var isMac;
    isMac = /Mac/.test(navigator.userAgent);
    if (isMac) {
      return e.metaKey;
    } else {
      return e.ctrlKey;
    }
  };

  Util.prototype.isEmptyNode = function(node) {
    var $node;
    $node = $(node);
    return $node.is(':empty') || (!$node.text() && !$node.find(':not(br, span, div)').length);
  };

  Util.prototype.isDecoratedNode = function(node) {
    return $(node).is('[class^="' + this.opts.classPrefix + '"]');
  };

  Util.prototype.blockNodes = ["div", "p", "ul", "ol", "li", "blockquote", "hr", "pre", "h1", "h2", "h3", "h4", "h5", "table"];

  Util.prototype.isBlockNode = function(node) {
    node = $(node)[0];
    if (!node || node.nodeType === 3) {
      return false;
    }
    return new RegExp("^(" + (this.blockNodes.join('|')) + ")$").test(node.nodeName.toLowerCase());
  };

  Util.prototype.getNodeLength = function(node) {
    node = $(node)[0];
    switch (node.nodeType) {
      case 7:
      case 10:
        return 0;
      case 3:
      case 8:
        return node.length;
      default:
        return node.childNodes.length;
    }
  };

  Util.prototype.dataURLtoBlob = function(dataURL) {
    var BlobBuilder, arrayBuffer, bb, blobArray, byteString, hasArrayBufferViewSupport, hasBlobConstructor, i, intArray, k, mimeString, ref, supportBlob;
    hasBlobConstructor = window.Blob && (function() {
      var e;
      try {
        return Boolean(new Blob());
      } catch (_error) {
        e = _error;
        return false;
      }
    })();
    hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && (function() {
      var e;
      try {
        return new Blob([new Uint8Array(100)]).size === 100;
      } catch (_error) {
        e = _error;
        return false;
      }
    })();
    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    supportBlob = hasBlobConstructor || BlobBuilder;
    if (!(supportBlob && window.atob && window.ArrayBuffer && window.Uint8Array)) {
      return false;
    }
    if (dataURL.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURL.split(',')[1]);
    } else {
      byteString = decodeURIComponent(dataURL.split(',')[1]);
    }
    arrayBuffer = new ArrayBuffer(byteString.length);
    intArray = new Uint8Array(arrayBuffer);
    for (i = k = 0, ref = byteString.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      intArray[i] = byteString.charCodeAt(i);
    }
    mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    if (hasBlobConstructor) {
      blobArray = hasArrayBufferViewSupport ? intArray : arrayBuffer;
      return new Blob([blobArray], {
        type: mimeString
      });
    }
    bb = new BlobBuilder();
    bb.append(arrayBuffer);
    return bb.getBlob(mimeString);
  };

  Util.prototype.throttle = function(func, wait) {
    var args, call, ctx, last, rtn, throttled, timeoutID;
    last = 0;
    timeoutID = 0;
    ctx = args = rtn = null;
    call = function() {
      timeoutID = 0;
      last = +new Date();
      rtn = func.apply(ctx, args);
      ctx = null;
      return args = null;
    };
    throttled = function() {
      var delta;
      ctx = this;
      args = arguments;
      delta = new Date() - last;
      if (!timeoutID) {
        if (delta >= wait) {
          call();
        } else {
          timeoutID = setTimeout(call, wait - delta);
        }
      }
      return rtn;
    };
    throttled.clear = function() {
      if (!timeoutID) {
        return;
      }
      clearTimeout(timeoutID);
      return call();
    };
    return throttled;
  };

  Util.prototype.formatHTML = function(html) {
    var cursor, indentString, lastMatch, level, match, re, repeatString, result, str;
    re = /<(\/?)(.+?)(\/?)>/g;
    result = '';
    level = 0;
    lastMatch = null;
    indentString = '  ';
    repeatString = function(str, n) {
      return new Array(n + 1).join(str);
    };
    while ((match = re.exec(html)) !== null) {
      match.isBlockNode = langx.inArray(match[2], this.blockNodes) > -1;
      match.isStartTag = match[1] !== '/' && match[3] !== '/';
      match.isEndTag = match[1] === '/' || match[3] === '/';
      cursor = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
      if ((str = html.substring(cursor, match.index)).length > 0 && langx.trim(str)) {
        result += str;
      }
      if (match.isBlockNode && match.isEndTag && !match.isStartTag) {
        level -= 1;
      }
      if (match.isBlockNode && match.isStartTag) {
        if (!(lastMatch && lastMatch.isBlockNode && lastMatch.isEndTag)) {
          result += '\n';
        }
        result += repeatString(indentString, level);
      }
      result += match[0];
      if (match.isBlockNode && match.isEndTag) {
        result += '\n';
      }
      if (match.isBlockNode && match.isStartTag) {
        level += 1;
      }
      lastMatch = match;
    }
    return langx.trim(result);
  };

  return contents.Util = Util;
});
define('skylark-domx-contents/InputManager',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 
 

  var indexOf = [].indexOf ;

  var InputManager = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable;
      this.opts = langx.extend({}, this.opts, opts);

      var selectAllKey, submitKey;
      this.throttledValueChanged = this.editable.util.throttle((function(_this) {
        return function(params) {
          return setTimeout(function() {
            return _this.editable.trigger('valuechanged', params);
          }, 10);
        };
      })(this), 300);
      this.throttledSelectionChanged = this.editable.util.throttle((function(_this) {
        return function() {
          return _this.editable.trigger('selectionchanged');
        };
      })(this), 50);
      $(document).on('selectionchange.simditor' + this.editable.id, (function(_this) {
        return function(e) {
          var triggerEvent;
          if (!(_this.focused && !_this.editable.clipboard.pasting)) {
            return;
          }
          triggerEvent = function() {
            if (_this._selectionTimer) {
              clearTimeout(_this._selectionTimer);
              _this._selectionTimer = null;
            }
            if (_this.editable.selection._selection.rangeCount > 0) {
              return _this.throttledSelectionChanged();
            } else {
              return _this._selectionTimer = setTimeout(function() {
                _this._selectionTimer = null;
                if (_this.focused) {
                  return triggerEvent();
                }
              }, 10);
            }
          };
          return triggerEvent();
        };
      })(this));
      this.editable.on('valuechanged', (function(_this) {
        return function() {
          var $rootBlocks;
          _this.lastCaretPosition = null;
          $rootBlocks = _this.editable.body.children().filter(function(i, node) {
            return _this.editable.util.isBlockNode(node);
          });
          if (_this.focused && $rootBlocks.length === 0) {
            _this.editable.selection.save();
            _this.editable.formatter.format();
            _this.editable.selection.restore();
          }
          _this.editable.body.find('hr, pre, .' + _this.opts.classPrefix + 'table').each(function(i, el) {
            var $el, formatted;
            $el = $(el);
            if ($el.parent().is('blockquote') || $el.parent()[0] === _this.editable.body[0]) {
              formatted = false;
              if ($el.next().length === 0) {
                $('<p/>').append(_this.editable.util.phBr).insertAfter($el);
                formatted = true;
              }
              if ($el.prev().length === 0) {
                $('<p/>').append(_this.editable.util.phBr).insertBefore($el);
                formatted = true;
              }
              if (formatted) {
                return _this.throttledValueChanged();
              }
            }
          });
          _this.editable.body.find('pre:empty').append(_this.editable.util.phBr);
          if (!_this.editable.util.support.onselectionchange && _this.focused) {
            return _this.throttledSelectionChanged();
          }
        };
      })(this));
      this.editable.body.on('keydown', langx.proxy(this._onKeyDown, this)).on('keypress', langx.proxy(this._onKeyPress, this)).on('keyup', langx.proxy(this._onKeyUp, this)).on('mouseup', langx.proxy(this._onMouseUp, this)).on('focus', langx.proxy(this._onFocus, this)).on('blur', langx.proxy(this._onBlur, this)).on('drop', langx.proxy(this._onDrop, this)).on('input', langx.proxy(this._onInput, this));
      if (this.editable.util.browser.firefox) {
        this.editable.hotkeys.add('cmd+left', (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.editable.selection._selection.modify('move', 'backward', 'lineboundary');
            return false;
          };
        })(this));
        this.editable.hotkeys.add('cmd+right', (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.editable.selection._selection.modify('move', 'forward', 'lineboundary');
            return false;
          };
        })(this));
        selectAllKey = this.editable.util.os.mac ? 'cmd+a' : 'ctrl+a';
        this.editable.hotkeys.add(selectAllKey, (function(_this) {
          return function(e) {
            var $children, firstBlock, lastBlock, range;
            $children = _this.editable.body.children();
            if (!($children.length > 0)) {
              return;
            }
            firstBlock = $children.first().get(0);
            lastBlock = $children.last().get(0);
            range = document.createRange();
            range.setStart(firstBlock, 0);
            range.setEnd(lastBlock, _this.editable.util.getNodeLength(lastBlock));
            _this.editable.selection.range(range);
            return false;
          };
        })(this));
      }
      submitKey = this.editable.util.os.mac ? 'cmd+enter' : 'ctrl+enter';
      this.editable.hotkeys.add(submitKey, (function(_this) {
        return function(e) {
          _this.editable.$el.closest('form').find('button:submit').click();
          return false;
        };
      })(this));
    }

  });

  InputManager.pluginName = 'InputManager';

  InputManager.prototype._modifierKeys = [16, 17, 18, 91, 93, 224];

  InputManager.prototype._arrowKeys = [37, 38, 39, 40];


  InputManager.prototype._onFocus = function(e) {
    if (this.editable.clipboard.pasting) {
      return;
    }
    this.editable.$el.addClass('focus').removeClass('error');
    this.focused = true;
    return setTimeout((function(_this) {
      return function() {
        var $blockEl, range;
        range = _this.editable.selection._selection.getRangeAt(0);
        if (range.startContainer === _this.editable.body[0]) {
          if (_this.lastCaretPosition) {
            _this.editable.undoManager.caretPosition(_this.lastCaretPosition);
          } else {
            $blockEl = _this.editable.body.children().first();
            range = document.createRange();
            _this.editable.selection.setRangeAtStartOf($blockEl, range);
            console.log("aaaaaa");
          }
        }
        _this.lastCaretPosition = null;
        _this.editable.trigger('focus');
        if (!_this.editable.util.support.onselectionchange) {
          return _this.throttledSelectionChanged();
        }
      };
    })(this), 0);
  };

  InputManager.prototype._onBlur = function(e) {
    var ref;
    if (this.editable.clipboard.pasting) {
      return;
    }
    this.editable.$el.removeClass('focus');
    this.editable.sync();
    this.focused = false;
    this.lastCaretPosition = (ref = this.editable.undoManager.currentState()) != null ? ref.caret : void 0;
    return this.editable.trigger('blur');
  };

  InputManager.prototype._onMouseUp = function(e) {
    if (!this.editable.util.support.onselectionchange) {
      return this.throttledSelectionChanged();
    }
  };

  InputManager.prototype._onKeyDown = function(e) {
    var ref, ref1;
    if (this.editable.trigger(e) === false) {
      return false;
    }
    if (this.editable.hotkeys.respondTo(e)) {
      return;
    }
    if (this.editable.keystroke.respondTo(e)) {
      this.throttledValueChanged();
      return false;
    }
    if ((ref = e.which, indexOf.call(this._modifierKeys, ref) >= 0) || (ref1 = e.which, indexOf.call(this._arrowKeys, ref1) >= 0)) {
      return;
    }
    if (this.editable.util.metaKey(e) && e.which === 86) {
      return;
    }
    if (!this.editable.util.support.oninput) {
      this.throttledValueChanged(['typing']);
    }
    return null;
  };

  InputManager.prototype._onKeyPress = function(e) {
    if (this.editable.trigger(e) === false) {
      return false;
    }
  };

  InputManager.prototype._onKeyUp = function(e) {
    var p, ref;
    if (this.editable.trigger(e) === false) {
      return false;
    }
    if (!this.editable.util.support.onselectionchange && (ref = e.which, indexOf.call(this._arrowKeys, ref) >= 0)) {
      this.throttledValueChanged();
      return;
    }
    if ((e.which === 8 || e.which === 46) && this.editable.util.isEmptyNode(this.editable.body)) {
      this.editable.body.empty();
      p = $('<p/>').append(this.editable.util.phBr).appendTo(this.editable.body);
      this.editable.selection.setRangeAtStartOf(p);
    }
  };

  InputManager.prototype._onDrop = function(e) {
    if (this.editable.trigger(e) === false) {
      return false;
    }
    return this.throttledValueChanged();
  };

  InputManager.prototype._onInput = function(e) {
    return this.throttledValueChanged(['oninput']);
  };

  return contents.InputManager = InputManager;

});

define('skylark-domx-contents/Selection',[
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
  "./contents"
],function(langx,noder,$,contents){ 

  var Selection = langx.Evented.inherit({
    _range : null,

    _startNodes : null,

    _endNodes : null,

    _containerNode : null,

    _nodes : null,

    _blockNodes : null,

    _rootNodes : null,

    init : function(editable,opts) {
      var self = this;
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);
      this._selection = document.getSelection();

      this.editable.on('selectionchanged', function(e) {
        console.log("selectionchanged");
        self.reset();
        return self._range = self._selection.getRangeAt(0);
      });

      this.editable.on('blur', function(e) {
        return self.reset();
      });

      this.editable.on('focus', function(e) {
        self.reset();
        return self._range = self._selection.getRangeAt(0);
      });
    },

    reset : function() {
      this._range = null;
      this._startNodes = null;
      this._endNodes = null;
      this._containerNode = null;
      this._nodes = null;
      this._blockNodes = null;

      return this._rootNodes = null;
    },

    clear : function() {
      var e;
      try {
        this._selection.removeAllRanges();
        console.log("clear");
      } catch (_error) {
        e = _error;
      }
      return this.reset();
    },

    range : function(range) {
      var ffOrIE;
      if (range) {
        this.clear();
        this._selection.addRange(range);
        this._range = range;
 //       ffOrIE = this.editable.util.browser.firefox || this.editable.util.browser.msie;
        ffOrIE = langx.hoster.browser.mozilla || langx.hoster.browser.msie;
        if (!this.editable.inputManager.focused && ffOrIE) {
          this.editable.body.focus();
        }
      } else if (!this._range && this.editable.inputManager.focused && this._selection.rangeCount) {
        this._range = this._selection.getRangeAt(0);
      }
      return this._range;
    },

    startNodes : function() {
      if (this._range) {
        if (!this._startNodes) {
          this._startNodes = (function(self) {
            return function() {
              var startNodes;
              startNodes = $(self._range.startContainer).parentsUntil(self.editable.body).get();
              startNodes.unshift(self._range.startContainer);
              return $(startNodes);
            };
          })(this)();
        } 

      }
      return this._startNodes;
    },

    endNodes : function() {
      var endNodes;
      if (this._range) {
        this._endNodes || (this._endNodes = this._range.collapsed ? this.startNodes() : (endNodes = $(this._range.endContainer).parentsUntil(this.editable.body).get(), endNodes.unshift(this._range.endContainer), $(endNodes)));
      }
      return this._endNodes;
    },

    containerNode : function() {
      if (this._range) {
        this._containerNode || (this._containerNode = $(this._range.commonAncestorContainer));
      }
      return this._containerNode;
    },

    nodes : function() {
      if (this._range) {
        this._nodes || (this._nodes = (function(self) {
          return function() {
            var nodes;
            nodes = [];
            if (self.startNodes().first().is(self.endNodes().first())) {
              nodes = self.startNodes().get();
            } else {
              self.startNodes().each(function(i, node) {
                var $endNode, $node, $nodes, endIndex, index, sharedIndex, startIndex;
                $node = $(node);
                if (self.endNodes().index($node) > -1) {
                  return nodes.push(node);
                } else if ($node.parent().is(self.editable.body) || (sharedIndex = self.endNodes().index($node.parent())) > -1) {
                  if (sharedIndex && sharedIndex > -1) {
                    $endNode = self.endNodes().eq(sharedIndex - 1);
                  } else {
                    $endNode = self.endNodes().last();
                  }
                  $nodes = $node.parent().contents();
                  startIndex = $nodes.index($node);
                  endIndex = $nodes.index($endNode);
                  return langx.merge(nodes, $nodes.slice(startIndex, endIndex).get());
                } else {
                  $nodes = $node.parent().contents();
                  index = $nodes.index($node);
                  return langx.merge(nodes, $nodes.slice(index).get());
                }
              });
              self.endNodes().each(function(i, node) {
                var $node, $nodes, index;
                $node = $(node);
                if ($node.parent().is(self.editable.body) || self.startNodes().index($node.parent()) > -1) {
                  nodes.push(node);
                  return false;
                } else {
                  $nodes = $node.parent().contents();
                  index = $nodes.index($node);
                  return langx.merge(nodes, $nodes.slice(0, index + 1));
                }
              });
            }
            return $(langx.uniq(nodes));
          };
        })(this)());
      }
      return this._nodes;
    },

    blockNodes : function() {
      if (!this._range) {
        return;
      }

      this._blockNodes || (this._blockNodes = (function(self) {
        return function() {
          return self.nodes().filter(function(i, node) {
            return self.editable.util.isBlockNode(node);
          });
        };
      })(this)());

      return this._blockNodes;
    },

    rootNodes : function() {
      if (!this._range) {
        return;
      }
      this._rootNodes || (this._rootNodes = (function(self) {
        return function() {
          return self.nodes().filter(function(i, node) {
            var $parent;
            $parent = $(node).parent();
            return $parent.is(self.editable.body) || $parent.is('blockquote');
          });
        };
      })(this)());

      return this._rootNodes;
    },

    rangeAtEndOf : function(node, range) {
      var afterLastNode, beforeLastNode, endNode, endNodeLength, lastNodeIsBr, result;
      if (range == null) {
        range = this.range();
      }
      if (!(range && range.collapsed)) {
        return;
      }
      node = $(node)[0];
      endNode = range.endContainer;
      endNodeLength = this.editable.util.getNodeLength(endNode);
      beforeLastNode = range.endOffset === endNodeLength - 1;
      lastNodeIsBr = $(endNode).contents().last().is('br');
      afterLastNode = range.endOffset === endNodeLength;
      if (!((beforeLastNode && lastNodeIsBr) || afterLastNode)) {
        return false;
      }
      if (node === endNode) {
        return true;
      } else if (!noder.contains(node, endNode)) {
        return false;
      }
      result = true;
      $(endNode).parentsUntil(node).addBack().each(function(i, n) {
        var $lastChild, beforeLastbr, isLastNode, nodes;
        nodes = $(n).parent().contents().filter(function() {
          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
        });
        $lastChild = nodes.last();
        isLastNode = $lastChild.get(0) === n;
        beforeLastbr = $lastChild.is('br') && $lastChild.prev().get(0) === n;
        if (!(isLastNode || beforeLastbr)) {
          result = false;
          return false;
        }
      });
      return result;
    },

    rangeAtStartOf : function(node, range) {
      var result, startNode;
      if (range == null) {
        range = this.range();
      }
      if (!(range && range.collapsed)) {
        return;
      }
      node = $(node)[0];
      startNode = range.startContainer;
      if (range.startOffset !== 0) {
        return false;
      }
      if (node === startNode) {
        return true;
      } else if (!noder.contains(node, startNode)) {
        return false;
      }
      result = true;
      $(startNode).parentsUntil(node).addBack().each(function(i, n) {
        var nodes;
        nodes = $(n).parent().contents().filter(function() {
          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
        });
        if (nodes.first().get(0) !== n) {
          return result = false;
        }
      });
      return result;
    },

    insertNode : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (!range) {
        return;
      }
      node = $(node)[0];
      range.insertNode(node);
      return this.setRangeAfter(node, range);
    },

    setRangeAfter : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (range == null) {
        return;
      }
      node = $(node)[0];
      range.setEndAfter(node);
      range.collapse(false);
      return this.range(range);
    },

    setRangeBefore : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (range == null) {
        return;
      }
      node = $(node)[0];
      range.setEndBefore(node);
      range.collapse(false);
      return this.range(range);
    },

    setRangeAtStartOf : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      node = $(node).get(0);
      range.setEnd(node, 0);
      range.collapse(false);
      return this.range(range);
    },

    setRangeAtEndOf : function(node, range) {
      var $lastNode, $node, contents, lastChild, lastChildLength, lastText, nodeLength;
      if (range == null) {
        range = this.range();
      }
      $node = $(node);
      node = $node[0];
      if (!node) {
        return;
      }
      if ($node.is('pre')) {
        contents = $node.contents();
        if (contents.length > 0) {
          lastChild = contents.last();
          lastText = lastChild.text();
          lastChildLength = this.editable.util.getNodeLength(lastChild[0]);
          if (lastText.charAt(lastText.length - 1) === '\n') {
            range.setEnd(lastChild[0], lastChildLength - 1);
          } else {
            range.setEnd(lastChild[0], lastChildLength);
          }
        } else {
          range.setEnd(node, 0);
        }
      } else {
        nodeLength = this.editable.util.getNodeLength(node);
        if (node.nodeType !== 3 && nodeLength > 0) {
          $lastNode = $(node).contents().last();
          if ($lastNode.is('br')) {
            nodeLength -= 1;
          } else if ($lastNode[0].nodeType !== 3 && this.editable.util.isEmptyNode($lastNode)) {
            $lastNode.append(this.editable.util.phBr);
            node = $lastNode[0];
            nodeLength = 0;
          }
        }
        range.setEnd(node, nodeLength);
      }
      range.collapse(false);
      return this.range(range);
    },

    deleteRangeContents : function(range) {
      var atEndOfBody, atStartOfBody, endRange, startRange;
      if (range == null) {
        range = this.range();
      }
      startRange = range.cloneRange();
      endRange = range.cloneRange();
      startRange.collapse(true);
      endRange.collapse(false);
      atStartOfBody = this.rangeAtStartOf(this.editable.body, startRange);
      atEndOfBody = this.rangeAtEndOf(this.editable.body, endRange);
      if (!range.collapsed && atStartOfBody && atEndOfBody) {
        this.editable.body.empty();
        range.setStart(this.editable.body[0], 0);
        range.collapse(true);
        this.range(range);
      } else {
        range.deleteContents();
      }
      return range;
    },

    breakBlockEl : function(el, range) {
      var $el;
      if (range == null) {
        range = this.range();
      }
      $el = $(el);
      if (!range.collapsed) {
        return $el;
      }
      range.setStartBefore($el.get(0));
      if (range.collapsed) {
        return $el;
      }
      return $el.before(range.extractContents());
    },

    save : function(range) {
      var endCaret, endRange, startCaret;
      if (range == null) {
        range = this.range();
      }
      if (this._selectionSaved) {
        return;
      }
      endRange = range.cloneRange();
      endRange.collapse(false);
      startCaret = $('<span/>').addClass(this.opts.classPrefix +'caret-start');
      endCaret = $('<span/>').addClass(this.opts.classPrefix +'caret-end');
      endRange.insertNode(endCaret[0]);
      range.insertNode(startCaret[0]);
      this.clear();
      return this._selectionSaved = true;
    },

    restore : function() {
      var endCaret, endContainer, endOffset, range, startCaret, startContainer, startOffset;
      if (!this._selectionSaved) {
        return false;
      }
      startCaret = this.editable.body.find('.' + this.opts.classPrefix +'caret-start');
      endCaret = this.editable.body.find('.' + this.opts.classPrefix +'caret-end');
      if (startCaret.length && endCaret.length) {
        startContainer = startCaret.parent();
        startOffset = startContainer.contents().index(startCaret);
        endContainer = endCaret.parent();
        endOffset = endContainer.contents().index(endCaret);
        if (startContainer[0] === endContainer[0]) {
          endOffset -= 1;
        }
        range = document.createRange();
        range.setStart(startContainer.get(0), startOffset);
        range.setEnd(endContainer.get(0), endOffset);
        startCaret.remove();
        endCaret.remove();
        this.range(range);
      } else {
        startCaret.remove();
        endCaret.remove();
      }
      this._selectionSaved = false;
      return range;
    },
  });

  Selection.pluginName = 'Selection';


  return contents.Selection = Selection;

});
define('skylark-domx-contents/UndoManager',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var UndoManager = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable;
      this.opts = langx.extend({}, this.opts, opts);

      var redoShortcut, undoShortcut;
      this._stack = [];
      if (this.editable.util.os.mac) {
        undoShortcut = 'cmd+z';
        redoShortcut = 'shift+cmd+z';
      } else if (this.editable.util.os.win) {
        undoShortcut = 'ctrl+z';
        redoShortcut = 'ctrl+y';
      } else {
        undoShortcut = 'ctrl+z';
        redoShortcut = 'shift+ctrl+z';
      }
      this.editable.hotkeys.add(undoShortcut, (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.undo();
          return false;
        };
      })(this));
      this.editable.hotkeys.add(redoShortcut, (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.redo();
          return false;
        };
      })(this));
      this.throttledPushState = this.editable.util.throttle((function(_this) {
        return function() {
          return _this._pushUndoState();
        };
      })(this), 2000);
      this.editable.on('valuechanged', (function(_this) {
        return function(e, src) {
          if (src === 'undo' || src === 'redo') {
            return;
          }
          return _this.throttledPushState();
        };
      })(this));
      this.editable.on('selectionchanged', (function(_this) {
        return function(e) {
          _this.resetCaretPosition();
          return _this.update();
        };
      })(this));
      this.editable.on('focus', (function(_this) {
        return function(e) {
          if (_this._stack.length === 0) {
            return _this._pushUndoState();
          }
        };
      })(this));
      this.editable.on('blur', (function(_this) {
        return function(e) {
          return _this.resetCaretPosition();
        };
      })(this));
    }

  });

  UndoManager.pluginName = 'UndoManager';

  UndoManager.prototype._index = -1;

  UndoManager.prototype._capacity = 20;

  UndoManager.prototype._startPosition = null;

  UndoManager.prototype._endPosition = null;

  UndoManager.prototype.resetCaretPosition = function() {
    this._startPosition = null;
    return this._endPosition = null;
  };

  UndoManager.prototype.startPosition = function() {
    if (this.editable.selection._range) {
      this._startPosition || (this._startPosition = this._getPosition('start'));
    }
    return this._startPosition;
  };

  UndoManager.prototype.endPosition = function() {
    if (this.editable.selection._range) {
      this._endPosition || (this._endPosition = (function(_this) {
        return function() {
          var range;
          range = _this.editable.selection.range();
          if (range.collapsed) {
            return _this._startPosition;
          }
          return _this._getPosition('end');
        };
      })(this)());
    }
    return this._endPosition;
  };

  UndoManager.prototype._pushUndoState = function() {
    var caret;
    if (this.editable.trigger('pushundostate') === false) {
      return;
    }
    caret = this.caretPosition();
    if (!caret.start) {
      return;
    }
    this._index += 1;
    this._stack.length = this._index;
    this._stack.push({
      html: this.editable.body.html(),
      caret: this.caretPosition()
    });
    if (this._stack.length > this._capacity) {
      this._stack.shift();
      return this._index -= 1;
    }
  };

  UndoManager.prototype.currentState = function() {
    if (this._stack.length && this._index > -1) {
      return this._stack[this._index];
    } else {
      return null;
    }
  };

  UndoManager.prototype.undo = function() {
    var state;
    if (this._index < 1 || this._stack.length < 2) {
      return;
    }
    this.editable.hidePopover();
    this._index -= 1;
    state = this._stack[this._index];
    this.editable.body.get(0).innerHTML = state.html;
    this.caretPosition(state.caret);
    this.editable.body.find('.selected').removeClass('selected');
    this.editable.sync();
    return this.editable.trigger('valuechanged', ['undo']);
  };

  UndoManager.prototype.redo = function() {
    var state;
    if (this._index < 0 || this._stack.length < this._index + 2) {
      return;
    }
    this.editable.hidePopover();
    this._index += 1;
    state = this._stack[this._index];
    this.editable.body.get(0).innerHTML = state.html;
    this.caretPosition(state.caret);
    this.editable.body.find('.selected').removeClass('selected');
    this.editable.sync();
    return this.editable.trigger('valuechanged', ['redo']);
  };

  UndoManager.prototype.update = function() {
    var currentState;
    currentState = this.currentState();
    if (!currentState) {
      return;
    }
    currentState.html = this.editable.body.html();
    return currentState.caret = this.caretPosition();
  };

  UndoManager.prototype._getNodeOffset = function(node, index) {
    var $parent, merging, offset;
    if (langx.isNumber(index)) {
      $parent = $(node);
    } else {
      $parent = $(node).parent();
    }
    offset = 0;
    merging = false;
    $parent.contents().each(function(i, child) {
      if (node === child || (index === i && i === 0)) {
        return false;
      }
      if (child.nodeType === Node.TEXT_NODE) {
        if (!merging && child.nodeValue.length > 0) {
          offset += 1;
          merging = true;
        }
      } else {
        offset += 1;
        merging = false;
      }
      if (index - 1 === i) {
        return false;
      }
      return null;
    });
    return offset;
  };

  UndoManager.prototype._getPosition = function(type) {
    var $nodes, node, nodes, offset, position, prevNode, range;
    if (type == null) {
      type = 'start';
    }
    range = this.editable.selection.range();
    offset = range[type + "Offset"];
    $nodes = this.editable.selection[type + "Nodes"]();
    node = $nodes.first()[0];
    if (node.nodeType === Node.TEXT_NODE) {
      prevNode = node.previousSibling;
      while (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
        node = prevNode;
        offset += this.editable.util.getNodeLength(prevNode);
        prevNode = prevNode.previousSibling;
      }
      nodes = $nodes.get();
      nodes[0] = node;
      $nodes = $(nodes);
    } else {
      offset = this._getNodeOffset(node, offset);
    }
    position = [offset];
    $nodes.each((function(_this) {
      return function(i, node) {
        return position.unshift(_this._getNodeOffset(node));
      };
    })(this));
    return position;
  };

  UndoManager.prototype._getNodeByPosition = function(position) {
    var child, childNodes, i, k, len, node, offset, ref;
    node = this.editable.body[0];
    ref = position.slice(0, position.length - 1);
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      offset = ref[i];
      childNodes = node.childNodes;
      if (offset > childNodes.length - 1) {
        if (i === position.length - 2 && $(node).is(':empty')) {
          child = document.createTextNode('');
          node.appendChild(child);
          childNodes = node.childNodes;
        } else {
          node = null;
          break;
        }
      }
      node = childNodes[offset];
    }
    return node;
  };

  UndoManager.prototype.caretPosition = function(caret) {
    var endContainer, endOffset, range, startContainer, startOffset;
    if (!caret) {
      range = this.editable.selection.range();
      caret = this.editable.inputManager.focused && (range != null) ? {
        start: this.startPosition(),
        end: this.endPosition(),
        collapsed: range.collapsed
      } : {};
      return caret;
    } else {
      if (!caret.start) {
        return;
      }
      startContainer = this._getNodeByPosition(caret.start);
      startOffset = caret.start[caret.start.length - 1];
      if (caret.collapsed) {
        endContainer = startContainer;
        endOffset = startOffset;
      } else {
        endContainer = this._getNodeByPosition(caret.end);
        endOffset = caret.start[caret.start.length - 1];
      }
      if (!startContainer || !endContainer) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn('simditor: invalid caret state');
          }
        }
        return;
      }
      range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      return this.editable.selection.range(range);
    }
  };

  return contents.UndoManager = UndoManager;

});
define('skylark-domx-contents/Keystroke',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Keystroke = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);

      this._keystrokeHandlers = {};
      this._initKeystrokeHandlers();
    }
  });


  Keystroke.pluginName = 'Keystroke';


  Keystroke.prototype.add = function(key, node, handler) {
    key = key.toLowerCase();
    key = this.editable.hotkeys.constructor.aliases[key] || key;
    if (!this._keystrokeHandlers[key]) {
      this._keystrokeHandlers[key] = {};
    }
    return this._keystrokeHandlers[key][node] = handler;
  };

  Keystroke.prototype.respondTo = function(e) {
    var base, key, ref, result;
    key = (ref = this.editable.hotkeys.constructor.keyNameMap[e.which]) != null ? ref.toLowerCase() : void 0;
    if (!key) {
      return;
    }
    if (key in this._keystrokeHandlers) {
      result = typeof (base = this._keystrokeHandlers[key])['*'] === "function" ? base['*'](e) : void 0;
      if (!result) {
        this.editable.selection.startNodes().each((function(_this) {
          return function(i, node) {
            var handler, ref1;
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return;
            }
            handler = (ref1 = _this._keystrokeHandlers[key]) != null ? ref1[node.tagName.toLowerCase()] : void 0;
            result = typeof handler === "function" ? handler(e, $(node)) : void 0;
            if (result === true || result === false) {
              return false;
            }
          };
        })(this));
      }
      if (result) {
        return true;
      }
    }
  };

  Keystroke.prototype._initKeystrokeHandlers = function() {
    var titleEnterHandler;
    if (this.editable.util.browser.safari) {
      this.add('enter', '*', (function(_this) {
        return function(e) {
          var $blockEl, $br;
          if (!e.shiftKey) {
            return;
          }
          $blockEl = _this.editable.selection.blockNodes().last();
          if ($blockEl.is('pre')) {
            return;
          }
          $br = $('<br/>');
          if (_this.editable.selection.rangeAtEndOf($blockEl)) {
            _this.editable.selection.insertNode($br);
            _this.editable.selection.insertNode($('<br/>'));
            _this.editable.selection.setRangeBefore($br);
          } else {
            _this.editable.selection.insertNode($br);
          }
          return true;
        };
      })(this));
    }
    if (this.editable.util.browser.webkit || this.editable.util.browser.msie) {
      titleEnterHandler = (function(_this) {
        return function(e, $node) {
          var $p;
          if (!_this.editable.selection.rangeAtEndOf($node)) {
            return;
          }
          $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
          _this.editable.selection.setRangeAtStartOf($p);
          return true;
        };
      })(this);
      this.add('enter', 'h1', titleEnterHandler);
      this.add('enter', 'h2', titleEnterHandler);
      this.add('enter', 'h3', titleEnterHandler);
      this.add('enter', 'h4', titleEnterHandler);
      this.add('enter', 'h5', titleEnterHandler);
      this.add('enter', 'h6', titleEnterHandler);
    }
    this.add('backspace', '*', (function(_this) {
      return function(e) {
        var $blockEl, $prevBlockEl, $rootBlock, isWebkit;
        $rootBlock = _this.editable.selection.rootNodes().first();
        $prevBlockEl = $rootBlock.prev();
        if ($prevBlockEl.is('hr') && _this.editable.selection.rangeAtStartOf($rootBlock)) {
          _this.editable.selection.save();
          $prevBlockEl.remove();
          _this.editable.selection.restore();
          return true;
        }
        $blockEl = _this.editable.selection.blockNodes().last();
        if ($blockEl.is('.' + this.opts.classPrefix + 'resize-handle') && $rootBlock.is('.' + this.opts.classPrefix + 'table')) {
          e.preventDefault();
          $rootBlock.remove();
          _this.editable.selection.setRangeAtEndOf($prevBlockEl);
        }
        if ($prevBlockEl.is('.' + this.opts.classPrefix + 'table') && !$blockEl.is('table') && _this.editable.util.isEmptyNode($blockEl)) {
          e.preventDefault();
          $blockEl.remove();
          _this.editable.selection.setRangeAtEndOf($prevBlockEl);
        }
        isWebkit = _this.editable.util.browser.webkit;
        if (isWebkit && _this.editable.selection.rangeAtStartOf($blockEl)) {
          _this.editable.selection.save();
          _this.editable.formatter.cleanNode($blockEl, true);
          _this.editable.selection.restore();
          return null;
        }
      };
    })(this));
    this.add('enter', 'div', (function(_this) {
      return function(e, $node) {
        var $blockEl, $p;
        if ($node.is('.' + this.opts.classPrefix + 'table')) {
          $blockEl = _this.editable.selection.blockNodes().last();
          if ($blockEl.is('.' + this.opts.classPrefix + 'resize-handle')) {
            e.preventDefault();
            $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
            return _this.editable.selection.setRangeAtStartOf($p);
          }
        }
      };
    })(this));
    this.add('enter', 'li', (function(_this) {
      return function(e, $node) {
        var $cloneNode, listEl, newBlockEl, newListEl;
        $cloneNode = $node.clone();
        $cloneNode.find('ul, ol').remove();
        if (!(_this.editable.util.isEmptyNode($cloneNode) && $node.is(_this.editable.selection.blockNodes().last()))) {
          return;
        }
        listEl = $node.parent();  
        if ($node.next('li').length > 0) {
          if (!_this.editable.util.isEmptyNode($node)) {
            return;
          }
          if (listEl.parent('li').length > 0) {
            newBlockEl = $('<li/>').append(_this.editable.util.phBr).insertAfter(listEl.parent('li'));
            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
            newBlockEl.append(newListEl);
          } else {
            newBlockEl = $('<p/>').append(_this.editable.util.phBr).insertAfter(listEl);
            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
            newBlockEl.after(newListEl);
          }
        } else {
          if (listEl.parent('li').length > 0) {
            newBlockEl = $('<li/>').insertAfter(listEl.parent('li'));
            if ($node.contents().length > 0) {
              newBlockEl.append($node.contents());
            } else {
              newBlockEl.append(_this.editable.util.phBr);
            }
          } else {
            newBlockEl = $('<p/>').append(_this.editable.util.phBr).insertAfter(listEl);
            if ($node.children('ul, ol').length > 0) {
              newBlockEl.after($node.children('ul, ol'));
            }
          }
        }
        if ($node.prev('li').length) {
          $node.remove();
        } else {
          if ($node.prev('ul').length || $node.prev('ol').length) {
            $node.remove();
          } else {
            listEl.remove();
          }
        }
        _this.editable.selection.setRangeAtStartOf(newBlockEl);
        return true;
      };
    })(this));
    this.add('enter', 'pre', (function(_this) {
      return function(e, $node) {
        var $p, breakNode, range;
        e.preventDefault();
        if (e.shiftKey) {
          $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
          _this.editable.selection.setRangeAtStartOf($p);
          return true;
        }
        range = _this.editable.selection.range();
        breakNode = null;
        range.deleteContents();
        if (!_this.editable.util.browser.msie && _this.editable.selection.rangeAtEndOf($node)) {
          breakNode = document.createTextNode('\n\n');
        } else {
          breakNode = document.createTextNode('\n');
        }
        range.insertNode(breakNode);
        range.setEnd(breakNode, 1);
        range.collapse(false);
        _this.editable.selection.range(range);
        return true;
      };
    })(this));
    this.add('enter', 'blockquote', (function(_this) {
      return function(e, $node) {
        var $closestBlock, range;
        $closestBlock = _this.editable.selection.blockNodes().last();
        if (!($closestBlock.is('p') && !$closestBlock.next().length && _this.editable.util.isEmptyNode($closestBlock))) {
          return;
        }
        $node.after($closestBlock);
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($closestBlock, range);
        return true;
      };
    })(this));
    this.add('backspace', 'li', (function(_this) {
      return function(e, $node) {
        var $br, $childList, $newLi, $prevChildList, $prevNode, $textNode, isFF, range, text;
        $childList = $node.children('ul, ol');
        $prevNode = $node.prev('li');
        if (!($childList.length > 0 && $prevNode.length > 0)) {
          return false;
        }
        text = '';
        $textNode = null;
        $node.contents().each(function(i, n) {
          if (n.nodeType === 1 && /UL|OL/.test(n.nodeName)) {
            return false;
          }
          if (n.nodeType === 1 && /BR/.test(n.nodeName)) {
            return;
          }
          if (n.nodeType === 3 && n.nodeValue) {
            text += n.nodeValue;
          } else if (n.nodeType === 1) {
            text += $(n).text();
          }
          return $textNode = $(n);
        });
        isFF = _this.editable.util.browser.firefox && !$textNode.next('br').length;
        if ($textNode && text.length === 1 && isFF) {
          $br = $(_this.editable.util.phBr).insertAfter($textNode);
          $textNode.remove();
          _this.editable.selection.setRangeBefore($br);
          return true;
        } else if (text.length > 0) {
          return false;
        }
        range = document.createRange();
        $prevChildList = $prevNode.children('ul, ol');
        if ($prevChildList.length > 0) {
          $newLi = $('<li/>').append(_this.editable.util.phBr).appendTo($prevChildList);
          $prevChildList.append($childList.children('li'));
          $node.remove();
          _this.editable.selection.setRangeAtEndOf($newLi, range);
        } else {
          _this.editable.selection.setRangeAtEndOf($prevNode, range);
          $prevNode.append($childList);
          $node.remove();
          _this.editable.selection.range(range);
        }
        return true;
      };
    })(this));
    this.add('backspace', 'pre', (function(_this) {
      return function(e, $node) {
        var $newNode, codeStr, range;
        if (!_this.editable.selection.rangeAtStartOf($node)) {
          return;
        }
        codeStr = $node.html().replace('\n', '<br/>') || _this.editable.util.phBr;
        $newNode = $('<p/>').append(codeStr).insertAfter($node);
        $node.remove();
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($newNode, range);
        return true;
      };
    })(this));
    return this.add('backspace', 'blockquote', (function(_this) {
      return function(e, $node) {
        var $firstChild, range;
        if (!_this.editable.selection.rangeAtStartOf($node)) {
          return;
        }
        $firstChild = $node.children().first().unwrap();
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($firstChild, range);
        return true;
      };
    })(this));
  };

  return contents.Keystroke = Keystroke;

});

define('skylark-domx-contents/Formatter',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 


  var indexOf = [].indexOf ;

  var Formatter = langx.Evented.inherit({
    opts : {
      allowedTags: [],
      allowedAttributes: {},
      allowedStyles: {}
    },

    init : function(editable,opts) {
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);

      this._allowedTags = langx.merge(['br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr'], this.opts.allowedTags);
      this._allowedAttributes = langx.extend({
        img: ['src', 'alt', 'width', 'height', 'data-non-image'],
        a: ['href', 'target'],
        font: ['color'],
        code: ['class']
      }, this.opts.allowedAttributes);
      this._allowedStyles = langx.extend({
        span: ['color', 'font-size'],
        b: ['color', 'font-size'],
        i: ['color', 'font-size'],
        strong: ['color', 'font-size'],
        strike: ['color', 'font-size'],
        u: ['color', 'font-size'],
        p: ['margin-left', 'text-align'],
        h1: ['margin-left', 'text-align'],
        h2: ['margin-left', 'text-align'],
        h3: ['margin-left', 'text-align'],
        h4: ['margin-left', 'text-align']
      }, this.opts.allowedStyles);
      this.editable.body.on('click', 'a', function(e) {
        return false;
      });
    },

    decorate : function($el) {
      if ($el == null) {
        $el = this.editable.body;
      }
      this.editable.trigger('decorate', [$el]);
      return $el;
    },

    undecorate : function($el) {
      if ($el == null) {
        $el = this.editable.body.clone();
      }
      this.editable.trigger('undecorate', [$el]);
      return $el;
    },

    autolink : function($el) {
      var $link, $node, findLinkNode, k, lastIndex, len, linkNodes, match, re, replaceEls, subStr, text, uri;
      if ($el == null) {
        $el = this.editable.body;
      }
      linkNodes = [];
      findLinkNode = function($parentNode) {
        return $parentNode.contents().each(function(i, node) {
          var $node, text;
          $node = $(node);
          if ($node.is('a') || $node.closest('a, pre', $el).length) {
            return;
          }
          if (!$node.is('iframe') && $node.contents().length) {
            return findLinkNode($node);
          } else if ((text = $node.text()) && /https?:\/\/|www\./ig.test(text)) {
            return linkNodes.push($node);
          }
        });
      };
      findLinkNode($el);
      re = /(https?:\/\/|www\.)[\w\-\.\?&=\/#%:,@\!\+]+/ig;
      for (k = 0, len = linkNodes.length; k < len; k++) {
        $node = linkNodes[k];
        text = $node.text();
        replaceEls = [];
        match = null;
        lastIndex = 0;
        while ((match = re.exec(text)) !== null) {
          subStr = text.substring(lastIndex, match.index);
          replaceEls.push(document.createTextNode(subStr));
          lastIndex = re.lastIndex;
          uri = /^(http(s)?:\/\/|\/)/.test(match[0]) ? match[0] : 'http://' + match[0];
          $link = $("<a href=\"" + uri + "\" rel=\"nofollow\"></a>").text(match[0]);
          replaceEls.push($link[0]);
        }
        replaceEls.push(document.createTextNode(text.substring(lastIndex)));
        $node.replaceWith($(replaceEls));
      }
      return $el;
    },

    format : function($el) {
      var $node, blockNode, k, l, len, len1, n, node, ref, ref1;
      if ($el == null) {
        $el = this.editable.body;
      }
      if ($el.is(':empty')) {
        $el.append('<p>' + this.editable.util.phBr + '</p>');
        return $el;
      }
      ref = $el.contents();
      for (k = 0, len = ref.length; k < len; k++) {
        n = ref[k];
        this.cleanNode(n, true);
      }
      ref1 = $el.contents();
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        node = ref1[l];
        $node = $(node);
        if ($node.is('br')) {
          if (typeof blockNode !== "undefined" && blockNode !== null) {
            blockNode = null;
          }
          $node.remove();
        } else if (this.editable.util.isBlockNode(node)) {
          if ($node.is('li')) {
            if (blockNode && blockNode.is('ul, ol')) {
              blockNode.append(node);
            } else {
              blockNode = $('<ul/>').insertBefore(node);
              blockNode.append(node);
            }
          } else {
            blockNode = null;
          }
        } else {
          if (!blockNode || blockNode.is('ul, ol')) {
            blockNode = $('<p/>').insertBefore(node);
          }
          blockNode.append(node);
          if (this.editable.util.isEmptyNode(blockNode)) {
            blockNode.append(this.editable.util.phBr);
          }
        }
      }
      return $el;
    },

    cleanNode : function(node, recursive) {
      var $blockEls, $childImg, $node, $p, $td, allowedAttributes, attr, contents, isDecoration, k, l, len, len1, n, ref, ref1, text, textNode;
      $node = $(node);
      if (!($node.length > 0)) {
        return;
      }
      if ($node[0].nodeType === 3) {
        text = $node.text().replace(/(\r\n|\n|\r)/gm, '');
        if (text) {
          textNode = document.createTextNode(text);
          $node.replaceWith(textNode);
        } else {
          $node.remove();
        }
        return;
      }
      contents = $node.is('iframe') ? null : $node.contents();
      isDecoration = this.editable.util.isDecoratedNode($node);
      if ($node.is(this._allowedTags.join(',')) || isDecoration) {
        if ($node.is('a') && ($childImg = $node.find('img')).length > 0) {
          $node.replaceWith($childImg);
          $node = $childImg;
          contents = null;
        }
        if ($node.is('td') && ($blockEls = $node.find(this.editable.util.blockNodes.join(','))).length > 0) {
          $blockEls.each((function(_this) {
            return function(i, blockEl) {
              return $(blockEl).contents().unwrap();
            };
          })(this));
          contents = $node.contents();
        }
        if ($node.is('img') && $node.hasClass('uploading')) {
          $node.remove();
        }
        if (!isDecoration) {
          allowedAttributes = this._allowedAttributes[$node[0].tagName.toLowerCase()];
          ref = langx.makeArray($node[0].attributes);
          for (k = 0, len = ref.length; k < len; k++) {
            attr = ref[k];
            if (attr.name === 'style') {
              continue;
            }
            if (!((allowedAttributes != null) && (ref1 = attr.name, indexOf.call(allowedAttributes, ref1) >= 0))) {
              $node.removeAttr(attr.name);
            }
          }
          this._cleanNodeStyles($node);
          if ($node.is('span')) {
            if ($node[0].attributes.length === 0) {
              $node.contents().first().unwrap();
            }
            if ($node[0].style.length === 2 && $node[0].style.color === 'rgb(51, 51, 51)' && $node[0].style.fontSize === '16px') {
              $node.contents().unwrap();
            }
          }
        }
      } else if ($node[0].nodeType === 1 && !$node.is(':empty')) {
        if ($node.is('div, article, dl, header, footer, tr')) {
          $node.append('<br/>');
          contents.first().unwrap();
        } else if ($node.is('table')) {
          $p = $('<p/>');
          $node.find('tr').each(function(i, tr) {
            return $p.append($(tr).text() + '<br/>');
          });
          $node.replaceWith($p);
          contents = null;
        } else if ($node.is('thead, tfoot')) {
          $node.remove();
          contents = null;
        } else if ($node.is('th')) {
          $td = $('<td/>').append($node.contents());
          $node.replaceWith($td);
        } else {
          contents.first().unwrap();
        }
      } else {
        $node.remove();
        contents = null;
      }
      if (recursive && (contents != null) && !$node.is('pre')) {
        for (l = 0, len1 = contents.length; l < len1; l++) {
          n = contents[l];
          this.cleanNode(n, true);
        }
      }
      return null;
    },

    _cleanNodeStyles : function($node) {
      var allowedStyles, k, len, pair, ref, ref1, style, styleStr, styles;
      styleStr = $node.attr('style');
      if (!styleStr) {
        return;
      }
      $node.removeAttr('style');
      allowedStyles = this._allowedStyles[$node[0].tagName.toLowerCase()];
      if (!(allowedStyles && allowedStyles.length > 0)) {
        return $node;
      }
      styles = {};
      ref = styleStr.split(';');
      for (k = 0, len = ref.length; k < len; k++) {
        style = ref[k];
        style = langx.trim(style);
        pair = style.split(':');
        if (pair.length !== 2) {
          continue;
        }
        if (pair[0] === 'font-size' && pair[1].indexOf('px') > 0) {
          if (parseInt(pair[1], 10) < 12) {
            continue;
          }
        }
        if (ref1 = pair[0], indexOf.call(allowedStyles, ref1) >= 0) {
          styles[langx.trim(pair[0])] = langx.trim(pair[1]);
        }
      }
      if (Object.keys(styles).length > 0) {
        $node.css(styles);
      }
      return $node;
    },

    clearHtml : function(html, lineBreak) {
      var container, contents, result;
      if (lineBreak == null) {
        lineBreak = true;
      }
      container = $('<div/>').append(html);
      contents = container.contents();
      result = '';
      contents.each((function(_this) {
        return function(i, node) {
          var $node, children;
          if (node.nodeType === 3) {
            return result += node.nodeValue;
          } else if (node.nodeType === 1) {
            $node = $(node);
            children = $node.is('iframe') ? null : $node.contents();
            if (children && children.length > 0) {
              result += _this.clearHtml(children);
            }
            if (lineBreak && i < contents.length - 1 && $node.is('br, p, div, li,tr, pre, address, artticle, aside, dl, figcaption, footer, h1, h2,h3, h4, header')) {
              return result += '\n';
            }
          }
        };
      })(this));
      return result;
    },

    beautify : function($contents) {
      var uselessP;
      uselessP = function($el) {
        return !!($el.is('p') && !$el.text() && $el.children(':not(br)').length < 1);
      };
      return $contents.each(function(i, el) {
        var $el, invalid;
        $el = $(el);
        invalid = $el.is(':not(img, br, col, td, hr, [class^="' + this.opts.classPrefix + '"]):empty');
        if (invalid || uselessP($el)) {
          $el.remove();
        }
        return $el.find(':not(img, br, col, td, hr, [class^="' + this.opts.classPrefix + '"]):empty').remove();
      });
    }

  });

  Formatter.pluginName = 'Formatter';

  return contents.Formatter = Formatter;

});
define('skylark-domx-contents/Indentation',[
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
  "./contents"
],function(langx,noder,$,contents){ 


  var Indentation = langx.Evented.inherit({

  });


  Indentation.pluginName = 'Indentation';

  Indentation.prototype.opts = {
    tabIndent: true,
    indentWidth: 40
   
  };

  Indentation.prototype.init = function(editable,opts) {
    this.editable = editable; // this._module;
    this.opts = langx.extend({}, this.opts, opts);

    this.editable.keystroke.add('tab', '*', (function(_this) {
      return function(e) {
        var codeButton;
        codeButton = _this.editable.toolbar.findButton('code');
        if (!(_this.opts.tabIndent || (codeButton && codeButton.active))) {
          return;
        }
        return _this.indent(e.shiftKey);
      };
    })(this));
  };

  Indentation.prototype.indent = function(isBackward) {
    var $blockNodes, $endNodes, $startNodes, nodes, result;
    $startNodes = this.editable.selection.startNodes();
    $endNodes = this.editable.selection.endNodes();
    $blockNodes = this.editable.selection.blockNodes();
    nodes = [];
    $blockNodes = $blockNodes.each(function(i, node) {
      var include, j, k, len, n;
      include = true;
      for (j = k = 0, len = nodes.length; k < len; j = ++k) {
        n = nodes[j];
        if (noder.contains(node, n)) {
          include = false;
          break;
        } else if (noder.contains(n, node)) {
          nodes.splice(j, 1, node);
          include = false;
          break;
        }
      }
      if (include) {
        return nodes.push(node);
      }
    });
    $blockNodes = $(nodes);
    result = false;
    $blockNodes.each((function(_this) {
      return function(i, blockEl) {
        var r;
        r = isBackward ? _this.outdentBlock(blockEl) : _this.indentBlock(blockEl);
        if (r) {
          return result = r;
        }
      };
    })(this));
    return result;
  };

  Indentation.prototype.indentBlock = function(blockEl) {
    var $blockEl, $childList, $nextTd, $nextTr, $parentLi, $pre, $td, $tr, marginLeft, tagName;
    $blockEl = $(blockEl);
    if (!$blockEl.length) {
      return;
    }
    if ($blockEl.is('pre')) {
      $pre = this.editable.selection.containerNode();
      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
        return;
      }
      this.indentText(this.editable.selection.range());
    } else if ($blockEl.is('li')) {
      $parentLi = $blockEl.prev('li');
      if ($parentLi.length < 1) {
        return;
      }
      this.editable.selection.save();
      tagName = $blockEl.parent()[0].tagName;
      $childList = $parentLi.children('ul, ol');
      if ($childList.length > 0) {
        $childList.append($blockEl);
      } else {
        $('<' + tagName + '/>').append($blockEl).appendTo($parentLi);
      }
      this.editable.selection.restore();
    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
      marginLeft = (Math.round(marginLeft / this.opts.indentWidth) + 1) * this.opts.indentWidth;
      $blockEl.css('margin-left', marginLeft);
    } else if ($blockEl.is('table') || $blockEl.is('.' + this.opts.classPrefix +'table')) {
      $td = this.editable.selection.containerNode().closest('td, th');
      $nextTd = $td.next('td, th');
      if (!($nextTd.length > 0)) {
        $tr = $td.parent('tr');
        $nextTr = $tr.next('tr');
        if ($nextTr.length < 1 && $tr.parent().is('thead')) {
          $nextTr = $tr.parent('thead').next('tbody').find('tr:first');
        }
        $nextTd = $nextTr.find('td:first, th:first');
      }
      if (!($td.length > 0 && $nextTd.length > 0)) {
        return;
      }
      this.editable.selection.setRangeAtEndOf($nextTd);
    } else {
      return false;
    }
    return true;
  };

  Indentation.prototype.indentText = function(range) {
    var text, textNode;
    text = range.toString().replace(/^(?=.+)/mg, '\u00A0\u00A0');
    textNode = document.createTextNode(text || '\u00A0\u00A0');
    range.deleteContents();
    range.insertNode(textNode);
    if (text) {
      range.selectNode(textNode);
      return this.editable.selection.range(range);
    } else {
      return this.editable.selection.setRangeAfter(textNode);
    }
  };

  Indentation.prototype.outdentBlock = function(blockEl) {
    var $blockEl, $parent, $parentLi, $pre, $prevTd, $prevTr, $td, $tr, marginLeft, range;
    $blockEl = $(blockEl);
    if (!($blockEl && $blockEl.length > 0)) {
      return;
    }
    if ($blockEl.is('pre')) {
      $pre = this.editable.selection.containerNode();
      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
        return;
      }
      this.outdentText(range);
    } else if ($blockEl.is('li')) {
      $parent = $blockEl.parent();
      $parentLi = $parent.parent('li');
      this.editable.selection.save();
      if ($parentLi.length < 1) {
        range = document.createRange();
        range.setStartBefore($parent[0]);
        range.setEndBefore($blockEl[0]);
        $parent.before(range.extractContents());
        $('<p/>').insertBefore($parent).after($blockEl.children('ul, ol')).append($blockEl.contents());
        $blockEl.remove();
      } else {
        if ($blockEl.next('li').length > 0) {
          $('<' + $parent[0].tagName + '/>').append($blockEl.nextAll('li')).appendTo($blockEl);
        }
        $blockEl.insertAfter($parentLi);
        if ($parent.children('li').length < 1) {
          $parent.remove();
        }
      }
      this.editable.selection.restore();
    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
      marginLeft = Math.max(Math.round(marginLeft / this.opts.indentWidth) - 1, 0) * this.opts.indentWidth;
      $blockEl.css('margin-left', marginLeft === 0 ? '' : marginLeft);
    } else if ($blockEl.is('table') || $blockEl.is('.' + this.opts.classPrefix + 'table')) {
      $td = this.editable.selection.containerNode().closest('td, th');
      $prevTd = $td.prev('td, th');
      if (!($prevTd.length > 0)) {
        $tr = $td.parent('tr');
        $prevTr = $tr.prev('tr');
        if ($prevTr.length < 1 && $tr.parent().is('tbody')) {
          $prevTr = $tr.parent('tbody').prev('thead').find('tr:first');
        }
        $prevTd = $prevTr.find('td:last, th:last');
      }
      if (!($td.length > 0 && $prevTd.length > 0)) {
        return;
      }
      this.editable.selection.setRangeAtEndOf($prevTd);
    } else {
      return false;
    }
    return true;
  };

  Indentation.prototype.outdentText = function(range) {};

  return contents.Indentation = Indentation;

});

define('skylark-domx-contents/Clipboard',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Clipboard = langx.Evented.inherit({

  });


  Clipboard.pluginName = 'Clipboard';

  Clipboard.prototype.opts = {
    pasteImage: false,
    cleanPaste: false
  };

  Clipboard.prototype.init = function(editable,opts) {
    this.editable = editable; //this._module;
    this.opts = langx.extend({}, this.opts, opts);
    if (this.opts.pasteImage && typeof this.opts.pasteImage !== 'string') {
      this.opts.pasteImage = 'inline';
    }
    this.editable.body.on('paste', (function(_this) {
      return function(e) {
        var range;
        if (_this.pasting || _this._pasteBin) {
          return;
        }
        if (_this.editable.trigger(e) === false) {
          return false;
        }
        range = _this.editable.selection.deleteRangeContents();
        if (_this.editable.body.html()) {
          if (!range.collapsed) {
            range.collapse(true);
          }
        } else {
          _this.editable.formatter.format();
          _this.editable.selection.setRangeAtStartOf(_this.editable.body.find('p:first'));
        }
        if (_this._processPasteByClipboardApi(e)) {
          return false;
        }
        _this.editable.inputManager.throttledValueChanged.clear();
        _this.editable.inputManager.throttledSelectionChanged.clear();
        _this.editable.undoManager.throttledPushState.clear();
        _this.editable.selection.reset();
        _this.editable.undoManager.resetCaretPosition();
        _this.pasting = true;
        return _this._getPasteContent(function(pasteContent) {
          _this._processPasteContent(pasteContent);
          _this._pasteInBlockEl = null;
          _this._pastePlainText = null;
          return _this.pasting = false;
        });
      };
    })(this));
  };

  Clipboard.prototype._processPasteByClipboardApi = function(e) {
    var imageFile, pasteItem, ref, uploadOpt;
    if (this.editable.util.browser.edge) {
      return;
    }
    if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.items && e.originalEvent.clipboardData.items.length > 0) {
      pasteItem = e.originalEvent.clipboardData.items[0];
      if (/^image\//.test(pasteItem.type)) {
        imageFile = pasteItem.getAsFile();
        if (!((imageFile != null) && this.opts.pasteImage)) {
          return;
        }
        if (!imageFile.name) {
          imageFile.name = "Clipboard Image.png";
        }
        if (this.editable.triggerHandler('pasting', [imageFile]) === false) {
          return;
        }
        uploadOpt = {};
        uploadOpt[this.opts.pasteImage] = true;
        if ((ref = this.editable.uploader) != null) {
          ref.upload(imageFile, uploadOpt);
        }
        return true;
      }
    }
  };

  Clipboard.prototype._getPasteContent = function(callback) {
    var state;
    this._pasteBin = $('<div contenteditable="true" />').addClass(this.opts.classPrefix + 'paste-bin').attr('tabIndex', '-1').appendTo(this.editable.$el);
    state = {
      html: this.editable.body.html(),
      caret: this.editable.undoManager.caretPosition()
    };
    this._pasteBin.focus();
    return setTimeout((function(_this) {
      return function() {
        var pasteContent;
        _this.editable.hidePopover();
        _this.editable.body.get(0).innerHTML = state.html;
        _this.editable.undoManager.caretPosition(state.caret);
        _this.editable.body.focus();
        _this.editable.selection.reset();
        _this.editable.selection.range();
        _this._pasteInBlockEl = _this.editable.selection.blockNodes().last();
        _this._pastePlainText = _this.opts.cleanPaste || _this._pasteInBlockEl.is('pre, table');
        if (_this._pastePlainText) {
          pasteContent = _this.editable.formatter.clearHtml(_this._pasteBin.html(), true);
        } else {
          pasteContent = $('<div/>').append(_this._pasteBin.contents());
          pasteContent.find('style').remove();
          pasteContent.find('table colgroup').remove();
          _this._cleanPasteFontSize(pasteContent);
          _this.editable.formatter.format(pasteContent);
          _this.editable.formatter.decorate(pasteContent);
          _this.editable.formatter.beautify(pasteContent.children());
          pasteContent = pasteContent.contents();
        }
        _this._pasteBin.remove();
        _this._pasteBin = null;
        return callback(pasteContent);
      };
    })(this), 0);
  };

  Clipboard.prototype._processPasteContent = function(pasteContent) {
    var $blockEl, $img, blob, children, dataURLtoBlob, img, insertPosition, k, l, lastLine, len, len1, len2, len3, len4, line, lines, m, node, o, q, ref, ref1, ref2, uploadOpt, uploader;
    if (this.editable.triggerHandler('pasting', [pasteContent]) === false) {
      return;
    }
    $blockEl = this._pasteInBlockEl;
    if (!pasteContent) {
      return;
    }
    if (this._pastePlainText) {
      if ($blockEl.is('table')) {
        lines = pasteContent.split('\n');
        lastLine = lines.pop();
        for (k = 0, len = lines.length; k < len; k++) {
          line = lines[k];
          this.editable.selection.insertNode(document.createTextNode(line));
          this.editable.selection.insertNode($('<br/>'));
        }
        this.editable.selection.insertNode(document.createTextNode(lastLine));
      } else {
        pasteContent = $('<div/>').text(pasteContent);
        ref = pasteContent.contents();
        for (l = 0, len1 = ref.length; l < len1; l++) {
          node = ref[l];
          this.editable.selection.insertNode($(node)[0]);
        }
      }
    } else if ($blockEl.is(this.editable.body)) {
      for (m = 0, len2 = pasteContent.length; m < len2; m++) {
        node = pasteContent[m];
        this.editable.selection.insertNode(node);
      }
    } else if (pasteContent.length < 1) {
      return;
    } else if (pasteContent.length === 1) {
      if (pasteContent.is('p')) {
        children = pasteContent.contents();
        if ($blockEl.is('h1, h2, h3, h4, h5')) {
          if (children.length) {
            children.css('font-size', '');
          }
        }
        if (children.length === 1 && children.is('img')) {
          $img = children;
          if (/^data:image/.test($img.attr('src'))) {
            if (!this.opts.pasteImage) {
              return;
            }
            blob = this.editable.util.dataURLtoBlob($img.attr("src"));
            blob.name = "Clipboard Image.png";
            uploadOpt = {};
            uploadOpt[this.opts.pasteImage] = true;
            if ((ref1 = this.editable.uploader) != null) {
              ref1.upload(blob, uploadOpt);
            }
            return;
          } else if (new RegExp('^blob:' + location.origin + '/').test($img.attr('src'))) {
            if (!this.opts.pasteImage) {
              return;
            }
            uploadOpt = {};
            uploadOpt[this.opts.pasteImage] = true;
            dataURLtoBlob = this.editable.util.dataURLtoBlob;
            uploader = this.editable.uploader;
            img = new Image;
            img.onload = function() {
              var canvas;
              canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              canvas.getContext('2d').drawImage(img, 0, 0);
              blob = dataURLtoBlob(canvas.toDataURL('image/png'));
              blob.name = 'Clipboard Image.png';
              if (uploader !== null) {
                uploader.upload(blob, uploadOpt);
              }
            };
            img.src = $img.attr('src');
            return;
          } else if ($img.is('img[src^="webkit-fake-url://"]')) {
            return;
          }
        }
        for (o = 0, len3 = children.length; o < len3; o++) {
          node = children[o];
          this.editable.selection.insertNode(node);
        }
      } else if ($blockEl.is('p') && this.editable.util.isEmptyNode($blockEl)) {
        $blockEl.replaceWith(pasteContent);
        this.editable.selection.setRangeAtEndOf(pasteContent);
      } else if (pasteContent.is('ul, ol')) {
        if (pasteContent.find('li').length === 1) {
          pasteContent = $('<div/>').text(pasteContent.text());
          ref2 = pasteContent.contents();
          for (q = 0, len4 = ref2.length; q < len4; q++) {
            node = ref2[q];
            this.editable.selection.insertNode($(node)[0]);
          }
        } else if ($blockEl.is('li')) {
          $blockEl.parent().after(pasteContent);
          this.editable.selection.setRangeAtEndOf(pasteContent);
        } else {
          $blockEl.after(pasteContent);
          this.editable.selection.setRangeAtEndOf(pasteContent);
        }
      } else {
        $blockEl.after(pasteContent);
        this.editable.selection.setRangeAtEndOf(pasteContent);
      }
    } else {
      if ($blockEl.is('li')) {
        $blockEl = $blockEl.parent();
      }
      if (this.editable.selection.rangeAtStartOf($blockEl)) {
        insertPosition = 'before';
      } else if (this.editable.selection.rangeAtEndOf($blockEl)) {
        insertPosition = 'after';
      } else {
        this.editable.selection.breakBlockEl($blockEl);
        insertPosition = 'before';
      }
      $blockEl[insertPosition](pasteContent);
      this.editable.selection.setRangeAtEndOf(pasteContent.last());
    }
    return this.editable.inputManager.throttledValueChanged();
  };

  Clipboard.prototype._cleanPasteFontSize = function(node) {
    var $node, sizeMap;
    $node = $(node);
    if (!($node.length > 0)) {
      return;
    }
    sizeMap = ['1.5em', '1.25em', '0.75em', '0.5em'];
    return $node.find('[style*="font-size"]').map(function(i, el) {
      var $el;
      $el = $(el);
      if (langx.inArray($el.css('font-size'), sizeMap) < 0) {
        return $el.css('font-size', '');
      }
    });
  };

  return contents.Clipboard = Clipboard;

});


define('skylark-domx-contents/Editable',[
	"skylark-langx/langx",
	"skylark-domx-noder",
	"skylark-domx-query",
	"./contents",
	"./Hotkeys",
	"./Util",
	"./InputManager", 
	"./Selection", 
	"./UndoManager", 
	"./Keystroke",
	"./Formatter", 
	"./Indentation", 
	"./Clipboard"
],function(langx, noder, $, contents,Hotkeys,Util,InputManager,Selection,UndoManager,Keystroke,Formatter,Indentation,Clipboard){
  var Editable = langx.Evented.inherit({
    init : function(el,opts) {
    	this.$el = $(el);
    	this.textarea = $(opts.textarea);
    	this.body = $(opts.body);

    	var pluginOpts = {
    		classPrefix : opts.classPrefix
    	};

        this.util = new Util(this,pluginOpts);

		this.hotkeys = new Hotkeys({
		  el: this.body
		});

      this.inputManager = new InputManager(this,pluginOpts);
      this.selection = new Selection(this,pluginOpts);
      this.undoManager = new UndoManager(this,pluginOpts);
      this.keystroke = new Keystroke(this,pluginOpts);
      this.formatter = new Formatter(this,pluginOpts);
      this.indentation = new Indentation(this,pluginOpts);
      this.clipboard = new Clipboard(this,pluginOpts);

		if (this.util.os.mac) {
		  this.$el.addClass(opts.classPrefix + 'mac');
		} else if (this.util.os.linux) {
		  this.$el.addClass(opts.classPrefix + 'linux');
		}
		if (this.util.os.mobile) {
		  this.$el.addClass(opts.classPrefix + 'mobile');
		}

      if (this.util.browser.mozilla) {
        this.util.reflow();
        try {
          document.execCommand('enableObjectResizing', false, false);
          return document.execCommand('enableInlineTableEditing', false, false);
        } catch (_error) {
          e = _error;
        }
      }

    },

	setValue : function(val) {
		this.textarea.val(val);
		this.body.get(0).innerHTML = val;
		this.formatter.format();
		this.formatter.decorate();
		this.util.reflow(this.body);
		this.inputManager.lastCaretPosition = null;
	},

	getValue : function() {
		return this.sync();
	},

	sync : function() {
		var children, cloneBody, emptyP, firstP, lastP, val;
		cloneBody = this.body.clone();
		this.formatter.undecorate(cloneBody);
		this.formatter.format(cloneBody);
		this.formatter.autolink(cloneBody);
		children = cloneBody.children();
		lastP = children.last('p');
		firstP = children.first('p');
		while (lastP.is('p') && this.util.isEmptyNode(lastP)) {
		  emptyP = lastP;
		  lastP = lastP.prev('p');
		  emptyP.remove();
		}
		while (firstP.is('p') && this.util.isEmptyNode(firstP)) {
		  emptyP = firstP;
		  firstP = lastP.next('p');
		  emptyP.remove();
		}
		cloneBody.find('img.uploading').remove();
		val = langx.trim(cloneBody.html());
		this.textarea.val(val);
		return val;
	},

	focus : function() {
		var $blockEl, range;
		if (!(this.body.is(':visible') && this.body.is('[contenteditable]'))) {
		  this.$el.find('textarea:visible').focus();
		  return;
		}
		if (this.inputManager.lastCaretPosition) {
		  this.undoManager.caretPosition(this.inputManager.lastCaretPosition);
		  return this.inputManager.lastCaretPosition = null;
		} else {
		  $blockEl = this.body.children().last();
		  if (!$blockEl.is('p')) {
		    $blockEl = $('<p/>').append(this.util.phBr).appendTo(this.body);
		  }
		  range = document.createRange();
		  return this.selection.setRangeAtEndOf($blockEl, range);
		}
	},

	blur : function() {
		if (this.body.is(':visible') && this.body.is('[contenteditable]')) {
		  return this.body.blur();
		} else {
		  return this.body.find('textarea:visible').blur();
		}
	},

	isActive : function(state) {
		return document.queryCommandState(state) === true; //'bold'
	},

	status : function(cmd,htmlTag) {
		if (cmd === "alignment") {
		    var nodes = this.selection.nodes().filter(htmlTag);
		    if (nodes.length < 1) {
		    	return null;
		    } else {
		      return nodes.first().css('text-align');
		    }

		}
	},

	alignment : function(align,htmlTag) {
	    if (align !== 'left' && align !== 'center' && align !== 'right') {
	      throw new Error("simditor alignment button: invalid align " + align);
	    }
    	var nodes = this.selection.nodes().filter(htmlTag);
	    nodes.css({
	      'text-align': align === 'left' ? '' : align
	    });
	    this.trigger('valuechanged');
	    return this.inputManager.throttledSelectionChanged();

	},

	blockquote : function(htmlTag,disableTag) {
	    var $rootNodes, clearCache, nodeCache;
	    $rootNodes = this.selection.rootNodes();
	    $rootNodes = $rootNodes.filter(function(i, node) {
	      return !$(node).parent().is('blockquote');
	    });
	    this.selection.save();
	    nodeCache = [];
	    clearCache = (function(_this) {
	      return function() {
	        if (nodeCache.length > 0) {
	          $("<" + _this.htmlTag + "/>").insertBefore(nodeCache[0]).append(nodeCache);
	          return nodeCache.length = 0;
	        }
	      };
	    })(this);
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if (!$node.parent().is(_this.body)) {
	          return;
	        }
	        if ($node.is(htmlTag)) {
	          clearCache();
	          return $node.children().unwrap();
	        } else if ($node.is(disableTag) || _this.util.isDecoratedNode($node)) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.selection.restore();
	    return this.trigger('valuechanged');

	},

	blockCode : function(htmlTag,disableTag) {
	    var $rootNodes, clearCache, nodeCache, resultNodes;
	    $rootNodes = this.selection.rootNodes();
	    nodeCache = [];
	    resultNodes = [];
	    clearCache = (function(_this) {
	      return function() {
	        var $pre;
	        if (!(nodeCache.length > 0)) {
	          return;
	        }
	        $pre = $("<" + htmlTag + "/>").insertBefore(nodeCache[0]).text(_this.formatter.clearHtml(nodeCache));
	        resultNodes.push($pre[0]);
	        return nodeCache.length = 0;
	      };
	    })(this);
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node, $p;
	        $node = $(node);
	        if ($node.is(htmlTag)) {
	          clearCache();
	          $p = $('<p/>').append($node.html().replace('\n', '<br/>')).replaceAll($node);
	          return resultNodes.push($p[0]);
	        } else if ($node.is(disableTag) || _this.util.isDecoratedNode($node) || $node.is('blockquote')) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.selection.setRangeAtEndOf($(resultNodes).last());
	    return this.trigger('valuechanged');

	},

	fontColor : function(hex,isDefault,coloredText) {
        var range = this.selection.range();
        if (!isDefault && range.collapsed) {
          textNode = document.createTextNode(coloredText);
          range.insertNode(textNode);
          range.selectNodeContents(textNode);
        }
        this.selection.range(range);
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, hex);
        document.execCommand('styleWithCSS', false, false);
        if (!this.util.support.oninput) {
          return this.trigger('valuechanged');
        }

	},

	fontScale : function(param,sizeMap) {
  		if (!sizeMap){
  			sizeMap = {
			    'x-large': '1.5em',
			    'large': '1.25em',
			    'small': '.75em',
			    'x-small': '.5em'
		   };
		}

	    var $scales, containerNode, range;
	    range = this.selection.range();
	    if (range.collapsed) {
	      return;
	    }
	    this.selection.range(range);
	    document.execCommand('styleWithCSS', false, true);
	    document.execCommand('fontSize', false, param);
	    document.execCommand('styleWithCSS', false, false);
	    this.selection.reset();
	    this.selection.range();
	    containerNode = this.selection.containerNode();
	    if (containerNode[0].nodeType === Node.TEXT_NODE) {
	      $scales = containerNode.closest('span[style*="font-size"]');
	    } else {
	      $scales = containerNode.find('span[style*="font-size"]');
	    }
	    $scales.each((function(_this) {
	      return function(i, n) {
	        var $span, size;
	        $span = $(n);
	        size = n.style.fontSize;
	        if (/large|x-large|small|x-small/.test(size)) {
	          return $span.css('fontSize', sizeMap[size]);
	        } else if (size === 'medium') {
	          if ($span[0].style.length > 1) {
	            return $span.css('fontSize', '');
	          } else {
	            return $span.replaceWith($span.contents());
	          }
	        }
	      };
	    })(this));
	    return this.trigger('valuechanged');
	},

	hr : function() {
	    var $hr, $newBlock, $nextBlock, $rootBlock;
	    $rootBlock = this.selection.rootNodes().first();
	    $nextBlock = $rootBlock.next();
	    if ($nextBlock.length > 0) {
	      this.selection.save();
	    } else {
	      $newBlock = $('<p/>').append(this.util.phBr);
	    }
	    $hr = $('<hr/>').insertAfter($rootBlock);
	    if ($newBlock) {
	      $newBlock.insertAfter($hr);
	      this.selection.setRangeAtStartOf($newBlock);
	    } else {
	      this.selection.restore();
	    }
	    return this.trigger('valuechanged');
	},

	inlineCode : function(active) {
	    var $code, $contents, range;
	    range = this.selection.range();
	    if (this.active) {
	      range.selectNodeContents(this.node[0]);
	      this.selection.save(range);
	      this.node.contents().unwrap();
	      this.selection.restore();
	    } else {
	      $contents = $(range.extractContents());
	      $code = $("<" + this.htmlTag + "/>").append($contents.contents());
	      range.insertNode($code[0]);
	      range.selectNodeContents($code[0]);
	      this.selection.range(range);
	    }
	    return this.trigger('valuechanged');

	},

	indent : function() {
	    return this.indentation.indent();
	},

	link : function(active,defaultLinkText) {
	    var $contents, $link, $newBlock, linkText, range, txtNode;
	    range = this.selection.range();
	    if (active) {
		  var node = this.selection.startNodes();
	      txtNode = document.createTextNode(node.text());
	      node.replaceWith(txtNode);
	      range.selectNode(txtNode);
	    } else {
	      $contents = $(range.extractContents());
	      linkText = this.formatter.clearHtml($contents.contents(), false);
	      $link = $('<a/>', {
	        href: '',
	        target: '_blank',
	        text: linkText || defaultLinkText
	      });
	      if (this.selection.blockNodes().length > 0) {
	        range.insertNode($link[0]);
	      } else {
	        $newBlock = $('<p/>').append($link);
	        range.insertNode($newBlock[0]);
	      }
	      range.selectNodeContents($link[0]);
	    }
	    this.selection.range(range);
	    return this.trigger('valuechanged');

	},

	list : function(type,param,disableTag) {
      var $list, $rootNodes, anotherType;
      $rootNodes = this.selection.blockNodes();
      anotherType = type === 'ul' ? 'ol' : 'ul';
      this.selection.save();
      $list = null;
      $rootNodes.each((function(_this) {
        return function(i, node) {
          var $node;
          $node = $(node);
          if ($node.is('blockquote, li') || $node.is(disableTag) || _this.util.isDecoratedNode($node) || !noder.contains(document, node)) {
            return;
          }
          if ($node.is(type)) {
            $node.children('li').each(function(i, li) {
              var $childList, $li;
              $li = $(li);
              $childList = $li.children('ul, ol').insertAfter($node);
              return $('<p/>').append($(li).html() || _this.util.phBr).insertBefore($node);
            });
            return $node.remove();
          } else if ($node.is(anotherType)) {
            return $('<' + type + '/>').append($node.contents()).replaceAll($node);
          } else if ($list && $node.prev().is($list)) {
            $('<li/>').append($node.html() || _this.util.phBr).appendTo($list);
            return $node.remove();
          } else {
            $list = $("<" + type + "><li></li></" + type + ">");
            $list.find('li').append($node.html() || _this.util.phBr);
            return $list.replaceAll($node);
          }
        };
      })(this));
      this.selection.restore();
      return this.trigger('valuechanged');

	},

	outdent : function() {
	    return this.indentation.indent(true);
	},

	// toggle
	title : function(param,disableTag) {
	    var $rootNodes;
	    $rootNodes = this.selection.rootNodes();
	    this.selection.save();
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if ($node.is('blockquote') || $node.is(param) || $node.is(disableTag) || _this.util.isDecoratedNode($node)) {
	          return;
	        }
	        return $('<' + param + '/>').append($node.contents()).replaceAll($node);
	      };
	    })(this));
	    this.selection.restore();
	    return this.trigger('valuechanged');

	}



  });

	var commands =  [
		"bold", // toggle 
		"insertImage",
		"insertorderedlist",
		"insertunorderedlist",
		"italic", // toggle
		"justifyLeft",
		"justifyCenter",
		"justifyFull",
		"justifyRight",
		"strikethrough",
		"underline",
		"undo"
	];

	commands.forEach(function(cmd){
		Editable.prototype[cmd] = function() {
	      document.execCommand(cmd,false,null);
	      if (!this.util.support.oninput) {
	        this.trigger('valuechanged');
	      }
	      return $(document).trigger('selectionchange');					
		};
	});


	function editable(el,opts) {

		/*	
		if (value === undefined) {
   			return node.contentEditable == "true"
		} else {
			if (!value) {
				value = null;
			} else {
				value = "true";
			}
			datax.attr(node,"contentEditable",value);
		}
		*/
		return new Editable(el,opts);
		
	};


	return contents.Editable  = Editable;
	
});
define('skylark-domx-eventer/eventer',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-finder",
    "skylark-domx-noder",
    "skylark-domx-data"
], function(skylark, langx, browser, finder, noder, datax) {
    var mixin = langx.mixin,
        each = langx.each,
        slice = Array.prototype.slice,
        uid = langx.uid,
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
        eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        },
        readyRE = /complete|loaded|interactive/;

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            if (!source) {
                source = event;
            }

            langx.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                    this[predicate] = langx.returnTrue;
                    return sourceMethod && sourceMethod.apply(source, arguments);
                }
                event[predicate] = langx.returnFalse;
            });
        }
        return event;
    }

    function parse(event) {
        var segs = ("" + event).split(".");
        return {
            type: segs[0],
            ns: segs.slice(1).sort().join(" ")
        };
    }

    //create a custom dom event
    var createEvent = (function() {
        var EventCtors = [
                window["CustomEvent"], // 0 default
                window["CompositionEvent"], // 1
                window["DragEvent"], // 2
                window["Event"], // 3
                window["FocusEvent"], // 4
                window["KeyboardEvent"], // 5
                window["MessageEvent"], // 6
                window["MouseEvent"], // 7
                window["MouseScrollEvent"], // 8
                window["MouseWheelEvent"], // 9
                window["MutationEvent"], // 10
                window["ProgressEvent"], // 11
                window["TextEvent"], // 12
                window["TouchEvent"], // 13
                window["UIEvent"], // 14
                window["WheelEvent"], // 15
                window["ClipboardEvent"] // 16
            ],
            NativeEvents = {
                "compositionstart": 1, // CompositionEvent
                "compositionend": 1, // CompositionEvent
                "compositionupdate": 1, // CompositionEvent

                "beforecopy": 16, // ClipboardEvent
                "beforecut": 16, // ClipboardEvent
                "beforepaste": 16, // ClipboardEvent
                "copy": 16, // ClipboardEvent
                "cut": 16, // ClipboardEvent
                "paste": 16, // ClipboardEvent

                "drag": 2, // DragEvent
                "dragend": 2, // DragEvent
                "dragenter": 2, // DragEvent
                "dragexit": 2, // DragEvent
                "dragleave": 2, // DragEvent
                "dragover": 2, // DragEvent
                "dragstart": 2, // DragEvent
                "drop": 2, // DragEvent

                "abort": 3, // Event
                "change": 3, // Event
                "error": 3, // Event
                "selectionchange": 3, // Event
                "submit": 3, // Event
                "reset": 3, // Event

                "focus": 4, // FocusEvent
                "blur": 4, // FocusEvent
                "focusin": 4, // FocusEvent
                "focusout": 4, // FocusEvent

                "keydown": 5, // KeyboardEvent
                "keypress": 5, // KeyboardEvent
                "keyup": 5, // KeyboardEvent

                "message": 6, // MessageEvent

                "click": 7, // MouseEvent
                "contextmenu": 7, // MouseEvent
                "dblclick": 7, // MouseEvent
                "mousedown": 7, // MouseEvent
                "mouseup": 7, // MouseEvent
                "mousemove": 7, // MouseEvent
                "mouseover": 7, // MouseEvent
                "mouseout": 7, // MouseEvent
                "mouseenter": 7, // MouseEvent
                "mouseleave": 7, // MouseEvent


                "textInput": 12, // TextEvent

                "touchstart": 13, // TouchEvent
                "touchmove": 13, // TouchEvent
                "touchend": 13, // TouchEvent

                "load": 14, // UIEvent
                "resize": 14, // UIEvent
                "select": 14, // UIEvent
                "scroll": 14, // UIEvent
                "unload": 14, // UIEvent,

                "wheel": 15 // WheelEvent
            };

        function getEventCtor(type) {
            var idx = NativeEvents[type];
            if (!idx) {
                idx = 0;
            }
            return EventCtors[idx];
        }

        return function(type, props) {
            //create a custom dom event

            if (langx.isString(type)) {
                props = props || {};
            } else {
                props = type || {};
                type = props.type || "";
            }
            var parsed = parse(type);
            type = parsed.type;

            props = langx.mixin({
                bubbles: true,
                cancelable: true
            }, props);

            if (parsed.ns) {
                props.namespace = parsed.ns;
            }

            var ctor = getEventCtor(type),
                e = new ctor(type, props);

            langx.safeMixin(e, props);

            return compatible(e);
        };
    })();

    function createProxy(src, props) {
        var key,
            proxy = {
                originalEvent: src
            };
        for (key in src) {
            if (key !== "keyIdentifier" && !ignoreProperties.test(key) && src[key] !== undefined) {
                proxy[key] = src[key];
            }
        }
        if (props) {
            langx.mixin(proxy, props);
        }
        return compatible(proxy, src);
    }

    var
        specialEvents = {},
        focusinSupported = "onfocusin" in window,
        focus = { focus: "focusin", blur: "focusout" },
        hover = { mouseenter: "mouseover", mouseleave: "mouseout" },
        realEvent = function(type) {
            return hover[type] || (focusinSupported && focus[type]) || type;
        },
        handlers = {},
        EventBindings = langx.klass({
            init: function(target, event) {
                this._target = target;
                this._event = event;
                this._bindings = [];
            },

            add: function(fn, options) {
                var bindings = this._bindings,
                    binding = {
                        fn: fn,
                        options: langx.mixin({}, options)
                    };

                bindings.push(binding);

                var self = this;
                if (!self._listener) {
                    self._listener = function(domEvt) {
                        var elm = this,
                            e = createProxy(domEvt),
                            args = domEvt._args,
                            bindings = self._bindings,
                            ns = e.namespace;

                        if (langx.isDefined(args)) {
                            args = [e].concat(args);
                        } else {
                            args = [e];
                        }

                        langx.each(bindings, function(idx, binding) {
                            var match = elm;
                            if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                                return false;
                            }
                            var fn = binding.fn,
                                options = binding.options || {},
                                selector = options.selector,
                                one = options.one,
                                data = options.data;

                            if (ns && ns != options.ns && options.ns.indexOf(ns) === -1) {
                                return;
                            }
                            if (selector) {
                                match = finder.closest(e.target, selector);
                                if (match && match !== elm) {
                                    langx.mixin(e, {
                                        currentTarget: match,
                                        liveFired: elm
                                    });
                                } else {
                                    return;
                                }
                            }

                            var originalEvent = self._event;
                            if (originalEvent in hover) {
                                var related = e.relatedTarget;
                                if (related && (related === match || noder.contains(match, related))) {
                                    return;
                                }
                            }

                            if (langx.isDefined(data)) {
                                e.data = data;
                            }

                            if (one) {
                                self.remove(fn, options);
                            }

                            var result = fn.apply(match, args);

                            if (result === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });;
                    };

                    var event = self._event;
                    /*
                                        if (event in hover) {
                                            var l = self._listener;
                                            self._listener = function(e) {
                                                var related = e.relatedTarget;
                                                if (!related || (related !== this && !noder.contains(this, related))) {
                                                    return l.apply(this, arguments);
                                                }
                                            }
                                        }
                    */

                    if (self._target.addEventListener) {
                        self._target.addEventListener(realEvent(event), self._listener, false);
                    } else {
                        console.warn("invalid eventer object", self._target);
                    }
                }

            },
            remove: function(fn, options) {
                options = langx.mixin({}, options);

                function matcherFor(ns) {
                    return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
                }
                var matcher;
                if (options.ns) {
                    matcher = matcherFor(options.ns);
                }

                this._bindings = this._bindings.filter(function(binding) {
                    var removing = (!fn || fn === binding.fn) &&
                        (!matcher || matcher.test(binding.options.ns)) &&
                        (!options.selector || options.selector == binding.options.selector);

                    return !removing;
                });
                if (this._bindings.length == 0) {
                    if (this._target.removeEventListener) {
                        this._target.removeEventListener(realEvent(this._event), this._listener, false);
                    }
                    this._listener = null;
                }
            }
        }),
        EventsHandler = langx.klass({
            init: function(elm) {
                this._target = elm;
                this._handler = {};
            },

            // add a event listener
            // selector Optional
            register: function(event, callback, options) {
                // Seperate the event from the namespace
                var parsed = parse(event),
                    event = parsed.type,
                    specialEvent = specialEvents[event],
                    bindingEvent = specialEvent && (specialEvent.bindType || specialEvent.bindEventName);

                var events = this._handler;

                // Check if there is already a handler for this event
                if (events[event] === undefined) {
                    events[event] = new EventBindings(this._target, bindingEvent || event);
                }

                // Register the new callback function
                events[event].add(callback, langx.mixin({
                    ns: parsed.ns
                }, options)); // options:{selector:xxx}
            },

            // remove a event listener
            unregister: function(event, fn, options) {
                // Check for parameter validtiy
                var events = this._handler,
                    parsed = parse(event);
                event = parsed.type;

                if (event) {
                    var listener = events[event];

                    if (listener) {
                        listener.remove(fn, langx.mixin({
                            ns: parsed.ns
                        }, options));
                    }
                } else {
                    //remove all events
                    for (event in events) {
                        var listener = events[event];
                        listener.remove(fn, langx.mixin({
                            ns: parsed.ns
                        }, options));
                    }
                }
            }
        }),

        findHandler = function(elm) {
            var id = uid(elm),
                handler = handlers[id];
            if (!handler) {
                handler = handlers[id] = new EventsHandler(elm);
            }
            return handler;
        };

    /*   
     * Remove an event handler for one or more events from the specified element.
     * @param {HTMLElement} elm  
     * @param {String} events
     * @param {String　Optional } selector
     * @param {Function} callback
     */
    function off(elm, events, selector, callback) {
        var $this = this
        if (langx.isPlainObject(events)) {
            langx.each(events, function(type, fn) {
                off(elm, type, selector, fn);
            })
            return $this;
        }

        if (!langx.isString(selector) && !langx.isFunction(callback) && callback !== false) {
            callback = selector;
            selector = undefined;
        }

        if (callback === false) {
            callback = langx.returnFalse;
        }

        if (typeof events == "string") {
            if (events.indexOf(",") > -1) {
                events = events.split(",");
            } else {
                events = events.split(/\s/);
            }
        }

        var handler = findHandler(elm);

        if (events) events.forEach(function(event) {

            handler.unregister(event, callback, {
                selector: selector,
            });
        });
        return this;
    }

    /*   
     * Attach an event handler function for one or more events to the selected elements.
     * @param {HTMLElement} elm  
     * @param {String} events
     * @param {String　Optional} selector
     * @param {Anything Optional} data
     * @param {Function} callback
     * @param {Boolean　Optional} one
     */
    function on(elm, events, selector, data, callback, one) {

        var autoRemove, delegator;
        if (langx.isPlainObject(events)) {
            langx.each(events, function(type, fn) {
                on(elm, type, selector, data, fn, one);
            });
            return this;
        }

        if (!langx.isString(selector) && !langx.isFunction(callback)) {
            callback = data;
            data = selector;
            selector = undefined;
        }

        if (langx.isFunction(data)) {
            callback = data;
            data = undefined;
        }

        if (callback === false) {
            callback = langx.returnFalse;
        }

        if (typeof events == "string") {
            if (events.indexOf(",") > -1) {
                events = events.split(",");
            } else {
                events = events.split(/\s/);
            }
        }

        var handler = findHandler(elm);

        events.forEach(function(event) {
            if (event == "ready") {
                return ready(callback);
            }
            handler.register(event, callback, {
                data: data,
                selector: selector,
                one: !!one
            });
        });
        return this;
    }

    /*   
     * Attach a handler to an event for the elements. The handler is executed at most once per 
     * @param {HTMLElement} elm  
     * @param {String} event
     * @param {String　Optional} selector
     * @param {Anything Optional} data
     * @param {Function} callback
     */
    function one(elm, events, selector, data, callback) {
        on(elm, events, selector, data, callback, 1);

        return this;
    }

    /*   
     * Prevents propagation and clobbers the default action of the passed event. The same as calling event.preventDefault() and event.stopPropagation(). 
     * @param {String} event
     */
    function stop(event) {
        if (window.document.all) {
            event.keyCode = 0;
        }
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }
        return this;
    }
    /*   
     * Execute all handlers and behaviors attached to the matched elements for the given event  
     * @param {String} evented
     * @param {String} type
     * @param {Array or PlainObject } args
     */
    function trigger(evented, type, args) {
        var e;
        if (type instanceof Event) {
            e = type;
        } else {
            e = createEvent(type, args);
        }
        e._args = args;

        var fn = (evented.dispatchEvent || evented.trigger);
        if (fn) {
            fn.call(evented, e);
        } else {
            console.warn("The evented parameter is not a eventable object");
        }

        return this;
    }
    /*   
     * Specify a function to execute when the DOM is fully loaded.  
     * @param {Function} callback
     */
    function ready(callback) {
        // need to check if document.body exists for IE as that browser reports
        // document ready when it hasn't yet created the body elm
        if (readyRE.test(document.readyState) && document.body) {
            langx.defer(callback);
        } else {
            document.addEventListener('DOMContentLoaded', callback, false);
        }

        return this;
    }

    var keyCodeLookup = {
        "backspace": 8,
        "comma": 188,
        "delete": 46,
        "down": 40,
        "end": 35,
        "enter": 13,
        "escape": 27,
        "home": 36,
        "left": 37,
        "page_down": 34,
        "page_up": 33,
        "period": 190,
        "right": 39,
        "space": 32,
        "tab": 9,
        "up": 38
    };
    //example:
    //shortcuts(elm).add("CTRL+ALT+SHIFT+X",function(){console.log("test!")});
    function shortcuts(elm) {

        var registry = datax.data(elm, "shortcuts");
        if (!registry) {
            registry = {};
            datax.data(elm, "shortcuts", registry);
            var run = function(shortcut, event) {
                var n = event.metaKey || event.ctrlKey;
                if (shortcut.ctrl == n && shortcut.alt == event.altKey && shortcut.shift == event.shiftKey) {
                    if (event.keyCode == shortcut.keyCode || event.charCode && event.charCode == shortcut.charCode) {
                        event.preventDefault();
                        if ("keydown" == event.type) {
                            shortcut.fn(event);
                        }
                        return true;
                    }
                }
            };
            on(elm, "keyup keypress keydown", function(event) {
                if (!(/INPUT|TEXTAREA/.test(event.target.nodeName))) {
                    for (var key in registry) {
                        run(registry[key], event);
                    }
                }
            });

        }

        return {
            add: function(pattern, fn) {
                var shortcutKeys;
                if (pattern.indexOf(",") > -1) {
                    shortcutKeys = pattern.toLowerCase().split(",");
                } else {
                    shortcutKeys = pattern.toLowerCase().split(" ");
                }
                shortcutKeys.forEach(function(shortcutKey) {
                    var setting = {
                        fn: fn,
                        alt: false,
                        ctrl: false,
                        shift: false
                    };
                    shortcutKey.split("+").forEach(function(key) {
                        switch (key) {
                            case "alt":
                            case "ctrl":
                            case "shift":
                                setting[key] = true;
                                break;
                            default:
                                setting.charCode = key.charCodeAt(0);
                                setting.keyCode = keyCodeLookup[key] || key.toUpperCase().charCodeAt(0);
                        }
                    });
                    var regKey = (setting.ctrl ? "ctrl" : "") + "," + (setting.alt ? "alt" : "") + "," + (setting.shift ? "shift" : "") + "," + setting.keyCode;
                    registry[regKey] = setting;
                })
            }

        };

    }

    if (browser.support.transition) {
        specialEvents.transitionEnd = {
//          handle: function (e) {
//            if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
//          },
          bindType: browser.support.transition.end,
          delegateType: browser.support.transition.end
        }        
    }

    function eventer() {
        return eventer;
    }

    langx.mixin(eventer, {
        create: createEvent,

        keys: keyCodeLookup,

        off: off,

        on: on,

        one: one,

        proxy: createProxy,

        ready: ready,

        shortcuts: shortcuts,

        special: specialEvents,

        stop: stop,

        trigger: trigger

    });

    return skylark.attach("domx.eventer",eventer);
});
define('skylark-domx-eventer/main',[
    "skylark-langx/langx",
    "./eventer",
    "skylark-domx-velm",
    "skylark-domx-query"        
],function(langx,eventer,velm,$){

    // from ./eventer
    velm.delegate([
        "off",
        "on",
        "one",
        "shortcuts",
        "trigger"
    ], eventer);

    // events
    var events = [ 'keyUp', 'keyDown', 'mouseOver', 'mouseOut', 'click', 'dblClick', 'change' ];

    events.forEach( function ( event ) {

        var method = event;

        velm.VisualElement.prototype[method ] = function ( callback ) {

            this.on( event.toLowerCase(), callback);

            return this;
        };

    });

    $.fn.on = $.wraps.wrapper_every_act(eventer.on, eventer);

    $.fn.off = $.wraps.wrapper_every_act(eventer.off, eventer);

    $.fn.trigger = $.wraps.wrapper_every_act(eventer.trigger, eventer);

    ('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error transitionEnd').split(' ').forEach(function(event) {
        $.fn[event] = function(data, callback) {
            return (0 in arguments) ?
                this.on(event, data, callback) :
                this.trigger(event)
        }
    });

    $.fn.one = function(event, selector, data, callback) {
        if (!langx.isString(selector) && !langx.isFunction(callback)) {
            callback = data;
            data = selector;
            selector = null;
        }

        if (langx.isFunction(data)) {
            callback = data;
            data = null;
        }

        return this.on(event, selector, data, callback, 1)
    }; 

    $.ready = eventer.ready;

    return eventer;
});
define('skylark-domx-eventer', ['skylark-domx-eventer/main'], function (main) { return main; });

define('skylark-domx-files/files',[
    "skylark-langx/skylark"
], function(skylark) {

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }


    var files = function() {
        return files;
    };

    return skylark.attach("domx.files", files);
});
define('skylark-domx-styler/styler',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {
    var every = Array.prototype.every,
        forEach = Array.prototype.forEach,
        camelCase = langx.camelCase,
        dasherize = langx.dasherize;

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    var cssNumber = {
            'column-count': 1,
            'columns': 1,
            'font-weight': 1,
            'line-height': 1,
            'opacity': 1,
            'z-index': 1,
            'zoom': 1
        },
        classReCache = {

        };

    function classRE(name) {
        return name in classReCache ?
            classReCache[name] : (classReCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
    }

    // access className property while respecting SVGAnimatedString
    /*
     * Adds the specified class(es) to each element in the set of matched elements.
     * @param {HTMLElement} node
     * @param {String} value
     */
    function className(node, value) {
        var klass = node.className || '',
            svg = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }

    function disabled(elm, value ) {
        if (arguments.length < 2) {
            return !!this.dom.disabled;
        }

        elm.disabled = value;

        return this;
    }

    var elementDisplay = {};

    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getStyles(element).getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }
    /*
     * Display the matched elements.
     * @param {HTMLElement} elm
     */
    function show(elm) {
        styler.css(elm, "display", "");
        if (styler.css(elm, "display") == "none") {
            styler.css(elm, "display", defaultDisplay(elm.nodeName));
        }
        return this;
    }

    function isInvisible(elm) {
        return styler.css(elm, "display") == "none" || styler.css(elm, "opacity") == 0;
    }

    /*
     * Hide the matched elements.
     * @param {HTMLElement} elm
     */
    function hide(elm) {
        styler.css(elm, "display", "none");
        return this;
    }

    /*
     * Adds the specified class(es) to each element in the set of matched elements.
     * @param {HTMLElement} elm
     * @param {String} name
     */
    function addClass(elm, name) {
        if (!name) return this
        var cls = className(elm),
            names;
        if (langx.isString(name)) {
            names = name.split(/\s+/g);
        } else {
            names = name;
        }
        names.forEach(function(klass) {
            var re = classRE(klass);
            if (!cls.match(re)) {
                cls += (cls ? " " : "") + klass;
            }
        });

        className(elm, cls);

        return this;
    }

    function getStyles( elem ) {

        // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;

        if ( !view || !view.opener ) {
            view = window;
        }

        return view.getComputedStyle( elem);
    }


    /*
     * Get the value of a computed style property for the first element in the set of matched elements or set one or more CSS properties for every matched element.
     * @param {HTMLElement} elm
     * @param {String} property
     * @param {Any} value
     */
    function css(elm, property, value) {
        if (arguments.length < 3) {
            var computedStyle,
                computedStyle = getStyles(elm)
            if (langx.isString(property)) {
                return elm.style[camelCase(property)] || computedStyle.getPropertyValue(dasherize(property))
            } else if (langx.isArrayLike(property)) {
                var props = {}
                forEach.call(property, function(prop) {
                    props[prop] = (elm.style[camelCase(prop)] || computedStyle.getPropertyValue(dasherize(prop)))
                })
                return props
            }
        }

        var css = '';
        if (typeof(property) == 'string') {
            if (!value && value !== 0) {
                elm.style.removeProperty(dasherize(property));
            } else {
                css = dasherize(property) + ":" + maybeAddPx(property, value)
            }
        } else {
            for (key in property) {
                if (property[key] === undefined) {
                    continue;
                }
                if (!property[key] && property[key] !== 0) {
                    elm.style.removeProperty(dasherize(key));
                } else {
                    css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
                }
            }
        }

        elm.style.cssText += ';' + css;
        return this;
    }

    /*
     * Determine whether any of the matched elements are assigned the given class.
     * @param {HTMLElement} elm
     * @param {String} name
     */
    function hasClass(elm, name) {
        var re = classRE(name);
        return elm.className && elm.className.match(re);
    }

    /*
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     * @param {HTMLElement} elm
     * @param {String} name
     */
    function removeClass(elm, name) {
        if (name) {
            var cls = className(elm),
                names;

            if (langx.isString(name)) {
                names = name.split(/\s+/g);
            } else {
                names = name;
            }

            names.forEach(function(klass) {
                var re = classRE(klass);
                if (cls.match(re)) {
                    cls = cls.replace(re, " ");
                }
            });

            className(elm, cls.trim());
        } else {
            className(elm, "");
        }

        return this;
    }

    /*
     * Add or remove one or more classes from the specified element.
     * @param {HTMLElement} elm
     * @param {String} name
     * @param {} when
     */
    function toggleClass(elm, name, when) {
        var self = this;
        name.split(/\s+/g).forEach(function(klass) {
            if (when === undefined) {
                when = !self.hasClass(elm, klass);
            }
            if (when) {
                self.addClass(elm, klass);
            } else {
                self.removeClass(elm, klass)
            }
        });

        return self;
    }

    var styler = function() {
        return styler;
    };

    langx.mixin(styler, {
        autocssfix: false,
        cssHooks: {

        },

        addClass: addClass,
        className: className,
        css: css,
        disabled : disabled,        
        hasClass: hasClass,
        hide: hide,
        isInvisible: isInvisible,
        removeClass: removeClass,
        show: show,
        toggleClass: toggleClass
    });

    return skylark.attach("domx.styler", styler);
});
define('skylark-domx-styler/main',[
	"./styler",
	"skylark-domx-velm",
	"skylark-domx-query"	
],function(styler,velm,$){
	
    // from ./styler
    velm.delegate([
        "addClass",
        "className",
        "css",
        "hasClass",
        "hide",
        "isInvisible",
        "removeClass",
        "show",
        "toggleClass"
    ], styler);

    // properties

    var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
    'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
    'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

    properties.forEach( function ( property ) {

        var method = property;

        velm.VisualElement.prototype[method ] = function (value) {

            this.css( property, value );

            return this;

        };

    });


    $.fn.style = $.wraps.wrapper_name_value(styler.css, styler);

    $.fn.css = $.wraps.wrapper_name_value(styler.css, styler);

    //hasClass(name)
    $.fn.hasClass = $.wraps.wrapper_some_chk(styler.hasClass, styler);

    //addClass(name)
    $.fn.addClass = $.wraps.wrapper_every_act_firstArgFunc(styler.addClass, styler, styler.className);

    //removeClass(name)
    $.fn.removeClass = $.wraps.wrapper_every_act_firstArgFunc(styler.removeClass, styler, styler.className);

    //toogleClass(name,when)
    $.fn.toggleClass = $.wraps.wrapper_every_act_firstArgFunc(styler.toggleClass, styler, styler.className);

    $.fn.replaceClass = function(newClass, oldClass) {
        this.removeClass(oldClass);
        this.addClass(newClass);
        return this;
    };

    $.fn.replaceClass = function(newClass, oldClass) {
        this.removeClass(oldClass);
        this.addClass(newClass);
        return this;
    };
        
	return styler;
});
define('skylark-domx-styler', ['skylark-domx-styler/main'], function (main) { return main; });

define('skylark-storages-diskfs/diskfs',[
    "skylark-langx/skylark"
], function(skylark) {

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }


    var diskfs = function() {
        return diskfs;
    };

    return skylark.attach("storages.diskfs", diskfs);
});
 define('skylark-storages-diskfs/webentry',[
    "skylark-langx/arrays",
    "skylark-langx/Deferred",
    "./diskfs"
],function(arrays,Deferred, diskfs){
    var concat = Array.prototype.concat;
    var webentry = (function() {
        function one(entry, path) {
            var d = new Deferred(),
                onError = function(e) {
                    d.reject(e);
                };

            path = path || '';
            if (entry.isFile) {
                entry.file(function(file) {
                    file.relativePath = path;
                    d.resolve(file);
                }, onError);
            } else if (entry.isDirectory) {
                var dirReader = entry.createReader();
                dirReader.readEntries(function(entries) {
                    all(
                        entries,
                        path + entry.name + '/'
                    ).then(function(files) {
                        d.resolve(files);
                    }).catch(onError);
                }, onError);
            } else {
                // Return an empy list for file system items
                // other than files or directories:
                d.resolve([]);
            }
            return d.promise;
        }

        function all(entries, path) {
            return Deferred.all(
                arrays.map(entries, function(entry) {
                    return one(entry, path);
                })
            ).then(function() {
                return concat.apply([], arguments);
            });
        }

        return {
            one: one,
            all: all
        };
    })();

    return diskfs.webentry = webentry;
});
  define('skylark-domx-files/dropzone',[
    "skylark-langx/arrays",
    "skylark-langx/Deferred",
    "skylark-domx-styler",
    "skylark-domx-eventer",
    "./files",
    "skylark-storages-diskfs/webentry"
],function(arrays,Deferred, styler, eventer, files, webentry){  /*
     * Make the specified element to could accept HTML5 file drag and drop.
     * @param {HTMLElement} elm
     * @param {PlainObject} params
     */
    function dropzone(elm, params) {
        params = params || {};
        var hoverClass = params.hoverClass || "dropzone",
            droppedCallback = params.dropped;

        var enterdCount = 0;
        eventer.on(elm, "dragenter", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files") > -1) {
                eventer.stop(e);
                enterdCount++;
                styler.addClass(elm, hoverClass)
            }
        });

        eventer.on(elm, "dragover", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files") > -1) {
                eventer.stop(e);
            }
        });

        eventer.on(elm, "dragleave", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files") > -1) {
                enterdCount--
                if (enterdCount == 0) {
                    styler.removeClass(elm, hoverClass);
                }
            }
        });

        eventer.on(elm, "drop", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files") > -1) {
                styler.removeClass(elm, hoverClass)
                eventer.stop(e);
                if (droppedCallback) {
                    var items = e.dataTransfer.items;
                    if (items && items.length && (items[0].webkitGetAsEntry ||
                            items[0].getAsEntry)) {
                        webentry.all(
                            arrays.map(items, function(item) {
                                if (item.webkitGetAsEntry) {
                                    return item.webkitGetAsEntry();
                                }
                                return item.getAsEntry();
                            })
                        ).then(droppedCallback);
                    } else {
                        droppedCallback(e.dataTransfer.files);
                    }
                }
            }
        });

        return this;
    }

     return files.dropzone = dropzone;
});
define('skylark-domx-files/pastezone',[
    "skylark-langx/objects",
    "skylark-domx-eventer",
    "./files"
],function(objects, eventer, files){
    function pastezone(elm, params) {
        params = params || {};
        var hoverClass = params.hoverClass || "pastezone",
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

    return files.pastezone = pastezone;

});

define('skylark-storages-diskfs/select',[
    "./diskfs"
],function(diskfs){
    var fileInput,
        fileInputForm,
        fileSelected,
        maxFileSize = 1 / 0;

    function select(params) {
        params = params || {};
        var directory = params.directory || false,
            multiple = params.multiple || false,
            fileSelected = params.picked;
        if (!fileInput) {
            var input = fileInput = document.createElement("input");

            function selectFiles(pickedFiles) {
                for (var i = pickedFiles.length; i--;) {
                    if (pickedFiles[i].size > maxFileSize) {
                        pickedFiles.splice(i, 1);
                    }
                }
                fileSelected(pickedFiles);
            }

            input.type = "file";
            input.style.position = "fixed";
            input.style.left = 0;
            input.style.top = 0;
            input.style.opacity = .001;
            document.body.appendChild(input);

            input.onchange = function(e) {
                var entries = e.target.webkitEntries || e.target.entries;

                if (entries && entries.length) {
                    webentry.all(entries).then(function(files) {
                        selectFiles(files);
                    });
                } else {
                    selectFiles(Array.prototype.slice.call(e.target.files));
                }
                // reset to "", so selecting the same file next time still trigger the change handler
                input.value = "";
            };
        }
        fileInput.multiple = multiple;
        fileInput.webkitdirectory = directory;
        fileInput.click();
    }

    return diskfs.select = select;
});


define('skylark-domx-files/picker',[
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



define('skylark-domx-files/main',[
	"./files",
	"skylark-domx-velm",
	"skylark-domx-query",
	"./dropzone",
	"./pastezone",
	"./picker"
],function(files,velm,$){
	velm.delegate([
		"dropzone",
		"pastezone",
		"picker"
	],files);

    $.fn.pastezone = $.wraps.wrapper_every_act(files.pastezone, files);
    $.fn.dropzone = $.wraps.wrapper_every_act(files.dropzone, files);
    $.fn.picker = $.wraps.wrapper_every_act(files.picker, files);

	return files;
});
define('skylark-domx-files', ['skylark-domx-files/main'], function (main) { return main; });

define('skylark-domx-geom/geom',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-styler"
], function(skylark, langx, noder, styler) {
    var rootNodeRE = /^(?:body|html)$/i,
        px = langx.toPixel,
        offsetParent = noder.offsetParent,
        cachedScrollbarWidth;

    function scrollbarWidth() {
        if (cachedScrollbarWidth !== undefined) {
            return cachedScrollbarWidth;
        }
        var w1, w2,
            div = noder.createFragment("<div style=" +
                "'display:block;position:absolute;width:200px;height:200px;overflow:hidden;'>" +
                "<div style='height:300px;width:auto;'></div></div>")[0],
            innerDiv = div.childNodes[0];

        noder.append(document.body, div);

        w1 = innerDiv.offsetWidth;

        styler.css(div, "overflow", "scroll");

        w2 = innerDiv.offsetWidth;

        if (w1 === w2) {
            w2 = div[0].clientWidth;
        }

        noder.remove(div);

        return (cachedScrollbarWidth = w1 - w2);
    }
    /*
     * Get the widths of each border of the specified element.
     * @param {HTMLElement} elm
     */
    function borderExtents(elm) {
        if (noder.isWindow(elm)) {
            return {
                left : 0,
                top : 0,
                right : 0,
                bottom : 0
            }
        }        var s = getComputedStyle(elm);
        return {
            left: px(s.borderLeftWidth, elm),
            top: px(s.borderTopWidth, elm),
            right: px(s.borderRightWidth, elm),
            bottom: px(s.borderBottomWidth, elm)
        }
    }

    //viewport coordinate
    /*
     * Get or set the viewport position of the specified element border box.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    function boundingPosition(elm, coords) {
        if (coords === undefined) {
            return rootNodeRE.test(elm.nodeName) ? { top: 0, left: 0 } : elm.getBoundingClientRect();
        } else {
            var // Get *real* offsetParent
                parent = offsetParent(elm),
                // Get correct offsets
                parentOffset = boundingPosition(parent),
                mex = marginExtents(elm),
                pbex = borderExtents(parent);

            relativePosition(elm, {
                top: coords.top - parentOffset.top - mex.top - pbex.top,
                left: coords.left - parentOffset.left - mex.left - pbex.left
            });
            return this;
        }
    }

    /*
     * Get or set the viewport rect of the specified element border box.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    function boundingRect(elm, coords) {
        if (coords === undefined) {
            return elm.getBoundingClientRect()
        } else {
            boundingPosition(elm, coords);
            size(elm, coords);
            return this;
        }
    }

    /*
     * Get or set the height of the specified element client box.
     * @param {HTMLElement} elm
     * @param {Number} value
     */
    function clientHeight(elm, value) {
        if (value == undefined) {
            return clientSize(elm).height;
        } else {
            return clientSize(elm, {
                height: value
            });
        }
    }

    /*
     * Get or set the size of the specified element client box.
     * @param {HTMLElement} elm
     * @param {PlainObject} dimension
     */
    function clientSize(elm, dimension) {
        if (dimension == undefined) {
            return {
                width: elm.clientWidth,
                height: elm.clientHeight
            }
        } else {
            var isBorderBox = (styler.css(elm, "box-sizing") === "border-box"),
                props = {
                    width: dimension.width,
                    height: dimension.height
                };
            if (!isBorderBox) {
                var pex = paddingExtents(elm);

                if (props.width !== undefined) {
                    props.width = props.width - pex.left - pex.right;
                }

                if (props.height !== undefined) {
                    props.height = props.height - pex.top - pex.bottom;
                }
            } else {
                var bex = borderExtents(elm);

                if (props.width !== undefined) {
                    props.width = props.width + bex.left + bex.right;
                }

                if (props.height !== undefined) {
                    props.height = props.height + bex.top + bex.bottom;
                }

            }
            styler.css(elm, props);
            return this;
        }
        return {
            width: elm.clientWidth,
            height: elm.clientHeight
        };
    }

    /*
     * Get or set the width of the specified element client box.
     * @param {HTMLElement} elm
     * @param {PlainObject} dimension
     */
    function clientWidth(elm, value) {
        if (value == undefined) {
            return clientSize(elm).width;
        } else {
            clientSize(elm, {
                width: value
            });
            return this;
        }
    }

    /*
     * Get the rect of the specified element content box.
     * @param {HTMLElement} elm
     */
    function contentRect(elm) {
        var cs = clientSize(elm),
            pex = paddingExtents(elm);


        //// On Opera, offsetLeft includes the parent's border
        //if(has("opera")){
        //    pe.l += be.l;
        //    pe.t += be.t;
        //}
        return {
            left: pex.left,
            top: pex.top,
            width: cs.width - pex.left - pex.right,
            height: cs.height - pex.top - pex.bottom
        };
    }

    /*
     * Get the document size.
     * @param {HTMLDocument} doc
     */
    function getDocumentSize(doc) {
        var documentElement = doc.documentElement,
            body = doc.body,
            max = Math.max,
            scrollWidth = max(documentElement.scrollWidth, body.scrollWidth),
            clientWidth = max(documentElement.clientWidth, body.clientWidth),
            offsetWidth = max(documentElement.offsetWidth, body.offsetWidth),
            scrollHeight = max(documentElement.scrollHeight, body.scrollHeight),
            clientHeight = max(documentElement.clientHeight, body.clientHeight),
            offsetHeight = max(documentElement.offsetHeight, body.offsetHeight);

        return {
            width: scrollWidth < offsetWidth ? clientWidth : scrollWidth,
            height: scrollHeight < offsetHeight ? clientHeight : scrollHeight
        };
    }

    /*
     * Get the document size.
     * @param {HTMLElement} elm
     * @param {Number} value
     */
    function height(elm, value) {
        if (value == undefined) {
            return size(elm).height;
        } else {
            size(elm, {
                height: value
            });
            return this;
        }
    }

    /*
     * Get the widths of each margin of the specified element.
     * @param {HTMLElement} elm
     */
    function marginExtents(elm) {
        if (noder.isWindow(elm)) {
            return {
                left : 0,
                top : 0,
                right : 0,
                bottom : 0
            }
        }
        var s = getComputedStyle(elm);
        return {
            left: px(s.marginLeft),
            top: px(s.marginTop),
            right: px(s.marginRight),
            bottom: px(s.marginBottom),
        }
    }


    function marginRect(elm) {
        var obj = relativeRect(elm),
            me = marginExtents(elm);

        return {
            left: obj.left,
            top: obj.top,
            width: obj.width + me.left + me.right,
            height: obj.height + me.top + me.bottom
        };
    }


    function marginSize(elm) {
        var obj = size(elm),
            me = marginExtents(elm);

        return {
            width: obj.width + me.left + me.right,
            height: obj.height + me.top + me.bottom
        };
    }

    /*
     * Get the widths of each padding of the specified element.
     * @param {HTMLElement} elm
     */
    function paddingExtents(elm) {
        if (noder.isWindow(elm)) {
            return {
                left : 0,
                top : 0,
                right : 0,
                bottom : 0
            }
        }
        var s = getComputedStyle(elm);
        return {
            left: px(s.paddingLeft),
            top: px(s.paddingTop),
            right: px(s.paddingRight),
            bottom: px(s.paddingBottom),
        }
    }

    /*
     * Get or set the document position of the specified element border box.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    //coordinate to the document
    function pagePosition(elm, coords) {
        if (coords === undefined) {
            var obj = elm.getBoundingClientRect()
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset
            }
        } else {
            var // Get *real* offsetParent
                parent = offsetParent(elm),
                // Get correct offsets
                parentOffset = pagePosition(parent),
                mex = marginExtents(elm),
                pbex = borderExtents(parent);

            relativePosition(elm, {
                top: coords.top - parentOffset.top - mex.top - pbex.top,
                left: coords.left - parentOffset.left - mex.left - pbex.left
            });
            return this;
        }
    }

    /*
     * Get or set the document rect of the specified element border box.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    function pageRect(elm, coords) {
        if (coords === undefined) {
            var obj = elm.getBoundingClientRect()
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
            }
        } else {
            pagePosition(elm, coords);
            size(elm, coords);
            return this;
        }
    }

    /*
     * Get or set the position of the specified element border box , relative to parent element.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    // coordinate relative to it's parent
    function relativePosition(elm, coords) {
        if (coords == undefined) {
            var // Get *real* offsetParent
                parent = offsetParent(elm),
                // Get correct offsets
                offset = boundingPosition(elm),
                parentOffset = boundingPosition(parent),
                mex = marginExtents(elm),
                pbex = borderExtents(parent);

            // Subtract parent offsets and element margins
            return {
                top: offset.top - parentOffset.top - pbex.top, // - mex.top,
                left: offset.left - parentOffset.left - pbex.left, // - mex.left
            }
        } else {
            var props = {
                top: coords.top,
                left: coords.left
            }

            if (styler.css(elm, "position") == "static") {
                props['position'] = "relative";
            }
            styler.css(elm, props);
            return this;
        }
    }

    /*
     * Get or set the rect of the specified element border box , relatived to parent element.
     * @param {HTMLElement} elm
     * @param {PlainObject} coords
     */
    function relativeRect(elm, coords) {
        if (coords === undefined) {
            var // Get *real* offsetParent
                parent = offsetParent(elm),
                // Get correct offsets
                offset = boundingRect(elm),
                parentOffset = boundingPosition(parent),
                mex = marginExtents(elm),
                pbex = borderExtents(parent);

            // Subtract parent offsets and element margins
            return {
                top: offset.top - parentOffset.top - pbex.top, // - mex.top,
                left: offset.left - parentOffset.left - pbex.left, // - mex.left,
                width: offset.width,
                height: offset.height
            }
        } else {
            relativePosition(elm, coords);
            size(elm, coords);
            return this;
        }
    }
    /*
     * Scroll the specified element into view.
     * @param {HTMLElement} elm
     * @param {} align
     */
    function scrollIntoView(elm, align) {
        function getOffset(elm, rootElm) {
            var x, y, parent = elm;

            x = y = 0;
            while (parent && parent != rootElm && parent.nodeType) {
                x += parent.offsetLeft || 0;
                y += parent.offsetTop || 0;
                parent = parent.offsetParent;
            }

            return { x: x, y: y };
        }

        var parentElm = elm.parentNode;
        var x, y, width, height, parentWidth, parentHeight;
        var pos = getOffset(elm, parentElm);

        x = pos.x;
        y = pos.y;
        width = elm.offsetWidth;
        height = elm.offsetHeight;
        parentWidth = parentElm.clientWidth;
        parentHeight = parentElm.clientHeight;

        if (align == "end") {
            x -= parentWidth - width;
            y -= parentHeight - height;
        } else if (align == "center") {
            x -= (parentWidth / 2) - (width / 2);
            y -= (parentHeight / 2) - (height / 2);
        }

        parentElm.scrollLeft = x;
        parentElm.scrollTop = y;

        return this;
    }
    /*
     * Get or set the current horizontal position of the scroll bar for the specified element.
     * @param {HTMLElement} elm
     * @param {Number} value
     */
    function scrollLeft(elm, value) {
        if (elm.nodeType === 9) {
            elm = elm.defaultView;
        }
        var hasScrollLeft = "scrollLeft" in elm;
        if (value === undefined) {
            return hasScrollLeft ? elm.scrollLeft : elm.pageXOffset
        } else {
            if (hasScrollLeft) {
                elm.scrollLeft = value;
            } else {
                elm.scrollTo(value, elm.scrollY);
            }
            return this;
        }
    }
    /*
     * Get or the current vertical position of the scroll bar for the specified element.
     * @param {HTMLElement} elm
     * @param {Number} value
     */
    function scrollTop(elm, value) {
        if (elm.nodeType === 9) {
            elm = elm.defaultView;
        }
        var hasScrollTop = "scrollTop" in elm;

        if (value === undefined) {
            return hasScrollTop ? elm.scrollTop : elm.pageYOffset
        } else {
            if (hasScrollTop) {
                elm.scrollTop = value;
            } else {
                elm.scrollTo(elm.scrollX, value);
            }
            return this;
        }
    }
    /*
     * Get or set the size of the specified element border box.
     * @param {HTMLElement} elm
     * @param {PlainObject}dimension
     */
    function size(elm, dimension) {
        if (dimension == undefined) {
            if (langx.isWindow(elm)) {
                return {
                    width: elm.innerWidth,
                    height: elm.innerHeight
                }

            } else if (langx.isDocument(elm)) {
                return getDocumentSize(document);
            } else {
                return {
                    width: elm.offsetWidth,
                    height: elm.offsetHeight
                }
            }
        } else {
            var isBorderBox = (styler.css(elm, "box-sizing") === "border-box"),
                props = {
                    width: dimension.width,
                    height: dimension.height
                };
            if (!isBorderBox) {
                var pex = paddingExtents(elm),
                    bex = borderExtents(elm);

                if (props.width !== undefined && props.width !== "" && props.width !== null) {
                    props.width = props.width - pex.left - pex.right - bex.left - bex.right;
                }

                if (props.height !== undefined && props.height !== "" && props.height !== null) {
                    props.height = props.height - pex.top - pex.bottom - bex.top - bex.bottom;
                }
            }
            styler.css(elm, props);
            return this;
        }
    }
    /*
     * Get or set the size of the specified element border box.
     * @param {HTMLElement} elm
     * @param {Number} value
     */
    function width(elm, value) {
        if (value == undefined) {
            return size(elm).width;
        } else {
            size(elm, {
                width: value
            });
            return this;
        }
    }

    function geom() {
        return geom;
    }

    langx.mixin(geom, {
        borderExtents: borderExtents,
        //viewport coordinate
        boundingPosition: boundingPosition,

        boundingRect: boundingRect,

        clientHeight: clientHeight,

        clientSize: clientSize,

        clientWidth: clientWidth,

        contentRect: contentRect,

        getDocumentSize: getDocumentSize,

        height: height,

        marginExtents: marginExtents,

        marginRect: marginRect,

        marginSize: marginSize,

        offsetParent: offsetParent,

        paddingExtents: paddingExtents,

        //coordinate to the document
        pagePosition: pagePosition,

        pageRect: pageRect,

        // coordinate relative to it's parent
        relativePosition: relativePosition,

        relativeRect: relativeRect,

        scrollbarWidth: scrollbarWidth,

        scrollIntoView: scrollIntoView,

        scrollLeft: scrollLeft,

        scrollTop: scrollTop,

        size: size,

        width: width
    });

    ( function() {
        var max = Math.max,
            abs = Math.abs,
            rhorizontal = /left|center|right/,
            rvertical = /top|center|bottom/,
            roffset = /[\+\-]\d+(\.[\d]+)?%?/,
            rposition = /^\w+/,
            rpercent = /%$/;

        function getOffsets( offsets, width, height ) {
            return [
                parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
                parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
            ];
        }

        function parseCss( element, property ) {
            return parseInt( styler.css( element, property ), 10 ) || 0;
        }

        function getDimensions( raw ) {
            if ( raw.nodeType === 9 ) {
                return {
                    size: size(raw),
                    offset: { top: 0, left: 0 }
                };
            }
            if ( noder.isWindow( raw ) ) {
                return {
                    size: size(raw),
                    offset: { 
                        top: scrollTop(raw), 
                        left: scrollLeft(raw) 
                    }
                };
            }
            if ( raw.preventDefault ) {
                return {
                    size : {
                        width: 0,
                        height: 0
                    },
                    offset: { 
                        top: raw.pageY, 
                        left: raw.pageX 
                    }
                };
            }
            return {
                size: size(raw),
                offset: pagePosition(raw)
            };
        }

        function getScrollInfo( within ) {
            var overflowX = within.isWindow || within.isDocument ? "" :
                    styler.css(within.element,"overflow-x" ),
                overflowY = within.isWindow || within.isDocument ? "" :
                    styler.css(within.element,"overflow-y" ),
                hasOverflowX = overflowX === "scroll" ||
                    ( overflowX === "auto" && within.width < scrollWidth(within.element) ),
                hasOverflowY = overflowY === "scroll" ||
                    ( overflowY === "auto" && within.height < scrollHeight(within.element));
            return {
                width: hasOverflowY ? scrollbarWidth() : 0,
                height: hasOverflowX ? scrollbarWidth() : 0
            };
        }

        function getWithinInfo( element ) {
            var withinElement = element || window,
                isWindow = noder.isWindow( withinElement),
                isDocument = !!withinElement && withinElement.nodeType === 9,
                hasOffset = !isWindow && !isDocument,
                msize = marginSize(withinElement);
            return {
                element: withinElement,
                isWindow: isWindow,
                isDocument: isDocument,
                offset: hasOffset ? pagePosition(element) : { left: 0, top: 0 },
                scrollLeft: scrollLeft(withinElement),
                scrollTop: scrollTop(withinElement),
                width: msize.width,
                height: msize.height
            };
        }

        function posit(elm,options ) {
            // Make a copy, we don't want to modify arguments
            options = langx.extend( {}, options );

            var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
                target = options.of,
                within = getWithinInfo( options.within ),
                scrollInfo = getScrollInfo( within ),
                collision = ( options.collision || "flip" ).split( " " ),
                offsets = {};

            dimensions = getDimensions( target );
            if ( target.preventDefault ) {

                // Force left top to allow flipping
                options.at = "left top";
            }
            targetWidth = dimensions.size.width;
            targetHeight = dimensions.size.height;
            targetOffset = dimensions.offset;

            // Clone to reuse original targetOffset later
            basePosition = langx.extend( {}, targetOffset );

            // Force my and at to have valid horizontal and vertical positions
            // if a value is missing or invalid, it will be converted to center
            langx.each( [ "my", "at" ], function() {
                var pos = ( options[ this ] || "" ).split( " " ),
                    horizontalOffset,
                    verticalOffset;

                if ( pos.length === 1 ) {
                    pos = rhorizontal.test( pos[ 0 ] ) ?
                        pos.concat( [ "center" ] ) :
                        rvertical.test( pos[ 0 ] ) ?
                            [ "center" ].concat( pos ) :
                            [ "center", "center" ];
                }
                pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
                pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

                // Calculate offsets
                horizontalOffset = roffset.exec( pos[ 0 ] );
                verticalOffset = roffset.exec( pos[ 1 ] );
                offsets[ this ] = [
                    horizontalOffset ? horizontalOffset[ 0 ] : 0,
                    verticalOffset ? verticalOffset[ 0 ] : 0
                ];

                // Reduce to just the positions without the offsets
                options[ this ] = [
                    rposition.exec( pos[ 0 ] )[ 0 ],
                    rposition.exec( pos[ 1 ] )[ 0 ]
                ];
            } );

            // Normalize collision option
            if ( collision.length === 1 ) {
                collision[ 1 ] = collision[ 0 ];
            }

            if ( options.at[ 0 ] === "right" ) {
                basePosition.left += targetWidth;
            } else if ( options.at[ 0 ] === "center" ) {
                basePosition.left += targetWidth / 2;
            }

            if ( options.at[ 1 ] === "bottom" ) {
                basePosition.top += targetHeight;
            } else if ( options.at[ 1 ] === "center" ) {
                basePosition.top += targetHeight / 2;
            }

            atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
            basePosition.left += atOffset[ 0 ];
            basePosition.top += atOffset[ 1 ];

            return ( function(elem) {
                var collisionPosition, using,
                    msize = marginSize(elem),
                    elemWidth = msize.width,
                    elemHeight = msize.height,
                    marginLeft = parseCss( elem, "marginLeft" ),
                    marginTop = parseCss( elem, "marginTop" ),
                    collisionWidth = elemWidth + marginLeft + parseCss( elem, "marginRight" ) +
                        scrollInfo.width,
                    collisionHeight = elemHeight + marginTop + parseCss( elem, "marginBottom" ) +
                        scrollInfo.height,
                    position = langx.extend( {}, basePosition ),
                    myOffset = getOffsets( offsets.my, msize.width, msize.height);

                if ( options.my[ 0 ] === "right" ) {
                    position.left -= elemWidth;
                } else if ( options.my[ 0 ] === "center" ) {
                    position.left -= elemWidth / 2;
                }

                if ( options.my[ 1 ] === "bottom" ) {
                    position.top -= elemHeight;
                } else if ( options.my[ 1 ] === "center" ) {
                    position.top -= elemHeight / 2;
                }

                position.left += myOffset[ 0 ];
                position.top += myOffset[ 1 ];

                collisionPosition = {
                    marginLeft: marginLeft,
                    marginTop: marginTop
                };

                langx.each( [ "left", "top" ], function( i, dir ) {
                    if ( positions[ collision[ i ] ] ) {
                        positions[ collision[ i ] ][ dir ]( position, {
                            targetWidth: targetWidth,
                            targetHeight: targetHeight,
                            elemWidth: elemWidth,
                            elemHeight: elemHeight,
                            collisionPosition: collisionPosition,
                            collisionWidth: collisionWidth,
                            collisionHeight: collisionHeight,
                            offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                            my: options.my,
                            at: options.at,
                            within: within,
                            elem: elem
                        } );
                    }
                } );

                if ( options.using ) {

                    // Adds feedback as second argument to using callback, if present
                    using = function( props ) {
                        var left = targetOffset.left - position.left,
                            right = left + targetWidth - elemWidth,
                            top = targetOffset.top - position.top,
                            bottom = top + targetHeight - elemHeight,
                            feedback = {
                                target: {
                                    element: target,
                                    left: targetOffset.left,
                                    top: targetOffset.top,
                                    width: targetWidth,
                                    height: targetHeight
                                },
                                element: {
                                    element: elem,
                                    left: position.left,
                                    top: position.top,
                                    width: elemWidth,
                                    height: elemHeight
                                },
                                horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                                vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                            };
                        if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                            feedback.horizontal = "center";
                        }
                        if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                            feedback.vertical = "middle";
                        }
                        if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                            feedback.important = "horizontal";
                        } else {
                            feedback.important = "vertical";
                        }
                        options.using.call( this, props, feedback );
                    };
                }

                pagePosition(elem, langx.extend( position, { using: using } ));
            })(elm);
        }

        var positions = {
            fit: {
                left: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                        outerWidth = within.width,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = withinOffset - collisionPosLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                        newOverRight;

                    // Element is wider than within
                    if ( data.collisionWidth > outerWidth ) {

                        // Element is initially over the left side of within
                        if ( overLeft > 0 && overRight <= 0 ) {
                            newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
                                withinOffset;
                            position.left += overLeft - newOverRight;

                        // Element is initially over right side of within
                        } else if ( overRight > 0 && overLeft <= 0 ) {
                            position.left = withinOffset;

                        // Element is initially over both left and right sides of within
                        } else {
                            if ( overLeft > overRight ) {
                                position.left = withinOffset + outerWidth - data.collisionWidth;
                            } else {
                                position.left = withinOffset;
                            }
                        }

                    // Too far left -> align with left edge
                    } else if ( overLeft > 0 ) {
                        position.left += overLeft;

                    // Too far right -> align with right edge
                    } else if ( overRight > 0 ) {
                        position.left -= overRight;

                    // Adjust based on position and margin
                    } else {
                        position.left = max( position.left - collisionPosLeft, position.left );
                    }
                },
                top: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                        outerHeight = data.within.height,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = withinOffset - collisionPosTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                        newOverBottom;

                    // Element is taller than within
                    if ( data.collisionHeight > outerHeight ) {

                        // Element is initially over the top of within
                        if ( overTop > 0 && overBottom <= 0 ) {
                            newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
                                withinOffset;
                            position.top += overTop - newOverBottom;

                        // Element is initially over bottom of within
                        } else if ( overBottom > 0 && overTop <= 0 ) {
                            position.top = withinOffset;

                        // Element is initially over both top and bottom of within
                        } else {
                            if ( overTop > overBottom ) {
                                position.top = withinOffset + outerHeight - data.collisionHeight;
                            } else {
                                position.top = withinOffset;
                            }
                        }

                    // Too far up -> align with top
                    } else if ( overTop > 0 ) {
                        position.top += overTop;

                    // Too far down -> align with bottom edge
                    } else if ( overBottom > 0 ) {
                        position.top -= overBottom;

                    // Adjust based on position and margin
                    } else {
                        position.top = max( position.top - collisionPosTop, position.top );
                    }
                }
            },
            flip: {
                left: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.offset.left + within.scrollLeft,
                        outerWidth = within.width,
                        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = collisionPosLeft - offsetLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                        myOffset = data.my[ 0 ] === "left" ?
                            -data.elemWidth :
                            data.my[ 0 ] === "right" ?
                                data.elemWidth :
                                0,
                        atOffset = data.at[ 0 ] === "left" ?
                            data.targetWidth :
                            data.at[ 0 ] === "right" ?
                                -data.targetWidth :
                                0,
                        offset = -2 * data.offset[ 0 ],
                        newOverRight,
                        newOverLeft;

                    if ( overLeft < 0 ) {
                        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
                            outerWidth - withinOffset;
                        if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                            position.left += myOffset + atOffset + offset;
                        }
                    } else if ( overRight > 0 ) {
                        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
                            atOffset + offset - offsetLeft;
                        if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                            position.left += myOffset + atOffset + offset;
                        }
                    }
                },
                top: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.offset.top + within.scrollTop,
                        outerHeight = within.height,
                        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = collisionPosTop - offsetTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                        top = data.my[ 1 ] === "top",
                        myOffset = top ?
                            -data.elemHeight :
                            data.my[ 1 ] === "bottom" ?
                                data.elemHeight :
                                0,
                        atOffset = data.at[ 1 ] === "top" ?
                            data.targetHeight :
                            data.at[ 1 ] === "bottom" ?
                                -data.targetHeight :
                                0,
                        offset = -2 * data.offset[ 1 ],
                        newOverTop,
                        newOverBottom;
                    if ( overTop < 0 ) {
                        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
                            outerHeight - withinOffset;
                        if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
                            position.top += myOffset + atOffset + offset;
                        }
                    } else if ( overBottom > 0 ) {
                        newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
                            offset - offsetTop;
                        if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
                            position.top += myOffset + atOffset + offset;
                        }
                    }
                }
            },
            flipfit: {
                left: function() {
                    positions.flip.left.apply( this, arguments );
                    positions.fit.left.apply( this, arguments );
                },
                top: function() {
                    positions.flip.top.apply( this, arguments );
                    positions.fit.top.apply( this, arguments );
                }
            }
        };

        geom.posit = posit;
    })();

    return skylark.attach("domx.geom", geom);
});
define('skylark-domx-geom/main',[
    "skylark-langx/langx",
    "./geom",
    "skylark-domx-velm",
    "skylark-domx-query"        
],function(langx,geom,velm,$){
   // from ./geom
    velm.delegate([
        "borderExtents",
        "boundingPosition",
        "boundingRect",
        "clientHeight",
        "clientSize",
        "clientWidth",
        "contentRect",
        "height",
        "marginExtents",
        "offsetParent",
        "paddingExtents",
        "pagePosition",
        "pageRect",
        "relativePosition",
        "relativeRect",
        "scrollIntoView",
        "scrollLeft",
        "scrollTop",
        "size",
        "width"
    ], geom);

    $.fn.offset = $.wraps.wrapper_value(geom.pagePosition, geom, geom.pagePosition);

    $.fn.scrollTop = $.wraps.wrapper_value(geom.scrollTop, geom);

    $.fn.scrollLeft = $.wraps.wrapper_value(geom.scrollLeft, geom);

    $.fn.position =  function(options) {
        if (!this.length) {
            return this;
        }

        if (options) {
            if (options.of && options.of.length) {
                options = langx.clone(options);
                options.of = options.of[0];
            }
            return this.each( function() {
                geom.posit(this,options);
            });
        } else {
            var elem = this[0];

            return geom.relativePosition(elem);

        }             
    };

    $.fn.offsetParent = $.wraps.wrapper_map(geom.offsetParent, geom);


    $.fn.size = $.wraps.wrapper_value(geom.size, geom);

    $.fn.width = $.wraps.wrapper_value(geom.width, geom, geom.width);

    $.fn.height = $.wraps.wrapper_value(geom.height, geom, geom.height);

    $.fn.clientSize = $.wraps.wrapper_value(geom.clientSize, geom.clientSize);
    
    ['width', 'height'].forEach(function(dimension) {
        var offset, Dimension = dimension.replace(/./, function(m) {
            return m[0].toUpperCase()
        });

        $.fn['outer' + Dimension] = function(margin, value) {
            if (arguments.length) {
                if (typeof margin !== 'boolean') {
                    value = margin;
                    margin = false;
                }
            } else {
                margin = false;
                value = undefined;
            }

            if (value === undefined) {
                var el = this[0];
                if (!el) {
                    return undefined;
                }
                var cb = geom.size(el);
                if (margin) {
                    var me = geom.marginExtents(el);
                    cb.width = cb.width + me.left + me.right;
                    cb.height = cb.height + me.top + me.bottom;
                }
                return dimension === "width" ? cb.width : cb.height;
            } else {
                return this.each(function(idx, el) {
                    var mb = {};
                    var me = geom.marginExtents(el);
                    if (dimension === "width") {
                        mb.width = value;
                        if (margin) {
                            mb.width = mb.width - me.left - me.right
                        }
                    } else {
                        mb.height = value;
                        if (margin) {
                            mb.height = mb.height - me.top - me.bottom;
                        }
                    }
                    geom.size(el, mb);
                })

            }
        };
    })

    $.fn.innerWidth = $.wraps.wrapper_value(geom.clientWidth, geom, geom.clientWidth);

    $.fn.innerHeight = $.wraps.wrapper_value(geom.clientHeight, geom, geom.clientHeight);

    return geom;
});
define('skylark-domx-geom', ['skylark-domx-geom/main'], function (main) { return main; });

define('skylark-domx-fx/fx',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-noder",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "skylark-domx-eventer"
], function(skylark, langx, browser, noder, geom, styler, eventer) {
    var animationName,
        animationDuration,
        animationTiming,
        animationDelay,
        transitionProperty,
        transitionDuration,
        transitionTiming,
        transitionDelay,

        animationEnd = browser.normalizeCssEvent('AnimationEnd'),
        transitionEnd = browser.normalizeCssEvent('TransitionEnd'),

        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform = browser.css3PropPrefix + "transform",
        cssReset = {};


    cssReset[animationName = browser.normalizeCssProperty("animation-name")] =
        cssReset[animationDuration = browser.normalizeCssProperty("animation-duration")] =
        cssReset[animationDelay = browser.normalizeCssProperty("animation-delay")] =
        cssReset[animationTiming = browser.normalizeCssProperty("animation-timing-function")] = "";

    cssReset[transitionProperty = browser.normalizeCssProperty("transition-property")] =
        cssReset[transitionDuration = browser.normalizeCssProperty("transition-duration")] =
        cssReset[transitionDelay = browser.normalizeCssProperty("transition-delay")] =
        cssReset[transitionTiming = browser.normalizeCssProperty("transition-timing-function")] = "";



    /*   
     * Perform a custom animation of a set of CSS properties.
     * @param {Object} elm  
     * @param {Number or String} properties
     * @param {String} ease
     * @param {Number or String} duration
     * @param {Function} callback
     * @param {Number or String} delay
     */
    function animate(elm, properties, duration, ease, callback, delay) {
        var key,
            cssValues = {},
            cssProperties = [],
            transforms = "",
            that = this,
            endEvent,
            wrappedCallback,
            fired = false,
            hasScrollTop = false,
            resetClipAuto = false;

        if (langx.isPlainObject(duration)) {
            ease = duration.easing;
            callback = duration.complete;
            delay = duration.delay;
            duration = duration.duration;
        }

        if (langx.isString(duration)) {
            duration = fx.speeds[duration];
        }
        if (duration === undefined) {
            duration = fx.speeds.normal;
        }
        duration = duration / 1000;
        if (fx.off) {
            duration = 0;
        }

        if (langx.isFunction(ease)) {
            callback = ease;
            eace = "swing";
        } else {
            ease = ease || "swing";
        }

        if (delay) {
            delay = delay / 1000;
        } else {
            delay = 0;
        }

        if (langx.isString(properties)) {
            // keyframe animation
            cssValues[animationName] = properties;
            cssValues[animationDuration] = duration + "s";
            cssValues[animationTiming] = ease;
            endEvent = animationEnd;
        } else {
            // CSS transitions
            for (key in properties) {
                var v = properties[key];
                if (supportedTransforms.test(key)) {
                    transforms += key + "(" + v + ") ";
                } else {
                    if (key === "scrollTop") {
                        hasScrollTop = true;
                    }
                    if (key == "clip" && langx.isPlainObject(v)) {
                        cssValues[key] = "rect(" + v.top+"px,"+ v.right +"px,"+ v.bottom +"px,"+ v.left+"px)";
                        if (styler.css(elm,"clip") == "auto") {
                            var size = geom.size(elm);
                            styler.css(elm,"clip","rect("+"0px,"+ size.width +"px,"+ size.height +"px,"+"0px)");  
                            resetClipAuto = true;
                        }

                    } else {
                        cssValues[key] = v;
                    }
                    cssProperties.push(langx.dasherize(key));
                }
            }
            endEvent = transitionEnd;
        }

        if (transforms) {
            cssValues[transform] = transforms;
            cssProperties.push(transform);
        }

        if (duration > 0 && langx.isPlainObject(properties)) {
            cssValues[transitionProperty] = cssProperties.join(", ");
            cssValues[transitionDuration] = duration + "s";
            cssValues[transitionDelay] = delay + "s";
            cssValues[transitionTiming] = ease;
        }

        wrappedCallback = function(event) {
            fired = true;
            if (event) {
                if (event.target !== event.currentTarget) {
                    return // makes sure the event didn't bubble from "below"
                }
                eventer.off(event.target, endEvent, wrappedCallback)
            } else {
                eventer.off(elm, animationEnd, wrappedCallback) // triggered by setTimeout
            }
            styler.css(elm, cssReset);
            if (resetClipAuto) {
 //               styler.css(elm,"clip","auto");
            }
            callback && callback.call(this);
        };

        if (duration > 0) {
            eventer.on(elm, endEvent, wrappedCallback);
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired
            langx.debounce(function() {
                if (fired) {
                    return;
                }
                wrappedCallback.call(that);
            }, ((duration + delay) * 1000) + 25)();
        }

        // trigger page reflow so new elements can animate
        elm.clientLeft;

        styler.css(elm, cssValues);

        if (duration <= 0) {
            langx.debounce(function() {
                if (fired) {
                    return;
                }
                wrappedCallback.call(that);
            }, 0)();
        }

        if (hasScrollTop) {
            scrollToTop(elm, properties["scrollTop"], duration, callback);
        }

        return this;
    }

    /*   
     * Display an element.
     * @param {Object} elm  
     * @param {String} speed
     * @param {Function} callback
     */
    function show(elm, speed, callback) {
        styler.show(elm);
        if (speed) {
            if (!callback && langx.isFunction(speed)) {
                callback = speed;
                speed = "normal";
            }
            styler.css(elm, "opacity", 0)
            animate(elm, { opacity: 1, scale: "1,1" }, speed, callback);
        }
        return this;
    }


    /*   
     * Hide an element.
     * @param {Object} elm  
     * @param {String} speed
     * @param {Function} callback
     */
    function hide(elm, speed, callback) {
        if (speed) {
            if (!callback && langx.isFunction(speed)) {
                callback = speed;
                speed = "normal";
            }
            animate(elm, { opacity: 0, scale: "0,0" }, speed, function() {
                styler.hide(elm);
                if (callback) {
                    callback.call(elm);
                }
            });
        } else {
            styler.hide(elm);
        }
        return this;
    }

    /*   
     * Set the vertical position of the scroll bar for an element.
     * @param {Object} elm  
     * @param {Number or String} pos
     * @param {Number or String} speed
     * @param {Function} callback
     */
    function scrollToTop(elm, pos, speed, callback) {
        var scrollFrom = parseInt(elm.scrollTop),
            i = 0,
            runEvery = 5, // run every 5ms
            freq = speed * 1000 / runEvery,
            scrollTo = parseInt(pos);

        var interval = setInterval(function() {
            i++;

            if (i <= freq) elm.scrollTop = (scrollTo - scrollFrom) / freq * i + scrollFrom;

            if (i >= freq + 1) {
                clearInterval(interval);
                if (callback) langx.debounce(callback, 1000)();
            }
        }, runEvery);
    }

    /*   
     * Display or hide an element.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {Function} callback
     */
    function toggle(elm, speed, callback) {
        if (styler.isInvisible(elm)) {
            show(elm, speed, callback);
        } else {
            hide(elm, speed, callback);
        }
        return this;
    }

    /*   
     * Adjust the opacity of an element.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {Number or String} opacity
     * @param {String} easing
     * @param {Function} callback
     */
    function fadeTo(elm, speed, opacity, easing, callback) {
        animate(elm, { opacity: opacity }, speed, easing, callback);
        return this;
    }


    /*   
     * Display an element by fading them to opaque.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {String} easing
     * @param {Function} callback
     */
    function fadeIn(elm, speed, easing, callback) {
        var target = styler.css(elm, "opacity");
        if (target > 0) {
            styler.css(elm, "opacity", 0);
        } else {
            target = 1;
        }
        styler.show(elm);

        fadeTo(elm, speed, target, easing, callback);

        return this;
    }

    /*   
     * Hide an element by fading them to transparent.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {String} easing
     * @param {Function} callback
     */
    function fadeOut(elm, speed, easing, callback) {
        var _elm = elm,
            complete,
            opacity = styler.css(elm,"opacity"),
            options = {};

        if (langx.isPlainObject(speed)) {
            options.easing = speed.easing;
            options.duration = speed.duration;
            complete = speed.complete;
        } else {
            options.duration = speed;
            if (callback) {
                complete = callback;
                options.easing = easing;
            } else {
                complete = easing;
            }
        }
        options.complete = function() {
            styler.css(elm,"opacity",opacity);
            styler.hide(elm);
            if (complete) {
                complete.call(elm);
            }
        }

        fadeTo(elm, options, 0);

        return this;
    }

    /*   
     * Display or hide an element by animating its opacity.
     * @param {Object} elm  
     * @param {Number or String} speed
     * @param {String} ceasing
     * @param {Function} callback
     */
    function fadeToggle(elm, speed, ceasing, allback) {
        if (styler.isInvisible(elm)) {
            fadeIn(elm, speed, easing, callback);
        } else {
            fadeOut(elm, speed, easing, callback);
        }
        return this;
    }

    /*   
     * Display an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideDown(elm, duration, callback) {

        // get the element position to restore it then
        var position = styler.css(elm, 'position');

        // show element if it is hidden
        show(elm);

        // place it so it displays as usually but hidden
        styler.css(elm, {
            position: 'absolute',
            visibility: 'hidden'
        });

        // get naturally height, margin, padding
        var marginTop = styler.css(elm, 'margin-top');
        var marginBottom = styler.css(elm, 'margin-bottom');
        var paddingTop = styler.css(elm, 'padding-top');
        var paddingBottom = styler.css(elm, 'padding-bottom');
        var height = styler.css(elm, 'height');

        // set initial css for animation
        styler.css(elm, {
            position: position,
            visibility: 'visible',
            overflow: 'hidden',
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0
        });

        // animate to gotten height, margin and padding
        animate(elm, {
            height: height,
            marginTop: marginTop,
            marginBottom: marginBottom,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom
        }, {
            duration: duration,
            complete: function() {
                if (callback) {
                    callback.apply(elm);
                }
            }
        });

        return this;
    }

    /*   
     * Hide an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideUp(elm, duration, callback) {
        // active the function only if the element is visible
        if (geom.height(elm) > 0) {

            // get the element position to restore it then
            var position = styler.css(elm, 'position');

            // get the element height, margin and padding to restore them then
            var height = styler.css(elm, 'height');
            var marginTop = styler.css(elm, 'margin-top');
            var marginBottom = styler.css(elm, 'margin-bottom');
            var paddingTop = styler.css(elm, 'padding-top');
            var paddingBottom = styler.css(elm, 'padding-bottom');

            // set initial css for animation
            styler.css(elm, {
                visibility: 'visible',
                overflow: 'hidden',
                height: height,
                marginTop: marginTop,
                marginBottom: marginBottom,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom
            });

            // animate element height, margin and padding to zero
            animate(elm, {
                height: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0
            }, {
                // callback : restore the element position, height, margin and padding to original values
                duration: duration,
                queue: false,
                complete: function() {
                    hide(elm);
                    styler.css(elm, {
                        visibility: 'visible',
                        overflow: 'hidden',
                        height: height,
                        marginTop: marginTop,
                        marginBottom: marginBottom,
                        paddingTop: paddingTop,
                        paddingBottom: paddingBottom
                    });
                    if (callback) {
                        callback.apply(elm);
                    }
                }
            });
        }
        return this;
    }


    /*   
     * Display or hide an element with a sliding motion.
     * @param {Object} elm  
     * @param {Number or String} duration
     * @param {Function} callback
     */
    function slideToggle(elm, duration, callback) {

        // if the element is hidden, slideDown !
        if (geom.height(elm) == 0) {
            slideDown(elm, duration, callback);
        }
        // if the element is visible, slideUp !
        else {
            slideUp(elm, duration, callback);
        }
        return this;
    }

    function emulateTransitionEnd(elm,duration) {
        var called = false;
        eventer.one(elm,'transitionEnd', function () { 
            called = true;
        })
        var callback = function () { 
            if (!called) {
                eventer.trigger(elm,browser.support.transition.end) 
            }
        };
        setTimeout(callback, duration);
        
        return this;
    } 

    /*   
     *
     * @param {Node} elm
     * @param {Node} params
     */
    function overlay(elm, params) {
        var overlayDiv = noder.createElement("div", params);
        styler.css(overlayDiv, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0x7FFFFFFF,
            opacity: 0.7
        });
        elm.appendChild(overlayDiv);
        return overlayDiv;

    }
    
    /*   
     * Replace an old node with the specified node.
     * @param {HTMLElement} elm
     * @param {Node} params
     */
    function throb(elm, params) {
        params = params || {};
        var self = this,
            text = params.text,
            style = params.style,
            time = params.time,
            callback = params.callback,
            timer,

            throbber = noder.createElement("div", {
                "class": params.className || "throbber"
            }),
            _overlay = overlay(throbber, {
                "class": 'overlay fade'
            }),
            throb = noder.createElement("div", {
                "class": "throb"
            }),
            textNode = noder.createTextNode(text || ""),
            remove = function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (throbber) {
                    noder.remove(throbber);
                    throbber = null;
                }
            },
            update = function(params) {
                if (params && params.text && throbber) {
                    textNode.nodeValue = params.text;
                }
            };
        if (params.style) {
            styler.css(throbber,params.style);
        }
        throb.appendChild(textNode);
        throbber.appendChild(throb);
        elm.appendChild(throbber);
        var end = function() {
            remove();
            if (callback) callback();
        };
        if (time) {
            timer = setTimeout(end, time);
        }

        return {
            remove: remove,
            update: update
        };
    }

    function fx() {
        return fx;
    }

    langx.mixin(fx, {
        off: false,

        speeds: {
            normal: 400,
            fast: 200,
            slow: 600
        },

        animate,
        emulateTransitionEnd,
        fadeIn,
        fadeOut,
        fadeTo,
        fadeToggle,
        hide,
        scrollToTop,

        slideDown,
        slideToggle,
        slideUp,
        show,
        throb,
        toggle
    });

    return skylark.attach("domx.fx", fx);
});
define('skylark-domx-fx/main',[
	"./fx",
	"skylark-domx-velm",
	"skylark-domx-query"	
],function(fx,velm,$){
    // from ./fx
    velm.delegate([
        "animate",
        "emulateTransitionEnd",
        "fadeIn",
        "fadeOut",
        "fadeTo",
        "fadeToggle",
        "hide",
        "scrollToTop",
        "slideDown",
        "slideToggle",
        "slideUp",
        "show",
        "toggle"
    ], fx);

    $.fn.hide =  $.wraps.wrapper_every_act(fx.hide, fx);

    $.fn.animate = $.wraps.wrapper_every_act(fx.animate, fx);
    $.fn.emulateTransitionEnd = $.wraps.wrapper_every_act(fx.emulateTransitionEnd, fx);

    $.fn.show = $.wraps.wrapper_every_act(fx.show, fx);
    $.fn.hide = $.wraps.wrapper_every_act(fx.hide, fx);
    $.fn.toogle = $.wraps.wrapper_every_act(fx.toogle, fx);
    $.fn.fadeTo = $.wraps.wrapper_every_act(fx.fadeTo, fx);
    $.fn.fadeIn = $.wraps.wrapper_every_act(fx.fadeIn, fx);
    $.fn.fadeOut = $.wraps.wrapper_every_act(fx.fadeOut, fx);
    $.fn.fadeToggle = $.wraps.wrapper_every_act(fx.fadeToggle, fx);

    $.fn.slideDown = $.wraps.wrapper_every_act(fx.slideDown, fx);
    $.fn.slideToggle = $.wraps.wrapper_every_act(fx.slideToggle, fx);
    $.fn.slideUp = $.wraps.wrapper_every_act(fx.slideUp, fx);

	return fx;
});
define('skylark-domx-fx', ['skylark-domx-fx/main'], function (main) { return main; });

define('skylark-domx-plugins/plugins',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-eventer",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-styler",
    "skylark-domx-fx",
    "skylark-domx-query",
    "skylark-domx-velm"
], function(skylark, langx, noder, datax, eventer, finder, geom, styler, fx, $, elmx) {
    "use strict";

    var slice = Array.prototype.slice,
        concat = Array.prototype.concat,
        pluginKlasses = {},
        shortcuts = {};

    /*
     * Create or get or destory a plugin instance assocated with the element.
     */
    function instantiate(elm,pluginName,options) {
        var pair = pluginName.split(":"),
            instanceDataName = pair[1];
        pluginName = pair[0];

        if (!instanceDataName) {
            instanceDataName = pluginName;
        }

        var pluginInstance = datax.data( elm, instanceDataName );

        if (options === "instance") {
            return pluginInstance;
        } else if (options === "destroy") {
            if (!pluginInstance) {
                throw new Error ("The plugin instance is not existed");
            }
            pluginInstance.destroy();
            datax.removeData( elm, pluginName);
            pluginInstance = undefined;
        } else {
            if (!pluginInstance) {
                if (options !== undefined && typeof options !== "object") {
                    throw new Error ("The options must be a plain object");
                }
                var pluginKlass = pluginKlasses[pluginName]; 
                pluginInstance = new pluginKlass(elm,options);
                datax.data( elm, instanceDataName,pluginInstance );
            } else if (options) {
                pluginInstance.reset(options);
            }
        }

        return pluginInstance;
    }

    function shortcutter(pluginName,extfn) {
       /*
        * Create or get or destory a plugin instance assocated with the element,
        * and also you can execute the plugin method directory;
        */
        return function (elm,options) {
            var  plugin = instantiate(elm, pluginName,"instance");
            if ( options === "instance" ) {
              return plugin || null;
            }
            if (!plugin) {
                plugin = instantiate(elm, pluginName,typeof options == 'object' && options || {});
                return this;
            } else  if (options) {
                var args = slice.call(arguments,1); //2
                if (extfn) {
                    var ret =  extfn.apply(plugin,args);
                    if (ret === undefined) {
                        ret = this;
                    }
                    return ret;
                } else {
                    if (typeof options == 'string') {
                        var methodName = options;

                        if ( !plugin ) {
                            throw new Error( "cannot call methods on " + pluginName +
                                " prior to initialization; " +
                                "attempted to call method '" + methodName + "'" );
                        }

                        if ( !langx.isFunction( plugin[ methodName ] ) || methodName.charAt( 0 ) === "_" ) {
                            throw new Error( "no such method '" + methodName + "' for " + pluginName +
                                " plugin instance" );
                        }

                        return plugin[methodName].apply(plugin,args);
                    }                
                }                
            }

        }

    }

    function shortcutter(pluginName,extfn) {
       /*
        * Create or get or destory a plugin instance assocated with the element,
        * and also you can execute the plugin method directory;
        */
        return function (elm,options) {
            var  plugin = instantiate(elm, pluginName,"instance");
            if ( options === "instance" ) {
              return plugin || null;
            }
            if (!plugin) {
                plugin = instantiate(elm, pluginName,typeof options == 'object' && options || {});
            } else  if (options) {
                var args = slice.call(arguments,1); //2
                if (extfn) {
                    return extfn.apply(plugin,args);
                } else {
                    if (typeof options == 'string') {
                        var methodName = options;

                        if ( !plugin ) {
                            throw new Error( "cannot call methods on " + pluginName +
                                " prior to initialization; " +
                                "attempted to call method '" + methodName + "'" );
                        }

                        if ( !langx.isFunction( plugin[ methodName ] ) || methodName.charAt( 0 ) === "_" ) {
                            throw new Error( "no such method '" + methodName + "' for " + pluginName +
                                " plugin instance" );
                        }

                        return plugin[methodName].apply(plugin,args);
                    }                
                }                
            }

        }

    }

    /*
     * Register a plugin type
     */
    function register( pluginKlass,shortcutName,instanceDataName,extfn) {
        var pluginName = pluginKlass.prototype.pluginName;
        
        pluginKlasses[pluginName] = pluginKlass;

        if (shortcutName) {
            if (instanceDataName && langx.isFunction(instanceDataName)) {
                extfn = instanceDataName;
                instanceDataName = null;
            } 
            if (instanceDataName) {
                pluginName = pluginName + ":" + instanceDataName;
            }

            var shortcut = shortcuts[shortcutName] = shortcutter(pluginName,extfn);
                
            $.fn[shortcutName] = function(options) {
                var returnValue = this;

                if ( !this.length && options === "instance" ) {
                  returnValue = undefined;
                } else {
                  var args = slice.call(arguments);
                  this.each(function () {
                    var args2 = slice.call(args);
                    args2.unshift(this);
                    var  ret  = shortcut.apply(null,args2);
                    if (ret !== undefined) {
                        returnValue = ret;
                        return false;
                    }
                  });
                }

                return returnValue;
            };

            elmx.partial(shortcutName,function(options) {
                var  ret  = shortcut(this._elm,options);
                if (ret === undefined) {
                    ret = this;
                }
                return ret;
            });

        }
    }

 
    var Plugin =   langx.Evented.inherit({
        klassName: "Plugin",

        _construct : function(elm,options) {
           this._elm = elm;
           this._initOptions(options);
        },

        _initOptions : function(options) {
          var ctor = this.constructor,
              cache = ctor.cache = ctor.cache || {},
              defaults = cache.defaults;
          if (!defaults) {
            var  ctors = [];
            do {
              ctors.unshift(ctor);
              if (ctor === Plugin) {
                break;
              }
              ctor = ctor.superclass;
            } while (ctor);

            defaults = cache.defaults = {};
            for (var i=0;i<ctors.length;i++) {
              ctor = ctors[i];
              if (ctor.prototype.hasOwnProperty("options")) {
                langx.mixin(defaults,ctor.prototype.options,true);
              }
              if (ctor.hasOwnProperty("options")) {
                langx.mixin(defaults,ctor.options,true);
              }
            }
          }
          Object.defineProperty(this,"options",{
            value :langx.mixin({},defaults,options,true)
          });

          //return this.options = langx.mixin({},defaults,options);
          return this.options;
        },


        destroy: function() {
            var that = this;

            this._destroy();
            // We can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            datax.removeData(this._elm,this.pluginName );
        },

        _destroy: langx.noop,

        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },

        option: function( key, value ) {
            var options = key;
            var parts;
            var curOption;
            var i;

            if ( arguments.length === 0 ) {

                // Don't return a reference to the internal hash
                return langx.mixin( {}, this.options );
            }

            if ( typeof key === "string" ) {

                // Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = langx.mixin( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( arguments.length === 1 ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( arguments.length === 1 ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions( options );

            return this;
        },

        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }

            return this;
        },

        _setOption: function( key, value ) {

            this.options[ key ] = value;

            return this;
        },

        getUID : function (prefix) {
            prefix = prefix || "plugin";
            do prefix += ~~(Math.random() * 1000000)
            while (document.getElementById(prefix))
            return prefix;
        },

        elm : function() {
            return this._elm;
        }

    });

    $.fn.plugin = function(name,options) {
        var args = slice.call( arguments, 1 ),
            self = this,
            returnValue = this;

        this.each(function(){
            returnValue = instantiate.apply(self,[this,name].concat(args));
        });
        return returnValue;
    };

    elmx.partial("plugin",function(name,options) {
        var args = slice.call( arguments, 1 );
        return instantiate.apply(this,[this.domNode,name].concat(args));
    }); 


    function plugins() {
        return plugins;
    }
     
    langx.mixin(plugins, {
        instantiate,
        Plugin,
        register,
        shortcuts
    });

    return  skylark.attach("domx.plugins",plugins);
});
define('skylark-domx-plugins/main',[
	"./plugins"
],function(plugins){
	return plugins;
});
define('skylark-domx-plugins', ['skylark-domx-plugins/main'], function (main) { return main; });

define('skylark-data-collection/collections',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("data.collections",{});
});
define('skylark-data-collection/Collection',[
    "skylark-langx/Evented",
    "./collections"
], function(Evented, collections) {

    var Collection = collections.Collection = Evented.inherit({

        "klassName": "Collection",

        _clear: function() {
            throw new Error('Unimplemented API');
        },

        "clear": function() {
            //desc: "Removes all items from the Collection",
            //result: {
            //    type: Collection,
            //    desc: "this instance for chain call"
            //},
            //params: [],
            this._clear();
            this.trigger("changed:clear");
            return this;
        },

        /*
         *@method count
         *@return {Number}
         */
        count : /*Number*/function () {
            var c = 0,
                it = this.iterator();
            while(!it.hasNext()){
                c++;
            }
            return c;
        },

        "forEach": function( /*Function*/ func, /*Object?*/ thisArg) {
            //desc: "Executes a provided callback function once per collection item.",
            //result: {
            //    type: Number,
            //    desc: "the number of items"
            //},
            //params: [{
            //    name: "func",
            //    type: Function,
            //    desc: "Function to execute for each element."
            //}, {
            //    name: "thisArg",
            //    type: Object,
            //    desc: "Value to use as this when executing callback."
            //}],
            var it = this.iterator();
            while(it.hasNext()){
                var item = it.next();
                func.call(thisArg || item,item);
            }
            return this;

        },

        "iterator" : function() {
            throw new Error('Unimplemented API');
        },

        "toArray": function() {
            //desc: "Returns an array containing all of the items in this collection in proper sequence (from first to last item).",
            //result: {
            //    type: Array,
            //    desc: "an array containing all of the elements in this collection in proper sequence"
            //},
            //params: [],
            var items = [],
                it = this.iterator();
            while(!it.hasNext()){
                items.push(it.next());
            }
            return items;
        }
    });

    return Collection;
});


define('skylark-data-collection/Map',[
    "./collections",
    "./Collection"
], function( collections, Collection) {

    var Map = collections.Map = Collection.inherit({

        "klassName": "Map",

        _getInnerItems : function() {
            return this._items;
        },

        _clear : function() {
            this._items = [];
        },

        _findKeyByRegExp: function(regExp, callback) {
            var items = this._getInnerItems();
            return items.filter(function(key) {
                if (key.match(regExp)) {
                    if (callback) callback(key);
                    return true;
                } else {
                    return false;
                }
            });
        },

        "get":  function(strKey, silent) {
            //desc: "Returns the item at the specified key in the Hashtable.",
            //result: {
            //    type: Object,
            //    desc: "The item at the specified key."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "The key of the item to return."
            //}, {
            //    name: "silent",
            //    type: Boolean,
            //    desc: "the silent flag.",
            //    optional: true
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }
            /*
            if (!silent && !this.contains(strKey)) {
                throw "hash key is not  existed";
            }
            */
            var items = this._getInnerItems();
            return items[strKey];
        },

        "iterator" : function() {
            var i =0;
            return {
                hasNext : function() {
                    return i < this._items.length;
                },
                next : function() {
                    var key =  this._items[i++];
                    return [this._items[key],key];
                }
            }
        },

        "set": function( /*String*/ strKey, /*Object*/ value) {
            //desc: "Replaces the item at the specified key in the Hashtable with the specified item.",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "key of the item to replace."
            //}, {
            //    name: "value",
            //    type: Object,
            //    desc: "item to be stored at the specified position."
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }

            /*
            if (!this.contains(strKey)) {
                throw "hash key is not existed";
            }
            */

            var items = this._getInnerItems();
            if (items.indexOf(strKey) == -1) {
                items.push(strKey);
            }
            var oldValue = items[strKey];
            if (oldValue !== value) {
                items[strKey] = value;
                var updated = {};
                updated[strKey] = {
                    name : strKey,
                    value : value,
                    oldValue : oldValue
                };
                this.trigger("changed" ,{ //TODO: "changed:"+ strKey
                    data : updated
                });
            }
            return this;
        },


        "remove": function( /*String*/ strKey) {
            //desc: "Removes the first occurrence of a specific item from the Hashtable",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }
            var items = this._getInnerItems();
            var idx = items.indexOf(strKey);
            if (idx >= 0) {
                delete items[strKey];
                delete items[idx];
            }
        },

        findByRegExp: function( /*String*/ regExp, callback) {
            //desc: "find regExp items",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "regExp",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}, {
            //    name: "callback",
            //    type: Function,
            //    desc: "the callback method"
            //}],
            var items = [],
                self = this;
            this._findKeyByRegExp(regExp, function(key) {
                var item = self.get(key);
                if (callback) callback(item);
                items.push(item);
            });
            return items;
        },

        removeByRegExp: function( /*String*/ regExp) {
            //desc: "Removes regExp items",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "regExp",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}],
            var self = this;
            this._findKeyByRegExp(regExp, function(key) {
                self.remove(key);
            });
        },

        "toPlain": function() {
            //desc: "Returns a plain object containing all of the items in this Hashable.",
            //result: {
            //    type: Object,
            //    desc: "a plain object containing all of the items in this Hashtable."
            //},
            //params: [],
            var items = this._getInnerItems(); 

            for (var i = 0; i < items.length; i++) {
                var key = items[i];
                plain[key] = items[key];
            }
            return plain;
        },

        "toString": function( /*String?*/ delim) {
            //desc: "implementation of toString, follows [].toString().",
            //result: {
            //    type: String,
            //   desc: "The string."
            //},
            //params: [{
            //    name: "delim",
            //    type: String,
            //    desc: "The delim ",
            //    optional: true
            //}],
            var items = this._getInnerItems();

            return items.join((delim || ","));
        },

        "init": function( /*Object*/ data) {
            var items = this._items = [];
            for (var name in data) {
                items.push(name);
                items[name]= data[name];
            }
        }
       
    });
    return Map;
});


define('skylark-data-collection/HashMap',[
    "./collections",
	"./Map"
],function(collections,_Map) {

	var HashMap = collections.HashMap = _Map.inherit({
	});

	return HashMap;
});
define('skylark-widgets-base/base',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("widgets.base",{});
});
define('skylark-widgets-base/Widget',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-data",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-files",
  "skylark-domx-geom",
  "skylark-domx-velm",
  "skylark-domx-query",
  "skylark-domx-fx",
  "skylark-domx-plugins",
  "skylark-data-collection/HashMap",
  "./base"
],function(skylark,langx,browser,datax,eventer,noder,files,geom,elmx,$,fx, plugins,HashMap,base){

/*---------------------------------------------------------------------------------*/

  var Widget = plugins.Plugin.inherit({
    klassName: "Widget",

    _elmx : elmx,

    _construct : function(elm,options) {
        if (langx.isHtmlNode(elm)) {
          options = this._parse(elm,options);
        } else {
          options = elm;
          elm = null;
        }
        this.overrided(elm,options);

        if (!elm) {
          this._velm = this._create();
          this._elm = this._velm.elm();
        } else {
          this._velm = elmx(this._elm);
        }
        
        Object.defineProperty(this,"state",{
          value :this.options.state || new HashMap()
        });

        //this.state = this.options.state || new Map();
        this._init();

        var addonCategoryOptions = this.options.addons;
        if (addonCategoryOptions) {
          var widgetCtor = this.constructor,
              addons = widgetCtor.addons;
          for (var categoryName in addonCategoryOptions) {
              for (var i =0;i < addonCategoryOptions[categoryName].length; i++ ) {
                var addonOption = addonCategoryOptions[categoryName][i];
                if (langx.isString(addonOption)) {
                  var addonName = addonOption,
                      addonSetting = addons[categoryName][addonName],
                      addonCtor = addonSetting.ctor ? addonSetting.ctor : addonSetting;

                  this.addon(addonCtor,addonSetting.options);

                }

              }
          }
        }

        if (this._elm.parentElement) {
          // The widget is already in document
          this._startup();
        }

     },

    /**
     * Parses widget options from attached element.
     * This is a callback method called by constructor when attached element is specified.
     * @method _parse
     * @return {Object} options.
     */
    _parse : function(elm,options) {
      var optionsAttr = datax.data(elm,"options");
      if (optionsAttr) {
         //var options1 = JSON.parse("{" + optionsAttr + "}");
         var options1 = eval("({" + optionsAttr + "})");
         options = langx.mixin(options1,options); 
      }
      return options || {};
    },


    /**
     * Create html element for this widget.
     * This is a callback method called by constructor when attached element is not specified.
     * @method _create
     */
    _create : function() {
        var template = this.options.template;
        if (template) {
          return this._elmx(template);
        } else {
          throw new Error("The template is not existed in options!");
        }
    },


    /**
     * Init widget.
     * This is a callback method called by constructor.
     * @method _init
     */
    _init : function() {
      var self = this;
      if (this.widgetClass) {
        this._velm.addClass(this.widgetClass);
      }
      this.state.on("changed",function(e,args) {
        self._refresh(args.data);
      });
    },


    /**
     * Startup widget.
     * This is a callback method called when widget element is added into dom.
     * @method _post
     */
    _startup : function() {

    },


    /**
     * Refresh widget.
     * This is a callback method called when widget state is changed.
     * @method _refresh
     */
    _refresh : function(updates) {
      /*
      var _ = this._,
          model = _.model,
          dom = _.dom,
          props = {

          };
      updates = updates || {};
      for (var attrName in updates){
          var v = updates[attrName].value;
          if (v && v.toCss) {
              v.toCss(props);
              updates[attrName].processed = true;
          }

      };

      this.css(props);

      if (updates["disabled"]) {
          var v = updates["disabled"].value;
          dom.aria('disabled', v);
          self.classes.toggle('disabled', v);
      }
      */
    },                

    mapping : {
      "events" : {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save',
  //       'click .open':       function(e) { ... }            
      },

      "attributs" : {

      },

      "properties" : {

      },

      "styles" : {

      }
    },

    addon : function(ctor,setting) {
      var categoryName = ctor.categoryName,
          addonName = ctor.addonName;

      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};
      category[addonName] = new ctor(this,setting);
      return this;
    },

    addons : function(categoryName,settings) {
      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};

      if (settings == undefined) {
        return langx.clone(category || null);
      } else {
        langx.mixin(category,settings);
      }
    },


    /**
     * Returns a html element representing the widget.
     *
     * @method render
     * @return {HtmlElement} HTML element representing the widget.
     */
    render: function() {
      return this._elm;
    },



    /**
     * Returns a parent widget  enclosing this widgets, or null if not exist.
     *
     * @method getEnclosing
     * @return {Widget} The enclosing parent widget, or null if not exist.
     */
    getEnclosing : function(selector) {
      return null;
    },

    /**
     * Returns a widget collection with all enclosed child widgets.
     *
     * @method getEnclosed
     * @return {List} Collection with all enclosed child widgets..
     */
    getEnclosed : function() {
      var self = this;
          children = new ArrayList();
      return children;
    },

    /**
     * Sets the visible state to true.
     *
     * @method show
     * @return {Widget} Current widget instance.
     */

    show : function() {
      this._velm.show();
    },

    /**
     * Sets the visible state to false.
     *
     * @method hide
     * @return {Widget} Current widget instance.
     */
    hide : function() {
      this._velm.hide();
    },

    /**
     * Focuses the current widget.
     *
     * @method focus
     * @return {Widget} Current widget instance.
     */
    focus :function() {
      try {
        this._velm.focus();
      } catch (ex) {
        // Ignore IE error
      }

      return this;
    },

    /**
     * Blurs the current widget.
     *
     * @method blur
     * @return {Widget} Current widget instance.
     */
    blur : function() {
      this._velm.blur();

      return this;
    },

    enable: function () {
      this.state.set('disabled',false);
      return this;
    },

    disable: function () {
      this.state.set('disabled',true);
      return this;
    },

    /**
     * Sets the specified aria property.
     *
     * @method aria
     * @param {String} name Name of the aria property to set.
     * @param {String} value Value of the aria property.
     * @return {Widget} Current widget instance.
     */
    aria : function(name, value) {
      const self = this, elm = self.getEl(self.ariaTarget);

      if (typeof value === 'undefined') {
        return self._aria[name];
      }

      self._aria[name] = value;

      if (self.state.get('rendered')) {
        elm.setAttribute(name === 'role' ? name : 'aria-' + name, value);
      }

      return self;
    },

    attr: function (name,value) {
        var velm = this._velm,
            ret = velm.attr(name,value);
        return ret == velm ? this : ret;
    },

    css: function (name, value) {
        var velm = this._velm,
            ret = velm.css(name, value);
        return ret == velm ? this : ret;
    },

    data: function (name, value) {
        var velm = this._velm,
            ret = velm.data(name,value);
        return ret == velm ? this : ret;
    },

    prop: function (name,value) {
        var velm = this._velm,
            ret = velm.prop(name,value);
        return ret == velm ? this : ret;
    },

    throb: function(params) {
      return fx.throb(this._elm,params);
    },

    emit : function(type,params) {
      var e = langx.Emitter.createEvent(type,{
        data : params
      });
      return langx.Emitter.prototype.emit.call(this,e,params);
    },

    /**
     *  Attach the current widget element to dom document.
     *
     * @method attach
     * @return {Widget} This Widget.
     */
    attach : function(target,position){
        var elm = target;
        if (!position || position=="child") {
            noder.append(elm,this._elm);
        } else  if (position == "before") {
            noder.before(elm,this._elm);
        } else if (position == "after") {
            noder.after(elm,this._elm);
        }
        this._startup();
    },

    /**
     *  Detach the current widget element from dom document.
     *
     * @method html
     * @return {HtmlElement} HTML element representing the widget.
     */
    detach : function() {
      this._velm.remove();
    }
  });

  Widget.inherit = function(meta) {
    var ctor = plugins.Plugin.inherit.apply(this,arguments);

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (meta.pluginName) {
      plugins.register(ctor,meta.pluginName);
    }
    return ctor;
  };

  Widget.register = function(ctor,widgetName) {
    var meta = ctor.prototype,
        pluginName = widgetName || meta.pluginName;

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (pluginName) {
      plugins.register(ctor,pluginName);
    }
    return ctor;
  };

  return base.Widget = Widget;
});

define('skylark-widgets-swt/Toolbar',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-base/Widget"
],function(langx,$,Widget){ 



  var Toolbar = Widget.inherit({
    pluginName : "lark.toolbar",

    options : {
      toolbarFloat: true,
      toolbarHidden: false,
      toolbarFloatOffset: 0,
      template : '<div class="lark-toolbar"><ul></ul></div>',
      separator : {
        template :  '<li><span class="separator"></span></li>'
      }
    },

    _init : function() {
      var floatInitialized, initToolbarFloat, toolbarHeight;
      //this.editor = editor;

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;


      //if (!langx.isArray(this.opts.toolbar)) {
      //  this.opts.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent'];
      //}

      this.wrapper = $(this._elm);
      this.list = this.wrapper.find('ul');
      this.list.on('click', function(e) {
        return false;
      });
      this.wrapper.on('mousedown', (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('.menu-on');
        };
      })(this));
      $(document).on('mousedown.toolbar', (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('menu-on');
        };
      })(this));
      if (!this.opts.toolbarHidden && this.opts.toolbarFloat) {
        this.wrapper.css('top', this.opts.toolbarFloatOffset);
        toolbarHeight = 0;
        initToolbarFloat = (function(_this) {
          return function() {
            _this.wrapper.css('position', 'static');
            _this.wrapper.width('auto');
            _this.editor.editable.util.reflow(_this.wrapper);
            _this.wrapper.width(_this.wrapper.outerWidth());
            _this.wrapper.css('left', _this.editor.editable.util.os.mobile ? _this.wrapper.position().left : _this.wrapper.offset().left);
            _this.wrapper.css('position', '');
            toolbarHeight = _this.wrapper.outerHeight();
            _this.editor.placeholderEl.css('top', toolbarHeight);
            return true;
          };
        })(this);
        floatInitialized = null;

        /*
        $(window).on('resize.richeditor-' + this.editor.id, function(e) {
          return floatInitialized = initToolbarFloat();
        });
        $(window).on('scroll.richeditor-' + this.editor.id, (function(_this) {
          return function(e) {
            var bottomEdge, scrollTop, topEdge;
            if (!_this.wrapper.is(':visible')) {
              return;
            }
            topEdge = _this.editor.wrapper.offset().top;
            bottomEdge = topEdge + _this.editor.wrapper.outerHeight() - 80;
            scrollTop = $(document).scrollTop() + _this.opts.toolbarFloatOffset;
            if (scrollTop <= topEdge || scrollTop >= bottomEdge) {
              _this.editor.wrapper.removeClass('toolbar-floating').css('padding-top', '');
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', _this.opts.toolbarFloatOffset);
              }
            } else {
              floatInitialized || (floatInitialized = initToolbarFloat());
              _this.editor.wrapper.addClass('toolbar-floating').css('padding-top', toolbarHeight);
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', scrollTop - topEdge + _this.opts.toolbarFloatOffset);
              }
            }
          };
        })(this));
        */
      }

      /*
      this.editor.on('destroy', (function(_this) {
        return function() {
          return _this.buttons.length = 0;
        };
      })(this));
      */

      
    },

    addToolItem : function(itemWidget) {
      $(itemWidget._elm).appendTo(this.list);
      return this;
    },

    addSeparator : function() {
      $(this.options.separator.template).appendTo(this.list);
      return this;
    }

  });


  return Toolbar;

});
define('skylark-widgets-wordpad/i18n',[

],function(){ 

    var i18n =  {
      'zh-CN': {
        'blockquote': '引用',
        'bold': '加粗文字',
        'code': '插入代码',
        'color': '文字颜色',
        'coloredText': '彩色文字',
        'hr': '分隔线',
        'image': '插入图片',
        'externalImage': '外链图片',
        'uploadImage': '上传图片',
        'uploadFailed': '上传失败了',
        'uploadError': '上传出错了',
        'imageUrl': '图片地址',
        'imageSize': '图片尺寸',
        'imageAlt': '图片描述',
        'restoreImageSize': '还原图片尺寸',
        'uploading': '正在上传',
        'indent': '向右缩进',
        'outdent': '向左缩进',
        'italic': '斜体文字',
        'link': '插入链接',
        'linkText': '链接文字',
        'linkUrl': '链接地址',
        'linkTarget': '打开方式',
        'openLinkInCurrentWindow': '在当前窗口中打开',
        'openLinkInNewWindow': '在新窗口中打开',
        'removeLink': '移除链接',
        'ol': '有序列表',
        'ul': '无序列表',
        'strikethrough': '删除线文字',
        'table': '表格',
        'deleteRow': '删除行',
        'insertRowAbove': '在上面插入行',
        'insertRowBelow': '在下面插入行',
        'deleteColumn': '删除列',
        'insertColumnLeft': '在左边插入列',
        'insertColumnRight': '在右边插入列',
        'deleteTable': '删除表格',
        'title': '标题',
        'normalText': '普通文本',
        'underline': '下划线文字',
        'alignment': '水平对齐',
        'alignCenter': '居中',
        'alignLeft': '居左',
        'alignRight': '居右',
        'selectLanguage': '选择程序语言',
        'fontScale': '字体大小',
        'fontScaleXLarge': '超大字体',
        'fontScaleLarge': '大号字体',
        'fontScaleNormal': '正常大小',
        'fontScaleSmall': '小号字体',
        'fontScaleXSmall': '超小字体'
      },
      'en-US': {
        'blockquote': 'Block Quote',
        'bold': 'Bold',
        'code': 'Code',
        'color': 'Text Color',
        'coloredText': 'Colored Text',
        'hr': 'Horizontal Line',
        'image': 'Insert Image',
        'externalImage': 'External Image',
        'uploadImage': 'Upload Image',
        'uploadFailed': 'Upload failed',
        'uploadError': 'Error occurs during upload',
        'imageUrl': 'Url',
        'imageSize': 'Size',
        'imageAlt': 'Alt',
        'restoreImageSize': 'Restore Origin Size',
        'uploading': 'Uploading',
        'indent': 'Indent',
        'outdent': 'Outdent',
        'italic': 'Italic',
        'link': 'Insert Link',
        'linkText': 'Text',
        'linkUrl': 'Url',
        'linkTarget': 'Target',
        'openLinkInCurrentWindow': 'Open link in current window',
        'openLinkInNewWindow': 'Open link in new window',
        'removeLink': 'Remove Link',
        'ol': 'Ordered List',
        'ul': 'Unordered List',
        'strikethrough': 'Strikethrough',
        'table': 'Table',
        'deleteRow': 'Delete Row',
        'insertRowAbove': 'Insert Row Above',
        'insertRowBelow': 'Insert Row Below',
        'deleteColumn': 'Delete Column',
        'insertColumnLeft': 'Insert Column Left',
        'insertColumnRight': 'Insert Column Right',
        'deleteTable': 'Delete Table',
        'title': 'Title',
        'normalText': 'Text',
        'underline': 'Underline',
        'alignment': 'Alignment',
        'alignCenter': 'Align Center',
        'alignLeft': 'Align Left',
        'alignRight': 'Align Right',
        'selectLanguage': 'Select Language',
        'fontScale': 'Font Size',
        'fontScaleXLarge': 'X Large Size',
        'fontScaleLarge': 'Large Size',
        'fontScaleNormal': 'Normal Size',
        'fontScaleSmall': 'Small Size',
        'fontScaleXSmall': 'X Small Size'
      },

      translate : function() {
        var args, key, ref, result;
        key = arguments[0], args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];
        result = ((ref = i18n[this.locale]) != null ? ref[key] : void 0) || '';
        if (!(args.length > 0)) {
          return result;
        }
        result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
          if (position) {
            return p + args[parseInt(position) - 1];
          } else {
            return p + args.shift();
          }
        });
        return result.replace(/%%s/g, '%s');
      }

    };

    return i18n;
});
define('skylark-widgets-wordpad/ToolButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-base/Widget",
  "./i18n"
],function(langx, $, Widget, i18n){ 
  var slice = [].slice;

  var ToolButton = Widget.inherit( {

    options : {
      template: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',

      menu : {
        menuWrapper: '<div class="toolbar-menu"></div>',
        menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
        separator: '<li><span class="separator"></span></li>'      
      }

    },

    _construct : function(opts) {
      this.action = opts.action;
      this.toolbar = opts.toolbar;
      this.editor = opts.toolbar.editor;
      Widget.prototype._construct.call(this,opts);
    },

    _init : function() {
      var k, len, ref, tag;
      this.render();
      var _this = this;
      this.el.on('mousedown', function(e) {
          var exceed, noFocus, param;
          e.preventDefault();
          noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (_this.el.hasClass('disabled')) {
            return false;
          }
          if (noFocus) {
            _this.editor.focus();
          }
          if (_this.menu) {
            _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
            if (_this.wrapper.is('.menu-on')) {
              exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
              if (exceed > 0) {
                _this.menuWrapper.css({
                  'left': 'auto',
                  'right': 0
                });
              }
              _this.trigger('menuexpand');
            }
            return false;
          }
          param = _this.el.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('click', 'a.menu-item', function(e) {
          var btn, noFocus, param;
          e.preventDefault();
          btn = $(e.currentTarget);
          _this.wrapper.removeClass('menu-on');
          noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
          if (btn.hasClass('disabled') || noFocus) {
            return false;
          }
          _this.toolbar.wrapper.removeClass('menu-on');
          param = btn.data('param');
          _this.command(param);
          return false;
      });
      this.wrapper.on('mousedown', 'a.menu-item', function(e) {
        return false;
      });

      this.action.state.on("changed", function(e,args) {
        var updates = args.data;
        if (updates["active"] !== undefined) {
          _this._doActive(updates["active"].value);
        }

        if (updates["disabled"] !== undefined) {
          _this._doDisabled(updates["disabled"].value);
        }

      });
    },

    _doActive : function(value) {
      return this.el.toggleClass('active', this.active);
    },

    _doDisabled : function(value) {
      return this.el.toggleClass('disabled', this.disabled);
    },

    iconClassOf : function(icon) {
      if (icon) {
        return "wordpad-icon wordpad-icon-" + icon;
      } else {
        return '';
      }
    },

    setIcon : function(icon) {
      return this.el.find('span').removeClass().addClass(this.iconClassOf(icon)).text(this.text);
    },

    render : function() {

      //this.wrapper = $(this._tpl.item).appendTo(this.toolbar.list);
      this.toolbar.addToolItem(this);
      this.wrapper = $(this._elm);

      this.el = this.wrapper.find('a.toolbar-item');
      this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
      this.setIcon(this.icon);
      if (!this.menu) {
        return;
      }
      this.menuWrapper = $(this.options.menu.menuWrapper).appendTo(this.wrapper);
      this.menuWrapper.addClass("toolbar-menu-" + this.name);
      return this.renderMenu();
    },

    renderMenu : function() {
      var $menuBtnEl, $menuItemEl, k, len, menuItem, ref, ref1, results;
      if (!langx.isArray(this.menu)) {
        return;
      }
      this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
      ref = this.menu;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        menuItem = ref[k];
        if (menuItem === '|') {
          $(this.options.menu.separator).appendTo(this.menuEl);
          continue;
        }
        $menuItemEl = $(this.options.menu.menuItem).appendTo(this.menuEl);
        $menuBtnEl = $menuItemEl.find('a.menu-item').attr({
          'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
          'data-param': menuItem.param
        }).addClass('menu-item-' + menuItem.name);
        if (menuItem.icon) {
          results.push($menuBtnEl.find('span').addClass(this.iconClassOf(menuItem.icon)));
        } else {
          results.push($menuBtnEl.find('span').text(menuItem.text));
        }
      }
      return results;
    },

    command : function(params) {
      this.action.execute(params);
    },

    "name" : {
      get : function() {
        return this.action.name;
      }
    },

    "icon" : {
      get : function() {
        return this.action.icon;
      }
    },

    "title" : {
      get : function() {
        return this.action.tooltip;
      }
    },

    "text" : {
      get : function() {
        return this.action.text;
      }
    },

    "htmlTag" : {
      get : function() {
        return this.action.htmlTag;
      }
    },

    "disableTag" : {
      get : function() {
        return this.action.disableTag;
      }
    },

    "menu" : {
      get : function() {
        return this.action.menu;
      }
    },

    "editable" : {
      get : function() {
        return this._options.editable;
      }
    },

    "active" : {
      get : function() {
        return this.action.active;
      }
    },

    "disabled" : {
      get : function() {
        return this.action.disabled;
      }
    },

    "needFocus" : {
      get : function() {
        return this.action.needFocus;
      }
    },


    "shortcut" : {
      get : function() {
        return this.action.shortcut;
      }
    }


  }); 


  return ToolButton;
});

define('skylark-widgets-wordpad/addons',[],function(){
	return {
	    general : {

	    },

	    actions : {

	    },

	    toolbar : {
	      items : {
	        
	      }
	      
	    }  		
	};
});
define('skylark-widgets-wordpad/Toolbar',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-swt/Toolbar",
  "./ToolButton",
  "./addons"
],function(langx,$,_Toolbar, ToolButton,addons){ 

  var Toolbar = _Toolbar.inherit({
    pluginName : "lark.Wordpad.toolbar",

    _construct : function(editor,opts) {
      this.editor =editor;
      _Toolbar.prototype._construct.call(this,opts);
    },

    _init : function() {
      _Toolbar.prototype._init.call(this);
      this._render();
    }

  });

  Toolbar.prototype._render = function() {
    var k, len, name, ref;
    this.buttons = [];
    //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
    this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
    ref = this.opts.toolbar;
    for (k = 0, len = ref.length; k < len; k++) {
      name = ref[k];
      if (name === '|') {
        this.addSeparator();
        continue;
      }

      var action  = this.editor.findAction(name),
          toolItemCtor = addons.toolbar.items[name];

      if (!toolItemCtor) {
        toolItemCtor = ToolButton;
      }

      this.buttons.push(new toolItemCtor({
        "action" : action,
        "toolbar" : this
      }));
    }
    if (this.opts.toolbarHidden) {
      return this.wrapper.hide();
    }
  };

  Toolbar.prototype.findButton = function(name) {
    var button;
    button = this.list.find('.toolbar-item-' + name).data('button');
    return button != null ? button : null;
  };

  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return Toolbar;

});
define('skylark-widgets-wordpad/uploader',[
  "skylark-langx/langx",
  "skylark-domx-query"
],function(langx,$){ 

  var Uploader = langx.Evented.inherit({
    init : function() {
      this.files = [];
      this.queue = [];
      this.id = ++Uploader.count;
      this.on('uploadcomplete', (function(_this) {
        return function(e, file) {
          _this.files.splice(langx.inArray(file, _this.files), 1);
          if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
            return _this.upload(_this.queue.shift());
          } else {
            return _this.uploading = false;
          }
        };
      })(this));
      return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
        return function(e) {
          if (!_this.uploading) {
            return;
          }
          e.originalEvent.returnValue = _this._t('leaveConfirm');
          return _this._t('leaveConfirm');  
        };
      })(this));
    }

  });

  Uploader.count = 0;

  Uploader.prototype.opts = {
    url: '',
    params: null,
    fileKey: 'upload_file',
    connectionCount: 3
  };



  Uploader.prototype.generateId = (function() {
    var id;
    id = 0;
    return function() {
      return id += 1;
    };
  })();

  Uploader.prototype.upload = function(file, opts) {
    var f, i, key, len;
    if (opts == null) {
      opts = {};
    }
    if (file == null) {
      return;
    }
    if (langx.isArray(file) || file instanceof FileList) {
      for (i = 0, len = file.length; i < len; i++) {
        f = file[i];
        this.upload(f, opts);
      }
    } else if ($(file).is('input:file')) {
      key = $(file).attr('name');
      if (key) {
        opts.fileKey = key;
      }
      this.upload(langx.makeArray($(file)[0].files), opts);
    } else if (!file.id || !file.obj) {
      file = this.getFile(file);
    }
    if (!(file && file.obj)) {
      return;
    }
    langx.extend(file, opts);
    if (this.files.length >= this.opts.connectionCount) {
      this.queue.push(file);
      return;
    }
    if (this.trigger('beforeupload', [file]) === false) {
      return;
    }
    this.files.push(file);
    this._xhrUpload(file);
    return this.uploading = true;
  };

  Uploader.prototype.getFile = function(fileObj) {
    var name, ref, ref1;
    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
    } else {
      return null;
    }
    return {
      id: this.generateId(),
      url: this.opts.url,
      params: this.opts.params,
      fileKey: this.opts.fileKey,
      name: name,
      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
      ext: name ? name.split('.').pop().toLowerCase() : '',
      obj: fileObj
    };
  };

  Uploader.prototype._xhrUpload = function(file) {
    var formData, k, ref, v;
    formData = new FormData();
    formData.append(file.fileKey, file.obj);
    formData.append("original_filename", file.name);
    if (file.params) {
      ref = file.params;
      for (k in ref) {
        v = ref[k];
        formData.append(k, v);
      }
    }

    //TODO
    return file.xhr = langx.xhr({
      url: file.url,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      headers: {
        'X-File-Name': encodeURIComponent(file.name)
      },
      xhr: function() {
        var req;
        req = $.ajaxSettings.xhr();
        if (req) {
          req.upload.onprogress = (function(_this) {
            return function(e) {
              return _this.progress(e);
            };
          })(this);
        }
        return req;
      },
      progress: (function(_this) {
        return function(e) {
          if (!e.lengthComputable) {
            return;
          }
          return _this.trigger('uploadprogress', [file, e.loaded, e.total]);
        };
      })(this),
      error: (function(_this) {
        return function(xhr, status, err) {
          return _this.trigger('uploaderror', [file, xhr, status]);
        };
      })(this),
      success: (function(_this) {
        return function(result) {
          _this.trigger('uploadprogress', [file, file.size, file.size]);
          _this.trigger('uploadsuccess', [file, result]);
          return $(document).trigger('uploadsuccess', [file, result, _this]);
        };
      })(this),
      complete: (function(_this) {
        return function(xhr, status) {
          return _this.trigger('uploadcomplete', [file, xhr.responseText]);
        };
      })(this)
    });
  };

  Uploader.prototype.cancel = function(file) {
    var f, i, len, ref;
    if (!file.id) {
      ref = this.files;
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        if (f.id === file * 1) {
          file = f;
          break;
        }
      }
    }
    this.trigger('uploadcancel', [file]);
    if (file.xhr) {
      file.xhr.abort();
    }
    return file.xhr = null;
  };

  Uploader.prototype.readImageFile = function(fileObj, callback) {
    var fileReader, img;
    if (!langx.isFunction(callback)) {
      return;
    }
    img = new Image();
    img.onload = function() {
      return callback(img);
    };
    img.onerror = function() {
      return callback();
    };
    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
      fileReader = new FileReader();
      fileReader.onload = function(e) {
        return img.src = e.target.result;
      };
      return fileReader.readAsDataURL(fileObj);
    } else {
      return callback();
    }
  };

  Uploader.prototype.destroy = function() {
    var file, i, len, ref;
    this.queue.length = 0;
    ref = this.files;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      this.cancel(file);
    }
    $(window).off('.uploader-' + this.id);
    return $(document).off('.uploader-' + this.id);
  };

  Uploader.i18n = {
    'zh-CN': {
      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
    }
  };

  Uploader.locale = 'zh-CN';

  return  function(opts) {
    return new Uploader(opts);
  };

});

define('skylark-widgets-wordpad/Wordpad',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-contents/Editable",
  "skylark-widgets-base/Widget",
  "./Toolbar",
  "./uploader",
  "./i18n",
  "./addons"

],function(skylark,langx, $, Editable,Widget,Toolbar,uploader,i18n,addons){ 

  var Wordpad = Widget.inherit({
      options : {
        srcNodeRef: null,
        placeholder: '',
        defaultImage: 'images/image.png',
        params: {},
        upload: false,
        template : "<div class=\"wordpad\">\n  <div class=\"wordpad-wrapper\">\n    <div class=\"wordpad-placeholder\"></div>\n    <div class=\"wordpad-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>"
      },


    _init : function() {
      this._actions = [];

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;

      var e, editor, uploadOpts;
      this.textarea = $(this.opts.srcNodeRef);

      this.opts.placeholder = this.opts.placeholder || this.textarea.attr('placeholder');

      if (!this.textarea.length) {
        throw new Error('Wordpad: param textarea is required.');
        return;
      }

      editor = this.textarea.data('wordpad');
      if (editor != null) {
        editor.destroy();
      }
      this.id = ++Wordpad.count;
      this._render();


      var self = this;
      this.editable = new Editable(this._elm,{
        classPrefix : "wordpad-",
        textarea : this.textarea,
        body : this.body
      });

      // TODO
      this.editable.on("all",function(e,data){
        return self.trigger(e.type,data);
      });

      if (this.opts.upload && uploader) {
        uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
        this.uploader = uploader(uploadOpts);
      }

      this.toolbar = new Toolbar(this,{
        toolbar: this.opts.toolbar,
        toolbarFloat:  this.opts.toolbarFloat,
        toolbarHidden:  this.opts.toolbarHidden,
        toolbarFloatOffset:  this.opts.toolbarFloatOffset

      });

      if (this.opts.placeholder) {
        this.on('valuechanged', function() {
          return self._placeholder();
        });
      }
      this.setValue(this.textarea.val().trim() || '');
      if (this.textarea.attr('autofocus')) {
        return self.focus();
      }


    }
  });

  Wordpad.prototype.triggerHandler =  Wordpad.prototype.trigger = function(type,data) {
    var args, ref;
    args = [type];
    if (data) {
      args = args.concat(data);
    }
    langx.Evented.prototype.trigger.apply(this, args);
    return this;
  };


  //Wordpad.connect(Util);

  //Wordpad.connect(InputManager);

  //Wordpad.connect(Selection);

  //Wordpad.connect(UndoManager);

  //Wordpad.connect(Keystroke);

  //Wordpad.connect(Formatter);

  //Wordpad.connect(Toolbar);

  //Wordpad.connect(Indentation);

  //Wordpad.connect(Clipboard);

  Wordpad.count = 0;


  Wordpad.prototype._render = function() {
    var key, ref, results, val;

    //this.el = $(this._tpl).insertBefore(this.textarea);
    this.el = $(this._elm).insertBefore (this.textarea);

    this.wrapper = this.el.find('.wordpad-wrapper');
    this.body = this.wrapper.find('.wordpad-body');
    this.placeholderEl = this.wrapper.find('.wordpad-placeholder').append(this.opts.placeholder);
    this.el.data('wordpad', this);
    this.wrapper.append(this.textarea);
    this.textarea.data('wordpad', this).blur();
    this.body.attr('tabindex', this.textarea.attr('tabindex'));

    if (this.opts.params) {
      ref = this.opts.params;
      results = [];
      for (key in ref) {
        val = ref[key];
        results.push($('<input/>', {
          type: 'hidden',
          name: key,
          value: val
        }).insertAfter(this.textarea));
      }
      return results;
    }
  };

  Wordpad.prototype._placeholder = function() {
    var children;
    children = this.body.children();
    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.opts.indentWidth)) {
      return this.placeholderEl.show();
    } else {
      return this.placeholderEl.hide();
    }
  };

  Wordpad.prototype.setValue = function(val) {
    this.hidePopover();

    this.editable.setValue(val);

    return this.trigger('valuechanged');
  };

  Wordpad.prototype.getValue = function() {
    return this.editable.getValue();
  };

  Wordpad.prototype.focus = function() {
    return this.editable.focus();
  };

  Wordpad.prototype.blur = function() {
    return this.editable.blur();
  };

  Wordpad.prototype.findAction = function(name) {
    if (!this._actions[name]) {
      if (!this.constructor.addons.actions[name]) {
        throw new Error("Wordpad: invalid action " + name);
      }

      this._actions[name] = new this.constructor.addons.actions[name]({
        editor: this
      });

    }

    return this._actions[name];
  };

  Wordpad.prototype.hidePopover = function() {
    return this.el.find('.wordpad-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
  };

  Wordpad.prototype.destroy = function() {
    this.trigger('destroy');
    this.textarea.closest('form').off('.Wordpad .wordpad-' + this.id);
    this.selection.clear();
    this.inputManager.focused = false;
    this.textarea.insertBefore(this.el).hide().val('').removeData('wordpad');
    this.el.remove();
    $(document).off('.wordpad-' + this.id);
    $(window).off('.wordpad-' + this.id);
    return this.off();
  };


  Wordpad.Toolbar = Toolbar;

  Wordpad.i18n = i18n;

  Wordpad.addons = addons;


  return skylark.attach("widgets.Wordpad",Wordpad);

});

define('skylark-widgets-base/ActionManager',[
	"skylark-langx/Evented",
	"./base"
], function(Evented,base){

	var ActionManager = Evented.inherit({
		"klassName"		:	"Manager",


		addAction : function(category,name,fn,options) {

		},

		executeAction : function() {

		},

		removeAction : function(category,name) {

		}

	});

	return base.ActionManager = ActionManager;

});


define('skylark-widgets-base/Action',[
	"skylark-langx/objects",
	"skylark-langx/Evented",
	"skylark-data-collection/HashMap",
	"./base",
	"./ActionManager"
], function(objects,Evented, HashMap, base, ActiionManager){

	var Action = Evented.inherit({
		"klassName" : "Action",

		"name"  : "",

		"category" : "",

		"text" : "",

		"tooltip" : "",

		"icon" : "",

		"shortcut" : "",

		"state"  : {
			get : function() {
				return  this._state || (this._state = new HashMap({
					checked : false,
					disabled : false
				}));
			}
		},

		_construct : function(options) {
			if (options) {
				objects.mixin(this,options);
			}
		},

		_init : function() {

		},

	    /**
	     * Executes the command. Additional arguments are passed to the executing function
	     *
	     * @return {$.Promise} a  promise that will be resolved when the command completes.
	     */
		execute: function(params){
			if (this._execute) {
				this._execute(params);
			}
			this.trigger("executed",{
				params :params
			});
		}

	});
	
	return base.Action = Action;
});



define('skylark-widgets-wordpad/Action',[
  "skylark-langx/langx",
  "skylark-widgets-base/Action",
  "./Wordpad",
  "./i18n"
],function(langx, _Action, Wordpad,i18n){ 
  var slice = [].slice;

  var Action = _Action.inherit( {
    htmlTag : '',

    disableTag : '',

    menu : false,

    active : {
      get : function() {
        return this.state.get("active");
      },

      set : function(value) {
        return this.state.set("active",value);

      }

    },

    disabled : {
      get : function() {
        return this.state.get("disabled");
      },

      set : function(value) {
        return this.state.set("disabled",value);

      }
    },

    needFocus : true,

    _construct  : function(opts) {
      _Action.prototype._construct.apply(this,arguments);
      //this.toolbar = opts.toolbar;
      //this.editor = this.toolbar.editor;
      this.title = i18n.translate(this.name);

      var _this = this;

      this.editor.on('blur', function() {
        var editorActive;
        editorActive = _this.editor.body.is(':visible') && _this.editor.body.is('[contenteditable]');
        if (!(editorActive && !_this.editor.editable.clipboard.pasting)) {
          return;
        }
        _this.setActive(false);
        return _this.setDisabled(false);
      });

      if (this.shortcut != null) {
        this.editor.editable.hotkeys.add(this.shortcut, function(e) {
          //_this.el.mousedown();
          _this.execute();
          return false;
        });
      }

      var ref = this.htmlTag.split(',');
      for (k = 0, len = ref.length; k < len; k++) {
        tag = ref[k];
        tag = langx.trim(tag);
        if (tag && langx.inArray(tag, this.editor.editable.formatter._allowedTags) < 0) {
          this.editor.editable.formatter._allowedTags.push(tag);
        }
      }
      this.editor.on('selectionchanged', function(e) {
        if (_this.editor.editable.inputManager.focused) {
          return _this._status();
        }
      });

      this._init();
    },

    _init : function() {


    },

    _disableStatus : function() {
      var disabled, endNodes, startNodes;
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      disabled = startNodes.filter(this.disableTag).length > 0 || endNodes.filter(this.disableTag).length > 0;
      this.setDisabled(disabled);
      if (this.disabled) {
        this.setActive(false);
      }
      return this.disabled;
    },

    _activeStatus : function() {
      var active, endNode, endNodes, startNode, startNodes;
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      startNode = startNodes.filter(this.htmlTag);
      endNode = endNodes.filter(this.htmlTag);
      active = startNode.length > 0 && endNode.length > 0 && startNode.is(endNode);
      this.node = active ? startNode : null;
      this.setActive(active);
      return this.active;
    },

    _status : function() {
      this._disableStatus();
      if (this.disabled) {
        return;
      }
      return this._activeStatus();
    },

    setActive : function(active) {
      if (active === this.active) {
        return;
      }
      this.active = active;
    },

    setDisabled : function(disabled) {
      if (disabled === this.disabled) {
        return;
      }
      this.disabled = disabled;
    }
  }); 


  Action.prototype._t = i18n.translate;


  return Action;

});
define('skylark-widgets-wordpad/Popover',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./Wordpad",
  "./i18n"
],function(langx,$,Wordpad,i18n){ 

  var Popover = langx.Evented.inherit({
     init : function(opts) {
      this.action = opts.action;
      this.editor = opts.action.editor;
      this._init();
    }
  });


  Popover.prototype.offset = {
    top: 4,
    left: 0
  };

  Popover.prototype.target = null;

  Popover.prototype.active = false;

  Popover.prototype._init = function() {
    this.el = $('<div class="wordpad-popover"></div>').appendTo(this.editor.el).data('popover', this);
    this.render();
    this.el.on('mouseenter', (function(_this) {
      return function(e) {
        return _this.el.addClass('hover');
      };
    })(this));
    return this.el.on('mouseleave', (function(_this) {
      return function(e) {
        return _this.el.removeClass('hover');
      };
    })(this));
  };

  Popover.prototype.render = function() {};

  Popover.prototype._initLabelWidth = function() {
    var $fields;
    $fields = this.el.find('.settings-field');
    if (!($fields.length > 0)) {
      return;
    }
    this._labelWidth = 0;
    $fields.each((function(_this) {
      return function(i, field) {
        var $field, $label;
        $field = $(field);
        $label = $field.find('label');
        if (!($label.length > 0)) {
          return;
        }
        return _this._labelWidth = Math.max(_this._labelWidth, $label.width());
      };
    })(this));
    return $fields.find('label').width(this._labelWidth);
  };

  Popover.prototype.show = function($target, position) {
    if (position == null) {
      position = 'bottom';
    }
    if ($target == null) {
      return;
    }
    this.el.siblings('.wordpad-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
    if (this.active && this.target) {
      this.target.removeClass('selected');
    }
    this.target = $target.addClass('selected');
    if (this.active) {
      this.refresh(position);
      return this.trigger('popovershow');
    } else {
      this.active = true;
      this.el.css({
        left: -9999
      }).show();
      if (!this._labelWidth) {
        this._initLabelWidth();
      }
      this.editor.editable.util.reflow();
      this.refresh(position);
      return this.trigger('popovershow');
    }
  };

  Popover.prototype.hide = function() {
    if (!this.active) {
      return;
    }
    if (this.target) {
      this.target.removeClass('selected');
    }
    this.target = null;
    this.active = false;
    this.el.hide();
    return this.trigger('popoverhide');
  };

  Popover.prototype.refresh = function(position) {
    var editorOffset, left, maxLeft, targetH, targetOffset, top;
    if (position == null) {
      position = 'bottom';
    }
    if (!this.active) {
      return;
    }
    editorOffset = this.editor.el.offset();
    targetOffset = this.target.offset();
    targetH = this.target.outerHeight();
    if (position === 'bottom') {
      top = targetOffset.top - editorOffset.top + targetH;
    } else if (position === 'top') {
      top = targetOffset.top - editorOffset.top - this.el.height();
    }
    maxLeft = this.editor.wrapper.width() - this.el.outerWidth() - 10;
    left = Math.min(targetOffset.left - editorOffset.left, maxLeft);
    return this.el.css({
      top: top + this.offset.top,
      left: left + this.offset.left
    });
  };

  Popover.prototype.destroy = function() {
    this.target = null;
    this.active = false;
    this.editor.off('.linkpopover');
    return this.el.remove();
  };

  Popover.prototype._t = function(name) {
    var args, ref, result;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    result = i18n.translate.apply(i18n, args);
    return result;
  };

  Wordpad.Popover = Popover;

  return Popover;

	
});
define('skylark-widgets-wordpad/addons/actions/AlignmentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var AlignmentAction = Action.inherit({
    name : "alignment",

    icon : 'align-left',
    
    htmlTag : 'p, h1, h2, h3, h4, td, th',

    _init : function() {
     Action.prototype._init.call(this);
     this.menu = [
          {
            name: 'left',
            text: i18n.translate('alignLeft'),
            icon: 'align-left',
            param: 'left'
          }, {
            name: 'center',
            text: i18n.translate('alignCenter'),
            icon: 'align-center',
            param: 'center'
          }, {
            name: 'right',
            text: i18n.translate('alignRight'),
            icon: 'align-right',
            param: 'right'
          }
      ] ;    
    },


    _execute : function(align) {
      return this.editor.editable.alignment(align,this.htmlTag);
    },

    setActive : function(align) {
      if (align == null) {
        align = 'left';
      }
      if (align !== 'left' && align !== 'center' && align !== 'right') {
        align = 'left';
      }
      Action.prototype.setActive.call(this, align);
   },

    _status : function() {
      var value = this.editor.editable.status("alignment",this.htmlTag);
      if (value) {
        this.setDisabled(false);
        return this.setActive(value);
      } else {
        this.setDisabled(true);
        return this.setActive("left");
      }    
    }
  });
 
  return addons.actions.alignment = AlignmentAction;
});
define('skylark-widgets-wordpad/addons/actions/BlockquoteAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'quote-left',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
      }
   });


   addons.actions.blockquote = BlockquoteAction; 

   return BlockquoteAction;
});
define('skylark-widgets-wordpad/addons/actions/BoldAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
    var BoldAction = Action.inherit({
      name : 'bold',

      icon : 'bold',

      htmlTag : 'b, strong',

      disableTag : 'pre',

      shortcut : 'cmd+b',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + b )';
        } else {
          this.title = this.title + ' ( Ctrl + b )';
          this.shortcut = 'ctrl+b';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('bold');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.bold();
      }

    });


    addons.actions.bold = BoldAction; 

    return BoldAction;
});
define('skylark-widgets-wordpad/addons/actions/CodePopover',[
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  
   var CodePopover = Popover.inherit({
     render : function() {
      var $option, k, lang, len, ref;
      this._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">" + (this._t('selectLanguage')) + "</option>\n    </select>\n  </div>\n</div>";
      this.langs = this.editor.opts.codeLanguages || [
        {
          name: 'Bash',
          value: 'bash'
        }, {
          name: 'C++',
          value: 'c++'
        }, {
          name: 'C#',
          value: 'cs'
        }, {
          name: 'CSS',
          value: 'css'
        }, {
          name: 'Erlang',
          value: 'erlang'
        }, {
          name: 'Less',
          value: 'less'
        }, {
          name: 'Sass',
          value: 'sass'
        }, {
          name: 'Diff',
          value: 'diff'
        }, {
          name: 'CoffeeScript',
          value: 'coffeescript'
        }, {
          name: 'HTML,XML',
          value: 'html'
        }, {
          name: 'JSON',
          value: 'json'
        }, {
          name: 'Java',
          value: 'java'
        }, {
          name: 'JavaScript',
          value: 'js'
        }, {
          name: 'Markdown',
          value: 'markdown'
        }, {
          name: 'Objective C',
          value: 'oc'
        }, {
          name: 'PHP',
          value: 'php'
        }, {
          name: 'Perl',
          value: 'parl'
        }, {
          name: 'Python',
          value: 'python'
        }, {
          name: 'Ruby',
          value: 'ruby'
        }, {
          name: 'SQL',
          value: 'sql'
        }
      ];
      this.el.addClass('code-popover').append(this._tpl);
      this.selectEl = this.el.find('.select-lang');
      ref = this.langs;
      for (k = 0, len = ref.length; k < len; k++) {
        lang = ref[k];
        $option = $('<option/>', {
          text: lang.name,
          value: lang.value
        }).appendTo(this.selectEl);
      }
      this.selectEl.on('change', (function(_this) {
        return function(e) {
          var selected;
          _this.lang = _this.selectEl.val();
          selected = _this.target.hasClass('selected');
          _this.target.removeClass().removeAttr('data-lang');
          if (_this.lang !== -1) {
            _this.target.attr('data-lang', _this.lang);
          }
          if (selected) {
            _this.target.addClass('selected');
          }
          return _this.editor.trigger('valuechanged');
        };
      })(this));
      return this.editor.on('valuechanged', (function(_this) {
        return function(e) {
          if (_this.active) {
            return _this.refresh();
          }
        };
      })(this));
    },

    show : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      this.lang = this.target.attr('data-lang');
      if (this.lang != null) {
        return this.selectEl.val(this.lang);
      } else {
        return this.selectEl.val(-1);
      }
    }
   });

  return CodePopover;
});
define('skylark-widgets-wordpad/addons/actions/CodeAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./CodePopover"
],function($,addons,Action,CodePopover){ 
  

   var CodeAction = Action.inherit({
      name : 'code',

      icon : 'code',

      htmlTag : 'pre',

      disableTag : 'ul, ol, table',

      _init : function() {
        Action.prototype._init.call(this);
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.decorate($(pre));
            });
          };
        })(this));
        return this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.undecorate($(pre));
            });
          };
        })(this));
      },

      _checkMode : function() {
        var $blockNodes, range;
        range = this.editor.editable.selection.range();
        if (($blockNodes = $(range.cloneContents()).find(this.editor.editable.util.blockNodes.join(','))) > 0 || (range.collapsed && this.editor.editable.selection.startNodes().filter('code').length === 0)) {
          this.inlineMode = false;
          return this.htmlTag = 'pre';
        } else {
          this.inlineMode = true;
          return this.htmlTag = 'code';
        }
      },

      _status : function() {
        this._checkMode();
        Action.prototype._status.call(this);
        if (this.inlineMode) {
          return;
        }
        if (this.active) {
          if (!this.popover) {
            this.popover = new CodePopover({
              action: this
            });
          }
          return this.popover.show(this.node);
        } else {
          if (this.popover) {
            return this.popover.hide();
          }
        }
      },

      decorate : function($pre) {
        var $code, lang, ref, ref1;
        $code = $pre.find('> code');
        if ($code.length > 0) {
          lang = (ref = $code.attr('class')) != null ? (ref1 = ref.match(/lang-(\S+)/)) != null ? ref1[1] : void 0 : void 0;
          $code.contents().unwrap();
          if (lang) {
            return $pre.attr('data-lang', lang);
          }
        }
      },

      undecorate : function($pre) {
        var $code, lang;
        lang = $pre.attr('data-lang');
        $code = $('<code/>');
        if (lang && lang !== -1) {
          $code.addClass('lang-' + lang);
        }
        return $pre.wrapInner($code).removeAttr('data-lang');
      },

      _execute : function() {
        if (this.inlineMode) {
          return this._inlineCommand();
        } else {
          return this._blockCommand();
        }
      },

      _blockCommand : function() {
        return this.editor.editable.blockCode(this.htmlTag,this.disableTag);
      },

      _inlineCommand : function() {
        return this.editor.editable.inlineCode(this.active);
      }
   });


   addons.actions.code = CodeAction; 

   return CodeAction;

});
define('skylark-widgets-wordpad/addons/actions/ColorAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  

   var ColorAction = Action.inherit({
    name : 'color',

    icon : 'tint',

    disableTag : 'pre',

    menu : true

   });

   addons.actions.color = ColorAction; 


   return ColorAction;
	
});
define('skylark-widgets-wordpad/addons/actions/EmojiAction',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(langx,$,addons,Action){ 
  var EmojiAction = Action.inherit({
    name : 'emoji',

    icon : 'smile-o',

    menu : true,

    _init : function() {
      Action.prototype._init.apply(this);
      langx.merge(this.editor.editable.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
    }

  });


  addons.actions.emoji = EmojiAction; 

  return EmojiAction;
	
});
define('skylark-widgets-wordpad/addons/actions/FontScaleAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  
  var FontScaleAction = Action.inherit({
    name : 'fontScale',

    icon : 'font',

    htmlTag : 'span',

    disableTag : 'pre, h1, h2, h3, h4, h5',


    _init : function() {
      this.menu = [
        {
          name: '150%',
          text: i18n.translate('fontScaleXLarge'),
          param: '5'
        }, {
          name: '125%',
          text: i18n.translate('fontScaleLarge'),
          param: '4'
        }, {
          name: '100%',
          text: i18n.translate('fontScaleNormal'),
          param: '3'
        }, {
          name: '75%',
          text: i18n.translate('fontScaleSmall'),
          param: '2'
        }, {
          name: '50%',
          text: i18n.translate('fontScaleXSmall'),
          param: '1'
        }
      ];
      return Action.prototype._init.call(this);
    },

    _activeStatus : function() {
      var active, endNode, endNodes, range, startNode, startNodes;
      range = this.editor.editable.selection.range();
      startNodes = this.editor.editable.selection.startNodes();
      endNodes = this.editor.editable.selection.endNodes();
      startNode = startNodes.filter('span[style*="font-size"]');
      endNode = endNodes.filter('span[style*="font-size"]');
      active = startNodes.length > 0 && endNodes.length > 0 && startNode.is(endNode);
      this.setActive(active);
      return this.active;
    },

    _execute : function(param) {
      return this.editor.editable.fontScale(param);
    }
  });


  addons.actions.fontScale = FontScaleAction; 

  return FontScaleAction;
});
define('skylark-widgets-wordpad/addons/actions/FullScreenAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 

  
  var FullScrennAction = Action.inherit({
    name : 'fullscreen',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);

      this.window = $(window);
      this.body = $('body');
      this.editable = this.editor.body;
    },

    iconClassOf : function() {
      return 'icon-fullscreen';
    },


    status : function() {
      return this.setActive(this.body.hasClass(this.constructor.cls));
    },

    _execute : function() {
      var editablePadding, isFullscreen;
      this.body.toggleClass(this.constructor.cls);
      isFullscreen = this.body.hasClass(this.constructor.cls);
      if (isFullscreen) {
        editablePadding = this.editable.outerHeight() - this.editable.height();
        this.window.on("resize.wordpad-fullscreen-" + this.editor.id, (function(_this) {
          return function() {
            return _this._resize({
              height: _this.window.height() - _this.editor.toolbar.outerHeight() - editablePadding
            });
          };
        })(this)).resize();
      } else {
        this.window.off("resize.wordpad-fullscreen-" + this.editor.id).resize();
        this._resize({
          height: 'auto'
        });
      }
      return this.setActive(isFullscreen);
    },

    _resize : function(size) {
      return this.editable.height(size.height);
    }
  });

  FullScrennAction.cls = 'wordpad-fullscreen';

  FullScrennAction.i18n = {
    'zh-CN': {
      fullscreen: '全屏'
    }
  };


  addons.actions.fullscreen = FullScrennAction; 

  return FullScrennAction;

 }); 
define('skylark-widgets-wordpad/addons/actions/HrAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var HrAction = Action.inherit({

	  name : 'hr',

	  icon : 'minus',

	  htmlTag : 'hr',

	  _status : function() {},

	  _execute : function() {
	    return this.editor.editable.hr();
	  }

   });


  addons.actions.hr = HrAction; 

  return HrAction;	
});
define('skylark-widgets-wordpad/addons/actions/HtmlAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
   var  hasProp = {}.hasOwnProperty,
        slice = [].slice;
  

   var HtmlAction = Action.inherit({
    name : 'html',

    icon : 'html5',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);
      this.editor.textarea.on('focus', (function(_this) {
        return function(e) {
          return _this.editor.el.addClass('focus').removeClass('error');
        };
      })(this));
      this.editor.textarea.on('blur', (function(_this) {
        return function(e) {
          _this.editor.el.removeClass('focus');
          return _this.editor.setValue(_this.editor.textarea.val());
        };
      })(this));
      return this.editor.textarea.on('input', (function(_this) {
        return function(e) {
          return _this._resizeTextarea();
        };
      })(this));
    },

    status : function() {},

    _execute : function() {
      var action, i, len, ref;
      this.editor.blur();
      this.editor.el.toggleClass('wordpad-html');
      this.editor.htmlMode = this.editor.el.hasClass('wordpad-html');
      if (this.editor.htmlMode) {
        this.editor.hidePopover();
        this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val()));
        this._resizeTextarea();
      } else {
        this.editor.setValue(this.editor.textarea.val());
      }
      ref = this.editor._actions;
      for (i = 0, len = ref.length; i < len; i++) {
        action = ref[i];
        if (action.name === 'html') {
          action.setActive(this.editor.htmlMode);
        } else {
          action.setDisabled(this.editor.htmlMode);
        }
      }
      return null;
    },

    beautifyHTML : function() {
      return arguments[0];
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (beautify.html) {
        return beautify.html.apply(beautify, args);
      } else {
        return beautify.apply(null, args);
      }
    },

    _resizeTextarea : function() {
      this._textareaPadding || (this._textareaPadding = this.editor.textarea.innerHeight() - this.editor.textarea.height());
      return this.editor.textarea.height(this.editor.textarea[0].scrollHeight - this._textareaPadding);
    }

   });


   addons.actions.html = HtmlAction; 

   return HtmlAction;
});
define('skylark-widgets-wordpad/addons/actions/ImagePopover',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function(langx, $,addons,Popover){ 
   var ImagePopover = Popover.inherit({

   });

  ImagePopover.prototype.offset = {
    top: 6,
    left: -4
  };

  ImagePopover.prototype.render = function() {
    var tpl;
    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\"\n      title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\"\n      title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-undo\"></span>\n    </a>\n  </div>\n</div>";
    this.el.addClass('image-popover').append(tpl);
    this.srcEl = this.el.find('.image-src');
    this.widthEl = this.el.find('#image-width');
    this.heightEl = this.el.find('#image-height');
    this.altEl = this.el.find('#image-alt');
    this.srcEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (!(e.which === 13 && !_this.target.hasClass('uploading'))) {
          return;
        }
        e.preventDefault();
        range = document.createRange();
        _this.Action.editor.editable.selection.setRangeAfter(_this.target, range);
        return _this.hide();
      };
    })(this));
    this.srcEl.on('blur', (function(_this) {
      return function(e) {
        return _this._loadImage(_this.srcEl.val());
      };
    })(this));
    this.el.find('.image-size').on('blur', (function(_this) {
      return function(e) {
        _this._resizeImg($(e.currentTarget));
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.el.find('.image-size').on('keyup', (function(_this) {
      return function(e) {
        var inputEl;
        inputEl = $(e.currentTarget);
        if (!(e.which === 13 || e.which === 27 || e.which === 9)) {
          return _this._resizeImg(inputEl, true);
        }
      };
    })(this));
    this.el.find('.image-size').on('keydown', (function(_this) {
      return function(e) {
        var $img, inputEl, range;
        inputEl = $(e.currentTarget);
        if (e.which === 13 || e.which === 27) {
          e.preventDefault();
          if (e.which === 13) {
            _this._resizeImg(inputEl);
          } else {
            _this._restoreImg();
          }
          $img = _this.target;
          _this.hide();
          range = document.createRange();
          return _this.Action.editor.editable.selection.setRangeAfter($img, range);
        } else if (e.which === 9) {
          return _this.el.data('popover').refresh();
        }
      };
    })(this));
    this.altEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (e.which === 13) {
          e.preventDefault();
          range = document.createRange();
          _this.Action.editor.editable.selection.setRangeAfter(_this.target, range);
          return _this.hide();
        }
      };
    })(this));
    this.altEl.on('keyup', (function(_this) {
      return function(e) {
        if (e.which === 13 || e.which === 27 || e.which === 9) {
          return;
        }
        _this.alt = _this.altEl.val();
        return _this.target.attr('alt', _this.alt);
      };
    })(this));
    this.el.find('.btn-restore').on('click', (function(_this) {
      return function(e) {
        _this._restoreImg();
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.editor.on('valuechanged', (function(_this) {
      return function(e) {
        if (_this.active) {
          return _this.refresh();
        }
      };
    })(this));
    return this._initUploader();
  };

  ImagePopover.prototype._initUploader = function() {
    var $uploadBtn, createInput;
    $uploadBtn = this.el.find('.btn-upload');
    if (this.editor.uploader == null) {
      $uploadBtn.remove();
      return;
    }
    createInput = (function(_this) {
      return function() {
        if (_this.input) {
          _this.input.remove();
        }
        return _this.input = $('<input/>', {
          type: 'file',
          title: _this._t('uploadImage'),
          multiple: true,
          accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
        }).appendTo($uploadBtn);
      };
    })(this);
    createInput();
    this.el.on('click mousedown', 'input[type=file]', function(e) {
      return e.stopPropagation();
    });
    return this.el.on('change', 'input[type=file]', (function(_this) {
      return function(e) {
        _this.editor.uploader.upload(_this.input, {
          inline: true,
          img: _this.target
        });
        return createInput();
      };
    })(this));
  };

  ImagePopover.prototype._resizeImg = function(inputEl, onlySetVal) {
    var height, value, width;
    if (onlySetVal == null) {
      onlySetVal = false;
    }
    value = inputEl.val() * 1;
    if (!(this.target && (langx.isNumber(value) || value < 0))) {
      return;
    }
    if (inputEl.is(this.widthEl)) {
      width = value;
      height = this.height * value / this.width;
      this.heightEl.val(height);
    } else {
      height = value;
      width = this.width * value / this.height;
      this.widthEl.val(width);
    }
    if (!onlySetVal) {
      this.target.attr({
        width: width,
        height: height
      });
      return this.editor.trigger('valuechanged');
    }
  };

  ImagePopover.prototype._restoreImg = function() {
    var ref, size;
    size = ((ref = this.target.data('image-size')) != null ? ref.split(",") : void 0) || [this.width, this.height];
    this.target.attr({
      width: size[0] * 1,
      height: size[1] * 1
    });
    this.widthEl.val(size[0]);
    this.heightEl.val(size[1]);
    return this.editor.trigger('valuechanged');
  };

  ImagePopover.prototype._loadImage = function(src, callback) {
    if (/^data:image/.test(src) && !this.editor.uploader) {
      if (callback) {
        callback(false);
      }
      return;
    }
    if (this.target.attr('src') === src) {
      return;
    }
    return this.Action.loadImage(this.target, src, (function(_this) {
      return function(img) {
        var blob;
        if (!img) {
          return;
        }
        if (_this.active) {
          _this.width = img.width;
          _this.height = img.height;
          _this.widthEl.val(_this.width);
          _this.heightEl.val(_this.height);
        }
        if (/^data:image/.test(src)) {
          blob = _this.editor.editable.util.dataURLtoBlob(src);
          blob.name = "Base64 Image.png";
          _this.editor.uploader.upload(blob, {
            inline: true,
            img: _this.target
          });
        } else {
          _this.editor.trigger('valuechanged');
        }
        if (callback) {
          return callback(img);
        }
      };
    })(this));
  };

  ImagePopover.prototype.show = function() {
    var $img, args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Popover.prototype.show.apply(this, args);
    $img = this.target;
    this.width = $img.width();
    this.height = $img.height();
    this.alt = $img.attr('alt');
    if ($img.hasClass('uploading')) {
      return this.srcEl.val(this._t('uploading')).prop('disabled', true);
    } else {
      this.srcEl.val($img.attr('src')).prop('disabled', false);
      this.widthEl.val(this.width);
      this.heightEl.val(this.height);
      return this.altEl.val(this.alt);
    }
  };

  return ImagePopover;

});
define('skylark-widgets-wordpad/addons/actions/ImageAction',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./ImagePopover",
  "../../i18n"
],function(langx, $,addons,Action,ImagePopover,i18n){ 
   var ImageAction = Action.inherit({
      name : 'image',

      icon : 'picture-o',

      htmlTag : 'img',

      disableTag : 'pre, table',

      defaultImage : '',

      needFocus : false,

      _init : function() {
        var item, k, len, ref;
        if (this.editor.opts.imageAction) {
          if (Array.isArray(this.editor.opts.imageAction)) {
            this.menu = [];
            ref = this.editor.opts.imageAction;
            for (k = 0, len = ref.length; k < len; k++) {
              item = ref[k];
              this.menu.push({
                name: item + '-image',
                text: this._t(item + 'Image')
              });
            }
          } else {
            this.menu = false;
          }
        } else {
          if (this.editor.uploader != null) {
            this.menu = [
              {
                name: 'upload-image',
                text: i18n.translate('uploadImage')
              }, {
                name: 'external-image',
                text: i18n.translate('externalImage')
              }
            ];
          } else {
            this.menu = false;
          }
        }
        this.defaultImage = this.editor.opts.defaultImage;
        this.editor.body.on('click', 'img:not([data-non-image])', (function(_this) {
          return function(e) {
            var $img, range;
            $img = $(e.currentTarget);
            range = document.createRange();
            range.selectNode($img[0]);
            _this.editor.editable.selection.range(range);
            if (!_this.editor.editable.util.support.onselectionchange) {
              _this.editor.trigger('selectionchanged');
            }
            return false;
          };
        })(this));
        this.editor.body.on('mouseup', 'img:not([data-non-image])', function(e) {
          return false;
        });
        this.editor.on('selectionchanged.image', (function(_this) {
          return function() {
            var $contents, $img, range;
            range = _this.editor.editable.selection.range();
            if (range == null) {
              return;
            }
            $contents = $(range.cloneContents()).contents();
            if ($contents.length === 1 && $contents.is('img:not([data-non-image])')) {
              $img = $(range.startContainer).contents().eq(range.startOffset);
              if (!_this.popover) {
                _this.popover = new ImagePopover({
                  action: _this
                });                
              }

              return _this.popover.show($img);
            } else {
              if (_this.popover) {
                  return _this.popover.hide();
              }
            }
          };
        })(this));
        this.editor.on('valuechanged.image', (function(_this) {
          return function() {
            var $masks;
            $masks = _this.editor.wrapper.find('.wordpad-image-loading');
            if (!($masks.length > 0)) {
              return;
            }
            return $masks.each(function(i, mask) {
              var $img, $mask, file;
              $mask = $(mask);
              $img = $mask.data('img');
              if (!($img && $img.parent().length > 0)) {
                $mask.remove();
                if ($img) {
                  file = $img.data('file');
                  if (file) {
                    _this.editor.uploader.cancel(file);
                    if (_this.editor.body.find('img.uploading').length < 1) {
                      return _this.editor.uploader.trigger('uploadready', [file]);
                    }
                  }
                }
              }
            });
          };
        })(this));
        return Action.prototype._init.call(this);
      },

      render : function() {
        var args;
        args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
        Action.prototype.render.apply(this, args);
        this.popover = new ImagePopover({
          Action: this
        });
        if (this.editor.opts.imageAction === 'upload') {
          return this._initUploader(this.el);
        }
      },

      renderMenu : function() {
        Action.prototype.renderMenu.call(this);
        return this._initUploader();
      },

      _initUploader : function($uploadItem) {
        var $input, createInput, uploadProgress;
        if ($uploadItem == null) {
          $uploadItem = this.menuEl.find('.menu-item-upload-image');
        }
        if (this.editor.uploader == null) {
          this.el.find('.btn-upload').remove();
          return;
        }
        $input = null;
        createInput = (function(_this) {
          return function() {
            if ($input) {
              $input.remove();
            }
            return $input = $('<input/>', {
              type: 'file',
              title: _this._t('uploadImage'),
              multiple: true,
              accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
            }).appendTo($uploadItem);
          };
        })(this);
        createInput();
        $uploadItem.on('click mousedown', 'input[type=file]', function(e) {
          return e.stopPropagation();
        });
        $uploadItem.on('change', 'input[type=file]', (function(_this) {
          return function(e) {
            if (_this.editor.editable.inputManager.focused) {
              _this.editor.uploader.upload($input, {
                inline: true
              });
              createInput();
            } else {
              _this.editor.one('focus', function(e) {
                _this.editor.uploader.upload($input, {
                  inline: true
                });
                return createInput();
              });
              _this.editor.focus();
            }
            return _this.wrapper.removeClass('menu-on');
          };
        })(this));
        this.editor.uploader.on('beforeupload', (function(_this) {
          return function(e, file) {
            var $img;
            if (!file.inline) {
              return;
            }
            if (file.img) {
              $img = $(file.img);
            } else {
              $img = _this.createImage(file.name);
              file.img = $img;
            }
            $img.addClass('uploading');
            $img.data('file', file);
            return _this.editor.uploader.readImageFile(file.obj, function(img) {
              var src;
              if (!$img.hasClass('uploading')) {
                return;
              }
              src = img ? img.src : _this.defaultImage;
              return _this.loadImage($img, src, function() {
                if (_this.popover.active) {
                  _this.popover.refresh();
                  return _this.popover.srcEl.val(_this._t('uploading')).prop('disabled', true);
                }
              });
            });
          };
        })(this));
        uploadProgress = langx.proxy(this.editor.editable.util.throttle(function(e, file, loaded, total) {
          var $img, $mask, percent;
          if (!file.inline) {
            return;
          }
          $mask = file.img.data('mask');
          if (!$mask) {
            return;
          }
          $img = $mask.data('img');
          if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
            $mask.remove();
            return;
          }
          percent = loaded / total;
          percent = (percent * 100).toFixed(0);
          if (percent > 99) {
            percent = 99;
          }
          return $mask.find('.progress').height((100 - percent) + "%");
        }, 500), this);
        this.editor.uploader.on('uploadprogress', uploadProgress);
        this.editor.uploader.on('uploadsuccess', (function(_this) {
          return function(e, file, result) {
            var $img, img_path, msg;
            if (!file.inline) {
              return;
            }
            $img = file.img;
            if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
              return;
            }
            if (typeof result !== 'object') {
              try {
                result = JSON.parse(result);
              } catch (_error) {
                e = _error;
                result = {
                  success: false
                };
              }
            }
            if (result.success === false) {
              msg = result.msg || _this._t('uploadFailed');
              alert(msg);
              img_path = _this.defaultImage;
            } else {
              img_path = result.file_path;
            }
            _this.loadImage($img, img_path, function() {
              var $mask;
              $img.removeData('file');
              $img.removeClass('uploading').removeClass('loading');
              $mask = $img.data('mask');
              if ($mask) {
                $mask.remove();
              }
              $img.removeData('mask');
              _this.editor.trigger('valuechanged');
              if (_this.editor.body.find('img.uploading').length < 1) {
                return _this.editor.uploader.trigger('uploadready', [file, result]);
              }
            });
            if (_this.popover.active) {
              _this.popover.srcEl.prop('disabled', false);
              return _this.popover.srcEl.val(result.file_path);
            }
          };
        })(this));
        return this.editor.uploader.on('uploaderror', (function(_this) {
          return function(e, file, xhr) {
            var $img, msg, result;
            if (!file.inline) {
              return;
            }
            if (xhr.statusText === 'abort') {
              return;
            }
            if (xhr.responseText) {
              try {
                result = JSON.parse(xhr.responseText);
                msg = result.msg;
              } catch (_error) {
                e = _error;
                msg = _this._t('uploadError');
              }
            }
            $img = file.img;
            if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
              return;
            }
            _this.loadImage($img, _this.defaultImage, function() {
              var $mask;
              $img.removeData('file');
              $img.removeClass('uploading').removeClass('loading');
              $mask = $img.data('mask');
              if ($mask) {
                $mask.remove();
              }
              return $img.removeData('mask');
            });
            if (_this.popover.active) {
              _this.popover.srcEl.prop('disabled', false);
              _this.popover.srcEl.val(_this.defaultImage);
            }
            _this.editor.trigger('valuechanged');
            if (_this.editor.body.find('img.uploading').length < 1) {
              return _this.editor.uploader.trigger('uploadready', [file, result]);
            }
          };
        })(this));
      },

      _status : function() {
        return this._disableStatus();
      },

      loadImage : function($img, src, callback) {
        var $mask, img, positionMask;
        positionMask = (function(_this) {
          return function() {
            var imgOffset, wrapperOffset;
            imgOffset = $img.offset();
            wrapperOffset = _this.editor.wrapper.offset();
            return $mask.css({
              top: imgOffset.top - wrapperOffset.top,
              left: imgOffset.left - wrapperOffset.left,
              width: $img.width(),
              height: $img.height()
            }).show();
          };
        })(this);
        $img.addClass('loading');
        $mask = $img.data('mask');
        if (!$mask) {
          $mask = $('<div class="wordpad-image-loading">\n  <div class="progress"></div>\n</div>').hide().appendTo(this.editor.wrapper);
          positionMask();
          $img.data('mask', $mask);
          $mask.data('img', $img);
        }
        img = new Image();
        img.onload = (function(_this) {
          return function() {
            var height, width;
            if (!$img.hasClass('loading') && !$img.hasClass('uploading')) {
              return;
            }
            width = img.width;
            height = img.height;
            $img.attr({
              src: src,
              width: width,
              height: height,
              'data-image-size': width + ',' + height
            }).removeClass('loading');
            if ($img.hasClass('uploading')) {
              _this.editor.editable.util.reflow(_this.editor.body);
              positionMask();
            } else {
              $mask.remove();
              $img.removeData('mask');
            }
            if (langx.isFunction(callback)) {
              return callback(img);
            }
          };
        })(this);
        img.onerror = function() {
          if (langx.isFunction(callback)) {
            callback(false);
          }
          $mask.remove();
          return $img.removeData('mask').removeClass('loading');
        };
        return img.src = src;
      },

      createImage : function(name) {
        var $img, range;
        if (name == null) {
          name = 'Image';
        }
        if (!this.editor.editable.inputManager.focused) {
          this.editor.focus();
        }
        range = this.editor.editable.selection.range();
        range.deleteContents();
        this.editor.editable.selection.range(range);
        $img = $('<img/>').attr('alt', name);
        range.insertNode($img[0]);
        this.editor.editable.selection.setRangeAfter($img, range);
        this.editor.trigger('valuechanged');
        return $img;
      },

      _execute : function(src) {
        var $img;
        $img = this.createImage();
        return this.loadImage($img, src || this.defaultImage, (function(_this) {
          return function() {
            _this.editor.trigger('valuechanged');
            _this.editor.editable.util.reflow($img);
            $img.click();
            return _this.popover.one('popovershow', function() {
              _this.popover.srcEl.focus();
              return _this.popover.srcEl[0].select();
            });
          };
        })(this));
      }

   });

   addons.actions.image = ImageAction; 

   return ImageAction;

});
define('skylark-widgets-wordpad/addons/actions/IndentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
   var IndentAction = Action.inherit({
      name :'indent',

      icon : 'indent',

      _init : function() {
        var hotkey;
        hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
        this.title = this._t(this.name) + hotkey;
        return Action.prototype._init.call(this);
      },

      _execute : function() {
        return this.editor.editable.indent()
      }

   });


   addons.actions.indent = IndentAction; 

   return IndentAction;
});
define('skylark-widgets-wordpad/addons/actions/ItalicAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  

  var ItalicAction = Action.inherit({
      name : 'italic',

      icon : 'italic',

      htmlTag : 'i',

      disableTag : 'pre',

      shortcut : 'cmd+i',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + " ( Cmd + i )";
        } else {
          this.title = this.title + " ( Ctrl + i )";
          this.shortcut = 'ctrl+i';
        }
        return Action.prototype._init.call(this);
      },

      _activeStatus : function() {
        var active;
        active = this.editor.editable.isActive('italic');
        this.setActive(active);
        return this.active;
      },

      _execute : function() {
        return this.editor.editable.italic();
      }
   });


   addons.actions.italic = ItalicAction; 

   return ItalicAction;

});
define('skylark-widgets-wordpad/addons/actions/LinkPopover',[
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  var LinkPopover = Popover.inherit({
    render : function() {
      var tpl;
      tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkText')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\"\n      tabindex=\"-1\">\n      <span class=\"wordpad-icon wordpad-icon-unlink\"></span>\n    </a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkTarget')) + "</label>\n    <select class=\"link-target\">\n      <option value=\"_blank\">" + (this._t('openLinkInNewWindow')) + " (_blank)</option>\n      <option value=\"_self\">" + (this._t('openLinkInCurrentWindow')) + " (_self)</option>\n    </select>\n  </div>\n</div>";
      this.el.addClass('link-popover').append(tpl);
      this.textEl = this.el.find('.link-text');
      this.urlEl = this.el.find('.link-url');
      this.unlinkEl = this.el.find('.btn-unlink');
      this.selectTarget = this.el.find('.link-target');
      this.textEl.on('keyup', (function(_this) {
        return function(e) {
          if (e.which === 13) {
            return;
          }
          _this.target.text(_this.textEl.val());
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      this.urlEl.on('keyup', (function(_this) {
        return function(e) {
          var val;
          if (e.which === 13) {
            return;
          }
          val = _this.urlEl.val();
          if (!(/^(http|https|ftp|ftps|file)?:\/\/|^(mailto|tel)?:|^\//ig.test(val) || !val)) {
            val = 'http://' + val;
          }
          _this.target.attr('href', val);
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      $([this.urlEl[0], this.textEl[0]]).on('keydown', (function(_this) {
        return function(e) {
          var range;
          if (e.which === 13 || e.which === 27 || (!e.shiftKey && e.which === 9 && $(e.target).hasClass('link-url'))) {
            e.preventDefault();
            range = document.createRange();
            _this.editor.editable.selection.setRangeAfter(_this.target, range);
            _this.hide();
            return _this.editor.editable.inputManager.throttledValueChanged();
          }
        };
      })(this));
      this.unlinkEl.on('click', (function(_this) {
        return function(e) {
          var range, txtNode;
          txtNode = document.createTextNode(_this.target.text());
          _this.target.replaceWith(txtNode);
          _this.hide();
          range = document.createRange();
          _this.editor.editable.selection.setRangeAfter(txtNode, range);
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
      return this.selectTarget.on('change', (function(_this) {
        return function(e) {
          _this.target.attr('target', _this.selectTarget.val());
          return _this.editor.editable.inputManager.throttledValueChanged();
        };
      })(this));
    },

    show : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      this.textEl.val(this.target.text());
      return this.urlEl.val(this.target.attr('href'));
    }
  });

  return LinkPopover;
});
define('skylark-widgets-wordpad/addons/actions/LinkAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n",
  "./LinkPopover"
],function($,addons,Action,i18n,LinkPopover){ 
  

  var LinkAction = Action.inherit({
    name : 'link',

    icon : 'link',

    htmlTag : 'a',

    disableTag : 'pre',

    _status : function() {
     Action.prototype._status.call(this);
      if (this.active && !this.editor.editable.selection.rangeAtEndOf(this.node)) {
        if (!this.popover) {
          this.popover = new LinkPopover({
            action: this
          });
        }
        return this.popover.show(this.node);
      } else {
        if (this.popover) {
          return this.popover.hide();
        }
      }
    },

    _execute : function() {
      if (this.active) {
        this.popover.one('popovershow', (function(_this) {
          return function() {
            if (linkText) {
              _this.popover.urlEl.focus();
              return _this.popover.urlEl[0].select();
            } else {
              _this.popover.textEl.focus();
              return _this.popover.textEl[0].select();
            }
          };
        })(this));

      }

      return this.editor.editable.link(this.active,i18n.translate('linkText'));

    }

   });



  addons.actions.link = LinkAction; 

  return LinkAction;

});
define('skylark-widgets-wordpad/addons/actions/ListAction',[
  "skylark-domx-noder",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(noder,$,addons,Action){ 
  var ListAction = Action.inherit({
    type : '',

    disableTag : 'pre, table',

    _execute : function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    }

   });



    return ListAction;
	
});
define('skylark-widgets-wordpad/addons/actions/MarkAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 


  var MarkAction = Action.inherit({
    name : 'mark',

    icon : 'mark',

    htmlTag : 'mark',

    disableTag : 'pre, table',

    _execute : function() {
      var $end, $start, range;
      range = this.editor.editable.selection.range();
      if (this.active) {
        this.editor.editable.selection.save();
        this.unmark(range);
        this.editor.editable.selection.restore();
        this.editor.trigger('valuechanged');
        return;
      }
      if (range.collapsed) {
        return;
      }
      this.editor.editable.selection.save();
      $start = $(range.startContainer);
      $end = $(range.endContainer);
      if ($start.closest('mark').length) {
        range.setStartBefore($start.closest('mark')[0]);
      }
      if ($end.closest('mark').length) {
        range.setEndAfter($end.closest('mark')[0]);
      }
      this.mark(range);
      this.editor.editable.selection.restore();
      this.editor.trigger('valuechanged');
      if (this.editor.editable.util.support.onselectionchange) {
        return this.editor.trigger('selectionchanged');
      }
    },

    mark : function(range) {
      var $contents, $mark;
      if (range == null) {
        range = this.editor.editable.selection.range();
      }
      $contents = $(range.extractContents());
      $contents.find('mark').each(function(index, ele) {
        return $(ele).replaceWith($(ele).html());
      });
      $mark = $('<mark>').append($contents);
      return range.insertNode($mark[0]);
    },

    unmark : function(range) {
      var $mark;
      if (range == null) {
        range = this.editor.editable.selection.range();
      }
      if (range.collapsed) {
        $mark = $(range.commonAncestorContainer);
        if (!$mark.is('mark')) {
          $mark = $mark.parent();
        }
      } else if ($(range.startContainer).closest('mark').length) {
        $mark = $(range.startContainer).closest('mark');
      } else if ($(range.endContainer).closest('mark').length) {
        $mark = $(range.endContainer).closest('mark');
      }
      return $mark.replaceWith($mark.html());
    }

  });

  
  addons.actions.mark = MarkAction;

  return MarkAction;

 }); 
define('skylark-widgets-wordpad/addons/actions/OrderListAction',[
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
  var OrderListAction = ListAction.inherit({
    type : 'ol',

    name : 'ol',

    icon : 'list-ol',

    htmlTag : 'ol',

    shortcut : 'cmd+/',

    _init : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + / )';
      } else {
        this.title = this.title + ' ( ctrl + / )';
        this.shortcut = 'ctrl+/';
      }
      return ListAction.prototype._init.call(this);
    }

   });

    return addons.actions.ol = OrderListAction;	
});
define('skylark-widgets-wordpad/addons/actions/OutdentAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  var OutdentAction = Action.inherit({
    name : 'outdent',

    icon : 'outdent',

    _init : function() {
      var hotkey;
      hotkey = this.editor.opts.tabIndent === false ? '' : ' (Shift + Tab)';
      this.title = this._t(this.name) + hotkey;
      return Action.prototype._init.call(this);
    },

    _status : function() {},

    _execute : function() {
      return this.editor.editable.outdent();
    }

   });


   addons.actions.outdent = OutdentAction; 
 
   return OutdentAction;

});
define('skylark-widgets-wordpad/addons/actions/StrikethroughAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){ 
  
  var StrikethroughAction = Action.inherit({
    name : 'strikethrough',

    icon : 'strikethrough',

    htmlTag : 'strike',

    disableTag : 'pre',

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('strikethrough');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.strikethrough();
    }

  });


  return addons.actions.strikethrough = StrikethroughAction;	
});
define('skylark-domx-tables/tables',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-query",
    "skylark-domx-styler",
    "skylark-domx-eventer",
    "skylark-domx-fx",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom"
], function(skylark, langx,$) {
  //TODO : don't use query

  function tables() {
      return tables;
  }

  function _changeCellTag($tr, tagName) {
    return $tr.find('td, th').each(function(i, cell) {
      var $cell;
      $cell = $(cell);
      return $cell.replaceWith("<" + tagName + ">" + ($cell.html()) + "</" + tagName + ">");
    });
  }

  function _nextRow($tr) {
    var $nextTr;
    $nextTr = $tr.next('tr');
    if ($nextTr.length < 1 && $tr.parent('thead').length > 0) {
      $nextTr = $tr.parent('thead').next('tbody').find('tr:first');
    }
    return $nextTr;
  };

  function _prevRow($tr) {
    var $prevTr;
    $prevTr = $tr.prev('tr');
    if ($prevTr.length < 1 && $tr.parent('tbody').length > 0) {
      $prevTr = $tr.parent('tbody').prev('thead').find('tr');
    }
    return $prevTr;
  }

  function createTable(row, col, phBr) {
    var $table, $tbody, $td, $thead, $tr, c, k, l, r, ref, ref1;
    $table = $('<table/>');
    $thead = $('<thead/>').appendTo($table);
    $tbody = $('<tbody/>').appendTo($table);
    for (r = k = 0, ref = row; 0 <= ref ? k < ref : k > ref; r = 0 <= ref ? ++k : --k) {
        $tr = $('<tr/>');
        $tr.appendTo(r === 0 ? $thead : $tbody);
        for (c = l = 0, ref1 = col; 0 <= ref1 ? l < ref1 : l > ref1; c = 0 <= ref1 ? ++l : --l) {
          $td = $(r === 0 ? '<th/>' : '<td/>').appendTo($tr);
          if (phBr) {
              $td.append(phBr);
          }
        }
    }   
    return $table[0];
  }
    

  //cls = simditor-table
  function decorate(table,cssClasses) {
    var $table = $(table);

    var $colgroup, $headRow, $resizeHandle, $tbody, $thead, $wrapper;
    if ($table.parent('.' + cssClasses.tableDecorate).length > 0) {
      undecorate(table);
    }
    $table.wrap('<div class="' + cssClasses.tableDecorate + '"></div>');
    $wrapper = $table.parent('.' + cssClasses.tableDecorate );
    $colgroup = $table.find('colgroup');
    if ($table.find('thead').length < 1) {
      $thead = $('<thead />');
      $headRow = $table.find('tr').first();
      $thead.append($headRow);
      _changeCellTag($headRow, 'th');
      $tbody = $table.find('tbody');
      if ($tbody.length > 0) {
        $tbody.before($thead);
      } else {
        $table.prepend($thead);
      }
    }
    if ($colgroup.length < 1) {
      $colgroup = $('<colgroup/>').prependTo($table);
      $table.find('thead tr th').each(function(i, td) {
        var $col;
        return $col = $('<col/>').appendTo($colgroup);
      });
      refreshTableWidth($table);
    }
    $resizeHandle = $('<div />', {
      "class": cssClasses.resizeHandle, // 'simditor-resize-handle',
      contenteditable: 'false'
    }).appendTo($wrapper);
    return $table.parent();
  }

  function deleteTable(td,callback) {
    var $td = $(td);

    var $block, $table;
    $table = $td.closest('.simditor-table');
    $block = $table.next('p');
    $table.remove();
    if (callback) {
      callback($block);
    }
  }

  function deleteRow(td,callback) {
    var $td = $(td);

    var $newTr, $tr, index;
    $tr = $td.parent('tr');
    if ($tr.closest('table').find('tr').length < 1) {
      return deleteTable(td);
    } else {
      $newTr = _nextRow($tr);
      if (!($newTr.length > 0)) {
        $newTr = _prevRow($tr);
      }
      index = $tr.find('td, th').index($td);
      if ($tr.parent().is('thead')) {
        $newTr.appendTo($tr.parent());
        _changeCellTag($newTr, 'th');
      }
      $tr.remove();
    
      if (callback) {
        callback($newTr[0],index);
      }
      //return this.editor.selection.setRangeAtEndOf($newTr.find('td, th').eq(index));
    }
  }

  function insertRow(td, direction,phBr,callback) {
    var $td = $(td);

    var $newTr, $table, $tr, cellTag, colNum, i, index, k, ref;
    if (direction == null) {
      direction = 'after';
    }
    $tr = $td.parent('tr');
    $table = $tr.closest('table');
    colNum = 0;
    $table.find('tr').each(function(i, tr) {
      return colNum = Math.max(colNum, $(tr).find('td').length);
    });
    index = $tr.find('td, th').index($td);
    $newTr = $('<tr/>');
    cellTag = 'td';
    if (direction === 'after' && $tr.parent().is('thead')) {
      $tr.parent().next('tbody').prepend($newTr);
    } else if (direction === 'before' && $tr.parent().is('thead')) {
      $tr.before($newTr);
      $tr.parent().next('tbody').prepend($tr);
      _changeCellTag($tr, 'td');
      cellTag = 'th';
    } else {
      $tr[direction]($newTr);
    }
    for (i = k = 1, ref = colNum; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
      $("<" + cellTag + "/>").append(phBr).appendTo($newTr);
    }

    if (callback) {
      callback($newTr[0],index);
    }
  }

  function deleteCol(td,callback) {
    var $td = $(td);

    var $newTd, $table, $tr, index, noOtherCol, noOtherRow;
    $tr = $td.parent('tr');
    noOtherRow = $tr.closest('table').find('tr').length < 2;
    noOtherCol = $td.siblings('td, th').length < 1;
    if (noOtherRow && noOtherCol) {
      return deleteTable(td);
    } else {
      index = $tr.find('td, th').index($td);
      $newTd = $td.next('td, th');
      if (!($newTd.length > 0)) {
        $newTd = $tr.prev('td, th');
      }
      $table = $tr.closest('table');
      $table.find('col').eq(index).remove();
      $table.find('tr').each(function(i, tr) {
        return $(tr).find('td, th').eq(index).remove();
      });
      refreshTableWidth($table);
      //return this.editor.selection.setRangeAtEndOf($newTd);
      if (callback) {
        callback($newTd[0]);
      }
    }
  }

  function insertCol(td, direction,phBr,callback) {
    var $td = $(td);

    var $col, $newCol, $newTd, $table, $tr, index, tableWidth, width;
    if (direction == null) {
      direction = 'after';
    }
    $tr = $td.parent('tr');
    index = $tr.find('td, th').index($td);
    $table = $td.closest('table');
    $col = $table.find('col').eq(index);
    $table.find('tr').each((function(_this) {
      return function(i, tr) {
        var $newTd, cellTag;
        cellTag = $(tr).parent().is('thead') ? 'th' : 'td';
        $newTd = $("<" + cellTag + "/>").append(phBr);
        return $(tr).find('td, th').eq(index)[direction]($newTd);
      };
    })(this));
    $newCol = $('<col/>');
    $col[direction]($newCol);
    tableWidth = $table.width();
    width = Math.max(parseFloat($col.attr('width')) / 2, 50 / tableWidth * 100);
    $col.attr('width', width + '%');
    $newCol.attr('width', width + '%');
    refreshTableWidth($table);
    $newTd = direction === 'after' ? $td.next('td, th') : $td.prev('td, th');
    //return this.editor.selection.setRangeAtStartOf($newTd);
    if (callback) {
      callback($newTd[0]);
    }
  }


  function refreshTableWidth($table) {
    return setTimeout((function(_this) {
      return function() {
        var cols, tableWidth;
        tableWidth = $table.width();
        cols = $table.find('col');
        return $table.find('thead tr th').each(function(i, td) {
          var $col;
          $col = cols.eq(i);
          return $col.attr('width', ($(td).outerWidth() / tableWidth * 100) + '%');
        });
      };
    })(this), 0);
  }


  function resizable(container,options) {
    var cssClasses = options.cssClasses,
        clsResizeHandle = cssClasses.resizeHandle, // simditor-resize-handle
        clsWrapper = cssClasses.wrapper, // .simditor-table
        selectorWrapper = "." + clsWrapper,
        selectorResizeHandle = "." + clsResizeHandle;

    $(container).on('mousemove.table', selectorWrapper +' td, ' + selectorWrapper +' th', function(e) {
      var $col, $colgroup, $resizeHandle, $td, $wrapper, index, ref, ref1, x;
      $wrapper = $(this).parents(selectorWrapper);
      $resizeHandle = $wrapper.find(selectorResizeHandle);
      $colgroup = $wrapper.find('colgroup');
      if ($wrapper.hasClass('resizing')) {
        return;
      }
      $td = $(e.currentTarget);
      x = e.pageX - $(e.currentTarget).offset().left;
      if (x < 5 && $td.prev().length > 0) {
        $td = $td.prev();
      }
      if ($td.next('td, th').length < 1) {
        $resizeHandle.hide();
        return;
      }
      if ((ref = $resizeHandle.data('td')) != null ? ref.is($td) : void 0) {
        $resizeHandle.show();
        return;
      }
      index = $td.parent().find('td, th').index($td);
      $col = $colgroup.find('col').eq(index);
      if ((ref1 = $resizeHandle.data('col')) != null ? ref1.is($col) : void 0) {
        $resizeHandle.show();
        return;
      }
      return $resizeHandle.css('left', $td.position().left + $td.outerWidth() - 5).data('td', $td).data('col', $col).show();
    });

    $(container).on('mouseleave'+ selectorWrapper, selectorWrapper, function(e) {
      return $(this).find(selectorResizeHandle).hide();
    });
    return $(container).on('mousedown'+ selectorResizeHandle, selectorResizeHandle, function(e) {
      var $handle, $leftCol, $leftTd, $rightCol, $rightTd, $wrapper, minWidth, startHandleLeft, startLeftWidth, startRightWidth, startX, tableWidth;
      $wrapper = $(this).parent(selectorWrapper);
      $handle = $(e.currentTarget);
      $leftTd = $handle.data('td');
      $leftCol = $handle.data('col');
      $rightTd = $leftTd.next('td, th');
      $rightCol = $leftCol.next('col');
      startX = e.pageX;
      startLeftWidth = $leftTd.outerWidth() * 1;
      startRightWidth = $rightTd.outerWidth() * 1;
      startHandleLeft = parseFloat($handle.css('left'));
      tableWidth = $leftTd.closest(selectorWrapper).width();
      minWidth = 50;
      $(container).on('mousemove.resize-table', function(e) {
        var deltaX, leftWidth, rightWidth;
        deltaX = e.pageX - startX;
        leftWidth = startLeftWidth + deltaX;
        rightWidth = startRightWidth - deltaX;
        if (leftWidth < minWidth) {
          leftWidth = minWidth;
          deltaX = minWidth - startLeftWidth;
          rightWidth = startRightWidth - deltaX;
        } else if (rightWidth < minWidth) {
          rightWidth = minWidth;
          deltaX = startRightWidth - minWidth;
          leftWidth = startLeftWidth + deltaX;
        }
        $leftCol.attr('width', (leftWidth / tableWidth * 100) + '%');
        $rightCol.attr('width', (rightWidth / tableWidth * 100) + '%');
        return $handle.css('left', startHandleLeft + deltaX);
      });
      $(container).one('mouseup.resize-table', function(e) {
        //$editor.sync();
        $(container).off('.resize-table');
        return $wrapper.removeClass('resizing');
      });
      $wrapper.addClass('resizing');
      return false;
    });
  };

  function undecorate(table) {
    var $table = $(table);
    if (!($table.parent('.simditor-table').length > 0)) {
      return;
    }
    return $table.parent().replaceWith($table)[0];
  };



  langx.mixin(tables,{
    "createTable" : createTable,
    "decorate" : decorate,
    "deleteCol" : deleteCol,
    "deleteRow" : deleteRow,
    "deleteTable" : deleteTable,
    "insertCol" : insertCol,
    "insertRow" : insertRow,
    "refreshTableWidth" : refreshTableWidth,
    "resizable" : resizable,
    "undecorate" : undecorate
  })


  return skylark.attach("domx.tables", tables);
});
define('skylark-domx-tables/main',[
	"./tables"
],function(tables){
	return tables;
});
define('skylark-domx-tables', ['skylark-domx-tables/main'], function (main) { return main; });

define('skylark-widgets-wordpad/addons/actions/TableAction',[
  "skylark-langx/langx",
  "skylark-domx-tables",
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function(langx,tables,$,addons,Action){ 
  var TableAction = Action.inherit({
    name : 'table',

    icon : 'table',

    htmlTag : 'table',

    disableTag : 'pre, li, blockquote',

    menu : true,

    _init : function() {
      Action.prototype._init.call(this);
      langx.merge(this.editor.editable.formatter._allowedTags, ['thead', 'th', 'tbody', 'tr', 'td', 'colgroup', 'col']);
      langx.extend(this.editor.editable.formatter._allowedAttributes, {
        td: ['rowspan', 'colspan'],
        col: ['width']
      });
      langx.extend(this.editor.editable.formatter._allowedStyles, {
        td: ['text-align'],
        th: ['text-align']
      });
      this._initShortcuts();
      this._initResize();
      this.editor.on('decorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.decorate($(table));
          });
        };
      })(this));
      this.editor.on('undecorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.undecorate($(table));
          });
        };
      })(this));
      this.editor.on('selectionchanged.table', (function(_this) {
        return function(e) {
          var $container, range;
          _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
          range = _this.editor.editable.selection.range();
          if (!range) {
            return;
          }
          $container = _this.editor.editable.selection.containerNode();
          if (range.collapsed && $container.is('.wordpad-table')) {
            _this.editor.editable.selection.setRangeAtEndOf($container);
          }
          return $container.closest('td, th', _this.editor.body).addClass('active');
        };
      })(this));
      this.editor.on('blur.table', (function(_this) {
        return function(e) {
          return _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('down', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
      return this.editor.editable.keystroke.add('down', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
    },

    _tdNav : function($td, direction) {
      var $anotherTr, $tr, action, anotherTag, index, parentTag, ref;
      if (direction == null) {
        direction = 'up';
      }
      action = direction === 'up' ? 'prev' : 'next';
      ref = direction === 'up' ? ['tbody', 'thead'] : ['thead', 'tbody'], parentTag = ref[0], anotherTag = ref[1];
      $tr = $td.parent('tr');
      $anotherTr = this["_" + action + "Row"]($tr);
      if (!($anotherTr.length > 0)) {
        return true;
      }
      index = $tr.find('td, th').index($td);
      return this.editor.editable.selection.setRangeAtEndOf($anotherTr.find('td, th').eq(index));
    },

    _initResize : function() {

      tables.resizable(document,{
        cssClasses : {
          resizeHandle : "wordpad-resize-handle",
          wrapper : "wordpad-table"
        }
      });

    },

    _initShortcuts : function() {
      this.editor.editable.hotkeys.add('ctrl+alt+up', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+down', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+left', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
          return false;
        };
      })(this));
      return this.editor.editable.hotkeys.add('ctrl+alt+right', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
          return false;
        };
      })(this));
    },

    renderMenu : function() {
      var $table;
      $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (this._t('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (this._t('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (this._t('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
      this.createMenu = this.menuWrapper.find('.menu-create-table');
      this.editMenu = this.menuWrapper.find('.menu-edit-table');
      $table = this.createTable(6, 6).appendTo(this.createMenu);
      this.createMenu.on('mouseenter', 'td, th', (function(_this) {
        return function(e) {
          var $td, $tr, $trs, num;
          _this.createMenu.find('td, th').removeClass('selected');
          $td = $(e.currentTarget);
          $tr = $td.parent();
          num = $tr.find('td, th').index($td) + 1;
          $trs = $tr.prevAll('tr').addBack();
          if ($tr.parent().is('tbody')) {
            $trs = $trs.add($table.find('thead tr'));
          }
          return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
        };
      })(this));
      this.createMenu.on('mouseleave', function(e) {
        return $(e.currentTarget).find('td, th').removeClass('selected');
      });
      return this.createMenu.on('mousedown', 'td, th', (function(_this) {
        return function(e) {
          var $closestBlock, $td, $tr, colNum, rowNum;
          _this.wrapper.removeClass('menu-on');
          if (!_this.editor.editable.inputManager.focused) {
            return;
          }
          $td = $(e.currentTarget);
          $tr = $td.parent();
          colNum = $tr.find('td').index($td) + 1;
          rowNum = $tr.prevAll('tr').length + 1;
          if ($tr.parent().is('tbody')) {
            rowNum += 1;
          }
          $table = _this.createTable(rowNum, colNum, true);
          $closestBlock = _this.editor.editable.selection.blockNodes().last();
          if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
            $closestBlock.replaceWith($table);
          } else {
            $closestBlock.after($table);
          }
          _this.decorate($table);
          _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
          _this.editor.trigger('valuechanged');
          return false;
        };
      })(this));
    },

    decorate : function($table) {
      return $(tables.decorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },

    undecorate : function($table) {
      return $(tables.undecorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },


    createTable : function(row, col, phBr) {
      return $(tables.createTable(row,col,phBr ? this.editor.editable.util.phBr : null));
    },

    refreshTableWidth : function($table) {
      return table.refreshTableWidth($table[0]);
    },

    deleteRow : function($td) {
      var self = this,
          ret; 

      tables.deleteRow($td[0],function(newTr,index){
        if (newTr) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTr).find('td, th').eq(index));
        }
      })

      return ret;
    },

    insertRow : function($td, direction) {
      var self = this,
          ret; 

      tables.insertRow($td[0],direction,self.editor.editable.util.phBr,function(newTr,index){
        ret =  self.editor.editable.selection.setRangeAtStartOf($(newTr).find('td, th').eq(index));
      })

      return ret;

    },

    deleteCol : function($td) {
      var self = this,
          ret; 

      tables.deleteCol($td[0],function(newTd){
        if (newTd) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTd));
        }
      })

      return ret;
    },

    insertCol : function($td, direction) {
      var self = this,
          ret; 

      tables.insertCol($td[0],direction,self.editor.editable.util.phBr,function(newTd){
        ret = self.editor.editable.selection.setRangeAtStartOf($(newTd));
      })

      return ret;
    },

    deleteTable : function($td) {
      var self = this;
      tables.deleteTable($td[0],function($block){
        if ($block.length > 0) {
          return self.editor.editable.selection.setRangeAtStartOf($block);
        }
      });
    },

    _execute : function(param) {
      var $td;
      $td = this.editor.editable.selection.containerNode().closest('td, th');
      if (!($td.length > 0)) {
        return;
      }
      if (param === 'deleteRow') {
        this.deleteRow($td);
      } else if (param === 'insertRowAbove') {
        this.insertRow($td, 'before');
      } else if (param === 'insertRowBelow') {
        this.insertRow($td);
      } else if (param === 'deleteCol') {
        this.deleteCol($td);
      } else if (param === 'insertColLeft') {
        this.insertCol($td, 'before');
      } else if (param === 'insertColRight') {
        this.insertCol($td);
      } else if (param === 'deleteTable') {
        this.deleteTable($td);
      } else {
        return;
      }
      return this.editor.trigger('valuechanged');
    }

   });


  addons.actions.table = TableAction;

  return TableAction;

});
define('skylark-widgets-wordpad/addons/actions/TitleAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "../../i18n"
],function($,addons,Action,i18n){ 
  var TitleAction = Action.inherit({
    name : 'title',

    htmlTag : 'h1, h2, h3, h4, h5',

    disableTag : 'pre, table',

    _init : function() {
      this.menu = [
        {
          name: 'normal',
          text: i18n.translate('normalText'),
          param: 'p'
        }, '|', {
          name: 'h1',
          text: i18n.translate('title') + ' 1',
          param: 'h1'
        }, {
          name: 'h2',
          text: i18n.translate('title') + ' 2',
          param: 'h2'
        }, {
          name: 'h3',
          text: i18n.translate('title') + ' 3',
          param: 'h3'
        }, {
          name: 'h4',
          text: i18n.translate('title') + ' 4',
          param: 'h4'
        }, {
          name: 'h5',
          text: i18n.translate('title') + ' 5',
          param: 'h5'
        }
      ];
      return Action.prototype._init.call(this);
    },

    setActive : function(active, param) {
      if (active) {
        active = this.node[0].tagName.toLowerCase();
      }
      Action.prototype.setActive.call(this, active);
    },

    _execute : function(param) {
      return this.editor.editable.title(param,this.disableTag);
    }

  });

  addons.actions.title = TitleAction;

  return TitleAction;

});
define('skylark-widgets-wordpad/addons/actions/UnderlineAction',[
  "skylark-domx-query",
  "../../addons",
  "../../Action"
],function($,addons,Action){
  var UnderlineAction = Action.inherit({
    name : 'underline',

    icon : 'underline',

    htmlTag : 'u',

    disableTag : 'pre',

    shortcut : 'cmd+u',

    render : function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + u )';
      } else {
        this.title = this.title + ' ( Ctrl + u )';
        this.shortcut = 'ctrl+u';
      }
      return Action.prototype.render.call(this);
    },

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('underline');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.underline();
    }

   });


  addons.actions.underline = UnderlineAction;

  return UnderlineAction;

});
define('skylark-widgets-wordpad/addons/actions/UnorderListAction',[
  "skylark-domx-query",
  "../../addons",
  "./ListAction"
],function($,addons,ListAction){ 
   var UnorderListAction = ListAction.inherit({
      type : 'ul',

      name : 'ul',

      icon : 'list-ul',

      htmlTag : 'ul',

      shortcut : 'cmd+.',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + . )';
        } else {
          this.title = this.title + ' ( Ctrl + . )';
          this.shortcut = 'ctrl+.';
        }
        return ListAction.prototype._init.call(this);
      }

   });


    addons.actions.ul = UnorderListAction;

    return UnorderListAction;

});
define('skylark-widgets-wordpad/addons/toolbar/items/AlignmentButton',[
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function($,ToolButton,i18n,addons){ 

 var AlignmentButton = ToolButton.inherit({
    _doActive : function(align) {

      ToolButton.prototype._doActive.call(this, !!align);

      this.el.removeClass('align-left align-center align-right');
      if (align) {
        this.el.addClass('align-' + align);
      }
      this.setIcon('align-' + align);
      return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();

    }

  });


  addons.toolbar.items.alignment = AlignmentButton;

  return AlignmentButton;

});
define('skylark-widgets-wordpad/addons/toolbar/items/ColorButton',[
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function($,ToolButton,i18n,addons){ 
  

   var ColorButton = ToolButton.inherit({
    render : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      return ToolButton.prototype.render.apply(this, args);
    },

    renderMenu : function() {
      $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default"></a></li>\n</ul>').appendTo(this.menuWrapper);
      this.menuWrapper.on('mousedown', '.color-list', function(e) {
        return false;
      });
      return this.menuWrapper.on('click', '.font-color', (function(_this) {
        return function(e) {
          var $link, $p, hex, range, rgb, textNode;
          _this.wrapper.removeClass('menu-on');
          $link = $(e.currentTarget);
          if ($link.hasClass('font-color-default')) {
            $p = _this.editor.body.find('p, li');
            if (!($p.length > 0)) {
              return;
            }
            rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
            hex = _this._convertRgbToHex(rgb);
          } else {
            rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
            hex = _this._convertRgbToHex(rgb);
          }
          if (!hex) {
            return;
          }

          return _this.editor.editable.fontColor(hex,$link.hasClass('font-color-default'),i18n.translate('coloredText'));
        };
      })(this));
    },

    _convertRgbToHex : function(rgb) {
      var match, re, rgbToHex;
      re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
      match = re.exec(rgb);
      if (!match) {
        return '';
      }
      rgbToHex = function(r, g, b) {
        var componentToHex;
        componentToHex = function(c) {
          var hex;
          hex = c.toString(16);
          if (hex.length === 1) {
            return '0' + hex;
          } else {
            return hex;
          }
        };
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      };
      return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
    }

   });

   
   addons.toolbar.items.color = ColorButton; 


   return ColorButton;
	
});
define('skylark-widgets-wordpad/addons/toolbar/items/EmojiButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function(langx, $,ToolButton,i18n,addons){ 

  var EmojiButton = ToolButton.inherit({

    renderMenu : function() {
      var $list, dir, html, name, opts, src, tpl, _i, _len, _ref;
      tpl = '<ul class="emoji-list">\n</ul>';
      opts = langx.extend({
        imagePath: 'images/emoji/',
        images: EmojiButton.images
      }, this.editor.opts.emoji || {});
      html = "";
      dir = opts.imagePath.replace(/\/$/, '') + '/';
      _ref = opts.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        src = "" + dir + name;
        name = name.split('.')[0];
        html += "<li data-name='" + name + "'><img src='" + src + "' width='20' height='20' alt='" + name + "' /></li>";
      }
      $list = $(tpl);
      $list.html(html).appendTo(this.menuWrapper);
      return $list.on('mousedown', 'li', (function(_this) {
        return function(e) {
          var $img;
          _this.wrapper.removeClass('menu-on');
          if (!_this.editor.editable.inputManager.focused) {
            return;
          }
          $img = $(e.currentTarget).find('img').clone().attr({
            'data-emoji': true,
            'data-non-image': true
          });
          _this.editor.editable.selection.insertNode($img);
          _this.editor.trigger('valuechanged');
          _this.editor.trigger('selectionchanged');
          return false;
        };
      })(this));
    }

  });


  EmojiButton.i18n = {
    'zh-CN': {
      emoji: '表情'
    },
    'en-US': {
      emoji: 'emoji'
    }
  };

  EmojiButton.images = ['smile.png', 'smiley.png', 'laughing.png', 'blush.png', 'heart_eyes.png', 'smirk.png', 'flushed.png', 'grin.png', 'wink.png', 'kissing_closed_eyes.png', 'stuck_out_tongue_winking_eye.png', 'stuck_out_tongue.png', 'sleeping.png', 'worried.png', 'expressionless.png', 'sweat_smile.png', 'cold_sweat.png', 'joy.png', 'sob.png', 'angry.png', 'mask.png', 'scream.png', 'sunglasses.png', 'heart.png', 'broken_heart.png', 'star.png', 'anger.png', 'exclamation.png', 'question.png', 'zzz.png', 'thumbsup.png', 'thumbsdown.png', 'ok_hand.png', 'punch.png', 'v.png', 'clap.png', 'muscle.png', 'pray.png', 'skull.png', 'trollface.png'];


  addons.toolbar.items.emoji = EmojiButton; 

  return EmojiButton;
	
});
define('skylark-widgets-wordpad/addons/toolbar/items/TableButton',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../i18n",
  "../../../addons"
],function(langx, $,ToolButton,i18n,addons){ 

  var TableButton = ToolButton.inherit({
    _doActive : function(active) {

      ToolButton.prototype._doActive.call(this, active);

      if (active) {
        this.createMenu.hide();
        return this.editMenu.show();
      } else {
        this.createMenu.show();
        return this.editMenu.hide();
      }

    }
   });


  TableButton.prototype.renderMenu = function() {
    var $table;
    $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (i18n.translate('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (i18n.translate('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (i18n.translate('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (i18n.translate('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (i18n.translate('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (i18n.translate('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (i18n.translate('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
    this.createMenu = this.menuWrapper.find('.menu-create-table');
    this.editMenu = this.menuWrapper.find('.menu-edit-table');
    $table = this.action.createTable(6, 6).appendTo(this.createMenu);
    this.createMenu.on('mouseenter', 'td, th', (function(_this) {
      return function(e) {
        var $td, $tr, $trs, num;
        _this.createMenu.find('td, th').removeClass('selected');
        $td = $(e.currentTarget);
        $tr = $td.parent();
        num = $tr.find('td, th').index($td) + 1;
        $trs = $tr.prevAll('tr').addBack();
        if ($tr.parent().is('tbody')) {
          $trs = $trs.add($table.find('thead tr'));
        }
        return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
      };
    })(this));
    this.createMenu.on('mouseleave', function(e) {
      return $(e.currentTarget).find('td, th').removeClass('selected');
    });
    return this.createMenu.on('mousedown', 'td, th', (function(_this) {
      return function(e) {
        var $closestBlock, $td, $tr, colNum, rowNum;
        _this.wrapper.removeClass('menu-on');
        if (!_this.editor.editable.inputManager.focused) {
          return;
        }
        $td = $(e.currentTarget);
        $tr = $td.parent();
        colNum = $tr.find('td').index($td) + 1;
        rowNum = $tr.prevAll('tr').length + 1;
        if ($tr.parent().is('tbody')) {
          rowNum += 1;
        }
        $table = _this.action.createTable(rowNum, colNum, true);
        $closestBlock = _this.editor.editable.selection.blockNodes().last();
        if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
          $closestBlock.replaceWith($table);
        } else {
          $closestBlock.after($table);
        }
        _this.action.decorate($table);
        _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
        _this.editor.trigger('valuechanged');
        return false;
      };
    })(this));
  };


  addons.toolbar.items.table = TableButton;

  return TableButton;


});
define('skylark-widgets-wordpad/addons/toolbar/items/TitleButton',[
  "skylark-domx-query",
  "../../../ToolButton",
  "../../../addons"
],function($,ToolButton,addons){ 
  var TitleButton = ToolButton.inherit({
      _doActive : function(value) {
        var active = !!value,
            param = value;
        ToolButton.prototype._doActive.call(this, active);

        if (active) {
          param || (param = this.node[0].tagName.toLowerCase());
        }
        this.el.removeClass('active-p active-h1 active-h2 active-h3 active-h4 active-h5');
        if (active) {
          return this.el.addClass('active active-' + param);
        }
      }
   });


  addons.toolbar.items.title = TitleButton;

  return TitleButton;

});
define('skylark-widgets-base/Addon',[
  "skylark-langx/langx",	
  "skylark-langx/Evented",
	"./base"
],function(langx,Evented,base){

	var Addon = Evented.inherit({

		_construct : function(widget,options) {
			this._widget = widget;
            Object.defineProperty(this,"options",{
              value :langx.mixin({},this.options,options,true)
            });
			if (this._init) {
				this._init();
			}
		}

	});

	Addon.register = function(Widget) {
		var categoryName = this.categoryName,
			addonName = this.addonName;

		if (categoryName && addonName) {
			Widget.addons = Widget.addons || {};
			Widget.addons[categoryName] = Widget.addons[categoryName] || {};
			Widget.addons[categoryName][addonName] = this;
		}
	};

	return base.Addon = Addon;

});
define('skylark-widgets-wordpad/addons/AutoSave',[
  "skylark-domx-query",
  "skylark-widgets-base/Addon",
  "../Toolbar",
  "../Wordpad",
  "../i18n"
],function($,Addon, Toolbar,Wordpad,i18n){ 


  var AutoSave = Addon.inherit({
    needFocus : false,

    _init : function() {

	    var currentVal, link, name, val;
	    this.editor = this._module;
	    if (!this.opts.autosave) {
	      return;
	    }
	    this.name = typeof this.opts.autosave === 'string' ? this.opts.autosave : 'simditor';
	    if (this.opts.autosavePath) {
	      this.path = this.opts.autosavePath;
	    } else {
	      link = $("<a/>", {
	        href: location.href
	      });
	      name = this.editor.textarea.data('autosave') || this.name;
	      this.path = "/" + (link[0].pathname.replace(/\/$/g, "").replace(/^\//g, "")) + "/autosave/" + name + "/";
	    }
	    if (!this.path) {
	      return;
	    }
	    this.editor.on("valuechanged", (function(_this) {
	      return function() {
	        return _this.storage.set(_this.path, _this.editor.getValue());
	      };
	    })(this));
	    this.editor.el.closest('form').on('ajax:success.simditor-' + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.storage.remove(_this.path);
	      };
	    })(this));
	    val = this.storage.get(this.path);
	    if (!val) {
	      return;
	    }
	    currentVal = this.editor.textarea.val();
	    if (val === currentVal) {
	      return;
	    }
	    if (this.editor.textarea.is('[data-autosave-confirm]')) {
	      if (confirm(this.editor.textarea.data('autosave-confirm') || 'Are you sure to restore unsaved changes?')) {
	        return this.editor.setValue(val);
	      } else {
	        return this.storage.remove(this.path);
	      }
	    } else {
	      return this.editor.setValue(val);
	    }

    }

  });


  AutoSave.categoryName = "general";
  AutoSave.addonName = 'autosave';

  AutoSave.prototype.opts = {
    autosave: true,
    autosavePath: null
  };


  AutoSave.prototype.storage = {
    supported: function() {
      var error;
      try {
        localStorage.setItem('_storageSupported', 'yes');
        localStorage.removeItem('_storageSupported');
        return true;
      } catch (_error) {
        error = _error;
        return false;
      }
    },
    set: function(key, val, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.setItem(key, val);
    },
    get: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage[key];
    },
    remove: function(key, session) {
      var storage;
      if (session == null) {
        session = false;
      }
      if (!this.supported()) {
        return;
      }
      storage = session ? sessionStorage : localStorage;
      return storage.removeItem(key);
    }
  };

  return Wordpad.addons.general.autoSave = AutoSave;

});
define('skylark-widgets-wordpad/addons/Dropzone',[
  "skylark-domx-query",
  "skylark-widgets-base/Addon",
  "../Toolbar",
  "../Wordpad",
  "../i18n"
],function($,Addon, Toolbar,Wordpad,i18n){ 


  var Dropzone = Addon.inherit({
  });

  Dropzone.categoryName = "genernal";

  Dropzone.addonName = "dropzone";


  Dropzone.prototype._entered = 0;

  Dropzone.prototype._init = function() {
    this.editor = this._widget;
    if (this.editor.uploader == null) {
      //throw new Error("Can't work without 'simple-uploader' module");
      return;
    }
    $(document.body).on("dragover", function(e) {
      e.originalEvent.dataTransfer.dropEffect = "none";
      return e.preventDefault();
    });
    $(document.body).on('drop', function(e) {
      return e.preventDefault();
    });
    this.imageBtn = this.editor.toolbar.findButton("image");
    return this.editor.body.on("dragover", function(e) {
      e.originalEvent.dataTransfer.dropEffect = "copy";
      e.stopPropagation();
      return e.preventDefault();
    }).on("dragenter", (function(_this) {
      return function(e) {
        if ((_this._entered += 1) === 1) {
          _this.show();
        }
        e.preventDefault();
        return e.stopPropagation();
      };
    })(this)).on("dragleave", (function(_this) {
      return function(e) {
        if ((_this._entered -= 1) <= 0) {
          _this.hide();
        }
        e.preventDefault();
        return e.stopPropagation();
      };
    })(this)).on("drop", (function(_this) {
      return function(e) {
        var file, imageFiles, _i, _j, _len, _len1, _ref;
        imageFiles = [];
        _ref = e.originalEvent.dataTransfer.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (!_this.validFile(file)) {
            alert("「" + file.name + "]」文件不是图片。");
            _this.hide();
            return false;
          }
          imageFiles.push(file);
        }
        for (_j = 0, _len1 = imageFiles.length; _j < _len1; _j++) {
          file = imageFiles[_j];
          _this.editor.uploader.upload(file, {
            inline: true
          });
        }
        _this.hide();
        e.stopPropagation();
        return e.preventDefault();
      };
    })(this));
  };

  Dropzone.prototype.show = function() {
    return this.imageBtn.setActive(true);
  };

  Dropzone.prototype.hide = function() {
    this.imageBtn.setActive(false);
    return this._entered = 0;
  };

  Dropzone.prototype.validFile = function(file) {
    return file.type.indexOf("image/") > -1;
  };

  return Wordpad.addons.general.dropzone = Dropzone;


});
define('skylark-widgets-wordpad/main',[
  "./Wordpad", 
  "./Action",
  "./Popover",
  "./Toolbar",
  "./ToolButton", 

  "./addons/actions/AlignmentAction", 
  "./addons/actions/BlockquoteAction", 
  "./addons/actions/BoldAction", 
  "./addons/actions/CodeAction", 
  "./addons/actions/CodePopover", 
  "./addons/actions/ColorAction", 
  "./addons/actions/EmojiAction", 
  "./addons/actions/FontScaleAction", 
  "./addons/actions/FullScreenAction", 
  "./addons/actions/HrAction", 
  "./addons/actions/HtmlAction", 
  "./addons/actions/ImageAction", 
  "./addons/actions/ImagePopover", 
  "./addons/actions/IndentAction", 
  "./addons/actions/ItalicAction", 
  "./addons/actions/LinkAction", 
  "./addons/actions/LinkPopover", 
  "./addons/actions/ListAction", 
  "./addons/actions/MarkAction", 
  "./addons/actions/OrderListAction", 
  "./addons/actions/OutdentAction",
  "./addons/actions/StrikethroughAction", 
  "./addons/actions/TableAction", 
  "./addons/actions/TitleAction", 
  "./addons/actions/UnderlineAction", 
  "./addons/actions/UnorderListAction",

  "./addons/toolbar/items/AlignmentButton",
  "./addons/toolbar/items/ColorButton",
  "./addons/toolbar/items/EmojiButton",
  "./addons/toolbar/items/TableButton",
  "./addons/toolbar/items/TitleButton",

  "./addons/AutoSave",
  "./addons/Dropzone"
],function(Wordpad){
	
  return Wordpad;
});
define('skylark-widgets-wordpad', ['skylark-widgets-wordpad/main'], function (main) { return main; });


},this);