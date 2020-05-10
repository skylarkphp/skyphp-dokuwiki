/**
 * skylark-jqueryui-interact - A version of jqueryui interact that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jqueryui-interact/
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

        //template : template,

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
define('skylark-jqueryui-interact/ddmanager',[
	"skylark-langx/langx"
],function(langx) {
	/*
	 * This manager tracks offsets of draggables and droppables
	 */
	var ddmanager = {
		current: null,
		droppables: { "default": [] },
		prepareOffsets: function( t, event ) {

			var i, j,
				m = ddmanager.droppables[ t.options.scope ] || [],
				type = event ? event.type : null, // workaround for #2317
				list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

			droppablesLoop: for ( i = 0; i < m.length; i++ ) {

				// No disabled and non-accepted
				if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ],
						( t.currentItem || t.element ) ) ) ) {
					continue;
				}

				// Filter out elements in the current dragged item
				for ( j = 0; j < list.length; j++ ) {
					if ( list[ j ] === m[ i ].element[ 0 ] ) {
						m[ i ].proportions().height = 0;
						continue droppablesLoop;
					}
				}

				m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
				if ( !m[ i ].visible ) {
					continue;
				}

				// Activate the droppable if used directly from draggables
				if ( type === "mousedown" ) {
					m[ i ]._activate.call( m[ i ], event );
				}

				m[ i ].offset = m[ i ].element.offset();
				m[ i ].proportions( {
					width: m[ i ].element[ 0 ].offsetWidth,
					height: m[ i ].element[ 0 ].offsetHeight
				} );

			}

		},
		drop: function( draggable, event ) {

			var dropped = false;

			// Create a copy of the droppables in case the list changes during the drop (#9116)
			langx.each( ( ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

				if ( !this.options ) {
					return;
				}
				if ( !this.options.disabled && this.visible &&
						ddmanager.intersect( draggable, this, this.options.tolerance, event ) ) {
					dropped = this._drop.call( this, event ) || dropped;
				}

				if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ],
						( draggable.currentItem || draggable.element ) ) ) {
					this.isout = true;
					this.isover = false;
					this._deactivate.call( this, event );
				}

			} );
			return dropped;

		},
		dragStart: function( draggable, event ) {

			// Listen for scrolling so that if the dragging causes scrolling the position of the
			// droppables can be recalculated (see #5003)
			draggable.element.parentsUntil( "body" ).on( "scroll.droppable", function() {
				if ( !draggable.options.refreshPositions ) {
					ddmanager.prepareOffsets( draggable, event );
				}
			} );
		},
		drag: function( draggable, event ) {

			// If you have a highly dynamic page, you might try this option. It renders positions
			// every time you move the mouse.
			if ( draggable.options.refreshPositions ) {
				ddmanager.prepareOffsets( draggable, event );
			}

			// Run through all droppables and check their positions based on specific tolerance options
			langx.each( ddmanager.droppables[ draggable.options.scope ] || [], function() {

				if ( this.options.disabled || this.greedyChild || !this.visible ) {
					return;
				}

				var parentInstance, scope, parent,
					intersects = ddmanager.intersect( draggable, this, this.options.tolerance, event ),
					c = !intersects && this.isover ?
						"isout" :
						( intersects && !this.isover ? "isover" : null );
				if ( !c ) {
					return;
				}

				if ( this.options.greedy ) {

					// find droppable parents with same scope
					scope = this.options.scope;
					parent = this.element.parents( ":data(ui-droppable)" ).filter( function() {
						return $( this ).droppable( "instance" ).options.scope === scope;
					} );

					if ( parent.length ) {
						parentInstance = $( parent[ 0 ] ).droppable( "instance" );
						parentInstance.greedyChild = ( c === "isover" );
					}
				}

				// We just moved into a greedy child
				if ( parentInstance && c === "isover" ) {
					parentInstance.isover = false;
					parentInstance.isout = true;
					parentInstance._out.call( parentInstance, event );
				}

				this[ c ] = true;
				this[ c === "isout" ? "isover" : "isout" ] = false;
				this[ c === "isover" ? "_over" : "_out" ].call( this, event );

				// We just moved out of a greedy child
				if ( parentInstance && c === "isout" ) {
					parentInstance.isout = false;
					parentInstance.isover = true;
					parentInstance._over.call( parentInstance, event );
				}
			} );

		},
		dragStop: function( draggable, event ) {
			draggable.element.parentsUntil( "body" ).off( "scroll.droppable" );

			// Call prepareOffsets one final time since IE does not fire return scroll events when
			// overflow was caused by drag (see #5003)
			if ( !draggable.options.refreshPositions ) {
				ddmanager.prepareOffsets( draggable, event );
			}
		}
	};

	ddmanager.intersect = ( function() {
		function isOverAxis( x, reference, size ) {
			return ( x >= reference ) && ( x < ( reference + size ) );
		}

		return function( draggable, droppable, toleranceMode, event ) {

			if ( !droppable.offset ) {
				return false;
			}

			var x1 = ( draggable.positionAbs ||
					draggable.position.absolute ).left + draggable.margins.left,
				y1 = ( draggable.positionAbs ||
					draggable.position.absolute ).top + draggable.margins.top,
				x2 = x1 + draggable.helperProportions.width,
				y2 = y1 + draggable.helperProportions.height,
				l = droppable.offset.left,
				t = droppable.offset.top,
				r = l + droppable.proportions().width,
				b = t + droppable.proportions().height;

			switch ( toleranceMode ) {
			case "fit":
				return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
			case "intersect":
				return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
					x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
					t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
					y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
			case "pointer":
				return isOverAxis( event.pageY, t, droppable.proportions().height ) &&
					isOverAxis( event.pageX, l, droppable.proportions().width );
			case "touch":
				return (
					( y1 >= t && y1 <= b ) || // Top edge touching
					( y2 >= t && y2 <= b ) || // Bottom edge touching
					( y1 < t && y2 > b ) // Surrounded vertically
				) && (
					( x1 >= l && x1 <= r ) || // Left edge touching
					( x2 >= l && x2 <= r ) || // Right edge touching
					( x1 < l && x2 > r ) // Surrounded horizontally
				);
			default:
				return false;
			}
		};
	} )();


	return ddmanager;
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
        var node;

        if (/svg/i.test(tag)) {
            node = document.createElementNS("http://www.w3.org/2000/svg", tag)
        } else {
            node = document.createElement(tag);
        }

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

function removeSelfClosingTags(xml) {
    var split = xml.split("/>");
    var newXml = "";
    for (var i = 0; i < split.length - 1;i++) {
        var edsplit = split[i].split("<");
        newXml += split[i] + "></" + edsplit[edsplit.length - 1].split(" ")[0] + ">";
    }
    return newXml + split[split.length-1];
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
        container.innerHTML = removeSelfClosingTags("" + html);
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
        },
        'empty': function(elm) {
            return !elm.hasChildNodes();
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
            if (!selector || matches(node, selector)) {
              ret.push(node); 
            }
        }

        //if (selector) {
        //    ret = local.filter(ret, selector);
        //}
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
                return elm.getAttribute ? elm.getAttribute(name) : elm[name];
            }
        } else {
            elm.setAttribute ? elm.setAttribute(name, value) : elm[name] = value;
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
                if (elem.querySelector) {
                    return func.apply(context, last ? [elem] : [elem, selector]);
                } else {
                    return [];
                }
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
                //} else {
                //    return [];
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
                func.apply(context, [elem, newArg1].concat(params.slice(1)));
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
            var self = this;

            if (langx.isPlainObject(name) || langx.isDefined(value)) {
                forEach.call(self, function(elem, idx) {
                    var newValue;
                    if (oldValueFunc) {
                        newValue = funcArg(elem, value, idx, oldValueFunc(elem, name));
                    } else {
                        newValue = value
                    }
                    func.apply(context, [elem,name,newValue]);
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
                return rootQuery;
            } else if (isQ(selector)) {
                return selector;
            } else {
                if (context && isQ(context) && isString(selector)) {
                    return context.find(selector);
                }
                return init(selector, context);
            }
        },rootQuery = $(document);

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

            wrap: function(html) {
                /*
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
                */
                var htmlIsFunction = typeof html === "function";

                return this.each( function( i ) {
                    $( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
                } );                
            },

            wrapAll: function(html) {
                /*
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
                */
                var wrap;

                if ( this[ 0 ] ) {
                    if ( typeof html === "function" ) {
                        html = html.call( this[ 0 ] );
                    }

                    // The elements to wrap the target around
                    wrap = $( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

                    if ( this[ 0 ].parentNode ) {
                        wrap.insertBefore( this[ 0 ] );
                    }

                    wrap.map( function() {
                        var elem = this;

                        while ( elem.firstElementChild ) {
                            elem = elem.firstElementChild;
                        }

                        return elem;
                    } ).append( this );
                }

                return this;

            },

            wrapInner: function(html) {
                /*
                var func = isFunction(wrappingElement)
                return this.each(function(index,node) {
                    var self = $(this),
                        contents = self.contents(),
                        dom = func ? wrappingElement.call(this, index,node) : wrappingElement
                    contents.length ? contents.wrapAll(dom) : self.append(dom)
                })
                */
                if ( typeof html === "function" ) {
                    return this.each( function( i ) {
                        $( this ).wrapInner( html.call( this, i ) );
                    } );
                }

                return this.each( function() {
                    var self = $( this ),
                        contents = self.contents();

                    if ( contents.length ) {
                        contents.wrapAll( html );

                    } else {
                        self.append( html );
                    }
                } );

            },

            unwrap: function(selector) {
                /*
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
                */
                this.parent(selector).not("body").each( function() {
                    $(this).replaceWith(this.childNodes);
                });
                return this;

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

    $.fn.data = $.wraps.wrapper_name_value(data.data, data);

    $.fn.removeData = $.wraps.wrapper_every_act(data.removeData);

    $.fn.val = $.wraps.wrapper_value(data.val, data, data.val);


    return data;
});
define('skylark-domx-data', ['skylark-domx-data/main'], function (main) { return main; });

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


    var NativeEventCtors = [
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

    //create a custom dom event
    var createEvent = (function() {

        function getEventCtor(type) {
            var idx = NativeEvents[type];
            if (!idx) {
                idx = 0;
            }
            return NativeEventCtors[idx];
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
        NativeEvents : NativeEvents,
        
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

    each(NativeEvents,function(name){
        eventer[name] = function(elm,selector,data,callback) {
            if (arguments.length>1) {
                return this.on(elm,name,selector,data,callback);
            } else {
                if (name == "focus") {
                    if (elm.focus) {
                        elm.focus();
                    }
                } else if (name == "blur") {
                    if (elm.blur) {
                        elm.blur();
                    }
                } else if (name == "click") {
                    if (elm.click) {
                        elm.click();
                    }
                } else {
                    this.trigger(elm,name);
                }

                return this;
            }
        };
    });

    return skylark.attach("domx.eventer",eventer);
});
define('skylark-domx-eventer/main',[
    "skylark-langx/langx",
    "./eventer",
    "skylark-domx-velm",
    "skylark-domx-query"        
],function(langx,eventer,velm,$){

    var delegateMethodNames = [
        "off",
        "on",
        "one",
        "trigger"
    ];

    langx.each(eventer.NativeEvents,function(name){
        delegateMethodNames.push(name);
    });

    // from ./eventer
    velm.delegate(delegateMethodNames, eventer);

    langx.each(delegateMethodNames,function(i,name){
        $.fn[name] = $.wraps.wrapper_every_act(eventer[name],eventer);
    });


    /*
    $.fn.on = $.wraps.wrapper_every_act(eventer.on, eventer);

    $.fn.off = $.wraps.wrapper_every_act(eventer.off, eventer);

    $.fn.trigger = $.wraps.wrapper_every_act(eventer.trigger, eventer);

    ('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error transitionEnd').split(' ').forEach(function(event) {
        $.fn[event] = $.wraps.wrapper_every_act(eventer[event],eventer);
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
    */

    $.ready = eventer.ready;

    return eventer;
});
define('skylark-domx-eventer', ['skylark-domx-eventer/main'], function (main) { return main; });

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
                if (typeof options != "string") {
                  return this;
                }
            } 
            if (options) {
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

                        var ret = plugin[methodName].apply(plugin,args);
                        if (ret == plugin) {
                          ret = undefined;
                        }

                        return ret;
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
                    var  ret  = shortcut.apply(undefined,args2);
                    if (ret !== undefined) {
                        returnValue = ret;
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

define('skylark-jquery/JqueryPlugin',[
	"skylark-langx-types",
	"skylark-langx-objects",
	"skylark-langx-arrays",
	"skylark-langx/langx",
	"skylark-domx-data",
	"skylark-domx-eventer",
	"skylark-domx-plugins",
	"skylark-domx-query",
],function(types, objects, arrays, langx, datax, eventer, plugins, $){

    var pluginUuid = 0;

	var JqPlugin = plugins.Plugin.inherit({
		klassName : "JqPlugin",

        pluginEventPrefix: "",

        options: {
            // Callbacks
            create: null
        },

        destroy: function() {
            this.overrided();

            // We can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                .off( this.eventNamespace );

            // Clean up events and states
            this.bindings.off( this.eventNamespace );
        },

        _construct : function(element,options) {
            //this.options = langx.mixin( {}, this.options );

            element = $( element || this.defaultElement || this )[ 0 ];
            this.element = $( element );
            this.uuid = pluginUuid++;
            this.eventNamespace = "." + this.pluginName + this.uuid;

            this.bindings = $();
            this.classesElementLookup = {};

			this.hoverable = $();
			this.focusable = $();

            if ( element !== this ) {
                datax.data( element, this.pluginName, this );
                this._on( true, this.element, {
                    remove: function( event ) {
                        if ( event.target === element ) {
                            this.destroy();
                        }
                    }
                } );
                this.document = $( element.style ?

                    // Element within the document
                    element.ownerDocument :

                    // Element is window or document
                    element.document || element );
                this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
            }

            this.overrided(element,options);

//            this.options = langx.mixin( {},
//                this.options,
//                this._getCreateOptions(),
//                options );

            this._create();

            this._trigger( "create", null, this._getCreateEventData() );

            this._init();
        },


	     _initOptions : function(options) {
	     	options = langx.mixin(this._getCreateOptions(),options);

			this.overrided(options);
		},

        _getCreateOptions: function() {
            return {};
        },

        _getCreateEventData: langx.noop,

		_super : function() {
			if (this.overrided) {
				return this.overrided.apply(this,arguments);
			}
		},

		_superApply : function ( args ) {
			if (this.overrided) {
				return this.overrided.apply(this,args);
			}
		},

        _create: langx.noop,

        _init: langx.noop,

		_classes: function( options ) {
			var full = [];
			var that = this;

			options = objects.mixin( {
				element: this.element,
				classes: this.options.classes || {}
			}, options );


			function bindRemoveEvent() {
				options.element.each( function( _, element ) {
					var isTracked = langx.map( that.classesElementLookup, function( elements ) {
						return elements;
					} )
						.some( function(elements ) {
							return $(elements).is( element );
						} );

					if ( !isTracked ) {
						that._on( $( element ), {
							remove: "_untrackClassesElement"
						} );
					}
				} );
			}

			function processClassString( classes, checkOption ) {
				var current, i;
				for ( i = 0; i < classes.length; i++ ) {
					current = that.classesElementLookup[ classes[ i ] ] || $();
					if ( options.add ) {
						bindRemoveEvent();
						current = $( langx.uniq( current.get().concat( options.element.get() ) ) );
					} else {
						current = $( current.not( options.element ).get() );
					}
					that.classesElementLookup[ classes[ i ] ] = current;
					full.push( classes[ i ] );
					if ( checkOption && options.classes[ classes[ i ] ] ) {
						full.push( options.classes[ classes[ i ] ] );
					}
				}
			}

			if ( options.keys ) {
				processClassString( options.keys.match( /\S+/g ) || [], true );
			}
			if ( options.extra ) {
				processClassString( options.extra.match( /\S+/g ) || [] );
			}

			return full.join( " " );
		},

		_untrackClassesElement: function( event ) {
			var that = this;
			langx.each( that.classesElementLookup, function( key, value ) {
				if ( arrays.inArray( event.target, value ) !== -1 ) {
					that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
				}
			} );

			this._off( $( event.target ) );
		},

		_removeClass: function( element, keys, extra ) {
			return this._toggleClass( element, keys, extra, false );
		},

		_addClass: function( element, keys, extra ) {
			return this._toggleClass( element, keys, extra, true );
		},

		_toggleClass: function( element, keys, extra, add ) {
			add = ( typeof add === "boolean" ) ? add : extra;
			var shift = ( typeof element === "string" || element === null ),
				options = {
					extra: shift ? keys : extra,
					keys: shift ? element : keys,
					element: shift ? this.element : element,
					add: add
				};
			options.element.toggleClass( this._classes( options ), add );
			return this;
		},

		_on: function( suppressDisabledCheck, element, handlers ) {
			var delegateElement;
			var instance = this;

			// No suppressDisabledCheck flag, shuffle arguments
			if ( typeof suppressDisabledCheck !== "boolean" ) {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// No element argument, shuffle and use this.element
			if ( !handlers ) {
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else {
				element = delegateElement = $( element );
				this.bindings = this.bindings.add( element );
			}

			objects.each( handlers, function( event, handler ) {
				function handlerProxy() {

					// Allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if ( !suppressDisabledCheck &&
							( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
						return;
					}
					return ( typeof handler === "string" ? instance[ handler ] : handler )
						.apply( instance, arguments );
				}

				// Copy the guid so direct unbinding works
				if ( typeof handler !== "string" ) {
					handlerProxy.guid = handler.guid =
						handler.guid || handlerProxy.guid || $.guid++;
				}

				var match = event.match( /^([\w:-]*)\s*(.*)$/ );
				var eventName = match[ 1 ] + instance.eventNamespace;
				var selector = match[ 2 ];

				if ( selector ) {
					delegateElement.on( eventName, selector, handlerProxy );
				} else {
					element.on( eventName, handlerProxy );
				}
			} );
		},

		_off: function( element, eventName ) {
			eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
				this.eventNamespace;
			element.off( eventName );

			// Clear the stack to avoid memory leaks (#10056)
			this.bindings = $( this.bindings.not( element ).get() );
			this.focusable = $( this.focusable.not( element ).get() );
			this.hoverable = $( this.hoverable.not( element ).get() );
		},

		_trigger: function( type, event, data ) {
			var prop, orig;
			var callback = this.options[ type ];

			data = data || {};
			event = eventer.proxy( event );
			event.type = ( type === this.widgetEventPrefix ?
				type :
				this.widgetEventPrefix + type ).toLowerCase();

			// The original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[ 0 ];

			// Copy original event properties over to the new event
			orig = event.originalEvent;
			if ( orig ) {
				for ( prop in orig ) {
					if ( !( prop in event ) ) {
						event[ prop ] = orig[ prop ];
					}
				}
			}

			this.element.trigger( event, data );
			return !( types.isFunction( callback ) &&
				callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
				event.isDefaultPrevented() );
		},


	    enable: function() {
	      return this._setOptions( { disabled: false } );
	    },

	    disable: function() {
	      return this._setOptions( { disabled: true } );
	    }


	});

	return JqPlugin;
});
define( 'skylark-jqueryui-interact/Mouse',[
	"skylark-domx-browser",
	"skylark-domx-data",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"skylark-jquery/JqueryPlugin"
],function(browser, datax, $, plugins, JqPlugin) {

	var mouseHandled = false;
	$( document ).on( "mouseup", function() {
		mouseHandled = false;
	} );

	var MousePlugin = JqPlugin.inherit({
		klassName : "MousePlugin",

		pluginName : "ui.mouse",

		options: {
			cancel: "input, textarea, button, select, option",
			distance: 1,
			delay: 0
		},
		_mouseInit: function() {
			var that = this;

			this.element
				.on( "mousedown." + this.pluginName, function( event ) {
					return that._mouseDown( event );
				} )
				.on( "click." + this.pluginName, function( event ) {
					if ( true === datax.data( event.target, that.pluginName + ".preventClickEvent" ) ) {
						datax.removeData( event.target, that.pluginName + ".preventClickEvent" );
						event.stopImmediatePropagation();
						return false;
					}
				} );

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		_mouseDestroy: function() {
			this.element.off( "." + this.pluginName );
			if ( this._mouseMoveDelegate ) {
				this.document
					.off( "mousemove." + this.pluginName, this._mouseMoveDelegate )
					.off( "mouseup." + this.pluginName, this._mouseUpDelegate );
			}
		},

		_mouseDown: function( event ) {

			// don't let more than one widget handle mouseStart
			if ( mouseHandled ) {
				return;
			}

			this._mouseMoved = false;

			// We may have missed mouseup (out of window)
			( this._mouseStarted && this._mouseUp( event ) );

			this._mouseDownEvent = event;

			var that = this,
				btnIsLeft = ( event.which === 1 ),

				// event.target.nodeName works around a bug in IE 8 with
				// disabled inputs (#7620)
				elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
					$( event.target ).closest( this.options.cancel ).length : false );
			if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
				return true;
			}

			this.mouseDelayMet = !this.options.delay;
			if ( !this.mouseDelayMet ) {
				this._mouseDelayTimer = setTimeout( function() {
					that.mouseDelayMet = true;
				}, this.options.delay );
			}

			if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
				this._mouseStarted = ( this._mouseStart( event ) !== false );
				if ( !this._mouseStarted ) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if ( true === datax.data( event.target, this.pluginName + ".preventClickEvent" ) ) {
				datax.removeData( event.target, this.pluginName + ".preventClickEvent" );
			}

			// These delegates are required to keep context
			this._mouseMoveDelegate = function( event ) {
				return that._mouseMove( event );
			};
			this._mouseUpDelegate = function( event ) {
				return that._mouseUp( event );
			};

			this.document
				.on( "mousemove." + this.pluginName, this._mouseMoveDelegate )
				.on( "mouseup." + this.pluginName, this._mouseUpDelegate );

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		_mouseMove: function( event ) {

			// Only check for mouseups outside the document if you've moved inside the document
			// at least once. This prevents the firing of mouseup in the case of IE<9, which will
			// fire a mousemove event if content is placed under the cursor. See #7778
			// Support: IE <9
			if ( this._mouseMoved ) {

				// IE mouseup check - mouseup happened when mouse was out of window
				if ( browser.ie && ( !document.documentMode || document.documentMode < 9 ) &&
						!event.button ) {
					return this._mouseUp( event );

				// Iframe mouseup check - mouseup occurred in another document
				} else if ( !event.which ) {

					// Support: Safari <=8 - 9
					// Safari sets which to 0 if you press any of the following keys
					// during a drag (#14461)
					if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
							event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
						this.ignoreMissingWhich = true;
					} else if ( !this.ignoreMissingWhich ) {
						return this._mouseUp( event );
					}
				}
			}

			if ( event.which || event.button ) {
				this._mouseMoved = true;
			}

			if ( this._mouseStarted ) {
				this._mouseDrag( event );
				return event.preventDefault();
			}

			if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
				this._mouseStarted =
					( this._mouseStart( this._mouseDownEvent, event ) !== false );
				( this._mouseStarted ? this._mouseDrag( event ) : this._mouseUp( event ) );
			}

			return !this._mouseStarted;
		},

		_mouseUp: function( event ) {
			this.document
				.off( "mousemove." + this.pluginName, this._mouseMoveDelegate )
				.off( "mouseup." + this.pluginName, this._mouseUpDelegate );

			if ( this._mouseStarted ) {
				this._mouseStarted = false;

				if ( event.target === this._mouseDownEvent.target ) {
					datax.data( event.target, this.pluginName + ".preventClickEvent", true );
				}

				this._mouseStop( event );
			}

			if ( this._mouseDelayTimer ) {
				clearTimeout( this._mouseDelayTimer );
				delete this._mouseDelayTimer;
			}

			this.ignoreMissingWhich = false;
			mouseHandled = false;
			event.preventDefault();
		},

		_mouseDistanceMet: function( event ) {
			return ( Math.max(
					Math.abs( this._mouseDownEvent.pageX - event.pageX ),
					Math.abs( this._mouseDownEvent.pageY - event.pageY )
				) >= this.options.distance
			);
		},

		_mouseDelayMet: function( /* event */ ) {
			return this.mouseDelayMet;
		},

		// These are placeholder methods, to be overriden by extending plugin
		_mouseStart: function( /* event */ ) {},
		_mouseDrag: function( /* event */ ) {},
		_mouseStop: function( /* event */ ) {},
		_mouseCapture: function( /* event */ ) { return true; }
	});


	plugins.register(MousePlugin);

	return MousePlugin;
});

define('skylark-jqueryui-interact/patch',[
], function() {
	// patch($.ui.plugin) is deprecated. .
	return  {
		add: function( module, option, set ) {
			var i,
				proto = module.prototype;
			for ( i in set ) {
				proto.patches[ i ] = proto.patches[ i ] || [];
				proto.patches[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args, allowDisconnected ) {
			var i,
				set = instance.patches[ name ];

			if ( !set ) {
				return;
			}

			if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode ||
					instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	};

});

define( 'skylark-jqueryui-interact/Draggable',[
	"skylark-langx/langx",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"./Mouse",
	"./patch",
	"./ddmanager",
],function(langx, eventer, noder, $, plugins, Mouse, patch, ddmanager) {

	var Draggable = Mouse.inherit({
		klassName: "Draggable",

		pluginName : "ui.draggable",

		widgetEventPrefix: "drag",
		options: {
			addClasses: true,
			appendTo: "parent",
			axis: false,
			connectToSortable: false,
			containment: false,
			cursor: "auto",
			cursorAt: false,
			grid: false,
			handle: false,
			helper: "original",
			iframeFix: false,
			opacity: false,
			refreshPositions: false,
			revert: false,
			revertDuration: 500,
			scope: "default",
			scroll: true,
			scrollSensitivity: 20,
			scrollSpeed: 20,
			snap: false,
			snapMode: "both",
			snapTolerance: 20,
			stack: false,
			zIndex: false,

			// Callbacks
			drag: null,
			start: null,
			stop: null
		},
		_create: function() {

			if ( this.options.helper === "original" ) {
				this._setPositionRelative();
			}
			if ( this.options.addClasses ) {
				this._addClass( "ui-draggable" );
			}
			this._setHandleClassName();

			this._mouseInit();
		},

		_setOption: function( key, value ) {
			this._super( key, value );
			if ( key === "handle" ) {
				this._removeHandleClassName();
				this._setHandleClassName();
			}
		},

		_destroy: function() {
			if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
				this.destroyOnClear = true;
				return;
			}
			this._removeHandleClassName();
			this._mouseDestroy();
		},

		_mouseCapture: function( event ) {
			var o = this.options;

			// Among others, prevent a drag on a resizable-handle
			if ( this.helper || o.disabled ||
					$( event.target ).closest( ".ui-resizable-handle" ).length > 0 ) {
				return false;
			}

			//Quit if we're not on a valid handle
			this.handle = this._getHandle( event );
			if ( !this.handle ) {
				return false;
			}

			this._blurActiveElement( event );

			this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

			return true;

		},

		_blockFrames: function( selector ) {
			this.iframeBlocks = this.document.find( selector ).map( function() {
				var iframe = $( this );

				return $( "<div>" )
					.css( "position", "absolute" )
					.appendTo( iframe.parent() )
					.outerWidth( iframe.outerWidth() )
					.outerHeight( iframe.outerHeight() )
					.offset( iframe.offset() )[ 0 ];
			} );
		},

		_unblockFrames: function() {
			if ( this.iframeBlocks ) {
				this.iframeBlocks.remove();
				delete this.iframeBlocks;
			}
		},

		_blurActiveElement: function( event ) {
			var activeElement = noder.active( this.document[ 0 ] ),
				target = $( event.target );

			// Don't blur if the event occurred on an element that is within
			// the currently focused element
			// See #10527, #12472
			if ( target.closest( activeElement ).length ) {
				return;
			}

			// Blur any element that currently has focus, see #4261
			noder.blur( activeElement );
		},

		_mouseStart: function( event ) {

			var o = this.options;

			//Create and append the visible helper
			this.helper = this._createHelper( event );

			this._addClass( this.helper, "ui-draggable-dragging" );

			//Cache the helper size
			this._cacheHelperProportions();

			//If ddmanager is used for droppables, set the global draggable
			if ( ddmanager ) {
				ddmanager.current = this;
			}

			/*
			 * - Position generation -
			 * This block generates everything position related - it's the core of draggables.
			 */

			//Cache the margins of the original element
			this._cacheMargins();

			//Store the helper's css position
			this.cssPosition = this.helper.css( "position" );
			this.scrollParent = this.helper.scrollParent( true );
			this.offsetParent = this.helper.offsetParent();
			this.hasFixedAncestor = this.helper.parents().filter( function() {
					return $( this ).css( "position" ) === "fixed";
				} ).length > 0;

			//The element's absolute position on the page minus margins
			this.positionAbs = this.element.offset();
			this._refreshOffsets( event );

			//Generate the original position
			this.originalPosition = this.position = this._generatePosition( event, false );
			this.originalPageX = event.pageX;
			this.originalPageY = event.pageY;

			//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
			( o.cursorAt && this._adjustOffsetFromHelper( o.cursorAt ) );

			//Set a containment if given in the options
			this._setContainment();

			//Trigger event + callbacks
			if ( this._trigger( "start", event ) === false ) {
				this._clear();
				return false;
			}

			//Recache the helper size
			this._cacheHelperProportions();

			//Prepare the droppable offsets
			if ( ddmanager && !o.dropBehaviour ) {
				ddmanager.prepareOffsets( this, event );
			}

			// Execute the drag once - this causes the helper not to be visible before getting its
			// correct position
			this._mouseDrag( event, true );

			// If the ddmanager is used for droppables, inform the manager that dragging has started
			// (see #5003)
			if ( ddmanager ) {
				ddmanager.dragStart( this, event );
			}

			return true;
		},

		_refreshOffsets: function( event ) {
			this.offset = {
				top: this.positionAbs.top - this.margins.top,
				left: this.positionAbs.left - this.margins.left,
				scroll: false,
				parent: this._getParentOffset(),
				relative: this._getRelativeOffset()
			};

			this.offset.click = {
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			};
		},

		_mouseDrag: function( event, noPropagation ) {

			// reset any necessary cached properties (see #5009)
			if ( this.hasFixedAncestor ) {
				this.offset.parent = this._getParentOffset();
			}

			//Compute the helpers position
			this.position = this._generatePosition( event, true );
			this.positionAbs = this._convertPositionTo( "absolute" );

			//Call patches and callbacks and use the resulting position if something is returned
			if ( !noPropagation ) {
				var ui = this._uiHash();
				if ( this._trigger( "drag", event, ui ) === false ) {
					this._mouseUp( new eventer.create( "mouseup", event ) );
					return false;
				}
				this.position = ui.position;
			}

			this.helper[ 0 ].style.left = this.position.left + "px";
			this.helper[ 0 ].style.top = this.position.top + "px";

			if ( ddmanager ) {
				ddmanager.drag( this, event );
			}

			return false;
		},

		_mouseStop: function( event ) {

			//If we are using droppables, inform the manager about the drop
			var that = this,
				dropped = false;
			if ( ddmanager && !this.options.dropBehaviour ) {
				dropped = ddmanager.drop( this, event );
			}

			//if a drop comes from outside (a sortable)
			if ( this.dropped ) {
				dropped = this.dropped;
				this.dropped = false;
			}

			if ( ( this.options.revert === "invalid" && !dropped ) ||
					( this.options.revert === "valid" && dropped ) ||
					this.options.revert === true || ( langx.isFunction( this.options.revert ) &&
					this.options.revert.call( this.element, dropped ) )
			) {
				$( this.helper ).animate(
					this.originalPosition,
					parseInt( this.options.revertDuration, 10 ),
					function() {
						if ( that._trigger( "stop", event ) !== false ) {
							that._clear();
						}
					}
				);
			} else {
				if ( this._trigger( "stop", event ) !== false ) {
					this._clear();
				}
			}

			return false;
		},

		_mouseUp: function( event ) {
			this._unblockFrames();

			// If the ddmanager is used for droppables, inform the manager that dragging has stopped
			// (see #5003)
			if ( ddmanager ) {
				ddmanager.dragStop( this, event );
			}

			// Only need to focus if the event occurred on the draggable itself, see #10527
			if ( this.handleElement.is( event.target ) ) {

				// The interaction is over; whether or not the click resulted in a drag,
				// focus the element
				this.element.trigger( "focus" );
			}

			return this.overrided(event );
		},

		cancel: function() {

			if ( this.helper.is( ".ui-draggable-dragging" ) ) {
				this._mouseUp( eventer.create( "mouseup", { target: this.element[ 0 ] }));
			} else {
				this._clear();
			}

			return this;

		},

		_getHandle: function( event ) {
			return this.options.handle ?
				!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
				true;
		},

		_setHandleClassName: function() {
			this.handleElement = this.options.handle ?
				this.element.find( this.options.handle ) : this.element;
			this._addClass( this.handleElement, "ui-draggable-handle" );
		},

		_removeHandleClassName: function() {
			this._removeClass( this.handleElement, "ui-draggable-handle" );
		},

		_createHelper: function( event ) {

			var o = this.options,
				helperIsFunction = langx.isFunction( o.helper ),
				helper = helperIsFunction ?
					$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
					( o.helper === "clone" ?
						this.element.clone().removeAttr( "id" ) :
						this.element );

			if ( !helper.parents( "body" ).length ) {
				helper.appendTo( ( o.appendTo === "parent" ?
					this.element[ 0 ].parentNode :
					o.appendTo ) );
			}

			// Http://bugs.jqueryui.com/ticket/9446
			// a helper function can return the original element
			// which wouldn't have been set to relative in _create
			if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
				this._setPositionRelative();
			}

			if ( helper[ 0 ] !== this.element[ 0 ] &&
					!( /(fixed|absolute)/ ).test( helper.css( "position" ) ) ) {
				helper.css( "position", "absolute" );
			}

			return helper;

		},

		_setPositionRelative: function() {
			if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
				this.element[ 0 ].style.position = "relative";
			}
		},

		_adjustOffsetFromHelper: function( obj ) {
			if ( typeof obj === "string" ) {
				obj = obj.split( " " );
			}
			if ( langx.isArray( obj ) ) {
				obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
			}
			if ( "left" in obj ) {
				this.offset.click.left = obj.left + this.margins.left;
			}
			if ( "right" in obj ) {
				this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
			}
			if ( "top" in obj ) {
				this.offset.click.top = obj.top + this.margins.top;
			}
			if ( "bottom" in obj ) {
				this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
			}
		},

		_isRootNode: function( element ) {
			return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
		},

		_getParentOffset: function() {

			//Get the offsetParent and cache its position
			var po = this.offsetParent.offset(),
				document = this.document[ 0 ];

			// This is a special case where we need to modify a offset calculated on start, since the
			// following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the
			// next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
			// the document, which means that the scroll is included in the initial calculation of the
			// offset of the parent, and never recalculated upon drag
			if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== document &&
					noder.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}

			if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
				po = { top: 0, left: 0 };
			}

			return {
				top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
				left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
			};

		},

		_getRelativeOffset: function() {
			if ( this.cssPosition !== "relative" ) {
				return { top: 0, left: 0 };
			}

			var p = this.element.position(),
				scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

			return {
				top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
					( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
				left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
					( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
			};

		},

		_cacheMargins: function() {
			this.margins = {
				left: ( parseInt( this.element.css( "marginLeft" ), 10 ) || 0 ),
				top: ( parseInt( this.element.css( "marginTop" ), 10 ) || 0 ),
				right: ( parseInt( this.element.css( "marginRight" ), 10 ) || 0 ),
				bottom: ( parseInt( this.element.css( "marginBottom" ), 10 ) || 0 )
			};
		},

		_cacheHelperProportions: function() {
			this.helperProportions = {
				width: this.helper.outerWidth(),
				height: this.helper.outerHeight()
			};
		},

		_setContainment: function() {

			var isUserScrollable, c, ce,
				o = this.options,
				document = this.document[ 0 ];

			this.relativeContainer = null;

			if ( !o.containment ) {
				this.containment = null;
				return;
			}

			if ( o.containment === "window" ) {
				this.containment = [
					$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
					$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
					$( window ).scrollLeft() + $( window ).width() -
						this.helperProportions.width - this.margins.left,
					$( window ).scrollTop() +
						( $( window ).height() || document.body.parentNode.scrollHeight ) -
						this.helperProportions.height - this.margins.top
				];
				return;
			}

			if ( o.containment === "document" ) {
				this.containment = [
					0,
					0,
					$( document ).width() - this.helperProportions.width - this.margins.left,
					( $( document ).height() || document.body.parentNode.scrollHeight ) -
						this.helperProportions.height - this.margins.top
				];
				return;
			}

			if ( o.containment.constructor === Array ) {
				this.containment = o.containment;
				return;
			}

			if ( o.containment === "parent" ) {
				o.containment = this.helper[ 0 ].parentNode;
			}

			c = $( o.containment );
			ce = c[ 0 ];

			if ( !ce ) {
				return;
			}

			isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

			this.containment = [
				( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) +
					( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
				( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) +
					( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
				( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
					( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
					( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
					this.helperProportions.width -
					this.margins.left -
					this.margins.right,
				( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
					( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
					( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
					this.helperProportions.height -
					this.margins.top -
					this.margins.bottom
			];
			this.relativeContainer = c;
		},

		_convertPositionTo: function( d, pos ) {

			if ( !pos ) {
				pos = this.position;
			}

			var mod = d === "absolute" ? 1 : -1,
				scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

			return {
				top: (

					// The absolute mouse position
					pos.top	+

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.top * mod +

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.top * mod -
					( ( this.cssPosition === "fixed" ?
						-this.offset.scroll.top :
						( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod )
				),
				left: (

					// The absolute mouse position
					pos.left +

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.left * mod +

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.left * mod	-
					( ( this.cssPosition === "fixed" ?
						-this.offset.scroll.left :
						( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod )
				)
			};

		},

		_generatePosition: function( event, constrainPosition ) {

			var containment, co, top, left,
				o = this.options,
				scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
				pageX = event.pageX,
				pageY = event.pageY;

			// Cache the scroll
			if ( !scrollIsRootNode || !this.offset.scroll ) {
				this.offset.scroll = {
					top: this.scrollParent.scrollTop(),
					left: this.scrollParent.scrollLeft()
				};
			}

			/*
			 * - Position constraining -
			 * Constrain the position to a mix of grid, containment.
			 */

			// If we are not dragging yet, we won't check for options
			if ( constrainPosition ) {
				if ( this.containment ) {
					if ( this.relativeContainer ) {
						co = this.relativeContainer.offset();
						containment = [
							this.containment[ 0 ] + co.left,
							this.containment[ 1 ] + co.top,
							this.containment[ 2 ] + co.left,
							this.containment[ 3 ] + co.top
						];
					} else {
						containment = this.containment;
					}

					if ( event.pageX - this.offset.click.left < containment[ 0 ] ) {
						pageX = containment[ 0 ] + this.offset.click.left;
					}
					if ( event.pageY - this.offset.click.top < containment[ 1 ] ) {
						pageY = containment[ 1 ] + this.offset.click.top;
					}
					if ( event.pageX - this.offset.click.left > containment[ 2 ] ) {
						pageX = containment[ 2 ] + this.offset.click.left;
					}
					if ( event.pageY - this.offset.click.top > containment[ 3 ] ) {
						pageY = containment[ 3 ] + this.offset.click.top;
					}
				}

				if ( o.grid ) {

					//Check for grid elements set to 0 to prevent divide by 0 error causing invalid
					// argument errors in IE (see ticket #6950)
					top = o.grid[ 1 ] ? this.originalPageY + Math.round( ( pageY -
						this.originalPageY ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalPageY;
					pageY = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
						top - this.offset.click.top > containment[ 3 ] ) ?
							top :
							( ( top - this.offset.click.top >= containment[ 1 ] ) ?
								top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

					left = o.grid[ 0 ] ? this.originalPageX +
						Math.round( ( pageX - this.originalPageX ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
						this.originalPageX;
					pageX = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
						left - this.offset.click.left > containment[ 2 ] ) ?
							left :
							( ( left - this.offset.click.left >= containment[ 0 ] ) ?
								left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
				}

				if ( o.axis === "y" ) {
					pageX = this.originalPageX;
				}

				if ( o.axis === "x" ) {
					pageY = this.originalPageY;
				}
			}

			return {
				top: (

					// The absolute mouse position
					pageY -

					// Click offset (relative to the element)
					this.offset.click.top -

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.top -

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.top +
					( this.cssPosition === "fixed" ?
						-this.offset.scroll.top :
						( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
				),
				left: (

					// The absolute mouse position
					pageX -

					// Click offset (relative to the element)
					this.offset.click.left -

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.left -

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.left +
					( this.cssPosition === "fixed" ?
						-this.offset.scroll.left :
						( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
				)
			};

		},

		_clear: function() {
			this._removeClass( this.helper, "ui-draggable-dragging" );
			if ( this.helper[ 0 ] !== this.element[ 0 ] && !this.cancelHelperRemoval ) {
				this.helper.remove();
			}
			this.helper = null;
			this.cancelHelperRemoval = false;
			if ( this.destroyOnClear ) {
				this.destroy();
			}
		},

		// From now on bulk stuff - mainly helpers

		_trigger: function( type, event, ui ) {
			ui = ui || this._uiHash();
			patch.call( this, type, [ event, ui, this ], true );

			// Absolute position and offset (see #6884 ) have to be recalculated after patches
			if ( /^(drag|start|stop)/.test( type ) ) {
				this.positionAbs = this._convertPositionTo( "absolute" );
				ui.offset = this.positionAbs;
			}
			return this.overrided( type, event, ui );
		},

		patches: {},

		_uiHash: function() {
			return {
				helper: this.helper,
				position: this.position,
				originalPosition: this.originalPosition,
				offset: this.positionAbs
			};
		}



	});


	plugins.register(Draggable,"draggable");

	patch.add(Draggable, "connectToSortable", {
		start: function( event, ui, draggable ) {
			var uiSortable = langx.extend( {}, ui, {
				item: draggable.element
			} );

			draggable.sortables = [];
			$( draggable.options.connectToSortable ).each( function() {
				var sortable = $( this ).sortable( "instance" );

				if ( sortable && !sortable.options.disabled ) {
					draggable.sortables.push( sortable );

					// RefreshPositions is called at drag start to refresh the containerCache
					// which is used in drag. This ensures it's initialized and synchronized
					// with any changes that might have happened on the page since initialization.
					sortable.refreshPositions();
					sortable._trigger( "activate", event, uiSortable );
				}
			} );
		},
		stop: function( event, ui, draggable ) {
			var uiSortable = langx.extend( {}, ui, {
				item: draggable.element
			} );

			draggable.cancelHelperRemoval = false;

			langx.each( draggable.sortables, function() {
				var sortable = this;

				if ( sortable.isOver ) {
					sortable.isOver = 0;

					// Allow this sortable to handle removing the helper
					draggable.cancelHelperRemoval = true;
					sortable.cancelHelperRemoval = false;

					// Use _storedCSS To restore properties in the sortable,
					// as this also handles revert (#9675) since the draggable
					// may have modified them in unexpected ways (#8809)
					sortable._storedCSS = {
						position: sortable.placeholder.css( "position" ),
						top: sortable.placeholder.css( "top" ),
						left: sortable.placeholder.css( "left" )
					};

					sortable._mouseStop( event );

					// Once drag has ended, the sortable should return to using
					// its original helper, not the shared helper from draggable
					sortable.options.helper = sortable.options._helper;
				} else {

					// Prevent this Sortable from removing the helper.
					// However, don't set the draggable to remove the helper
					// either as another connected Sortable may yet handle the removal.
					sortable.cancelHelperRemoval = true;

					sortable._trigger( "deactivate", event, uiSortable );
				}
			} );
		},
		drag: function( event, ui, draggable ) {
			langx.each( draggable.sortables, function() {
				var innermostIntersecting = false,
					sortable = this;

				// Copy over variables that sortable's _intersectsWith uses
				sortable.positionAbs = draggable.positionAbs;
				sortable.helperProportions = draggable.helperProportions;
				sortable.offset.click = draggable.offset.click;

				if ( sortable._intersectsWith( sortable.containerCache ) ) {
					innermostIntersecting = true;

					langx.each( draggable.sortables, function() {

						// Copy over variables that sortable's _intersectsWith uses
						this.positionAbs = draggable.positionAbs;
						this.helperProportions = draggable.helperProportions;
						this.offset.click = draggable.offset.click;

						if ( this !== sortable &&
								this._intersectsWith( this.containerCache ) &&
								noder.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
							innermostIntersecting = false;
						}

						return innermostIntersecting;
					} );
				}

				if ( innermostIntersecting ) {

					// If it intersects, we use a little isOver variable and set it once,
					// so that the move-in stuff gets fired only once.
					if ( !sortable.isOver ) {
						sortable.isOver = 1;

						// Store draggable's parent in case we need to reappend to it later.
						draggable._parent = ui.helper.parent();

						sortable.currentItem = ui.helper
							.appendTo( sortable.element )
							.data( "ui-sortable-item", true );

						// Store helper option to later restore it
						sortable.options._helper = sortable.options.helper;

						sortable.options.helper = function() {
							return ui.helper[ 0 ];
						};

						// Fire the start events of the sortable with our passed browser event,
						// and our own helper (so it doesn't create a new one)
						event.target = sortable.currentItem[ 0 ];
						sortable._mouseCapture( event, true );
						sortable._mouseStart( event, true, true );

						// Because the browser event is way off the new appended portlet,
						// modify necessary variables to reflect the changes
						sortable.offset.click.top = draggable.offset.click.top;
						sortable.offset.click.left = draggable.offset.click.left;
						sortable.offset.parent.left -= draggable.offset.parent.left -
							sortable.offset.parent.left;
						sortable.offset.parent.top -= draggable.offset.parent.top -
							sortable.offset.parent.top;

						draggable._trigger( "toSortable", event );

						// Inform draggable that the helper is in a valid drop zone,
						// used solely in the revert option to handle "valid/invalid".
						draggable.dropped = sortable.element;

						// Need to refreshPositions of all sortables in the case that
						// adding to one sortable changes the location of the other sortables (#9675)
						langx.each( draggable.sortables, function() {
							this.refreshPositions();
						} );

						// Hack so receive/update callbacks work (mostly)
						draggable.currentItem = draggable.element;
						sortable.fromOutside = draggable;
					}

					if ( sortable.currentItem ) {
						sortable._mouseDrag( event );

						// Copy the sortable's position because the draggable's can potentially reflect
						// a relative position, while sortable is always absolute, which the dragged
						// element has now become. (#8809)
						ui.position = sortable.position;
					}
				} else {

					// If it doesn't intersect with the sortable, and it intersected before,
					// we fake the drag stop of the sortable, but make sure it doesn't remove
					// the helper by using cancelHelperRemoval.
					if ( sortable.isOver ) {

						sortable.isOver = 0;
						sortable.cancelHelperRemoval = true;

						// Calling sortable's mouseStop would trigger a revert,
						// so revert must be temporarily false until after mouseStop is called.
						sortable.options._revert = sortable.options.revert;
						sortable.options.revert = false;

						sortable._trigger( "out", event, sortable._uiHash( sortable ) );
						sortable._mouseStop( event, true );

						// Restore sortable behaviors that were modfied
						// when the draggable entered the sortable area (#9481)
						sortable.options.revert = sortable.options._revert;
						sortable.options.helper = sortable.options._helper;

						if ( sortable.placeholder ) {
							sortable.placeholder.remove();
						}

						// Restore and recalculate the draggable's offset considering the sortable
						// may have modified them in unexpected ways. (#8809, #10669)
						ui.helper.appendTo( draggable._parent );
						draggable._refreshOffsets( event );
						ui.position = draggable._generatePosition( event, true );

						draggable._trigger( "fromSortable", event );

						// Inform draggable that the helper is no longer in a valid drop zone
						draggable.dropped = false;

						// Need to refreshPositions of all sortables just in case removing
						// from one sortable changes the location of other sortables (#9675)
						langx.each( draggable.sortables, function() {
							this.refreshPositions();
						} );
					}
				}
			} );
		}
	});

	patch.add( Draggable, "cursor", {
		start: function( event, ui, instance ) {
			var t = $( "body" ),
				o = instance.options;

			if ( t.css( "cursor" ) ) {
				o._cursor = t.css( "cursor" );
			}
			t.css( "cursor", o.cursor );
		},
		stop: function( event, ui, instance ) {
			var o = instance.options;
			if ( o._cursor ) {
				$( "body" ).css( "cursor", o._cursor );
			}
		}
	} );

	patch.add( Draggable, "opacity", {
		start: function( event, ui, instance ) {
			var t = $( ui.helper ),
				o = instance.options;
			if ( t.css( "opacity" ) ) {
				o._opacity = t.css( "opacity" );
			}
			t.css( "opacity", o.opacity );
		},
		stop: function( event, ui, instance ) {
			var o = instance.options;
			if ( o._opacity ) {
				$( ui.helper ).css( "opacity", o._opacity );
			}
		}
	} );

	patch.add( Draggable, "scroll", {
		start: function( event, ui, i ) {
			if ( !i.scrollParentNotHidden ) {
				i.scrollParentNotHidden = i.helper.scrollParent( false );
			}

			if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] &&
					i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
				i.overflowOffset = i.scrollParentNotHidden.offset();
			}
		},
		drag: function( event, ui, i  ) {

			var o = i.options,
				scrolled = false,
				scrollParent = i.scrollParentNotHidden[ 0 ],
				document = i.document[ 0 ];

			if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
				if ( !o.axis || o.axis !== "x" ) {
					if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY <
							o.scrollSensitivity ) {
						scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
					} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
						scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
					}
				}

				if ( !o.axis || o.axis !== "y" ) {
					if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX <
							o.scrollSensitivity ) {
						scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
					} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
						scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
					}
				}

			} else {

				if ( !o.axis || o.axis !== "x" ) {
					if ( event.pageY - $( document ).scrollTop() < o.scrollSensitivity ) {
						scrolled = $( document ).scrollTop( $( document ).scrollTop() - o.scrollSpeed );
					} else if ( $( window ).height() - ( event.pageY - $( document ).scrollTop() ) <
							o.scrollSensitivity ) {
						scrolled = $( document ).scrollTop( $( document ).scrollTop() + o.scrollSpeed );
					}
				}

				if ( !o.axis || o.axis !== "y" ) {
					if ( event.pageX - $( document ).scrollLeft() < o.scrollSensitivity ) {
						scrolled = $( document ).scrollLeft(
							$( document ).scrollLeft() - o.scrollSpeed
						);
					} else if ( $( window ).width() - ( event.pageX - $( document ).scrollLeft() ) <
							o.scrollSensitivity ) {
						scrolled = $( document ).scrollLeft(
							$( document ).scrollLeft() + o.scrollSpeed
						);
					}
				}

			}

			if ( scrolled !== false && ddmanager && !o.dropBehaviour ) {
				ddmanager.prepareOffsets( i, event );
			}

		}
	} );

	patch.add( Draggable, "snap", {
		start: function( event, ui, i ) {

			var o = i.options;

			i.snapElements = [];

			$( o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap )
				.each( function() {
					var $t = $( this ),
						$o = $t.offset();
					if ( this !== i.element[ 0 ] ) {
						i.snapElements.push( {
							item: this,
							width: $t.outerWidth(), height: $t.outerHeight(),
							top: $o.top, left: $o.left
						} );
					}
				} );

		},
		drag: function( event, ui, inst ) {

			var ts, bs, ls, rs, l, r, t, b, i, first,
				o = inst.options,
				d = o.snapTolerance,
				x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
				y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

			for ( i = inst.snapElements.length - 1; i >= 0; i-- ) {

				l = inst.snapElements[ i ].left - inst.margins.left;
				r = l + inst.snapElements[ i ].width;
				t = inst.snapElements[ i ].top - inst.margins.top;
				b = t + inst.snapElements[ i ].height;

				if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d ||
						!noder.contains( inst.snapElements[ i ].item.ownerDocument,
						inst.snapElements[ i ].item ) ) {
					if ( inst.snapElements[ i ].snapping ) {
						( inst.options.snap.release &&
							inst.options.snap.release.call(
								inst.element,
								event,
								langx.extend( inst._uiHash(), { snapItem: inst.snapElements[ i ].item } )
							) );
					}
					inst.snapElements[ i ].snapping = false;
					continue;
				}

				if ( o.snapMode !== "inner" ) {
					ts = Math.abs( t - y2 ) <= d;
					bs = Math.abs( b - y1 ) <= d;
					ls = Math.abs( l - x2 ) <= d;
					rs = Math.abs( r - x1 ) <= d;
					if ( ts ) {
						ui.position.top = inst._convertPositionTo( "relative", {
							top: t - inst.helperProportions.height,
							left: 0
						} ).top;
					}
					if ( bs ) {
						ui.position.top = inst._convertPositionTo( "relative", {
							top: b,
							left: 0
						} ).top;
					}
					if ( ls ) {
						ui.position.left = inst._convertPositionTo( "relative", {
							top: 0,
							left: l - inst.helperProportions.width
						} ).left;
					}
					if ( rs ) {
						ui.position.left = inst._convertPositionTo( "relative", {
							top: 0,
							left: r
						} ).left;
					}
				}

				first = ( ts || bs || ls || rs );

				if ( o.snapMode !== "outer" ) {
					ts = Math.abs( t - y1 ) <= d;
					bs = Math.abs( b - y2 ) <= d;
					ls = Math.abs( l - x1 ) <= d;
					rs = Math.abs( r - x2 ) <= d;
					if ( ts ) {
						ui.position.top = inst._convertPositionTo( "relative", {
							top: t,
							left: 0
						} ).top;
					}
					if ( bs ) {
						ui.position.top = inst._convertPositionTo( "relative", {
							top: b - inst.helperProportions.height,
							left: 0
						} ).top;
					}
					if ( ls ) {
						ui.position.left = inst._convertPositionTo( "relative", {
							top: 0,
							left: l
						} ).left;
					}
					if ( rs ) {
						ui.position.left = inst._convertPositionTo( "relative", {
							top: 0,
							left: r - inst.helperProportions.width
						} ).left;
					}
				}

				if ( !inst.snapElements[ i ].snapping && ( ts || bs || ls || rs || first ) ) {
					( inst.options.snap.snap &&
						inst.options.snap.snap.call(
							inst.element,
							event,
							langx.extend( inst._uiHash(), {
								snapItem: inst.snapElements[ i ].item
							} ) ) );
				}
				inst.snapElements[ i ].snapping = ( ts || bs || ls || rs || first );

			}

		}
	} );

	patch.add( Draggable, "stack", {
		start: function( event, ui, instance ) {
			var min,
				o = instance.options,
				group = langx.makeArray( $( o.stack ) ).sort( function( a, b ) {
					return ( parseInt( $( a ).css( "zIndex" ), 10 ) || 0 ) -
						( parseInt( $( b ).css( "zIndex" ), 10 ) || 0 );
				} );

			if ( !group.length ) { return; }

			min = parseInt( $( group[ 0 ] ).css( "zIndex" ), 10 ) || 0;
			$( group ).each( function( i ) {
				$( this ).css( "zIndex", min + i );
			} );
			this.css( "zIndex", ( min + group.length ) );
		}
	} );

	patch.add( Draggable, "zIndex", {
		start: function( event, ui, instance ) {
			var t = $( ui.helper ),
				o = instance.options;

			if ( t.css( "zIndex" ) ) {
				o._zIndex = t.css( "zIndex" );
			}
			t.css( "zIndex", o.zIndex );
		},
		stop: function( event, ui, instance ) {
			var o = instance.options;

			if ( o._zIndex ) {
				$( ui.helper ).css( "zIndex", o._zIndex );
			}
		}
	});

	return Draggable;
});

define( 'skylark-jqueryui-interact/Droppable',[
	"skylark-langx/langx",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"skylark-jquery/JqueryPlugin",
	"./patch",
	"./ddmanager",
],function(langx, eventer, noder, $, plugins, JqPlugin, patch, ddmanager) {

	var Droppable = JqPlugin.inherit({
		klassName: "Droppable",

		pluginName : "ui.Droppable",

		widgetEventPrefix: "drop",
		
		options: {
			accept: "*",
			addClasses: true,
			greedy: false,
			scope: "default",
			tolerance: "intersect",

			// Callbacks
			activate: null,
			deactivate: null,
			drop: null,
			out: null,
			over: null
		},
		_create: function() {

			var proportions,
				o = this.options,
				accept = o.accept;

			this.isover = false;
			this.isout = true;

			this.accept = langx.isFunction( accept ) ? accept : function( d ) {
				return d.is( accept );
			};

			this.proportions = function( /* valueToWrite */ ) {
				if ( arguments.length ) {

					// Store the droppable's proportions
					proportions = arguments[ 0 ];
				} else {

					// Retrieve or derive the droppable's proportions
					return proportions ?
						proportions :
						proportions = {
							width: this.element[ 0 ].offsetWidth,
							height: this.element[ 0 ].offsetHeight
						};
				}
			};

			this._addToManager( o.scope );

			o.addClasses && this._addClass( "ui-droppable" );

		},

		_addToManager: function( scope ) {

			// Add the reference and positions to the manager
			ddmanager.droppables[ scope ] = ddmanager.droppables[ scope ] || [];
			ddmanager.droppables[ scope ].push( this );
		},

		_splice: function( drop ) {
			var i = 0;
			for ( ; i < drop.length; i++ ) {
				if ( drop[ i ] === this ) {
					drop.splice( i, 1 );
				}
			}
		},

		_destroy: function() {
			var drop = ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
		},

		_setOption: function( key, value ) {

			if ( key === "accept" ) {
				this.accept = langx.isFunction( value ) ? value : function( d ) {
					return d.is( value );
				};
			} else if ( key === "scope" ) {
				var drop = ddmanager.droppables[ this.options.scope ];

				this._splice( drop );
				this._addToManager( value );
			}

			this._super( key, value );
		},

		_activate: function( event ) {
			var draggable = ddmanager.current;

			this._addActiveClass();
			if ( draggable ) {
				this._trigger( "activate", event, this.ui( draggable ) );
			}
		},

		_deactivate: function( event ) {
			var draggable = ddmanager.current;

			this._removeActiveClass();
			if ( draggable ) {
				this._trigger( "deactivate", event, this.ui( draggable ) );
			}
		},

		_over: function( event ) {

			var draggable = ddmanager.current;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return;
			}

			if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
					draggable.element ) ) ) {
				this._addHoverClass();
				this._trigger( "over", event, this.ui( draggable ) );
			}

		},

		_out: function( event ) {

			var draggable = ddmanager.current;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return;
			}

			if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
					draggable.element ) ) ) {
				this._removeHoverClass();
				this._trigger( "out", event, this.ui( draggable ) );
			}

		},

		_drop: function( event, custom ) {

			var draggable = custom || ddmanager.current,
				childrenIntersection = false;

			// Bail if draggable and droppable are same element
			if ( !draggable || ( draggable.currentItem ||
					draggable.element )[ 0 ] === this.element[ 0 ] ) {
				return false;
			}

			this.element
				.find( ":data(ui-droppable)" )
				.not( ".ui-draggable-dragging" )
				.each( function() {
					var inst = $( this ).droppable( "instance" );
					if (
						inst.options.greedy &&
						!inst.options.disabled &&
						inst.options.scope === draggable.options.scope &&
						inst.accept.call(
							inst.element[ 0 ], ( draggable.currentItem || draggable.element )
						) &&
						ddmanager.intersect(
							draggable,
							langx.extend( inst, { offset: inst.element.offset() } ),
							inst.options.tolerance, event
						)
					) {
						childrenIntersection = true;
						return false; }
				} );
			if ( childrenIntersection ) {
				return false;
			}

			if ( this.accept.call( this.element[ 0 ],
					( draggable.currentItem || draggable.element ) ) ) {
				this._removeActiveClass();
				this._removeHoverClass();

				this._trigger( "drop", event, this.ui( draggable ) );
				return this.element;
			}

			return false;

		},

		ui: function( c ) {
			return {
				draggable: ( c.currentItem || c.element ),
				helper: c.helper,
				position: c.position,
				offset: c.positionAbs
			};
		},

		// Extension points just to make backcompat sane and avoid duplicating logic
		// TODO: Remove in 1.13 along with call to it below
		_addHoverClass: function() {
			this._addClass( "ui-droppable-hover" );
		},

		_removeHoverClass: function() {
			this._removeClass( "ui-droppable-hover" );
		},

		_addActiveClass: function() {
			this._addClass( "ui-droppable-active" );
		},

		_removeActiveClass: function() {
			this._removeClass( "ui-droppable-active" );
		}
	} );

	plugins.register(Droppable,"droppable");

	return Droppable;

});

define( 'skylark-jqueryui-interact/Resizable',[
	"skylark-langx/langx",
	"skylark-domx-data",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"./Mouse",
	"./patch",
	"./ddmanager",
],function(langx, datax, eventer, noder, $, plugins, Mouse, patch, ddmanager) {

	var Resizable = Mouse.inherit({
		klassName: "Resizable",

		pluginName : "ui.resizable",
	
		widgetEventPrefix: "resize",

		options: {
			alsoResize: false,
			animate: false,
			animateDuration: "slow",
			animateEasing: "swing",
			aspectRatio: false,
			autoHide: false,
			classes: {
				"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
			},
			containment: false,
			ghost: false,
			grid: false,
			handles: "e,s,se",
			helper: false,
			maxHeight: null,
			maxWidth: null,
			minHeight: 10,
			minWidth: 10,

			// See #7960
			zIndex: 90,

			// Callbacks
			resize: null,
			start: null,
			stop: null
		},

		_num: function( value ) {
			return parseFloat( value ) || 0;
		},

		_isNumber: function( value ) {
			return !isNaN( parseFloat( value ) );
		},

		_hasScroll: function( el, a ) {

			if ( $( el ).css( "overflow" ) === "hidden" ) {
				return false;
			}

			var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
				has = false;

			if ( el[ scroll ] > 0 ) {
				return true;
			}

			// TODO: determine which cases actually cause this to happen
			// if the element doesn't have the scroll set, see if it's possible to
			// set the scroll
			el[ scroll ] = 1;
			has = ( el[ scroll ] > 0 );
			el[ scroll ] = 0;
			return has;
		},

		_create: function() {

			var margins,
				o = this.options,
				that = this;
			this._addClass( "ui-resizable" );

			langx.extend( this, {
				_aspectRatio: !!( o.aspectRatio ),
				aspectRatio: o.aspectRatio,
				originalElement: this.element,
				_proportionallyResizeElements: [],
				_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
			} );

			// Wrap the element if it cannot hold child nodes
			if ( this.element[ 0 ].nodeName.match( /^(canvas|textarea|input|select|button|img)$/i ) ) {

				this.element.wrap(
					$( "<div class='ui-wrapper' style='overflow: hidden;'></div>" ).css( {
						position: this.element.css( "position" ),
						width: this.element.outerWidth(),
						height: this.element.outerHeight(),
						top: this.element.css( "top" ),
						left: this.element.css( "left" )
					} )
				);

				this.element = this.element.parent().data(
					"ui-resizable", this.element.resizable( "instance" )
				);

				this.elementIsWrapper = true;

				margins = {
					marginTop: this.originalElement.css( "marginTop" ),
					marginRight: this.originalElement.css( "marginRight" ),
					marginBottom: this.originalElement.css( "marginBottom" ),
					marginLeft: this.originalElement.css( "marginLeft" )
				};

				this.element.css( margins );
				this.originalElement.css( "margin", 0 );

				// support: Safari
				// Prevent Safari textarea resize
				this.originalResizeStyle = this.originalElement.css( "resize" );
				this.originalElement.css( "resize", "none" );

				this._proportionallyResizeElements.push( this.originalElement.css( {
					position: "static",
					zoom: 1,
					display: "block"
				}));

				// Support: IE9
				// avoid IE jump (hard set the margin)
				this.originalElement.css( margins );

				this._proportionallyResize();
			}

			this._setupHandles();

			if ( o.autoHide ) {
				$( this.element )
					.on( "mouseenter", function() {
						if ( o.disabled ) {
							return;
						}
						that._removeClass( "ui-resizable-autohide" );
						that._handles.show();
					} )
					.on( "mouseleave", function() {
						if ( o.disabled ) {
							return;
						}
						if ( !that.resizing ) {
							that._addClass( "ui-resizable-autohide" );
							that._handles.hide();
						}
					} );
			}

			this._mouseInit();
		},

		_destroy: function() {

			this._mouseDestroy();
			this._addedHandles.remove();

			var wrapper,
				_destroy = function( exp ) {
					$( exp )
						.removeData( "resizable" )
						.removeData( "ui-resizable" )
						.off( ".resizable" );
				};

			// TODO: Unwrap at same DOM position
			if ( this.elementIsWrapper ) {
				_destroy( this.element );
				wrapper = this.element;
				this.originalElement.css( {
					position: wrapper.css( "position" ),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css( "top" ),
					left: wrapper.css( "left" )
				} ).insertAfter( wrapper );
				wrapper.remove();
			}

			this.originalElement.css( "resize", this.originalResizeStyle );
			_destroy( this.originalElement );

			return this;
		},

		_setOption: function( key, value ) {
			this._super( key, value );

			switch ( key ) {
			case "handles":
				this._removeHandles();
				this._setupHandles();
				break;
			case "aspectRatio":
				this._aspectRatio = !!value;
				break;
			default:
				break;
			}
		},

		_setupHandles: function() {
			var o = this.options, handle, i, n, hname, axis, that = this;
			this.handles = o.handles ||
				( !$( ".ui-resizable-handle", this.element ).length ?
					"e,s,se" : {
						n: ".ui-resizable-n",
						e: ".ui-resizable-e",
						s: ".ui-resizable-s",
						w: ".ui-resizable-w",
						se: ".ui-resizable-se",
						sw: ".ui-resizable-sw",
						ne: ".ui-resizable-ne",
						nw: ".ui-resizable-nw"
					} );

			this._handles = $();
			this._addedHandles = $();
			if ( this.handles.constructor === String ) {

				if ( this.handles === "all" ) {
					this.handles = "n,e,s,w,se,sw,ne,nw";
				}

				n = this.handles.split( "," );
				this.handles = {};

				for ( i = 0; i < n.length; i++ ) {

					handle = langx.trim( n[ i ] );
					hname = "ui-resizable-" + handle;
					axis = $( "<div>" );
					this._addClass( axis, "ui-resizable-handle " + hname );

					axis.css( { zIndex: o.zIndex } );

					this.handles[ handle ] = ".ui-resizable-" + handle;
					if ( !this.element.children( this.handles[ handle ] ).length ) {
						this.element.append( axis );
						this._addedHandles = this._addedHandles.add( axis );
					}
				}

			}

			this._renderAxis = function( target ) {

				var i, axis, padPos, padWrapper;

				target = target || this.element;

				for ( i in this.handles ) {

					if ( this.handles[ i ].constructor === String ) {
						this.handles[ i ] = this.element.children( this.handles[ i ] ).first().show();
					} else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
						this.handles[ i ] = $( this.handles[ i ] );
						this._on( this.handles[ i ], { "mousedown": that._mouseDown } );
					}

					if ( this.elementIsWrapper &&
							this.originalElement[ 0 ]
								.nodeName
								.match( /^(textarea|input|select|button)$/i ) ) {
						axis = $( this.handles[ i ], this.element );

						padWrapper = /sw|ne|nw|se|n|s/.test( i ) ?
							axis.outerHeight() :
							axis.outerWidth();

						padPos = [ "padding",
							/ne|nw|n/.test( i ) ? "Top" :
							/se|sw|s/.test( i ) ? "Bottom" :
							/^e$/.test( i ) ? "Right" : "Left" ].join( "" );

						target.css( padPos, padWrapper );

						this._proportionallyResize();
					}

					this._handles = this._handles.add( this.handles[ i ] );
				}
			};

			// TODO: make renderAxis a prototype function
			this._renderAxis( this.element );

			this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
			this._handles.disableSelection();

			this._handles.on( "mouseover", function() {
				if ( !that.resizing ) {
					if ( this.className ) {
						axis = this.className.match( /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i );
					}
					that.axis = axis && axis[ 1 ] ? axis[ 1 ] : "se";
				}
			} );

			if ( o.autoHide ) {
				this._handles.hide();
				this._addClass( "ui-resizable-autohide" );
			}
		},

		_removeHandles: function() {
			this._addedHandles.remove();
		},

		_mouseCapture: function( event ) {
			var i, handle,
				capture = false;

			for ( i in this.handles ) {
				handle = $( this.handles[ i ] )[ 0 ];
				if ( handle === event.target || noder.contains( handle, event.target ) ) {
					capture = true;
				}
			}

			return !this.options.disabled && capture;
		},

		_mouseStart: function( event ) {

			var curleft, curtop, cursor,
				o = this.options,
				el = this.element;

			this.resizing = true;

			this._renderProxy();

			curleft = this._num( this.helper.css( "left" ) );
			curtop = this._num( this.helper.css( "top" ) );

			if ( o.containment ) {
				curleft += $( o.containment ).scrollLeft() || 0;
				curtop += $( o.containment ).scrollTop() || 0;
			}

			this.offset = this.helper.offset();
			this.position = { left: curleft, top: curtop };

			this.size = this._helper ? {
					width: this.helper.width(),
					height: this.helper.height()
				} : {
					width: el.width(),
					height: el.height()
				};

			this.originalSize = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};

			this.sizeDiff = {
				width: el.outerWidth() - el.width(),
				height: el.outerHeight() - el.height()
			};

			this.originalPosition = { left: curleft, top: curtop };
			this.originalMousePosition = { left: event.pageX, top: event.pageY };

			this.aspectRatio = ( typeof o.aspectRatio === "number" ) ?
				o.aspectRatio :
				( ( this.originalSize.width / this.originalSize.height ) || 1 );

			cursor = $( ".ui-resizable-" + this.axis ).css( "cursor" );
			$( "body" ).css( "cursor", cursor === "auto" ? this.axis + "-resize" : cursor );

			this._addClass( "ui-resizable-resizing" );
			this._propagate( "start", event );
			return true;
		},

		_mouseDrag: function( event ) {

			var data, props,
				smp = this.originalMousePosition,
				a = this.axis,
				dx = ( event.pageX - smp.left ) || 0,
				dy = ( event.pageY - smp.top ) || 0,
				trigger = this._change[ a ];

			this._updatePrevProperties();

			if ( !trigger ) {
				return false;
			}

			data = trigger.apply( this, [ event, dx, dy ] );

			this._updateVirtualBoundaries( event.shiftKey );
			if ( this._aspectRatio || event.shiftKey ) {
				data = this._updateRatio( data, event );
			}

			data = this._respectSize( data, event );

			this._updateCache( data );

			this._propagate( "resize", event );

			props = this._applyChanges();

			if ( !this._helper && this._proportionallyResizeElements.length ) {
				this._proportionallyResize();
			}

			if ( !langx.isEmptyObject( props ) ) {
				this._updatePrevProperties();
				this._trigger( "resize", event, this.ui() );
				this._applyChanges();
			}

			return false;
		},

		_mouseStop: function( event ) {

			this.resizing = false;
			var pr, ista, soffseth, soffsetw, s, left, top,
				o = this.options, that = this;

			if ( this._helper ) {

				pr = this._proportionallyResizeElements;
				ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName );
				soffseth = ista && this._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height;
				soffsetw = ista ? 0 : that.sizeDiff.width;

				s = {
					width: ( that.helper.width()  - soffsetw ),
					height: ( that.helper.height() - soffseth )
				};
				left = ( parseFloat( that.element.css( "left" ) ) +
					( that.position.left - that.originalPosition.left ) ) || null;
				top = ( parseFloat( that.element.css( "top" ) ) +
					( that.position.top - that.originalPosition.top ) ) || null;

				if ( !o.animate ) {
					this.element.css( langx.extend( s, { top: top, left: left }));
				}

				that.helper.height( that.size.height );
				that.helper.width( that.size.width );

				if ( this._helper && !o.animate ) {
					this._proportionallyResize();
				}
			}

			$( "body" ).css( "cursor", "auto" );

			this._removeClass( "ui-resizable-resizing" );

			this._propagate( "stop", event );

			if ( this._helper ) {
				this.helper.remove();
			}

			return false;

		},

		_updatePrevProperties: function() {
			this.prevPosition = {
				top: this.position.top,
				left: this.position.left
			};
			this.prevSize = {
				width: this.size.width,
				height: this.size.height
			};
		},

		_applyChanges: function() {
			var props = {};

			if ( this.position.top !== this.prevPosition.top ) {
				props.top = this.position.top + "px";
			}
			if ( this.position.left !== this.prevPosition.left ) {
				props.left = this.position.left + "px";
			}
			if ( this.size.width !== this.prevSize.width ) {
				props.width = this.size.width + "px";
			}
			if ( this.size.height !== this.prevSize.height ) {
				props.height = this.size.height + "px";
			}

			this.helper.css( props );

			return props;
		},

		_updateVirtualBoundaries: function( forceAspectRatio ) {
			var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
				o = this.options;

			b = {
				minWidth: this._isNumber( o.minWidth ) ? o.minWidth : 0,
				maxWidth: this._isNumber( o.maxWidth ) ? o.maxWidth : Infinity,
				minHeight: this._isNumber( o.minHeight ) ? o.minHeight : 0,
				maxHeight: this._isNumber( o.maxHeight ) ? o.maxHeight : Infinity
			};

			if ( this._aspectRatio || forceAspectRatio ) {
				pMinWidth = b.minHeight * this.aspectRatio;
				pMinHeight = b.minWidth / this.aspectRatio;
				pMaxWidth = b.maxHeight * this.aspectRatio;
				pMaxHeight = b.maxWidth / this.aspectRatio;

				if ( pMinWidth > b.minWidth ) {
					b.minWidth = pMinWidth;
				}
				if ( pMinHeight > b.minHeight ) {
					b.minHeight = pMinHeight;
				}
				if ( pMaxWidth < b.maxWidth ) {
					b.maxWidth = pMaxWidth;
				}
				if ( pMaxHeight < b.maxHeight ) {
					b.maxHeight = pMaxHeight;
				}
			}
			this._vBoundaries = b;
		},

		_updateCache: function( data ) {
			this.offset = this.helper.offset();
			if ( this._isNumber( data.left ) ) {
				this.position.left = data.left;
			}
			if ( this._isNumber( data.top ) ) {
				this.position.top = data.top;
			}
			if ( this._isNumber( data.height ) ) {
				this.size.height = data.height;
			}
			if ( this._isNumber( data.width ) ) {
				this.size.width = data.width;
			}
		},

		_updateRatio: function( data ) {

			var cpos = this.position,
				csize = this.size,
				a = this.axis;

			if ( this._isNumber( data.height ) ) {
				data.width = ( data.height * this.aspectRatio );
			} else if ( this._isNumber( data.width ) ) {
				data.height = ( data.width / this.aspectRatio );
			}

			if ( a === "sw" ) {
				data.left = cpos.left + ( csize.width - data.width );
				data.top = null;
			}
			if ( a === "nw" ) {
				data.top = cpos.top + ( csize.height - data.height );
				data.left = cpos.left + ( csize.width - data.width );
			}

			return data;
		},

		_respectSize: function( data ) {

			var o = this._vBoundaries,
				a = this.axis,
				ismaxw = this._isNumber( data.width ) && o.maxWidth && ( o.maxWidth < data.width ),
				ismaxh = this._isNumber( data.height ) && o.maxHeight && ( o.maxHeight < data.height ),
				isminw = this._isNumber( data.width ) && o.minWidth && ( o.minWidth > data.width ),
				isminh = this._isNumber( data.height ) && o.minHeight && ( o.minHeight > data.height ),
				dw = this.originalPosition.left + this.originalSize.width,
				dh = this.originalPosition.top + this.originalSize.height,
				cw = /sw|nw|w/.test( a ), ch = /nw|ne|n/.test( a );
			if ( isminw ) {
				data.width = o.minWidth;
			}
			if ( isminh ) {
				data.height = o.minHeight;
			}
			if ( ismaxw ) {
				data.width = o.maxWidth;
			}
			if ( ismaxh ) {
				data.height = o.maxHeight;
			}

			if ( isminw && cw ) {
				data.left = dw - o.minWidth;
			}
			if ( ismaxw && cw ) {
				data.left = dw - o.maxWidth;
			}
			if ( isminh && ch ) {
				data.top = dh - o.minHeight;
			}
			if ( ismaxh && ch ) {
				data.top = dh - o.maxHeight;
			}

			// Fixing jump error on top/left - bug #2330
			if ( !data.width && !data.height && !data.left && data.top ) {
				data.top = null;
			} else if ( !data.width && !data.height && !data.top && data.left ) {
				data.left = null;
			}

			return data;
		},

		_getPaddingPlusBorderDimensions: function( element ) {
			var i = 0,
				widths = [],
				borders = [
					element.css( "borderTopWidth" ),
					element.css( "borderRightWidth" ),
					element.css( "borderBottomWidth" ),
					element.css( "borderLeftWidth" )
				],
				paddings = [
					element.css( "paddingTop" ),
					element.css( "paddingRight" ),
					element.css( "paddingBottom" ),
					element.css( "paddingLeft" )
				];

			for ( ; i < 4; i++ ) {
				widths[ i ] = ( parseFloat( borders[ i ] ) || 0 );
				widths[ i ] += ( parseFloat( paddings[ i ] ) || 0 );
			}

			return {
				height: widths[ 0 ] + widths[ 2 ],
				width: widths[ 1 ] + widths[ 3 ]
			};
		},

		_proportionallyResize: function() {

			if ( !this._proportionallyResizeElements.length ) {
				return;
			}

			var prel,
				i = 0,
				element = this.helper || this.element;

			for ( ; i < this._proportionallyResizeElements.length; i++ ) {

				prel = this._proportionallyResizeElements[ i ];

				// TODO: Seems like a bug to cache this.outerDimensions
				// considering that we are in a loop.
				if ( !this.outerDimensions ) {
					this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
				}

				prel.css( {
					height: ( element.height() - this.outerDimensions.height ) || 0,
					width: ( element.width() - this.outerDimensions.width ) || 0
				} );

			}

		},

		_renderProxy: function() {

			var el = this.element, o = this.options;
			this.elementOffset = el.offset();

			if ( this._helper ) {

				this.helper = this.helper || $( "<div style='overflow:hidden;'></div>" );

				this._addClass( this.helper, this._helper );
				this.helper.css( {
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					position: "absolute",
					left: this.elementOffset.left + "px",
					top: this.elementOffset.top + "px",
					zIndex: ++o.zIndex //TODO: Don't modify option
				} );

				this.helper
					.appendTo( "body" )
					.disableSelection();

			} else {
				this.helper = this.element;
			}

		},

		_change: {
			e: function( event, dx ) {
				return { width: this.originalSize.width + dx };
			},
			w: function( event, dx ) {
				var cs = this.originalSize, sp = this.originalPosition;
				return { left: sp.left + dx, width: cs.width - dx };
			},
			n: function( event, dx, dy ) {
				var cs = this.originalSize, sp = this.originalPosition;
				return { top: sp.top + dy, height: cs.height - dy };
			},
			s: function( event, dx, dy ) {
				return { height: this.originalSize.height + dy };
			},
			se: function( event, dx, dy ) {
				return langx.extend( this._change.s.apply( this, arguments ),
					this._change.e.apply( this, [ event, dx, dy ] ) );
			},
			sw: function( event, dx, dy ) {
				return langx.extend( this._change.s.apply( this, arguments ),
					this._change.w.apply( this, [ event, dx, dy ] ) );
			},
			ne: function( event, dx, dy ) {
				return langx.extend( this._change.n.apply( this, arguments ),
					this._change.e.apply( this, [ event, dx, dy ] ) );
			},
			nw: function( event, dx, dy ) {
				return langx.extend( this._change.n.apply( this, arguments ),
					this._change.w.apply( this, [ event, dx, dy ] ) );
			}
		},

		_propagate: function( n, event ) {
			patch.call( this, n, [ event, this.ui(), this ], true );
			//$.ui.plugin.call( this, n, [ event, this.ui() ] );
			( n !== "resize" && this._trigger( n, event, this.ui() ) );
		},

		patches: {},

		ui: function() {
			return {
				originalElement: this.originalElement,
				element: this.element,
				helper: this.helper,
				position: this.position,
				size: this.size,
				originalSize: this.originalSize,
				originalPosition: this.originalPosition
			};
		}

	} );

	/*
	 * Resizable Extensions
	 */

	patch.add(Resizable, "animate", {

		stop: function( event ) {
			var that = $( this ).resizable( "instance" ),
				o = that.options,
				pr = that._proportionallyResizeElements,
				ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName ),
				soffseth = ista && that._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height,
				soffsetw = ista ? 0 : that.sizeDiff.width,
				style = {
					width: ( that.size.width - soffsetw ),
					height: ( that.size.height - soffseth )
				},
				left = ( parseFloat( that.element.css( "left" ) ) +
					( that.position.left - that.originalPosition.left ) ) || null,
				top = ( parseFloat( that.element.css( "top" ) ) +
					( that.position.top - that.originalPosition.top ) ) || null;

			that.element.animate(
				langx.extend( style, top && left ? { top: top, left: left } : {} ), {
					duration: o.animateDuration,
					easing: o.animateEasing,
					step: function() {

						var data = {
							width: parseFloat( that.element.css( "width" ) ),
							height: parseFloat( that.element.css( "height" ) ),
							top: parseFloat( that.element.css( "top" ) ),
							left: parseFloat( that.element.css( "left" ) )
						};

						if ( pr && pr.length ) {
							$( pr[ 0 ] ).css( { width: data.width, height: data.height } );
						}

						// Propagating resize, and updating values for each animation step
						that._updateCache( data );
						that._propagate( "resize", event );

					}
				}
			);
		}

	} );

	patch.add(Resizable, "containment", {

		start: function() {
			var element, p, co, ch, cw, width, height,
				that = $( this ).resizable( "instance" ),
				o = that.options,
				el = that.element,
				oc = o.containment,
				ce = ( oc instanceof $ ) ?
					oc.get( 0 ) :
					( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

			if ( !ce ) {
				return;
			}

			that.containerElement = $( ce );

			if ( /document/.test( oc ) || oc === document ) {
				that.containerOffset = {
					left: 0,
					top: 0
				};
				that.containerPosition = {
					left: 0,
					top: 0
				};

				that.parentData = {
					element: $( document ),
					left: 0,
					top: 0,
					width: $( document ).width(),
					height: $( document ).height() || document.body.parentNode.scrollHeight
				};
			} else {
				element = $( ce );
				p = [];
				$( [ "Top", "Right", "Left", "Bottom" ] ).each( function( i, name ) {
					p[ i ] = that._num( element.css( "padding" + name ) );
				} );

				that.containerOffset = element.offset();
				that.containerPosition = element.position();
				that.containerSize = {
					height: ( element.innerHeight() - p[ 3 ] ),
					width: ( element.innerWidth() - p[ 1 ] )
				};

				co = that.containerOffset;
				ch = that.containerSize.height;
				cw = that.containerSize.width;
				width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
				height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

				that.parentData = {
					element: ce,
					left: co.left,
					top: co.top,
					width: width,
					height: height
				};
			}
		},

		resize: function( event ) {
			var woset, hoset, isParent, isOffsetRelative,
				that = $( this ).resizable( "instance" ),
				o = that.options,
				co = that.containerOffset,
				cp = that.position,
				pRatio = that._aspectRatio || event.shiftKey,
				cop = {
					top: 0,
					left: 0
				},
				ce = that.containerElement,
				continueResize = true;

			if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
				cop = co;
			}

			if ( cp.left < ( that._helper ? co.left : 0 ) ) {
				that.size.width = that.size.width +
					( that._helper ?
						( that.position.left - co.left ) :
						( that.position.left - cop.left ) );

				if ( pRatio ) {
					that.size.height = that.size.width / that.aspectRatio;
					continueResize = false;
				}
				that.position.left = o.helper ? co.left : 0;
			}

			if ( cp.top < ( that._helper ? co.top : 0 ) ) {
				that.size.height = that.size.height +
					( that._helper ?
						( that.position.top - co.top ) :
						that.position.top );

				if ( pRatio ) {
					that.size.width = that.size.height * that.aspectRatio;
					continueResize = false;
				}
				that.position.top = that._helper ? co.top : 0;
			}

			isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
			isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

			if ( isParent && isOffsetRelative ) {
				that.offset.left = that.parentData.left + that.position.left;
				that.offset.top = that.parentData.top + that.position.top;
			} else {
				that.offset.left = that.element.offset().left;
				that.offset.top = that.element.offset().top;
			}

			woset = Math.abs( that.sizeDiff.width +
				( that._helper ?
					that.offset.left - cop.left :
					( that.offset.left - co.left ) ) );

			hoset = Math.abs( that.sizeDiff.height +
				( that._helper ?
					that.offset.top - cop.top :
					( that.offset.top - co.top ) ) );

			if ( woset + that.size.width >= that.parentData.width ) {
				that.size.width = that.parentData.width - woset;
				if ( pRatio ) {
					that.size.height = that.size.width / that.aspectRatio;
					continueResize = false;
				}
			}

			if ( hoset + that.size.height >= that.parentData.height ) {
				that.size.height = that.parentData.height - hoset;
				if ( pRatio ) {
					that.size.width = that.size.height * that.aspectRatio;
					continueResize = false;
				}
			}

			if ( !continueResize ) {
				that.position.left = that.prevPosition.left;
				that.position.top = that.prevPosition.top;
				that.size.width = that.prevSize.width;
				that.size.height = that.prevSize.height;
			}
		},

		stop: function() {
			var that = $( this ).resizable( "instance" ),
				o = that.options,
				co = that.containerOffset,
				cop = that.containerPosition,
				ce = that.containerElement,
				helper = $( that.helper ),
				ho = helper.offset(),
				w = helper.outerWidth() - that.sizeDiff.width,
				h = helper.outerHeight() - that.sizeDiff.height;

			if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
				$( this ).css( {
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				} );
			}

			if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
				$( this ).css( {
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				} );
			}
		}
	} );

	patch.add(Resizable, "alsoResize", {

		start: function() {
			var that = $( this ).resizable( "instance" ),
				o = that.options;

			$( o.alsoResize ).each( function() {
				var el = $( this );
				el.data( "ui-resizable-alsoresize", {
					width: parseFloat( el.width() ), height: parseFloat( el.height() ),
					left: parseFloat( el.css( "left" ) ), top: parseFloat( el.css( "top" ) )
				} );
			} );
		},

		resize: function( event, ui ) {
			var that = $( this ).resizable( "instance" ),
				o = that.options,
				os = that.originalSize,
				op = that.originalPosition,
				delta = {
					height: ( that.size.height - os.height ) || 0,
					width: ( that.size.width - os.width ) || 0,
					top: ( that.position.top - op.top ) || 0,
					left: ( that.position.left - op.left ) || 0
				};

				$( o.alsoResize ).each( function() {
					var el = $( this ), start = $( this ).data( "ui-resizable-alsoresize" ), style = {},
						css = el.parents( ui.originalElement[ 0 ] ).length ?
								[ "width", "height" ] :
								[ "width", "height", "top", "left" ];

					langx.each( css, function( i, prop ) {
						var sum = ( start[ prop ] || 0 ) + ( delta[ prop ] || 0 );
						if ( sum && sum >= 0 ) {
							style[ prop ] = sum || null;
						}
					} );

					el.css( style );
				} );
		},

		stop: function() {
			$( this ).removeData( "ui-resizable-alsoresize" );
		}
	} );

	patch.add(Resizable, "ghost", {

		start: function() {

			var that = $( this ).resizable( "instance" ), cs = that.size;

			that.ghost = that.originalElement.clone();
			that.ghost.css( {
				opacity: 0.25,
				display: "block",
				position: "relative",
				height: cs.height,
				width: cs.width,
				margin: 0,
				left: 0,
				top: 0
			} );

			that._addClass( that.ghost, "ui-resizable-ghost" );

			// DEPRECATED
			// TODO: remove after 1.12
			/*
			if ( $.uiBackCompat !== false && typeof that.options.ghost === "string" ) {

				// Ghost option
				that.ghost.addClass( this.options.ghost );
			}
			*/

			that.ghost.appendTo( that.helper );

		},

		resize: function() {
			var that = $( this ).resizable( "instance" );
			if ( that.ghost ) {
				that.ghost.css( {
					position: "relative",
					height: that.size.height,
					width: that.size.width
				} );
			}
		},

		stop: function() {
			var that = $( this ).resizable( "instance" );
			if ( that.ghost && that.helper ) {
				that.helper.get( 0 ).removeChild( that.ghost.get( 0 ) );
			}
		}

	} );

	patch.add(Resizable, "grid", {

		resize: function() {
			var outerDimensions,
				that = $( this ).resizable( "instance" ),
				o = that.options,
				cs = that.size,
				os = that.originalSize,
				op = that.originalPosition,
				a = that.axis,
				grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
				gridX = ( grid[ 0 ] || 1 ),
				gridY = ( grid[ 1 ] || 1 ),
				ox = Math.round( ( cs.width - os.width ) / gridX ) * gridX,
				oy = Math.round( ( cs.height - os.height ) / gridY ) * gridY,
				newWidth = os.width + ox,
				newHeight = os.height + oy,
				isMaxWidth = o.maxWidth && ( o.maxWidth < newWidth ),
				isMaxHeight = o.maxHeight && ( o.maxHeight < newHeight ),
				isMinWidth = o.minWidth && ( o.minWidth > newWidth ),
				isMinHeight = o.minHeight && ( o.minHeight > newHeight );

			o.grid = grid;

			if ( isMinWidth ) {
				newWidth += gridX;
			}
			if ( isMinHeight ) {
				newHeight += gridY;
			}
			if ( isMaxWidth ) {
				newWidth -= gridX;
			}
			if ( isMaxHeight ) {
				newHeight -= gridY;
			}

			if ( /^(se|s|e)$/.test( a ) ) {
				that.size.width = newWidth;
				that.size.height = newHeight;
			} else if ( /^(ne)$/.test( a ) ) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else if ( /^(sw)$/.test( a ) ) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.left = op.left - ox;
			} else {
				if ( newHeight - gridY <= 0 || newWidth - gridX <= 0 ) {
					outerDimensions = that._getPaddingPlusBorderDimensions( this );
				}

				if ( newHeight - gridY > 0 ) {
					that.size.height = newHeight;
					that.position.top = op.top - oy;
				} else {
					newHeight = gridY - outerDimensions.height;
					that.size.height = newHeight;
					that.position.top = op.top + os.height - newHeight;
				}
				if ( newWidth - gridX > 0 ) {
					that.size.width = newWidth;
					that.position.left = op.left - ox;
				} else {
					newWidth = gridX - outerDimensions.width;
					that.size.width = newWidth;
					that.position.left = op.left + os.width - newWidth;
				}
			}
		}

	} );

	plugins.register(Resizable,"resizable");

	return Resizable;

});

define( 'skylark-jqueryui-interact/Selectable',[
	"skylark-langx/langx",
	"skylark-domx-data",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"./Mouse"
],function(langx, datax, eventer, noder, $, plugins, Mouse) {

	var Selectable = Mouse.inherit({
		klassName: "Selectable",

		pluginName : "ui.selectable",

		options: {
			appendTo: "body",
			autoRefresh: true,
			distance: 0,
			filter: "*",
			tolerance: "touch",

			// Callbacks
			selected: null,
			selecting: null,
			start: null,
			stop: null,
			unselected: null,
			unselecting: null
		},
		_create: function() {
			var that = this;

			this._addClass( "ui-selectable" );

			this.dragged = false;

			// Cache selectee children based on filter
			this.refresh = function() {
				that.elementPos = $( that.element[ 0 ] ).offset();
				that.selectees = $( that.options.filter, that.element[ 0 ] );
				that._addClass( that.selectees, "ui-selectee" );
				that.selectees.each( function() {
					var $this = $( this ),
						selecteeOffset = $this.offset(),
						pos = {
							left: selecteeOffset.left - that.elementPos.left,
							top: selecteeOffset.top - that.elementPos.top
						};
					datax.data( this, "selectable-item", {
						element: this,
						$element: $this,
						left: pos.left,
						top: pos.top,
						right: pos.left + $this.outerWidth(),
						bottom: pos.top + $this.outerHeight(),
						startselected: false,
						selected: $this.hasClass( "ui-selected" ),
						selecting: $this.hasClass( "ui-selecting" ),
						unselecting: $this.hasClass( "ui-unselecting" )
					} );
				} );
			};
			this.refresh();

			this._mouseInit();

			this.helper = $( "<div>" );
			this._addClass( this.helper, "ui-selectable-helper" );
		},

		_destroy: function() {
			this.selectees.removeData( "selectable-item" );
			this._mouseDestroy();
		},

		_mouseStart: function( event ) {
			var that = this,
				options = this.options;

			this.opos = [ event.pageX, event.pageY ];
			this.elementPos = $( this.element[ 0 ] ).offset();

			if ( this.options.disabled ) {
				return;
			}

			this.selectees = $( options.filter, this.element[ 0 ] );

			this._trigger( "start", event );

			$( options.appendTo ).append( this.helper );

			// position helper (lasso)
			this.helper.css( {
				"left": event.pageX,
				"top": event.pageY,
				"width": 0,
				"height": 0
			} );

			if ( options.autoRefresh ) {
				this.refresh();
			}

			this.selectees.filter( ".ui-selected" ).each( function() {
				var selectee = datax.data( this, "selectable-item" );
				selectee.startselected = true;
				if ( !event.metaKey && !event.ctrlKey ) {
					that._removeClass( selectee.$element, "ui-selected" );
					selectee.selected = false;
					that._addClass( selectee.$element, "ui-unselecting" );
					selectee.unselecting = true;

					// selectable UNSELECTING callback
					that._trigger( "unselecting", event, {
						unselecting: selectee.element
					} );
				}
			} );

			$( event.target ).parents().addBack().each( function() {
				var doSelect,
					selectee = datax.data( this, "selectable-item" );
				if ( selectee ) {
					doSelect = ( !event.metaKey && !event.ctrlKey ) ||
						!selectee.$element.hasClass( "ui-selected" );
					that._removeClass( selectee.$element, doSelect ? "ui-unselecting" : "ui-selected" )
						._addClass( selectee.$element, doSelect ? "ui-selecting" : "ui-unselecting" );
					selectee.unselecting = !doSelect;
					selectee.selecting = doSelect;
					selectee.selected = doSelect;

					// selectable (UN)SELECTING callback
					if ( doSelect ) {
						that._trigger( "selecting", event, {
							selecting: selectee.element
						} );
					} else {
						that._trigger( "unselecting", event, {
							unselecting: selectee.element
						} );
					}
					return false;
				}
			} );

		},

		_mouseDrag: function( event ) {

			this.dragged = true;

			if ( this.options.disabled ) {
				return;
			}

			var tmp,
				that = this,
				options = this.options,
				x1 = this.opos[ 0 ],
				y1 = this.opos[ 1 ],
				x2 = event.pageX,
				y2 = event.pageY;

			if ( x1 > x2 ) { tmp = x2; x2 = x1; x1 = tmp; }
			if ( y1 > y2 ) { tmp = y2; y2 = y1; y1 = tmp; }
			this.helper.css( { left: x1, top: y1, width: x2 - x1, height: y2 - y1 } );

			this.selectees.each( function() {
				var selectee = datax.data( this, "selectable-item" ),
					hit = false,
					offset = {};

				//prevent helper from being selected if appendTo: selectable
				if ( !selectee || selectee.element === that.element[ 0 ] ) {
					return;
				}

				offset.left   = selectee.left   + that.elementPos.left;
				offset.right  = selectee.right  + that.elementPos.left;
				offset.top    = selectee.top    + that.elementPos.top;
				offset.bottom = selectee.bottom + that.elementPos.top;

				if ( options.tolerance === "touch" ) {
					hit = ( !( offset.left > x2 || offset.right < x1 || offset.top > y2 ||
	                    offset.bottom < y1 ) );
				} else if ( options.tolerance === "fit" ) {
					hit = ( offset.left > x1 && offset.right < x2 && offset.top > y1 &&
	                    offset.bottom < y2 );
				}

				if ( hit ) {

					// SELECT
					if ( selectee.selected ) {
						that._removeClass( selectee.$element, "ui-selected" );
						selectee.selected = false;
					}
					if ( selectee.unselecting ) {
						that._removeClass( selectee.$element, "ui-unselecting" );
						selectee.unselecting = false;
					}
					if ( !selectee.selecting ) {
						that._addClass( selectee.$element, "ui-selecting" );
						selectee.selecting = true;

						// selectable SELECTING callback
						that._trigger( "selecting", event, {
							selecting: selectee.element
						} );
					}
				} else {

					// UNSELECT
					if ( selectee.selecting ) {
						if ( ( event.metaKey || event.ctrlKey ) && selectee.startselected ) {
							that._removeClass( selectee.$element, "ui-selecting" );
							selectee.selecting = false;
							that._addClass( selectee.$element, "ui-selected" );
							selectee.selected = true;
						} else {
							that._removeClass( selectee.$element, "ui-selecting" );
							selectee.selecting = false;
							if ( selectee.startselected ) {
								that._addClass( selectee.$element, "ui-unselecting" );
								selectee.unselecting = true;
							}

							// selectable UNSELECTING callback
							that._trigger( "unselecting", event, {
								unselecting: selectee.element
							} );
						}
					}
					if ( selectee.selected ) {
						if ( !event.metaKey && !event.ctrlKey && !selectee.startselected ) {
							that._removeClass( selectee.$element, "ui-selected" );
							selectee.selected = false;

							that._addClass( selectee.$element, "ui-unselecting" );
							selectee.unselecting = true;

							// selectable UNSELECTING callback
							that._trigger( "unselecting", event, {
								unselecting: selectee.element
							} );
						}
					}
				}
			} );

			return false;
		},

		_mouseStop: function( event ) {
			var that = this;

			this.dragged = false;

			$( ".ui-unselecting", this.element[ 0 ] ).each( function() {
				var selectee = datax.data( this, "selectable-item" );
				that._removeClass( selectee.$element, "ui-unselecting" );
				selectee.unselecting = false;
				selectee.startselected = false;
				that._trigger( "unselected", event, {
					unselected: selectee.element
				} );
			} );
			$( ".ui-selecting", this.element[ 0 ] ).each( function() {
				var selectee = datax.data( this, "selectable-item" );
				that._removeClass( selectee.$element, "ui-selecting" )
					._addClass( selectee.$element, "ui-selected" );
				selectee.selecting = false;
				selectee.selected = true;
				selectee.startselected = true;
				that._trigger( "selected", event, {
					selected: selectee.element
				} );
			} );
			this._trigger( "stop", event );

			this.helper.remove();

			return false;
		}

	} );


	plugins.register(Selectable,"selectable");

	return Selectable;

});

define( 'skylark-jqueryui-interact/Sortable',[
	"skylark-langx/langx",
	"skylark-domx-data",
	"skylark-domx-eventer",
	"skylark-domx-noder",
	"skylark-domx-query",
	"skylark-domx-plugins",
	"./Mouse",
	"./ddmanager",
],function(langx, datax, eventer, noder, $, plugins, Mouse, ddmanager) {

	var Sortable = Mouse.inherit({
		klassName: "Sortable",

		pluginName : "ui.sortable",

		widgetEventPrefix: "sort",
		ready: false,
		options: {
			appendTo: "parent",
			axis: false,
			connectWith: false,
			containment: false,
			cursor: "auto",
			cursorAt: false,
			dropOnEmpty: true,
			forcePlaceholderSize: false,
			forceHelperSize: false,
			grid: false,
			handle: false,
			helper: "original",
			items: "> *",
			opacity: false,
			placeholder: false,
			revert: false,
			scroll: true,
			scrollSensitivity: 20,
			scrollSpeed: 20,
			scope: "default",
			tolerance: "intersect",
			zIndex: 1000,

			// Callbacks
			activate: null,
			beforeStop: null,
			change: null,
			deactivate: null,
			out: null,
			over: null,
			receive: null,
			remove: null,
			sort: null,
			start: null,
			stop: null,
			update: null
		},

		_isOverAxis: function( x, reference, size ) {
			return ( x >= reference ) && ( x < ( reference + size ) );
		},

		_isFloating: function( item ) {
			return ( /left|right/ ).test( item.css( "float" ) ) ||
				( /inline|table-cell/ ).test( item.css( "display" ) );
		},

		_create: function() {
			this.containerCache = {};
			this._addClass( "ui-sortable" );

			//Get the items
			this.refresh();

			//Let's determine the parent's offset
			this.offset = this.element.offset();

			//Initialize mouse events for interaction
			this._mouseInit();

			this._setHandleClassName();

			//We're ready to go
			this.ready = true;

		},

		_setOption: function( key, value ) {
			this._super( key, value );

			if ( key === "handle" ) {
				this._setHandleClassName();
			}
		},

		_setHandleClassName: function() {
			var that = this;
			this._removeClass( this.element.find( ".ui-sortable-handle" ), "ui-sortable-handle" );
			langx.each( this.items, function() {
				that._addClass(
					this.instance.options.handle ?
						this.item.find( this.instance.options.handle ) :
						this.item,
					"ui-sortable-handle"
				);
			} );
		},

		_destroy: function() {
			this._mouseDestroy();

			for ( var i = this.items.length - 1; i >= 0; i-- ) {
				this.items[ i ].item.removeData( this.pluginName + "-item" );
			}

			return this;
		},

		_mouseCapture: function( event, overrideHandle ) {
			var currentItem = null,
				validHandle = false,
				that = this;

			if ( this.reverting ) {
				return false;
			}

			if ( this.options.disabled || this.options.type === "static" ) {
				return false;
			}

			//We have to refresh the items data once first
			this._refreshItems( event );

			//Find out if the clicked node (or one of its parents) is a actual item in this.items
			$( event.target ).parents().each( function() {
				if ( datax.data( this, that.pluginName + "-item" ) === that ) {
					currentItem = $( this );
					return false;
				}
			} );
			if ( datax.data( event.target, that.pluginName + "-item" ) === that ) {
				currentItem = $( event.target );
			}

			if ( !currentItem ) {
				return false;
			}
			if ( this.options.handle && !overrideHandle ) {
				$( this.options.handle, currentItem ).find( "*" ).addBack().each( function() {
					if ( this === event.target ) {
						validHandle = true;
					}
				} );
				if ( !validHandle ) {
					return false;
				}
			}

			this.currentItem = currentItem;
			this._removeCurrentsFromItems();
			return true;

		},

		_mouseStart: function( event, overrideHandle, noActivation ) {

			var i, body,
				o = this.options;

			this.currentContainer = this;

			//We only need to call refreshPositions, because the refreshItems call has been moved to
			// mouseCapture
			this.refreshPositions();

			//Prepare the dragged items parent
			this.appendTo = $( o.appendTo !== "parent" ?
					o.appendTo :
					this.currentItem.parent() );

			//Create and append the visible helper
			this.helper = this._createHelper( event );

			//Cache the helper size
			this._cacheHelperProportions();

			/*
			 * - Position generation -
			 * This block generates everything position related - it's the core of draggables.
			 */

			//Cache the margins of the original element
			this._cacheMargins();

			//The element's absolute position on the page minus margins
			this.offset = this.currentItem.offset();
			this.offset = {
				top: this.offset.top - this.margins.top,
				left: this.offset.left - this.margins.left
			};

			langx.extend( this.offset, {
				click: { //Where the click happened, relative to the element
					left: event.pageX - this.offset.left,
					top: event.pageY - this.offset.top
				},

				// This is a relative to absolute position minus the actual position calculation -
				// only used for relative positioned helper
				relative: this._getRelativeOffset()
			} );

			// After we get the helper offset, but before we get the parent offset we can
			// change the helper's position to absolute
			// TODO: Still need to figure out a way to make relative sorting possible
			this.helper.css( "position", "absolute" );
			this.cssPosition = this.helper.css( "position" );

			//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
			( o.cursorAt && this._adjustOffsetFromHelper( o.cursorAt ) );

			//Cache the former DOM position
			this.domPosition = {
				prev: this.currentItem.prev()[ 0 ],
				parent: this.currentItem.parent()[ 0 ]
			};

			// If the helper is not the original, hide the original so it's not playing any role during
			// the drag, won't cause anything bad this way
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.currentItem.hide();
			}

			//Create the placeholder
			this._createPlaceholder();

			//Get the next scrolling parent
			this.scrollParent = this.placeholder.scrollParent();

			langx.extend( this.offset, {
				parent: this._getParentOffset()
			} );

			//Set a containment if given in the options
			if ( o.containment ) {
				this._setContainment();
			}

			if ( o.cursor && o.cursor !== "auto" ) { // cursor option
				body = this.document.find( "body" );

				// Support: IE
				this.storedCursor = body.css( "cursor" );
				body.css( "cursor", o.cursor );

				this.storedStylesheet =
					$( "<style>*{ cursor: " + o.cursor + " !important; }</style>" ).appendTo( body );
			}

			// We need to make sure to grab the zIndex before setting the
			// opacity, because setting the opacity to anything lower than 1
			// causes the zIndex to change from "auto" to 0.
			if ( o.zIndex ) { // zIndex option
				if ( this.helper.css( "zIndex" ) ) {
					this._storedZIndex = this.helper.css( "zIndex" );
				}
				this.helper.css( "zIndex", o.zIndex );
			}

			if ( o.opacity ) { // opacity option
				if ( this.helper.css( "opacity" ) ) {
					this._storedOpacity = this.helper.css( "opacity" );
				}
				this.helper.css( "opacity", o.opacity );
			}

			//Prepare scrolling
			if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					this.scrollParent[ 0 ].tagName !== "HTML" ) {
				this.overflowOffset = this.scrollParent.offset();
			}

			//Call callbacks
			this._trigger( "start", event, this._uiHash() );

			//Recache the helper size
			if ( !this._preserveHelperProportions ) {
				this._cacheHelperProportions();
			}

			//Post "activate" events to possible containers
			if ( !noActivation ) {
				for ( i = this.containers.length - 1; i >= 0; i-- ) {
					this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
				}
			}

			//Prepare possible droppables
			if ( ddmanager ) {
				ddmanager.current = this;
			}

			if ( ddmanager && !o.dropBehaviour ) {
				ddmanager.prepareOffsets( this, event );
			}

			this.dragging = true;

			this._addClass( this.helper, "ui-sortable-helper" );

			//Move the helper, if needed
			if ( !this.helper.parent().is( this.appendTo ) ) {
				this.helper.detach().appendTo( this.appendTo );

				//Update position
				this.offset.parent = this._getParentOffset();
			}

			//Generate the original position
			this.position = this.originalPosition = this._generatePosition( event );
			this.originalPageX = event.pageX;
			this.originalPageY = event.pageY;
			this.lastPositionAbs = this.positionAbs = this._convertPositionTo( "absolute" );

			this._mouseDrag( event );

			return true;

		},

		_scroll: function( event ) {
			var o = this.options,
				scrolled = false;

			if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					this.scrollParent[ 0 ].tagName !== "HTML" ) {

				if ( ( this.overflowOffset.top + this.scrollParent[ 0 ].offsetHeight ) -
						event.pageY < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollTop =
						scrolled = this.scrollParent[ 0 ].scrollTop + o.scrollSpeed;
				} else if ( event.pageY - this.overflowOffset.top < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollTop =
						scrolled = this.scrollParent[ 0 ].scrollTop - o.scrollSpeed;
				}

				if ( ( this.overflowOffset.left + this.scrollParent[ 0 ].offsetWidth ) -
						event.pageX < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollLeft = scrolled =
						this.scrollParent[ 0 ].scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - this.overflowOffset.left < o.scrollSensitivity ) {
					this.scrollParent[ 0 ].scrollLeft = scrolled =
						this.scrollParent[ 0 ].scrollLeft - o.scrollSpeed;
				}

			} else {

				if ( event.pageY - this.document.scrollTop() < o.scrollSensitivity ) {
					scrolled = this.document.scrollTop( this.document.scrollTop() - o.scrollSpeed );
				} else if ( this.window.height() - ( event.pageY - this.document.scrollTop() ) <
						o.scrollSensitivity ) {
					scrolled = this.document.scrollTop( this.document.scrollTop() + o.scrollSpeed );
				}

				if ( event.pageX - this.document.scrollLeft() < o.scrollSensitivity ) {
					scrolled = this.document.scrollLeft(
						this.document.scrollLeft() - o.scrollSpeed
					);
				} else if ( this.window.width() - ( event.pageX - this.document.scrollLeft() ) <
						o.scrollSensitivity ) {
					scrolled = this.document.scrollLeft(
						this.document.scrollLeft() + o.scrollSpeed
					);
				}

			}

			return scrolled;
		},

		_mouseDrag: function( event ) {
			var i, item, itemElement, intersection,
				o = this.options;

			//Compute the helpers position
			this.position = this._generatePosition( event );
			this.positionAbs = this._convertPositionTo( "absolute" );

			//Set the helper position
			if ( !this.options.axis || this.options.axis !== "y" ) {
				this.helper[ 0 ].style.left = this.position.left + "px";
			}
			if ( !this.options.axis || this.options.axis !== "x" ) {
				this.helper[ 0 ].style.top = this.position.top + "px";
			}

			//Post events to containers
			this._contactContainers( event );

			if ( this.innermostContainer !== null ) {

				//Do scrolling
				if ( o.scroll ) {
					if ( this._scroll( event ) !== false ) {

						//Update item positions used in position checks
						this._refreshItemPositions( true );

						if ( ddmanager && !o.dropBehaviour ) {
							ddmanager.prepareOffsets( this, event );
						}
					}
				}

				this.dragDirection = {
					vertical: this._getDragVerticalDirection(),
					horizontal: this._getDragHorizontalDirection()
				};

				//Rearrange
				for ( i = this.items.length - 1; i >= 0; i-- ) {

					//Cache variables and intersection, continue if no intersection
					item = this.items[ i ];
					itemElement = item.item[ 0 ];
					intersection = this._intersectsWithPointer( item );
					if ( !intersection ) {
						continue;
					}

					// Only put the placeholder inside the current Container, skip all
					// items from other containers. This works because when moving
					// an item from one container to another the
					// currentContainer is switched before the placeholder is moved.
					//
					// Without this, moving items in "sub-sortables" can cause
					// the placeholder to jitter between the outer and inner container.
					if ( item.instance !== this.currentContainer ) {
						continue;
					}

					// Cannot intersect with itself
					// no useless actions that have been done before
					// no action if the item moved is the parent of the item checked
					if ( itemElement !== this.currentItem[ 0 ] &&
						this.placeholder[ intersection === 1 ?
						"next" : "prev" ]()[ 0 ] !== itemElement &&
						!noder.contains( this.placeholder[ 0 ], itemElement ) &&
						( this.options.type === "semi-dynamic" ?
							!noder.contains( this.element[ 0 ], itemElement ) :
							true
						)
					) {

						this.direction = intersection === 1 ? "down" : "up";

						if ( this.options.tolerance === "pointer" ||
								this._intersectsWithSides( item ) ) {
							this._rearrange( event, item );
						} else {
							break;
						}

						this._trigger( "change", event, this._uiHash() );
						break;
					}
				}
			}

			//Interconnect with droppables
			if ( ddmanager ) {
				ddmanager.drag( this, event );
			}

			//Call callbacks
			this._trigger( "sort", event, this._uiHash() );

			this.lastPositionAbs = this.positionAbs;
			return false;

		},

		_mouseStop: function( event, noPropagation ) {

			if ( !event ) {
				return;
			}

			//If we are using droppables, inform the manager about the drop
			if ( ddmanager && !this.options.dropBehaviour ) {
				ddmanager.drop( this, event );
			}

			if ( this.options.revert ) {
				var that = this,
					cur = this.placeholder.offset(),
					axis = this.options.axis,
					animation = {};

				if ( !axis || axis === "x" ) {
					animation.left = cur.left - this.offset.parent.left - this.margins.left +
						( this.offsetParent[ 0 ] === this.document[ 0 ].body ?
							0 :
							this.offsetParent[ 0 ].scrollLeft
						);
				}
				if ( !axis || axis === "y" ) {
					animation.top = cur.top - this.offset.parent.top - this.margins.top +
						( this.offsetParent[ 0 ] === this.document[ 0 ].body ?
							0 :
							this.offsetParent[ 0 ].scrollTop
						);
				}
				this.reverting = true;
				$( this.helper ).animate(
					animation,
					parseInt( this.options.revert, 10 ) || 500,
					function() {
						that._clear( event );
					}
				);
			} else {
				this._clear( event, noPropagation );
			}

			return false;

		},

		cancel: function() {

			if ( this.dragging ) {

				this._mouseUp( new eventer.create( "mouseup", { target: null }));

				if ( this.options.helper === "original" ) {
					this.currentItem.css( this._storedCSS );
					this._removeClass( this.currentItem, "ui-sortable-helper" );
				} else {
					this.currentItem.show();
				}

				//Post deactivating events to containers
				for ( var i = this.containers.length - 1; i >= 0; i-- ) {
					this.containers[ i ]._trigger( "deactivate", null, this._uiHash( this ) );
					if ( this.containers[ i ].containerCache.over ) {
						this.containers[ i ]._trigger( "out", null, this._uiHash( this ) );
						this.containers[ i ].containerCache.over = 0;
					}
				}

			}

			if ( this.placeholder ) {

				//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
				// it unbinds ALL events from the original node!
				if ( this.placeholder[ 0 ].parentNode ) {
					this.placeholder[ 0 ].parentNode.removeChild( this.placeholder[ 0 ] );
				}
				if ( this.options.helper !== "original" && this.helper &&
						this.helper[ 0 ].parentNode ) {
					this.helper.remove();
				}

				langx.extend( this, {
					helper: null,
					dragging: false,
					reverting: false,
					_noFinalSort: null
				} );

				if ( this.domPosition.prev ) {
					$( this.domPosition.prev ).after( this.currentItem );
				} else {
					$( this.domPosition.parent ).prepend( this.currentItem );
				}
			}

			return this;

		},

		serialize: function( o ) {

			var items = this._getItemsAsjQuery( o && o.connected ),
				str = [];
			o = o || {};

			$( items ).each( function() {
				var res = ( $( o.item || this ).attr( o.attribute || "id" ) || "" )
					.match( o.expression || ( /(.+)[\-=_](.+)/ ) );
				if ( res ) {
					str.push(
						( o.key || res[ 1 ] + "[]" ) +
						"=" + ( o.key && o.expression ? res[ 1 ] : res[ 2 ] ) );
				}
			} );

			if ( !str.length && o.key ) {
				str.push( o.key + "=" );
			}

			return str.join( "&" );

		},

		toArray: function( o ) {

			var items = this._getItemsAsjQuery( o && o.connected ),
				ret = [];

			o = o || {};

			items.each( function() {
				ret.push( $( o.item || this ).attr( o.attribute || "id" ) || "" );
			} );
			return ret;

		},

		/* Be careful with the following core functions */
		_intersectsWith: function( item ) {

			var x1 = this.positionAbs.left,
				x2 = x1 + this.helperProportions.width,
				y1 = this.positionAbs.top,
				y2 = y1 + this.helperProportions.height,
				l = item.left,
				r = l + item.width,
				t = item.top,
				b = t + item.height,
				dyClick = this.offset.click.top,
				dxClick = this.offset.click.left,
				isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t &&
					( y1 + dyClick ) < b ),
				isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l &&
					( x1 + dxClick ) < r ),
				isOverElement = isOverElementHeight && isOverElementWidth;

			if ( this.options.tolerance === "pointer" ||
				this.options.forcePointerForContainers ||
				( this.options.tolerance !== "pointer" &&
					this.helperProportions[ this.floating ? "width" : "height" ] >
					item[ this.floating ? "width" : "height" ] )
			) {
				return isOverElement;
			} else {

				return ( l < x1 + ( this.helperProportions.width / 2 ) && // Right Half
					x2 - ( this.helperProportions.width / 2 ) < r && // Left Half
					t < y1 + ( this.helperProportions.height / 2 ) && // Bottom Half
					y2 - ( this.helperProportions.height / 2 ) < b ); // Top Half

			}
		},

		_intersectsWithPointer: function( item ) {
			var verticalDirection, horizontalDirection,
				isOverElementHeight = ( this.options.axis === "x" ) ||
					this._isOverAxis(
						this.positionAbs.top + this.offset.click.top, item.top, item.height ),
				isOverElementWidth = ( this.options.axis === "y" ) ||
					this._isOverAxis(
						this.positionAbs.left + this.offset.click.left, item.left, item.width ),
				isOverElement = isOverElementHeight && isOverElementWidth;

			if ( !isOverElement ) {
				return false;
			}

			verticalDirection = this.dragDirection.vertical;
			horizontalDirection = this.dragDirection.horizontal;

			return this.floating ?
				( ( horizontalDirection === "right" || verticalDirection === "down" ) ? 2 : 1 )
				: ( verticalDirection && ( verticalDirection === "down" ? 2 : 1 ) );

		},

		_intersectsWithSides: function( item ) {

			var isOverBottomHalf = this._isOverAxis( this.positionAbs.top +
					this.offset.click.top, item.top + ( item.height / 2 ), item.height ),
				isOverRightHalf = this._isOverAxis( this.positionAbs.left +
					this.offset.click.left, item.left + ( item.width / 2 ), item.width ),
				verticalDirection = this.dragDirection.vertical,
				horizontalDirection = this.dragDirection.horizontal;

			if ( this.floating && horizontalDirection ) {
				return ( ( horizontalDirection === "right" && isOverRightHalf ) ||
					( horizontalDirection === "left" && !isOverRightHalf ) );
			} else {
				return verticalDirection && ( ( verticalDirection === "down" && isOverBottomHalf ) ||
					( verticalDirection === "up" && !isOverBottomHalf ) );
			}

		},

		_getDragVerticalDirection: function() {
			var delta = this.positionAbs.top - this.lastPositionAbs.top;
			return delta !== 0 && ( delta > 0 ? "down" : "up" );
		},

		_getDragHorizontalDirection: function() {
			var delta = this.positionAbs.left - this.lastPositionAbs.left;
			return delta !== 0 && ( delta > 0 ? "right" : "left" );
		},

		refresh: function( event ) {
			this._refreshItems( event );
			this._setHandleClassName();
			this.refreshPositions();
			return this;
		},

		_connectWith: function() {
			var options = this.options;
			return options.connectWith.constructor === String ?
				[ options.connectWith ] :
				options.connectWith;
		},

		_getItemsAsjQuery: function( connected ) {

			var i, j, cur, inst,
				items = [],
				queries = [],
				connectWith = this._connectWith();

			if ( connectWith && connected ) {
				for ( i = connectWith.length - 1; i >= 0; i-- ) {
					cur = $( connectWith[ i ], this.document[ 0 ] );
					for ( j = cur.length - 1; j >= 0; j-- ) {
						inst = datax.data( cur[ j ], this.pluginName );
						if ( inst && inst !== this && !inst.options.disabled ) {
							queries.push( [ langx.isFunction( inst.options.items ) ?
								inst.options.items.call( inst.element ) :
								$( inst.options.items, inst.element )
									.not( ".ui-sortable-helper" )
									.not( ".ui-sortable-placeholder" ), inst ] );
						}
					}
				}
			}

			queries.push( [ langx.isFunction( this.options.items ) ?
				this.options.items
					.call( this.element, null, { options: this.options, item: this.currentItem } ) :
				$( this.options.items, this.element )
					.not( ".ui-sortable-helper" )
					.not( ".ui-sortable-placeholder" ), this ] );

			function addItems() {
				items.push( this );
			}
			for ( i = queries.length - 1; i >= 0; i-- ) {
				queries[ i ][ 0 ].each( addItems );
			}

			return $( items );

		},

		_removeCurrentsFromItems: function() {

			var list = this.currentItem.find( ":data(" + this.pluginName + "-item)" );

			this.items = this.items.filter(function( item ) {
				for ( var j = 0; j < list.length; j++ ) {
					if ( list[ j ] === item.item[ 0 ] ) {
						return false;
					}
				}
				return true;
			} );

		},

		_refreshItems: function( event ) {

			this.items = [];
			this.containers = [ this ];

			var i, j, cur, inst, targetData, _queries, item, queriesLength,
				items = this.items,
				queries = [ [ langx.isFunction( this.options.items ) ?
					this.options.items.call( this.element[ 0 ], event, { item: this.currentItem } ) :
					$( this.options.items, this.element ), this ] ],
				connectWith = this._connectWith();

			//Shouldn't be run the first time through due to massive slow-down
			if ( connectWith && this.ready ) {
				for ( i = connectWith.length - 1; i >= 0; i-- ) {
					cur = $( connectWith[ i ], this.document[ 0 ] );
					for ( j = cur.length - 1; j >= 0; j-- ) {
						inst = datax.data( cur[ j ], this.pluginName );
						if ( inst && inst !== this && !inst.options.disabled ) {
							queries.push( [ langx.isFunction( inst.options.items ) ?
								inst.options.items
									.call( inst.element[ 0 ], event, { item: this.currentItem } ) :
								$( inst.options.items, inst.element ), inst ] );
							this.containers.push( inst );
						}
					}
				}
			}

			for ( i = queries.length - 1; i >= 0; i-- ) {
				targetData = queries[ i ][ 1 ];
				_queries = queries[ i ][ 0 ];

				for ( j = 0, queriesLength = _queries.length; j < queriesLength; j++ ) {
					item = $( _queries[ j ] );

					// Data for target checking (mouse manager)
					item.data( this.pluginName + "-item", targetData );

					items.push( {
						item: item,
						instance: targetData,
						width: 0, height: 0,
						left: 0, top: 0
					} );
				}
			}

		},

		_refreshItemPositions: function( fast ) {
			var i, item, t, p;

			for ( i = this.items.length - 1; i >= 0; i-- ) {
				item = this.items[ i ];

				//We ignore calculating positions of all connected containers when we're not over them
				if ( this.currentContainer && item.instance !== this.currentContainer &&
						item.item[ 0 ] !== this.currentItem[ 0 ] ) {
					continue;
				}

				t = this.options.toleranceElement ?
					$( this.options.toleranceElement, item.item ) :
					item.item;

				if ( !fast ) {
					item.width = t.outerWidth();
					item.height = t.outerHeight();
				}

				p = t.offset();
				item.left = p.left;
				item.top = p.top;
			}
		},

		refreshPositions: function( fast ) {

			// Determine whether items are being displayed horizontally
			this.floating = this.items.length ?
				this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
				false;

			if ( this.innermostContainer !== null ) {
				this._refreshItemPositions( fast );
			}

			var i, p;

			if ( this.options.custom && this.options.custom.refreshContainers ) {
				this.options.custom.refreshContainers.call( this );
			} else {
				for ( i = this.containers.length - 1; i >= 0; i-- ) {
					p = this.containers[ i ].element.offset();
					this.containers[ i ].containerCache.left = p.left;
					this.containers[ i ].containerCache.top = p.top;
					this.containers[ i ].containerCache.width =
						this.containers[ i ].element.outerWidth();
					this.containers[ i ].containerCache.height =
						this.containers[ i ].element.outerHeight();
				}
			}

			return this;
		},

		_createPlaceholder: function( that ) {
			that = that || this;
			var className, nodeName,
				o = that.options;

			if ( !o.placeholder || o.placeholder.constructor === String ) {
				className = o.placeholder;
				nodeName = that.currentItem[ 0 ].nodeName.toLowerCase();
				o.placeholder = {
					element: function() {

						var element = $( "<" + nodeName + ">", that.document[ 0 ] );

						that._addClass( element, "ui-sortable-placeholder",
								className || that.currentItem[ 0 ].className )
							._removeClass( element, "ui-sortable-helper" );

						if ( nodeName === "tbody" ) {
							that._createTrPlaceholder(
								that.currentItem.find( "tr" ).eq( 0 ),
								$( "<tr>", that.document[ 0 ] ).appendTo( element )
							);
						} else if ( nodeName === "tr" ) {
							that._createTrPlaceholder( that.currentItem, element );
						} else if ( nodeName === "img" ) {
							element.attr( "src", that.currentItem.attr( "src" ) );
						}

						if ( !className ) {
							element.css( "visibility", "hidden" );
						}

						return element;
					},
					update: function( container, p ) {

						// 1. If a className is set as 'placeholder option, we don't force sizes -
						// the class is responsible for that
						// 2. The option 'forcePlaceholderSize can be enabled to force it even if a
						// class name is specified
						if ( className && !o.forcePlaceholderSize ) {
							return;
						}

						// If the element doesn't have a actual height or width by itself (without
						// styles coming from a stylesheet), it receives the inline height and width
						// from the dragged item. Or, if it's a tbody or tr, it's going to have a height
						// anyway since we're populating them with <td>s above, but they're unlikely to
						// be the correct height on their own if the row heights are dynamic, so we'll
						// always assign the height of the dragged item given forcePlaceholderSize
						// is true.
						if ( !p.height() || ( o.forcePlaceholderSize &&
								( nodeName === "tbody" || nodeName === "tr" ) ) ) {
							p.height(
								that.currentItem.innerHeight() -
								parseInt( that.currentItem.css( "paddingTop" ) || 0, 10 ) -
								parseInt( that.currentItem.css( "paddingBottom" ) || 0, 10 ) );
						}
						if ( !p.width() ) {
							p.width(
								that.currentItem.innerWidth() -
								parseInt( that.currentItem.css( "paddingLeft" ) || 0, 10 ) -
								parseInt( that.currentItem.css( "paddingRight" ) || 0, 10 ) );
						}
					}
				};
			}

			//Create the placeholder
			that.placeholder = $( o.placeholder.element.call( that.element, that.currentItem ) );

			//Append it after the actual current item
			that.currentItem.after( that.placeholder );

			//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
			o.placeholder.update( that, that.placeholder );

		},

		_createTrPlaceholder: function( sourceTr, targetTr ) {
			var that = this;

			sourceTr.children().each( function() {
				$( "<td>&#160;</td>", that.document[ 0 ] )
					.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
					.appendTo( targetTr );
			} );
		},

		_contactContainers: function( event ) {
			var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom,
				floating, axis,
				innermostContainer = null,
				innermostIndex = null;

			// Get innermost container that intersects with item
			for ( i = this.containers.length - 1; i >= 0; i-- ) {

				// Never consider a container that's located within the item itself
				if ( noder.contains( this.currentItem[ 0 ], this.containers[ i ].element[ 0 ] ) ) {
					continue;
				}

				if ( this._intersectsWith( this.containers[ i ].containerCache ) ) {

					// If we've already found a container and it's more "inner" than this, then continue
					if ( innermostContainer &&
							noder.contains(
								this.containers[ i ].element[ 0 ],
								innermostContainer.element[ 0 ] ) ) {
						continue;
					}

					innermostContainer = this.containers[ i ];
					innermostIndex = i;

				} else {

					// container doesn't intersect. trigger "out" event if necessary
					if ( this.containers[ i ].containerCache.over ) {
						this.containers[ i ]._trigger( "out", event, this._uiHash( this ) );
						this.containers[ i ].containerCache.over = 0;
					}
				}

			}

			this.innermostContainer = innermostContainer;

			// If no intersecting containers found, return
			if ( !innermostContainer ) {
				return;
			}

			// Move the item into the container if it's not there already
			if ( this.containers.length === 1 ) {
				if ( !this.containers[ innermostIndex ].containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash( this ) );
					this.containers[ innermostIndex ].containerCache.over = 1;
				}
			} else {

				// When entering a new container, we will find the item with the least distance and
				// append our item near it
				dist = 10000;
				itemWithLeastDistance = null;
				floating = innermostContainer.floating || this._isFloating( this.currentItem );
				posProperty = floating ? "left" : "top";
				sizeProperty = floating ? "width" : "height";
				axis = floating ? "pageX" : "pageY";

				for ( j = this.items.length - 1; j >= 0; j-- ) {
					if ( !noder.contains(
							this.containers[ innermostIndex ].element[ 0 ], this.items[ j ].item[ 0 ] )
					) {
						continue;
					}
					if ( this.items[ j ].item[ 0 ] === this.currentItem[ 0 ] ) {
						continue;
					}

					cur = this.items[ j ].item.offset()[ posProperty ];
					nearBottom = false;
					if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
						nearBottom = true;
					}

					if ( Math.abs( event[ axis ] - cur ) < dist ) {
						dist = Math.abs( event[ axis ] - cur );
						itemWithLeastDistance = this.items[ j ];
						this.direction = nearBottom ? "up" : "down";
					}
				}

				//Check if dropOnEmpty is enabled
				if ( !itemWithLeastDistance && !this.options.dropOnEmpty ) {
					return;
				}

				if ( this.currentContainer === this.containers[ innermostIndex ] ) {
					if ( !this.currentContainer.containerCache.over ) {
						this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
						this.currentContainer.containerCache.over = 1;
					}
					return;
				}

				itemWithLeastDistance ?
					this._rearrange( event, itemWithLeastDistance, null, true ) :
					this._rearrange( event, null, this.containers[ innermostIndex ].element, true );
				this._trigger( "change", event, this._uiHash() );
				this.containers[ innermostIndex ]._trigger( "change", event, this._uiHash( this ) );
				this.currentContainer = this.containers[ innermostIndex ];

				//Update the placeholder
				this.options.placeholder.update( this.currentContainer, this.placeholder );

				//Update scrollParent
				this.scrollParent = this.placeholder.scrollParent();

				//Update overflowOffset
				if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
						this.scrollParent[ 0 ].tagName !== "HTML" ) {
					this.overflowOffset = this.scrollParent.offset();
				}

				this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash( this ) );
				this.containers[ innermostIndex ].containerCache.over = 1;
			}

		},

		_createHelper: function( event ) {

			var o = this.options,
				helper = langx.isFunction( o.helper ) ?
					$( o.helper.apply( this.element[ 0 ], [ event, this.currentItem ] ) ) :
					( o.helper === "clone" ? this.currentItem.clone() : this.currentItem );

			//Add the helper to the DOM if that didn't happen already
			if ( !helper.parents( "body" ).length ) {
				this.appendTo[ 0 ].appendChild( helper[ 0 ] );
			}

			if ( helper[ 0 ] === this.currentItem[ 0 ] ) {
				this._storedCSS = {
					width: this.currentItem[ 0 ].style.width,
					height: this.currentItem[ 0 ].style.height,
					position: this.currentItem.css( "position" ),
					top: this.currentItem.css( "top" ),
					left: this.currentItem.css( "left" )
				};
			}

			if ( !helper[ 0 ].style.width || o.forceHelperSize ) {
				helper.width( this.currentItem.width() );
			}
			if ( !helper[ 0 ].style.height || o.forceHelperSize ) {
				helper.height( this.currentItem.height() );
			}

			return helper;

		},

		_adjustOffsetFromHelper: function( obj ) {
			if ( typeof obj === "string" ) {
				obj = obj.split( " " );
			}
			if ( langx.isArray( obj ) ) {
				obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
			}
			if ( "left" in obj ) {
				this.offset.click.left = obj.left + this.margins.left;
			}
			if ( "right" in obj ) {
				this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
			}
			if ( "top" in obj ) {
				this.offset.click.top = obj.top + this.margins.top;
			}
			if ( "bottom" in obj ) {
				this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
			}
		},

		_getParentOffset: function() {

			//Get the offsetParent and cache its position
			this.offsetParent = this.helper.offsetParent();
			var po = this.offsetParent.offset();

			// This is a special case where we need to modify a offset calculated on start, since the
			// following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the
			// next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
			// the document, which means that the scroll is included in the initial calculation of the
			// offset of the parent, and never recalculated upon drag
			if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					noder.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}

			// This needs to be actually done for all browsers, since pageX/pageY includes this
			// information with an ugly IE fix
			if ( this.offsetParent[ 0 ] === this.document[ 0 ].body ||
					( this.offsetParent[ 0 ].tagName &&
					this.offsetParent[ 0 ].tagName.toLowerCase() === "html" && langx.ui.ie ) ) {
				po = { top: 0, left: 0 };
			}

			return {
				top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
				left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
			};

		},

		_getRelativeOffset: function() {

			if ( this.cssPosition === "relative" ) {
				var p = this.currentItem.position();
				return {
					top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
						this.scrollParent.scrollTop(),
					left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
						this.scrollParent.scrollLeft()
				};
			} else {
				return { top: 0, left: 0 };
			}

		},

		_cacheMargins: function() {
			this.margins = {
				left: ( parseInt( this.currentItem.css( "marginLeft" ), 10 ) || 0 ),
				top: ( parseInt( this.currentItem.css( "marginTop" ), 10 ) || 0 )
			};
		},

		_cacheHelperProportions: function() {
			this.helperProportions = {
				width: this.helper.outerWidth(),
				height: this.helper.outerHeight()
			};
		},

		_setContainment: function() {

			var ce, co, over,
				o = this.options;
			if ( o.containment === "parent" ) {
				o.containment = this.helper[ 0 ].parentNode;
			}
			if ( o.containment === "document" || o.containment === "window" ) {
				this.containment = [
					0 - this.offset.relative.left - this.offset.parent.left,
					0 - this.offset.relative.top - this.offset.parent.top,
					o.containment === "document" ?
						this.document.width() :
						this.window.width() - this.helperProportions.width - this.margins.left,
					( o.containment === "document" ?
						( this.document.height() || document.body.parentNode.scrollHeight ) :
						this.window.height() || this.document[ 0 ].body.parentNode.scrollHeight
					) - this.helperProportions.height - this.margins.top
				];
			}

			if ( !( /^(document|window|parent)$/ ).test( o.containment ) ) {
				ce = $( o.containment )[ 0 ];
				co = $( o.containment ).offset();
				over = ( $( ce ).css( "overflow" ) !== "hidden" );

				this.containment = [
					co.left + ( parseInt( $( ce ).css( "borderLeftWidth" ), 10 ) || 0 ) +
						( parseInt( $( ce ).css( "paddingLeft" ), 10 ) || 0 ) - this.margins.left,
					co.top + ( parseInt( $( ce ).css( "borderTopWidth" ), 10 ) || 0 ) +
						( parseInt( $( ce ).css( "paddingTop" ), 10 ) || 0 ) - this.margins.top,
					co.left + ( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
						( parseInt( $( ce ).css( "borderLeftWidth" ), 10 ) || 0 ) -
						( parseInt( $( ce ).css( "paddingRight" ), 10 ) || 0 ) -
						this.helperProportions.width - this.margins.left,
					co.top + ( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
						( parseInt( $( ce ).css( "borderTopWidth" ), 10 ) || 0 ) -
						( parseInt( $( ce ).css( "paddingBottom" ), 10 ) || 0 ) -
						this.helperProportions.height - this.margins.top
				];
			}

		},

		_convertPositionTo: function( d, pos ) {

			if ( !pos ) {
				pos = this.position;
			}
			var mod = d === "absolute" ? 1 : -1,
				scroll = this.cssPosition === "absolute" &&
					!( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					noder.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ?
						this.offsetParent :
						this.scrollParent,
				scrollIsRootNode = ( /(html|body)/i ).test( scroll[ 0 ].tagName );

			return {
				top: (

					// The absolute mouse position
					pos.top	+

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.top * mod +

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.top * mod -
					( ( this.cssPosition === "fixed" ?
						-this.scrollParent.scrollTop() :
						( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod )
				),
				left: (

					// The absolute mouse position
					pos.left +

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.left * mod +

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.left * mod	-
					( ( this.cssPosition === "fixed" ?
						-this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 :
						scroll.scrollLeft() ) * mod )
				)
			};

		},

		_generatePosition: function( event ) {

			var top, left,
				o = this.options,
				pageX = event.pageX,
				pageY = event.pageY,
				scroll = this.cssPosition === "absolute" &&
					!( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					noder.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ?
						this.offsetParent :
						this.scrollParent,
					scrollIsRootNode = ( /(html|body)/i ).test( scroll[ 0 ].tagName );

			// This is another very weird special case that only happens for relative elements:
			// 1. If the css position is relative
			// 2. and the scroll parent is the document or similar to the offset parent
			// we have to refresh the relative offset during the scroll so there are no jumps
			if ( this.cssPosition === "relative" && !( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
					this.scrollParent[ 0 ] !== this.offsetParent[ 0 ] ) ) {
				this.offset.relative = this._getRelativeOffset();
			}

			/*
			 * - Position constraining -
			 * Constrain the position to a mix of grid, containment.
			 */

			if ( this.originalPosition ) { //If we are not dragging yet, we won't check for options

				if ( this.containment ) {
					if ( event.pageX - this.offset.click.left < this.containment[ 0 ] ) {
						pageX = this.containment[ 0 ] + this.offset.click.left;
					}
					if ( event.pageY - this.offset.click.top < this.containment[ 1 ] ) {
						pageY = this.containment[ 1 ] + this.offset.click.top;
					}
					if ( event.pageX - this.offset.click.left > this.containment[ 2 ] ) {
						pageX = this.containment[ 2 ] + this.offset.click.left;
					}
					if ( event.pageY - this.offset.click.top > this.containment[ 3 ] ) {
						pageY = this.containment[ 3 ] + this.offset.click.top;
					}
				}

				if ( o.grid ) {
					top = this.originalPageY + Math.round( ( pageY - this.originalPageY ) /
						o.grid[ 1 ] ) * o.grid[ 1 ];
					pageY = this.containment ?
						( ( top - this.offset.click.top >= this.containment[ 1 ] &&
							top - this.offset.click.top <= this.containment[ 3 ] ) ?
								top :
								( ( top - this.offset.click.top >= this.containment[ 1 ] ) ?
									top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) :
									top;

					left = this.originalPageX + Math.round( ( pageX - this.originalPageX ) /
						o.grid[ 0 ] ) * o.grid[ 0 ];
					pageX = this.containment ?
						( ( left - this.offset.click.left >= this.containment[ 0 ] &&
							left - this.offset.click.left <= this.containment[ 2 ] ) ?
								left :
								( ( left - this.offset.click.left >= this.containment[ 0 ] ) ?
									left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) :
									left;
				}

			}

			return {
				top: (

					// The absolute mouse position
					pageY -

					// Click offset (relative to the element)
					this.offset.click.top -

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.top -

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.top +
					( ( this.cssPosition === "fixed" ?
						-this.scrollParent.scrollTop() :
						( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) )
				),
				left: (

					// The absolute mouse position
					pageX -

					// Click offset (relative to the element)
					this.offset.click.left -

					// Only for relative positioned nodes: Relative offset from element to offset parent
					this.offset.relative.left -

					// The offsetParent's offset without borders (offset + border)
					this.offset.parent.left +
					( ( this.cssPosition === "fixed" ?
						-this.scrollParent.scrollLeft() :
						scrollIsRootNode ? 0 : scroll.scrollLeft() ) )
				)
			};

		},

		_rearrange: function( event, i, a, hardRefresh ) {

			a ? a[ 0 ].appendChild( this.placeholder[ 0 ] ) :
				i.item[ 0 ].parentNode.insertBefore( this.placeholder[ 0 ],
					( this.direction === "down" ? i.item[ 0 ] : i.item[ 0 ].nextSibling ) );

			//Various things done here to improve the performance:
			// 1. we create a setTimeout, that calls refreshPositions
			// 2. on the instance, we have a counter variable, that get's higher after every append
			// 3. on the local scope, we copy the counter variable, and check in the timeout,
			// if it's still the same
			// 4. this lets only the last addition to the timeout stack through
			this.counter = this.counter ? ++this.counter : 1;
			var counter = this.counter;

			this._delay( function() {
				if ( counter === this.counter ) {

					//Precompute after each DOM insertion, NOT on mousemove
					this.refreshPositions( !hardRefresh );
				}
			} );

		},

		_clear: function( event, noPropagation ) {

			this.reverting = false;

			// We delay all events that have to be triggered to after the point where the placeholder
			// has been removed and everything else normalized again
			var i,
				delayedTriggers = [];

			// We first have to update the dom position of the actual currentItem
			// Note: don't do it if the current item is already removed (by a user), or it gets
			// reappended (see #4088)
			if ( !this._noFinalSort && this.currentItem.parent().length ) {
				this.placeholder.before( this.currentItem );
			}
			this._noFinalSort = null;

			if ( this.helper[ 0 ] === this.currentItem[ 0 ] ) {
				for ( i in this._storedCSS ) {
					if ( this._storedCSS[ i ] === "auto" || this._storedCSS[ i ] === "static" ) {
						this._storedCSS[ i ] = "";
					}
				}
				this.currentItem.css( this._storedCSS );
				this._removeClass( this.currentItem, "ui-sortable-helper" );
			} else {
				this.currentItem.show();
			}

			if ( this.fromOutside && !noPropagation ) {
				delayedTriggers.push( function( event ) {
					this._trigger( "receive", event, this._uiHash( this.fromOutside ) );
				} );
			}
			if ( ( this.fromOutside ||
					this.domPosition.prev !==
					this.currentItem.prev().not( ".ui-sortable-helper" )[ 0 ] ||
					this.domPosition.parent !== this.currentItem.parent()[ 0 ] ) && !noPropagation ) {

				// Trigger update callback if the DOM position has changed
				delayedTriggers.push( function( event ) {
					this._trigger( "update", event, this._uiHash() );
				} );
			}

			// Check if the items Container has Changed and trigger appropriate
			// events.
			if ( this !== this.currentContainer ) {
				if ( !noPropagation ) {
					delayedTriggers.push( function( event ) {
						this._trigger( "remove", event, this._uiHash() );
					} );
					delayedTriggers.push( ( function( c ) {
						return function( event ) {
							c._trigger( "receive", event, this._uiHash( this ) );
						};
					} ).call( this, this.currentContainer ) );
					delayedTriggers.push( ( function( c ) {
						return function( event ) {
							c._trigger( "update", event, this._uiHash( this ) );
						};
					} ).call( this, this.currentContainer ) );
				}
			}

			//Post events to containers
			function delayEvent( type, instance, container ) {
				return function( event ) {
					container._trigger( type, event, instance._uiHash( instance ) );
				};
			}
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				if ( !noPropagation ) {
					delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
				}
				if ( this.containers[ i ].containerCache.over ) {
					delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
					this.containers[ i ].containerCache.over = 0;
				}
			}

			//Do what was originally in patches
			if ( this.storedCursor ) {
				this.document.find( "body" ).css( "cursor", this.storedCursor );
				this.storedStylesheet.remove();
			}
			if ( this._storedOpacity ) {
				this.helper.css( "opacity", this._storedOpacity );
			}
			if ( this._storedZIndex ) {
				this.helper.css( "zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex );
			}

			this.dragging = false;

			if ( !noPropagation ) {
				this._trigger( "beforeStop", event, this._uiHash() );
			}

			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
			// it unbinds ALL events from the original node!
			this.placeholder[ 0 ].parentNode.removeChild( this.placeholder[ 0 ] );

			if ( !this.cancelHelperRemoval ) {
				if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
					this.helper.remove();
				}
				this.helper = null;
			}

			if ( !noPropagation ) {
				for ( i = 0; i < delayedTriggers.length; i++ ) {

					// Trigger all delayed events
					delayedTriggers[ i ].call( this, event );
				}
				this._trigger( "stop", event, this._uiHash() );
			}

			this.fromOutside = false;
			return !this.cancelHelperRemoval;

		},

		_trigger: function( type, event, ui ) {
			if ( this.overrided(type, event, ui) === false ) {
				this.cancel();
			}
		},

		_uiHash: function( _inst ) {
			var inst = _inst || this;
			return {
				helper: inst.helper,
				placeholder: inst.placeholder || $( [] ),
				position: inst.position,
				originalPosition: inst.originalPosition,
				offset: inst.positionAbs,
				item: inst.currentItem,
				sender: _inst ? _inst.element : null
			};
		}

	});

	plugins.register(Sortable,"sortable");

	return Sortable;
});

define( 'skylark-jqueryui-interact/main',[
	"./ddmanager",
	"./Draggable",
	"./Droppable",
	"./Mouse",
	"./Resizable",
	"./Selectable",
	"./Sortable",
],function(ddmanager,Draggable,Droppable,Mouse,Resizable,Selectable,Sortable){
	return {
		ddmanager : ddmanager,
		Draggable : Draggable,
		Droppable : Droppable,
		Mouse : Mouse,
		Resizable : Resizable,
		Selectable : Selectable,
		Sortable : Sortable
	};
});
define('skylark-jqueryui-interact', ['skylark-jqueryui-interact/main'], function (main) { return main; });


},this);