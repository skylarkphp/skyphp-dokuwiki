/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
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

    function isActive (elem) {
            return elem === document.activeElement && (elem.type || elem.href);
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


    function selectable(elem, selectable) {
        if (elem === undefined || elem.style === undefined)
            return;
        elem.onselectstart = selectable ? function () {
            return false;
        } : function () {
        };
        elem.style.MozUserSelect = selectable ? 'auto' : 'none';
        elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
        elem.unselectable = selectable ? 'on' : 'off';
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

        after: after,

        append: append,

        before: before,

        blur : function(el) {
            el.blur();
        },

        body: function() {
            return document.body;
        },

        clone: clone,

        contains: contains,

        contents: contents,

        createElement: createElement,

        createFragment: createFragment,

     
        createTextNode: createTextNode,

        doc: doc,

        empty: empty,

        fullScreen: fullScreen,

        focusable: focusable,

        html: html,

        isActive,

        isChildOf: isChildOf,

        isDocument: isDocument,

        isInDocument: isInDocument,

        isWindow: langx.isWindow,

        nodeName : nodeName,

        offsetParent: offsetParent,

        ownerDoc: ownerDoc,

        ownerWindow: ownerWindow,

        prepend: prepend,

        reflow: reflow,

        remove: remove,

        removeChild : removeChild,

        replace: replace,

        selectable,

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

define('skylark-io-diskfs/diskfs',[
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
 define('skylark-io-diskfs/webentry',[
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
    "skylark-io-diskfs/webentry"
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

define('skylark-io-diskfs/select',[
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
            accept = params.accept || "", //'image/gif,image/jpeg,image/jpg,image/png,image/svg'
            title = params.title || "",
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
        fileInput.accept = accept;
        fileInput.title = title;

        fileInput.webkitdirectory = directory;
        fileInput.click();
    }

    return diskfs.select = select;
});


define('skylark-domx-files/picker',[
    "skylark-langx/objects",
    "skylark-domx-eventer",
    "./files",
    "skylark-io-diskfs/select"
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



define('skylark-net-http/http',[
  "skylark-langx-ns/ns",
],function(skylark){
	return skylark.attach("net.http",{});
});
define('skylark-net-http/Xhr',[
  "skylark-langx-ns/ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-funcs",
  "skylark-langx-async/Deferred",
  "skylark-langx-emitter/Evented",
  "./http"
],function(skylark,types,objects,arrays,funcs,Deferred,Evented,http){

    var each = objects.each,
        mixin = objects.mixin,
        noop = funcs.noop,
        isArray = types.isArray,
        isFunction = types.isFunction,
        isPlainObject = types.isPlainObject,
        type = types.type;
 
     var getAbsoluteUrl = (function() {
        var a;

        return function(url) {
            if (!a) a = document.createElement('a');
            a.href = url;

            return a.href;
        };
    })();
   
    var Xhr = (function(){
        var jsonpID = 0,
            key,
            name,
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html',
            blankRE = /^\s*$/;

        var XhrDefaultOptions = {
            async: true,

            // Default type of request
            type: 'GET',
            // Callback that is executed before request
            beforeSend: noop,
            // Callback that is executed if the request succeeds
            success: noop,
            // Callback that is executed the the server drops error
            error: noop,
            // Callback that is executed on request complete (both: error and success)
            complete: noop,
            // The context for the callbacks
            context: null,
            // Whether to trigger "global" Ajax events
            global: true,

            // MIME types mapping
            // IIS returns Javascript as "application/x-javascript"
            accepts: {
                script: 'text/javascript, application/javascript, application/x-javascript',
                json: 'application/json',
                xml: 'application/xml, text/xml',
                html: 'text/html',
                text: 'text/plain'
            },
            // Whether the request is to another domain
            crossDomain: false,
            // Default timeout
            timeout: 0,
            // Whether data should be serialized to string
            processData: false,
            // Whether the browser should be allowed to cache GET responses
            cache: true,

            traditional : false,
            
            xhrFields : {
                withCredentials : false
            }
        };

        function mimeToDataType(mime) {
            if (mime) {
                mime = mime.split(';', 2)[0];
            }
            if (mime) {
                if (mime == htmlType) {
                    return "html";
                } else if (mime == jsonType) {
                    return "json";
                } else if (scriptTypeRE.test(mime)) {
                    return "script";
                } else if (xmlTypeRE.test(mime)) {
                    return "xml";
                }
            }
            return "text";
        }

        function appendQuery(url, query) {
            if (query == '') return url
            return (url + '&' + query).replace(/[&?]{1,2}/, '?')
        }

        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            options.data = options.data || options.query;
            if (options.processData && options.data && type(options.data) != "string") {
                options.data = param(options.data, options.traditional);
            }
            if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
                if (type(options.data) != "string") {
                    options.data = param(options.data, options.traditional);
                }
                options.url = appendQuery(options.url, options.data);
                options.data = undefined;
            }
        }
        
        function serialize(params, obj, traditional, scope) {
            var t, array = isArray(obj),
                hash = isPlainObject(obj)
            each(obj, function(key, value) {
                t =type(value);
                if (scope) key = traditional ? scope :
                    scope + '[' + (hash || t == 'object' || t == 'array' ? key : '') + ']'
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value)
                // recurse into nested objects
                else if (t == "array" || (!traditional && t == "object"))
                    serialize(params, value, traditional, key)
                else params.add(key, value)
            })
        }

        var param = function(obj, traditional) {
            var params = []
            params.add = function(key, value) {
                if (isFunction(value)) {
                  value = value();
                }
                if (value == null) {
                  value = "";
                }
                this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            };
            serialize(params, obj, traditional)
            return params.join('&').replace(/%20/g, '+')
        };

        var Xhr = Evented.inherit({
            klassName : "Xhr",

            _request  : function(args) {
                var _ = this._,
                    self = this,
                    options = mixin({},XhrDefaultOptions,_.options,args),
                    xhr = _.xhr = new XMLHttpRequest();

                serializeData(options)

                if (options.beforeSend) {
                    options.beforeSend.call(this, xhr, options);
                }                

                var dataType = options.dataType || options.handleAs,
                    mime = options.mimeType || options.accepts[dataType],
                    headers = options.headers,
                    xhrFields = options.xhrFields,
                    isFormData = options.data && options.data instanceof FormData,
                    basicAuthorizationToken = options.basicAuthorizationToken,
                    type = options.type,
                    url = options.url,
                    async = options.async,
                    user = options.user , 
                    password = options.password,
                    deferred = new Deferred(),
                    contentType = options.contentType || (isFormData ? false : 'application/x-www-form-urlencoded');

                if (xhrFields) {
                    for (name in xhrFields) {
                        xhr[name] = xhrFields[name];
                    }
                }

                if (mime && mime.indexOf(',') > -1) {
                    mime = mime.split(',', 2)[0];
                }
                if (mime && xhr.overrideMimeType) {
                    xhr.overrideMimeType(mime);
                }

                //if (dataType) {
                //    xhr.responseType = dataType;
                //}

                var finish = function() {
                    xhr.onloadend = noop;
                    xhr.onabort = noop;
                    xhr.onprogress = noop;
                    xhr.ontimeout = noop;
                    xhr = null;
                }
                var onloadend = function() {
                    var result, error = false
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && getAbsoluteUrl(url).startsWith('file:'))) {
                        dataType = dataType || mimeToDataType(options.mimeType || xhr.getResponseHeader('content-type'));

                        result = xhr.responseText;
                        try {
                            if (dataType == 'script') {
                                eval(result);
                            } else if (dataType == 'xml') {
                                result = xhr.responseXML;
                            } else if (dataType == 'json') {
                                result = blankRE.test(result) ? null : JSON.parse(result);
                            } else if (dataType == "blob") {
                                result = Blob([xhrObj.response]);
                            } else if (dataType == "arraybuffer") {
                                result = xhr.reponse;
                            }
                        } catch (e) { 
                            error = e;
                        }

                        if (error) {
                            deferred.reject(error,xhr.status,xhr);
                        } else {
                            deferred.resolve(result,xhr.status,xhr);
                        }
                    } else {
                        deferred.reject(new Error(xhr.statusText),xhr.status,xhr);
                    }
                    finish();
                };

                var onabort = function() {
                    if (deferred) {
                        deferred.reject(new Error("abort"),xhr.status,xhr);
                    }
                    finish();                 
                }
 
                var ontimeout = function() {
                    if (deferred) {
                        deferred.reject(new Error("timeout"),xhr.status,xhr);
                    }
                    finish();                 
                }

                var onprogress = function(evt) {
                    if (deferred) {
                        deferred.notify(evt,xhr.status,xhr);
                    }
                }

                xhr.onloadend = onloadend;
                xhr.onabort = onabort;
                xhr.ontimeout = ontimeout;
                xhr.onprogress = onprogress;

                xhr.open(type, url, async, user, password);
               
                if (headers) {
                    for ( var key in headers) {
                        var value = headers[key];
 
                        if(key.toLowerCase() === 'content-type'){
                            contentType = value;
                        } else {
                           xhr.setRequestHeader(key, value);
                        }
                    }
                }   

                if  (contentType && contentType !== false){
                    xhr.setRequestHeader('Content-Type', contentType);
                }

                if(!headers || !('X-Requested-With' in headers)){
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                }


                //If basicAuthorizationToken is defined set its value into "Authorization" header
                if (basicAuthorizationToken) {
                    xhr.setRequestHeader("Authorization", basicAuthorizationToken);
                }

                xhr.send(options.data ? options.data : null);

                return deferred.promise;

            },

            "abort": function() {
                var _ = this._,
                    xhr = _.xhr;

                if (xhr) {
                    xhr.abort();
                }    
            },


            "request": function(args) {
                return this._request(args);
            },

            get : function(args) {
                args = args || {};
                args.type = "GET";
                return this._request(args);
            },

            post : function(args) {
                args = args || {};
                args.type = "POST";
                return this._request(args);
            },

            patch : function(args) {
                args = args || {};
                args.type = "PATCH";
                return this._request(args);
            },

            put : function(args) {
                args = args || {};
                args.type = "PUT";
                return this._request(args);
            },

            del : function(args) {
                args = args || {};
                args.type = "DELETE";
                return this._request(args);
            },

            "init": function(options) {
                this._ = {
                    options : options || {}
                };
            }
        });

        ["request","get","post","put","del","patch"].forEach(function(name){
            Xhr[name] = function(url,args) {
                var xhr = new Xhr({"url" : url});
                return xhr[name](args);
            };
        });

        Xhr.defaultOptions = XhrDefaultOptions;
        Xhr.param = param;

        return Xhr;
    })();

	return http.Xhr = Xhr;	
});
define('skylark-net-http/Upload',[
    "skylark-langx-types",
    "skylark-langx-objects",
    "skylark-langx-arrays",
    "skylark-langx-async/Deferred",
    "skylark-langx-emitter/Evented",    
    "./Xhr",
    "./http"
],function(types, objects, arrays, Deferred, Evented,Xhr, http){

    var blobSlice = Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice;


    /*
     *Class for uploading files using xhr.
     */
    var Upload = Evented.inherit({
        klassName : "Upload",

        _construct : function(options) {
            this._options = objects.mixin({
                debug: false,
                url: '/upload',
                // maximum number of concurrent uploads
                maxConnections: 999,
                // To upload large files in smaller chunks, set the following option
                // to a preferred maximum chunk size. If set to 0, null or undefined,
                // or the browser does not support the required Blob API, files will
                // be uploaded as a whole.
                maxChunkSize: undefined,

                onProgress: function(id, fileName, loaded, total){
                },
                onComplete: function(id, fileName){
                },
                onCancel: function(id, fileName){
                },
                onFailure : function(id,fileName,e) {                    
                }
            },options);

            this._queue = [];
            // params for files in queue
            this._params = [];

            this._files = [];
            this._xhrs = [];

            // current loaded size in bytes for each file
            this._loaded = [];

        },

        /**
         * Adds file to the queue
         * Returns id to use with upload, cancel
         **/
        add: function(file){
            return this._files.push(file) - 1;
        },

        /**
         * Sends the file identified by id and additional query params to the server.
         */
        send: function(id, params){
            if (!this._files[id]) {
                // Already sended or canceled
                return ;
            }
            if (this._queue.indexOf(id)>-1) {
                // Already in the queue
                return;
            }
            var len = this._queue.push(id);

            var copy = objects.clone(params);

            this._params[id] = copy;

            // if too many active uploads, wait...
            if (len <= this._options.maxConnections){
                this._send(id, this._params[id]);
            }     
        },

        /**
         * Sends all files  and additional query params to the server.
         */
        sendAll: function(params){
           for( var id = 0; id <this._files.length; id++) {
                this.send(id,params);
            }
        },

        /**
         * Cancels file upload by id
         */
        cancel: function(id){
            this._cancel(id);
            this._dequeue(id);
        },

        /**
         * Cancells all uploads
         */
        cancelAll: function(){
            for (var i=0; i<this._queue.length; i++){
                this._cancel(this._queue[i]);
            }
            this._queue = [];
        },

        getName: function(id){
            var file = this._files[id];
            return file.fileName != null ? file.fileName : file.name;
        },

        getSize: function(id){
            var file = this._files[id];
            return file.fileSize != null ? file.fileSize : file.size;
        },

        /**
         * Returns uploaded bytes for file identified by id
         */
        getLoaded: function(id){
            return this._loaded[id] || 0;
        },


        /**
         * Sends the file identified by id and additional query params to the server
         * @param {Object} params name-value string pairs
         */
        _send: function(id, params){
            var options = this._options,
                name = this.getName(id),
                size = this.getSize(id),
                chunkSize = options.maxChunkSize || 0,
                curUploadingSize,
                curLoadedSize = 0,
                file = this._files[id],
                args = {
                    headers : {
                    }                    
                };

            this._loaded[id] = this._loaded[id] || 0;

            var xhr = this._xhrs[id] = new Xhr({
                url : options.url
            });

            if (chunkSize)  {

                args.data = blobSlice.call(
                    file,
                    this._loaded[id],
                    this._loaded[id] + chunkSize,
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                curUploadingSize = args.data.size;
                // Expose the chunk bytes position range:
                args.headers["content-range"] = 'bytes ' + this._loaded[id] + '-' +
                    (this._loaded[id] + curUploadingSize - 1) + '/' + size;
                args.headers["Content-Type"] = "application/octet-stream";
            }  else {
                curUploadingSize = size;
                var formParamName =  params.formParamName,
                    formData = params.formData;

                if (formParamName) {
                    if (!formData) {
                        formData = new FormData();
                    }
                    formData.append(formParamName,file);
                    args.data = formData;
    
                } else {
                    args.headers["Content-Type"] = file.type || "application/octet-stream";
                    args.data = file;
                }
            }


            var self = this;
            xhr.post(
                args
            ).progress(function(e){
                if (e.lengthComputable){
                    curLoadedSize = curLoadedSize + e.loaded;
                    self._loaded[id] = self._loaded[id] + e.loaded;
                    self._options.onProgress(id, name, self._loaded[id], size);
                }
            }).then(function(){
                if (!self._files[id]) {
                    // the request was aborted/cancelled
                    return;
                }

                if (curLoadedSize < curUploadingSize) {
                    // Create a progress event if no final progress event
                    // with loaded equaling total has been triggered
                    // for this chunk:
                    self._loaded[id] = self._loaded[id] + curUploadingSize - curLoadedSize;
                    self._options.onProgress(id, name, self._loaded[id], size);                    
                }

                if (self._loaded[id] <size) {
                    // File upload not yet complete,
                    // continue with the next chunk:
                    self._send(id,params);
                } else {
                    self._options.onComplete(id,name);

                    self._files[id] = null;
                    self._xhrs[id] = null;
                    self._dequeue(id);
                }


            }).catch(function(e){
                self._options.onFailure(id,name,e);

                self._files[id] = null;
                self._xhrs[id] = null;
                self._dequeue(id);
            });
        },

        _cancel: function(id){
            this._options.onCancel(id, this.getName(id));

            this._files[id] = null;

            if (this._xhrs[id]){
                this._xhrs[id].abort();
                this._xhrs[id] = null;
            }
        },

        /**
         * Returns id of files being uploaded or
         * waiting for their turn
         */
        getQueue: function(){
            return this._queue;
        },


        /**
         * Removes element from queue, starts upload of next
         */
        _dequeue: function(id){
            var i = arrays.inArray(id,this._queue);
            this._queue.splice(i, 1);

            var max = this._options.maxConnections;

            if (this._queue.length >= max && i < max){
                var nextId = this._queue[max-1];
                this._send(nextId, this._params[nextId]);
            }
        }
    });

    return http.Upload = Upload;    
});
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


    function fullCover(elem, hor, vert) {
        let vertical = vert;
        let horizontal = hor;
        if (langx.isUndefined(horizontal)) {
            horizontal = true;
        }
        if (langx.isUndefined(vertical)) {
            vertical = true;
        }
        elem.style.position = 'absolute';
        if (horizontal) {
            elem.style.left = 0;
            elem.style.right = 0;
        }
        if (vertical) {
            elem.style.top = 0;
            elem.style.bottom = 0;
        }
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

        fullCover,

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

define('skylark-domx-files/MultiUploader',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-net-http/Upload",
  "skylark-domx-plugins",
  "./files"
]  ,function(skylark,langx,$, elmx,FileUpload, plugins,files){

    var fileListTemplate = '<div class="lark-multiuploader">' + 
        '    <h3 class="popover-title">Upload files</h3>' + 
        '    <div class="popover-content container-fluid" class="file-list file-dropzone file-pastezone">' + 
        '        <div class="no-data"><em>Add files.</em></div>' + 
        '    </div>' + 
        '    <footer>' + 
        '        <button class="btn btn-warning pull-right btn-sm" id="cancel-uploads-button"><i class="icon-cancel"></i>Cancel uploads</button>' + 
        '        <span class="btn btn-success fileinput-button btn-sm" id="fileinput-button">' + 
        '            <i class="icon-plus"></i>' + 
        '            <span>Add files...</span>' + 
        '            <input id="fileupload" type="file" name="files[]" multiple="multiple">' + 
        '        </span>' + 
        '        <button class="btn btn-primary btn-sm" id="start-uploads-button"><i class="icon-start"></i>Start uploads</button>' + 
        '    </footer>' + 
        '</div>',
        fileItemTemplate = '<div class="file-item row">' +
        '   <div class="col-md-6"><span class="name"></span></div>' + 
        '   <div class="col-md-3">' +
        '    <span class="size"></span>' +
        '    <div class="progress hidden">' +
        '        <div class="progress-label"></div>' +
        '        <div class="bar"></div>' +
        '    </div>' +
        '    <span class="message hidden"></span>' +
        '   </div>' +
        '   <div class="col-md-3">' +
        '    <button class="btn btn-warning btn-xs cancel"><i class="icon-remove"></i>Cancel</button>' +
        '    <button class="btn btn-xs clear hidden">Clear</button>' +
        '   </div>' +
        '</div>';

    var MultiUploader =  plugins.Plugin.inherit({
        klassName : "Uploader",
        pluginName : "lark.multiuploader",

        options: {
            uploadUrl: '/upload',

        	params: {
                formParamName : "file"
            },

    	    maxConnections: 3,
        	// validation
        	allowedExtensions: [],
        	sizeLimit: 0,
        	minSizeLimit: 0,

            autoUpload: false,
            selectors : {
              fileList : ".file-list",
              fileItem : ".file-item",
              nodata : ".file-list .no-data",

              picker   : ".file-picker",
              dropzone : ".file-dropzone",
              pastezone: ".file-pastezone",

              startUploads: '.start-uploads',
              cancelUploads: '.cancel-uploads',
            },

            template : fileListTemplate,

            dataType: 'json',

            fileItem : {
            	selectors : {
                    name : ".name",
                    size : ".size",
                    cancel: ".cancel",
                    clear : ".clear",
                    progress : ".progress",
                    message : ".message"                   
            	},

            	template : fileItemTemplate
            }
        },


        _construct : function(elm,options) {
            var self = this;


            // Render current files
            /*
            this.files.forEach(function (file) {
                self.renderFile(file);
            });
            */

            //this._refresh({files:true});
        

            //this._files.on('all', function(){
            //  self._refresh({files:true});
            //});


           this.overrided(elm,options);


           this._velm = elmx(this._elm);
        


            this._initEventHandler();
            this._initFileHandlers();
            this._initUpoadHandler();
            this._updateFileList();
        },

        _initFileHandlers : function() {
            var self = this;

            var selectors = this.options.selectors,
            	dzSelector = selectors.dropzone,
            	pzSelector = selectors.pastezone,
            	pkSelector = selectors.picker;

            if (dzSelector) {
				this._velm.$(dzSelector).dropzone({
	                dropped : function (files) {
                        self._addFiles(files);
	                }
				});
            }


            if (pzSelector) {
                this._velm.$(pzSelector).pastezone({
                    pasted : function (files) {
                        self._addFiles(files);
                    }
                });                
            }

            if (pkSelector) {
                this._velm.$(pkSelector).picker({
                    multiple: true,
                    picked : function (files) {
                        self._addFiles(files);
                    }
                });                
            }
        },

        _initUpoadHandler: function(){
            var self = this,
                handlerClass;

            this._handler = new FileUpload({
                url: this.options.uploadUrl,
                maxConnections: this.options.maxConnections,
                onProgress: function(id, fileName, loaded, total){
                    self._onProgress(id, fileName, loaded, total);
                },
                onComplete: function(id, fileName, result){
                    self._onComplete(id, fileName, result);
                },
                onCancel: function(id, fileName){
                    self._onCancel(id, fileName);
                },
                onFailure: function(id,fileName,e){
                    self._onFailure(id,fileName,e);
                }
            });
        },
        
         /**
         * delegate click event for cancel link
         **/
        _initEventHandler: function(){
            var self = this,
               selectors = this.options.selectors,
               itemSelectors = this.options.fileItem.selectors, 
               list = this._listElement;

            // Add cancel handler
            this._velm.$(selectors.fileList).on("click",itemSelectors.cancel,function(e){
                var $fileItem = $(this).closest(selectors.fileItem),
                    fileId = $fileItem.data("fileId");
                self._handler.cancel(fileId);
                $fileItem.remove();
                self._updateFileList();
            });

            // Add clear handler
            this._velm.$(selectors.fileList).on("click",itemSelectors.clear,function(e){
                var $fileItem = $(this).closest(selectors.fileItem),
                    fileId = $fileItem.data("fileId");
                $fileItem.remove();
                self._updateFileList();
            });

            // Add cancel all handler
            this._velm.$(selectors.cancelUploads).click(function(){
                var $files = self._velm.$(selectors.fileList).find(selectors.fileItem);           
                $files.forEach(function(fileItem){
                    var $fileItem = $(fileItem),
                        fileId = $fileItem.data("fileId");
                    self._handler.cancel(fileId);
                    $fileItem.remove();
                });
                self._updateFileList();

            });

            // Add start uploads handler
            this._velm.$(selectors.startUploads).click(function(){
                var $files = self._velm.$(selectors.fileList).find(selectors.fileItem);           
                $files.forEach(function(fileItem){
                    var $fileItem = $(fileItem),
                        fileId = $fileItem.data("fileId");
                    if (!$fileItem.data("status")) {
                        // The file has not yet been sent
                        self._handler.send(fileId,self.options.params);
                    }
                });

            });
            

        },       

        _onProgress: function(id, fileName, loaded, total){          
            var $item = this._getItemByFileId(id);

            var percent = parseInt(loaded / total * 100, 10);
            var progressHTML = this._formatSize(loaded)+' of '+ this._formatSize(total);

            $item.data("status","running");
            $item.find('.progress')
                .find('.bar')
                .css('width', percent+'%')
                .parent()
                .find('.progress-label')
                .html(progressHTML);
            this._updateFile($item);

        },

        _onComplete: function(id, fileName, result){
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","done");
            $item.find('.message').html('<i class="icon-success"></i> ' + (this.doneMsg || 'Uploaded'));
            this._updateFile($item);
        },

        _onFailure : function(id,fileName,e) {
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","error");
            $item.find('.message').html('<i class="icon-error"></i> ');;
            this._updateFile($item)

        },

        _onCancel: function(id, fileName){
            this._filesInProgress--;
            var $item = this._getItemByFileId(id);
            $item.data("status","cancel");
            this._updateFile($item)
        },

        _addToList: function(id, fileName){
            var self = this;


            var fileName = this._handler.getName(id),
                fileSize = this._handler.getSize(id);

            var item = $(this.options.fileItem.template);
            item.data("fileId",id);

            item.find(this.options.fileItem.selectors.name).html(this._formatFileName(fileName));
            item.find(this.options.fileItem.selectors.size).html(this._formatSize(fileSize));

            this._velm.$(this.options.selectors.fileList).append(item);

            this._updateFileList();
        },
    
        _updateFileList : function ()  {
            var selectors = this.options.selectors,
                itemSelectors = this.options.fileItem.selectors,
                files = this._velm.$(selectors.fileList).find(selectors.fileItem);

            var with_files_elements = this._velm.$(selectors.cancelUploads + ',' + selectors.startUploads);
            var without_files_elements = this._velm.$(selectors.nodata);
            if (files.length > 0) {
                with_files_elements.removeClass('hidden');
                without_files_elements.addClass('hidden');
            } else {
                with_files_elements.addClass('hidden');
                without_files_elements.removeClass('hidden');
            }
        },
        
        _updateFile: function ($item) {
            var selectors = this.options.fileItem.selectors,
                when_pending = $item.find(selectors.size + "," + selectors.cancel),
                when_running = $item.find(selectors.progress + "," + selectors.cancel),
                when_done = $item.find(selectors.message + "," + selectors.clear);

            var status = $item.data("status");    
            if (status == "pending") {
                when_running.add(when_done).addClass('hidden');
                when_pending.removeClass('hidden');
            } else if (status == "running") {
                when_pending.add(when_done).addClass('hidden');
                when_running.removeClass('hidden');
            } else if (status == "done" || status == "error") {
                when_pending.add(when_running).addClass('hidden');
                when_done.removeClass('hidden');
            }
        },

        _getItemByFileId: function(id){
            var selectors = this.options.selectors,
                files = this._velm.$(selectors.fileList).find(selectors.fileItem),
                item;

            // there can't be txt nodes in dynamically created list
            // and we can  use nextSibling

            for (var i = 0; i<files.length;i++){
                var item2 = files[i];
                if ($(item2).data("fileId") == id) {
                    item = item2;
                    break;
                }
            }
            if (item) {
                return $(item);
            }
        },


            
        _addFiles: function(files){
            for (var i=0; i<files.length; i++){
                if ( !this._validateFile(files[i])){
                    return;
                }
            }

            for (var i=0; i<files.length; i++){
                this._addFile(files[i]);
            }
        },

        _addFile: function(file){
            var id = this._handler.add(file);

            this._filesInProgress++;
            this._addToList(id);

            //this._handler.upload(id, this.options.params);
        },

        _validateFile: function(file){
            var name, size;

            if (file.value){
                // it is a file input
                // get input value and remove path to normalize
                name = file.value.replace(/.*(\/|\\)/, "");
            } else {
                // fix missing properties in Safari
                name = file.fileName != null ? file.fileName : file.name;
                size = file.fileSize != null ? file.fileSize : file.size;
            }

            if (! this._isAllowedExtension(name)){
                this._error('typeError', name);
                return false;

            } else if (size === 0){
                this._error('emptyError', name);
                return false;

            } else if (size && this.options.sizeLimit && size > this.options.sizeLimit){
                this._error('sizeError', name);
                return false;

            } else if (size && size < this.options.minSizeLimit){
                this._error('minSizeError', name);
                return false;
            }

            return true;
        },

        _error: function(code, fileName){
            var message = this.options.messages[code];
            function r(name, replacement){ message = message.replace(name, replacement); }

            r('{file}', this._formatFileName(fileName));
            r('{extensions}', this.options.allowedExtensions.join(', '));
            r('{sizeLimit}', this._formatSize(this.options.sizeLimit));
            r('{minSizeLimit}', this._formatSize(this.options.minSizeLimit));

            this.options.showMessage(message);
        },

        _formatFileName: function(name){
            if (name.length > 33){
                name = name.slice(0, 19) + '...' + name.slice(-13);
            }
            return name;
        },

        _isAllowedExtension: function(fileName){
            var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
            var allowed = this.options.allowedExtensions;

            if (!allowed.length){return true;}

            for (var i=0; i<allowed.length; i++){
                if (allowed[i].toLowerCase() == ext){ return true;}
            }

            return false;
        },

        _formatSize: function(bytes){
            var i = -1;
            do {
                bytes = bytes / 1024;
                i++;
            } while (bytes > 99);

            return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
        }

    });

   plugins.register(MultiUploader);



	return files.MultiUploader = MultiUploader;
});
define('skylark-domx-files/main',[
	"./files",
	"skylark-domx-velm",
	"skylark-domx-query",
	"./dropzone",
	"./pastezone",
	"./picker",
	"./MultiUploader"
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

define('skylark-widgets-coder/util',[
    "skylark-langx/langx",
    "skylark-net-http/Xhr"
],function (langx,Xhr) {
    'use strict';

    function fetch(url, callback) {
        /*
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(url, xhr);
            }
        };
        xhr.onerror = function (err) {
            callback(err);
        };
        xhr.send();
        */
        Xhr.get(url).then(
            function(res) {
                callback(null,res);
            },
            function(e){
                callback(e);
            }
        )
    }
    function runCallback(index, params, arr, errors, callback) {
        return function (err, res) {
            if (err) {
                errors.push(err);
            }
            index++;
            if (index < arr.length) {
                seqRunner(index, res, arr, errors, callback);
            } else {
                callback(errors, res);
            }
        };
    }
    function seqRunner(index, params, arr, errors, callback) {
        arr[index](params, runCallback.apply(this, arguments));
    }
    function seq(arr, params, callback = function () {
    }) {
        var errors = [];
        if (!arr.length) {
            return callback(errors, params);
        }
        seqRunner(0, params, arr, errors, callback);
    }
    function log() {
        console.log(arguments);
    }


    var defaultModemap = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'less': 'less',
        'styl': 'stylus',
        'coffee': 'coffeescript'
    };
    function getMode(type = '', file = '', customModemap = {}) {
        var modemap = langx.mixin({}, defaultModemap,customModemap);
        for (let key in modemap) {
            let keyLength = key.length;
            if (file.slice(-keyLength++) === '.' + key) {
                return modemap[key];
            }
        }
        for (let key in modemap) {
            if (type === key) {
                return modemap[key];
            }
        }
        return type;
    }
    return {
        fetch,
        seq,
        log,
        getMode
    };
});
define('skylark-widgets-coder/template',[],function () {
    'use strict';
    function container() {
        return `
    <ul class="coder-nav">
      <li class="coder-nav-item coder-nav-item-result">
        <a href="#" data-coder-type="result">
          Result
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-html">
        <a href="#" data-coder-type="html">
          HTML
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-css">
        <a href="#" data-coder-type="css">
          CSS
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-js">
        <a href="#" data-coder-type="js">
          JavaScript
        </a>
      </li>
    </ul>
    <div class="coder-pane coder-pane-result"><iframe></iframe></div>
    <div class="coder-pane coder-pane-html"></div>
    <div class="coder-pane coder-pane-css"></div>
    <div class="coder-pane coder-pane-js"></div>
  `;
    }
    function paneActiveClass(type) {
        return `coder-pane-active-${ type }`;
    }
    function containerClass() {
        return 'coder';
    }
    function hasFileClass(type) {
        return `coder-has-${ type }`;
    }
    function editorClass(type) {
        return `coder-editor coder-editor-${ type }`;
    }
    function editorContent(type, fileUrl = '') {
        return `
    <textarea data-coder-type="${ type }" data-coder-file="${ fileUrl }"></textarea>
    <div class="coder-status"></div>
  `;
    }
    function statusMessage(err) {
        return `
    <p>${ err }</p>
  `;
    }
    function statusClass(type) {
        return `coder-status-${ type }`;
    }
    function statusActiveClass(type) {
        return `coder-status-active-${ type }`;
    }
    function pluginClass(name) {
        return `coder-plugin-${ name }`;
    }
    function statusLoading(url) {
        return `Loading <strong>${ url }</strong>..`;
    }
    function statusFetchError(url) {
        return `There was an error loading <strong>${ url }</strong>.`;
    }
    return {
        container: container,
        paneActiveClass: paneActiveClass,
        containerClass: containerClass,
        hasFileClass: hasFileClass,
        editorClass: editorClass,
        editorContent: editorContent,
        statusMessage: statusMessage,
        statusClass: statusClass,
        statusActiveClass: statusActiveClass,
        pluginClass: pluginClass,
        statusLoading: statusLoading,
        statusFetchError: statusFetchError
    };
});
define('skylark-widgets-coder/addons',[],function(){
	return {
	    general : {

	    },

	    html : {
      
	    },

	    css : {
      
	    },

	    js : {
      
	    },

	    edit : {
      
	    }	
	};
});
define('skylark-widgets-coder/Coder',[
    'skylark-langx/skylark',
    'skylark-langx/langx',
    'skylark-widgets-base/Widget',
    "skylark-domx-styler",
    "skylark-domx-data",
    './util',
    './template',
    "./addons"
], function (skylark,langx,Widget, styler,datax,util, template,addons) {
    'use strict';
    class Coder extends Widget{
        get klassName() {
          return "Coder";
        } 

        get pluginName(){
          return "lark.coder";
        } 

        //default options
        get options () {
            return {
                files: [],
                showBlank: false,
                runScripts: true,
                pane: 'result',
                debounce: 250,
                addons: {
                    "general" : ["render"]
                }
            }
        }

        _init ($coderContainer, opts) {
            //if (!$coderContainer) {
            //    throw new Error("Can't find Coder container.");
            // }

            var options = this.options;
            if (options.runScripts === false) {
                options.addons.gerneral.push('scriptless');
            }

            super._init();
            //Widget.prototype._init.call(this);

            var _private = {};
            this._get = function (key) {
                return _private[key];
            };
            this._set = function (key, value) {
                _private[key] = value;
                return _private[key];
            };


            this._set('cachedContent', {
                html: null,
                css: null,
                js: null
            });

            var $container = this.$container = this._elm;

            var paneActive = this._set('paneActive', options.pane);

            var velm = this._velm;
            velm.html(template.container())
                .addClass(template.containerClass())
                .addClass(template.paneActiveClass(paneActive))
                .on('keyup', langx.debounce(this.change.bind(this), options.debounce))
                .on('change', langx.debounce(this.change.bind(this), options.debounce))
                .on('click', this.pane.bind(this));

            this._set('$status', {});
            for (let type of [
                    'html',
                    'css',
                    'js'
                ]) {
                this.markup(type);
            }
        }

        _startup() {
            var options = this.options;
            this.paneActive = this._get('paneActive');
            for (let type of [
                    'html',
                    'css',
                    'js'
                ]) {
                this.load(type);
            }
            if (options.showBlank) {
                for (let type of [
                        'html',
                        'css',
                        'js'
                    ]) {
                    this._velm.addClass(template.hasFileClass(type));
                }
            }

        }

        findFile(type) {
            var file = {};
            //var options = this._get('options');
            var options = this.options;
            for (let fileIndex in options.files) {
                let file = options.files[fileIndex];
                if (file.type === type) {
                    return file;
                }
            }
            return file;
        }
        markup(type) {
            //var $container = this._get('$container');
            var $container = this._elm;
            var $parent = $container.querySelector(`.coder-pane-${ type }`);
            var file = this.findFile(type);
            var $editor = document.createElement('div');
            $editor.innerHTML = template.editorContent(type, file.url);
            $editor.className = template.editorClass(type);
            $parent.appendChild($editor);
            this._get('$status')[type] = $parent.querySelector('.coder-status');
            if (typeof file.url !== 'undefined' || typeof file.content !== 'undefined') {
                styler.addClass($container, template.hasFileClass(type));
            }
        }
        load(type) {
            var file = this.findFile(type);
            //var $textarea = this._get('$container').querySelector(`.coder-pane-${ type } textarea`);
            var $textarea = this._elm.querySelector(`.coder-pane-${ type } textarea`);
            if (typeof file.content !== 'undefined') {
                this.setValue($textarea, file.content);
            } else if (typeof file.url !== 'undefined') {
                this.status('loading', [template.statusLoading(file.url)], {
                    type: type,
                    file: file
                });
                util.fetch(file.url, (err, res) => {
                    if (err) {
                        this.status('error', [template.statusFetchError(err)], { type: type });
                        return;
                    }
                    this.clearStatus('loading', { type: type });
                    this.setValue($textarea, res);
                });
            } else {
                this.setValue($textarea, '');
            }
        }
        setValue($textarea, val) {
            $textarea.value = val;
            this.change({ target: $textarea });
        }
        change(e) {
            var type = datax.data(e.target, 'coder-type');
            if (!type) {
                return;
            }
            var cachedContent = this._get('cachedContent');
            if (cachedContent[type] === e.target.value) {
                return;
            }
            cachedContent[type] = e.target.value;
            this.emit('change', {
                type: type,
                file: datax.data(e.target, 'coder-file'),
                content: cachedContent[type]
            });
        }
        errors(errs, params) {
            this.status('error', errs, params);
        }
        pane(e) {
            if (!datax.data(e.target, 'coder-type')) {
                return;
            }
            //var $container = this._get('$container');
            var $container = this._elm;
            var paneActive = this._get('paneActive');
            styler.removeClass($container, template.paneActiveClass(paneActive));
            paneActive = this._set('paneActive', datax.data(e.target, 'coder-type'));
            styler.addClass($container, template.paneActiveClass(paneActive));
            e.preventDefault();
        }
        status(statusType = 'error', messages = [], params = {}) {
            if (!messages.length) {
                return this.clearStatus(statusType, params);
            }
            var $status = this._get('$status');
            styler.addClass($status[params.type], template.statusClass(statusType));
            //styler.addClass(this._get('$container'), template.statusActiveClass(params.type));
            styler.addClass(this._elm, template.statusActiveClass(params.type));
            var markup = '';
            messages.forEach(function (err) {
                markup += template.statusMessage(err);
            });
            $status[params.type].innerHTML = markup;
        }
        clearStatus(statusType, params) {
            var $status = this._get('$status');
            styler.removeClass($status[params.type], template.statusClass(statusType));
            //styler.removeClass(this._get('$container'), template.statusActiveClass(params.type));
            styler.removeClass(this._elm, template.statusActiveClass(params.type));
            $status[params.type].innerHTML = '';
        }
    }
    Coder.addons = addons;

    return skylark.attach("widgets.Coder",Coder);
});
define('skylark-codemirror/cm',[
	"skylark-langx/skylark"
],function(skylark){

	return skylark.attach("intg.cm", {});
});
define('skylark-codemirror/primitives/util/browser',[],function () {
    'use strict';
    let userAgent = navigator.userAgent;
    let platform = navigator.platform;
    let gecko = /gecko\/\d/i.test(userAgent);
    let ie_upto10 = /MSIE \d/.test(userAgent);
    let ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
    let edge = /Edge\/(\d+)/.exec(userAgent);
    let ie = ie_upto10 || ie_11up || edge;
    let ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
    let webkit = !edge && /WebKit\//.test(userAgent);
    let qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
    let chrome = !edge && /Chrome\//.test(userAgent);
    let presto = /Opera\//.test(userAgent);
    let safari = /Apple Computer/.test(navigator.vendor);
    let mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
    let phantom = /PhantomJS/.test(userAgent);
    let ios = !edge && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
    let android = /Android/.test(userAgent);
    let mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    let mac = ios || /Mac/.test(platform);
    let chromeOS = /\bCrOS\b/.test(userAgent);
    let windows = /win/i.test(platform);
    let presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
    if (presto_version)
        presto_version = Number(presto_version[1]);
    if (presto_version && presto_version >= 15) {
        presto = false;
        webkit = true;
    }
    let flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
    let captureRightClick = gecko || ie && ie_version >= 9;
    return {
        gecko: gecko,
        ie: ie,
        ie_version: ie_version,
        webkit: webkit,
        chrome: chrome,
        presto: presto,
        safari: safari,
        mac_geMountainLion: mac_geMountainLion,
        phantom: phantom,
        ios: ios,
        android: android,
        mobile: mobile,
        mac: mac,
        chromeOS: chromeOS,
        windows: windows,
        flipCtrlCmd: flipCtrlCmd,
        captureRightClick: captureRightClick
    };
});
define('skylark-codemirror/primitives/util/dom',['./browser'], function (a) {
    'use strict';
    function classTest(cls) {
        return new RegExp('(^|\\s)' + cls + '(?:$|\\s)\\s*');
    }
    let rmClass = function (node, cls) {
        let current = node.className;
        let match = classTest(cls).exec(current);
        if (match) {
            let after = current.slice(match.index + match[0].length);
            node.className = current.slice(0, match.index) + (after ? match[1] + after : '');
        }
    };
    function removeChildren(e) {
        for (let count = e.childNodes.length; count > 0; --count)
            e.removeChild(e.firstChild);
        return e;
    }
    function removeChildrenAndAdd(parent, e) {
        return removeChildren(parent).appendChild(e);
    }
    function elt(tag, content, className, style) {
        let e = document.createElement(tag);
        if (className)
            e.className = className;
        if (style)
            e.style.cssText = style;
        if (typeof content == 'string')
            e.appendChild(document.createTextNode(content));
        else if (content)
            for (let i = 0; i < content.length; ++i)
                e.appendChild(content[i]);
        return e;
    }
    function eltP(tag, content, className, style) {
        let e = elt(tag, content, className, style);
        e.setAttribute('role', 'presentation');
        return e;
    }
    let range;
    if (document.createRange)
        range = function (node, start, end, endNode) {
            let r = document.createRange();
            r.setEnd(endNode || node, end);
            r.setStart(node, start);
            return r;
        };
    else
        range = function (node, start, end) {
            let r = document.body.createTextRange();
            try {
                r.moveToElementText(node.parentNode);
            } catch (e) {
                return r;
            }
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            return r;
        };
    function contains(parent, child) {
        if (child.nodeType == 3)
            child = child.parentNode;
        if (parent.contains)
            return parent.contains(child);
        do {
            if (child.nodeType == 11)
                child = child.host;
            if (child == parent)
                return true;
        } while (child = child.parentNode);
    }
    function activeElt() {
        let activeElement;
        try {
            activeElement = document.activeElement;
        } catch (e) {
            activeElement = document.body || null;
        }
        while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement)
            activeElement = activeElement.shadowRoot.activeElement;
        return activeElement;
    }
    function addClass(node, cls) {
        let current = node.className;
        if (!classTest(cls).test(current))
            node.className += (current ? ' ' : '') + cls;
    }
    function joinClasses(a, b) {
        let as = a.split(' ');
        for (let i = 0; i < as.length; i++)
            if (as[i] && !classTest(as[i]).test(b))
                b += ' ' + as[i];
        return b;
    }
    let selectInput = function (node) {
        node.select();
    };
    if (a.ios)
        selectInput = function (node) {
            node.selectionStart = 0;
            node.selectionEnd = node.value.length;
        };
    else if (a.ie)
        selectInput = function (node) {
            try {
                node.select();
            } catch (_e) {
            }
        };
    return {
        classTest: classTest,
        rmClass: rmClass,
        removeChildren: removeChildren,
        removeChildrenAndAdd: removeChildrenAndAdd,
        elt: elt,
        eltP: eltP,
        range: range,
        contains: contains,
        activeElt: activeElt,
        addClass: addClass,
        joinClasses: joinClasses,
        selectInput: selectInput
    };
});
define('skylark-codemirror/primitives/util/misc',[],function () {
    'use strict';
    function bind(f) {
        let args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return f.apply(null, args);
        };
    }
    function copyObj(obj, target, overwrite) {
        if (!target)
            target = {};
        for (let prop in obj)
            if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
                target[prop] = obj[prop];
        return target;
    }
    function countColumn(string, end, tabSize, startIndex, startValue) {
        if (end == null) {
            end = string.search(/[^\s\u00a0]/);
            if (end == -1)
                end = string.length;
        }
        for (let i = startIndex || 0, n = startValue || 0;;) {
            let nextTab = string.indexOf('\t', i);
            if (nextTab < 0 || nextTab >= end)
                return n + (end - i);
            n += nextTab - i;
            n += tabSize - n % tabSize;
            i = nextTab + 1;
        }
    }
    class Delayed {
        constructor() {
            this.id = null;
        }
        set(ms, f) {
            clearTimeout(this.id);
            this.id = setTimeout(f, ms);
        }
    }
    function indexOf(array, elt) {
        for (let i = 0; i < array.length; ++i)
            if (array[i] == elt)
                return i;
        return -1;
    }
    let scrollerGap = 30;
    let Pass = {
        toString: function () {
            return 'CodeMirror.Pass';
        }
    };
    let sel_dontScroll = { scroll: false }, sel_mouse = { origin: '*mouse' }, sel_move = { origin: '+move' };
    function findColumn(string, goal, tabSize) {
        for (let pos = 0, col = 0;;) {
            let nextTab = string.indexOf('\t', pos);
            if (nextTab == -1)
                nextTab = string.length;
            let skipped = nextTab - pos;
            if (nextTab == string.length || col + skipped >= goal)
                return pos + Math.min(skipped, goal - col);
            col += nextTab - pos;
            col += tabSize - col % tabSize;
            pos = nextTab + 1;
            if (col >= goal)
                return pos;
        }
    }
    let spaceStrs = [''];
    function spaceStr(n) {
        while (spaceStrs.length <= n)
            spaceStrs.push(lst(spaceStrs) + ' ');
        return spaceStrs[n];
    }
    function lst(arr) {
        return arr[arr.length - 1];
    }
    function map(array, f) {
        let out = [];
        for (let i = 0; i < array.length; i++)
            out[i] = f(array[i], i);
        return out;
    }
    function insertSorted(array, value, score) {
        let pos = 0, priority = score(value);
        while (pos < array.length && score(array[pos]) <= priority)
            pos++;
        array.splice(pos, 0, value);
    }
    function nothing() {
    }
    function createObj(base, props) {
        let inst;
        if (Object.create) {
            inst = Object.create(base);
        } else {
            nothing.prototype = base;
            inst = new nothing();
        }
        if (props)
            copyObj(props, inst);
        return inst;
    }
    let nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function isWordCharBasic(ch) {
        return /\w/.test(ch) || ch > '\x80' && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
    }
    function isWordChar(ch, helper) {
        if (!helper)
            return isWordCharBasic(ch);
        if (helper.source.indexOf('\\w') > -1 && isWordCharBasic(ch))
            return true;
        return helper.test(ch);
    }
    function isEmpty(obj) {
        for (let n in obj)
            if (obj.hasOwnProperty(n) && obj[n])
                return false;
        return true;
    }
    let extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function isExtendingChar(ch) {
        return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
    }
    function skipExtendingChars(str, pos, dir) {
        while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos)))
            pos += dir;
        return pos;
    }
    function findFirst(pred, from, to) {
        let dir = from > to ? -1 : 1;
        for (;;) {
            if (from == to)
                return from;
            let midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
            if (mid == from)
                return pred(mid) ? from : to;
            if (pred(mid))
                to = mid;
            else
                from = mid + dir;
        }
    }
    return {
        bind: bind,
        copyObj: copyObj,
        countColumn: countColumn,
        Delayed: Delayed,
        indexOf: indexOf,
        scrollerGap: scrollerGap,
        Pass: Pass,
        sel_dontScroll: sel_dontScroll,
        sel_mouse: sel_mouse,
        sel_move: sel_move,
        findColumn: findColumn,
        spaceStr: spaceStr,
        lst: lst,
        map: map,
        insertSorted: insertSorted,
        createObj: createObj,
        isWordCharBasic: isWordCharBasic,
        isWordChar: isWordChar,
        isEmpty: isEmpty,
        isExtendingChar: isExtendingChar,
        skipExtendingChars: skipExtendingChars,
        findFirst: findFirst
    };
});
define('skylark-codemirror/primitives/display/Display',[
    '../util/browser',
    '../util/dom',
    '../util/misc'
], function (browser, dom, misc) {
    'use strict';
    function Display(place, doc, input) {
        let d = this;
        this.input = input;
        d.scrollbarFiller = dom.elt('div', null, 'CodeMirror-scrollbar-filler');
        d.scrollbarFiller.setAttribute('cm-not-content', 'true');
        d.gutterFiller = dom.elt('div', null, 'CodeMirror-gutter-filler');
        d.gutterFiller.setAttribute('cm-not-content', 'true');
        d.lineDiv = dom.eltP('div', null, 'CodeMirror-code');
        d.selectionDiv = dom.elt('div', null, null, 'position: relative; z-index: 1');
        d.cursorDiv = dom.elt('div', null, 'CodeMirror-cursors');
        d.measure = dom.elt('div', null, 'CodeMirror-measure');
        d.lineMeasure = dom.elt('div', null, 'CodeMirror-measure');
        d.lineSpace = dom.eltP('div', [
            d.measure,
            d.lineMeasure,
            d.selectionDiv,
            d.cursorDiv,
            d.lineDiv
        ], null, 'position: relative; outline: none');
        let lines = dom.eltP('div', [d.lineSpace], 'CodeMirror-lines');
        d.mover = dom.elt('div', [lines], null, 'position: relative');
        d.sizer = dom.elt('div', [d.mover], 'CodeMirror-sizer');
        d.sizerWidth = null;
        d.heightForcer = dom.elt('div', null, null, 'position: absolute; height: ' + misc.scrollerGap + 'px; width: 1px;');
        d.gutters = dom.elt('div', null, 'CodeMirror-gutters');
        d.lineGutter = null;
        d.scroller = dom.elt('div', [
            d.sizer,
            d.heightForcer,
            d.gutters
        ], 'CodeMirror-scroll');
        d.scroller.setAttribute('tabIndex', '-1');
        d.wrapper = dom.elt('div', [
            d.scrollbarFiller,
            d.gutterFiller,
            d.scroller
        ], 'CodeMirror');
        if (browser.ie && browser.ie_version < 8) {
            d.gutters.style.zIndex = -1;
            d.scroller.style.paddingRight = 0;
        }
        if (!browser.webkit && !(browser.gecko && browser.mobile))
            d.scroller.draggable = true;
        if (place) {
            if (place.appendChild)
                place.appendChild(d.wrapper);
            else
                place(d.wrapper);
        }
        d.viewFrom = d.viewTo = doc.first;
        d.reportedViewFrom = d.reportedViewTo = doc.first;
        d.view = [];
        d.renderedView = null;
        d.externalMeasured = null;
        d.viewOffset = 0;
        d.lastWrapHeight = d.lastWrapWidth = 0;
        d.updateLineNumbers = null;
        d.nativeBarWidth = d.barHeight = d.barWidth = 0;
        d.scrollbarsClipped = false;
        d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
        d.alignWidgets = false;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.maxLine = null;
        d.maxLineLength = 0;
        d.maxLineChanged = false;
        d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
        d.shift = false;
        d.selForContextMenu = null;
        d.activeTouch = null;
        input.init(d);
    }
    return { Display: Display };
});
define('skylark-codemirror/primitives/line/utils_line',['../util/misc'], function (a) {
    'use strict';
    function getLine(doc, n) {
        n -= doc.first;
        if (n < 0 || n >= doc.size)
            throw new Error('There is no line ' + (n + doc.first) + ' in the document.');
        let chunk = doc;
        while (!chunk.lines) {
            for (let i = 0;; ++i) {
                let child = chunk.children[i], sz = child.chunkSize();
                if (n < sz) {
                    chunk = child;
                    break;
                }
                n -= sz;
            }
        }
        return chunk.lines[n];
    }
    function getBetween(doc, start, end) {
        let out = [], n = start.line;
        doc.iter(start.line, end.line + 1, line => {
            let text = line.text;
            if (n == end.line)
                text = text.slice(0, end.ch);
            if (n == start.line)
                text = text.slice(start.ch);
            out.push(text);
            ++n;
        });
        return out;
    }
    function getLines(doc, from, to) {
        let out = [];
        doc.iter(from, to, line => {
            out.push(line.text);
        });
        return out;
    }
    function updateLineHeight(line, height) {
        let diff = height - line.height;
        if (diff)
            for (let n = line; n; n = n.parent)
                n.height += diff;
    }
    function lineNo(line) {
        if (line.parent == null)
            return null;
        let cur = line.parent, no = a.indexOf(cur.lines, line);
        for (let chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
            for (let i = 0;; ++i) {
                if (chunk.children[i] == cur)
                    break;
                no += chunk.children[i].chunkSize();
            }
        }
        return no + cur.first;
    }
    function lineAtHeight(chunk, h) {
        let n = chunk.first;
        outer:
            do {
                for (let i = 0; i < chunk.children.length; ++i) {
                    let child = chunk.children[i], ch = child.height;
                    if (h < ch) {
                        chunk = child;
                        continue outer;
                    }
                    h -= ch;
                    n += child.chunkSize();
                }
                return n;
            } while (!chunk.lines);
        let i = 0;
        for (; i < chunk.lines.length; ++i) {
            let line = chunk.lines[i], lh = line.height;
            if (h < lh)
                break;
            h -= lh;
        }
        return n + i;
    }
    function isLine(doc, l) {
        return l >= doc.first && l < doc.first + doc.size;
    }
    function lineNumberFor(options, i) {
        return String(options.lineNumberFormatter(i + options.firstLineNumber));
    }
    return {
        getLine: getLine,
        getBetween: getBetween,
        getLines: getLines,
        updateLineHeight: updateLineHeight,
        lineNo: lineNo,
        lineAtHeight: lineAtHeight,
        isLine: isLine,
        lineNumberFor: lineNumberFor
    };
});
define('skylark-codemirror/primitives/line/pos',['./utils_line'], function (utils_line) {
    'use strict';
    function Pos(line, ch, sticky = null) {
        if (!(this instanceof Pos))
            return new Pos(line, ch, sticky);
        this.line = line;
        this.ch = ch;
        this.sticky = sticky;
    }
    function cmp(a, b) {
        return a.line - b.line || a.ch - b.ch;
    }
    function equalCursorPos(a, b) {
        return a.sticky == b.sticky && cmp(a, b) == 0;
    }
    function copyPos(x) {
        return Pos(x.line, x.ch);
    }
    function maxPos(a, b) {
        return cmp(a, b) < 0 ? b : a;
    }
    function minPos(a, b) {
        return cmp(a, b) < 0 ? a : b;
    }
    function clipLine(doc, n) {
        return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
    }
    function clipPos(doc, pos) {
        if (pos.line < doc.first)
            return Pos(doc.first, 0);
        let last = doc.first + doc.size - 1;
        if (pos.line > last)
            return Pos(last, utils_line.getLine(doc, last).text.length);
        return clipToLen(pos, utils_line.getLine(doc, pos.line).text.length);
    }
    function clipToLen(pos, linelen) {
        let ch = pos.ch;
        if (ch == null || ch > linelen)
            return Pos(pos.line, linelen);
        else if (ch < 0)
            return Pos(pos.line, 0);
        else
            return pos;
    }
    function clipPosArray(doc, array) {
        let out = [];
        for (let i = 0; i < array.length; i++)
            out[i] = clipPos(doc, array[i]);
        return out;
    }
    return {
        Pos: Pos,
        cmp: cmp,
        equalCursorPos: equalCursorPos,
        copyPos: copyPos,
        maxPos: maxPos,
        minPos: minPos,
        clipLine: clipLine,
        clipPos: clipPos,
        clipPosArray: clipPosArray
    };
});
define('skylark-codemirror/primitives/line/saw_special_spans',[],function () {
    'use strict';
    let sawReadOnlySpans = false, sawCollapsedSpans = false;
    function seeReadOnlySpans() {
        sawReadOnlySpans = true;
    }
    function seeCollapsedSpans() {
        sawCollapsedSpans = true;
    }
    return {
        sawReadOnlySpans: sawReadOnlySpans,
        sawCollapsedSpans: sawCollapsedSpans,
        seeReadOnlySpans: seeReadOnlySpans,
        seeCollapsedSpans: seeCollapsedSpans
    };
});
define('skylark-codemirror/primitives/line/spans',[
    '../util/misc',
    './pos',
    './saw_special_spans',
    './utils_line'
], function (misc, pos, saw_special_spans, utils_line) {
    'use strict';
    function MarkedSpan(marker, from, to) {
        this.marker = marker;
        this.from = from;
        this.to = to;
    }
    function getMarkedSpanFor(spans, marker) {
        if (spans)
            for (let i = 0; i < spans.length; ++i) {
                let span = spans[i];
                if (span.marker == marker)
                    return span;
            }
    }
    function removeMarkedSpan(spans, span) {
        let r;
        for (let i = 0; i < spans.length; ++i)
            if (spans[i] != span)
                (r || (r = [])).push(spans[i]);
        return r;
    }
    function addMarkedSpan(line, span) {
        line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
        span.marker.attachLine(line);
    }
    function markedSpansBefore(old, startCh, isInsert) {
        let nw;
        if (old)
            for (let i = 0; i < old.length; ++i) {
                let span = old[i], marker = span.marker;
                let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
                if (startsBefore || span.from == startCh && marker.type == 'bookmark' && (!isInsert || !span.marker.insertLeft)) {
                    let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
                }
            }
        return nw;
    }
    function markedSpansAfter(old, endCh, isInsert) {
        let nw;
        if (old)
            for (let i = 0; i < old.length; ++i) {
                let span = old[i], marker = span.marker;
                let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
                if (endsAfter || span.from == endCh && marker.type == 'bookmark' && (!isInsert || span.marker.insertLeft)) {
                    let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, span.to == null ? null : span.to - endCh));
                }
            }
        return nw;
    }
    function stretchSpansOverChange(doc, change) {
        if (change.full)
            return null;
        let oldFirst = utils_line.isLine(doc, change.from.line) && utils_line.getLine(doc, change.from.line).markedSpans;
        let oldLast = utils_line.isLine(doc, change.to.line) && utils_line.getLine(doc, change.to.line).markedSpans;
        if (!oldFirst && !oldLast)
            return null;
        let startCh = change.from.ch, endCh = change.to.ch, isInsert = pos.cmp(change.from, change.to) == 0;
        let first = markedSpansBefore(oldFirst, startCh, isInsert);
        let last = markedSpansAfter(oldLast, endCh, isInsert);
        let sameLine = change.text.length == 1, offset = misc.lst(change.text).length + (sameLine ? startCh : 0);
        if (first) {
            for (let i = 0; i < first.length; ++i) {
                let span = first[i];
                if (span.to == null) {
                    let found = getMarkedSpanFor(last, span.marker);
                    if (!found)
                        span.to = startCh;
                    else if (sameLine)
                        span.to = found.to == null ? null : found.to + offset;
                }
            }
        }
        if (last) {
            for (let i = 0; i < last.length; ++i) {
                let span = last[i];
                if (span.to != null)
                    span.to += offset;
                if (span.from == null) {
                    let found = getMarkedSpanFor(first, span.marker);
                    if (!found) {
                        span.from = offset;
                        if (sameLine)
                            (first || (first = [])).push(span);
                    }
                } else {
                    span.from += offset;
                    if (sameLine)
                        (first || (first = [])).push(span);
                }
            }
        }
        if (first)
            first = clearEmptySpans(first);
        if (last && last != first)
            last = clearEmptySpans(last);
        let newMarkers = [first];
        if (!sameLine) {
            let gap = change.text.length - 2, gapMarkers;
            if (gap > 0 && first)
                for (let i = 0; i < first.length; ++i)
                    if (first[i].to == null)
                        (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
            for (let i = 0; i < gap; ++i)
                newMarkers.push(gapMarkers);
            newMarkers.push(last);
        }
        return newMarkers;
    }
    function clearEmptySpans(spans) {
        for (let i = 0; i < spans.length; ++i) {
            let span = spans[i];
            if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
                spans.splice(i--, 1);
        }
        if (!spans.length)
            return null;
        return spans;
    }
    function removeReadOnlyRanges(doc, from, to) {
        let markers = null;
        doc.iter(from.line, to.line + 1, line => {
            if (line.markedSpans)
                for (let i = 0; i < line.markedSpans.length; ++i) {
                    let mark = line.markedSpans[i].marker;
                    if (mark.readOnly && (!markers || misc.indexOf(markers, mark) == -1))
                        (markers || (markers = [])).push(mark);
                }
        });
        if (!markers)
            return null;
        let parts = [{
                from: from,
                to: to
            }];
        for (let i = 0; i < markers.length; ++i) {
            let mk = markers[i], m = mk.find(0);
            for (let j = 0; j < parts.length; ++j) {
                let p = parts[j];
                if (pos.cmp(p.to, m.from) < 0 || pos.cmp(p.from, m.to) > 0)
                    continue;
                let newParts = [
                        j,
                        1
                    ], dfrom = pos.cmp(p.from, m.from), dto = pos.cmp(p.to, m.to);
                if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
                    newParts.push({
                        from: p.from,
                        to: m.from
                    });
                if (dto > 0 || !mk.inclusiveRight && !dto)
                    newParts.push({
                        from: m.to,
                        to: p.to
                    });
                parts.splice.apply(parts, newParts);
                j += newParts.length - 3;
            }
        }
        return parts;
    }
    function detachMarkedSpans(line) {
        let spans = line.markedSpans;
        if (!spans)
            return;
        for (let i = 0; i < spans.length; ++i)
            spans[i].marker.detachLine(line);
        line.markedSpans = null;
    }
    function attachMarkedSpans(line, spans) {
        if (!spans)
            return;
        for (let i = 0; i < spans.length; ++i)
            spans[i].marker.attachLine(line);
        line.markedSpans = spans;
    }
    function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
    }
    function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
    }
    function compareCollapsedMarkers(a, b) {
        let lenDiff = a.lines.length - b.lines.length;
        if (lenDiff != 0)
            return lenDiff;
        let aPos = a.find(), bPos = b.find();
        let fromCmp = pos.cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
        if (fromCmp)
            return -fromCmp;
        let toCmp = pos.cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
        if (toCmp)
            return toCmp;
        return b.id - a.id;
    }
    function collapsedSpanAtSide(line, start) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans, found;
        if (sps)
            for (let sp, i = 0; i < sps.length; ++i) {
                sp = sps[i];
                if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0))
                    found = sp.marker;
            }
        return found;
    }
    function collapsedSpanAtStart(line) {
        return collapsedSpanAtSide(line, true);
    }
    function collapsedSpanAtEnd(line) {
        return collapsedSpanAtSide(line, false);
    }
    function collapsedSpanAround(line, ch) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans, found;
        if (sps)
            for (let i = 0; i < sps.length; ++i) {
                let sp = sps[i];
                if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0))
                    found = sp.marker;
            }
        return found;
    }
    function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
        let line = utils_line.getLine(doc, utils_line.lineNo);
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans;
        if (sps)
            for (let i = 0; i < sps.length; ++i) {
                let sp = sps[i];
                if (!sp.marker.collapsed)
                    continue;
                let found = sp.marker.find(0);
                let fromCmp = pos.cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
                let toCmp = pos.cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
                if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0)
                    continue;
                if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? pos.cmp(found.to, from) >= 0 : pos.cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? pos.cmp(found.from, to) <= 0 : pos.cmp(found.from, to) < 0))
                    return true;
            }
    }
    function visualLine(line) {
        let merged;
        while (merged = collapsedSpanAtStart(line))
            line = merged.find(-1, true).line;
        return line;
    }
    function visualLineEnd(line) {
        let merged;
        while (merged = collapsedSpanAtEnd(line))
            line = merged.find(1, true).line;
        return line;
    }
    function visualLineContinued(line) {
        let merged, lines;
        while (merged = collapsedSpanAtEnd(line)) {
            line = merged.find(1, true).line;
            (lines || (lines = [])).push(line);
        }
        return lines;
    }
    function visualLineNo(doc, lineN) {
        let line = utils_line.getLine(doc, lineN), vis = visualLine(line);
        if (line == vis)
            return lineN;
        return utils_line.lineNo(vis);
    }
    function visualLineEndNo(doc, lineN) {
        if (lineN > doc.lastLine())
            return lineN;
        let line = utils_line.getLine(doc, lineN), merged;
        if (!lineIsHidden(doc, line))
            return lineN;
        while (merged = collapsedSpanAtEnd(line))
            line = merged.find(1, true).line;
        return utils_line.lineNo(line) + 1;
    }
    function lineIsHidden(doc, line) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans;
        if (sps)
            for (let sp, i = 0; i < sps.length; ++i) {
                sp = sps[i];
                if (!sp.marker.collapsed)
                    continue;
                if (sp.from == null)
                    return true;
                if (sp.marker.widgetNode)
                    continue;
                if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
                    return true;
            }
    }
    function lineIsHiddenInner(doc, line, span) {
        if (span.to == null) {
            let end = span.marker.find(1, true);
            return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
        }
        if (span.marker.inclusiveRight && span.to == line.text.length)
            return true;
        for (let sp, i = 0; i < line.markedSpans.length; ++i) {
            sp = line.markedSpans[i];
            if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp))
                return true;
        }
    }
    function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        let h = 0, chunk = lineObj.parent;
        for (let i = 0; i < chunk.lines.length; ++i) {
            let line = chunk.lines[i];
            if (line == lineObj)
                break;
            else
                h += line.height;
        }
        for (let p = chunk.parent; p; chunk = p, p = chunk.parent) {
            for (let i = 0; i < p.children.length; ++i) {
                let cur = p.children[i];
                if (cur == chunk)
                    break;
                else
                    h += cur.height;
            }
        }
        return h;
    }
    function lineLength(line) {
        if (line.height == 0)
            return 0;
        let len = line.text.length, merged, cur = line;
        while (merged = collapsedSpanAtStart(cur)) {
            let found = merged.find(0, true);
            cur = found.from.line;
            len += found.from.ch - found.to.ch;
        }
        cur = line;
        while (merged = collapsedSpanAtEnd(cur)) {
            let found = merged.find(0, true);
            len -= cur.text.length - found.from.ch;
            cur = found.to.line;
            len += cur.text.length - found.to.ch;
        }
        return len;
    }
    function findMaxLine(cm) {
        let d = cm.display, doc = cm.doc;
        d.maxLine = utils_line.getLine(doc, doc.first);
        d.maxLineLength = lineLength(d.maxLine);
        d.maxLineChanged = true;
        doc.iter(line => {
            let len = lineLength(line);
            if (len > d.maxLineLength) {
                d.maxLineLength = len;
                d.maxLine = line;
            }
        });
    }
    return {
        MarkedSpan: MarkedSpan,
        getMarkedSpanFor: getMarkedSpanFor,
        removeMarkedSpan: removeMarkedSpan,
        addMarkedSpan: addMarkedSpan,
        stretchSpansOverChange: stretchSpansOverChange,
        removeReadOnlyRanges: removeReadOnlyRanges,
        detachMarkedSpans: detachMarkedSpans,
        attachMarkedSpans: attachMarkedSpans,
        compareCollapsedMarkers: compareCollapsedMarkers,
        collapsedSpanAtStart: collapsedSpanAtStart,
        collapsedSpanAtEnd: collapsedSpanAtEnd,
        collapsedSpanAround: collapsedSpanAround,
        conflictingCollapsedRange: conflictingCollapsedRange,
        visualLine: visualLine,
        visualLineEnd: visualLineEnd,
        visualLineContinued: visualLineContinued,
        visualLineNo: visualLineNo,
        visualLineEndNo: visualLineEndNo,
        lineIsHidden: lineIsHidden,
        heightAtLine: heightAtLine,
        lineLength: lineLength,
        findMaxLine: findMaxLine
    };
});
define('skylark-codemirror/primitives/util/bidi',['./misc'], function (a) {
    'use strict';
    function iterateBidiSections(order, from, to, f) {
        if (!order)
            return f(from, to, 'ltr', 0);
        let found = false;
        for (let i = 0; i < order.length; ++i) {
            let part = order[i];
            if (part.from < to && part.to > from || from == to && part.to == from) {
                f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? 'rtl' : 'ltr', i);
                found = true;
            }
        }
        if (!found)
            f(from, to, 'ltr');
    }
    let bidiOther = null;
    function getBidiPartAt(order, ch, sticky) {
        let found;
        bidiOther = null;
        for (let i = 0; i < order.length; ++i) {
            let cur = order[i];
            if (cur.from < ch && cur.to > ch)
                return i;
            if (cur.to == ch) {
                if (cur.from != cur.to && sticky == 'before')
                    found = i;
                else
                    bidiOther = i;
            }
            if (cur.from == ch) {
                if (cur.from != cur.to && sticky != 'before')
                    found = i;
                else
                    bidiOther = i;
            }
        }
        return found != null ? found : bidiOther;
    }
    let bidiOrdering = function () {
        let lowTypes = 'bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN';
        let arabicTypes = 'nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111';
        function charType(code) {
            if (code <= 247)
                return lowTypes.charAt(code);
            else if (1424 <= code && code <= 1524)
                return 'R';
            else if (1536 <= code && code <= 1785)
                return arabicTypes.charAt(code - 1536);
            else if (1774 <= code && code <= 2220)
                return 'r';
            else if (8192 <= code && code <= 8203)
                return 'w';
            else if (code == 8204)
                return 'b';
            else
                return 'L';
        }
        let bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        let isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
            this.level = level;
            this.from = from;
            this.to = to;
        }
        return function (str, direction) {
            let outerType = direction == 'ltr' ? 'L' : 'R';
            if (str.length == 0 || direction == 'ltr' && !bidiRE.test(str))
                return false;
            let len = str.length, types = [];
            for (let i = 0; i < len; ++i)
                types.push(charType(str.charCodeAt(i)));
            for (let i = 0, prev = outerType; i < len; ++i) {
                let type = types[i];
                if (type == 'm')
                    types[i] = prev;
                else
                    prev = type;
            }
            for (let i = 0, cur = outerType; i < len; ++i) {
                let type = types[i];
                if (type == '1' && cur == 'r')
                    types[i] = 'n';
                else if (isStrong.test(type)) {
                    cur = type;
                    if (type == 'r')
                        types[i] = 'R';
                }
            }
            for (let i = 1, prev = types[0]; i < len - 1; ++i) {
                let type = types[i];
                if (type == '+' && prev == '1' && types[i + 1] == '1')
                    types[i] = '1';
                else if (type == ',' && prev == types[i + 1] && (prev == '1' || prev == 'n'))
                    types[i] = prev;
                prev = type;
            }
            for (let i = 0; i < len; ++i) {
                let type = types[i];
                if (type == ',')
                    types[i] = 'N';
                else if (type == '%') {
                    let end;
                    for (end = i + 1; end < len && types[end] == '%'; ++end) {
                    }
                    let replace = i && types[i - 1] == '!' || end < len && types[end] == '1' ? '1' : 'N';
                    for (let j = i; j < end; ++j)
                        types[j] = replace;
                    i = end - 1;
                }
            }
            for (let i = 0, cur = outerType; i < len; ++i) {
                let type = types[i];
                if (cur == 'L' && type == '1')
                    types[i] = 'L';
                else if (isStrong.test(type))
                    cur = type;
            }
            for (let i = 0; i < len; ++i) {
                if (isNeutral.test(types[i])) {
                    let end;
                    for (end = i + 1; end < len && isNeutral.test(types[end]); ++end) {
                    }
                    let before = (i ? types[i - 1] : outerType) == 'L';
                    let after = (end < len ? types[end] : outerType) == 'L';
                    let replace = before == after ? before ? 'L' : 'R' : outerType;
                    for (let j = i; j < end; ++j)
                        types[j] = replace;
                    i = end - 1;
                }
            }
            let order = [], m;
            for (let i = 0; i < len;) {
                if (countsAsLeft.test(types[i])) {
                    let start = i;
                    for (++i; i < len && countsAsLeft.test(types[i]); ++i) {
                    }
                    order.push(new BidiSpan(0, start, i));
                } else {
                    let pos = i, at = order.length;
                    for (++i; i < len && types[i] != 'L'; ++i) {
                    }
                    for (let j = pos; j < i;) {
                        if (countsAsNum.test(types[j])) {
                            if (pos < j)
                                order.splice(at, 0, new BidiSpan(1, pos, j));
                            let nstart = j;
                            for (++j; j < i && countsAsNum.test(types[j]); ++j) {
                            }
                            order.splice(at, 0, new BidiSpan(2, nstart, j));
                            pos = j;
                        } else
                            ++j;
                    }
                    if (pos < i)
                        order.splice(at, 0, new BidiSpan(1, pos, i));
                }
            }
            if (direction == 'ltr') {
                if (order[0].level == 1 && (m = str.match(/^\s+/))) {
                    order[0].from = m[0].length;
                    order.unshift(new BidiSpan(0, 0, m[0].length));
                }
                if (a.lst(order).level == 1 && (m = str.match(/\s+$/))) {
                    a.lst(order).to -= m[0].length;
                    order.push(new BidiSpan(0, len - m[0].length, len));
                }
            }
            return direction == 'rtl' ? order.reverse() : order;
        };
    }();
    function getOrder(line, direction) {
        let order = line.order;
        if (order == null)
            order = line.order = bidiOrdering(line.text, direction);
        return order;
    }
    return {
        iterateBidiSections: iterateBidiSections,
        bidiOther: bidiOther,
        getBidiPartAt: getBidiPartAt,
        getOrder: getOrder
    };
});
define('skylark-codemirror/primitives/util/event',[
    './browser',
    './misc'
], function (a, b) {
    'use strict';
    const noHandlers = [];
    let on = function (emitter, type, f) {
        if (emitter.addEventListener) {
            emitter.addEventListener(type, f, false);
        } else if (emitter.attachEvent) {
            emitter.attachEvent('on' + type, f);
        } else {
            let map = emitter._handlers || (emitter._handlers = {});
            map[type] = (map[type] || noHandlers).concat(f);
        }
    };
    function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
    }
    function off(emitter, type, f) {
        if (emitter.removeEventListener) {
            emitter.removeEventListener(type, f, false);
        } else if (emitter.detachEvent) {
            emitter.detachEvent('on' + type, f);
        } else {
            let map = emitter._handlers, arr = map && map[type];
            if (arr) {
                let index = b.indexOf(arr, f);
                if (index > -1)
                    map[type] = arr.slice(0, index).concat(arr.slice(index + 1));
            }
        }
    }
    function signal(emitter, type) {
        let handlers = getHandlers(emitter, type);
        if (!handlers.length)
            return;
        let args = Array.prototype.slice.call(arguments, 2);
        for (let i = 0; i < handlers.length; ++i)
            handlers[i].apply(null, args);
    }
    function signalDOMEvent(cm, e, override) {
        if (typeof e == 'string')
            e = {
                type: e,
                preventDefault: function () {
                    this.defaultPrevented = true;
                }
            };
        signal(cm, override || e.type, cm, e);
        return e_defaultPrevented(e) || e.codemirrorIgnore;
    }
    function signalCursorActivity(cm) {
        let arr = cm._handlers && cm._handlers.cursorActivity;
        if (!arr)
            return;
        let set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
        for (let i = 0; i < arr.length; ++i)
            if (b.indexOf(set, arr[i]) == -1)
                set.push(arr[i]);
    }
    function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
    }
    function eventMixin(ctor) {
        ctor.prototype.on = function (type, f) {
            on(this, type, f);
        };
        ctor.prototype.off = function (type, f) {
            off(this, type, f);
        };
    }
    function e_preventDefault(e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
    }
    function e_stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
    function e_defaultPrevented(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
    }
    function e_stop(e) {
        e_preventDefault(e);
        e_stopPropagation(e);
    }
    function e_target(e) {
        return e.target || e.srcElement;
    }
    function e_button(e) {
        let b = e.which;
        if (b == null) {
            if (e.button & 1)
                b = 1;
            else if (e.button & 2)
                b = 3;
            else if (e.button & 4)
                b = 2;
        }
        if (a.mac && e.ctrlKey && b == 1)
            b = 3;
        return b;
    }
    return {
        on: on,
        getHandlers: getHandlers,
        off: off,
        signal: signal,
        signalDOMEvent: signalDOMEvent,
        signalCursorActivity: signalCursorActivity,
        hasHandler: hasHandler,
        eventMixin: eventMixin,
        e_preventDefault: e_preventDefault,
        e_stopPropagation: e_stopPropagation,
        e_defaultPrevented: e_defaultPrevented,
        e_stop: e_stop,
        e_target: e_target,
        e_button: e_button
    };
});
define('skylark-codemirror/primitives/util/feature_detection',[
    './dom',
    './browser'
], function (a, b) {
    'use strict';
    let dragAndDrop = function () {
        if (b.ie && b.ie_version < 9)
            return false;
        let div = a.elt('div');
        return 'draggable' in div || 'dragDrop' in div;
    }();
    let zwspSupported;
    function zeroWidthElement(measure) {
        if (zwspSupported == null) {
            let test = a.elt('span', '\u200B');
            a.removeChildrenAndAdd(measure, a.elt('span', [
                test,
                document.createTextNode('x')
            ]));
            if (measure.firstChild.offsetHeight != 0)
                zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(b.ie && b.ie_version < 8);
        }
        let node = zwspSupported ? a.elt('span', '\u200B') : a.elt('span', '\xA0', null, 'display: inline-block; width: 1px; margin-right: -1px');
        node.setAttribute('cm-text', '');
        return node;
    }
    let badBidiRects;
    function hasBadBidiRects(measure) {
        if (badBidiRects != null)
            return badBidiRects;
        let txt = a.removeChildrenAndAdd(measure, document.createTextNode('AخA'));
        let r0 = a.range(txt, 0, 1).getBoundingClientRect();
        let r1 = a.range(txt, 1, 2).getBoundingClientRect();
        a.removeChildren(measure);
        if (!r0 || r0.left == r0.right)
            return false;
        return badBidiRects = r1.right - r0.right < 3;
    }
    let splitLinesAuto = '\n\nb'.split(/\n/).length != 3 ? string => {
        let pos = 0, result = [], l = string.length;
        while (pos <= l) {
            let nl = string.indexOf('\n', pos);
            if (nl == -1)
                nl = string.length;
            let line = string.slice(pos, string.charAt(nl - 1) == '\r' ? nl - 1 : nl);
            let rt = line.indexOf('\r');
            if (rt != -1) {
                result.push(line.slice(0, rt));
                pos += rt + 1;
            } else {
                result.push(line);
                pos = nl + 1;
            }
        }
        return result;
    } : string => string.split(/\r\n?|\n/);
    let hasSelection = window.getSelection ? te => {
        try {
            return te.selectionStart != te.selectionEnd;
        } catch (e) {
            return false;
        }
    } : te => {
        let range;
        try {
            range = te.ownerDocument.selection.createRange();
        } catch (e) {
        }
        if (!range || range.parentElement() != te)
            return false;
        return range.compareEndPoints('StartToEnd', range) != 0;
    };
    let hasCopyEvent = (() => {
        let e = a.elt('div');
        if ('oncopy' in e)
            return true;
        e.setAttribute('oncopy', 'return;');
        return typeof e.oncopy == 'function';
    })();
    let badZoomedRects = null;
    function hasBadZoomedRects(measure) {
        if (badZoomedRects != null)
            return badZoomedRects;
        let node = a.removeChildrenAndAdd(measure, a.elt('span', 'x'));
        let normal = node.getBoundingClientRect();
        let fromRange = a.range(node, 0, 1).getBoundingClientRect();
        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
    }
    return {
        dragAndDrop: dragAndDrop,
        zeroWidthElement: zeroWidthElement,
        hasBadBidiRects: hasBadBidiRects,
        splitLinesAuto: splitLinesAuto,
        hasSelection: hasSelection,
        hasCopyEvent: hasCopyEvent,
        hasBadZoomedRects: hasBadZoomedRects
    };
});
define('skylark-codemirror/primitives/modes',['./util/misc'], function (misc) {
    'use strict';
    let modes = {}, mimeModes = {};
    function defineMode(name, mode) {
        if (arguments.length > 2)
            mode.dependencies = Array.prototype.slice.call(arguments, 2);
        modes[name] = mode;
    }
    function defineMIME(mime, spec) {
        mimeModes[mime] = spec;
    }
    function resolveMode(spec) {
        if (typeof spec == 'string' && mimeModes.hasOwnProperty(spec)) {
            spec = mimeModes[spec];
        } else if (spec && typeof spec.name == 'string' && mimeModes.hasOwnProperty(spec.name)) {
            let found = mimeModes[spec.name];
            if (typeof found == 'string')
                found = { name: found };
            spec = misc.createObj(found, spec);
            spec.name = found.name;
        } else if (typeof spec == 'string' && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
            return resolveMode('application/xml');
        } else if (typeof spec == 'string' && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
            return resolveMode('application/json');
        }
        if (typeof spec == 'string')
            return { name: spec };
        else
            return spec || { name: 'null' };
    }
    function getMode(options, spec) {
        spec = resolveMode(spec);
        let mfactory = modes[spec.name];
        if (!mfactory)
            return getMode(options, 'text/plain');
        let modeObj = mfactory(options, spec);
        if (modeExtensions.hasOwnProperty(spec.name)) {
            let exts = modeExtensions[spec.name];
            for (let prop in exts) {
                if (!exts.hasOwnProperty(prop))
                    continue;
                if (modeObj.hasOwnProperty(prop))
                    modeObj['_' + prop] = modeObj[prop];
                modeObj[prop] = exts[prop];
            }
        }
        modeObj.name = spec.name;
        if (spec.helperType)
            modeObj.helperType = spec.helperType;
        if (spec.modeProps)
            for (let prop in spec.modeProps)
                modeObj[prop] = spec.modeProps[prop];
        return modeObj;
    }
    let modeExtensions = {};
    function extendMode(mode, properties) {
        let exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
        misc.copyObj(properties, exts);
    }
    function copyState(mode, state) {
        if (state === true)
            return state;
        if (mode.copyState)
            return mode.copyState(state);
        let nstate = {};
        for (let n in state) {
            let val = state[n];
            if (val instanceof Array)
                val = val.concat([]);
            nstate[n] = val;
        }
        return nstate;
    }
    function innerMode(mode, state) {
        let info;
        while (mode.innerMode) {
            info = mode.innerMode(state);
            if (!info || info.mode == mode)
                break;
            state = info.state;
            mode = info.mode;
        }
        return info || {
            mode: mode,
            state: state
        };
    }
    function startState(mode, a1, a2) {
        return mode.startState ? mode.startState(a1, a2) : true;
    }
    return {
        modes: modes,
        mimeModes: mimeModes,
        defineMode: defineMode,
        defineMIME: defineMIME,
        resolveMode: resolveMode,
        getMode: getMode,
        modeExtensions: modeExtensions,
        extendMode: extendMode,
        copyState: copyState,
        innerMode: innerMode,
        startState: startState
    };
});
define('skylark-codemirror/primitives/util/StringStream',['./misc'], function (a) {
    'use strict';
    class StringStream {
        constructor(string, tabSize, lineOracle) {
            this.pos = this.start = 0;
            this.string = string;
            this.tabSize = tabSize || 8;
            this.lastColumnPos = this.lastColumnValue = 0;
            this.lineStart = 0;
            this.lineOracle = lineOracle;
        }
        eol() {
            return this.pos >= this.string.length;
        }
        sol() {
            return this.pos == this.lineStart;
        }
        peek() {
            return this.string.charAt(this.pos) || undefined;
        }
        next() {
            if (this.pos < this.string.length)
                return this.string.charAt(this.pos++);
        }
        eat(match) {
            let ch = this.string.charAt(this.pos);
            let ok;
            if (typeof match == 'string')
                ok = ch == match;
            else
                ok = ch && (match.test ? match.test(ch) : match(ch));
            if (ok) {
                ++this.pos;
                return ch;
            }
        }
        eatWhile(match) {
            let start = this.pos;
            while (this.eat(match)) {
            }
            return this.pos > start;
        }
        eatSpace() {
            let start = this.pos;
            while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))
                ++this.pos;
            return this.pos > start;
        }
        skipToEnd() {
            this.pos = this.string.length;
        }
        skipTo(ch) {
            let found = this.string.indexOf(ch, this.pos);
            if (found > -1) {
                this.pos = found;
                return true;
            }
        }
        backUp(n) {
            this.pos -= n;
        }
        column() {
            if (this.lastColumnPos < this.start) {
                this.lastColumnValue = a.countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
                this.lastColumnPos = this.start;
            }
            return this.lastColumnValue - (this.lineStart ? a.countColumn(this.string, this.lineStart, this.tabSize) : 0);
        }
        indentation() {
            return a.countColumn(this.string, null, this.tabSize) - (this.lineStart ? a.countColumn(this.string, this.lineStart, this.tabSize) : 0);
        }
        match(pattern, consume, caseInsensitive) {
            if (typeof pattern == 'string') {
                let cased = str => caseInsensitive ? str.toLowerCase() : str;
                let substr = this.string.substr(this.pos, pattern.length);
                if (cased(substr) == cased(pattern)) {
                    if (consume !== false)
                        this.pos += pattern.length;
                    return true;
                }
            } else {
                let match = this.string.slice(this.pos).match(pattern);
                if (match && match.index > 0)
                    return null;
                if (match && consume !== false)
                    this.pos += match[0].length;
                return match;
            }
        }
        current() {
            return this.string.slice(this.start, this.pos);
        }
        hideFirstChars(n, inner) {
            this.lineStart += n;
            try {
                return inner();
            } finally {
                this.lineStart -= n;
            }
        }
        lookAhead(n) {
            let oracle = this.lineOracle;
            return oracle && oracle.lookAhead(n);
        }
        baseToken() {
            let oracle = this.lineOracle;
            return oracle && oracle.baseToken(this.pos);
        }
    }
    return StringStream;
});
define('skylark-codemirror/primitives/line/highlight',[
    '../util/misc',
    '../modes',
    '../util/StringStream',
    './utils_line',
    './pos'
], function (misc, modes, StringStream, utils_line, line_pos) {
    'use strict';
    class SavedContext {
        constructor(state, lookAhead) {
            this.state = state;
            this.lookAhead = lookAhead;
        }
    }
    class Context {
        constructor(doc, state, line, lookAhead) {
            this.state = state;
            this.doc = doc;
            this.line = line;
            this.maxLookAhead = lookAhead || 0;
            this.baseTokens = null;
            this.baseTokenPos = 1;
        }
        lookAhead(n) {
            let line = this.doc.getLine(this.line + n);
            if (line != null && n > this.maxLookAhead)
                this.maxLookAhead = n;
            return line;
        }
        baseToken(n) {
            if (!this.baseTokens)
                return null;
            while (this.baseTokens[this.baseTokenPos] <= n)
                this.baseTokenPos += 2;
            let type = this.baseTokens[this.baseTokenPos + 1];
            return {
                type: type && type.replace(/( |^)overlay .*/, ''),
                size: this.baseTokens[this.baseTokenPos] - n
            };
        }
        nextLine() {
            this.line++;
            if (this.maxLookAhead > 0)
                this.maxLookAhead--;
        }
        static fromSaved(doc, saved, line) {
            if (saved instanceof SavedContext)
                return new Context(doc, modes.copyState(doc.mode, saved.state), line, saved.lookAhead);
            else
                return new Context(doc, modes.copyState(doc.mode, saved), line);
        }
        save(copy) {
            let state = copy !== false ? modes.copyState(this.doc.mode, this.state) : this.state;
            return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
        }
    }
    function highlightLine(cm, line, context, forceToEnd) {
        let st = [cm.state.modeGen], lineClasses = {};
        runMode(cm, line.text, cm.doc.mode, context, (end, style) => st.push(end, style), lineClasses, forceToEnd);
        let state = context.state;
        for (let o = 0; o < cm.state.overlays.length; ++o) {
            context.baseTokens = st;
            let overlay = cm.state.overlays[o], i = 1, at = 0;
            context.state = true;
            runMode(cm, line.text, overlay.mode, context, (end, style) => {
                let start = i;
                while (at < end) {
                    let i_end = st[i];
                    if (i_end > end)
                        st.splice(i, 1, end, st[i + 1], i_end);
                    i += 2;
                    at = Math.min(end, i_end);
                }
                if (!style)
                    return;
                if (overlay.opaque) {
                    st.splice(start, i - start, end, 'overlay ' + style);
                    i = start + 2;
                } else {
                    for (; start < i; start += 2) {
                        let cur = st[start + 1];
                        st[start + 1] = (cur ? cur + ' ' : '') + 'overlay ' + style;
                    }
                }
            }, lineClasses);
            context.state = state;
            context.baseTokens = null;
            context.baseTokenPos = 1;
        }
        return {
            styles: st,
            classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null
        };
    }
    function getLineStyles(cm, line, updateFrontier) {
        if (!line.styles || line.styles[0] != cm.state.modeGen) {
            let context = getContextBefore(cm, utils_line.lineNo(line));
            let resetState = line.text.length > cm.options.maxHighlightLength && modes.copyState(cm.doc.mode, context.state);
            let result = highlightLine(cm, line, context);
            if (resetState)
                context.state = resetState;
            line.stateAfter = context.save(!resetState);
            line.styles = result.styles;
            if (result.classes)
                line.styleClasses = result.classes;
            else if (line.styleClasses)
                line.styleClasses = null;
            if (updateFrontier === cm.doc.highlightFrontier)
                cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
        }
        return line.styles;
    }
    function getContextBefore(cm, n, precise) {
        let doc = cm.doc, display = cm.display;
        if (!doc.mode.startState)
            return new Context(doc, true, n);
        let start = findStartLine(cm, n, precise);
        let saved = start > doc.first && utils_line.getLine(doc, start - 1).stateAfter;
        let context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, modes.startState(doc.mode), start);
        doc.iter(start, n, line => {
            processLine(cm, line.text, context);
            let pos = context.line;
            line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
            context.nextLine();
        });
        if (precise)
            doc.modeFrontier = context.line;
        return context;
    }
    function processLine(cm, text, context, startAt) {
        let mode = cm.doc.mode;
        let stream = new StringStream(text, cm.options.tabSize, context);
        stream.start = stream.pos = startAt || 0;
        if (text == '')
            callBlankLine(mode, context.state);
        while (!stream.eol()) {
            readToken(mode, stream, context.state);
            stream.start = stream.pos;
        }
    }
    function callBlankLine(mode, state) {
        if (mode.blankLine)
            return mode.blankLine(state);
        if (!mode.innerMode)
            return;
        let inner = modes.innerMode(mode, state);
        if (inner.mode.blankLine)
            return inner.mode.blankLine(inner.state);
    }
    function readToken(mode, stream, state, inner) {
        for (let i = 0; i < 10; i++) {
            if (inner)
                inner[0] = modes.innerMode(mode, state).mode;
            let style = mode.token(stream, state);
            if (stream.pos > stream.start)
                return style;
        }
        throw new Error('Mode ' + mode.name + ' failed to advance stream.');
    }
    class Token {
        constructor(stream, type, state) {
            this.start = stream.start;
            this.end = stream.pos;
            this.string = stream.current();
            this.type = type || null;
            this.state = state;
        }
    }
    function takeToken(cm, pos, precise, asArray) {
        let doc = cm.doc, mode = doc.mode, style;
        pos = line_pos.clipPos(doc, pos);
        let line = utils_line.getLine(doc, pos.line), context = getContextBefore(cm, pos.line, precise);
        let stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
        if (asArray)
            tokens = [];
        while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
            stream.start = stream.pos;
            style = readToken(mode, stream, context.state);
            if (asArray)
                tokens.push(new Token(stream, style, modes.copyState(doc.mode, context.state)));
        }
        return asArray ? tokens : new Token(stream, style, context.state);
    }
    function extractLineClasses(type, output) {
        if (type)
            for (;;) {
                let lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!lineClass)
                    break;
                type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
                let prop = lineClass[1] ? 'bgClass' : 'textClass';
                if (output[prop] == null)
                    output[prop] = lineClass[2];
                else if (!new RegExp('(?:^|s)' + lineClass[2] + '(?:$|s)').test(output[prop]))
                    output[prop] += ' ' + lineClass[2];
            }
        return type;
    }
    function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
        let flattenSpans = mode.flattenSpans;
        if (flattenSpans == null)
            flattenSpans = cm.options.flattenSpans;
        let curStart = 0, curStyle = null;
        let stream = new StringStream(text, cm.options.tabSize, context), style;
        let inner = cm.options.addModeClass && [null];
        if (text == '')
            extractLineClasses(callBlankLine(mode, context.state), lineClasses);
        while (!stream.eol()) {
            if (stream.pos > cm.options.maxHighlightLength) {
                flattenSpans = false;
                if (forceToEnd)
                    processLine(cm, text, context, stream.pos);
                stream.pos = text.length;
                style = null;
            } else {
                style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
            }
            if (inner) {
                let mName = inner[0].name;
                if (mName)
                    style = 'm-' + (style ? mName + ' ' + style : mName);
            }
            if (!flattenSpans || curStyle != style) {
                while (curStart < stream.start) {
                    curStart = Math.min(stream.start, curStart + 5000);
                    f(curStart, curStyle);
                }
                curStyle = style;
            }
            stream.start = stream.pos;
        }
        while (curStart < stream.pos) {
            let pos = Math.min(stream.pos, curStart + 5000);
            f(pos, curStyle);
            curStart = pos;
        }
    }
    function findStartLine(cm, n, precise) {
        let minindent, minline, doc = cm.doc;
        let lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
        for (let search = n; search > lim; --search) {
            if (search <= doc.first)
                return doc.first;
            let line = utils_line.getLine(doc, search - 1), after = line.stateAfter;
            if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier))
                return search;
            let indented = misc.countColumn(line.text, null, cm.options.tabSize);
            if (minline == null || minindent > indented) {
                minline = search - 1;
                minindent = indented;
            }
        }
        return minline;
    }
    function retreatFrontier(doc, n) {
        doc.modeFrontier = Math.min(doc.modeFrontier, n);
        if (doc.highlightFrontier < n - 10)
            return;
        let start = doc.first;
        for (let line = n - 1; line > start; line--) {
            let saved = utils_line.getLine(doc, line).stateAfter;
            if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
                start = line + 1;
                break;
            }
        }
        doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
    }
    return {
        highlightLine: highlightLine,
        getLineStyles: getLineStyles,
        getContextBefore: getContextBefore,
        processLine: processLine,
        takeToken: takeToken,
        retreatFrontier: retreatFrontier
    };
});
define('skylark-codemirror/primitives/line/line_data',[
    '../util/bidi',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    './highlight',
    './spans',
    './utils_line'
], function (bidi, browser, dom, events, feature_detection, misc, highlight, spans, m_utils_line) {
    'use strict';
    class Line {
        constructor(text, markedSpans, estimateHeight) {
            this.text = text;
            spans.attachMarkedSpans(this, markedSpans);
            this.height = estimateHeight ? estimateHeight(this) : 1;
        }
        lineNo() {
            return m_utils_line.lineNo(this);
        }
    }
    events.eventMixin(Line);
    function updateLine(line, text, markedSpans, estimateHeight) {
        line.text = text;
        if (line.stateAfter)
            line.stateAfter = null;
        if (line.styles)
            line.styles = null;
        if (line.order != null)
            line.order = null;
        spans.detachMarkedSpans(line);
        spans.attachMarkedSpans(line, markedSpans);
        let estHeight = estimateHeight ? estimateHeight(line) : 1;
        if (estHeight != line.height)
            m_utils_line.updateLineHeight(line, estHeight);
    }
    function cleanUpLine(line) {
        line.parent = null;
        spans.detachMarkedSpans(line);
    }
    let styleToClassCache = {}, styleToClassCacheWithMode = {};
    function interpretTokenStyle(style, options) {
        if (!style || /^\s*$/.test(style))
            return null;
        let cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
        return cache[style] || (cache[style] = style.replace(/\S+/g, 'cm-$&'));
    }
    function buildLineContent(cm, lineView) {
        let content = dom.eltP('span', null, null, browser.webkit ? 'padding-right: .1px' : null);
        let builder = {
            pre: dom.eltP('pre', [content], 'CodeMirror-line'),
            content: content,
            col: 0,
            pos: 0,
            cm: cm,
            trailingSpace: false,
            splitSpaces: cm.getOption('lineWrapping')
        };
        lineView.measure = {};
        for (let i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
            let line = i ? lineView.rest[i - 1] : lineView.line, order;
            builder.pos = 0;
            builder.addToken = buildToken;
            if (feature_detection.hasBadBidiRects(cm.display.measure) && (order = bidi.getOrder(line, cm.doc.direction)))
                builder.addToken = buildTokenBadBidi(builder.addToken, order);
            builder.map = [];
            let allowFrontierUpdate = lineView != cm.display.externalMeasured && m_utils_line.lineNo(line);
            insertLineContent(line, builder, highlight.getLineStyles(cm, line, allowFrontierUpdate));
            if (line.styleClasses) {
                if (line.styleClasses.bgClass)
                    builder.bgClass = dom.joinClasses(line.styleClasses.bgClass, builder.bgClass || '');
                if (line.styleClasses.textClass)
                    builder.textClass = dom.joinClasses(line.styleClasses.textClass, builder.textClass || '');
            }
            if (builder.map.length == 0)
                builder.map.push(0, 0, builder.content.appendChild(feature_detection.zeroWidthElement(cm.display.measure)));
            if (i == 0) {
                lineView.measure.map = builder.map;
                lineView.measure.cache = {};
            } else {
                ;
                (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
                (lineView.measure.caches || (lineView.measure.caches = [])).push({});
            }
        }
        if (browser.webkit) {
            let last = builder.content.lastChild;
            if (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector('.cm-tab'))
                builder.content.className = 'cm-tab-wrap-hack';
        }
        events.signal(cm, 'renderLine', cm, lineView.line, builder.pre);
        if (builder.pre.className)
            builder.textClass = dom.joinClasses(builder.pre.className, builder.textClass || '');
        return builder;
    }
    function defaultSpecialCharPlaceholder(ch) {
        let token = dom.elt('span', '\u2022', 'cm-invalidchar');
        token.title = '\\u' + ch.charCodeAt(0).toString(16);
        token.setAttribute('aria-label', token.title);
        return token;
    }
    function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
        if (!text)
            return;
        let displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
        let special = builder.cm.state.specialChars, mustWrap = false;
        let content;
        if (!special.test(text)) {
            builder.col += text.length;
            content = document.createTextNode(displayText);
            builder.map.push(builder.pos, builder.pos + text.length, content);
            if (browser.ie && browser.ie_version < 9)
                mustWrap = true;
            builder.pos += text.length;
        } else {
            content = document.createDocumentFragment();
            let pos = 0;
            while (true) {
                special.lastIndex = pos;
                let m = special.exec(text);
                let skipped = m ? m.index - pos : text.length - pos;
                if (skipped) {
                    let txt = document.createTextNode(displayText.slice(pos, pos + skipped));
                    if (browser.ie && browser.ie_version < 9)
                        content.appendChild(dom.elt('span', [txt]));
                    else
                        content.appendChild(txt);
                    builder.map.push(builder.pos, builder.pos + skipped, txt);
                    builder.col += skipped;
                    builder.pos += skipped;
                }
                if (!m)
                    break;
                pos += skipped + 1;
                let txt;
                if (m[0] == '\t') {
                    let tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
                    txt = content.appendChild(dom.elt('span', misc.spaceStr(tabWidth), 'cm-tab'));
                    txt.setAttribute('role', 'presentation');
                    txt.setAttribute('cm-text', '\t');
                    builder.col += tabWidth;
                } else if (m[0] == '\r' || m[0] == '\n') {
                    txt = content.appendChild(dom.elt('span', m[0] == '\r' ? '\u240D' : '\u2424', 'cm-invalidchar'));
                    txt.setAttribute('cm-text', m[0]);
                    builder.col += 1;
                } else {
                    txt = builder.cm.options.specialCharPlaceholder(m[0]);
                    txt.setAttribute('cm-text', m[0]);
                    if (browser.ie && browser.ie_version < 9)
                        content.appendChild(dom.elt('span', [txt]));
                    else
                        content.appendChild(txt);
                    builder.col += 1;
                }
                builder.map.push(builder.pos, builder.pos + 1, txt);
                builder.pos++;
            }
        }
        builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;
        if (style || startStyle || endStyle || mustWrap || css) {
            let fullStyle = style || '';
            if (startStyle)
                fullStyle += startStyle;
            if (endStyle)
                fullStyle += endStyle;
            let token = dom.elt('span', [content], fullStyle, css);
            if (attributes) {
                for (let attr in attributes)
                    if (attributes.hasOwnProperty(attr) && attr != 'style' && attr != 'class')
                        token.setAttribute(attr, attributes[attr]);
            }
            return builder.content.appendChild(token);
        }
        builder.content.appendChild(content);
    }
    function splitSpaces(text, trailingBefore) {
        if (text.length > 1 && !/  /.test(text))
            return text;
        let spaceBefore = trailingBefore, result = '';
        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i);
            if (ch == ' ' && spaceBefore && (i == text.length - 1 || text.charCodeAt(i + 1) == 32))
                ch = '\xA0';
            result += ch;
            spaceBefore = ch == ' ';
        }
        return result;
    }
    function buildTokenBadBidi(inner, order) {
        return (builder, text, style, startStyle, endStyle, css, attributes) => {
            style = style ? style + ' cm-force-border' : 'cm-force-border';
            let start = builder.pos, end = start + text.length;
            for (;;) {
                let part;
                for (let i = 0; i < order.length; i++) {
                    part = order[i];
                    if (part.to > start && part.from <= start)
                        break;
                }
                if (part.to >= end)
                    return inner(builder, text, style, startStyle, endStyle, css, attributes);
                inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
                startStyle = null;
                text = text.slice(part.to - start);
                start = part.to;
            }
        };
    }
    function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
        let widget = !ignoreWidget && marker.widgetNode;
        if (widget)
            builder.map.push(builder.pos, builder.pos + size, widget);
        if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
            if (!widget)
                widget = builder.content.appendChild(document.createElement('span'));
            widget.setAttribute('cm-marker', marker.id);
        }
        if (widget) {
            builder.cm.display.input.setUneditable(widget);
            builder.content.appendChild(widget);
        }
        builder.pos += size;
        builder.trailingSpace = false;
    }
    function insertLineContent(line, builder, styles) {
        let spans = line.markedSpans, allText = line.text, at = 0;
        if (!spans) {
            for (let i = 1; i < styles.length; i += 2)
                builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i + 1], builder.cm.options));
            return;
        }
        let len = allText.length, pos = 0, i = 1, text = '', style, css;
        let nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
        for (;;) {
            if (nextChange == pos) {
                spanStyle = spanEndStyle = spanStartStyle = css = '';
                attributes = null;
                collapsed = null;
                nextChange = Infinity;
                let foundBookmarks = [], endStyles;
                for (let j = 0; j < spans.length; ++j) {
                    let sp = spans[j], m = sp.marker;
                    if (m.type == 'bookmark' && sp.from == pos && m.widgetNode) {
                        foundBookmarks.push(m);
                    } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
                        if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                            nextChange = sp.to;
                            spanEndStyle = '';
                        }
                        if (m.className)
                            spanStyle += ' ' + m.className;
                        if (m.css)
                            css = (css ? css + ';' : '') + m.css;
                        if (m.startStyle && sp.from == pos)
                            spanStartStyle += ' ' + m.startStyle;
                        if (m.endStyle && sp.to == nextChange)
                            (endStyles || (endStyles = [])).push(m.endStyle, sp.to);
                        if (m.title)
                            (attributes || (attributes = {})).title = m.title;
                        if (m.attributes) {
                            for (let attr in m.attributes)
                                (attributes || (attributes = {}))[attr] = m.attributes[attr];
                        }
                        if (m.collapsed && (!collapsed || spans.compareCollapsedMarkers(collapsed.marker, m) < 0))
                            collapsed = sp;
                    } else if (sp.from > pos && nextChange > sp.from) {
                        nextChange = sp.from;
                    }
                }
                if (endStyles)
                    for (let j = 0; j < endStyles.length; j += 2)
                        if (endStyles[j + 1] == nextChange)
                            spanEndStyle += ' ' + endStyles[j];
                if (!collapsed || collapsed.from == pos)
                    for (let j = 0; j < foundBookmarks.length; ++j)
                        buildCollapsedSpan(builder, 0, foundBookmarks[j]);
                if (collapsed && (collapsed.from || 0) == pos) {
                    buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos, collapsed.marker, collapsed.from == null);
                    if (collapsed.to == null)
                        return;
                    if (collapsed.to == pos)
                        collapsed = false;
                }
            }
            if (pos >= len)
                break;
            let upto = Math.min(len, nextChange);
            while (true) {
                if (text) {
                    let end = pos + text.length;
                    if (!collapsed) {
                        let tokenText = end > upto ? text.slice(0, upto - pos) : text;
                        builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : '', css, attributes);
                    }
                    if (end >= upto) {
                        text = text.slice(upto - pos);
                        pos = upto;
                        break;
                    }
                    pos = end;
                    spanStartStyle = '';
                }
                text = allText.slice(at, at = styles[i++]);
                style = interpretTokenStyle(styles[i++], builder.cm.options);
            }
        }
    }
    function LineView(doc, line, lineN) {
        this.line = line;
        this.rest = spans.visualLineContinued(line);
        this.size = this.rest ? m_utils_line.lineNo(misc.lst(this.rest)) - lineN + 1 : 1;
        this.node = this.text = null;
        this.hidden = spans.lineIsHidden(doc, line);
    }
    function buildViewArray(cm, from, to) {
        let array = [], nextPos;
        for (let pos = from; pos < to; pos = nextPos) {
            let view = new LineView(cm.doc, m_utils_line.getLine(cm.doc, pos), pos);
            nextPos = pos + view.size;
            array.push(view);
        }
        return array;
    }
    return {
        Line: Line,
        updateLine: updateLine,
        cleanUpLine: cleanUpLine,
        buildLineContent: buildLineContent,
        defaultSpecialCharPlaceholder: defaultSpecialCharPlaceholder,
        LineView: LineView,
        buildViewArray: buildViewArray
    };
});
define('skylark-codemirror/primitives/util/operation_group',['./event'], function (a) {
    'use strict';
    let operationGroup = null;
    function pushOperation(op) {
        if (operationGroup) {
            operationGroup.ops.push(op);
        } else {
            op.ownsGroup = operationGroup = {
                ops: [op],
                delayedCallbacks: []
            };
        }
    }
    function fireCallbacksForOps(group) {
        let callbacks = group.delayedCallbacks, i = 0;
        do {
            for (; i < callbacks.length; i++)
                callbacks[i].call(null);
            for (let j = 0; j < group.ops.length; j++) {
                let op = group.ops[j];
                if (op.cursorActivityHandlers)
                    while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
                        op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
            }
        } while (i < callbacks.length);
    }
    function finishOperation(op, endCb) {
        let group = op.ownsGroup;
        if (!group)
            return;
        try {
            fireCallbacksForOps(group);
        } finally {
            operationGroup = null;
            endCb(group);
        }
    }
    let orphanDelayedCallbacks = null;
    function signalLater(emitter, type) {
        let arr = a.getHandlers(emitter, type);
        if (!arr.length)
            return;
        let args = Array.prototype.slice.call(arguments, 2), list;
        if (operationGroup) {
            list = operationGroup.delayedCallbacks;
        } else if (orphanDelayedCallbacks) {
            list = orphanDelayedCallbacks;
        } else {
            list = orphanDelayedCallbacks = [];
            setTimeout(fireOrphanDelayed, 0);
        }
        for (let i = 0; i < arr.length; ++i)
            list.push(() => arr[i].apply(null, args));
    }
    function fireOrphanDelayed() {
        let delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for (let i = 0; i < delayed.length; ++i)
            delayed[i]();
    }
    return {
        pushOperation: pushOperation,
        finishOperation: finishOperation,
        signalLater: signalLater
    };
});
define('skylark-codemirror/primitives/display/update_line',[
    '../line/line_data',
    '../line/utils_line',
    '../util/browser',
    '../util/dom',
    '../util/operation_group'
], function (a, b, c, d, e) {
    'use strict';
    function updateLineForChanges(cm, lineView, lineN, dims) {
        for (let j = 0; j < lineView.changes.length; j++) {
            let type = lineView.changes[j];
            if (type == 'text')
                updateLineText(cm, lineView);
            else if (type == 'gutter')
                updateLineGutter(cm, lineView, lineN, dims);
            else if (type == 'class')
                updateLineClasses(cm, lineView);
            else if (type == 'widget')
                updateLineWidgets(cm, lineView, dims);
        }
        lineView.changes = null;
    }
    function ensureLineWrapped(lineView) {
        if (lineView.node == lineView.text) {
            lineView.node = d.elt('div', null, null, 'position: relative');
            if (lineView.text.parentNode)
                lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
            lineView.node.appendChild(lineView.text);
            if (c.ie && c.ie_version < 8)
                lineView.node.style.zIndex = 2;
        }
        return lineView.node;
    }
    function updateLineBackground(cm, lineView) {
        let cls = lineView.bgClass ? lineView.bgClass + ' ' + (lineView.line.bgClass || '') : lineView.line.bgClass;
        if (cls)
            cls += ' CodeMirror-linebackground';
        if (lineView.background) {
            if (cls)
                lineView.background.className = cls;
            else {
                lineView.background.parentNode.removeChild(lineView.background);
                lineView.background = null;
            }
        } else if (cls) {
            let wrap = ensureLineWrapped(lineView);
            lineView.background = wrap.insertBefore(d.elt('div', null, cls), wrap.firstChild);
            cm.display.input.setUneditable(lineView.background);
        }
    }
    function getLineContent(cm, lineView) {
        let ext = cm.display.externalMeasured;
        if (ext && ext.line == lineView.line) {
            cm.display.externalMeasured = null;
            lineView.measure = ext.measure;
            return ext.built;
        }
        return a.buildLineContent(cm, lineView);
    }
    function updateLineText(cm, lineView) {
        let cls = lineView.text.className;
        let built = getLineContent(cm, lineView);
        if (lineView.text == lineView.node)
            lineView.node = built.pre;
        lineView.text.parentNode.replaceChild(built.pre, lineView.text);
        lineView.text = built.pre;
        if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
            lineView.bgClass = built.bgClass;
            lineView.textClass = built.textClass;
            updateLineClasses(cm, lineView);
        } else if (cls) {
            lineView.text.className = cls;
        }
    }
    function updateLineClasses(cm, lineView) {
        updateLineBackground(cm, lineView);
        if (lineView.line.wrapClass)
            ensureLineWrapped(lineView).className = lineView.line.wrapClass;
        else if (lineView.node != lineView.text)
            lineView.node.className = '';
        let textClass = lineView.textClass ? lineView.textClass + ' ' + (lineView.line.textClass || '') : lineView.line.textClass;
        lineView.text.className = textClass || '';
    }
    function updateLineGutter(cm, lineView, lineN, dims) {
        if (lineView.gutter) {
            lineView.node.removeChild(lineView.gutter);
            lineView.gutter = null;
        }
        if (lineView.gutterBackground) {
            lineView.node.removeChild(lineView.gutterBackground);
            lineView.gutterBackground = null;
        }
        if (lineView.line.gutterClass) {
            let wrap = ensureLineWrapped(lineView);
            lineView.gutterBackground = d.elt('div', null, 'CodeMirror-gutter-background ' + lineView.line.gutterClass, `left: ${ cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth }px; width: ${ dims.gutterTotalWidth }px`);
            cm.display.input.setUneditable(lineView.gutterBackground);
            wrap.insertBefore(lineView.gutterBackground, lineView.text);
        }
        let markers = lineView.line.gutterMarkers;
        if (cm.options.lineNumbers || markers) {
            let wrap = ensureLineWrapped(lineView);
            let gutterWrap = lineView.gutter = d.elt('div', null, 'CodeMirror-gutter-wrapper', `left: ${ cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth }px`);
            cm.display.input.setUneditable(gutterWrap);
            wrap.insertBefore(gutterWrap, lineView.text);
            if (lineView.line.gutterClass)
                gutterWrap.className += ' ' + lineView.line.gutterClass;
            if (cm.options.lineNumbers && (!markers || !markers['CodeMirror-linenumbers']))
                lineView.lineNumber = gutterWrap.appendChild(d.elt('div', b.lineNumberFor(cm.options, lineN), 'CodeMirror-linenumber CodeMirror-gutter-elt', `left: ${ dims.gutterLeft['CodeMirror-linenumbers'] }px; width: ${ cm.display.lineNumInnerWidth }px`));
            if (markers)
                for (let k = 0; k < cm.options.gutters.length; ++k) {
                    let id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
                    if (found)
                        gutterWrap.appendChild(d.elt('div', [found], 'CodeMirror-gutter-elt', `left: ${ dims.gutterLeft[id] }px; width: ${ dims.gutterWidth[id] }px`));
                }
        }
    }
    function updateLineWidgets(cm, lineView, dims) {
        if (lineView.alignable)
            lineView.alignable = null;
        for (let node = lineView.node.firstChild, next; node; node = next) {
            next = node.nextSibling;
            if (node.className == 'CodeMirror-linewidget')
                lineView.node.removeChild(node);
        }
        insertLineWidgets(cm, lineView, dims);
    }
    function buildLineElement(cm, lineView, lineN, dims) {
        let built = getLineContent(cm, lineView);
        lineView.text = lineView.node = built.pre;
        if (built.bgClass)
            lineView.bgClass = built.bgClass;
        if (built.textClass)
            lineView.textClass = built.textClass;
        updateLineClasses(cm, lineView);
        updateLineGutter(cm, lineView, lineN, dims);
        insertLineWidgets(cm, lineView, dims);
        return lineView.node;
    }
    function insertLineWidgets(cm, lineView, dims) {
        insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
        if (lineView.rest)
            for (let i = 0; i < lineView.rest.length; i++)
                insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
    }
    function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
        if (!line.widgets)
            return;
        let wrap = ensureLineWrapped(lineView);
        for (let i = 0, ws = line.widgets; i < ws.length; ++i) {
            let widget = ws[i], node = d.elt('div', [widget.node], 'CodeMirror-linewidget');
            if (!widget.handleMouseEvents)
                node.setAttribute('cm-ignore-events', 'true');
            positionLineWidget(widget, node, lineView, dims);
            cm.display.input.setUneditable(node);
            if (allowAbove && widget.above)
                wrap.insertBefore(node, lineView.gutter || lineView.text);
            else
                wrap.appendChild(node);
            e.signalLater(widget, 'redraw');
        }
    }
    function positionLineWidget(widget, node, lineView, dims) {
        if (widget.noHScroll) {
            ;
            (lineView.alignable || (lineView.alignable = [])).push(node);
            let width = dims.wrapperWidth;
            node.style.left = dims.fixedPos + 'px';
            if (!widget.coverGutter) {
                width -= dims.gutterTotalWidth;
                node.style.paddingLeft = dims.gutterTotalWidth + 'px';
            }
            node.style.width = width + 'px';
        }
        if (widget.coverGutter) {
            node.style.zIndex = 5;
            node.style.position = 'relative';
            if (!widget.noHScroll)
                node.style.marginLeft = -dims.gutterTotalWidth + 'px';
        }
    }
    return {
        updateLineForChanges: updateLineForChanges,
        buildLineElement: buildLineElement
    };
});
define('skylark-codemirror/primitives/measurement/widgets',[
    '../util/dom',
    '../util/event'
], function (dom, events) {
    'use strict';
    function widgetHeight(widget) {
        if (widget.height != null)
            return widget.height;
        let cm = widget.doc.cm;
        if (!cm)
            return 0;
        if (!dom.contains(document.body, widget.node)) {
            let parentStyle = 'position: relative;';
            if (widget.coverGutter)
                parentStyle += 'margin-left: -' + cm.display.gutters.offsetWidth + 'px;';
            if (widget.noHScroll)
                parentStyle += 'width: ' + cm.display.wrapper.clientWidth + 'px;';
            dom.removeChildrenAndAdd(cm.display.measure, dom.elt('div', [widget.node], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
    }
    function eventInWidget(display, e) {
        for (let n = events.e_target(e); n != display.wrapper; n = n.parentNode) {
            if (!n || n.nodeType == 1 && n.getAttribute('cm-ignore-events') == 'true' || n.parentNode == display.sizer && n != display.mover)
                return true;
        }
    }
    return {
        widgetHeight: widgetHeight,
        eventInWidget: eventInWidget
    };
});
define('skylark-codemirror/primitives/measurement/position_measurement',[
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/bidi',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../display/update_line',
    './widgets'
], function (line_data, line_pos, spans, utils_line, bidi, browser, dom, events, feature_detection, misc, update_line, widgets) {
    'use strict';
    function paddingTop(display) {
        return display.lineSpace.offsetTop;
    }
    function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
    }
    function paddingH(display) {
        if (display.cachedPaddingH)
            return display.cachedPaddingH;
        let e = dom.removeChildrenAndAdd(display.measure, dom.elt('pre', 'x'));
        let style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
        let data = {
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight)
        };
        if (!isNaN(data.left) && !isNaN(data.right))
            display.cachedPaddingH = data;
        return data;
    }
    function scrollGap(cm) {
        return misc.scrollerGap - cm.display.nativeBarWidth;
    }
    function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
    }
    function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
    }
    function ensureLineHeights(cm, lineView, rect) {
        let wrapping = cm.options.lineWrapping;
        let curWidth = wrapping && displayWidth(cm);
        if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
            let heights = lineView.measure.heights = [];
            if (wrapping) {
                lineView.measure.width = curWidth;
                let rects = lineView.text.firstChild.getClientRects();
                for (let i = 0; i < rects.length - 1; i++) {
                    let cur = rects[i], next = rects[i + 1];
                    if (Math.abs(cur.bottom - next.bottom) > 2)
                        heights.push((cur.bottom + next.top) / 2 - rect.top);
                }
            }
            heights.push(rect.bottom - rect.top);
        }
    }
    function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line)
            return {
                map: lineView.measure.map,
                cache: lineView.measure.cache
            };
        for (let i = 0; i < lineView.rest.length; i++)
            if (lineView.rest[i] == line)
                return {
                    map: lineView.measure.maps[i],
                    cache: lineView.measure.caches[i]
                };
        for (let i = 0; i < lineView.rest.length; i++)
            if (utils_line.lineNo(lineView.rest[i]) > lineN)
                return {
                    map: lineView.measure.maps[i],
                    cache: lineView.measure.caches[i],
                    before: true
                };
    }
    function updateExternalMeasurement(cm, line) {
        line = spans.visualLine(line);
        let lineN = utils_line.lineNo(line);
        let view = cm.display.externalMeasured = new line_data.LineView(cm.doc, line, lineN);
        view.lineN = lineN;
        let built = view.built = line_data.buildLineContent(cm, view);
        view.text = built.pre;
        dom.removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
        return view;
    }
    function measureChar(cm, line, ch, bias) {
        return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
    }
    function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
            return cm.display.view[findViewIndex(cm, lineN)];
        let ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
            return ext;
    }
    function prepareMeasureForLine(cm, line) {
        let lineN = utils_line.lineNo(line);
        let view = findViewForLine(cm, lineN);
        if (view && !view.text) {
            view = null;
        } else if (view && view.changes) {
            update_line.updateLineForChanges(cm, view, lineN, getDimensions(cm));
            cm.curOp.forceUpdate = true;
        }
        if (!view)
            view = updateExternalMeasurement(cm, line);
        let info = mapFromLineView(view, line, lineN);
        return {
            line: line,
            view: view,
            rect: null,
            map: info.map,
            cache: info.cache,
            before: info.before,
            hasHeights: false
        };
    }
    function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        if (prepared.before)
            ch = -1;
        let key = ch + (bias || ''), found;
        if (prepared.cache.hasOwnProperty(key)) {
            found = prepared.cache[key];
        } else {
            if (!prepared.rect)
                prepared.rect = prepared.view.text.getBoundingClientRect();
            if (!prepared.hasHeights) {
                ensureLineHeights(cm, prepared.view, prepared.rect);
                prepared.hasHeights = true;
            }
            found = measureCharInner(cm, prepared, ch, bias);
            if (!found.bogus)
                prepared.cache[key] = found;
        }
        return {
            left: found.left,
            right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom
        };
    }
    let nullRect = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function nodeAndOffsetInLineMap(map, ch, bias) {
        let node, start, end, collapse, mStart, mEnd;
        for (let i = 0; i < map.length; i += 3) {
            mStart = map[i];
            mEnd = map[i + 1];
            if (ch < mStart) {
                start = 0;
                end = 1;
                collapse = 'left';
            } else if (ch < mEnd) {
                start = ch - mStart;
                end = start + 1;
            } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
                end = mEnd - mStart;
                start = end - 1;
                if (ch >= mEnd)
                    collapse = 'right';
            }
            if (start != null) {
                node = map[i + 2];
                if (mStart == mEnd && bias == (node.insertLeft ? 'left' : 'right'))
                    collapse = bias;
                if (bias == 'left' && start == 0)
                    while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
                        node = map[(i -= 3) + 2];
                        collapse = 'left';
                    }
                if (bias == 'right' && start == mEnd - mStart)
                    while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
                        node = map[(i += 3) + 2];
                        collapse = 'right';
                    }
                break;
            }
        }
        return {
            node: node,
            start: start,
            end: end,
            collapse: collapse,
            coverStart: mStart,
            coverEnd: mEnd
        };
    }
    function getUsefulRect(rects, bias) {
        let rect = nullRect;
        if (bias == 'left')
            for (let i = 0; i < rects.length; i++) {
                if ((rect = rects[i]).left != rect.right)
                    break;
            }
        else
            for (let i = rects.length - 1; i >= 0; i--) {
                if ((rect = rects[i]).left != rect.right)
                    break;
            }
        return rect;
    }
    function measureCharInner(cm, prepared, ch, bias) {
        let place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
        let node = place.node, start = place.start, end = place.end, collapse = place.collapse;
        let rect;
        if (node.nodeType == 3) {
            for (let i = 0; i < 4; i++) {
                while (start && misc.isExtendingChar(prepared.line.text.charAt(place.coverStart + start)))
                    --start;
                while (place.coverStart + end < place.coverEnd && misc.isExtendingChar(prepared.line.text.charAt(place.coverStart + end)))
                    ++end;
                if (browser.ie && browser.ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart)
                    rect = node.parentNode.getBoundingClientRect();
                else
                    rect = getUsefulRect(dom.range(node, start, end).getClientRects(), bias);
                if (rect.left || rect.right || start == 0)
                    break;
                end = start;
                start = start - 1;
                collapse = 'right';
            }
            if (browser.ie && browser.ie_version < 11)
                rect = maybeUpdateRectForZooming(cm.display.measure, rect);
        } else {
            if (start > 0)
                collapse = bias = 'right';
            let rects;
            if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
                rect = rects[bias == 'right' ? rects.length - 1 : 0];
            else
                rect = node.getBoundingClientRect();
        }
        if (browser.ie && browser.ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
            let rSpan = node.parentNode.getClientRects()[0];
            if (rSpan)
                rect = {
                    left: rSpan.left,
                    right: rSpan.left + charWidth(cm.display),
                    top: rSpan.top,
                    bottom: rSpan.bottom
                };
            else
                rect = nullRect;
        }
        let rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
        let mid = (rtop + rbot) / 2;
        let heights = prepared.view.measure.heights;
        let i = 0;
        for (; i < heights.length - 1; i++)
            if (mid < heights[i])
                break;
        let top = i ? heights[i - 1] : 0, bot = heights[i];
        let result = {
            left: (collapse == 'right' ? rect.right : rect.left) - prepared.rect.left,
            right: (collapse == 'left' ? rect.left : rect.right) - prepared.rect.left,
            top: top,
            bottom: bot
        };
        if (!rect.left && !rect.right)
            result.bogus = true;
        if (!cm.options.singleCursorHeightPerLine) {
            result.rtop = rtop;
            result.rbottom = rbot;
        }
        return result;
    }
    function maybeUpdateRectForZooming(measure, rect) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !feature_detection.hasBadZoomedRects(measure))
            return rect;
        let scaleX = screen.logicalXDPI / screen.deviceXDPI;
        let scaleY = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: rect.left * scaleX,
            right: rect.right * scaleX,
            top: rect.top * scaleY,
            bottom: rect.bottom * scaleY
        };
    }
    function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure) {
            lineView.measure.cache = {};
            lineView.measure.heights = null;
            if (lineView.rest)
                for (let i = 0; i < lineView.rest.length; i++)
                    lineView.measure.caches[i] = {};
        }
    }
    function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null;
        dom.removeChildren(cm.display.lineMeasure);
        for (let i = 0; i < cm.display.view.length; i++)
            clearLineMeasurementCacheFor(cm.display.view[i]);
    }
    function clearCaches(cm) {
        clearLineMeasurementCache(cm);
        cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
        if (!cm.options.lineWrapping)
            cm.display.maxLineChanged = true;
        cm.display.lineNumChars = null;
    }
    function pageScrollX() {
        if (browser.chrome && browser.android)
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        return window.pageXOffset || (document.documentElement || document.body).scrollLeft;
    }
    function pageScrollY() {
        if (browser.chrome && browser.android)
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        return window.pageYOffset || (document.documentElement || document.body).scrollTop;
    }
    function widgetTopHeight(lineObj) {
        let height = 0;
        if (lineObj.widgets)
            for (let i = 0; i < lineObj.widgets.length; ++i)
                if (lineObj.widgets[i].above)
                    height += widgets.widgetHeight(lineObj.widgets[i]);
        return height;
    }
    function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
            let height = widgetTopHeight(lineObj);
            rect.top += height;
            rect.bottom += height;
        }
        if (context == 'line')
            return rect;
        if (!context)
            context = 'local';
        let yOff = spans.heightAtLine(lineObj);
        if (context == 'local')
            yOff += paddingTop(cm.display);
        else
            yOff -= cm.display.viewOffset;
        if (context == 'page' || context == 'window') {
            let lOff = cm.display.lineSpace.getBoundingClientRect();
            yOff += lOff.top + (context == 'window' ? 0 : pageScrollY());
            let xOff = lOff.left + (context == 'window' ? 0 : pageScrollX());
            rect.left += xOff;
            rect.right += xOff;
        }
        rect.top += yOff;
        rect.bottom += yOff;
        return rect;
    }
    function fromCoordSystem(cm, coords, context) {
        if (context == 'div')
            return coords;
        let left = coords.left, top = coords.top;
        if (context == 'page') {
            left -= pageScrollX();
            top -= pageScrollY();
        } else if (context == 'local' || !context) {
            let localBox = cm.display.sizer.getBoundingClientRect();
            left += localBox.left;
            top += localBox.top;
        }
        let lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return {
            left: left - lineSpaceBox.left,
            top: top - lineSpaceBox.top
        };
    }
    function charCoords(cm, pos, context, lineObj, bias) {
        if (!lineObj)
            lineObj = utils_line.getLine(cm.doc, pos.line);
        return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
    }
    function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        lineObj = lineObj || utils_line.getLine(cm.doc, pos.line);
        if (!preparedMeasure)
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
        function get(ch, right) {
            let m = measureCharPrepared(cm, preparedMeasure, ch, right ? 'right' : 'left', varHeight);
            if (right)
                m.left = m.right;
            else
                m.right = m.left;
            return intoCoordSystem(cm, lineObj, m, context);
        }
        let order = bidi.getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length) {
            ch = lineObj.text.length;
            sticky = 'before';
        } else if (ch <= 0) {
            ch = 0;
            sticky = 'after';
        }
        if (!order)
            return get(sticky == 'before' ? ch - 1 : ch, sticky == 'before');
        function getBidi(ch, partPos, invert) {
            let part = order[partPos], right = part.level == 1;
            return get(invert ? ch - 1 : ch, right != invert);
        }
        let partPos = bidi.getBidiPartAt(order, ch, sticky);
        let other = bidi.bidiOther;
        let val = getBidi(ch, partPos, sticky == 'before');
        if (other != null)
            val.other = getBidi(ch, other, sticky != 'before');
        return val;
    }
    function estimateCoords(cm, pos) {
        let left = 0;
        pos = line_pos.clipPos(cm.doc, pos);
        if (!cm.options.lineWrapping)
            left = charWidth(cm.display) * pos.ch;
        let lineObj = utils_line.getLine(cm.doc, pos.line);
        let top = spans.heightAtLine(lineObj) + paddingTop(cm.display);
        return {
            left: left,
            right: left,
            top: top,
            bottom: top + lineObj.height
        };
    }
    function PosWithInfo(line, ch, sticky, outside, xRel) {
        let pos = line_pos.Pos(line, ch, sticky);
        pos.xRel = xRel;
        if (outside)
            pos.outside = true;
        return pos;
    }
    function coordsChar(cm, x, y) {
        let doc = cm.doc;
        y += cm.display.viewOffset;
        if (y < 0)
            return PosWithInfo(doc.first, 0, null, true, -1);
        let lineN = utils_line.lineAtHeight(doc, y), last = doc.first + doc.size - 1;
        if (lineN > last)
            return PosWithInfo(doc.first + doc.size - 1, utils_line.getLine(doc, last).text.length, null, true, 1);
        if (x < 0)
            x = 0;
        let lineObj = utils_line.getLine(doc, lineN);
        for (;;) {
            let found = coordsCharInner(cm, lineObj, lineN, x, y);
            let collapsed = spans.collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 ? 1 : 0));
            if (!collapsed)
                return found;
            let rangeEnd = collapsed.find(1);
            if (rangeEnd.line == lineN)
                return rangeEnd;
            lineObj = utils_line.getLine(doc, lineN = rangeEnd.line);
        }
    }
    function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
        y -= widgetTopHeight(lineObj);
        let end = lineObj.text.length;
        let begin = misc.findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y, end, 0);
        end = misc.findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch).top > y, begin, end);
        return {
            begin,
            end
        };
    }
    function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        if (!preparedMeasure)
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
        let targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), 'line').top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
    }
    function boxIsAfter(box, x, y, left) {
        return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
    }
    function coordsCharInner(cm, lineObj, lineNo, x, y) {
        y -= spans.heightAtLine(lineObj);
        let preparedMeasure = prepareMeasureForLine(cm, lineObj);
        let widgetHeight = widgetTopHeight(lineObj);
        let begin = 0, end = lineObj.text.length, ltr = true;
        let order = bidi.getOrder(lineObj, cm.doc.direction);
        if (order) {
            let part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo, preparedMeasure, order, x, y);
            ltr = part.level != 1;
            begin = ltr ? part.from : part.to - 1;
            end = ltr ? part.to : part.from - 1;
        }
        let chAround = null, boxAround = null;
        let ch = misc.findFirst(ch => {
            let box = measureCharPrepared(cm, preparedMeasure, ch);
            box.top += widgetHeight;
            box.bottom += widgetHeight;
            if (!boxIsAfter(box, x, y, false))
                return false;
            if (box.top <= y && box.left <= x) {
                chAround = ch;
                boxAround = box;
            }
            return true;
        }, begin, end);
        let baseX, sticky, outside = false;
        if (boxAround) {
            let atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
            ch = chAround + (atStart ? 0 : 1);
            sticky = atStart ? 'after' : 'before';
            baseX = atLeft ? boxAround.left : boxAround.right;
        } else {
            if (!ltr && (ch == end || ch == begin))
                ch++;
            sticky = ch == 0 ? 'after' : ch == lineObj.text.length ? 'before' : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgets.widgetHeight <= y == ltr ? 'after' : 'before';
            let coords = cursorCoords(cm, line_pos.Pos(lineNo, ch, sticky), 'line', lineObj, preparedMeasure);
            baseX = coords.left;
            outside = y < coords.top || y >= coords.bottom;
        }
        ch = misc.skipExtendingChars(lineObj.text, ch, 1);
        return PosWithInfo(lineNo, ch, sticky, outside, x - baseX);
    }
    function coordsBidiPart(cm, lineObj, lineNo, preparedMeasure, order, x, y) {
        let index = misc.findFirst(i => {
            let part = order[i], ltr = part.level != 1;
            return boxIsAfter(cursorCoords(cm, line_pos.Pos(lineNo, ltr ? part.to : part.from, ltr ? 'before' : 'after'), 'line', lineObj, preparedMeasure), x, y, true);
        }, 0, order.length - 1);
        let part = order[index];
        if (index > 0) {
            let ltr = part.level != 1;
            let start = cursorCoords(cm, line_pos.Pos(lineNo, ltr ? part.from : part.to, ltr ? 'after' : 'before'), 'line', lineObj, preparedMeasure);
            if (boxIsAfter(start, x, y, true) && start.top > y)
                part = order[index - 1];
        }
        return part;
    }
    function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
        let {begin, end} = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
        if (/\s/.test(lineObj.text.charAt(end - 1)))
            end--;
        let part = null, closestDist = null;
        for (let i = 0; i < order.length; i++) {
            let p = order[i];
            if (p.from >= end || p.to <= begin)
                continue;
            let ltr = p.level != 1;
            let endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
            let dist = endX < x ? x - endX + 1000000000 : endX - x;
            if (!part || closestDist > dist) {
                part = p;
                closestDist = dist;
            }
        }
        if (!part)
            part = order[order.length - 1];
        if (part.from < begin)
            part = {
                from: begin,
                to: part.to,
                level: part.level
            };
        if (part.to > end)
            part = {
                from: part.from,
                to: end,
                level: part.level
            };
        return part;
    }
    let measureText;
    function textHeight(display) {
        if (display.cachedTextHeight != null)
            return display.cachedTextHeight;
        if (measureText == null) {
            measureText = dom.elt('pre');
            for (let i = 0; i < 49; ++i) {
                measureText.appendChild(document.createTextNode('x'));
                measureText.appendChild(dom.elt('br'));
            }
            measureText.appendChild(document.createTextNode('x'));
        }
        dom.removeChildrenAndAdd(display.measure, measureText);
        let height = measureText.offsetHeight / 50;
        if (height > 3)
            display.cachedTextHeight = height;
        dom.removeChildren(display.measure);
        return height || 1;
    }
    function charWidth(display) {
        if (display.cachedCharWidth != null)
            return display.cachedCharWidth;
        let anchor = dom.elt('span', 'xxxxxxxxxx');
        let pre = dom.elt('pre', [anchor]);
        dom.removeChildrenAndAdd(display.measure, pre);
        let rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        if (width > 2)
            display.cachedCharWidth = width;
        return width || 10;
    }
    function getDimensions(cm) {
        let utils_line = cm.display, left = {}, width = {};
        let gutterLeft = utils_line.gutters.clientLeft;
        for (let n = utils_line.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
            left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
            width[cm.options.gutters[i]] = n.clientWidth;
        }
        return {
            fixedPos: compensateForHScroll(utils_line),
            gutterTotalWidth: utils_line.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: utils_line.wrapper.clientWidth
        };
    }
    function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
    }
    function estimateHeight(cm) {
        let th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
        let perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return line => {
            if (spans.lineIsHidden(cm.doc, line))
                return 0;
            let widgetsHeight = 0;
            if (line.widgets)
                for (let i = 0; i < line.widgets.length; i++) {
                    if (line.widgets[i].height)
                        widgetsHeight += line.widgets[i].height;
                }
            if (wrapping)
                return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
            else
                return widgetsHeight + th;
        };
    }
    function estimateLineHeights(cm) {
        let doc = cm.doc, est = estimateHeight(cm);
        doc.iter(line => {
            let estHeight = est(line);
            if (estHeight != line.height)
                utils_line.updateLineHeight(line, estHeight);
        });
    }
    function posFromMouse(cm, e, liberal, forRect) {
        let display = cm.display;
        if (!liberal && events.e_target(e).getAttribute('cm-not-content') == 'true')
            return null;
        let x, y, space = display.lineSpace.getBoundingClientRect();
        try {
            x = e.clientX - space.left;
            y = e.clientY - space.top;
        } catch (e) {
            return null;
        }
        let coords = coordsChar(cm, x, y), line;
        if (forRect && coords.xRel == 1 && (line = utils_line.getLine(cm.doc, coords.line).text).length == coords.ch) {
            let colDiff = misc.countColumn(line, line.length, cm.options.tabSize) - line.length;
            coords = line_pos.Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
    }
    function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo)
            return null;
        n -= cm.display.viewFrom;
        if (n < 0)
            return null;
        let view = cm.display.view;
        for (let i = 0; i < view.length; i++) {
            n -= view[i].size;
            if (n < 0)
                return i;
        }
    }
    return {
        paddingTop: paddingTop,
        paddingVert: paddingVert,
        paddingH: paddingH,
        scrollGap: scrollGap,
        displayWidth: displayWidth,
        displayHeight: displayHeight,
        mapFromLineView: mapFromLineView,
        measureChar: measureChar,
        findViewForLine: findViewForLine,
        prepareMeasureForLine: prepareMeasureForLine,
        measureCharPrepared: measureCharPrepared,
        nodeAndOffsetInLineMap: nodeAndOffsetInLineMap,
        clearLineMeasurementCacheFor: clearLineMeasurementCacheFor,
        clearLineMeasurementCache: clearLineMeasurementCache,
        clearCaches: clearCaches,
        intoCoordSystem: intoCoordSystem,
        fromCoordSystem: fromCoordSystem,
        charCoords: charCoords,
        cursorCoords: cursorCoords,
        estimateCoords: estimateCoords,
        coordsChar: coordsChar,
        wrappedLineExtentChar: wrappedLineExtentChar,
        textHeight: textHeight,
        charWidth: charWidth,
        getDimensions: getDimensions,
        compensateForHScroll: compensateForHScroll,
        estimateHeight: estimateHeight,
        estimateLineHeights: estimateLineHeights,
        posFromMouse: posFromMouse,
        findViewIndex: findViewIndex
    };
});
define('skylark-codemirror/primitives/display/selection',[
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/bidi',
    '../util/dom'
], function (a, b, c, d, e, f) {
    'use strict';
    function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
    }
    function prepareSelection(cm, primary = true) {
        let doc = cm.doc, result = {};
        let curFragment = result.cursors = document.createDocumentFragment();
        let selFragment = result.selection = document.createDocumentFragment();
        for (let i = 0; i < doc.sel.ranges.length; i++) {
            if (!primary && i == doc.sel.primIndex)
                continue;
            let range = doc.sel.ranges[i];
            if (range.from().line >= cm.display.viewTo || range.to().line < cm.display.viewFrom)
                continue;
            let collapsed = range.empty();
            if (collapsed || cm.options.showCursorWhenSelecting)
                drawSelectionCursor(cm, range.head, curFragment);
            if (!collapsed)
                drawSelectionRange(cm, range, selFragment);
        }
        return result;
    }
    function drawSelectionCursor(cm, head, output) {
        let pos = d.cursorCoords(cm, head, 'div', null, null, !cm.options.singleCursorHeightPerLine);
        let cursor = output.appendChild(f.elt('div', '\xA0', 'CodeMirror-cursor'));
        cursor.style.left = pos.left + 'px';
        cursor.style.top = pos.top + 'px';
        cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + 'px';
        if (pos.other) {
            let otherCursor = output.appendChild(f.elt('div', '\xA0', 'CodeMirror-cursor CodeMirror-secondarycursor'));
            otherCursor.style.display = '';
            otherCursor.style.left = pos.other.left + 'px';
            otherCursor.style.top = pos.other.top + 'px';
            otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + 'px';
        }
    }
    function cmpCoords(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    function drawSelectionRange(cm, range, output) {
        let display = cm.display, doc = cm.doc;
        let fragment = document.createDocumentFragment();
        let padding = d.paddingH(cm.display), leftSide = padding.left;
        let rightSide = Math.max(display.sizerWidth, d.displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
        let docLTR = doc.direction == 'ltr';
        function add(left, top, width, bottom) {
            if (top < 0)
                top = 0;
            top = Math.round(top);
            bottom = Math.round(bottom);
            fragment.appendChild(f.elt('div', null, 'CodeMirror-selected', `position: absolute; left: ${ left }px;
                             top: ${ top }px; width: ${ width == null ? rightSide - left : width }px;
                             height: ${ bottom - top }px`));
        }
        function drawForLine(line, fromArg, toArg) {
            let lineObj = c.getLine(doc, line);
            let lineLen = lineObj.text.length;
            let start, end;
            function coords(ch, bias) {
                return d.charCoords(cm, a.Pos(line, ch), 'div', lineObj, bias);
            }
            function wrapX(pos, dir, side) {
                let extent = d.wrappedLineExtentChar(cm, lineObj, null, pos);
                let prop = dir == 'ltr' == (side == 'after') ? 'left' : 'right';
                let ch = side == 'after' ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
                return coords(ch, prop)[prop];
            }
            let order = e.getOrder(lineObj, doc.direction);
            e.iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, (from, to, dir, i) => {
                let ltr = dir == 'ltr';
                let fromPos = coords(from, ltr ? 'left' : 'right');
                let toPos = coords(to - 1, ltr ? 'right' : 'left');
                let openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
                let first = i == 0, last = !order || i == order.length - 1;
                if (toPos.top - fromPos.top <= 3) {
                    let openLeft = (docLTR ? openStart : openEnd) && first;
                    let openRight = (docLTR ? openEnd : openStart) && last;
                    let left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
                    let right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
                    add(left, fromPos.top, right - left, fromPos.bottom);
                } else {
                    let topLeft, topRight, botLeft, botRight;
                    if (ltr) {
                        topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                        topRight = docLTR ? rightSide : wrapX(from, dir, 'before');
                        botLeft = docLTR ? leftSide : wrapX(to, dir, 'after');
                        botRight = docLTR && openEnd && last ? rightSide : toPos.right;
                    } else {
                        topLeft = !docLTR ? leftSide : wrapX(from, dir, 'before');
                        topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                        botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
                        botRight = !docLTR ? rightSide : wrapX(to, dir, 'after');
                    }
                    add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
                    if (fromPos.bottom < toPos.top)
                        add(leftSide, fromPos.bottom, null, toPos.top);
                    add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
                }
                if (!start || cmpCoords(fromPos, start) < 0)
                    start = fromPos;
                if (cmpCoords(toPos, start) < 0)
                    start = toPos;
                if (!end || cmpCoords(fromPos, end) < 0)
                    end = fromPos;
                if (cmpCoords(toPos, end) < 0)
                    end = toPos;
            });
            return {
                start: start,
                end: end
            };
        }
        let sFrom = range.from(), sTo = range.to();
        if (sFrom.line == sTo.line) {
            drawForLine(sFrom.line, sFrom.ch, sTo.ch);
        } else {
            let fromLine = c.getLine(doc, sFrom.line), toLine = c.getLine(doc, sTo.line);
            let singleVLine = b.visualLine(fromLine) == b.visualLine(toLine);
            let leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
            let rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
            if (singleVLine) {
                if (leftEnd.top < rightStart.top - 2) {
                    add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
                    add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
                } else {
                    add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
                }
            }
            if (leftEnd.bottom < rightStart.top)
                add(leftSide, leftEnd.bottom, null, rightStart.top);
        }
        output.appendChild(fragment);
    }
    function restartBlink(cm) {
        if (!cm.state.focused)
            return;
        let display = cm.display;
        clearInterval(display.blinker);
        let on = true;
        display.cursorDiv.style.visibility = '';
        if (cm.options.cursorBlinkRate > 0)
            display.blinker = setInterval(() => display.cursorDiv.style.visibility = (on = !on) ? '' : 'hidden', cm.options.cursorBlinkRate);
        else if (cm.options.cursorBlinkRate < 0)
            display.cursorDiv.style.visibility = 'hidden';
    }
    return {
        updateSelection: updateSelection,
        prepareSelection: prepareSelection,
        drawSelectionCursor: drawSelectionCursor,
        restartBlink: restartBlink
    };
});
define('skylark-codemirror/primitives/display/focus',[
    './selection',
    '../util/browser',
    '../util/dom',
    '../util/event'
], function (selection, browser, dom, event) {
    'use strict';
    function ensureFocus(cm) {
        if (!cm.state.focused) {
            cm.display.input.focus();
            onFocus(cm);
        }
    }
    function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = true;
        setTimeout(() => {
            if (cm.state.delayingBlurEvent) {
                cm.state.delayingBlurEvent = false;
                onBlur(cm);
            }
        }, 100);
    }
    function onFocus(cm, e) {
        if (cm.state.delayingBlurEvent)
            cm.state.delayingBlurEvent = false;
        if (cm.options.readOnly == 'nocursor')
            return;
        if (!cm.state.focused) {
            event.signal(cm, 'focus', cm, e);
            cm.state.focused = true;
            dom.addClass(cm.display.wrapper, 'CodeMirror-focused');
            if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
                cm.display.input.reset();
                if (browser.webkit)
                    setTimeout(() => cm.display.input.reset(true), 20);
            }
            cm.display.input.receivedFocus();
        }
        selection.restartBlink(cm);
    }
    function onBlur(cm, e) {
        if (cm.state.delayingBlurEvent)
            return;
        if (cm.state.focused) {
            event.signal(cm, 'blur', cm, e);
            cm.state.focused = false;
            dom.rmClass(cm.display.wrapper, 'CodeMirror-focused');
        }
        clearInterval(cm.display.blinker);
        setTimeout(() => {
            if (!cm.state.focused)
                cm.display.shift = false;
        }, 150);
    }
    return {
        ensureFocus: ensureFocus,
        delayBlurEvent: delayBlurEvent,
        onFocus: onFocus,
        onBlur: onBlur
    };
});
define('skylark-codemirror/primitives/display/update_lines',[
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/browser'
], function (a, b, c, d) {
    'use strict';
    function updateHeightsInViewport(cm) {
        let display = cm.display;
        let prevBottom = display.lineDiv.offsetTop;
        for (let i = 0; i < display.view.length; i++) {
            let cur = display.view[i], wrapping = cm.options.lineWrapping;
            let height, width = 0;
            if (cur.hidden)
                continue;
            if (d.ie && d.ie_version < 8) {
                let bot = cur.node.offsetTop + cur.node.offsetHeight;
                height = bot - prevBottom;
                prevBottom = bot;
            } else {
                let box = cur.node.getBoundingClientRect();
                height = box.bottom - box.top;
                if (!wrapping && cur.text.firstChild)
                    width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
            }
            let diff = cur.line.height - height;
            if (diff > 0.005 || diff < -0.005) {
                b.updateLineHeight(cur.line, height);
                updateWidgetHeight(cur.line);
                if (cur.rest)
                    for (let j = 0; j < cur.rest.length; j++)
                        updateWidgetHeight(cur.rest[j]);
            }
            if (width > cm.display.sizerWidth) {
                let chWidth = Math.ceil(width / c.charWidth(cm.display));
                if (chWidth > cm.display.maxLineLength) {
                    cm.display.maxLineLength = chWidth;
                    cm.display.maxLine = cur.line;
                    cm.display.maxLineChanged = true;
                }
            }
        }
    }
    function updateWidgetHeight(line) {
        if (line.widgets)
            for (let i = 0; i < line.widgets.length; ++i) {
                let w = line.widgets[i], parent = w.node.parentNode;
                if (parent)
                    w.height = parent.offsetHeight;
            }
    }
    function visibleLines(display, doc, viewport) {
        let top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - c.paddingTop(display));
        let bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
        let from = b.lineAtHeight(doc, top), to = b.lineAtHeight(doc, bottom);
        if (viewport && viewport.ensure) {
            let ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
            if (ensureFrom < from) {
                from = ensureFrom;
                to = b.lineAtHeight(doc, a.heightAtLine(b.getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
            } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
                from = b.lineAtHeight(doc, a.heightAtLine(b.getLine(doc, ensureTo)) - display.wrapper.clientHeight);
                to = ensureTo;
            }
        }
        return {
            from: from,
            to: Math.max(to, from + 1)
        };
    }
    return {
        updateHeightsInViewport: updateHeightsInViewport,
        visibleLines: visibleLines
    };
});
define('skylark-codemirror/primitives/display/view_tracking',[
    '../line/line_data',
    '../line/saw_special_spans',
    '../line/spans',
    '../measurement/position_measurement',
    '../util/misc'
], function (a, b, c, d, e) {
    'use strict';
    function regChange(cm, from, to, lendiff) {
        if (from == null)
            from = cm.doc.first;
        if (to == null)
            to = cm.doc.first + cm.doc.size;
        if (!lendiff)
            lendiff = 0;
        let display = cm.display;
        if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from))
            display.updateLineNumbers = from;
        cm.curOp.viewChanged = true;
        if (from >= display.viewTo) {
            if (b.sawCollapsedSpans && c.visualLineNo(cm.doc, from) < display.viewTo)
                resetView(cm);
        } else if (to <= display.viewFrom) {
            if (b.sawCollapsedSpans && c.visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
                resetView(cm);
            } else {
                display.viewFrom += lendiff;
                display.viewTo += lendiff;
            }
        } else if (from <= display.viewFrom && to >= display.viewTo) {
            resetView(cm);
        } else if (from <= display.viewFrom) {
            let cut = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cut) {
                display.view = display.view.slice(cut.index);
                display.viewFrom = cut.lineN;
                display.viewTo += lendiff;
            } else {
                resetView(cm);
            }
        } else if (to >= display.viewTo) {
            let cut = viewCuttingPoint(cm, from, from, -1);
            if (cut) {
                display.view = display.view.slice(0, cut.index);
                display.viewTo = cut.lineN;
            } else {
                resetView(cm);
            }
        } else {
            let cutTop = viewCuttingPoint(cm, from, from, -1);
            let cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cutTop && cutBot) {
                display.view = display.view.slice(0, cutTop.index).concat(a.buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
                display.viewTo += lendiff;
            } else {
                resetView(cm);
            }
        }
        let ext = display.externalMeasured;
        if (ext) {
            if (to < ext.lineN)
                ext.lineN += lendiff;
            else if (from < ext.lineN + ext.size)
                display.externalMeasured = null;
        }
    }
    function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = true;
        let display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
            display.externalMeasured = null;
        if (line < display.viewFrom || line >= display.viewTo)
            return;
        let lineView = display.view[d.findViewIndex(cm, line)];
        if (lineView.node == null)
            return;
        let arr = lineView.changes || (lineView.changes = []);
        if (e.indexOf(arr, type) == -1)
            arr.push(type);
    }
    function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
        cm.display.view = [];
        cm.display.viewOffset = 0;
    }
    function viewCuttingPoint(cm, oldN, newN, dir) {
        let index = d.findViewIndex(cm, oldN), diff, view = cm.display.view;
        if (!b.sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
            return {
                index: index,
                lineN: newN
            };
        let n = cm.display.viewFrom;
        for (let i = 0; i < index; i++)
            n += view[i].size;
        if (n != oldN) {
            if (dir > 0) {
                if (index == view.length - 1)
                    return null;
                diff = n + view[index].size - oldN;
                index++;
            } else {
                diff = n - oldN;
            }
            oldN += diff;
            newN += diff;
        }
        while (c.visualLineNo(cm.doc, newN) != newN) {
            if (index == (dir < 0 ? 0 : view.length - 1))
                return null;
            newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
            index += dir;
        }
        return {
            index: index,
            lineN: newN
        };
    }
    function adjustView(cm, from, to) {
        let display = cm.display, view = display.view;
        if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
            display.view = a.buildViewArray(cm, from, to);
            display.viewFrom = from;
        } else {
            if (display.viewFrom > from)
                display.view = a.buildViewArray(cm, from, display.viewFrom).concat(display.view);
            else if (display.viewFrom < from)
                display.view = display.view.slice(d.findViewIndex(cm, from));
            display.viewFrom = from;
            if (display.viewTo < to)
                display.view = display.view.concat(a.buildViewArray(cm, display.viewTo, to));
            else if (display.viewTo > to)
                display.view = display.view.slice(0, d.findViewIndex(cm, to));
        }
        display.viewTo = to;
    }
    function countDirtyView(cm) {
        let view = cm.display.view, dirty = 0;
        for (let i = 0; i < view.length; i++) {
            let lineView = view[i];
            if (!lineView.hidden && (!lineView.node || lineView.changes))
                ++dirty;
        }
        return dirty;
    }
    return {
        regChange: regChange,
        regLineChange: regLineChange,
        resetView: resetView,
        adjustView: adjustView,
        countDirtyView: countDirtyView
    };
});
define('skylark-codemirror/primitives/display/update_display',[
    '../line/saw_special_spans',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc',
    './update_line',
//    './highlight_worker', // dependence cycle 
//    './line_numbers',
//    './scrollbars',
    './selection',
    './update_lines',
    './view_tracking'
], function (
    a, 
    b, 
    c, 
    d, 
    e, 
    f, 
    g, 
    h, 
    m_update_line, 
//    j, 
//    k, 
//    l, 
    m, 
    n, 
    o
) {
    'use strict';
    class DisplayUpdate {
        constructor(cm, viewport, force) {
            let display = cm.display;
            this.viewport = viewport;
            this.visible = n.visibleLines(display, cm.doc, viewport);
            this.editorIsHidden = !display.wrapper.offsetWidth;
            this.wrapperHeight = display.wrapper.clientHeight;
            this.wrapperWidth = display.wrapper.clientWidth;
            this.oldDisplayWidth = d.displayWidth(cm);
            this.force = force;
            this.dims = d.getDimensions(cm);
            this.events = [];
        }
        signal(emitter, type) {
            if (g.hasHandler(emitter, type))
                this.events.push(arguments);
        }
        finish() {
            for (let i = 0; i < this.events.length; i++)
                g.signal.apply(null, this.events[i]);
        }
    }
    function maybeClipScrollbars(cm) {
        let display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
            display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
            display.heightForcer.style.height = d.scrollGap(cm) + 'px';
            display.sizer.style.marginBottom = -display.nativeBarWidth + 'px';
            display.sizer.style.borderRightWidth = d.scrollGap(cm) + 'px';
            display.scrollbarsClipped = true;
        }
    }
    function selectionSnapshot(cm) {
        if (cm.hasFocus())
            return null;
        let active = f.activeElt();
        if (!active || !f.contains(cm.display.lineDiv, active))
            return null;
        let result = { activeElt: active };
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.anchorNode && sel.extend && f.contains(cm.display.lineDiv, sel.anchorNode)) {
                result.anchorNode = sel.anchorNode;
                result.anchorOffset = sel.anchorOffset;
                result.focusNode = sel.focusNode;
                result.focusOffset = sel.focusOffset;
            }
        }
        return result;
    }
    function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == f.activeElt())
            return;
        snapshot.activeElt.focus();
        if (snapshot.anchorNode && f.contains(document.body, snapshot.anchorNode) && f.contains(document.body, snapshot.focusNode)) {
            let sel = window.getSelection(), range = document.createRange();
            range.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            sel.extend(snapshot.focusNode, snapshot.focusOffset);
        }
    }
    function updateDisplayIfNeeded(cm, update) {
        let display = cm.display, doc = cm.doc;
        if (update.editorIsHidden) {
            o.resetView(cm);
            return false;
        }
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && o.countDirtyView(cm) == 0)
            return false;
        if (cm.maybeUpdateLineNumberWidth()) { //if (k.maybeUpdateLineNumberWidth(cm)) {
            o.resetView(cm);
            update.dims = d.getDimensions(cm);
        }
        let end = doc.first + doc.size;
        let from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
        let to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20)
            from = Math.max(doc.first, display.viewFrom);
        if (display.viewTo > to && display.viewTo - to < 20)
            to = Math.min(end, display.viewTo);
        if (a.sawCollapsedSpans) {
            from = b.visualLineNo(cm.doc, from);
            to = b.visualLineEndNo(cm.doc, to);
        }
        let different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        o.adjustView(cm, from, to);
        display.viewOffset = b.heightAtLine(c.getLine(cm.doc, display.viewFrom));
        cm.display.mover.style.top = display.viewOffset + 'px';
        let toUpdate = o.countDirtyView(cm);
        if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
            return false;
        let selSnapshot = selectionSnapshot(cm);
        if (toUpdate > 4)
            display.lineDiv.style.display = 'none';
        patchDisplay(cm, display.updateLineNumbers, update.dims);
        if (toUpdate > 4)
            display.lineDiv.style.display = '';
        display.renderedView = display.view;
        restoreSelection(selSnapshot);
        f.removeChildren(display.cursorDiv);
        f.removeChildren(display.selectionDiv);
        display.gutters.style.height = display.sizer.style.minHeight = 0;
        if (different) {
            display.lastWrapHeight = update.wrapperHeight;
            display.lastWrapWidth = update.wrapperWidth;
            cm.startWorker(400); // j.startWorker(cm, 400);
        }
        display.updateLineNumbers = null;
        return true;
    }
    function postUpdateDisplay(cm, update) {
        let viewport = update.viewport;
        for (let first = true;; first = false) {
            if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == d.displayWidth(cm)) {
                if (viewport && viewport.top != null)
                    viewport = { top: Math.min(cm.doc.height + d.paddingVert(cm.display) - d.displayHeight(cm), viewport.top) };
                update.visible = n.visibleLines(cm.display, cm.doc, viewport);
                if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
                    break;
            }
            if (!updateDisplayIfNeeded(cm, update))
                break;
            n.updateHeightsInViewport(cm);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m.updateSelection(cm);
            cm.updateScrollbars(barMeasure); //l.updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.force = false;
        }
        update.signal(cm, 'update', cm);
        if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
            update.signal(cm, 'viewportChange', cm, cm.display.viewFrom, cm.display.viewTo);
            cm.display.reportedViewFrom = cm.display.viewFrom;
            cm.display.reportedViewTo = cm.display.viewTo;
        }
    }
    function updateDisplaySimple(cm, viewport) {
        let update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
            n.updateHeightsInViewport(cm);
            postUpdateDisplay(cm, update);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m.updateSelection(cm);
            cm.updateScrollbars(barMeasure); // l.updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.finish();
        }
    }
    function patchDisplay(cm, updateNumbersFrom, dims) {
        let display = cm.display, lineNumbers = cm.options.lineNumbers;
        let container = display.lineDiv, cur = container.firstChild;
        function rm(node) {
            let next = node.nextSibling;
            if (e.webkit && e.mac && cm.display.currentWheelTarget == node)
                node.style.display = 'none';
            else
                node.parentNode.removeChild(node);
            return next;
        }
        let view = display.view, lineN = display.viewFrom;
        for (let i = 0; i < view.length; i++) {
            let lineView = view[i];
            if (lineView.hidden) {
            } else if (!lineView.node || lineView.node.parentNode != container) {
                let node = m_update_line.buildLineElement(cm, lineView, lineN, dims);
                container.insertBefore(node, cur);
            } else {
                while (cur != lineView.node)
                    cur = rm(cur);
                let updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
                if (lineView.changes) {
                    if (h.indexOf(lineView.changes, 'gutter') > -1)
                        updateNumber = false;
                    m_update_line.updateLineForChanges(cm, lineView, lineN, dims);
                }
                if (updateNumber) {
                    f.removeChildren(lineView.lineNumber);
                    lineView.lineNumber.appendChild(document.createTextNode(c.lineNumberFor(cm.options, lineN)));
                }
                cur = lineView.node.nextSibling;
            }
            lineN += lineView.size;
        }
        while (cur)
            cur = rm(cur);
    }
    function updateGutterSpace(cm) {
        let width = cm.display.gutters.offsetWidth;
        cm.display.sizer.style.marginLeft = width + 'px';
    }
    function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + 'px';
        cm.display.heightForcer.style.top = measure.docHeight + 'px';
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + d.scrollGap(cm) + 'px';
    }
    return {
        DisplayUpdate: DisplayUpdate,
        maybeClipScrollbars: maybeClipScrollbars,
        updateDisplayIfNeeded: updateDisplayIfNeeded,
        postUpdateDisplay: postUpdateDisplay,
        updateDisplaySimple: updateDisplaySimple,
        updateGutterSpace: updateGutterSpace,
        setDocumentHeight: setDocumentHeight
    };
});
define('skylark-codemirror/primitives/display/gutters',[
    '../util/dom',
    '../util/misc',
    './update_display'
], function (dom, misc, update_display) {
    'use strict';
    function updateGutters(cm) {
        let gutters = cm.display.gutters, specs = cm.options.gutters;
        dom.removeChildren(gutters);
        let i = 0;
        for (; i < specs.length; ++i) {
            let gutterClass = specs[i];
            let gElt = gutters.appendChild(dom.elt('div', null, 'CodeMirror-gutter ' + gutterClass));
            if (gutterClass == 'CodeMirror-linenumbers') {
                cm.display.lineGutter = gElt;
                gElt.style.width = (cm.display.lineNumWidth || 1) + 'px';
            }
        }
        gutters.style.display = i ? '' : 'none';
        update_display.updateGutterSpace(cm);
    }
    function setGuttersForLineNumbers(options) {
        let found = misc.indexOf(options.gutters, 'CodeMirror-linenumbers');
        if (found == -1 && options.lineNumbers) {
            options.gutters = options.gutters.concat(['CodeMirror-linenumbers']);
        } else if (found > -1 && !options.lineNumbers) {
            options.gutters = options.gutters.slice(0);
            options.gutters.splice(found, 1);
        }
    }
    return {
        updateGutters: updateGutters,
        setGuttersForLineNumbers: setGuttersForLineNumbers
    };
});
define('skylark-codemirror/primitives/display/line_numbers',[
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/dom',
    './update_display'
], function (utils_line, position_measurement, dom, update_display) {
    'use strict';
    function alignHorizontally(cm) {
        let display = cm.display, view = display.view;
        if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter))
            return;
        let comp = position_measurement.compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
        let gutterW = display.gutters.offsetWidth, left = comp + 'px';
        for (let i = 0; i < view.length; i++)
            if (!view[i].hidden) {
                if (cm.options.fixedGutter) {
                    if (view[i].gutter)
                        view[i].gutter.style.left = left;
                    if (view[i].gutterBackground)
                        view[i].gutterBackground.style.left = left;
                }
                let align = view[i].alignable;
                if (align)
                    for (let j = 0; j < align.length; j++)
                        align[j].style.left = left;
            }
        if (cm.options.fixedGutter)
            display.gutters.style.left = comp + gutterW + 'px';
    }
    function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers)
            return false;
        let doc = cm.doc, last = utils_line.lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
            let test = display.measure.appendChild(dom.elt('div', [dom.elt('div', last)], 'CodeMirror-linenumber CodeMirror-gutter-elt'));
            let innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
            display.lineGutter.style.width = '';
            display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
            display.lineNumWidth = display.lineNumInnerWidth + padding;
            display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
            display.lineGutter.style.width = display.lineNumWidth + 'px';
            update_display.updateGutterSpace(cm);
            return true;
        }
        return false;
    }
    return {
        alignHorizontally: alignHorizontally,
        maybeUpdateLineNumberWidth: maybeUpdateLineNumberWidth
    };
});
define('skylark-codemirror/primitives/display/scrolling',[
    '../line/pos',
    '../measurement/position_measurement',
    '../util/browser',
    '../util/dom',
    '../util/event',
    //'./highlight_worker',// dependence cycle 
    './line_numbers',
    './update_display'
], function (
    a, 
    b, 
    c, 
    d, 
    e, 
//    highlight_worker, 
    g, 
    h
) {
    'use strict';
    function maybeScrollWindow(cm, rect) {
        if (e.signalDOMEvent(cm, 'scrollCursorIntoView'))
            return;
        let display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
        if (rect.top + box.top < 0)
            doScroll = true;
        else if (rect.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight))
            doScroll = false;
        if (doScroll != null && !c.phantom) {
            let scrollNode = d.elt('div', '\u200B', null, `position: absolute;
                         top: ${ rect.top - display.viewOffset - b.paddingTop(cm.display) }px;
                         height: ${ rect.bottom - rect.top + b.scrollGap(cm) + display.barHeight }px;
                         left: ${ rect.left }px; width: ${ Math.max(2, rect.right - rect.left) }px;`);
            cm.display.lineSpace.appendChild(scrollNode);
            scrollNode.scrollIntoView(doScroll);
            cm.display.lineSpace.removeChild(scrollNode);
        }
    }
    function scrollPosIntoView(cm, pos, end, margin) {
        if (margin == null)
            margin = 0;
        let rect;
        if (!cm.options.lineWrapping && pos == end) {
            pos = pos.ch ? a.Pos(pos.line, pos.sticky == 'before' ? pos.ch - 1 : pos.ch, 'after') : pos;
            end = pos.sticky == 'before' ? a.Pos(pos.line, pos.ch + 1, 'before') : pos;
        }
        for (let limit = 0; limit < 5; limit++) {
            let changed = false;
            let coords = b.cursorCoords(cm, pos);
            let endCoords = !end || end == pos ? coords : b.cursorCoords(cm, end);
            rect = {
                left: Math.min(coords.left, endCoords.left),
                top: Math.min(coords.top, endCoords.top) - margin,
                right: Math.max(coords.left, endCoords.left),
                bottom: Math.max(coords.bottom, endCoords.bottom) + margin
            };
            let scrollPos = calculateScrollPos(cm, rect);
            let startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
            if (scrollPos.scrollTop != null) {
                updateScrollTop(cm, scrollPos.scrollTop);
                if (Math.abs(cm.doc.scrollTop - startTop) > 1)
                    changed = true;
            }
            if (scrollPos.scrollLeft != null) {
                setScrollLeft(cm, scrollPos.scrollLeft);
                if (Math.abs(cm.doc.scrollLeft - startLeft) > 1)
                    changed = true;
            }
            if (!changed)
                break;
        }
        return rect;
    }
    function scrollIntoView(cm, rect) {
        let scrollPos = calculateScrollPos(cm, rect);
        if (scrollPos.scrollTop != null)
            updateScrollTop(cm, scrollPos.scrollTop);
        if (scrollPos.scrollLeft != null)
            setScrollLeft(cm, scrollPos.scrollLeft);
    }
    function calculateScrollPos(cm, rect) {
        let display = cm.display, snapMargin = b.textHeight(cm.display);
        if (rect.top < 0)
            rect.top = 0;
        let screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
        let screen = b.displayHeight(cm), result = {};
        if (rect.bottom - rect.top > screen)
            rect.bottom = rect.top + screen;
        let docBottom = cm.doc.height + b.paddingVert(display);
        let atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
        if (rect.top < screentop) {
            result.scrollTop = atTop ? 0 : rect.top;
        } else if (rect.bottom > screentop + screen) {
            let newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen);
            if (newTop != screentop)
                result.scrollTop = newTop;
        }
        let screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
        let screenw = b.displayWidth(cm) - (cm.options.fixedGutter ? display.gutters.offsetWidth : 0);
        let tooWide = rect.right - rect.left > screenw;
        if (tooWide)
            rect.right = rect.left + screenw;
        if (rect.left < 10)
            result.scrollLeft = 0;
        else if (rect.left < screenleft)
            result.scrollLeft = Math.max(0, rect.left - (tooWide ? 0 : 10));
        else if (rect.right > screenw + screenleft - 3)
            result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
        return result;
    }
    function addToScrollTop(cm, top) {
        if (top == null)
            return;
        resolveScrollToPos(cm);
        cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
    }
    function ensureCursorVisible(cm) {
        resolveScrollToPos(cm);
        let cur = cm.getCursor();
        cm.curOp.scrollToPos = {
            from: cur,
            to: cur,
            margin: cm.options.cursorScrollMargin
        };
    }
    function scrollToCoords(cm, x, y) {
        if (x != null || y != null)
            resolveScrollToPos(cm);
        if (x != null)
            cm.curOp.scrollLeft = x;
        if (y != null)
            cm.curOp.scrollTop = y;
    }
    function scrollToRange(cm, range) {
        resolveScrollToPos(cm);
        cm.curOp.scrollToPos = range;
    }
    function resolveScrollToPos(cm) {
        let range = cm.curOp.scrollToPos;
        if (range) {
            cm.curOp.scrollToPos = null;
            let from = b.estimateCoords(cm, range.from), to = b.estimateCoords(cm, range.to);
            scrollToCoordsRange(cm, from, to, range.margin);
        }
    }
    function scrollToCoordsRange(cm, from, to, margin) {
        let sPos = calculateScrollPos(cm, {
            left: Math.min(from.left, to.left),
            top: Math.min(from.top, to.top) - margin,
            right: Math.max(from.right, to.right),
            bottom: Math.max(from.bottom, to.bottom) + margin
        });
        scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
    }
    function updateScrollTop(cm, val) {
        if (Math.abs(cm.doc.scrollTop - val) < 2)
            return;
        if (!c.gecko)
            h.updateDisplaySimple(cm, { top: val });
        setScrollTop(cm, val, true);
        if (c.gecko)
            h.updateDisplaySimple(cm);
        cm.startWorker(cm, 100); // highlight_worker.startWorker(cm, 100);
    }
    function setScrollTop(cm, val, forceScroll) {
        val = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val);
        if (cm.display.scroller.scrollTop == val && !forceScroll)
            return;
        cm.doc.scrollTop = val;
        cm.display.scrollbars.setScrollTop(val);
        if (cm.display.scroller.scrollTop != val)
            cm.display.scroller.scrollTop = val;
    }
    function setScrollLeft(cm, val, isScroller, forceScroll) {
        val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
        if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll)
            return;
        cm.doc.scrollLeft = val;
        g.alignHorizontally(cm);
        if (cm.display.scroller.scrollLeft != val)
            cm.display.scroller.scrollLeft = val;
        cm.display.scrollbars.setScrollLeft(val);
    }
    return {
        maybeScrollWindow: maybeScrollWindow,
        scrollPosIntoView: scrollPosIntoView,
        scrollIntoView: scrollIntoView,
        addToScrollTop: addToScrollTop,
        ensureCursorVisible: ensureCursorVisible,
        scrollToCoords: scrollToCoords,
        scrollToRange: scrollToRange,
        scrollToCoordsRange: scrollToCoordsRange,
        updateScrollTop: updateScrollTop,
        setScrollTop: setScrollTop,
        setScrollLeft: setScrollLeft
    };
});
define('skylark-codemirror/primitives/display/scrollbars',[
    '../util/dom',
    '../util/event',
    '../measurement/position_measurement',
    '../util/browser',
    './update_lines',
    '../util/misc',
    './scrolling'
], function (dom, event, position_measurement, browser, update_lines, misc, scrolling) {
    'use strict';
    function measureForScrollbars(cm) {
        let d = cm.display, gutterW = d.gutters.offsetWidth;
        let docH = Math.round(cm.doc.height + position_measurement.paddingVert(cm.display));
        return {
            clientHeight: d.scroller.clientHeight,
            viewHeight: d.wrapper.clientHeight,
            scrollWidth: d.scroller.scrollWidth,
            clientWidth: d.scroller.clientWidth,
            viewWidth: d.wrapper.clientWidth,
            barLeft: cm.options.fixedGutter ? gutterW : 0,
            docHeight: docH,
            scrollHeight: docH + position_measurement.scrollGap(cm) + d.barHeight,
            nativeBarWidth: d.nativeBarWidth,
            gutterWidth: gutterW
        };
    }
    class NativeScrollbars {
        constructor(place, scroll, cm) {
            this.cm = cm;
            let vert = this.vert = dom.elt('div', [dom.elt('div', null, null, 'min-width: 1px')], 'CodeMirror-vscrollbar');
            let horiz = this.horiz = dom.elt('div', [dom.elt('div', null, null, 'height: 100%; min-height: 1px')], 'CodeMirror-hscrollbar');
            vert.tabIndex = horiz.tabIndex = -1;
            place(vert);
            place(horiz);
            event.on(vert, 'scroll', () => {
                if (vert.clientHeight)
                    scroll(vert.scrollTop, 'vertical');
            });
            event.on(horiz, 'scroll', () => {
                if (horiz.clientWidth)
                    scroll(horiz.scrollLeft, 'horizontal');
            });
            this.checkedZeroWidth = false;
            if (browser.ie && browser.ie_version < 8)
                this.horiz.style.minHeight = this.vert.style.minWidth = '18px';
        }
        update(measure) {
            let needsH = measure.scrollWidth > measure.clientWidth + 1;
            let needsV = measure.scrollHeight > measure.clientHeight + 1;
            let sWidth = measure.nativeBarWidth;
            if (needsV) {
                this.vert.style.display = 'block';
                this.vert.style.bottom = needsH ? sWidth + 'px' : '0';
                let totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
                this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + 'px';
            } else {
                this.vert.style.display = '';
                this.vert.firstChild.style.height = '0';
            }
            if (needsH) {
                this.horiz.style.display = 'block';
                this.horiz.style.right = needsV ? sWidth + 'px' : '0';
                this.horiz.style.left = measure.barLeft + 'px';
                let totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
                this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + 'px';
            } else {
                this.horiz.style.display = '';
                this.horiz.firstChild.style.width = '0';
            }
            if (!this.checkedZeroWidth && measure.clientHeight > 0) {
                if (sWidth == 0)
                    this.zeroWidthHack();
                this.checkedZeroWidth = true;
            }
            return {
                right: needsV ? sWidth : 0,
                bottom: needsH ? sWidth : 0
            };
        }
        setScrollLeft(pos) {
            if (this.horiz.scrollLeft != pos)
                this.horiz.scrollLeft = pos;
            if (this.disableHoriz)
                this.enableZeroWidthBar(this.horiz, this.disableHoriz, 'horiz');
        }
        setScrollTop(pos) {
            if (this.vert.scrollTop != pos)
                this.vert.scrollTop = pos;
            if (this.disableVert)
                this.enableZeroWidthBar(this.vert, this.disableVert, 'vert');
        }
        zeroWidthHack() {
            let w = browser.mac && !browser.mac_geMountainLion ? '12px' : '18px';
            this.horiz.style.height = this.vert.style.width = w;
            this.horiz.style.pointerEvents = this.vert.style.pointerEvents = 'none';
            this.disableHoriz = new misc.Delayed();
            this.disableVert = new misc.Delayed();
        }
        enableZeroWidthBar(bar, delay, type) {
            bar.style.pointerEvents = 'auto';
            function maybeDisable() {
                let box = bar.getBoundingClientRect();
                let elt = type == 'vert' ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
                if (elt != bar)
                    bar.style.pointerEvents = 'none';
                else
                    delay.set(1000, maybeDisable);
            }
            delay.set(1000, maybeDisable);
        }
        clear() {
            let parent = this.horiz.parentNode;
            parent.removeChild(this.horiz);
            parent.removeChild(this.vert);
        }
    }
    class NullScrollbars {
        update() {
            return {
                bottom: 0,
                right: 0
            };
        }
        setScrollLeft() {
        }
        setScrollTop() {
        }
        clear() {
        }
    }
    function updateScrollbars(cm, measure) {
        if (!measure)
            measure = measureForScrollbars(cm);
        let startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for (let i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
            if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
                update_lines.updateHeightsInViewport(cm);
            updateScrollbarsInner(cm, measureForScrollbars(cm));
            startWidth = cm.display.barWidth;
            startHeight = cm.display.barHeight;
        }
    }
    function updateScrollbarsInner(cm, measure) {
        let d = cm.display;
        let sizes = d.scrollbars.update(measure);
        d.sizer.style.paddingRight = (d.barWidth = sizes.right) + 'px';
        d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + 'px';
        d.heightForcer.style.borderBottom = sizes.bottom + 'px solid transparent';
        if (sizes.right && sizes.bottom) {
            d.scrollbarFiller.style.display = 'block';
            d.scrollbarFiller.style.height = sizes.bottom + 'px';
            d.scrollbarFiller.style.width = sizes.right + 'px';
        } else
            d.scrollbarFiller.style.display = '';
        if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
            d.gutterFiller.style.display = 'block';
            d.gutterFiller.style.height = sizes.bottom + 'px';
            d.gutterFiller.style.width = measure.gutterWidth + 'px';
        } else
            d.gutterFiller.style.display = '';
    }
    let scrollbarModel = {
        'native': NativeScrollbars,
        'null': NullScrollbars
    };
    function initScrollbars(cm) {
        if (cm.display.scrollbars) {
            cm.display.scrollbars.clear();
            if (cm.display.scrollbars.undefined)
                dom.rmClass(cm.display.wrapper, cm.display.scrollbars.undefined);
        }
        cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](node => {
            cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
            event.on(node, 'mousedown', () => {
                if (cm.state.focused)
                    setTimeout(() => cm.display.input.focus(), 0);
            });
            node.setAttribute('cm-not-content', 'true');
        }, (pos, axis) => {
            if (axis == 'horizontal')
                scrolling.setScrollLeft(cm, pos);
            else
                scrolling.updateScrollTop(cm, pos);
        }, cm);
        if (cm.display.scrollbars.undefined)
            dom.addClass(cm.display.wrapper, cm.display.scrollbars.undefined);
    }
    return {
        measureForScrollbars: measureForScrollbars,
        updateScrollbars: updateScrollbars,
        scrollbarModel: scrollbarModel,
        initScrollbars: initScrollbars
    };
});
define('skylark-codemirror/primitives/display/operations',[
    '../line/pos',
    '../line/spans',
    '../measurement/position_measurement',
    '../util/event',
    '../util/dom',
    '../util/operation_group',
    './focus',
    './scrollbars',
    './selection',
    './scrolling',
    './update_display',
    './update_lines'
], function (a, b, c, d, e, f, g, h, i, j, k, l) {
    'use strict';
    let nextOpId = 0;
    function startOperation(cm) {
        cm.curOp = {
            cm: cm,
            viewChanged: false,
            startHeight: cm.doc.height,
            forceUpdate: false,
            updateInput: 0,
            typing: false,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: false,
            updateMaxLine: false,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: false,
            id: ++nextOpId
        };
        f.pushOperation(cm.curOp);
    }
    function endOperation(cm) {
        let op = cm.curOp;
        if (op)
            f.finishOperation(op, group => {
                for (let i = 0; i < group.ops.length; i++)
                    group.ops[i].cm.curOp = null;
                endOperations(group);
            });
    }
    function endOperations(group) {
        let ops = group.ops;
        for (let i = 0; i < ops.length; i++)
            endOperation_R1(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_W1(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_R2(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_W2(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_finish(ops[i]);
    }
    function endOperation_R1(op) {
        let cm = op.cm, display = cm.display;
        k.maybeClipScrollbars(cm);
        if (op.updateMaxLine)
            b.findMaxLine(cm);
        op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
        op.update = op.mustUpdate && new k.DisplayUpdate(cm, op.mustUpdate && {
            top: op.scrollTop,
            ensure: op.scrollToPos
        }, op.forceUpdate);
    }
    function endOperation_W1(op) {
        op.updatedDisplay = op.mustUpdate && k.updateDisplayIfNeeded(op.cm, op.update);
    }
    function endOperation_R2(op) {
        let cm = op.cm, display = cm.display;
        if (op.updatedDisplay)
            l.updateHeightsInViewport(cm);
        op.barMeasure = h.measureForScrollbars(cm);
        if (display.maxLineChanged && !cm.options.lineWrapping) {
            op.adjustWidthTo = c.measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
            cm.display.sizerWidth = op.adjustWidthTo;
            op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + c.scrollGap(cm) + cm.display.barWidth);
            op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - c.displayWidth(cm));
        }
        if (op.updatedDisplay || op.selectionChanged)
            op.preparedSelection = display.input.prepareSelection();
    }
    function endOperation_W2(op) {
        let cm = op.cm;
        if (op.adjustWidthTo != null) {
            cm.display.sizer.style.minWidth = op.adjustWidthTo + 'px';
            if (op.maxScrollLeft < cm.doc.scrollLeft)
                j.setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
            cm.display.maxLineChanged = false;
        }
        let takeFocus = op.focus && op.focus == e.activeElt();
        if (op.preparedSelection)
            cm.display.input.showSelection(op.preparedSelection, takeFocus);
        if (op.updatedDisplay || op.startHeight != cm.doc.height)
            h.updateScrollbars(cm, op.barMeasure);
        if (op.updatedDisplay)
            k.setDocumentHeight(cm, op.barMeasure);
        if (op.selectionChanged)
            i.restartBlink(cm);
        if (cm.state.focused && op.updateInput)
            cm.display.input.reset(op.typing);
        if (takeFocus)
            g.ensureFocus(op.cm);
    }
    function endOperation_finish(op) {
        let cm = op.cm, display = cm.display, doc = cm.doc;
        if (op.updatedDisplay)
            k.postUpdateDisplay(cm, op.update);
        if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
            display.wheelStartX = display.wheelStartY = null;
        if (op.scrollTop != null)
            j.setScrollTop(cm, op.scrollTop, op.forceScroll);
        if (op.scrollLeft != null)
            j.setScrollLeft(cm, op.scrollLeft, true, true);
        if (op.scrollToPos) {
            let rect = j.scrollPosIntoView(cm, a.clipPos(doc, op.scrollToPos.from), a.clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
            j.maybeScrollWindow(cm, rect);
        }
        let hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
        if (hidden)
            for (let i = 0; i < hidden.length; ++i)
                if (!hidden[i].lines.length)
                    d.signal(hidden[i], 'hide');
        if (unhidden)
            for (let i = 0; i < unhidden.length; ++i)
                if (unhidden[i].lines.length)
                    d.signal(unhidden[i], 'unhide');
        if (display.wrapper.offsetHeight)
            doc.scrollTop = cm.display.scroller.scrollTop;
        if (op.changeObjs)
            d.signal(cm, 'changes', cm, op.changeObjs);
        if (op.update)
            op.update.finish();
    }
    function runInOp(cm, f) {
        if (cm.curOp)
            return f();
        startOperation(cm);
        try {
            return f();
        } finally {
            endOperation(cm);
        }
    }
    function operation(cm, f) {
        return function () {
            if (cm.curOp)
                return f.apply(cm, arguments);
            startOperation(cm);
            try {
                return f.apply(cm, arguments);
            } finally {
                endOperation(cm);
            }
        };
    }
    function methodOp(f) {
        return function () {
            if (this.curOp)
                return f.apply(this, arguments);
            startOperation(this);
            try {
                return f.apply(this, arguments);
            } finally {
                endOperation(this);
            }
        };
    }
    function docMethodOp(f) {
        return function () {
            let cm = this.cm;
            if (!cm || cm.curOp)
                return f.apply(this, arguments);
            startOperation(cm);
            try {
                return f.apply(this, arguments);
            } finally {
                endOperation(cm);
            }
        };
    }
    return {
        startOperation: startOperation,
        endOperation: endOperation,
        runInOp: runInOp,
        operation: operation,
        methodOp: methodOp,
        docMethodOp: docMethodOp
    };
});
define('skylark-codemirror/primitives/display/scroll_events',[
    '../util/browser',
    '../util/event',
    './update_display',
    './scrolling'
], function (a, b, c, d) {
    'use strict';
    let wheelSamples = 0, wheelPixelsPerUnit = null;
    if (a.ie)
        wheelPixelsPerUnit = -0.53;
    else if (a.gecko)
        wheelPixelsPerUnit = 15;
    else if (a.chrome)
        wheelPixelsPerUnit = -0.7;
    else if (a.safari)
        wheelPixelsPerUnit = -1 / 3;
    function wheelEventDelta(e) {
        let dx = e.wheelDeltaX, dy = e.wheelDeltaY;
        if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS)
            dx = e.detail;
        if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS)
            dy = e.detail;
        else if (dy == null)
            dy = e.wheelDelta;
        return {
            x: dx,
            y: dy
        };
    }
    function wheelEventPixels(e) {
        let delta = wheelEventDelta(e);
        delta.x *= wheelPixelsPerUnit;
        delta.y *= wheelPixelsPerUnit;
        return delta;
    }
    function onScrollWheel(cm, e) {
        let delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
        let display = cm.display, scroll = display.scroller;
        let canScrollX = scroll.scrollWidth > scroll.clientWidth;
        let canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (!(dx && canScrollX || dy && canScrollY))
            return;
        if (dy && a.mac && a.webkit) {
            outer:
                for (let cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
                    for (let i = 0; i < view.length; i++) {
                        if (view[i].node == cur) {
                            cm.display.currentWheelTarget = cur;
                            break outer;
                        }
                    }
                }
        }
        if (dx && !a.gecko && !a.presto && wheelPixelsPerUnit != null) {
            if (dy && canScrollY)
                d.updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * wheelPixelsPerUnit));
            d.setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * wheelPixelsPerUnit));
            if (!dy || dy && canScrollY)
                b.e_preventDefault(e);
            display.wheelStartX = null;
            return;
        }
        if (dy && wheelPixelsPerUnit != null) {
            let pixels = dy * wheelPixelsPerUnit;
            let top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
            if (pixels < 0)
                top = Math.max(0, top + pixels - 50);
            else
                bot = Math.min(cm.doc.height, bot + pixels + 50);
            c.updateDisplaySimple(cm, {
                top: top,
                bottom: bot
            });
        }
        if (wheelSamples < 20) {
            if (display.wheelStartX == null) {
                display.wheelStartX = scroll.scrollLeft;
                display.wheelStartY = scroll.scrollTop;
                display.wheelDX = dx;
                display.wheelDY = dy;
                setTimeout(() => {
                    if (display.wheelStartX == null)
                        return;
                    let movedX = scroll.scrollLeft - display.wheelStartX;
                    let movedY = scroll.scrollTop - display.wheelStartY;
                    let sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                    display.wheelStartX = display.wheelStartY = null;
                    if (!sample)
                        return;
                    wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
                    ++wheelSamples;
                }, 200);
            } else {
                display.wheelDX += dx;
                display.wheelDY += dy;
            }
        }
    }
    return {
        wheelEventPixels: wheelEventPixels,
        onScrollWheel: onScrollWheel
    };
});
define('skylark-codemirror/primitives/display/highlight_worker',[
    '../line/highlight',
    '../modes',
    '../util/misc',
    './operations',
    './view_tracking'
], function (highlight, models, misc, operations, view_tracking) {
    'use strict';
    function startWorker(cm, time) {
        if (cm.doc.highlightFrontier < cm.display.viewTo)
            cm.state.highlight.set(time, misc.bind(highlightWorker, cm));
    }
    function highlightWorker(cm) {
        let doc = cm.doc;
        if (doc.highlightFrontier >= cm.display.viewTo)
            return;
        let end = +new Date() + cm.options.workTime;
        let context = highlight.getContextBefore(cm, doc.highlightFrontier);
        let changedLines = [];
        doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), line => {
            if (context.line >= cm.display.viewFrom) {
                let oldStyles = line.styles;
                let resetState = line.text.length > cm.options.maxHighlightLength ? models.copyState(doc.mode, context.state) : null;
                let highlighted = highlight.highlightLine(cm, line, context, true);
                if (resetState)
                    context.state = resetState;
                line.styles = highlighted.styles;
                let oldCls = line.styleClasses, newCls = highlighted.classes;
                if (newCls)
                    line.styleClasses = newCls;
                else if (oldCls)
                    line.styleClasses = null;
                let ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
                for (let i = 0; !ischange && i < oldStyles.length; ++i)
                    ischange = oldStyles[i] != line.styles[i];
                if (ischange)
                    changedLines.push(context.line);
                line.stateAfter = context.save();
                context.nextLine();
            } else {
                if (line.text.length <= cm.options.maxHighlightLength)
                    highlight.processLine(cm, line.text, context);
                line.stateAfter = context.line % 5 == 0 ? context.save() : null;
                context.nextLine();
            }
            if (+new Date() > end) {
                startWorker(cm, cm.options.workDelay);
                return true;
            }
        });
        doc.highlightFrontier = context.line;
        doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
        if (changedLines.length)
            operations.runInOp(cm, () => {
                for (let i = 0; i < changedLines.length; i++)
                    view_tracking.regLineChange(cm, changedLines[i], 'text');
            });
    }
    return { startWorker: startWorker };
});
define('skylark-codemirror/primitives/model/selection',[
    '../line/pos',
    '../util/misc'
], function (m_pos, m_misc) {
    'use strict';
    class Selection {
        constructor(ranges, primIndex) {
            this.ranges = ranges;
            this.primIndex = primIndex;
        }
        primary() {
            return this.ranges[this.primIndex];
        }
        equals(other) {
            if (other == this)
                return true;
            if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length)
                return false;
            for (let i = 0; i < this.ranges.length; i++) {
                let here = this.ranges[i], there = other.ranges[i];
                if (!m_pos.equalCursorPos(here.anchor, there.anchor) || !m_pos.equalCursorPos(here.head, there.head))
                    return false;
            }
            return true;
        }
        deepCopy() {
            let out = [];
            for (let i = 0; i < this.ranges.length; i++)
                out[i] = new Range(m_pos.copyPos(this.ranges[i].anchor), m_pos.copyPos(this.ranges[i].head));
            return new Selection(out, this.primIndex);
        }
        somethingSelected() {
            for (let i = 0; i < this.ranges.length; i++)
                if (!this.ranges[i].empty())
                    return true;
            return false;
        }
        contains(pos, end) {
            if (!end)
                end = pos;
            for (let i = 0; i < this.ranges.length; i++) {
                let range = this.ranges[i];
                if (m_pos.cmp(end, range.from()) >= 0 && m_pos.cmp(pos, range.to()) <= 0)
                    return i;
            }
            return -1;
        }
    }
    class Range {
        constructor(anchor, head) {
            this.anchor = anchor;
            this.head = head;
        }
        from() {
            return m_pos.minPos(this.anchor, this.head);
        }
        to() {
            return m_pos.maxPos(this.anchor, this.head);
        }
        empty() {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
        }
    }
    function normalizeSelection(cm, ranges, primIndex) {
        let mayTouch = cm && cm.options.selectionsMayTouch;
        let prim = ranges[primIndex];
        ranges.sort((a, b) => m_pos.cmp(a.from(), b.from()));
        primIndex = m_misc.indexOf(ranges, prim);
        for (let i = 1; i < ranges.length; i++) {
            let cur = ranges[i], prev = ranges[i - 1];
            let diff = m_pos.cmp(prev.to(), cur.from());
            if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
                let from = m_pos.minPos(prev.from(), cur.from()), to = m_pos.maxPos(prev.to(), cur.to());
                let inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
                if (i <= primIndex)
                    --primIndex;
                ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
            }
        }
        return new Selection(ranges, primIndex);
    }
    function simpleSelection(anchor, head) {
        return new Selection([new Range(anchor, head || anchor)], 0);
    }
    return {
        Selection: Selection,
        Range: Range,
        normalizeSelection: normalizeSelection,
        simpleSelection: simpleSelection
    };
});
define('skylark-codemirror/primitives/model/change_measurement',[
    '../line/pos',
    '../util/misc',
    './selection'
], function (line_pos, misc, selection) {
    'use strict';
    function changeEnd(change) {
        if (!change.text)
            return change.to;
        return line_pos.Pos(change.from.line + change.text.length - 1, misc.lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
    }
    function adjustForChange(pos, change) {
        if (line_pos.cmp(pos, change.from) < 0)
            return pos;
        if (line_pos.cmp(pos, change.to) <= 0)
            return changeEnd(change);
        let line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line)
            ch += changeEnd(change).ch - change.to.ch;
        return line_pos.Pos(line, ch);
    }
    function computeSelAfterChange(doc, change) {
        let out = [];
        for (let i = 0; i < doc.sel.ranges.length; i++) {
            let range = doc.sel.ranges[i];
            out.push(new selection.Range(adjustForChange(range.anchor, change), adjustForChange(range.head, change)));
        }
        return selection.normalizeSelection(doc.cm, out, doc.sel.primIndex);
    }
    function offsetPos(pos, old, nw) {
        if (pos.line == old.line)
            return line_pos.Pos(nw.line, pos.ch - old.ch + nw.ch);
        else
            return line_pos.Pos(nw.line + (pos.line - old.line), pos.ch);
    }
    function computeReplacedSel(doc, changes, hint) {
        let out = [];
        let oldPrev = line_pos.Pos(doc.first, 0), newPrev = oldPrev;
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            let from = offsetPos(change.from, oldPrev, newPrev);
            let to = offsetPos(changeEnd(change), oldPrev, newPrev);
            oldPrev = change.to;
            newPrev = to;
            if (hint == 'around') {
                let range = doc.sel.ranges[i], inv = line_pos.cmp(range.head, range.anchor) < 0;
                out[i] = new selection.Range(inv ? to : from, inv ? from : to);
            } else {
                out[i] = new selection.Range(from, from);
            }
        }
        return new selection.Selection(out, doc.sel.primIndex);
    }
    return {
        changeEnd: changeEnd,
        computeSelAfterChange: computeSelAfterChange,
        computeReplacedSel: computeReplacedSel
    };
});
define('skylark-codemirror/primitives/display/mode_state',[
    '../modes',
    //'./highlight_worker',// dependence cycle 
    './view_tracking'
], function (
    models, 
    //highlight_worker, 
    view_tracking
) {
    'use strict';
    function loadMode(cm) {
        cm.doc.mode = models.getMode(cm.options, cm.doc.modeOption);
        resetModeState(cm);
    }
    function resetModeState(cm) {
        cm.doc.iter(line => {
            if (line.stateAfter)
                line.stateAfter = null;
            if (line.styles)
                line.styles = null;
        });
        cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
        cm.startWorker(cm, 100); // highlight_worker.startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp)
            view_tracking.regChange(cm);
    }
    return {
        loadMode: loadMode,
        resetModeState: resetModeState
    };
});
define('skylark-codemirror/primitives/model/document_data',[
    '../display/mode_state',
    '../display/operations',
    '../display/view_tracking',
    '../line/line_data',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/dom',
    '../util/misc',
    '../util/operation_group'
], function (a, b, c, d, e, f, g, h, i, j) {
    'use strict';
    function isWholeLineUpdate(doc, change) {
        return change.from.ch == 0 && change.to.ch == 0 && i.lst(change.text) == '' && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
    }
    function updateDoc(doc, change, markedSpans, estimateHeight) {
        function spansFor(n) {
            return markedSpans ? markedSpans[n] : null;
        }
        function update(line, text, spans) {
            d.updateLine(line, text, spans, estimateHeight);
            j.signalLater(line, 'change', line, change);
        }
        function linesFor(start, end) {
            let result = [];
            for (let i = start; i < end; ++i)
                result.push(new d.Line(text[i], spansFor(i), estimateHeight));
            return result;
        }
        let from = change.from, to = change.to, text = change.text;
        let firstLine = f.getLine(doc, from.line), lastLine = f.getLine(doc, to.line);
        let lastText = i.lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        if (change.full) {
            doc.insert(0, linesFor(0, text.length));
            doc.remove(text.length, doc.size - text.length);
        } else if (isWholeLineUpdate(doc, change)) {
            let added = linesFor(0, text.length - 1);
            update(lastLine, lastLine.text, lastSpans);
            if (nlines)
                doc.remove(from.line, nlines);
            if (added.length)
                doc.insert(from.line, added);
        } else if (firstLine == lastLine) {
            if (text.length == 1) {
                update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
            } else {
                let added = linesFor(1, text.length - 1);
                added.push(new d.Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
                update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
                doc.insert(from.line + 1, added);
            }
        } else if (text.length == 1) {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
            doc.remove(from.line + 1, nlines);
        } else {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
            update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
            let added = linesFor(1, text.length - 1);
            if (nlines > 1)
                doc.remove(from.line + 1, nlines - 1);
            doc.insert(from.line + 1, added);
        }
        j.signalLater(doc, 'change', doc, change);
    }
    function linkedDocs(doc, f, sharedHistOnly) {
        function propagate(doc, skip, sharedHist) {
            if (doc.linked)
                for (let i = 0; i < doc.linked.length; ++i) {
                    let rel = doc.linked[i];
                    if (rel.doc == skip)
                        continue;
                    let shared = sharedHist && rel.sharedHist;
                    if (sharedHistOnly && !shared)
                        continue;
                    f(rel.doc, shared);
                    propagate(rel.doc, doc, shared);
                }
        }
        propagate(doc, null, true);
    }
    function attachDoc(cm, doc) {
        if (doc.cm)
            throw new Error('This document is already in use.');
        cm.doc = doc;
        doc.cm = cm;
        g.estimateLineHeights(cm);
        a.loadMode(cm);
        setDirectionClass(cm);
        if (!cm.options.lineWrapping)
            e.findMaxLine(cm);
        cm.options.mode = doc.modeOption;
        c.regChange(cm);
    }
    function setDirectionClass(cm) {
        ;
        (cm.doc.direction == 'rtl' ? h.addClass : h.rmClass)(cm.display.lineDiv, 'CodeMirror-rtl');
    }
    function directionChanged(cm) {
        b.runInOp(cm, () => {
            setDirectionClass(cm);
            c.regChange(cm);
        });
    }
    return {
        isWholeLineUpdate: isWholeLineUpdate,
        updateDoc: updateDoc,
        linkedDocs: linkedDocs,
        attachDoc: attachDoc,
        directionChanged: directionChanged
    };
});
define('skylark-codemirror/primitives/model/history',[
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/event',
    '../util/misc',
    './change_measurement',
    './document_data',
    './selection'
], function (a, b, c, d, e, f, g, h) {
    'use strict';
    function History(startGen) {
        this.done = [];
        this.undone = [];
        this.undoDepth = Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = startGen || 1;
    }
    function historyChangeFromChange(doc, change) {
        let histChange = {
            from: a.copyPos(change.from),
            to: f.changeEnd(change),
            text: c.getBetween(doc, change.from, change.to)
        };
        attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        g.linkedDocs(doc, doc => attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1), true);
        return histChange;
    }
    function clearSelectionEvents(array) {
        while (array.length) {
            let last = e.lst(array);
            if (last.ranges)
                array.pop();
            else
                break;
        }
    }
    function lastChangeEvent(hist, force) {
        if (force) {
            clearSelectionEvents(hist.done);
            return e.lst(hist.done);
        } else if (hist.done.length && !e.lst(hist.done).ranges) {
            return e.lst(hist.done);
        } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
            hist.done.pop();
            return e.lst(hist.done);
        }
    }
    function addChangeToHistory(doc, change, selAfter, opId) {
        let hist = doc.history;
        hist.undone.length = 0;
        let time = +new Date(), cur;
        let last;
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == '+' && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == '*')) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
            last = e.lst(cur.changes);
            if (a.cmp(change.from, change.to) == 0 && a.cmp(change.from, last.to) == 0) {
                last.to = f.changeEnd(change);
            } else {
                cur.changes.push(historyChangeFromChange(doc, change));
            }
        } else {
            let before = e.lst(hist.done);
            if (!before || !before.ranges)
                pushSelectionToHistory(doc.sel, hist.done);
            cur = {
                changes: [historyChangeFromChange(doc, change)],
                generation: hist.generation
            };
            hist.done.push(cur);
            while (hist.done.length > hist.undoDepth) {
                hist.done.shift();
                if (!hist.done[0].ranges)
                    hist.done.shift();
            }
        }
        hist.done.push(selAfter);
        hist.generation = ++hist.maxGeneration;
        hist.lastModTime = hist.lastSelTime = time;
        hist.lastOp = hist.lastSelOp = opId;
        hist.lastOrigin = hist.lastSelOrigin = change.origin;
        if (!last)
            d.signal(doc, 'historyAdded');
    }
    function selectionEventCanBeMerged(doc, origin, prev, sel) {
        let ch = origin.charAt(0);
        return ch == '*' || ch == '+' && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && new Date() - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
    }
    function addSelectionToHistory(doc, sel, opId, options) {
        let hist = doc.history, origin = options && options.origin;
        if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc, origin, e.lst(hist.done), sel)))
            hist.done[hist.done.length - 1] = sel;
        else
            pushSelectionToHistory(sel, hist.done);
        hist.lastSelTime = +new Date();
        hist.lastSelOrigin = origin;
        hist.lastSelOp = opId;
        if (options && options.clearRedo !== false)
            clearSelectionEvents(hist.undone);
    }
    function pushSelectionToHistory(sel, dest) {
        let top = e.lst(dest);
        if (!(top && top.ranges && top.equals(sel)))
            dest.push(sel);
    }
    function attachLocalSpans(doc, change, from, to) {
        let existing = change['spans_' + doc.id], n = 0;
        doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), line => {
            if (line.markedSpans)
                (existing || (existing = change['spans_' + doc.id] = {}))[n] = line.markedSpans;
            ++n;
        });
    }
    function removeClearedSpans(spans) {
        if (!spans)
            return null;
        let out;
        for (let i = 0; i < spans.length; ++i) {
            if (spans[i].marker.explicitlyCleared) {
                if (!out)
                    out = spans.slice(0, i);
            } else if (out)
                out.push(spans[i]);
        }
        return !out ? spans : out.length ? out : null;
    }
    function getOldSpans(doc, change) {
        let found = change['spans_' + doc.id];
        if (!found)
            return null;
        let nw = [];
        for (let i = 0; i < change.text.length; ++i)
            nw.push(removeClearedSpans(found[i]));
        return nw;
    }
    function mergeOldSpans(doc, change) {
        let old = getOldSpans(doc, change);
        let stretched = b.stretchSpansOverChange(doc, change);
        if (!old)
            return stretched;
        if (!stretched)
            return old;
        for (let i = 0; i < old.length; ++i) {
            let oldCur = old[i], stretchCur = stretched[i];
            if (oldCur && stretchCur) {
                spans:
                    for (let j = 0; j < stretchCur.length; ++j) {
                        let span = stretchCur[j];
                        for (let k = 0; k < oldCur.length; ++k)
                            if (oldCur[k].marker == span.marker)
                                continue spans;
                        oldCur.push(span);
                    }
            } else if (stretchCur) {
                old[i] = stretchCur;
            }
        }
        return old;
    }
    function copyHistoryArray(events, newGroup, instantiateSel) {
        let copy = [];
        for (let i = 0; i < events.length; ++i) {
            let event = events[i];
            if (event.ranges) {
                copy.push(instantiateSel ? h.Selection.prototype.deepCopy.call(event) : event);
                continue;
            }
            let changes = event.changes, newChanges = [];
            copy.push({ changes: newChanges });
            for (let j = 0; j < changes.length; ++j) {
                let change = changes[j], m;
                newChanges.push({
                    from: change.from,
                    to: change.to,
                    text: change.text
                });
                if (newGroup)
                    for (var prop in change)
                        if (m = prop.match(/^spans_(\d+)$/)) {
                            if (e.indexOf(newGroup, Number(m[1])) > -1) {
                                e.lst(newChanges)[prop] = change[prop];
                                delete change[prop];
                            }
                        }
            }
        }
        return copy;
    }
    return {
        History: History,
        historyChangeFromChange: historyChangeFromChange,
        addChangeToHistory: addChangeToHistory,
        addSelectionToHistory: addSelectionToHistory,
        pushSelectionToHistory: pushSelectionToHistory,
        mergeOldSpans: mergeOldSpans,
        copyHistoryArray: copyHistoryArray
    };
});
define('skylark-codemirror/primitives/model/selection_updates',[
    '../util/operation_group',
    '../display/scrolling',
    '../line/pos',
    '../line/utils_line',
    '../util/event',
    '../util/misc',
    './history',
    './selection'
], function (a, b, c, d, e, f, g, h) {
    'use strict';
    function extendRange(range, head, other, extend) {
        if (extend) {
            let anchor = range.anchor;
            if (other) {
                let posBefore = c.cmp(head, anchor) < 0;
                if (posBefore != c.cmp(other, anchor) < 0) {
                    anchor = head;
                    head = other;
                } else if (posBefore != c.cmp(head, other) < 0) {
                    head = other;
                }
            }
            return new h.Range(anchor, head);
        } else {
            return new h.Range(other || head, head);
        }
    }
    function extendSelection(doc, head, other, options, extend) {
        if (extend == null)
            extend = doc.cm && (doc.cm.display.shift || doc.extend);
        setSelection(doc, new h.Selection([extendRange(doc.sel.primary(), head, other, extend)], 0), options);
    }
    function extendSelections(doc, heads, options) {
        let out = [];
        let extend = doc.cm && (doc.cm.display.shift || doc.extend);
        for (let i = 0; i < doc.sel.ranges.length; i++)
            out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend);
        let newSel = h.normalizeSelection(doc.cm, out, doc.sel.primIndex);
        setSelection(doc, newSel, options);
    }
    function replaceOneSelection(doc, i, range, options) {
        let ranges = doc.sel.ranges.slice(0);
        ranges[i] = range;
        setSelection(doc, h.normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
    }
    function setSimpleSelection(doc, anchor, head, options) {
        setSelection(doc, h.simpleSelection(anchor, head), options);
    }
    function filterSelectionChange(doc, sel, options) {
        let obj = {
            ranges: sel.ranges,
            update: function (ranges) {
                this.ranges = [];
                for (let i = 0; i < ranges.length; i++)
                    this.ranges[i] = new h.Range(c.clipPos(doc, ranges[i].anchor), c.clipPos(doc, ranges[i].head));
            },
            origin: options && options.origin
        };
        e.signal(doc, 'beforeSelectionChange', doc, obj);
        if (doc.cm)
            e.signal(doc.cm, 'beforeSelectionChange', doc.cm, obj);
        if (obj.ranges != sel.ranges)
            return h.normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1);
        else
            return sel;
    }
    function setSelectionReplaceHistory(doc, sel, options) {
        let done = doc.history.done, last = f.lst(done);
        if (last && last.ranges) {
            done[done.length - 1] = sel;
            setSelectionNoUndo(doc, sel, options);
        } else {
            setSelection(doc, sel, options);
        }
    }
    function setSelection(doc, sel, options) {
        setSelectionNoUndo(doc, sel, options);
        g.addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
    }
    function setSelectionNoUndo(doc, sel, options) {
        if (e.hasHandler(doc, 'beforeSelectionChange') || doc.cm && e.hasHandler(doc.cm, 'beforeSelectionChange'))
            sel = filterSelectionChange(doc, sel, options);
        let bias = options && options.bias || (c.cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
        setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
        if (!(options && options.scroll === false) && doc.cm)
            b.ensureCursorVisible(doc.cm);
    }
    function setSelectionInner(doc, sel) {
        if (sel.equals(doc.sel))
            return;
        doc.sel = sel;
        if (doc.cm) {
            doc.cm.curOp.updateInput = 1;
            doc.cm.curOp.selectionChanged = true;
            e.signalCursorActivity(doc.cm);
        }
        a.signalLater(doc, 'cursorActivity', doc);
    }
    function reCheckSelection(doc) {
        setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
    }
    function skipAtomicInSelection(doc, sel, bias, mayClear) {
        let out;
        for (let i = 0; i < sel.ranges.length; i++) {
            let range = sel.ranges[i];
            let old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
            let newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
            let newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
            if (out || newAnchor != range.anchor || newHead != range.head) {
                if (!out)
                    out = sel.ranges.slice(0, i);
                out[i] = new h.Range(newAnchor, newHead);
            }
        }
        return out ? h.normalizeSelection(doc.cm, out, sel.primIndex) : sel;
    }
    function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
        let line = d.getLine(doc, pos.line);
        if (line.markedSpans)
            for (let i = 0; i < line.markedSpans.length; ++i) {
                let sp = line.markedSpans[i], m = sp.marker;
                if ((sp.from == null || (m.inclusiveLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (m.inclusiveRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
                    if (mayClear) {
                        e.signal(m, 'beforeCursorEnter');
                        if (m.explicitlyCleared) {
                            if (!line.markedSpans)
                                break;
                            else {
                                --i;
                                continue;
                            }
                        }
                    }
                    if (!m.atomic)
                        continue;
                    if (oldPos) {
                        let near = m.find(dir < 0 ? 1 : -1), diff;
                        if (dir < 0 ? m.inclusiveRight : m.inclusiveLeft)
                            near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
                        if (near && near.line == pos.line && (diff = c.cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0))
                            return skipAtomicInner(doc, near, pos, dir, mayClear);
                    }
                    let far = m.find(dir < 0 ? -1 : 1);
                    if (dir < 0 ? m.inclusiveLeft : m.inclusiveRight)
                        far = movePos(doc, far, dir, far.line == pos.line ? line : null);
                    return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
                }
            }
        return pos;
    }
    function skipAtomic(doc, pos, oldPos, bias, mayClear) {
        let dir = bias || 1;
        let found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, true) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true);
        if (!found) {
            doc.cantEdit = true;
            return c.Pos(doc.first, 0);
        }
        return found;
    }
    function movePos(doc, pos, dir, line) {
        if (dir < 0 && pos.ch == 0) {
            if (pos.line > doc.first)
                return c.clipPos(doc, c.Pos(pos.line - 1));
            else
                return null;
        } else if (dir > 0 && pos.ch == (line || d.getLine(doc, pos.line)).text.length) {
            if (pos.line < doc.first + doc.size - 1)
                return c.Pos(pos.line + 1, 0);
            else
                return null;
        } else {
            return new c.Pos(pos.line, pos.ch + dir);
        }
    }
    function selectAll(cm) {
        cm.setSelection(c.Pos(cm.firstLine(), 0), c.Pos(cm.lastLine()), f.sel_dontScroll);
    }
    return {
        extendRange: extendRange,
        extendSelection: extendSelection,
        extendSelections: extendSelections,
        replaceOneSelection: replaceOneSelection,
        setSimpleSelection: setSimpleSelection,
        setSelectionReplaceHistory: setSelectionReplaceHistory,
        setSelection: setSelection,
        setSelectionNoUndo: setSelectionNoUndo,
        reCheckSelection: reCheckSelection,
        skipAtomic: skipAtomic,
        selectAll: selectAll
    };
});
define('skylark-codemirror/primitives/model/changes',[
    '../line/highlight',
    '../display/highlight_worker',
    '../display/operations',
    '../display/view_tracking',
    '../line/pos',
    '../line/saw_special_spans',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/event',
    '../util/misc',
    '../util/operation_group',
    './change_measurement',
    './document_data',
    './history',
    './selection',
    './selection_updates'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    'use strict';
    function filterChange(doc, change, update) {
        let obj = {
            canceled: false,
            from: change.from,
            to: change.to,
            text: change.text,
            origin: change.origin,
            cancel: () => obj.canceled = true
        };
        if (update)
            obj.update = (from, to, text, origin) => {
                if (from)
                    obj.from = e.clipPos(doc, from);
                if (to)
                    obj.to = e.clipPos(doc, to);
                if (text)
                    obj.text = text;
                if (origin !== undefined)
                    obj.origin = origin;
            };
        j.signal(doc, 'beforeChange', doc, obj);
        if (doc.cm)
            j.signal(doc.cm, 'beforeChange', doc.cm, obj);
        if (obj.canceled) {
            if (doc.cm)
                doc.cm.curOp.updateInput = 2;
            return null;
        }
        return {
            from: obj.from,
            to: obj.to,
            text: obj.text,
            origin: obj.origin
        };
    }
    function makeChange(doc, change, ignoreReadOnly) {
        if (doc.cm) {
            if (!doc.cm.curOp)
                return c.operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
            if (doc.cm.state.suppressEdits)
                return;
        }
        if (j.hasHandler(doc, 'beforeChange') || doc.cm && j.hasHandler(doc.cm, 'beforeChange')) {
            change = filterChange(doc, change, true);
            if (!change)
                return;
        }
        let split = f.sawReadOnlySpans && !ignoreReadOnly && g.removeReadOnlyRanges(doc, change.from, change.to);
        if (split) {
            for (let i = split.length - 1; i >= 0; --i)
                makeChangeInner(doc, {
                    from: split[i].from,
                    to: split[i].to,
                    text: i ? [''] : change.text,
                    origin: change.origin
                });
        } else {
            makeChangeInner(doc, change);
        }
    }
    function makeChangeInner(doc, change) {
        if (change.text.length == 1 && change.text[0] == '' && e.cmp(change.from, change.to) == 0)
            return;
        let selAfter = m.computeSelAfterChange(doc, change);
        o.addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
        makeChangeSingleDoc(doc, change, selAfter, g.stretchSpansOverChange(doc, change));
        let rebased = [];
        n.linkedDocs(doc, (doc, sharedHist) => {
            if (!sharedHist && k.indexOf(rebased, doc.history) == -1) {
                rebaseHist(doc.history, change);
                rebased.push(doc.history);
            }
            makeChangeSingleDoc(doc, change, null, g.stretchSpansOverChange(doc, change));
        });
    }
    function makeChangeFromHistory(doc, type, allowSelectionOnly) {
        let suppress = doc.cm && doc.cm.state.suppressEdits;
        if (suppress && !allowSelectionOnly)
            return;
        let hist = doc.history, event, selAfter = doc.sel;
        let source = type == 'undo' ? hist.done : hist.undone, dest = type == 'undo' ? hist.undone : hist.done;
        let i = 0;
        for (; i < source.length; i++) {
            event = source[i];
            if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
                break;
        }
        if (i == source.length)
            return;
        hist.lastOrigin = hist.lastSelOrigin = null;
        for (;;) {
            event = source.pop();
            if (event.ranges) {
                o.pushSelectionToHistory(event, dest);
                if (allowSelectionOnly && !event.equals(doc.sel)) {
                    q.setSelection(doc, event, { clearRedo: false });
                    return;
                }
                selAfter = event;
            } else if (suppress) {
                source.push(event);
                return;
            } else
                break;
        }
        let antiChanges = [];
        o.pushSelectionToHistory(selAfter, dest);
        dest.push({
            changes: antiChanges,
            generation: hist.generation
        });
        hist.generation = event.generation || ++hist.maxGeneration;
        let filter = j.hasHandler(doc, 'beforeChange') || doc.cm && j.hasHandler(doc.cm, 'beforeChange');
        for (let i = event.changes.length - 1; i >= 0; --i) {
            let change = event.changes[i];
            change.origin = type;
            if (filter && !filterChange(doc, change, false)) {
                source.length = 0;
                return;
            }
            antiChanges.push(o.historyChangeFromChange(doc, change));
            let after = i ? m.computeSelAfterChange(doc, change) : k.lst(source);
            makeChangeSingleDoc(doc, change, after, o.mergeOldSpans(doc, change));
            if (!i && doc.cm)
                doc.cm.scrollIntoView({
                    from: change.from,
                    to: m.changeEnd(change)
                });
            let rebased = [];
            n.linkedDocs(doc, (doc, sharedHist) => {
                if (!sharedHist && k.indexOf(rebased, doc.history) == -1) {
                    rebaseHist(doc.history, change);
                    rebased.push(doc.history);
                }
                makeChangeSingleDoc(doc, change, null, o.mergeOldSpans(doc, change));
            });
        }
    }
    function shiftDoc(doc, distance) {
        if (distance == 0)
            return;
        doc.first += distance;
        doc.sel = new p.Selection(k.map(doc.sel.ranges, range => new p.Range(e.Pos(range.anchor.line + distance, range.anchor.ch), e.Pos(range.head.line + distance, range.head.ch))), doc.sel.primIndex);
        if (doc.cm) {
            d.regChange(doc.cm, doc.first, doc.first - distance, distance);
            for (let d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
                d.regLineChange(doc.cm, l, 'gutter');
        }
    }
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
        if (doc.cm && !doc.cm.curOp)
            return c.operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
        if (change.to.line < doc.first) {
            shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
            return;
        }
        if (change.from.line > doc.lastLine())
            return;
        if (change.from.line < doc.first) {
            let shift = change.text.length - 1 - (doc.first - change.from.line);
            shiftDoc(doc, shift);
            change = {
                from: e.Pos(doc.first, 0),
                to: e.Pos(change.to.line + shift, change.to.ch),
                text: [k.lst(change.text)],
                origin: change.origin
            };
        }
        let last = doc.lastLine();
        if (change.to.line > last) {
            change = {
                from: change.from,
                to: e.Pos(last, h.getLine(doc, last).text.length),
                text: [change.text[0]],
                origin: change.origin
            };
        }
        change.removed = h.getBetween(doc, change.from, change.to);
        if (!selAfter)
            selAfter = m.computeSelAfterChange(doc, change);
        if (doc.cm)
            makeChangeSingleDocInEditor(doc.cm, change, spans);
        else
            n.updateDoc(doc, change, spans);
        q.setSelectionNoUndo(doc, selAfter, k.sel_dontScroll);
    }
    function makeChangeSingleDocInEditor(cm, change, spans) {
        let doc = cm.doc, display = cm.display, from = change.from, to = change.to;
        let recomputeMaxLength = false, checkWidthStart = from.line;
        if (!cm.options.lineWrapping) {
            checkWidthStart = h.lineNo(g.visualLine(h.getLine(doc, from.line)));
            doc.iter(checkWidthStart, to.line + 1, line => {
                if (line == display.maxLine) {
                    recomputeMaxLength = true;
                    return true;
                }
            });
        }
        if (doc.sel.contains(change.from, change.to) > -1)
            j.signalCursorActivity(cm);
        n.updateDoc(doc, change, spans, i.estimateHeight(cm));
        if (!cm.options.lineWrapping) {
            doc.iter(checkWidthStart, from.line + change.text.length, line => {
                let len = g.lineLength(line);
                if (len > display.maxLineLength) {
                    display.maxLine = line;
                    display.maxLineLength = len;
                    display.maxLineChanged = true;
                    recomputeMaxLength = false;
                }
            });
            if (recomputeMaxLength)
                cm.curOp.updateMaxLine = true;
        }
        a.retreatFrontier(doc, from.line);
        b.startWorker(cm, 400);
        let lendiff = change.text.length - (to.line - from.line) - 1;
        if (change.full)
            d.regChange(cm);
        else if (from.line == to.line && change.text.length == 1 && !n.isWholeLineUpdate(cm.doc, change))
            d.regLineChange(cm, from.line, 'text');
        else
            d.regChange(cm, from.line, to.line + 1, lendiff);
        let changesHandler = j.hasHandler(cm, 'changes'), changeHandler = j.hasHandler(cm, 'change');
        if (changeHandler || changesHandler) {
            let obj = {
                from: from,
                to: to,
                text: change.text,
                removed: change.removed,
                origin: change.origin
            };
            if (changeHandler)
                l.signalLater(cm, 'change', cm, obj);
            if (changesHandler)
                (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
        }
        cm.display.selForContextMenu = null;
    }
    function replaceRange(doc, code, from, to, origin) {
        if (!to)
            to = from;
        if (e.cmp(to, from) < 0)
            [from, to] = [
                to,
                from
            ];
        if (typeof code == 'string')
            code = doc.splitLines(code);
        makeChange(doc, {
            from,
            to,
            text: code,
            origin
        });
    }
    function rebaseHistSelSingle(pos, from, to, diff) {
        if (to < pos.line) {
            pos.line += diff;
        } else if (from < pos.line) {
            pos.line = from;
            pos.ch = 0;
        }
    }
    function rebaseHistArray(array, from, to, diff) {
        for (let i = 0; i < array.length; ++i) {
            let sub = array[i], ok = true;
            if (sub.ranges) {
                if (!sub.copied) {
                    sub = array[i] = sub.deepCopy();
                    sub.copied = true;
                }
                for (let j = 0; j < sub.ranges.length; j++) {
                    rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
                    rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
                }
                continue;
            }
            for (let j = 0; j < sub.changes.length; ++j) {
                let cur = sub.changes[j];
                if (to < cur.from.line) {
                    cur.from = e.Pos(cur.from.line + diff, cur.from.ch);
                    cur.to = e.Pos(cur.to.line + diff, cur.to.ch);
                } else if (from <= cur.to.line) {
                    ok = false;
                    break;
                }
            }
            if (!ok) {
                array.splice(0, i + 1);
                i = 0;
            }
        }
    }
    function rebaseHist(hist, change) {
        let from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff);
        rebaseHistArray(hist.undone, from, to, diff);
    }
    function changeLine(doc, handle, changeType, op) {
        let no = handle, line = handle;
        if (typeof handle == 'number')
            line = h.getLine(doc, e.clipLine(doc, handle));
        else
            no = h.lineNo(handle);
        if (no == null)
            return null;
        if (op(line, no) && doc.cm)
            d.regLineChange(doc.cm, no, changeType);
        return line;
    }
    return {
        makeChange: makeChange,
        makeChangeFromHistory: makeChangeFromHistory,
        replaceRange: replaceRange,
        changeLine: changeLine
    };
});
define('skylark-codemirror/primitives/model/chunk',[
    '../line/line_data',
    '../util/misc',
    '../util/operation_group'
], function (a, b, c) {
    'use strict';
    function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        let height = 0;
        for (let i = 0; i < lines.length; ++i) {
            lines[i].parent = this;
            height += lines[i].height;
        }
        this.height = height;
    }
    LeafChunk.prototype = {
        chunkSize() {
            return this.lines.length;
        },
        removeInner(at, n) {
            for (let i = at, e = at + n; i < e; ++i) {
                let line = this.lines[i];
                this.height -= line.height;
                a.cleanUpLine(line);
                c.signalLater(line, 'delete');
            }
            this.lines.splice(at, n);
        },
        collapse(lines) {
            lines.push.apply(lines, this.lines);
        },
        insertInner(at, lines, height) {
            this.height += height;
            this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
            for (let i = 0; i < lines.length; ++i)
                lines[i].parent = this;
        },
        iterN(at, n, op) {
            for (let e = at + n; at < e; ++at)
                if (op(this.lines[at]))
                    return true;
        }
    };
    function BranchChunk(children) {
        this.children = children;
        let size = 0, height = 0;
        for (let i = 0; i < children.length; ++i) {
            let ch = children[i];
            size += ch.chunkSize();
            height += ch.height;
            ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
    }
    BranchChunk.prototype = {
        chunkSize() {
            return this.size;
        },
        removeInner(at, n) {
            this.size -= n;
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    let rm = Math.min(n, sz - at), oldHeight = child.height;
                    child.removeInner(at, rm);
                    this.height -= oldHeight - child.height;
                    if (sz == rm) {
                        this.children.splice(i--, 1);
                        child.parent = null;
                    }
                    if ((n -= rm) == 0)
                        break;
                    at = 0;
                } else
                    at -= sz;
            }
            if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
                let lines = [];
                this.collapse(lines);
                this.children = [new LeafChunk(lines)];
                this.children[0].parent = this;
            }
        },
        collapse(lines) {
            for (let i = 0; i < this.children.length; ++i)
                this.children[i].collapse(lines);
        },
        insertInner(at, lines, height) {
            this.size += lines.length;
            this.height += height;
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at <= sz) {
                    child.insertInner(at, lines, height);
                    if (child.lines && child.lines.length > 50) {
                        let remaining = child.lines.length % 25 + 25;
                        for (let pos = remaining; pos < child.lines.length;) {
                            let leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                            child.height -= leaf.height;
                            this.children.splice(++i, 0, leaf);
                            leaf.parent = this;
                        }
                        child.lines = child.lines.slice(0, remaining);
                        this.maybeSpill();
                    }
                    break;
                }
                at -= sz;
            }
        },
        maybeSpill() {
            if (this.children.length <= 10)
                return;
            let me = this;
            do {
                let spilled = me.children.splice(me.children.length - 5, 5);
                let sibling = new BranchChunk(spilled);
                if (!me.parent) {
                    let copy = new BranchChunk(me.children);
                    copy.parent = me;
                    me.children = [
                        copy,
                        sibling
                    ];
                    me = copy;
                } else {
                    me.size -= sibling.size;
                    me.height -= sibling.height;
                    let myIndex = b.indexOf(me.parent.children, me);
                    me.parent.children.splice(myIndex + 1, 0, sibling);
                }
                sibling.parent = me.parent;
            } while (me.children.length > 10);
            me.parent.maybeSpill();
        },
        iterN(at, n, op) {
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    let used = Math.min(n, sz - at);
                    if (child.iterN(at, used, op))
                        return true;
                    if ((n -= used) == 0)
                        break;
                    at = 0;
                } else
                    at -= sz;
            }
        }
    };
    return {
        LeafChunk: LeafChunk,
        BranchChunk: BranchChunk
    };
});
define('skylark-codemirror/primitives/model/line_widget',[
    '../display/operations',
    '../display/scrolling',
    '../display/view_tracking',
    '../line/spans',
    '../line/utils_line',
    '../measurement/widgets',
    './changes',
    '../util/event',
    '../util/operation_group'
], function (a, b, c, d, e, f, g, h, i) {
    'use strict';
    class LineWidget {
        constructor(doc, node, options) {
            if (options)
                for (let opt in options)
                    if (options.hasOwnProperty(opt))
                        this[opt] = options[opt];
            this.doc = doc;
            this.node = node;
        }
        clear() {
            let cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = e.lineNo(line);
            if (no == null || !ws)
                return;
            for (let i = 0; i < ws.length; ++i)
                if (ws[i] == this)
                    ws.splice(i--, 1);
            if (!ws.length)
                line.widgets = null;
            let height = f.widgetHeight(this);
            e.updateLineHeight(line, Math.max(0, line.height - height));
            if (cm) {
                a.runInOp(cm, () => {
                    adjustScrollWhenAboveVisible(cm, line, -height);
                    c.regLineChange(cm, no, 'widget');
                });
                i.signalLater(cm, 'lineWidgetCleared', cm, this, no);
            }
        }
        changed() {
            let oldH = this.height, cm = this.doc.cm, line = this.line;
            this.height = null;
            let diff = f.widgetHeight(this) - oldH;
            if (!diff)
                return;
            if (!d.lineIsHidden(this.doc, line))
                e.updateLineHeight(line, line.height + diff);
            if (cm) {
                a.runInOp(cm, () => {
                    cm.curOp.forceUpdate = true;
                    adjustScrollWhenAboveVisible(cm, line, diff);
                    i.signalLater(cm, 'lineWidgetChanged', cm, this, e.lineNo(line));
                });
            }
        }
    }
    h.eventMixin(LineWidget);
    function adjustScrollWhenAboveVisible(cm, line, diff) {
        if (d.heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop))
            b.addToScrollTop(cm, diff);
    }
    function addLineWidget(doc, handle, node, options) {
        let widget = new LineWidget(doc, node, options);
        let cm = doc.cm;
        if (cm && widget.noHScroll)
            cm.display.alignWidgets = true;
        g.changeLine(doc, handle, 'widget', line => {
            let widgets = line.widgets || (line.widgets = []);
            if (widget.insertAt == null)
                widgets.push(widget);
            else
                widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
            widget.line = line;
            if (cm && !d.lineIsHidden(doc, line)) {
                let aboveVisible = d.heightAtLine(line) < doc.scrollTop;
                e.updateLineHeight(line, line.height + f.widgetHeight(widget));
                if (aboveVisible)
                    b.addToScrollTop(cm, widget.height);
                cm.curOp.forceUpdate = true;
            }
            return true;
        });
        if (cm)
            i.signalLater(cm, 'lineWidgetAdded', cm, widget, typeof handle == 'number' ? handle : e.lineNo(handle));
        return widget;
    }
    return {
        LineWidget: LineWidget,
        addLineWidget: addLineWidget
    };
});
define('skylark-codemirror/primitives/model/mark_text',[
    '../util/dom',
    '../util/event',
    '../display/operations',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../line/saw_special_spans',
    '../line/spans',
    '../util/misc',
    '../util/operation_group',
    '../measurement/widgets',
    '../display/view_tracking',
    './document_data',
    './history',
    './selection_updates'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    'use strict';
    let nextMarkerId = 0;
    class TextMarker {
        constructor(doc, type) {
            this.lines = [];
            this.type = type;
            this.doc = doc;
            this.id = ++nextMarkerId;
        }
        clear() {
            if (this.explicitlyCleared)
                return;
            let cm = this.doc.cm, withOp = cm && !cm.curOp;
            if (withOp)
                c.startOperation(cm);
            if (b.hasHandler(this, 'clear')) {
                let found = this.find();
                if (found)
                    j.signalLater(this, 'clear', found.from, found.to);
            }
            let min = null, max = null;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = h.getMarkedSpanFor(line.markedSpans, this);
                if (cm && !this.collapsed)
                    l.regLineChange(cm, e.lineNo(line), 'text');
                else if (cm) {
                    if (span.to != null)
                        max = e.lineNo(line);
                    if (span.from != null)
                        min = e.lineNo(line);
                }
                line.markedSpans = h.removeMarkedSpan(line.markedSpans, span);
                if (span.from == null && this.collapsed && !h.lineIsHidden(this.doc, line) && cm)
                    e.updateLineHeight(line, f.textHeight(cm.display));
            }
            if (cm && this.collapsed && !cm.options.lineWrapping)
                for (let i = 0; i < this.lines.length; ++i) {
                    let visual = h.visualLine(this.lines[i]), len = h.lineLength(visual);
                    if (len > cm.display.maxLineLength) {
                        cm.display.maxLine = visual;
                        cm.display.maxLineLength = len;
                        cm.display.maxLineChanged = true;
                    }
                }
            if (min != null && cm && this.collapsed)
                l.regChange(cm, min, max + 1);
            this.lines.length = 0;
            this.explicitlyCleared = true;
            if (this.atomic && this.doc.cantEdit) {
                this.doc.cantEdit = false;
                if (cm)
                    o.reCheckSelection(cm.doc);
            }
            if (cm)
                j.signalLater(cm, 'markerCleared', cm, this, min, max);
            if (withOp)
                c.endOperation(cm);
            if (this.parent)
                this.parent.clear();
        }
        find(side, lineObj) {
            if (side == null && this.type == 'bookmark')
                side = 1;
            let from, to;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = h.getMarkedSpanFor(line.markedSpans, this);
                if (span.from != null) {
                    from = d.Pos(lineObj ? line : e.lineNo(line), span.from);
                    if (side == -1)
                        return from;
                }
                if (span.to != null) {
                    to = d.Pos(lineObj ? line : e.lineNo(line), span.to);
                    if (side == 1)
                        return to;
                }
            }
            return from && {
                from: from,
                to: to
            };
        }
        changed() {
            let pos = this.find(-1, true), widget = this, cm = this.doc.cm;
            if (!pos || !cm)
                return;
            c.runInOp(cm, () => {
                let line = pos.line, lineN = e.lineNo(pos.line);
                let view = f.findViewForLine(cm, lineN);
                if (view) {
                    f.clearLineMeasurementCacheFor(view);
                    cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
                }
                cm.curOp.updateMaxLine = true;
                if (!h.lineIsHidden(widget.doc, line) && widget.height != null) {
                    let oldHeight = widget.height;
                    widget.height = null;
                    let dHeight = k.widgetHeight(widget) - oldHeight;
                    if (dHeight)
                        e.updateLineHeight(line, line.height + dHeight);
                }
                j.signalLater(cm, 'markerChanged', cm, this);
            });
        }
        attachLine(line) {
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                if (!op.maybeHiddenMarkers || i.indexOf(op.maybeHiddenMarkers, this) == -1)
                    (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
            }
            this.lines.push(line);
        }
        detachLine(line) {
            this.lines.splice(i.indexOf(this.lines, line), 1);
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
            }
        }
    }
    b.eventMixin(TextMarker);
    function markText(doc, from, to, options, type) {
        if (options && options.shared)
            return markTextShared(doc, from, to, options, type);
        if (doc.cm && !doc.cm.curOp)
            return c.operation(doc.cm, markText)(doc, from, to, options, type);
        let marker = new TextMarker(doc, type), diff = d.cmp(from, to);
        if (options)
            i.copyObj(options, marker, false);
        if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
            return marker;
        if (marker.replacedWith) {
            marker.collapsed = true;
            marker.widgetNode = a.eltP('span', [marker.replacedWith], 'CodeMirror-widget');
            if (!options.handleMouseEvents)
                marker.widgetNode.setAttribute('cm-ignore-events', 'true');
            if (options.insertLeft)
                marker.widgetNode.insertLeft = true;
        }
        if (marker.collapsed) {
            if (h.conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && h.conflictingCollapsedRange(doc, to.line, from, to, marker))
                throw new Error('Inserting collapsed marker partially overlapping an existing one');
            g.seeCollapsedSpans();
        }
        if (marker.addToHistory)
            n.addChangeToHistory(doc, {
                from: from,
                to: to,
                origin: 'markText'
            }, doc.sel, NaN);
        let curLine = from.line, cm = doc.cm, updateMaxLine;
        doc.iter(curLine, to.line + 1, line => {
            if (cm && marker.collapsed && !cm.options.lineWrapping && h.visualLine(line) == cm.display.maxLine)
                updateMaxLine = true;
            if (marker.collapsed && curLine != from.line)
                e.updateLineHeight(line, 0);
            h.addMarkedSpan(line, new h.MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null));
            ++curLine;
        });
        if (marker.collapsed)
            doc.iter(from.line, to.line + 1, line => {
                if (h.lineIsHidden(doc, line))
                    e.updateLineHeight(line, 0);
            });
        if (marker.clearOnEnter)
            b.on(marker, 'beforeCursorEnter', () => marker.clear());
        if (marker.readOnly) {
            g.seeReadOnlySpans();
            if (doc.history.done.length || doc.history.undone.length)
                doc.clearHistory();
        }
        if (marker.collapsed) {
            marker.id = ++nextMarkerId;
            marker.atomic = true;
        }
        if (cm) {
            if (updateMaxLine)
                cm.curOp.updateMaxLine = true;
            if (marker.collapsed)
                l.regChange(cm, from.line, to.line + 1);
            else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title)
                for (let i = from.line; i <= to.line; i++)
                    l.regLineChange(cm, i, 'text');
            if (marker.atomic)
                o.reCheckSelection(cm.doc);
            j.signalLater(cm, 'markerAdded', cm, marker);
        }
        return marker;
    }
    class SharedTextMarker {
        constructor(markers, primary) {
            this.markers = markers;
            this.primary = primary;
            for (let i = 0; i < markers.length; ++i)
                markers[i].parent = this;
        }
        clear() {
            if (this.explicitlyCleared)
                return;
            this.explicitlyCleared = true;
            for (let i = 0; i < this.markers.length; ++i)
                this.markers[i].clear();
            j.signalLater(this, 'clear');
        }
        find(side, lineObj) {
            return this.primary.find(side, lineObj);
        }
    }
    b.eventMixin(SharedTextMarker);
    function markTextShared(doc, from, to, options, type) {
        options = i.copyObj(options);
        options.shared = false;
        let markers = [markText(doc, from, to, options, type)], primary = markers[0];
        let widget = options.widgetNode;
        m.linkedDocs(doc, doc => {
            if (widget)
                options.widgetNode = widget.cloneNode(true);
            markers.push(markText(doc, d.clipPos(doc, from), d.clipPos(doc, to), options, type));
            for (let i = 0; i < doc.linked.length; ++i)
                if (doc.linked[i].isParent)
                    return;
            primary = i.lst(markers);
        });
        return new SharedTextMarker(markers, primary);
    }
    function findSharedMarkers(doc) {
        return doc.findMarks(d.Pos(doc.first, 0), doc.clipPos(d.Pos(doc.lastLine())), m => m.parent);
    }
    function copySharedMarkers(doc, markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], pos = marker.find();
            let mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
            if (d.cmp(mFrom, mTo)) {
                let subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
                marker.markers.push(subMark);
                subMark.parent = marker;
            }
        }
    }
    function detachSharedMarkers(markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], linked = [marker.primary.doc];
            m.linkedDocs(marker.primary.doc, d => linked.push(d));
            for (let j = 0; j < marker.markers.length; j++) {
                let subMarker = marker.markers[j];
                if (i.indexOf(linked, subMarker.doc) == -1) {
                    subMarker.parent = null;
                    marker.markers.splice(j--, 1);
                }
            }
        }
    }
    return {
        TextMarker: TextMarker,
        markText: markText,
        SharedTextMarker: SharedTextMarker,
        findSharedMarkers: findSharedMarkers,
        copySharedMarkers: copySharedMarkers,
        detachSharedMarkers: detachSharedMarkers
    };
});
define('skylark-codemirror/primitives/model/Doc',[
    '../display/operations',
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/dom',
    '../util/feature_detection',
    '../util/misc',
    '../display/scrolling',
    './changes',
    './change_measurement',
    './chunk',
    './document_data',
    './history',
    './line_widget',
    './mark_text',
    './selection',
    './selection_updates'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    'use strict';
    let nextDocId = 0;
    let Doc = function (text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc))
            return new Doc(text, mode, firstLine, lineSep, direction);
        if (firstLine == null)
            firstLine = 0;
        l.BranchChunk.call(this, [new l.LeafChunk([new b.Line('', null)])]);
        this.first = firstLine;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = firstLine;
        let start = c.Pos(firstLine, 0);
        this.sel = q.simpleSelection(start);
        this.history = new n.History(null);
        this.id = ++nextDocId;
        this.modeOption = mode;
        this.lineSep = lineSep;
        this.direction = direction == 'rtl' ? 'rtl' : 'ltr';
        this.extend = false;
        if (typeof text == 'string')
            text = this.splitLines(text);
        m.updateDoc(this, {
            from: start,
            to: start,
            text: text
        });
        r.setSelection(this, q.simpleSelection(start), h.sel_dontScroll);
    };
    Doc.prototype = h.createObj(l.BranchChunk.prototype, {
        constructor: Doc,
        iter: function (from, to, op) {
            if (op)
                this.iterN(from - this.first, to - from, op);
            else
                this.iterN(this.first, this.first + this.size, from);
        },
        insert: function (at, lines) {
            let height = 0;
            for (let i = 0; i < lines.length; ++i)
                height += lines[i].height;
            this.insertInner(at - this.first, lines, height);
        },
        remove: function (at, n) {
            this.removeInner(at - this.first, n);
        },
        getValue: function (lineSep) {
            let lines = e.getLines(this, this.first, this.first + this.size);
            if (lineSep === false)
                return lines;
            return lines.join(lineSep || this.lineSeparator());
        },
        setValue: a.docMethodOp(function (code) {
            let top = c.Pos(this.first, 0), last = this.first + this.size - 1;
            j.makeChange(this, {
                from: top,
                to: c.Pos(last, e.getLine(this, last).text.length),
                text: this.splitLines(code),
                origin: 'setValue',
                full: true
            }, true);
            if (this.cm)
                i.scrollToCoords(this.cm, 0, 0);
            r.setSelection(this, q.simpleSelection(top), h.sel_dontScroll);
        }),
        replaceRange: function (code, from, to, origin) {
            from = c.clipPos(this, from);
            to = to ? c.clipPos(this, to) : from;
            j.replaceRange(this, code, from, to, origin);
        },
        getRange: function (from, to, lineSep) {
            let lines = e.getBetween(this, c.clipPos(this, from), c.clipPos(this, to));
            if (lineSep === false)
                return lines;
            return lines.join(lineSep || this.lineSeparator());
        },
        getLine: function (line) {
            let l = this.getLineHandle(line);
            return l && l.text;
        },
        getLineHandle: function (line) {
            if (e.isLine(this, line))
                return e.getLine(this, line);
        },
        getLineNumber: function (line) {
            return e.lineNo(line);
        },
        getLineHandleVisualStart: function (line) {
            if (typeof line == 'number')
                line = e.getLine(this, line);
            return d.visualLine(line);
        },
        lineCount: function () {
            return this.size;
        },
        firstLine: function () {
            return this.first;
        },
        lastLine: function () {
            return this.first + this.size - 1;
        },
        clipPos: function (pos) {
            return c.clipPos(this, pos);
        },
        getCursor: function (start) {
            let range = this.sel.primary(), pos;
            if (start == null || start == 'head')
                pos = range.head;
            else if (start == 'anchor')
                pos = range.anchor;
            else if (start == 'end' || start == 'to' || start === false)
                pos = range.to();
            else
                pos = range.from();
            return pos;
        },
        listSelections: function () {
            return this.sel.ranges;
        },
        somethingSelected: function () {
            return this.sel.somethingSelected();
        },
        setCursor: a.docMethodOp(function (line, ch, options) {
            r.setSimpleSelection(this, c.clipPos(this, typeof line == 'number' ? c.Pos(line, ch || 0) : line), null, options);
        }),
        setSelection: a.docMethodOp(function (anchor, head, options) {
            r.setSimpleSelection(this, c.clipPos(this, anchor), c.clipPos(this, head || anchor), options);
        }),
        extendSelection: a.docMethodOp(function (head, other, options) {
            r.extendSelection(this, c.clipPos(this, head), other && c.clipPos(this, other), options);
        }),
        extendSelections: a.docMethodOp(function (heads, options) {
            r.extendSelections(this, c.clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: a.docMethodOp(function (f, options) {
            let heads = h.map(this.sel.ranges, f);
            r.extendSelections(this, c.clipPosArray(this, heads), options);
        }),
        setSelections: a.docMethodOp(function (ranges, primary, options) {
            if (!ranges.length)
                return;
            let out = [];
            for (let i = 0; i < ranges.length; i++)
                out[i] = new q.Range(c.clipPos(this, ranges[i].anchor), c.clipPos(this, ranges[i].head));
            if (primary == null)
                primary = Math.min(ranges.length - 1, this.sel.primIndex);
            r.setSelection(this, q.normalizeSelection(this.cm, out, primary), options);
        }),
        addSelection: a.docMethodOp(function (anchor, head, options) {
            let ranges = this.sel.ranges.slice(0);
            ranges.push(new q.Range(c.clipPos(this, anchor), c.clipPos(this, head || anchor)));
            r.setSelection(this, q.normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function (lineSep) {
            let ranges = this.sel.ranges, lines;
            for (let i = 0; i < ranges.length; i++) {
                let sel = e.getBetween(this, ranges[i].from(), ranges[i].to());
                lines = lines ? lines.concat(sel) : sel;
            }
            if (lineSep === false)
                return lines;
            else
                return lines.join(lineSep || this.lineSeparator());
        },
        getSelections: function (lineSep) {
            let parts = [], ranges = this.sel.ranges;
            for (let i = 0; i < ranges.length; i++) {
                let sel = e.getBetween(this, ranges[i].from(), ranges[i].to());
                if (lineSep !== false)
                    sel = sel.join(lineSep || this.lineSeparator());
                parts[i] = sel;
            }
            return parts;
        },
        replaceSelection: function (code, collapse, origin) {
            let dup = [];
            for (let i = 0; i < this.sel.ranges.length; i++)
                dup[i] = code;
            this.replaceSelections(dup, collapse, origin || '+input');
        },
        replaceSelections: a.docMethodOp(function (code, collapse, origin) {
            let changes = [], sel = this.sel;
            for (let i = 0; i < sel.ranges.length; i++) {
                let range = sel.ranges[i];
                changes[i] = {
                    from: range.from(),
                    to: range.to(),
                    text: this.splitLines(code[i]),
                    origin: origin
                };
            }
            let newSel = collapse && collapse != 'end' && k.computeReplacedSel(this, changes, collapse);
            for (let i = changes.length - 1; i >= 0; i--)
                j.makeChange(this, changes[i]);
            if (newSel)
                r.setSelectionReplaceHistory(this, newSel);
            else if (this.cm)
                i.ensureCursorVisible(this.cm);
        }),
        undo: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'undo');
        }),
        redo: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'redo');
        }),
        undoSelection: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'undo', true);
        }),
        redoSelection: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'redo', true);
        }),
        setExtending: function (val) {
            this.extend = val;
        },
        getExtending: function () {
            return this.extend;
        },
        historySize: function () {
            let hist = this.history, done = 0, undone = 0;
            for (let i = 0; i < hist.done.length; i++)
                if (!hist.done[i].ranges)
                    ++done;
            for (let i = 0; i < hist.undone.length; i++)
                if (!hist.undone[i].ranges)
                    ++undone;
            return {
                undo: done,
                redo: undone
            };
        },
        clearHistory: function () {
            this.history = new n.History(this.history.maxGeneration);
        },
        markClean: function () {
            this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function (forceSplit) {
            if (forceSplit)
                this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            return this.history.generation;
        },
        isClean: function (gen) {
            return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function () {
            return {
                done: n.copyHistoryArray(this.history.done),
                undone: n.copyHistoryArray(this.history.undone)
            };
        },
        setHistory: function (histData) {
            let hist = this.history = new n.History(this.history.maxGeneration);
            hist.done = n.copyHistoryArray(histData.done.slice(0), null, true);
            hist.undone = n.copyHistoryArray(histData.undone.slice(0), null, true);
        },
        setGutterMarker: a.docMethodOp(function (line, gutterID, value) {
            return j.changeLine(this, line, 'gutter', line => {
                let markers = line.gutterMarkers || (line.gutterMarkers = {});
                markers[gutterID] = value;
                if (!value && h.isEmpty(markers))
                    line.gutterMarkers = null;
                return true;
            });
        }),
        clearGutter: a.docMethodOp(function (gutterID) {
            this.iter(line => {
                if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
                    j.changeLine(this, line, 'gutter', () => {
                        line.gutterMarkers[gutterID] = null;
                        if (h.isEmpty(line.gutterMarkers))
                            line.gutterMarkers = null;
                        return true;
                    });
                }
            });
        }),
        lineInfo: function (line) {
            let n;
            if (typeof line == 'number') {
                if (!e.isLine(this, line))
                    return null;
                n = line;
                line = e.getLine(this, line);
                if (!line)
                    return null;
            } else {
                n = e.lineNo(line);
                if (n == null)
                    return null;
            }
            return {
                line: n,
                handle: line,
                text: line.text,
                gutterMarkers: line.gutterMarkers,
                textClass: line.textClass,
                bgClass: line.bgClass,
                wrapClass: line.wrapClass,
                widgets: line.widgets
            };
        },
        addLineClass: a.docMethodOp(function (handle, where, cls) {
            return j.changeLine(this, handle, where == 'gutter' ? 'gutter' : 'class', line => {
                let prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : where == 'gutter' ? 'gutterClass' : 'wrapClass';
                if (!line[prop])
                    line[prop] = cls;
                else if (f.classTest(cls).test(line[prop]))
                    return false;
                else
                    line[prop] += ' ' + cls;
                return true;
            });
        }),
        removeLineClass: a.docMethodOp(function (handle, where, cls) {
            return j.changeLine(this, handle, where == 'gutter' ? 'gutter' : 'class', line => {
                let prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : where == 'gutter' ? 'gutterClass' : 'wrapClass';
                let cur = line[prop];
                if (!cur)
                    return false;
                else if (cls == null)
                    line[prop] = null;
                else {
                    let found = cur.match(f.classTest(cls));
                    if (!found)
                        return false;
                    let end = found.index + found[0].length;
                    line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? '' : ' ') + cur.slice(end) || null;
                }
                return true;
            });
        }),
        addLineWidget: a.docMethodOp(function (handle, node, options) {
            return o.addLineWidget(this, handle, node, options);
        }),
        removeLineWidget: function (widget) {
            widget.clear();
        },
        markText: function (from, to, options) {
            return p.markText(this, c.clipPos(this, from), c.clipPos(this, to), options, options && options.type || 'range');
        },
        setBookmark: function (pos, options) {
            let realOpts = {
                replacedWith: options && (options.nodeType == null ? options.widget : options),
                insertLeft: options && options.insertLeft,
                clearWhenEmpty: false,
                shared: options && options.shared,
                handleMouseEvents: options && options.handleMouseEvents
            };
            pos = c.clipPos(this, pos);
            return p.markText(this, pos, pos, realOpts, 'bookmark');
        },
        findMarksAt: function (pos) {
            pos = c.clipPos(this, pos);
            let markers = [], spans = e.getLine(this, pos.line).markedSpans;
            if (spans)
                for (let i = 0; i < spans.length; ++i) {
                    let span = spans[i];
                    if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch))
                        markers.push(span.marker.parent || span.marker);
                }
            return markers;
        },
        findMarks: function (from, to, filter) {
            from = c.clipPos(this, from);
            to = c.clipPos(this, to);
            let found = [], lineNo = from.line;
            this.iter(from.line, to.line + 1, line => {
                let spans = line.markedSpans;
                if (spans)
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (!(span.to != null && lineNo == from.line && from.ch >= span.to || span.from == null && lineNo != from.line || span.from != null && lineNo == to.line && span.from >= to.ch) && (!filter || filter(span.marker)))
                            found.push(span.marker.parent || span.marker);
                    }
                ++lineNo;
            });
            return found;
        },
        getAllMarks: function () {
            let markers = [];
            this.iter(line => {
                let sps = line.markedSpans;
                if (sps)
                    for (let i = 0; i < sps.length; ++i)
                        if (sps[i].from != null)
                            markers.push(sps[i].marker);
            });
            return markers;
        },
        posFromIndex: function (off) {
            let ch, lineNo = this.first, sepSize = this.lineSeparator().length;
            this.iter(line => {
                let sz = line.text.length + sepSize;
                if (sz > off) {
                    ch = off;
                    return true;
                }
                off -= sz;
                ++lineNo;
            });
            return c.clipPos(this, c.Pos(lineNo, ch));
        },
        indexFromPos: function (coords) {
            coords = c.clipPos(this, coords);
            let index = coords.ch;
            if (coords.line < this.first || coords.ch < 0)
                return 0;
            let sepSize = this.lineSeparator().length;
            this.iter(this.first, coords.line, line => {
                index += line.text.length + sepSize;
            });
            return index;
        },
        copy: function (copyHistory) {
            let doc = new Doc(e.getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            doc.scrollTop = this.scrollTop;
            doc.scrollLeft = this.scrollLeft;
            doc.sel = this.sel;
            doc.extend = false;
            if (copyHistory) {
                doc.history.undoDepth = this.history.undoDepth;
                doc.setHistory(this.getHistory());
            }
            return doc;
        },
        linkedDoc: function (options) {
            if (!options)
                options = {};
            let from = this.first, to = this.first + this.size;
            if (options.from != null && options.from > from)
                from = options.from;
            if (options.to != null && options.to < to)
                to = options.to;
            let copy = new Doc(e.getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
            if (options.sharedHist)
                copy.history = this.history;
            (this.linked || (this.linked = [])).push({
                doc: copy,
                sharedHist: options.sharedHist
            });
            copy.linked = [{
                    doc: this,
                    isParent: true,
                    sharedHist: options.sharedHist
                }];
            p.copySharedMarkers(copy, p.findSharedMarkers(this));
            return copy;
        },
        unlinkDoc: function (other) {
            //if (other instanceof CodeMirror) // modified by lwf
            if (other.doc)
                other = other.doc;
            if (this.linked)
                for (let i = 0; i < this.linked.length; ++i) {
                    let link = this.linked[i];
                    if (link.doc != other)
                        continue;
                    this.linked.splice(i, 1);
                    other.unlinkDoc(this);
                    p.detachSharedMarkers(p.findSharedMarkers(this));
                    break;
                }
            if (other.history == this.history) {
                let splitIds = [other.id];
                m.linkedDocs(other, doc => splitIds.push(doc.id), true);
                other.history = new n.History(null);
                other.history.done = n.copyHistoryArray(this.history.done, splitIds);
                other.history.undone = n.copyHistoryArray(this.history.undone, splitIds);
            }
        },
        iterLinkedDocs: function (f) {
            m.linkedDocs(this, f);
        },
        getMode: function () {
            return this.mode;
        },
        getEditor: function () {
            return this.cm;
        },
        splitLines: function (str) {
            if (this.lineSep)
                return str.split(this.lineSep);
            return g.splitLinesAuto(str);
        },
        lineSeparator: function () {
            return this.lineSep || '\n';
        },
        setDirection: a.docMethodOp(function (dir) {
            if (dir != 'rtl')
                dir = 'ltr';
            if (dir == this.direction)
                return;
            this.direction = dir;
            this.iter(line => line.order = null);
            if (this.cm)
                m.directionChanged(this.cm);
        })
    });
    Doc.prototype.eachLine = Doc.prototype.iter;
    return Doc;
});
define('skylark-codemirror/primitives/edit/drop_events',[
    '../display/selection',
    '../display/operations',
    '../line/pos',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/changes',
    '../model/change_measurement',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
    'use strict';
    let lastDrop = 0;
    function onDrop(e) {
        let cm = this;
        clearDragCursor(cm);
        if (l.signalDOMEvent(cm, e) || e.eventInWidget(cm.display, e))
            return;
        l.e_preventDefault(e);
        if (j.ie)
            lastDrop = +new Date();
        let pos = d.posFromMouse(cm, e, true), files = e.dataTransfer.files;
        if (!pos || cm.isReadOnly())
            return;
        if (files && files.length && window.FileReader && window.File) {
            let n = files.length, text = Array(n), read = 0;
            let loadFile = (file, i) => {
                if (cm.options.allowDropFileTypes && m.indexOf(cm.options.allowDropFileTypes, file.type) == -1)
                    return;
                let reader = new FileReader();
                reader.onload = b.operation(cm, () => {
                    let content = reader.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(content))
                        content = '';
                    text[i] = content;
                    if (++read == n) {
                        pos = c.clipPos(cm.doc, pos);
                        let change = {
                            from: pos,
                            to: pos,
                            text: cm.doc.splitLines(text.join(cm.doc.lineSeparator())),
                            origin: 'paste'
                        };
                        f.makeChange(cm.doc, change);
                        i.setSelectionReplaceHistory(cm.doc, h.simpleSelection(pos, g.changeEnd(change)));
                    }
                });
                reader.readAsText(file);
            };
            for (let i = 0; i < n; ++i)
                loadFile(files[i], i);
        } else {
            if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
                cm.state.draggingText(e);
                setTimeout(() => cm.display.input.focus(), 20);
                return;
            }
            try {
                let text = e.dataTransfer.getData('Text');
                if (text) {
                    let selected;
                    if (cm.state.draggingText && !cm.state.draggingText.copy)
                        selected = cm.listSelections();
                    i.setSelectionNoUndo(cm.doc, h.simpleSelection(pos, pos));
                    if (selected)
                        for (let i = 0; i < selected.length; ++i)
                            f.replaceRange(cm.doc, '', selected[i].anchor, selected[i].head, 'drag');
                    cm.replaceSelection(text, 'around', 'paste');
                    cm.display.input.focus();
                }
            } catch (e) {
            }
        }
    }
    function onDragStart(cm, e) {
        if (j.ie && (!cm.state.draggingText || +new Date() - lastDrop < 100)) {
            l.e_stop(e);
            return;
        }
        if (l.signalDOMEvent(cm, e) || e.eventInWidget(cm.display, e))
            return;
        e.dataTransfer.setData('Text', cm.getSelection());
        e.dataTransfer.effectAllowed = 'copyMove';
        if (e.dataTransfer.setDragImage && !j.safari) {
            let img = k.elt('img', null, null, 'position: fixed; left: 0; top: 0;');
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            if (j.presto) {
                img.width = img.height = 1;
                cm.display.wrapper.appendChild(img);
                img._top = img.offsetTop;
            }
            e.dataTransfer.setDragImage(img, 0, 0);
            if (j.presto)
                img.parentNode.removeChild(img);
        }
    }
    function onDragOver(cm, e) {
        let pos = d.posFromMouse(cm, e);
        if (!pos)
            return;
        let frag = document.createDocumentFragment();
        a.drawSelectionCursor(cm, pos, frag);
        if (!cm.display.dragCursor) {
            cm.display.dragCursor = k.elt('div', null, 'CodeMirror-cursors CodeMirror-dragcursors');
            cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
        }
        k.removeChildrenAndAdd(cm.display.dragCursor, frag);
    }
    function clearDragCursor(cm) {
        if (cm.display.dragCursor) {
            cm.display.lineSpace.removeChild(cm.display.dragCursor);
            cm.display.dragCursor = null;
        }
    }
    return {
        onDrop: onDrop,
        onDragStart: onDragStart,
        onDragOver: onDragOver,
        clearDragCursor: clearDragCursor
    };
});
define('skylark-codemirror/primitives/edit/global_events',[
    '../display/focus',
    '../util/event'
], function (focuses, events) {
    'use strict';
    function forEachCodeMirror(f) {
        if (!document.getElementsByClassName)
            return;
        let byClass = document.getElementsByClassName('CodeMirror'), editors = [];
        for (let i = 0; i < byClass.length; i++) {
            let cm = byClass[i].CodeMirror;
            if (cm)
                editors.push(cm);
        }
        if (editors.length)
            editors[0].operation(() => {
                for (let i = 0; i < editors.length; i++)
                    f(editors[i]);
            });
    }
    let globalsRegistered = false;
    function ensureGlobalHandlers() {
        if (globalsRegistered)
            return;
        registerGlobalHandlers();
        globalsRegistered = true;
    }
    function registerGlobalHandlers() {
        let resizeTimer;
        events.on(window, 'resize', () => {
            if (resizeTimer == null)
                resizeTimer = setTimeout(() => {
                    resizeTimer = null;
                    forEachCodeMirror(onResize);
                }, 100);
        });
        events.on(window, 'blur', () => forEachCodeMirror(focuses.onBlur));
    }
    function onResize(cm) {
        let d = cm.display;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.scrollbarsClipped = false;
        cm.setSize();
    }
    return { ensureGlobalHandlers: ensureGlobalHandlers };
});
define('skylark-codemirror/primitives/input/keynames',[],function () {
    'use strict';
    let keyNames = {
        3: 'Pause',
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        19: 'Pause',
        20: 'CapsLock',
        27: 'Esc',
        32: 'Space',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'Left',
        38: 'Up',
        39: 'Right',
        40: 'Down',
        44: 'PrintScrn',
        45: 'Insert',
        46: 'Delete',
        59: ';',
        61: '=',
        91: 'Mod',
        92: 'Mod',
        93: 'Mod',
        106: '*',
        107: '=',
        109: '-',
        110: '.',
        111: '/',
        127: 'Delete',
        145: 'ScrollLock',
        173: '-',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: "'",
        63232: 'Up',
        63233: 'Down',
        63234: 'Left',
        63235: 'Right',
        63272: 'Delete',
        63273: 'Home',
        63275: 'End',
        63276: 'PageUp',
        63277: 'PageDown',
        63302: 'Insert'
    };
    for (let i = 0; i < 10; i++)
        keyNames[i + 48] = keyNames[i + 96] = String(i);
    for (let i = 65; i <= 90; i++)
        keyNames[i] = String.fromCharCode(i);
    for (let i = 1; i <= 12; i++)
        keyNames[i + 111] = keyNames[i + 63235] = 'F' + i;
    return { keyNames: keyNames };
});
define('skylark-codemirror/primitives/input/keymap',[
    '../util/browser',
    '../util/misc',
    './keynames'
], function (browser, misc, keynames) {
    'use strict';
    let keyMap = {};
    keyMap.basic = {
        'Left': 'goCharLeft',
        'Right': 'goCharRight',
        'Up': 'goLineUp',
        'Down': 'goLineDown',
        'End': 'goLineEnd',
        'Home': 'goLineStartSmart',
        'PageUp': 'goPageUp',
        'PageDown': 'goPageDown',
        'Delete': 'delCharAfter',
        'Backspace': 'delCharBefore',
        'Shift-Backspace': 'delCharBefore',
        'Tab': 'defaultTab',
        'Shift-Tab': 'indentAuto',
        'Enter': 'newlineAndIndent',
        'Insert': 'toggleOverwrite',
        'Esc': 'singleSelection'
    };
    keyMap.pcDefault = {
        'Ctrl-A': 'selectAll',
        'Ctrl-D': 'deleteLine',
        'Ctrl-Z': 'undo',
        'Shift-Ctrl-Z': 'redo',
        'Ctrl-Y': 'redo',
        'Ctrl-Home': 'goDocStart',
        'Ctrl-End': 'goDocEnd',
        'Ctrl-Up': 'goLineUp',
        'Ctrl-Down': 'goLineDown',
        'Ctrl-Left': 'goGroupLeft',
        'Ctrl-Right': 'goGroupRight',
        'Alt-Left': 'goLineStart',
        'Alt-Right': 'goLineEnd',
        'Ctrl-Backspace': 'delGroupBefore',
        'Ctrl-Delete': 'delGroupAfter',
        'Ctrl-S': 'save',
        'Ctrl-F': 'find',
        'Ctrl-G': 'findNext',
        'Shift-Ctrl-G': 'findPrev',
        'Shift-Ctrl-F': 'replace',
        'Shift-Ctrl-R': 'replaceAll',
        'Ctrl-[': 'indentLess',
        'Ctrl-]': 'indentMore',
        'Ctrl-U': 'undoSelection',
        'Shift-Ctrl-U': 'redoSelection',
        'Alt-U': 'redoSelection',
        'fallthrough': 'basic'
    };
    keyMap.emacsy = {
        'Ctrl-F': 'goCharRight',
        'Ctrl-B': 'goCharLeft',
        'Ctrl-P': 'goLineUp',
        'Ctrl-N': 'goLineDown',
        'Alt-F': 'goWordRight',
        'Alt-B': 'goWordLeft',
        'Ctrl-A': 'goLineStart',
        'Ctrl-E': 'goLineEnd',
        'Ctrl-V': 'goPageDown',
        'Shift-Ctrl-V': 'goPageUp',
        'Ctrl-D': 'delCharAfter',
        'Ctrl-H': 'delCharBefore',
        'Alt-D': 'delWordAfter',
        'Alt-Backspace': 'delWordBefore',
        'Ctrl-K': 'killLine',
        'Ctrl-T': 'transposeChars',
        'Ctrl-O': 'openLine'
    };
    keyMap.macDefault = {
        'Cmd-A': 'selectAll',
        'Cmd-D': 'deleteLine',
        'Cmd-Z': 'undo',
        'Shift-Cmd-Z': 'redo',
        'Cmd-Y': 'redo',
        'Cmd-Home': 'goDocStart',
        'Cmd-Up': 'goDocStart',
        'Cmd-End': 'goDocEnd',
        'Cmd-Down': 'goDocEnd',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight',
        'Cmd-Left': 'goLineLeft',
        'Cmd-Right': 'goLineRight',
        'Alt-Backspace': 'delGroupBefore',
        'Ctrl-Alt-Backspace': 'delGroupAfter',
        'Alt-Delete': 'delGroupAfter',
        'Cmd-S': 'save',
        'Cmd-F': 'find',
        'Cmd-G': 'findNext',
        'Shift-Cmd-G': 'findPrev',
        'Cmd-Alt-F': 'replace',
        'Shift-Cmd-Alt-F': 'replaceAll',
        'Cmd-[': 'indentLess',
        'Cmd-]': 'indentMore',
        'Cmd-Backspace': 'delWrappedLineLeft',
        'Cmd-Delete': 'delWrappedLineRight',
        'Cmd-U': 'undoSelection',
        'Shift-Cmd-U': 'redoSelection',
        'Ctrl-Up': 'goDocStart',
        'Ctrl-Down': 'goDocEnd',
        'fallthrough': [
            'basic',
            'emacsy'
        ]
    };
    keyMap['default'] = browser.mac ? keyMap.macDefault : keyMap.pcDefault;
    function normalizeKeyName(name) {
        let parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        let alt, ctrl, shift, cmd;
        for (let i = 0; i < parts.length - 1; i++) {
            let mod = parts[i];
            if (/^(cmd|meta|m)$/i.test(mod))
                cmd = true;
            else if (/^a(lt)?$/i.test(mod))
                alt = true;
            else if (/^(c|ctrl|control)$/i.test(mod))
                ctrl = true;
            else if (/^s(hift)?$/i.test(mod))
                shift = true;
            else
                throw new Error('Unrecognized modifier name: ' + mod);
        }
        if (alt)
            name = 'Alt-' + name;
        if (ctrl)
            name = 'Ctrl-' + name;
        if (cmd)
            name = 'Cmd-' + name;
        if (shift)
            name = 'Shift-' + name;
        return name;
    }
    function normalizeKeyMap(keymap) {
        let copy = {};
        for (let keyname in keymap)
            if (keymap.hasOwnProperty(keyname)) {
                let value = keymap[keyname];
                if (/^(name|fallthrough|(de|at)tach)$/.test(keyname))
                    continue;
                if (value == '...') {
                    delete keymap[keyname];
                    continue;
                }
                let keys = misc.map(keyname.split(' '), normalizeKeyName);
                for (let i = 0; i < keys.length; i++) {
                    let val, name;
                    if (i == keys.length - 1) {
                        name = keys.join(' ');
                        val = value;
                    } else {
                        name = keys.slice(0, i + 1).join(' ');
                        val = '...';
                    }
                    let prev = copy[name];
                    if (!prev)
                        copy[name] = val;
                    else if (prev != val)
                        throw new Error('Inconsistent bindings for ' + name);
                }
                delete keymap[keyname];
            }
        for (let prop in copy)
            keymap[prop] = copy[prop];
        return keymap;
    }
    function lookupKey(key, map, handle, context) {
        map = getKeyMap(map);
        let found = map.call ? map.call(key, context) : map[key];
        if (found === false)
            return 'nothing';
        if (found === '...')
            return 'multi';
        if (found != null && handle(found))
            return 'handled';
        if (map.fallthrough) {
            if (Object.prototype.toString.call(map.fallthrough) != '[object Array]')
                return lookupKey(key, map.fallthrough, handle, context);
            for (let i = 0; i < map.fallthrough.length; i++) {
                let result = lookupKey(key, map.fallthrough[i], handle, context);
                if (result)
                    return result;
            }
        }
    }
    function isModifierKey(value) {
        let name = typeof value == 'string' ? value : keynames.keyNames[value.keyCode];
        return name == 'Ctrl' || name == 'Alt' || name == 'Shift' || name == 'Mod';
    }
    function addModifierNames(name, event, noShift) {
        let base = name;
        if (event.altKey && base != 'Alt')
            name = 'Alt-' + name;
        if ((browser.flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != 'Ctrl')
            name = 'Ctrl-' + name;
        if ((browser.flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != 'Cmd')
            name = 'Cmd-' + name;
        if (!noShift && event.shiftKey && base != 'Shift')
            name = 'Shift-' + name;
        return name;
    }
    function keyName(event, noShift) {
        if (browser.presto && event.keyCode == 34 && event['char'])
            return false;
        let name = keynames.keyNames[event.keyCode];
        if (name == null || event.altGraphKey)
            return false;
        if (event.keyCode == 3 && event.code)
            name = event.code;
        return addModifierNames(name, event, noShift);
    }
    function getKeyMap(val) {
        return typeof val == 'string' ? keyMap[val] : val;
    }
    return {
        keyMap: keyMap,
        normalizeKeyMap: normalizeKeyMap,
        lookupKey: lookupKey,
        isModifierKey: isModifierKey,
        addModifierNames: addModifierNames,
        keyName: keyName,
        getKeyMap: getKeyMap
    };
});
define('skylark-codemirror/primitives/edit/deleteNearSelection',[
    '../display/operations',
    '../display/scrolling',
    '../line/pos',
    '../model/changes',
    '../util/misc'
], function (operations, scrolling, line_pos, changes, misc) {
    'use strict';
    function deleteNearSelection(cm, compute) {
        let ranges = cm.doc.sel.ranges, kill = [];
        for (let i = 0; i < ranges.length; i++) {
            let toKill = compute(ranges[i]);
            while (kill.length && line_pos.cmp(toKill.from, misc.lst(kill).to) <= 0) {
                let replaced = kill.pop();
                if (line_pos.cmp(replaced.from, toKill.from) < 0) {
                    toKill.from = replaced.from;
                    break;
                }
            }
            kill.push(toKill);
        }
        operations.runInOp(cm, () => {
            for (let i = kill.length - 1; i >= 0; i--)
                changes.replaceRange(cm.doc, '', kill[i].from, kill[i].to, '+delete');
            scrolling.ensureCursorVisible(cm);
        });
    }
    return { deleteNearSelection: deleteNearSelection };
});
define('skylark-codemirror/primitives/input/movement',[
    '../line/pos',
    '../measurement/position_measurement',
    '../util/bidi',
    '../util/misc'
], function (line_pos, position_measurement, bidi, misc) {
    'use strict';
    function moveCharLogically(line, ch, dir) {
        let target = misc.skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
    }
    function moveLogically(line, start, dir) {
        let ch = moveCharLogically(line, start.ch, dir);
        return ch == null ? null : new line_pos.Pos(start.line, ch, dir < 0 ? 'after' : 'before');
    }
    function endOfLine(visually, cm, lineObj, lineNo, dir) {
        if (visually) {
            let order = bidi.getOrder(lineObj, cm.doc.direction);
            if (order) {
                let part = dir < 0 ? misc.lst(order) : order[0];
                let moveInStorageOrder = dir < 0 == (part.level == 1);
                let sticky = moveInStorageOrder ? 'after' : 'before';
                let ch;
                if (part.level > 0 || cm.doc.direction == 'rtl') {
                    let prep = position_measurement.prepareMeasureForLine(cm, lineObj);
                    ch = dir < 0 ? lineObj.text.length - 1 : 0;
                    let targetTop = position_measurement.measureCharPrepared(cm, prep, ch).top;
                    ch = misc.findFirst(ch => position_measurement.measureCharPrepared(cm, prep, ch).top == targetTop, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
                    if (sticky == 'before')
                        ch = moveCharLogically(lineObj, ch, 1);
                } else
                    ch = dir < 0 ? part.to : part.from;
                return new line_pos.Pos(lineNo, ch, sticky);
            }
        }
        return new line_pos.Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? 'before' : 'after');
    }
    function moveVisually(cm, line, start, dir) {
        let bidi = bidi.getOrder(line, cm.doc.direction);
        if (!bidi)
            return moveLogically(line, start, dir);
        if (start.ch >= line.text.length) {
            start.ch = line.text.length;
            start.sticky = 'before';
        } else if (start.ch <= 0) {
            start.ch = 0;
            start.sticky = 'after';
        }
        let partPos = bidi.getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
        if (cm.doc.direction == 'ltr' && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
            return moveLogically(line, start, dir);
        }
        let mv = (pos, dir) => moveCharLogically(line, pos instanceof line_pos.Pos ? pos.ch : pos, dir);
        let prep;
        let getWrappedLineExtent = ch => {
            if (!cm.options.lineWrapping)
                return {
                    begin: 0,
                    end: line.text.length
                };
            prep = prep || position_measurement.prepareMeasureForLine(cm, line);
            return position_measurement.wrappedLineExtentChar(cm, line, prep, ch);
        };
        let wrappedLineExtent = getWrappedLineExtent(start.sticky == 'before' ? mv(start, -1) : start.ch);
        if (cm.doc.direction == 'rtl' || part.level == 1) {
            let moveInStorageOrder = part.level == 1 == dir < 0;
            let ch = mv(start, moveInStorageOrder ? 1 : -1);
            if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
                let sticky = moveInStorageOrder ? 'before' : 'after';
                return new line_pos.Pos(start.line, ch, sticky);
            }
        }
        let searchInVisualLine = (partPos, dir, wrappedLineExtent) => {
            let getRes = (ch, moveInStorageOrder) => moveInStorageOrder ? new line_pos.Pos(start.line, mv(ch, 1), 'before') : new line_pos.Pos(start.line, ch, 'after');
            for (; partPos >= 0 && partPos < bidi.length; partPos += dir) {
                let part = bidi[partPos];
                let moveInStorageOrder = dir > 0 == (part.level != 1);
                let ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
                if (part.from <= ch && ch < part.to)
                    return getRes(ch, moveInStorageOrder);
                ch = moveInStorageOrder ? part.from : mv(part.to, -1);
                if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end)
                    return getRes(ch, moveInStorageOrder);
            }
        };
        let res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
        if (res)
            return res;
        let nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
        if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
            res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
            if (res)
                return res;
        }
        return null;
    }
    return {
        moveLogically: moveLogically,
        endOfLine: endOfLine,
        moveVisually: moveVisually
    };
});
define('skylark-codemirror/primitives/edit/commands',[
    './deleteNearSelection',
    '../display/operations',
    '../display/scrolling',
    '../input/movement',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../model/selection',
    '../model/selection_updates',
    '../util/misc',
    '../util/bidi'
], function (a, b, c, d, e, f, g, h, i, j, k) {
    'use strict';
    let commands = {
        selectAll: i.selectAll,
        singleSelection: cm => cm.setSelection(cm.getCursor('anchor'), cm.getCursor('head'), j.sel_dontScroll),
        killLine: cm => a.deleteNearSelection(cm, range => {
            if (range.empty()) {
                let len = g.getLine(cm.doc, range.head.line).text.length;
                if (range.head.ch == len && range.head.line < cm.lastLine())
                    return {
                        from: range.head,
                        to: e.Pos(range.head.line + 1, 0)
                    };
                else
                    return {
                        from: range.head,
                        to: e.Pos(range.head.line, len)
                    };
            } else {
                return {
                    from: range.from(),
                    to: range.to()
                };
            }
        }),
        deleteLine: cm => a.deleteNearSelection(cm, range => ({
            from: e.Pos(range.from().line, 0),
            to: e.clipPos(cm.doc, e.Pos(range.to().line + 1, 0))
        })),
        delLineLeft: cm => a.deleteNearSelection(cm, range => ({
            from: e.Pos(range.from().line, 0),
            to: range.from()
        })),
        delWrappedLineLeft: cm => a.deleteNearSelection(cm, range => {
            let top = cm.charCoords(range.head, 'div').top + 5;
            let leftPos = cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
            return {
                from: leftPos,
                to: range.from()
            };
        }),
        delWrappedLineRight: cm => a.deleteNearSelection(cm, range => {
            let top = cm.charCoords(range.head, 'div').top + 5;
            let rightPos = cm.coordsChar({
                left: cm.display.lineDiv.offsetWidth + 100,
                top: top
            }, 'div');
            return {
                from: range.from(),
                to: rightPos
            };
        }),
        undo: cm => cm.undo(),
        redo: cm => cm.redo(),
        undoSelection: cm => cm.undoSelection(),
        redoSelection: cm => cm.redoSelection(),
        goDocStart: cm => cm.extendSelection(e.Pos(cm.firstLine(), 0)),
        goDocEnd: cm => cm.extendSelection(e.Pos(cm.lastLine())),
        goLineStart: cm => cm.extendSelectionsBy(range => lineStart(cm, range.head.line), {
            origin: '+move',
            bias: 1
        }),
        goLineStartSmart: cm => cm.extendSelectionsBy(range => lineStartSmart(cm, range.head), {
            origin: '+move',
            bias: 1
        }),
        goLineEnd: cm => cm.extendSelectionsBy(range => lineEnd(cm, range.head.line), {
            origin: '+move',
            bias: -1
        }),
        goLineRight: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            return cm.coordsChar({
                left: cm.display.lineDiv.offsetWidth + 100,
                top: top
            }, 'div');
        }, j.sel_move),
        goLineLeft: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            return cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
        }, j.sel_move),
        goLineLeftSmart: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            let pos = cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
            if (pos.ch < cm.getLine(pos.line).search(/\S/))
                return lineStartSmart(cm, range.head);
            return pos;
        }, j.sel_move),
        goLineUp: cm => cm.moveV(-1, 'line'),
        goLineDown: cm => cm.moveV(1, 'line'),
        goPageUp: cm => cm.moveV(-1, 'page'),
        goPageDown: cm => cm.moveV(1, 'page'),
        goCharLeft: cm => cm.moveH(-1, 'char'),
        goCharRight: cm => cm.moveH(1, 'char'),
        goColumnLeft: cm => cm.moveH(-1, 'column'),
        goColumnRight: cm => cm.moveH(1, 'column'),
        goWordLeft: cm => cm.moveH(-1, 'word'),
        goGroupRight: cm => cm.moveH(1, 'group'),
        goGroupLeft: cm => cm.moveH(-1, 'group'),
        goWordRight: cm => cm.moveH(1, 'word'),
        delCharBefore: cm => cm.deleteH(-1, 'char'),
        delCharAfter: cm => cm.deleteH(1, 'char'),
        delWordBefore: cm => cm.deleteH(-1, 'word'),
        delWordAfter: cm => cm.deleteH(1, 'word'),
        delGroupBefore: cm => cm.deleteH(-1, 'group'),
        delGroupAfter: cm => cm.deleteH(1, 'group'),
        indentAuto: cm => cm.indentSelection('smart'),
        indentMore: cm => cm.indentSelection('add'),
        indentLess: cm => cm.indentSelection('subtract'),
        insertTab: cm => cm.replaceSelection('\t'),
        insertSoftTab: cm => {
            let spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
            for (let i = 0; i < ranges.length; i++) {
                let pos = ranges[i].from();
                let col = j.countColumn(cm.getLine(pos.line), pos.ch, tabSize);
                spaces.push(j.spaceStr(tabSize - col % tabSize));
            }
            cm.replaceSelections(spaces);
        },
        defaultTab: cm => {
            if (cm.somethingSelected())
                cm.indentSelection('add');
            else
                cm.execCommand('insertTab');
        },
        transposeChars: cm => b.runInOp(cm, () => {
            let ranges = cm.listSelections(), newSel = [];
            for (let i = 0; i < ranges.length; i++) {
                if (!ranges[i].empty())
                    continue;
                let cur = ranges[i].head, line = g.getLine(cm.doc, cur.line).text;
                if (line) {
                    if (cur.ch == line.length)
                        cur = new e.Pos(cur.line, cur.ch - 1);
                    if (cur.ch > 0) {
                        cur = new e.Pos(cur.line, cur.ch + 1);
                        cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), e.Pos(cur.line, cur.ch - 2), cur, '+transpose');
                    } else if (cur.line > cm.doc.first) {
                        let prev = g.getLine(cm.doc, cur.line - 1).text;
                        if (prev) {
                            cur = new e.Pos(cur.line, 1);
                            cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), e.Pos(cur.line - 1, prev.length - 1), cur, '+transpose');
                        }
                    }
                }
                newSel.push(new h.Range(cur, cur));
            }
            cm.setSelections(newSel);
        }),
        newlineAndIndent: cm => b.runInOp(cm, () => {
            let sels = cm.listSelections();
            for (let i = sels.length - 1; i >= 0; i--)
                cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, '+input');
            sels = cm.listSelections();
            for (let i = 0; i < sels.length; i++)
                cm.indentLine(sels[i].from().line, null, true);
            c.ensureCursorVisible(cm);
        }),
        openLine: cm => cm.replaceSelection('\n', 'start'),
        toggleOverwrite: cm => cm.toggleOverwrite()
    };
    function lineStart(cm, lineN) {
        let line = g.getLine(cm.doc, lineN);
        let visual = f.visualLine(line);
        if (visual != line)
            lineN = g.lineNo(visual);
        return d.endOfLine(true, cm, visual, lineN, 1);
    }
    function lineEnd(cm, lineN) {
        let line = g.getLine(cm.doc, lineN);
        let visual = f.visualLineEnd(line);
        if (visual != line)
            lineN = g.lineNo(visual);
        return d.endOfLine(true, cm, line, lineN, -1);
    }
    function lineStartSmart(cm, pos) {
        let start = lineStart(cm, pos.line);
        let line = g.getLine(cm.doc, start.line);
        let order = k.getOrder(line, cm.doc.direction);
        if (!order || order[0].level == 0) {
            let firstNonWS = Math.max(0, line.text.search(/\S/));
            let inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
            return e.Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
    }
    return { commands: commands };
});
define('skylark-codemirror/primitives/edit/key_events',[
    '../util/operation_group',
    '../display/selection',
    '../input/keymap',
    '../measurement/widgets',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    './commands'
], function (operation_group, selection, keymap, widgets, browser, dom, events, feature_detection, misc, m_commands) {
    'use strict';
    function doHandleBinding(cm, bound, dropShift) {
        if (typeof bound == 'string') {
            bound = m_commands.commands[bound];
            if (!bound)
                return false;
        }
        cm.display.input.ensurePolled();
        let prevShift = cm.display.shift, done = false;
        try {
            if (cm.isReadOnly())
                cm.state.suppressEdits = true;
            if (dropShift)
                cm.display.shift = false;
            done = bound(cm) != misc.Pass;
        } finally {
            cm.display.shift = prevShift;
            cm.state.suppressEdits = false;
        }
        return done;
    }
    function lookupKeyForEditor(cm, name, handle) {
        for (let i = 0; i < cm.state.keyMaps.length; i++) {
            let result = keymap.lookupKey(name, cm.state.keyMaps[i], handle, cm);
            if (result)
                return result;
        }
        return cm.options.extraKeys && keymap.lookupKey(name, cm.options.extraKeys, handle, cm) || keymap.lookupKey(name, cm.options.keyMap, handle, cm);
    }
    let stopSeq = new misc.Delayed();
    function dispatchKey(cm, name, e, handle) {
        let seq = cm.state.keySeq;
        if (seq) {
            if (keymap.isModifierKey(name))
                return 'handled';
            if (/\'$/.test(name))
                cm.state.keySeq = null;
            else
                stopSeq.set(50, () => {
                    if (cm.state.keySeq == seq) {
                        cm.state.keySeq = null;
                        cm.display.input.reset();
                    }
                });
            if (dispatchKeyInner(cm, seq + ' ' + name, e, handle))
                return true;
        }
        return dispatchKeyInner(cm, name, e, handle);
    }
    function dispatchKeyInner(cm, name, e, handle) {
        let result = lookupKeyForEditor(cm, name, handle);
        if (result == 'multi')
            cm.state.keySeq = name;
        if (result == 'handled')
            operation_group.signalLater(cm, 'keyHandled', cm, name, e);
        if (result == 'handled' || result == 'multi') {
            events.e_preventDefault(e);
            selection.restartBlink(cm);
        }
        return !!result;
    }
    function handleKeyBinding(cm, e) {
        let name = keymap.keyName(e, true);
        if (!name)
            return false;
        if (e.shiftKey && !cm.state.keySeq) {
            return dispatchKey(cm, 'Shift-' + name, e, b => doHandleBinding(cm, b, true)) || dispatchKey(cm, name, e, b => {
                if (typeof b == 'string' ? /^go[A-Z]/.test(b) : b.motion)
                    return doHandleBinding(cm, b);
            });
        } else {
            return dispatchKey(cm, name, e, b => doHandleBinding(cm, b));
        }
    }
    function handleCharBinding(cm, e, ch) {
        return dispatchKey(cm, "'" + ch + "'", e, b => doHandleBinding(cm, b, true));
    }
    let lastStoppedKey = null;
    function onKeyDown(e) {
        let cm = this;
        cm.curOp.focus = dom.activeElt();
        if (events.signalDOMEvent(cm, e))
            return;
        if (browser.ie && browser.ie_version < 11 && e.keyCode == 27)
            e.returnValue = false;
        let code = e.keyCode;
        cm.display.shift = code == 16 || e.shiftKey;
        let handled = handleKeyBinding(cm, e);
        if (browser.presto) {
            lastStoppedKey = handled ? code : null;
            if (!handled && code == 88 && !feature_detection.hasCopyEvent && (browser.mac ? e.metaKey : e.ctrlKey))
                cm.replaceSelection('', null, 'cut');
        }
        if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
            showCrossHair(cm);
    }
    function showCrossHair(cm) {
        let lineDiv = cm.display.lineDiv;
        dom.addClass(lineDiv, 'CodeMirror-crosshair');
        function up(e) {
            if (e.keyCode == 18 || !e.altKey) {
                dom.rmClass(lineDiv, 'CodeMirror-crosshair');
                events.off(document, 'keyup', up);
                events.off(document, 'mouseover', up);
            }
        }
        events.on(document, 'keyup', up);
        events.on(document, 'mouseover', up);
    }
    function onKeyUp(e) {
        if (e.keyCode == 16)
            this.doc.sel.shift = false;
        events.signalDOMEvent(this, e);
    }
    function onKeyPress(e) {
        let cm = this;
        if (widgets.eventInWidget(cm.display, e) || events.signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || browser.mac && e.metaKey)
            return;
        let keyCode = e.keyCode, charCode = e.charCode;
        if (browser.presto && keyCode == lastStoppedKey) {
            lastStoppedKey = null;
            events.e_preventDefault(e);
            return;
        }
        if (browser.presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e))
            return;
        let ch = String.fromCharCode(charCode == null ? keyCode : charCode);
        if (ch == '\b')
            return;
        if (handleCharBinding(cm, e, ch))
            return;
        cm.display.input.onKeyPress(e);
    }
    return {
        dispatchKey: dispatchKey,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        onKeyPress: onKeyPress
    };
});
define('skylark-codemirror/primitives/edit/mouse_events',[
    '../display/focus',
    '../display/operations',
    '../display/update_lines',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/bidi',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../input/keymap',
    './key_events',
    './commands'
], function (focus, operations, update_lines, line_pos, utils_line, position_measurement, widgets, selection, selection_updates, browser, bidi, dom, events, n, o, p, q, r) {
    'use strict';
    const DOUBLECLICK_DELAY = 400;
    class PastClick {
        constructor(time, pos, button) {
            this.time = time;
            this.pos = pos;
            this.button = button;
        }
        compare(time, pos, button) {
            return this.time + DOUBLECLICK_DELAY > time && line_pos.cmp(pos, this.pos) == 0 && button == this.button;
        }
    }
    let lastClick, lastDoubleClick;
    function clickRepeat(pos, button) {
        let now = +new Date();
        if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
            lastClick = lastDoubleClick = null;
            return 'triple';
        } else if (lastClick && lastClick.compare(now, pos, button)) {
            lastDoubleClick = new PastClick(now, pos, button);
            lastClick = null;
            return 'double';
        } else {
            lastClick = new PastClick(now, pos, button);
            lastDoubleClick = null;
            return 'single';
        }
    }
    function onMouseDown(e) {
        let cm = this, display = cm.display;
        if (events.signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch())
            return;
        display.input.ensurePolled();
        display.shift = e.shiftKey;
        if (widgets.eventInWidget(display, e)) {
            if (!browser.webkit) {
                display.scroller.draggable = false;
                setTimeout(() => display.scroller.draggable = true, 100);
            }
            return;
        }
        if (clickInGutter(cm, e))
            return;
        let pos = position_measurement.posFromMouse(cm, e), button = events.e_button(e), repeat = pos ? clickRepeat(pos, button) : 'single';
        window.focus();
        if (button == 1 && cm.state.selectingText)
            cm.state.selectingText(e);
        if (pos && handleMappedButton(cm, button, pos, repeat, e))
            return;
        if (button == 1) {
            if (pos)
                leftButtonDown(cm, pos, repeat, e);
            else if (events.e_target(e) == display.scroller)
                events.e_preventDefault(e);
        } else if (button == 2) {
            if (pos)
                selection_updates.extendSelection(cm.doc, pos);
            setTimeout(() => display.input.focus(), 20);
        } else if (button == 3) {
            if (browser.captureRightClick)
                cm.display.input.onContextMenu(e);
            else
                focus.delayBlurEvent(cm);
        }
    }
    function handleMappedButton(cm, button, pos, repeat, event) {
        let name = 'Click';
        if (repeat == 'double')
            name = 'Double' + name;
        else if (repeat == 'triple')
            name = 'Triple' + name;
        name = (button == 1 ? 'Left' : button == 2 ? 'Middle' : 'Right') + name;
        return q.dispatchKey(cm, p.addModifierNames(name, event), event, bound => {
            if (typeof bound == 'string')
                bound = r.commands[bound];
            if (!bound)
                return false;
            let done = false;
            try {
                if (cm.isReadOnly())
                    cm.state.suppressEdits = true;
                done = bound(cm, pos) != o.Pass;
            } finally {
                cm.state.suppressEdits = false;
            }
            return done;
        });
    }
    function configureMouse(cm, repeat, event) {
        let option = cm.getOption('configureMouse');
        let value = option ? option(cm, repeat, event) : {};
        if (value.unit == null) {
            let rect = browser.chromeOS ? event.shiftKey && event.metaKey : event.altKey;
            value.unit = rect ? 'rectangle' : repeat == 'single' ? 'char' : repeat == 'double' ? 'word' : 'line';
        }
        if (value.extend == null || cm.doc.extend)
            value.extend = cm.doc.extend || event.shiftKey;
        if (value.addNew == null)
            value.addNew = browser.mac ? event.metaKey : event.ctrlKey;
        if (value.moveOnDrag == null)
            value.moveOnDrag = !(browser.mac ? event.altKey : event.ctrlKey);
        return value;
    }
    function leftButtonDown(cm, pos, repeat, event) {
        if (browser.ie)
            setTimeout(o.bind(focus.ensureFocus, cm), 0);
        else
            cm.curOp.focus = dom.activeElt();
        let behavior = configureMouse(cm, repeat, event);
        let sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && n.dragAndDrop && !cm.isReadOnly() && repeat == 'single' && (contained = sel.contains(pos)) > -1 && (line_pos.cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (line_pos.cmp(contained.to(), pos) > 0 || pos.xRel < 0))
            leftButtonStartDrag(cm, event, pos, behavior);
        else
            leftButtonSelect(cm, event, pos, behavior);
    }
    function leftButtonStartDrag(cm, event, pos, behavior) {
        let display = cm.display, moved = false;
        let dragEnd = operations.operation(cm, e => {
            if (browser.webkit)
                display.scroller.draggable = false;
            cm.state.draggingText = false;
            events.off(display.wrapper.ownerDocument, 'mouseup', dragEnd);
            events.off(display.wrapper.ownerDocument, 'mousemove', mouseMove);
            events.off(display.scroller, 'dragstart', dragStart);
            events.off(display.scroller, 'drop', dragEnd);
            if (!moved) {
                events.e_preventDefault(e);
                if (!behavior.addNew)
                    selection_updates.extendSelection(cm.doc, pos, null, null, behavior.extend);
                if (browser.webkit || browser.ie && browser.ie_version == 9)
                    setTimeout(() => {
                        display.wrapper.ownerDocument.body.focus();
                        display.input.focus();
                    }, 20);
                else
                    display.input.focus();
            }
        });
        let mouseMove = function (e2) {
            moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
        };
        let dragStart = () => moved = true;
        if (browser.webkit)
            display.scroller.draggable = true;
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        if (display.scroller.dragDrop)
            display.scroller.dragDrop();
        events.on(display.wrapper.ownerDocument, 'mouseup', dragEnd);
        events.on(display.wrapper.ownerDocument, 'mousemove', mouseMove);
        events.on(display.scroller, 'dragstart', dragStart);
        events.on(display.scroller, 'drop', dragEnd);
        focus.delayBlurEvent(cm);
        setTimeout(() => display.input.focus(), 20);
    }
    function rangeForUnit(cm, pos, unit) {
        if (unit == 'char')
            return new selection.Range(pos, pos);
        if (unit == 'word')
            return cm.findWordAt(pos);
        if (unit == 'line')
            return new selection.Range(line_pos.Pos(pos.line, 0), line_pos.clipPos(cm.doc, line_pos.Pos(pos.line + 1, 0)));
        let result = unit(cm, pos);
        return new selection.Range(result.from, result.to);
    }
    function leftButtonSelect(cm, event, start, behavior) {
        let display = cm.display, doc = cm.doc;
        events.e_preventDefault(event);
        let ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
            ourIndex = doc.sel.contains(start);
            if (ourIndex > -1)
                ourRange = ranges[ourIndex];
            else
                ourRange = new selection.Range(start, start);
        } else {
            ourRange = doc.sel.primary();
            ourIndex = doc.sel.primIndex;
        }
        if (behavior.unit == 'rectangle') {
            if (!behavior.addNew)
                ourRange = new selection.Range(start, start);
            start = position_measurement.posFromMouse(cm, event, true, true);
            ourIndex = -1;
        } else {
            let range = rangeForUnit(cm, start, behavior.unit);
            if (behavior.extend)
                ourRange = selection_updates.extendRange(ourRange, range.anchor, range.head, behavior.extend);
            else
                ourRange = range;
        }
        if (!behavior.addNew) {
            ourIndex = 0;
            selection_updates.setSelection(doc, new selection.Selection([ourRange], 0), o.sel_mouse);
            startSel = doc.sel;
        } else if (ourIndex == -1) {
            ourIndex = ranges.length;
            selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges.concat([ourRange]), ourIndex), {
                scroll: false,
                origin: '*mouse'
            });
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == 'char' && !behavior.extend) {
            selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
                scroll: false,
                origin: '*mouse'
            });
            startSel = doc.sel;
        } else {
            selection_updates.replaceOneSelection(doc, ourIndex, ourRange, o.sel_mouse);
        }
        let lastPos = start;
        function extendTo(pos) {
            if (line_pos.cmp(lastPos, pos) == 0)
                return;
            lastPos = pos;
            if (behavior.unit == 'rectangle') {
                let ranges = [], tabSize = cm.options.tabSize;
                let startCol = o.countColumn(utils_line.getLine(doc, start.line).text, start.ch, tabSize);
                let posCol = o.countColumn(utils_line.getLine(doc, pos.line).text, pos.ch, tabSize);
                let left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
                for (let line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
                    let text = utils_line.getLine(doc, line).text, leftPos = o.findColumn(text, left, tabSize);
                    if (left == right)
                        ranges.push(new selection.Range(line_pos.Pos(line, leftPos), line_pos.Pos(line, leftPos)));
                    else if (text.length > leftPos)
                        ranges.push(new selection.Range(line_pos.Pos(line, leftPos), line_pos.Pos(line, o.findColumn(text, right, tabSize))));
                }
                if (!ranges.length)
                    ranges.push(new selection.Range(start, start));
                selection_updates.setSelection(doc, selection.normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
                    origin: '*mouse',
                    scroll: false
                });
                cm.scrollIntoView(pos);
            } else {
                let oldRange = ourRange;
                let range = rangeForUnit(cm, pos, behavior.unit);
                let anchor = oldRange.anchor, head;
                if (line_pos.cmp(range.anchor, anchor) > 0) {
                    head = range.head;
                    anchor = line_pos.minPos(oldRange.from(), range.anchor);
                } else {
                    head = range.anchor;
                    anchor = line_pos.maxPos(oldRange.to(), range.head);
                }
                let ranges = startSel.ranges.slice(0);
                ranges[ourIndex] = bidiSimplify(cm, new selection.Range(line_pos.clipPos(doc, anchor), head));
                selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges, ourIndex), o.sel_mouse);
            }
        }
        let editorSize = display.wrapper.getBoundingClientRect();
        let counter = 0;
        function extend(e) {
            let curCount = ++counter;
            let cur = position_measurement.posFromMouse(cm, e, true, behavior.unit == 'rectangle');
            if (!cur)
                return;
            if (line_pos.cmp(cur, lastPos) != 0) {
                cm.curOp.focus = dom.activeElt();
                extendTo(cur);
                let visible = update_lines.visibleLines(display, doc);
                if (cur.line >= visible.to || cur.line < visible.from)
                    setTimeout(operations.operation(cm, () => {
                        if (counter == curCount)
                            extend(e);
                    }), 150);
            } else {
                let outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                if (outside)
                    setTimeout(operations.operation(cm, () => {
                        if (counter != curCount)
                            return;
                        display.scroller.scrollTop += outside;
                        extend(e);
                    }), 50);
            }
        }
        function done(e) {
            cm.state.selectingText = false;
            counter = Infinity;
            events.e_preventDefault(e);
            display.input.focus();
            events.off(display.wrapper.ownerDocument, 'mousemove', move);
            events.off(display.wrapper.ownerDocument, 'mouseup', up);
            doc.history.lastSelOrigin = null;
        }
        let move = operations.operation(cm, e => {
            if (e.buttons === 0 || !events.e_button(e))
                done(e);
            else
                extend(e);
        });
        let up = operations.operation(cm, done);
        cm.state.selectingText = up;
        events.on(display.wrapper.ownerDocument, 'mousemove', move);
        events.on(display.wrapper.ownerDocument, 'mouseup', up);
    }
    function bidiSimplify(cm, range) {
        let {anchor, head} = range, anchorLine = utils_line.getLine(cm.doc, anchor.line);
        if (line_pos.cmp(anchor, head) == 0 && anchor.sticky == head.sticky)
            return range;
        let order = bidi.getOrder(anchorLine);
        if (!order)
            return range;
        let index = bidi.getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
        if (part.from != anchor.ch && part.to != anchor.ch)
            return range;
        let boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length)
            return range;
        let leftSide;
        if (head.line != anchor.line) {
            leftSide = (head.line - anchor.line) * (cm.doc.direction == 'ltr' ? 1 : -1) > 0;
        } else {
            let headIndex = bidi.getBidiPartAt(order, head.ch, head.sticky);
            let dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
            if (headIndex == boundary - 1 || headIndex == boundary)
                leftSide = dir < 0;
            else
                leftSide = dir > 0;
        }
        let usePart = order[boundary + (leftSide ? -1 : 0)];
        let from = leftSide == (usePart.level == 1);
        let ch = from ? usePart.from : usePart.to, sticky = from ? 'after' : 'before';
        return anchor.ch == ch && anchor.sticky == sticky ? range : new selection.Range(new line_pos.Pos(anchor.line, ch, sticky), head);
    }
    function gutterEvent(cm, e, type, prevent) {
        let mX, mY;
        if (e.touches) {
            mX = e.touches[0].clientX;
            mY = e.touches[0].clientY;
        } else {
            try {
                mX = e.clientX;
                mY = e.clientY;
            } catch (e) {
                return false;
            }
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right))
            return false;
        if (prevent)
            events.e_preventDefault(e);
        let display = cm.display;
        let lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !events.hasHandler(cm, type))
            return events.e_defaultPrevented(e);
        mY -= lineBox.top - display.viewOffset;
        for (let i = 0; i < cm.options.gutters.length; ++i) {
            let g = display.gutters.childNodes[i];
            if (g && g.getBoundingClientRect().right >= mX) {
                let line = utils_line.lineAtHeight(cm.doc, mY);
                let gutter = cm.options.gutters[i];
                events.signal(cm, type, cm, line, gutter, e);
                return events.e_defaultPrevented(e);
            }
        }
    }
    function clickInGutter(cm, e) {
        return gutterEvent(cm, e, 'gutterClick', true);
    }
    function onContextMenu(cm, e) {
        if (widgets.eventInWidget(cm.display, e) || contextMenuInGutter(cm, e))
            return;
        if (events.signalDOMEvent(cm, e, 'contextmenu'))
            return;
        if (!browser.captureRightClick)
            cm.display.input.onContextMenu(e);
    }
    function contextMenuInGutter(cm, e) {
        if (!events.hasHandler(cm, 'gutterContextMenu'))
            return false;
        return gutterEvent(cm, e, 'gutterContextMenu', false);
    }
    return {
        onMouseDown: onMouseDown,
        clickInGutter: clickInGutter,
        onContextMenu: onContextMenu
    };
});
define('skylark-codemirror/primitives/edit/utils',['../measurement/position_measurement'], function (a) {
    'use strict';
    function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, '') + cm.options.theme.replace(/(^|\s)\s*/g, ' cm-s-');
        a.clearCaches(cm);
    }
    return { themeChanged: themeChanged };
});
define('skylark-codemirror/primitives/edit/options',[
    '../display/focus',
    '../display/gutters',
    '../display/line_numbers',
    '../display/mode_state',
    '../display/scrollbars',
    '../display/selection',
    '../display/view_tracking',
    '../input/keymap',
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../measurement/position_measurement',
    '../model/changes',
    '../util/browser',
    '../util/dom',
    '../util/event',
    './utils'
], function (focus, gutters, line_numbers, mode_state, scrollbars, selection, view_tracking, keymap, line_data, posit, spans, measurement, changes, browser, dom, event, utils) {
    'use strict';
    let Init = {
        toString: function () {
            return 'CodeMirror.Init';
        }
    };
    let defaults = {};
    let optionHandlers = {};
    function defineOptions(CodeMirror) {
        let optionHandlers = CodeMirror.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
            CodeMirror.defaults[name] = deflt;
            if (handle)
                optionHandlers[name] = notOnInit ? (cm, val, old) => {
                    if (old != Init)
                        handle(cm, val, old);
                } : handle;
        }
        CodeMirror.defineOption = option;
        CodeMirror.Init = Init;
        option('value', '', (cm, val) => cm.setValue(val), true);
        option('mode', null, (cm, val) => {
            cm.doc.modeOption = val;
            mode_state.loadMode(cm);
        }, true);
        option('indentUnit', 2, mode_state.loadMode, true);
        option('indentWithTabs', false);
        option('smartIndent', true);
        option('tabSize', 4, cm => {
            mode_state.resetModeState(cm);
            measurement.clearCaches(cm);
            view_tracking.regChange(cm);
        }, true);
        option('lineSeparator', null, (cm, val) => {
            cm.doc.lineSep = val;
            if (!val)
                return;
            let newBreaks = [], lineNo = cm.doc.first;
            cm.doc.iter(line => {
                for (let pos = 0;;) {
                    let found = line.text.indexOf(val, pos);
                    if (found == -1)
                        break;
                    pos = found + val.length;
                    newBreaks.push(posit.Pos(lineNo, found));
                }
                lineNo++;
            });
            for (let i = newBreaks.length - 1; i >= 0; i--)
                changes.replaceRange(cm.doc, val, newBreaks[i], posit.Pos(newBreaks[i].line, newBreaks[i].ch + val.length));
        });
        option('specialChars', /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g, (cm, val, old) => {
            cm.state.specialChars = new RegExp(val.source + (val.test('\t') ? '' : '|\t'), 'g');
            if (old != Init)
                cm.refresh();
        });
        option('specialCharPlaceholder', line_data.defaultSpecialCharPlaceholder, cm => cm.refresh(), true);
        option('electricChars', true);
        option('inputStyle', browser.mobile ? 'contenteditable' : 'textarea', () => {
            throw new Error('inputStyle can not (yet) be changed in a running editor');
        }, true);
        option('spellcheck', false, (cm, val) => cm.getInputField().spellcheck = val, true);
        option('autocorrect', false, (cm, val) => cm.getInputField().autocorrect = val, true);
        option('autocapitalize', false, (cm, val) => cm.getInputField().autocapitalize = val, true);
        option('rtlMoveVisually', !browser.windows);
        option('wholeLineUpdateBefore', true);
        option('theme', 'default', cm => {
            utils.themeChanged(cm);
            guttersChanged(cm);
        }, true);
        option('keyMap', 'default', (cm, val, old) => {
            let next = keymap.getKeyMap(val);
            let prev = old != Init && keymap.getKeyMap(old);
            if (prev && prev.detach)
                prev.detach(cm, next);
            if (next.attach)
                next.attach(cm, prev || null);
        });
        option('extraKeys', null);
        option('configureMouse', null);
        option('lineWrapping', false, wrappingChanged, true);
        option('gutters', [], cm => {
            gutters.setGuttersForLineNumbers(cm.options);
            guttersChanged(cm);
        }, true);
        option('fixedGutter', true, (cm, val) => {
            cm.display.gutters.style.left = val ? measurement.compensateForHScroll(cm.display) + 'px' : '0';
            cm.refresh();
        }, true);
        option('coverGutterNextToScrollbar', false, cm => scrollbars.updateScrollbars(cm), true);
        option('scrollbarStyle', 'native', cm => {
            scrollbars.initScrollbars(cm);
            scrollbars.updateScrollbars(cm);
            cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
            cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, true);
        option('lineNumbers', false, cm => {
            gutters.setGuttersForLineNumbers(cm.options);
            guttersChanged(cm);
        }, true);
        option('firstLineNumber', 1, guttersChanged, true);
        option('lineNumberFormatter', integer => integer, guttersChanged, true);
        option('showCursorWhenSelecting', false, selection.updateSelection, true);
        option('resetSelectionOnContextMenu', true);
        option('lineWiseCopyCut', true);
        option('pasteLinesPerSelection', true);
        option('selectionsMayTouch', false);
        option('readOnly', false, (cm, val) => {
            if (val == 'nocursor') {
                focus.onBlur(cm);
                cm.display.input.blur();
            }
            cm.display.input.readOnlyChanged(val);
        });
        option('disableInput', false, (cm, val) => {
            if (!val)
                cm.display.input.reset();
        }, true);
        option('dragDrop', true, dragDropChanged);
        option('allowDropFileTypes', null);
        option('cursorBlinkRate', 530);
        option('cursorScrollMargin', 0);
        option('cursorHeight', 1, selection.updateSelection, true);
        option('singleCursorHeightPerLine', true, selection.updateSelection, true);
        option('workTime', 100);
        option('workDelay', 100);
        option('flattenSpans', true, mode_state.resetModeState, true);
        option('addModeClass', false, mode_state.resetModeState, true);
        option('pollInterval', 100);
        option('undoDepth', 200, (cm, val) => cm.doc.history.undoDepth = val);
        option('historyEventDelay', 1250);
        option('viewportMargin', 10, cm => cm.refresh(), true);
        option('maxHighlightLength', 10000, mode_state.resetModeState, true);
        option('moveInputWithCursor', true, (cm, val) => {
            if (!val)
                cm.display.input.resetPosition();
        });
        option('tabindex', null, (cm, val) => cm.display.input.getField().tabIndex = val || '');
        option('autofocus', null);
        option('direction', 'ltr', (cm, val) => cm.doc.setDirection(val), true);
        option('phrases', null);
    }
    function guttersChanged(cm) {
        gutters.updateGutters(cm);
        view_tracking.regChange(cm);
        line_numbers.alignHorizontally(cm);
    }
    function dragDropChanged(cm, value, old) {
        let wasOn = old && old != Init;
        if (!value != !wasOn) {
            let funcs = cm.display.dragFunctions;
            let toggle = value ? event.on : event.off;
            toggle(cm.display.scroller, 'dragstart', funcs.start);
            toggle(cm.display.scroller, 'dragenter', funcs.enter);
            toggle(cm.display.scroller, 'dragover', funcs.over);
            toggle(cm.display.scroller, 'dragleave', funcs.leave);
            toggle(cm.display.scroller, 'drop', funcs.drop);
        }
    }
    function wrappingChanged(cm) {
        if (cm.options.lineWrapping) {
            dom.addClass(cm.display.wrapper, 'CodeMirror-wrap');
            cm.display.sizer.style.minWidth = '';
            cm.display.sizerWidth = null;
        } else {
            dom.rmClass(cm.display.wrapper, 'CodeMirror-wrap');
            spans.findMaxLine(cm);
        }
        measurement.estimateLineHeights(cm);
        view_tracking.regChange(cm);
        measurement.clearCaches(cm);
        setTimeout(() => scrollbars.updateScrollbars(cm), 100);
    }
    return {
        Init: Init,
        defaults: defaults,
        optionHandlers: optionHandlers,
        defineOptions: defineOptions
    };
});
define('skylark-codemirror/primitives/edit/CodeMirror',[
    '../display/Display',
    '../display/focus',
    '../display/gutters',
    '../display/line_numbers',
    '../display/operations',
    '../display/scrollbars',
    '../display/scroll_events',
    '../display/scrolling',
    '../line/pos',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/Doc',
    '../model/document_data',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/event',
    '../util/misc',
    './drop_events',
    './global_events',
    './key_events',
    './mouse_events',
    './utils',
    './options'
], function (m_display, focuses, gutters, line_numbers, operations, scrollbars, scroll_events, scrolling, line_pos, position_measurement, widgets, Doc, document_data, selection, selection_updates, browser, events, misc, drop_events, global_events, key_events, mouse_events, utils, m_options) {
    'use strict';
    function CodeMirror(place, options) {
        if (!(this instanceof CodeMirror))
            return new CodeMirror(place, options);
        this.options = options = options ? misc.copyObj(options) : {};
        misc.copyObj(m_options.defaults, options, false);
        gutters.setGuttersForLineNumbers(options);
        let doc = options.value;
        if (typeof doc == 'string')
            doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);
        else if (options.mode)
            doc.modeOption = options.mode;
        this.doc = doc;
        let input = new CodeMirror.inputStyles[options.inputStyle](this);
        let display = this.display = new m_display.Display(place, doc, input);
        display.wrapper.CodeMirror = this;
        gutters.updateGutters(this);
        utils.themeChanged(this);
        if (options.lineWrapping)
            this.display.wrapper.className += ' CodeMirror-wrap';
        scrollbars.initScrollbars(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: false,
            draggingText: false,
            highlight: new misc.Delayed(),
            keySeq: null,
            specialChars: null
        };
        if (options.autofocus && !browser.mobile)
            display.input.focus();
        if (browser.ie && browser.ie_version < 11)
            setTimeout(() => this.display.input.reset(true), 20);
        registerEventHandlers(this);
        global_events.ensureGlobalHandlers();
        operations.startOperation(this);
        this.curOp.forceUpdate = true;
        document_data.attachDoc(this, doc);
        if (options.autofocus && !browser.mobile || this.hasFocus())
            setTimeout(misc.bind(focuses.onFocus, this), 20);
        else
            focuses.onBlur(this);
        for (let opt in m_options.optionHandlers)
            if (m_options.optionHandlers.hasOwnProperty(opt))
                m_options.optionHandlers[opt](this, options[opt], m_options.Init);
        line_numbers.maybeUpdateLineNumberWidth(this);
        if (options.finishInit)
            options.finishInit(this);
        for (let i = 0; i < initHooks.length; ++i)
            initHooks[i](this);
        operations.endOperation(this);
        if (browser.webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == 'optimizelegibility')
            display.lineDiv.style.textRendering = 'auto';
    }
    
    CodeMirror.defaults = m_options.defaults;
    CodeMirror.optionHandlers = m_options.optionHandlers;

    function registerEventHandlers(cm) {
        let d = cm.display;
        events.on(d.scroller, 'mousedown', operations.operation(cm, mouse_events.onMouseDown));
        if (browser.ie && browser.ie_version < 11)
            events.on(d.scroller, 'dblclick', operations.operation(cm, e => {
                if (events.signalDOMEvent(cm, e))
                    return;
                let pos = position_measurement.posFromMouse(cm, e);
                if (!pos || mouse_events.clickInGutter(cm, e) || widgets.eventInWidget(cm.display, e))
                    return;
                events.e_preventDefault(e);
                let word = cm.findWordAt(pos);
                selection_updates.extendSelection(cm.doc, word.anchor, word.head);
            }));
        else
            events.on(d.scroller, 'dblclick', e => events.signalDOMEvent(cm, e) || events.e_preventDefault(e));
        events.on(d.scroller, 'contextmenu', e => mouse_events.onContextMenu(cm, e));
        let touchFinished, prevTouch = { end: 0 };
        function finishTouch() {
            if (d.activeTouch) {
                touchFinished = setTimeout(() => d.activeTouch = null, 1000);
                prevTouch = d.activeTouch;
                prevTouch.end = +new Date();
            }
        }
        function isMouseLikeTouchEvent(e) {
            if (e.touches.length != 1)
                return false;
            let touch = e.touches[0];
            return touch.radiusX <= 1 && touch.radiusY <= 1;
        }
        function farAway(touch, other) {
            if (other.left == null)
                return true;
            let dx = other.left - touch.left, dy = other.top - touch.top;
            return dx * dx + dy * dy > 20 * 20;
        }
        events.on(d.scroller, 'touchstart', e => {
            if (!events.signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !mouse_events.clickInGutter(cm, e)) {
                d.input.ensurePolled();
                clearTimeout(touchFinished);
                let now = +new Date();
                d.activeTouch = {
                    start: now,
                    moved: false,
                    prev: now - prevTouch.end <= 300 ? prevTouch : null
                };
                if (e.touches.length == 1) {
                    d.activeTouch.left = e.touches[0].pageX;
                    d.activeTouch.top = e.touches[0].pageY;
                }
            }
        });
        events.on(d.scroller, 'touchmove', () => {
            if (d.activeTouch)
                d.activeTouch.moved = true;
        });
        events.on(d.scroller, 'touchend', e => {
            let touch = d.activeTouch;
            if (touch && !widgets.eventInWidget(d, e) && touch.left != null && !touch.moved && new Date() - touch.start < 300) {
                let pos = cm.coordsChar(d.activeTouch, 'page'), range;
                if (!touch.prev || farAway(touch, touch.prev))
                    range = new selection.Range(pos, pos);
                else if (!touch.prev.prev || farAway(touch, touch.prev.prev))
                    range = cm.findWordAt(pos);
                else
                    range = new selection.Range(line_pos.Pos(pos.line, 0), line_pos.clipPos(cm.doc, line_pos.Pos(pos.line + 1, 0)));
                cm.setSelection(range.anchor, range.head);
                cm.focus();
                events.e_preventDefault(e);
            }
            finishTouch();
        });
        events.on(d.scroller, 'touchcancel', finishTouch);
        events.on(d.scroller, 'scroll', () => {
            if (d.scroller.clientHeight) {
                scrolling.updateScrollTop(cm, d.scroller.scrollTop);
                scrolling.setScrollLeft(cm, d.scroller.scrollLeft, true);
                events.signal(cm, 'scroll', cm);
            }
        });
        events.on(d.scroller, 'mousewheel', e => scroll_events.onScrollWheel(cm, e));
        events.on(d.scroller, 'DOMMouseScroll', e => scroll_events.onScrollWheel(cm, e));
        events.on(d.wrapper, 'scroll', () => d.wrapper.scrollTop = d.wrapper.scrollLeft = 0);
        d.dragFunctions = {
            enter: e => {
                if (!events.signalDOMEvent(cm, e))
                    events.e_stop(e);
            },
            over: e => {
                if (!events.signalDOMEvent(cm, e)) {
                    drop_events.onDragOver(cm, e);
                    events.e_stop(e);
                }
            },
            start: e => drop_events.onDragStart(cm, e),
            drop: operations.operation(cm, drop_events.onDrop),
            leave: e => {
                if (!events.signalDOMEvent(cm, e)) {
                    drop_events.clearDragCursor(cm);
                }
            }
        };
        let inp = d.input.getField();
        events.on(inp, 'keyup', e => key_events.onKeyUp.call(cm, e));
        events.on(inp, 'keydown', operations.operation(cm, key_events.onKeyDown));
        events.on(inp, 'keypress', operations.operation(cm, key_events.onKeyPress));
        events.on(inp, 'focus', e => focuses.onFocus(cm, e));
        events.on(inp, 'blur', e => focuses.onBlur(cm, e));
    }
    let initHooks = [];
    CodeMirror.defineInitHook = f => initHooks.push(f);

    return CodeMirror;
});
define('skylark-codemirror/primitives/input/indent',[
    '../line/highlight',
    '../line/pos',
    '../line/utils_line',
    '../model/changes',
    '../model/selection',
    '../model/selection_updates',
    '../util/misc'
], function (a, b, c, d, e, f, g) {
    'use strict';
    function indentLine(cm, n, how, aggressive) {
        let doc = cm.doc, state;
        if (how == null)
            how = 'add';
        if (how == 'smart') {
            if (!doc.mode.indent)
                how = 'prev';
            else
                state = a.getContextBefore(cm, n).state;
        }
        let tabSize = cm.options.tabSize;
        let line = c.getLine(doc, n), curSpace = g.countColumn(line.text, null, tabSize);
        if (line.stateAfter)
            line.stateAfter = null;
        let curSpaceString = line.text.match(/^\s*/)[0], indentation;
        if (!aggressive && !/\S/.test(line.text)) {
            indentation = 0;
            how = 'not';
        } else if (how == 'smart') {
            indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
            if (indentation == g.Pass || indentation > 150) {
                if (!aggressive)
                    return;
                how = 'prev';
            }
        }
        if (how == 'prev') {
            if (n > doc.first)
                indentation = g.countColumn(c.getLine(doc, n - 1).text, null, tabSize);
            else
                indentation = 0;
        } else if (how == 'add') {
            indentation = curSpace + cm.options.indentUnit;
        } else if (how == 'subtract') {
            indentation = curSpace - cm.options.indentUnit;
        } else if (typeof how == 'number') {
            indentation = curSpace + how;
        }
        indentation = Math.max(0, indentation);
        let indentString = '', pos = 0;
        if (cm.options.indentWithTabs)
            for (let i = Math.floor(indentation / tabSize); i; --i) {
                pos += tabSize;
                indentString += '\t';
            }
        if (pos < indentation)
            indentString += g.spaceStr(indentation - pos);
        if (indentString != curSpaceString) {
            d.replaceRange(doc, indentString, b.Pos(n, 0), b.Pos(n, curSpaceString.length), '+input');
            line.stateAfter = null;
            return true;
        } else {
            for (let i = 0; i < doc.sel.ranges.length; i++) {
                let range = doc.sel.ranges[i];
                if (range.head.line == n && range.head.ch < curSpaceString.length) {
                    let pos = b.Pos(n, curSpaceString.length);
                    f.replaceOneSelection(doc, i, new e.Range(pos, pos));
                    break;
                }
            }
        }
    }
    return { indentLine: indentLine };
});
define('skylark-codemirror/primitives/input/input',[
    '../display/operations',
    '../display/scrolling',
    '../line/pos',
    '../line/utils_line',
    '../model/changes',
    '../util/browser',
    '../util/dom',
    '../util/misc',
    '../util/operation_group',
    '../util/feature_detection',
    './indent'
], function (operations, scrolling, line_pos, utils_line, changes, browser, dom, misc, operation_group, feature_detection, indent) {
    'use strict';
    let lastCopied = null;
    function setLastCopied(newLastCopied) {
        lastCopied = newLastCopied;
    }
    function applyTextInput(cm, inserted, deleted, sel, origin) {
        let doc = cm.doc;
        cm.display.shift = false;
        if (!sel)
            sel = doc.sel;
        let recent = +new Date() - 200;
        let paste = origin == 'paste' || cm.state.pasteIncoming > recent;
        let textLines = feature_detection.splitLinesAuto(inserted), multiPaste = null;
        if (paste && sel.ranges.length > 1) {
            if (lastCopied && lastCopied.text.join('\n') == inserted) {
                if (sel.ranges.length % lastCopied.text.length == 0) {
                    multiPaste = [];
                    for (let i = 0; i < lastCopied.text.length; i++)
                        multiPaste.push(doc.splitLines(lastCopied.text[i]));
                }
            } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
                multiPaste = misc.map(textLines, l => [l]);
            }
        }
        let updateInput = cm.curOp.updateInput;
        for (let i = sel.ranges.length - 1; i >= 0; i--) {
            let range = sel.ranges[i];
            let from = range.from(), to = range.to();
            if (range.empty()) {
                if (deleted && deleted > 0)
                    from = line_pos.Pos(from.line, from.ch - deleted);
                else if (cm.state.overwrite && !paste)
                    to = line_pos.Pos(to.line, Math.min(utils_line.getLine(doc, to.line).text.length, to.ch + misc.lst(textLines).length));
                else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join('\n') == inserted)
                    from = to = line_pos.Pos(from.line, 0);
            }
            let changeEvent = {
                from: from,
                to: to,
                text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
                origin: origin || (paste ? 'paste' : cm.state.cutIncoming > recent ? 'cut' : '+input')
            };
            changes.makeChange(cm.doc, changeEvent);
            operation_group.signalLater(cm, 'inputRead', cm, changeEvent);
        }
        if (inserted && !paste)
            triggerElectric(cm, inserted);
        scrolling.ensureCursorVisible(cm);
        if (cm.curOp.updateInput < 2)
            cm.curOp.updateInput = updateInput;
        cm.curOp.typing = true;
        cm.state.pasteIncoming = cm.state.cutIncoming = -1;
    }
    function handlePaste(e, cm) {
        let pasted = e.clipboardData && e.clipboardData.getData('Text');
        if (pasted) {
            e.preventDefault();
            if (!cm.isReadOnly() && !cm.options.disableInput)
                operations.runInOp(cm, () => applyTextInput(cm, pasted, 0, null, 'paste'));
            return true;
        }
    }
    function triggerElectric(cm, inserted) {
        if (!cm.options.electricChars || !cm.options.smartIndent)
            return;
        let sel = cm.doc.sel;
        for (let i = sel.ranges.length - 1; i >= 0; i--) {
            let range = sel.ranges[i];
            if (range.head.ch > 100 || i && sel.ranges[i - 1].head.line == range.head.line)
                continue;
            let mode = cm.getModeAt(range.head);
            let indented = false;
            if (mode.electricChars) {
                for (let j = 0; j < mode.electricChars.length; j++)
                    if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                        indented = indent.indentLine(cm, range.head.line, 'smart');
                        break;
                    }
            } else if (mode.electricInput) {
                if (mode.electricInput.test(utils_line.getLine(cm.doc, range.head.line).text.slice(0, range.head.ch)))
                    indented = indent.indentLine(cm, range.head.line, 'smart');
            }
            if (indented)
                operation_group.signalLater(cm, 'electricInput', cm, range.head.line);
        }
    }
    function copyableRanges(cm) {
        let text = [], ranges = [];
        for (let i = 0; i < cm.doc.sel.ranges.length; i++) {
            let line = cm.doc.sel.ranges[i].head.line;
            let lineRange = {
                anchor: line_pos.Pos(line, 0),
                head: line_pos.Pos(line + 1, 0)
            };
            ranges.push(lineRange);
            text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return {
            text: text,
            ranges: ranges
        };
    }
    function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute('autocorrect', !!autocorrect);
        field.setAttribute('autocapitalize', !!autocapitalize);
        field.setAttribute('spellcheck', !!spellcheck);
    }
    function hiddenTextarea() {
        let te = dom.elt('textarea', null, null, 'position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none');
        let div = dom.elt('div', [te], null, 'overflow: hidden; position: relative; width: 3px; height: 0px;');
        if (browser.webkit)
            te.style.width = '1000px';
        else
            te.setAttribute('wrap', 'off');
        if (browser.ios)
            te.style.border = '1px solid black';
        disableBrowserMagic(te);
        return div;
    }
    return {
        lastCopied: lastCopied,
        setLastCopied: setLastCopied,
        applyTextInput: applyTextInput,
        handlePaste: handlePaste,
        triggerElectric: triggerElectric,
        copyableRanges: copyableRanges,
        disableBrowserMagic: disableBrowserMagic,
        hiddenTextarea: hiddenTextarea
    };
});
define('skylark-codemirror/primitives/edit/methods',[
    './deleteNearSelection',
    './commands',
    '../model/document_data',
    '../util/dom',
    '../util/event',
    '../line/highlight',
    '../input/indent',
    '../input/input',
    './key_events',
    './mouse_events',
    '../input/keymap',
    '../input/movement',
    '../display/operations',
    '../line/pos',
    '../measurement/position_measurement',
    '../model/selection',
    '../model/selection_updates',
    '../display/scrolling',
    '../line/spans',
    '../display/update_display',
    '../util/misc',
    '../util/operation_group',
    '../line/utils_line',
    '../display/view_tracking',
    '../display/highlight_worker',
    '../display/line_numbers',
    '../display/scrollbars'
], function (
    m_deleteNearSelection, 
    m_commands, 
    m_document_data, 
    dom, 
    events, 
    highlight, 
    indent, 
    m_input, 
    key_events, 
    mouse_events, 
    keymap, 
    movement, 
    operations, 
    line_pos, 
    position_measurement, 
    selection, 
    selection_updates, 
    scrolling, 
    line_spans, 
    update_display, 
    misc, 
    operation_group, 
    utils_line, 
    view_tracking,
    m_highlight_worker,
    m_line_numbers,
    m_scrollbars
) {
    'use strict';

    function findPosH(doc, pos, dir, unit, visually) {
        let oldPos = pos;
        let origDir = dir;
        let lineObj = utils_line.getLine(doc, pos.line);
        function findNextLine() {
            let l = pos.line + dir;
            if (l < doc.first || l >= doc.first + doc.size)
                return false;
            pos = new line_pos.Pos(l, pos.ch, pos.sticky);
            return lineObj = utils_line.getLine(doc, l);
        }
        function moveOnce(boundToLine) {
            let next;
            if (visually) {
                next = movement.moveVisually(doc.cm, lineObj, pos, dir);
            } else {
                next = movement.moveLogically(lineObj, pos, dir);
            }
            if (next == null) {
                if (!boundToLine && findNextLine())
                    pos = movement.endOfLine(visually, doc.cm, lineObj, pos.line, dir);
                else
                    return false;
            } else {
                pos = next;
            }
            return true;
        }
        if (unit == 'char') {
            moveOnce();
        } else if (unit == 'column') {
            moveOnce(true);
        } else if (unit == 'word' || unit == 'group') {
            let sawType = null, group = unit == 'group';
            let helper = doc.cm && doc.cm.getHelper(pos, 'wordChars');
            for (let first = true;; first = false) {
                if (dir < 0 && !moveOnce(!first))
                    break;
                let cur = lineObj.text.charAt(pos.ch) || '\n';
                let type = misc.isWordChar(cur, helper) ? 'w' : group && cur == '\n' ? 'n' : !group || /\s/.test(cur) ? null : 'p';
                if (group && !first && !type)
                    type = 's';
                if (sawType && sawType != type) {
                    if (dir < 0) {
                        dir = 1;
                        moveOnce();
                        pos.sticky = 'after';
                    }
                    break;
                }
                if (type)
                    sawType = type;
                if (dir > 0 && !moveOnce(!first))
                    break;
            }
        }
        let result = selection_updates.skipAtomic(doc, pos, oldPos, origDir, true);
        if (line_pos.equalCursorPos(oldPos, result))
            result.hitSide = true;
        return result;
    }
    function findPosV(cm, pos, dir, unit) {
        let doc = cm.doc, x = pos.left, y;
        if (unit == 'page') {
            let pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            let moveAmount = Math.max(pageSize - 0.5 * position_measurement.textHeight(cm.display), 3);
            y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else if (unit == 'line') {
            y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
        }
        let target;
        for (;;) {
            target = position_measurement.coordsChar(cm, x, y);
            if (!target.outside)
                break;
            if (dir < 0 ? y <= 0 : y >= doc.height) {
                target.hitSide = true;
                break;
            }
            y += dir * 5;
        }
        return target;
    }
        
    return function (CodeMirror) {
        let optionHandlers = CodeMirror.optionHandlers;
        let helpers = CodeMirror.helpers = {};
        CodeMirror.prototype = {
            constructor: CodeMirror,
            focus: function () {
                window.focus();
                this.display.input.focus();
            },
            setOption: function (option, value) {
                let options = this.options, old = options[option];
                if (options[option] == value && option != 'mode')
                    return;
                options[option] = value;
                if (optionHandlers.hasOwnProperty(option))
                    operations.operation(this, optionHandlers[option])(this, value, old);
                events.signal(this, 'optionChange', this, option);
            },
            getOption: function (option) {
                return this.options[option];
            },
            getDoc: function () {
                return this.doc;
            },
            addKeyMap: function (map, bottom) {
                this.state.keyMaps[bottom ? 'push' : 'unshift'](keymap.getKeyMap(map));
            },
            removeKeyMap: function (map) {
                let maps = this.state.keyMaps;
                for (let i = 0; i < maps.length; ++i)
                    if (maps[i] == map || maps[i].name == map) {
                        maps.splice(i, 1);
                        return true;
                    }
            },
            addOverlay: operations.methodOp(function (spec, options) {
                let mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
                if (mode.startState)
                    throw new Error('Overlays may not be stateful.');
                misc.insertSorted(this.state.overlays, {
                    mode: mode,
                    modeSpec: spec,
                    opaque: options && options.opaque,
                    priority: options && options.priority || 0
                }, overlay => overlay.priority);
                this.state.modeGen++;
                view_tracking.regChange(this);
            }),
            removeOverlay: operations.methodOp(function (spec) {
                let overlays = this.state.overlays;
                for (let i = 0; i < overlays.length; ++i) {
                    let cur = overlays[i].modeSpec;
                    if (cur == spec || typeof spec == 'string' && cur.name == spec) {
                        overlays.splice(i, 1);
                        this.state.modeGen++;
                        view_tracking.regChange(this);
                        return;
                    }
                }
            }),
            indentLine: operations.methodOp(function (n, dir, aggressive) {
                if (typeof dir != 'string' && typeof dir != 'number') {
                    if (dir == null)
                        dir = this.options.smartIndent ? 'smart' : 'prev';
                    else
                        dir = dir ? 'add' : 'subtract';
                }
                if (utils_line.isLine(this.doc, n))
                    indent.indentLine(this, n, dir, aggressive);
            }),
            indentSelection: operations.methodOp(function (how) {
                let ranges = this.doc.sel.ranges, end = -1;
                for (let i = 0; i < ranges.length; i++) {
                    let range = ranges[i];
                    if (!range.empty()) {
                        let from = range.from(), to = range.to();
                        let start = Math.max(end, from.line);
                        end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                        for (let j = start; j < end; ++j)
                            indent.indentLine(this, j, how);
                        let newRanges = this.doc.sel.ranges;
                        if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
                            selection_updates.replaceOneSelection(this.doc, i, new selection.Range(from, newRanges[i].to()), misc.sel_dontScroll);
                    } else if (range.head.line > end) {
                        indent.indentLine(this, range.head.line, how, true);
                        end = range.head.line;
                        if (i == this.doc.sel.primIndex)
                            scrolling.ensureCursorVisible(this);
                    }
                }
            }),
            getTokenAt: function (pos, precise) {
                return highlight.takeToken(this, pos, precise);
            },
            getLineTokens: function (line, precise) {
                return highlight.takeToken(this, line_pos.Pos(line), precise, true);
            },
            getTokenTypeAt: function (pos) {
                pos = line_pos.clipPos(this.doc, pos);
                let styles = highlight.getLineStyles(this, utils_line.getLine(this.doc, pos.line));
                let before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
                let type;
                if (ch == 0)
                    type = styles[2];
                else
                    for (;;) {
                        let mid = before + after >> 1;
                        if ((mid ? styles[mid * 2 - 1] : 0) >= ch)
                            after = mid;
                        else if (styles[mid * 2 + 1] < ch)
                            before = mid + 1;
                        else {
                            type = styles[mid * 2 + 2];
                            break;
                        }
                    }
                let cut = type ? type.indexOf('overlay ') : -1;
                return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
            },
            getModeAt: function (pos) {
                let mode = this.doc.mode;
                if (!mode.innerMode)
                    return mode;
                return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
            },
            getHelper: function (pos, type) {
                return this.getHelpers(pos, type)[0];
            },
            getHelpers: function (pos, type) {
                let found = [];
                if (!helpers.hasOwnProperty(type))
                    return found;
                let help = helpers[type], mode = this.getModeAt(pos);
                if (typeof mode[type] == 'string') {
                    if (help[mode[type]])
                        found.push(help[mode[type]]);
                } else if (mode[type]) {
                    for (let i = 0; i < mode[type].length; i++) {
                        let val = help[mode[type][i]];
                        if (val)
                            found.push(val);
                    }
                } else if (mode.helperType && help[mode.helperType]) {
                    found.push(help[mode.helperType]);
                } else if (help[mode.name]) {
                    found.push(help[mode.name]);
                }
                for (let i = 0; i < help._global.length; i++) {
                    let cur = help._global[i];
                    if (cur.pred(mode, this) && misc.indexOf(found, cur.val) == -1)
                        found.push(cur.val);
                }
                return found;
            },
            getStateAfter: function (line, precise) {
                let doc = this.doc;
                line = line_pos.clipLine(doc, line == null ? doc.first + doc.size - 1 : line);
                return highlight.getContextBefore(this, line + 1, precise).state;
            },
            cursorCoords: function (start, mode) {
                let pos, range = this.doc.sel.primary();
                if (start == null)
                    pos = range.head;
                else if (typeof start == 'object')
                    pos = line_pos.clipPos(this.doc, start);
                else
                    pos = start ? range.from() : range.to();
                return position_measurement.cursorCoords(this, pos, mode || 'page');
            },
            charCoords: function (pos, mode) {
                return position_measurement.charCoords(this, line_pos.clipPos(this.doc, pos), mode || 'page');
            },
            coordsChar: function (coords, mode) {
                coords = position_measurement.fromCoordSystem(this, coords, mode || 'page');
                return position_measurement.coordsChar(this, coords.left, coords.top);
            },
            lineAtHeight: function (height, mode) {
                height = position_measurement.fromCoordSystem(this, {
                    top: height,
                    left: 0
                }, mode || 'page').top;
                return utils_line.lineAtHeight(this.doc, height + this.display.viewOffset);
            },
            heightAtLine: function (line, mode, includeWidgets) {
                let end = false, lineObj;
                if (typeof line == 'number') {
                    let last = this.doc.first + this.doc.size - 1;
                    if (line < this.doc.first)
                        line = this.doc.first;
                    else if (line > last) {
                        line = last;
                        end = true;
                    }
                    lineObj = utils_line.getLine(this.doc, line);
                } else {
                    lineObj = line;
                }
                return position_measurement.intoCoordSystem(this, lineObj, {
                    top: 0,
                    left: 0
                }, mode || 'page', includeWidgets || end).top + (end ? this.doc.height - line_spans.heightAtLine(lineObj) : 0);
            },
            defaultTextHeight: function () {
                return position_measurement.textHeight(this.display);
            },
            defaultCharWidth: function () {
                return position_measurement.charWidth(this.display);
            },
            getViewport: function () {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function (pos, node, scroll, vert, horiz) {
                let display = this.display;
                pos = position_measurement.cursorCoords(this, line_pos.clipPos(this.doc, pos));
                let top = pos.bottom, left = pos.left;
                node.style.position = 'absolute';
                node.setAttribute('cm-ignore-events', 'true');
                this.display.input.setUneditable(node);
                display.sizer.appendChild(node);
                if (vert == 'over') {
                    top = pos.top;
                } else if (vert == 'above' || vert == 'near') {
                    let vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                    if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
                        top = pos.top - node.offsetHeight;
                    else if (pos.bottom + node.offsetHeight <= vspace)
                        top = pos.bottom;
                    if (left + node.offsetWidth > hspace)
                        left = hspace - node.offsetWidth;
                }
                node.style.top = top + 'px';
                node.style.left = node.style.right = '';
                if (horiz == 'right') {
                    left = display.sizer.clientWidth - node.offsetWidth;
                    node.style.right = '0px';
                } else {
                    if (horiz == 'left')
                        left = 0;
                    else if (horiz == 'middle')
                        left = (display.sizer.clientWidth - node.offsetWidth) / 2;
                    node.style.left = left + 'px';
                }
                if (scroll)
                    scrolling.scrollIntoView(this, {
                        left,
                        top,
                        right: left + node.offsetWidth,
                        bottom: top + node.offsetHeight
                    });
            },
            triggerOnKeyDown: operations.methodOp(key_events.onKeyDown),
            triggerOnKeyPress: operations.methodOp(key_events.onKeyPress),
            triggerOnKeyUp: key_events.onKeyUp,
            triggerOnMouseDown: operations.methodOp(mouse_events.onMouseDown),
            execCommand: function (cmd) {
                if (m_commands.commands.hasOwnProperty(cmd))
                    return m_commands.commands[cmd].call(null, this);
            },
            triggerElectric: operations.methodOp(function (text) {
                m_input.triggerElectric(this, text);
            }),
            findPosH: function (from, amount, unit, visually) {
                let dir = 1;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                let cur = line_pos.clipPos(this.doc, from);
                for (let i = 0; i < amount; ++i) {
                    cur = findPosH(this.doc, cur, dir, unit, visually);
                    if (cur.hitSide)
                        break;
                }
                return cur;
            },
            moveH: operations.methodOp(function (dir, unit) {
                this.extendSelectionsBy(range => {
                    if (this.display.shift || this.doc.extend || range.empty())
                        return findPosH(this.doc, range.head, dir, unit, this.options.rtlMoveVisually);
                    else
                        return dir < 0 ? range.from() : range.to();
                }, misc.sel_move);
            }),
            deleteH: operations.methodOp(function (dir, unit) {
                let sel = this.doc.sel, doc = this.doc;
                if (sel.somethingSelected())
                    doc.replaceSelection('', null, '+delete');
                else
                    m_deleteNearSelection.deleteNearSelection(this, range => {
                        let other = findPosH(doc, range.head, dir, unit, false);
                        return dir < 0 ? {
                            from: other,
                            to: range.head
                        } : {
                            from: range.head,
                            to: other
                        };
                    });
            }),
            findPosV: function (from, amount, unit, goalColumn) {
                let dir = 1, x = goalColumn;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                let cur = line_pos.clipPos(this.doc, from);
                for (let i = 0; i < amount; ++i) {
                    let coords = position_measurement.cursorCoords(this, cur, 'div');
                    if (x == null)
                        x = coords.left;
                    else
                        coords.left = x;
                    cur = findPosV(this, coords, dir, unit);
                    if (cur.hitSide)
                        break;
                }
                return cur;
            },
            moveV: operations.methodOp(function (dir, unit) {
                let doc = this.doc, goals = [];
                let collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
                doc.extendSelectionsBy(range => {
                    if (collapse)
                        return dir < 0 ? range.from() : range.to();
                    let headPos = position_measurement.cursorCoords(this, range.head, 'div');
                    if (range.goalColumn != null)
                        headPos.left = range.goalColumn;
                    goals.push(headPos.left);
                    let pos = findPosV(this, headPos, dir, unit);
                    if (unit == 'page' && range == doc.sel.primary())
                        scrolling.addToScrollTop(this, position_measurement.charCoords(this, pos, 'div').top - headPos.top);
                    return pos;
                }, misc.sel_move);
                if (goals.length)
                    for (let i = 0; i < doc.sel.ranges.length; i++)
                        doc.sel.ranges[i].goalColumn = goals[i];
            }),
            findWordAt: function (pos) {
                let doc = this.doc, line = utils_line.getLine(doc, pos.line).text;
                let start = pos.ch, end = pos.ch;
                if (line) {
                    let helper = this.getHelper(pos, 'wordChars');
                    if ((pos.sticky == 'before' || end == line.length) && start)
                        --start;
                    else
                        ++end;
                    let startChar = line.charAt(start);
                    let check = misc.isWordChar(startChar, helper) ? ch => misc.isWordChar(ch, helper) : /\s/.test(startChar) ? ch => /\s/.test(ch) : ch => !/\s/.test(ch) && !misc.isWordChar(ch);
                    while (start > 0 && check(line.charAt(start - 1)))
                        --start;
                    while (end < line.length && check(line.charAt(end)))
                        ++end;
                }
                return new selection.Range(line_pos.Pos(pos.line, start), line_pos.Pos(pos.line, end));
            },
            toggleOverwrite: function (value) {
                if (value != null && value == this.state.overwrite)
                    return;
                if (this.state.overwrite = !this.state.overwrite)
                    dom.addClass(this.display.cursorDiv, 'CodeMirror-overwrite');
                else
                    dom.rmClass(this.display.cursorDiv, 'CodeMirror-overwrite');
                events.signal(this, 'overwriteToggle', this, this.state.overwrite);
            },
            hasFocus: function () {
                return this.display.input.getField() == dom.activeElt();
            },
            isReadOnly: function () {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: operations.methodOp(function (x, y) {
                scrolling.scrollToCoords(this, x, y);
            }),
            getScrollInfo: function () {
                let scroller = this.display.scroller;
                return {
                    left: scroller.scrollLeft,
                    top: scroller.scrollTop,
                    height: scroller.scrollHeight - position_measurement.scrollGap(this) - this.display.barHeight,
                    width: scroller.scrollWidth - position_measurement.scrollGap(this) - this.display.barWidth,
                    clientHeight: position_measurement.displayHeight(this),
                    clientWidth: position_measurement.displayWidth(this)
                };
            },
            scrollIntoView: operations.methodOp(function (range, margin) {
                if (range == null) {
                    range = {
                        from: this.doc.sel.primary().head,
                        to: null
                    };
                    if (margin == null)
                        margin = this.options.cursorScrollMargin;
                } else if (typeof range == 'number') {
                    range = {
                        from: line_pos.Pos(range, 0),
                        to: null
                    };
                } else if (range.from == null) {
                    range = {
                        from: range,
                        to: null
                    };
                }
                if (!range.to)
                    range.to = range.from;
                range.margin = margin || 0;
                if (range.from.line != null) {
                    scrolling.scrollToRange(this, range);
                } else {
                    scrolling.scrollToCoordsRange(this, range.from, range.to, range.margin);
                }
            }),
            setSize: operations.methodOp(function (width, height) {
                let interpret = val => typeof val == 'number' || /^\d+$/.test(String(val)) ? val + 'px' : val;
                if (width != null)
                    this.display.wrapper.style.width = interpret(width);
                if (height != null)
                    this.display.wrapper.style.height = interpret(height);
                if (this.options.lineWrapping)
                    position_measurement.clearLineMeasurementCache(this);
                let lineNo = this.display.viewFrom;
                this.doc.iter(lineNo, this.display.viewTo, line => {
                    if (line.widgets)
                        for (let i = 0; i < line.widgets.length; i++)
                            if (line.widgets[i].noHScroll) {
                                view_tracking.regLineChange(this, lineNo, 'widget');
                                break;
                            }
                    ++lineNo;
                });
                this.curOp.forceUpdate = true;
                events.signal(this, 'refresh', this);
            }),
            operation: function (f) {
                return operations.runInOp(this, f);
            },
            startOperation: function () {
                return operations.startOperation(this);
            },
            endOperation: function () {
                return operations.endOperation(this);
            },
            refresh: operations.methodOp(function () {
                let oldHeight = this.display.cachedTextHeight;
                view_tracking.regChange(this);
                this.curOp.forceUpdate = true;
                position_measurement.clearCaches(this);
                scrolling.scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
                update_display.updateGutterSpace(this);
                if (oldHeight == null || Math.abs(oldHeight - position_measurement.textHeight(this.display)) > 0.5)
                    position_measurement.estimateLineHeights(this);
                events.signal(this, 'refresh', this);
            }),
            swapDoc: operations.methodOp(function (doc) {
                let old = this.doc;
                old.cm = null;
                m_document_data.attachDoc(this, doc);
                position_measurement.clearCaches(this);
                this.display.input.reset();
                scrolling.scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
                this.curOp.forceScroll = true;
                operation_group.signalLater(this, 'swapDoc', this, old);
                return old;
            }),
            phrase: function (phraseText) {
                let phrases = this.options.phrases;
                return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
            },
            getInputField: function () {
                return this.display.input.getField();
            },
            getWrapperElement: function () {
                return this.display.wrapper;
            },
            getScrollerElement: function () {
                return this.display.scroller;
            },
            getGutterElement: function () {
                return this.display.gutters;
            },

            startWorker : function(time) {
                return m_highlight_worker.startWorker(this,time);
            },

            maybeUpdateLineNumberWidth : function() {
                return m_line_numbers.maybeUpdateLineNumberWidth(this);
            },

            measureForScrollbars : function() {
                return m_scrollbars.measureForScrollbars(this);
            },

            updateScrollbars : function(measure) {
                return m_scrollbars.updateScrollbars(this,measure);
            }
        };
        events.eventMixin(CodeMirror);
        CodeMirror.registerHelper = function (type, name, value) {
            if (!helpers.hasOwnProperty(type))
                helpers[type] = CodeMirror[type] = { _global: [] };
            helpers[type][name] = value;
        };
        CodeMirror.registerGlobalHelper = function (type, name, predicate, value) {
            CodeMirror.registerHelper(type, name, value);
            helpers[type]._global.push({
                pred: predicate,
                val: value
            });
        };
    };

});
define('skylark-codemirror/primitives/input/ContentEditableInput',[
    '../display/operations',
    '../display/selection',
    '../display/view_tracking',
    './input',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../model/changes',
    '../model/selection',
    '../model/selection_updates',
    '../util/bidi',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (operations, display_selection, view_tracking, inputs, line_pos, utils_line, position_measurement, changes, selection, selection_updates, bidi, browser, dom, events, misc) {
    'use strict';
    class ContentEditableInput {
        constructor(cm) {
            this.cm = cm;
            this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
            this.polling = new misc.Delayed();
            this.composing = null;
            this.gracePeriod = false;
            this.readDOMTimeout = null;
        }
        init(display) {
            let input = this, cm = input.cm;
            let div = input.div = display.lineDiv;
            inputs.disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
            events.on(div, 'paste', e => {
                if (events.signalDOMEvent(cm, e) || inputs.handlePaste(e, cm))
                    return;
                if (browser.ie_version <= 11)
                    setTimeout(operations.operation(cm, () => this.updateFromDOM()), 20);
            });
            events.on(div, 'compositionstart', e => {
                this.composing = {
                    data: e.data,
                    done: false
                };
            });
            events.on(div, 'compositionupdate', e => {
                if (!this.composing)
                    this.composing = {
                        data: e.data,
                        done: false
                    };
            });
            events.on(div, 'compositionend', e => {
                if (this.composing) {
                    if (e.data != this.composing.data)
                        this.readFromDOMSoon();
                    this.composing.done = true;
                }
            });
            events.on(div, 'touchstart', () => input.forceCompositionEnd());
            events.on(div, 'input', () => {
                if (!this.composing)
                    this.readFromDOMSoon();
            });
            function onCopyCut(e) {
                if (events.signalDOMEvent(cm, e))
                    return;
                if (cm.somethingSelected()) {
                    inputs.setLastCopied({
                        lineWise: false,
                        text: cm.getSelections()
                    });
                    if (e.type == 'cut')
                        cm.replaceSelection('', null, 'cut');
                } else if (!cm.options.lineWiseCopyCut) {
                    return;
                } else {
                    let ranges = inputs.copyableRanges(cm);
                    inputs.setLastCopied({
                        lineWise: true,
                        text: ranges.text
                    });
                    if (e.type == 'cut') {
                        cm.operation(() => {
                            cm.setSelections(ranges.ranges, 0, misc.sel_dontScroll);
                            cm.replaceSelection('', null, 'cut');
                        });
                    }
                }
                if (e.clipboardData) {
                    e.clipboardData.clearData();
                    let content = inputs.lastCopied.text.join('\n');
                    e.clipboardData.setData('Text', content);
                    if (e.clipboardData.getData('Text') == content) {
                        e.preventDefault();
                        return;
                    }
                }
                let kludge = inputs.hiddenTextarea(), te = kludge.firstChild;
                cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
                te.value = inputs.lastCopied.text.join('\n');
                let hadFocus = document.activeElement;
                dom.selectInput(te);
                setTimeout(() => {
                    cm.display.lineSpace.removeChild(kludge);
                    hadFocus.focus();
                    if (hadFocus == div)
                        input.showPrimarySelection();
                }, 50);
            }
            events.on(div, 'copy', onCopyCut);
            events.on(div, 'cut', onCopyCut);
        }
        prepareSelection() {
            let result = display_selection.prepareSelection(this.cm, false);
            result.focus = this.cm.state.focused;
            return result;
        }
        showSelection(info, takeFocus) {
            if (!info || !this.cm.display.view.length)
                return;
            if (info.focus || takeFocus)
                this.showPrimarySelection();
            this.showMultipleSelections(info);
        }
        getSelection() {
            return this.cm.display.wrapper.ownerDocument.getSelection();
        }
        showPrimarySelection() {
            let sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
            let from = prim.from(), to = prim.to();
            if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
                sel.removeAllRanges();
                return;
            }
            let curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
            let curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
            if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && line_pos.cmp(line_pos.minPos(curAnchor, curFocus), from) == 0 && line_pos.cmp(line_pos.maxPos(curAnchor, curFocus), to) == 0)
                return;
            let view = cm.display.view;
            let start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || {
                node: view[0].measure.map[2],
                offset: 0
            };
            let end = to.line < cm.display.viewTo && posToDOM(cm, to);
            if (!end) {
                let measure = view[view.length - 1].measure;
                let map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
                end = {
                    node: map[map.length - 1],
                    offset: map[map.length - 2] - map[map.length - 3]
                };
            }
            if (!start || !end) {
                sel.removeAllRanges();
                return;
            }
            let old = sel.rangeCount && sel.getRangeAt(0), rng;
            try {
                rng = dom.range(start.node, start.offset, end.offset, end.node);
            } catch (e) {
            }
            if (rng) {
                if (!browser.gecko && cm.state.focused) {
                    sel.collapse(start.node, start.offset);
                    if (!rng.collapsed) {
                        sel.removeAllRanges();
                        sel.addRange(rng);
                    }
                } else {
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }
                if (old && sel.anchorNode == null)
                    sel.addRange(old);
                else if (browser.gecko)
                    this.startGracePeriod();
            }
            this.rememberSelection();
        }
        startGracePeriod() {
            clearTimeout(this.gracePeriod);
            this.gracePeriod = setTimeout(() => {
                this.gracePeriod = false;
                if (this.selectionChanged())
                    this.cm.operation(() => this.cm.curOp.selectionChanged = true);
            }, 20);
        }
        showMultipleSelections(info) {
            dom.removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
            dom.removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
        }
        rememberSelection() {
            let sel = this.getSelection();
            this.lastAnchorNode = sel.anchorNode;
            this.lastAnchorOffset = sel.anchorOffset;
            this.lastFocusNode = sel.focusNode;
            this.lastFocusOffset = sel.focusOffset;
        }
        selectionInEditor() {
            let sel = this.getSelection();
            if (!sel.rangeCount)
                return false;
            let node = sel.getRangeAt(0).commonAncestorContainer;
            return dom.contains(this.div, node);
        }
        focus() {
            if (this.cm.options.readOnly != 'nocursor') {
                if (!this.selectionInEditor())
                    this.showSelection(this.prepareSelection(), true);
                this.div.focus();
            }
        }
        blur() {
            this.div.blur();
        }
        getField() {
            return this.div;
        }
        supportsTouch() {
            return true;
        }
        receivedFocus() {
            let input = this;
            if (this.selectionInEditor())
                this.pollSelection();
            else
                operations.runInOp(this.cm, () => input.cm.curOp.selectionChanged = true);
            function poll() {
                if (input.cm.state.focused) {
                    input.pollSelection();
                    input.polling.set(input.cm.options.pollInterval, poll);
                }
            }
            this.polling.set(this.cm.options.pollInterval, poll);
        }
        selectionChanged() {
            let sel = this.getSelection();
            return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
        }
        pollSelection() {
            if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged())
                return;
            let sel = this.getSelection(), cm = this.cm;
            if (browser.android && browser.chrome && this.cm.options.gutters.length && isInGutter(sel.anchorNode)) {
                this.cm.triggerOnKeyDown({
                    type: 'keydown',
                    keyCode: 8,
                    preventDefault: Math.abs
                });
                this.blur();
                this.focus();
                return;
            }
            if (this.composing)
                return;
            this.rememberSelection();
            let anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
            let head = domToPos(cm, sel.focusNode, sel.focusOffset);
            if (anchor && head)
                operations.runInOp(cm, () => {
                    selection_updates.setSelection(cm.doc, selection.simpleSelection(anchor, head), misc.sel_dontScroll);
                    if (anchor.bad || head.bad)
                        cm.curOp.selectionChanged = true;
                });
        }
        pollContent() {
            if (this.readDOMTimeout != null) {
                clearTimeout(this.readDOMTimeout);
                this.readDOMTimeout = null;
            }
            let cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
            let from = sel.from(), to = sel.to();
            if (from.ch == 0 && from.line > cm.firstLine())
                from = line_pos.Pos(from.line - 1, utils_line.getLine(cm.doc, from.line - 1).length);
            if (to.ch == utils_line.getLine(cm.doc, to.line).text.length && to.line < cm.lastLine())
                to = line_pos.Pos(to.line + 1, 0);
            if (from.line < display.viewFrom || to.line > display.viewTo - 1)
                return false;
            let fromIndex, fromLine, fromNode;
            if (from.line == display.viewFrom || (fromIndex = position_measurement.findViewIndex(cm, from.line)) == 0) {
                fromLine = utils_line.lineNo(display.view[0].line);
                fromNode = display.view[0].node;
            } else {
                fromLine = utils_line.lineNo(display.view[fromIndex].line);
                fromNode = display.view[fromIndex - 1].node.nextSibling;
            }
            let toIndex = position_measurement.findViewIndex(cm, to.line);
            let toLine, toNode;
            if (toIndex == display.view.length - 1) {
                toLine = display.viewTo - 1;
                toNode = display.lineDiv.lastChild;
            } else {
                toLine = utils_line.lineNo(display.view[toIndex + 1].line) - 1;
                toNode = display.view[toIndex + 1].node.previousSibling;
            }
            if (!fromNode)
                return false;
            let newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
            let oldText = utils_line.getBetween(cm.doc, line_pos.Pos(fromLine, 0), line_pos.Pos(toLine, utils_line.getLine(cm.doc, toLine).text.length));
            while (newText.length > 1 && oldText.length > 1) {
                if (misc.lst(newText) == misc.lst(oldText)) {
                    newText.pop();
                    oldText.pop();
                    toLine--;
                } else if (newText[0] == oldText[0]) {
                    newText.shift();
                    oldText.shift();
                    fromLine++;
                } else
                    break;
            }
            let cutFront = 0, cutEnd = 0;
            let newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
            while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
                ++cutFront;
            let newBot = misc.lst(newText), oldBot = misc.lst(oldText);
            let maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0), oldBot.length - (oldText.length == 1 ? cutFront : 0));
            while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
                ++cutEnd;
            if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
                while (cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
                    cutFront--;
                    cutEnd++;
                }
            }
            newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, '');
            newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, '');
            let chFrom = line_pos.Pos(fromLine, cutFront);
            let chTo = line_pos.Pos(toLine, oldText.length ? misc.lst(oldText).length - cutEnd : 0);
            if (newText.length > 1 || newText[0] || line_pos.cmp(chFrom, chTo)) {
                changes.replaceRange(cm.doc, newText, chFrom, chTo, '+input');
                return true;
            }
        }
        ensurePolled() {
            this.forceCompositionEnd();
        }
        reset() {
            this.forceCompositionEnd();
        }
        forceCompositionEnd() {
            if (!this.composing)
                return;
            clearTimeout(this.readDOMTimeout);
            this.composing = null;
            this.updateFromDOM();
            this.div.blur();
            this.div.focus();
        }
        readFromDOMSoon() {
            if (this.readDOMTimeout != null)
                return;
            this.readDOMTimeout = setTimeout(() => {
                this.readDOMTimeout = null;
                if (this.composing) {
                    if (this.composing.done)
                        this.composing = null;
                    else
                        return;
                }
                this.updateFromDOM();
            }, 80);
        }
        updateFromDOM() {
            if (this.cm.isReadOnly() || !this.pollContent())
                operations.runInOp(this.cm, () => view_tracking.regChange(this.cm));
        }
        setUneditable(node) {
            node.contentEditable = 'false';
        }
        onKeyPress(e) {
            if (e.charCode == 0 || this.composing)
                return;
            e.preventDefault();
            if (!this.cm.isReadOnly())
                operations.operation(this.cm, inputs.applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
        }
        readOnlyChanged(val) {
            this.div.contentEditable = String(val != 'nocursor');
        }
        onContextMenu() {
        }
        resetPosition() {
        }
    };
    ContentEditableInput.prototype.needsContentAttribute = true;
    function posToDOM(cm, pos) {
        let view = position_measurement.findViewForLine(cm, pos.line);
        if (!view || view.hidden)
            return null;
        let line = utils_line.getLine(cm.doc, pos.line);
        let info = position_measurement.mapFromLineView(view, line, pos.line);
        let order = bidi.getOrder(line, cm.doc.direction), side = 'left';
        if (order) {
            let partPos = bidi.getBidiPartAt(order, pos.ch);
            side = partPos % 2 ? 'right' : 'left';
        }
        let result = position_measurement.nodeAndOffsetInLineMap(info.map, pos.ch, side);
        result.offset = result.collapse == 'right' ? result.end : result.start;
        return result;
    }
    function isInGutter(node) {
        for (let scan = node; scan; scan = scan.parentNode)
            if (/CodeMirror-gutter-wrapper/.test(scan.className))
                return true;
        return false;
    }
    function badPos(pos, bad) {
        if (bad)
            pos.bad = true;
        return pos;
    }
    function domTextBetween(cm, from, to, fromLine, toLine) {
        let text = '', closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
        function recognizeMarker(id) {
            return marker => marker.id == id;
        }
        function close() {
            if (closing) {
                text += lineSep;
                if (extraLinebreak)
                    text += lineSep;
                closing = extraLinebreak = false;
            }
        }
        function addText(str) {
            if (str) {
                close();
                text += str;
            }
        }
        function walk(node) {
            if (node.nodeType == 1) {
                let cmText = node.getAttribute('cm-text');
                if (cmText) {
                    addText(cmText);
                    return;
                }
                let markerID = node.getAttribute('cm-marker'), range;
                if (markerID) {
                    let found = cm.findMarks(line_pos.Pos(fromLine, 0), line_pos.Pos(toLine + 1, 0), recognizeMarker(+markerID));
                    if (found.length && (range = found[0].find(0)))
                        addText(utils_line.getBetween(cm.doc, range.from, range.to).join(lineSep));
                    return;
                }
                if (node.getAttribute('contenteditable') == 'false')
                    return;
                let isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
                if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0)
                    return;
                if (isBlock)
                    close();
                for (let i = 0; i < node.childNodes.length; i++)
                    walk(node.childNodes[i]);
                if (/^(pre|p)$/i.test(node.nodeName))
                    extraLinebreak = true;
                if (isBlock)
                    closing = true;
            } else if (node.nodeType == 3) {
                addText(node.nodeValue.replace(/\u200b/g, '').replace(/\u00a0/g, ' '));
            }
        }
        for (;;) {
            walk(from);
            if (from == to)
                break;
            from = from.nextSibling;
            extraLinebreak = false;
        }
        return text;
    }
    function domToPos(cm, node, offset) {
        let lineNode;
        if (node == cm.display.lineDiv) {
            lineNode = cm.display.lineDiv.childNodes[offset];
            if (!lineNode)
                return badPos(cm.clipPos(line_pos.Pos(cm.display.viewTo - 1)), true);
            node = null;
            offset = 0;
        } else {
            for (lineNode = node;; lineNode = lineNode.parentNode) {
                if (!lineNode || lineNode == cm.display.lineDiv)
                    return null;
                if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv)
                    break;
            }
        }
        for (let i = 0; i < cm.display.view.length; i++) {
            let lineView = cm.display.view[i];
            if (lineView.node == lineNode)
                return locateNodeInLineView(lineView, node, offset);
        }
    }
    function locateNodeInLineView(lineView, node, offset) {
        let wrapper = lineView.text.firstChild, bad = false;
        if (!node || !dom.contains(wrapper, node))
            return badPos(line_pos.Pos(utils_line.lineNo(lineView.line), 0), true);
        if (node == wrapper) {
            bad = true;
            node = wrapper.childNodes[offset];
            offset = 0;
            if (!node) {
                let line = lineView.rest ? misc.lst(lineView.rest) : lineView.line;
                return badPos(line_pos.Pos(utils_line.lineNo(line), line.text.length), bad);
            }
        }
        let textNode = node.nodeType == 3 ? node : null, topNode = node;
        if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
            textNode = node.firstChild;
            if (offset)
                offset = textNode.nodeValue.length;
        }
        while (topNode.parentNode != wrapper)
            topNode = topNode.parentNode;
        let measure = lineView.measure, maps = measure.maps;
        function find(textNode, topNode, offset) {
            for (let i = -1; i < (maps ? maps.length : 0); i++) {
                let map = i < 0 ? measure.map : maps[i];
                for (let j = 0; j < map.length; j += 3) {
                    let curNode = map[j + 2];
                    if (curNode == textNode || curNode == topNode) {
                        let line = utils_line.lineNo(i < 0 ? lineView.line : lineView.rest[i]);
                        let ch = map[j] + offset;
                        if (offset < 0 || curNode != textNode)
                            ch = map[j + (offset ? 1 : 0)];
                        return line_pos.Pos(line, ch);
                    }
                }
            }
        }
        let found = find(textNode, topNode, offset);
        if (found)
            return badPos(found, bad);
        for (let after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
            found = find(after, after.firstChild, 0);
            if (found)
                return badPos(line_pos.Pos(found.line, found.ch - dist), bad);
            else
                dist += after.textContent.length;
        }
        for (let before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
            found = find(before, before.firstChild, -1);
            if (found)
                return badPos(line_pos.Pos(found.line, found.ch + dist), bad);
            else
                dist += before.textContent.length;
        }
    }

    return ContentEditableInput;
});
define('skylark-codemirror/primitives/input/TextareaInput',[
    '../display/operations',
    '../display/selection',
    './input',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc'
], function (
    operations, 
    display_selection, 
    inputs, 
    position_measurement, 
    widgets, 
    model_selection, 
    selection_updates, 
    browser, 
    dom, 
    event, 
    feature_detection, 
    misc
) {
    'use strict';
    class TextareaInput {
        constructor(cm) {
            this.cm = cm;
            this.prevInput = '';
            this.pollingFast = false;
            this.polling = new misc.Delayed();
            this.hasSelection = false;
            this.composing = null;
        }
        init(display) {
            let self = this, cm = this.cm;
            this.createField(display);
            const te = this.textarea;
            display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
            if (browser.ios)
                te.style.width = '0px';
            event.on(te, 'input', () => {
                if (browser.ie && browser.ie_version >= 9 && this.hasSelection)
                    this.hasSelection = null;
                self.poll();
            });
            event.on(te, 'paste', e => {
                if (event.signalDOMEvent(cm, e) || inputs.handlePaste(e, cm))
                    return;
                cm.state.pasteIncoming = +new Date();
                self.fastPoll();
            });
            function prepareCopyCut(e) {
                if (event.signalDOMEvent(cm, e))
                    return;
                if (cm.somethingSelected()) {
                    inputs.setLastCopied({
                        lineWise: false,
                        text: cm.getSelections()
                    });
                } else if (!cm.options.lineWiseCopyCut) {
                    return;
                } else {
                    let ranges = inputs.copyableRanges(cm);
                    inputs.setLastCopied({
                        lineWise: true,
                        text: ranges.text
                    });
                    if (e.type == 'cut') {
                        cm.setSelections(ranges.ranges, null, misc.sel_dontScroll);
                    } else {
                        self.prevInput = '';
                        te.value = ranges.text.join('\n');
                        dom.selectInput(te);
                    }
                }
                if (e.type == 'cut')
                    cm.state.cutIncoming = +new Date();
            }
            event.on(te, 'cut', prepareCopyCut);
            event.on(te, 'copy', prepareCopyCut);
            event.on(display.scroller, 'paste', e => {
                if (widgets.eventInWidget(display, e) || event.signalDOMEvent(cm, e))
                    return;
                if (!te.dispatchEvent) {
                    cm.state.pasteIncoming = +new Date();
                    self.focus();
                    return;
                }
                const event = new Event('paste');
                event.clipboardData = e.clipboardData;
                te.dispatchEvent(event);
            });
            event.on(display.lineSpace, 'selectstart', e => {
                if (!widgets.eventInWidget(display, e))
                    event.e_preventDefault(e);
            });
            event.on(te, 'compositionstart', () => {
                let start = cm.getCursor('from');
                if (self.composing)
                    self.composing.range.clear();
                self.composing = {
                    start: start,
                    range: cm.markText(start, cm.getCursor('to'), { className: 'CodeMirror-composing' })
                };
            });
            event.on(te, 'compositionend', () => {
                if (self.composing) {
                    self.poll();
                    self.composing.range.clear();
                    self.composing = null;
                }
            });
        }
        createField(_display) {
            this.wrapper = inputs.hiddenTextarea();
            this.textarea = this.wrapper.firstChild;
        }
        prepareSelection() {
            let cm = this.cm, display = cm.display, doc = cm.doc;
            let result = display_selection.prepareSelection(cm);
            if (cm.options.moveInputWithCursor) {
                let headPos = position_measurement.cursorCoords(cm, doc.sel.primary().head, 'div');
                let wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
                result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
                result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
            }
            return result;
        }
        showSelection(drawn) {
            let cm = this.cm, display = cm.display;
            dom.removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
            dom.removeChildrenAndAdd(display.selectionDiv, drawn.selection);
            if (drawn.teTop != null) {
                this.wrapper.style.top = drawn.teTop + 'px';
                this.wrapper.style.left = drawn.teLeft + 'px';
            }
        }
        reset(typing) {
            if (this.contextMenuPending || this.composing)
                return;
            let cm = this.cm;
            if (cm.somethingSelected()) {
                this.prevInput = '';
                let content = cm.getSelection();
                this.textarea.value = content;
                if (cm.state.focused)
                    dom.selectInput(this.textarea);
                if (browser.ie && browser.ie_version >= 9)
                    this.hasSelection = content;
            } else if (!typing) {
                this.prevInput = this.textarea.value = '';
                if (browser.ie && browser.ie_version >= 9)
                    this.hasSelection = null;
            }
        }
        getField() {
            return this.textarea;
        }
        supportsTouch() {
            return false;
        }
        focus() {
            if (this.cm.options.readOnly != 'nocursor' && (!browser.mobile || dom.activeElt() != this.textarea)) {
                try {
                    this.textarea.focus();
                } catch (e) {
                }
            }
        }
        blur() {
            this.textarea.blur();
        }
        resetPosition() {
            this.wrapper.style.top = this.wrapper.style.left = 0;
        }
        receivedFocus() {
            this.slowPoll();
        }
        slowPoll() {
            if (this.pollingFast)
                return;
            this.polling.set(this.cm.options.pollInterval, () => {
                this.poll();
                if (this.cm.state.focused)
                    this.slowPoll();
            });
        }
        fastPoll() {
            let missed = false, self = this;
            self.pollingFast = true;
            function p() {
                let changed = self.poll();
                if (!changed && !missed) {
                    missed = true;
                    self.polling.set(60, p);
                } else {
                    self.pollingFast = false;
                    self.slowPoll();
                }
            }
            self.polling.set(20, p);
        }
        poll() {
            let cm = this.cm, input = this.textarea, prevInput = this.prevInput;
            if (this.contextMenuPending || !cm.state.focused || feature_detection.hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
                return false;
            let text = input.value;
            if (text == prevInput && !cm.somethingSelected())
                return false;
            if (browser.ie && browser.ie_version >= 9 && this.hasSelection === text || browser.mac && /[\uf700-\uf7ff]/.test(text)) {
                cm.display.input.reset();
                return false;
            }
            if (cm.doc.sel == cm.display.selForContextMenu) {
                let first = text.charCodeAt(0);
                if (first == 8203 && !prevInput)
                    prevInput = '\u200B';
                if (first == 8666) {
                    this.reset();
                    return this.cm.execCommand('undo');
                }
            }
            let same = 0, l = Math.min(prevInput.length, text.length);
            while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same))
                ++same;
            operations.runInOp(cm, () => {
                inputs.applyTextInput(cm, text.slice(same), prevInput.length - same, null, this.composing ? '*compose' : null);
                if (text.length > 1000 || text.indexOf('\n') > -1)
                    input.value = this.prevInput = '';
                else
                    this.prevInput = text;
                if (this.composing) {
                    this.composing.range.clear();
                    this.composing.range = cm.markText(this.composing.start, cm.getCursor('to'), { className: 'CodeMirror-composing' });
                }
            });
            return true;
        }
        ensurePolled() {
            if (this.pollingFast && this.poll())
                this.pollingFast = false;
        }
        onKeyPress() {
            if (browser.ie && browser.ie_version >= 9)
                this.hasSelection = null;
            this.fastPoll();
        }
        onContextMenu(e) {
            let self = this, cm = self.cm, display = cm.display, te = self.textarea;
            if (self.contextMenuPending)
                self.contextMenuPending();
            let pos = position_measurement.posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
            if (!pos || browser.presto)
                return;
            let reset = cm.options.resetSelectionOnContextMenu;
            if (reset && cm.doc.sel.contains(pos) == -1)
                operations.operation(cm, selection_updates.setSelection)(cm.doc, model_selection.simpleSelection(pos), misc.sel_dontScroll);
            let oldCSS = te.style.cssText, oldWrapperCSS = self.wrapper.style.cssText;
            let wrapperBox = self.wrapper.offsetParent.getBoundingClientRect();
            self.wrapper.style.cssText = 'position: static';
            te.style.cssText = `position: absolute; width: 30px; height: 30px;
      top: ${ e.clientY - wrapperBox.top - 5 }px; left: ${ e.clientX - wrapperBox.left - 5 }px;
      z-index: 1000; background: ${ browser.ie ? 'rgba(255, 255, 255, .05)' : 'transparent' };
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`;
            let oldScrollY;
            if (browser.webkit)
                oldScrollY = window.scrollY;
            display.input.focus();
            if (browser.webkit)
                window.scrollTo(null, oldScrollY);
            display.input.reset();
            if (!cm.somethingSelected())
                te.value = self.prevInput = ' ';
            self.contextMenuPending = rehide;
            display.selForContextMenu = cm.doc.sel;
            clearTimeout(display.detectingSelectAll);
            function prepareSelectAllHack() {
                if (te.selectionStart != null) {
                    let selected = cm.somethingSelected();
                    let extval = '\u200B' + (selected ? te.value : '');
                    te.value = '\u21DA';
                    te.value = extval;
                    self.prevInput = selected ? '' : '\u200B';
                    te.selectionStart = 1;
                    te.selectionEnd = extval.length;
                    display.selForContextMenu = cm.doc.sel;
                }
            }
            function rehide() {
                if (self.contextMenuPending != rehide)
                    return;
                self.contextMenuPending = false;
                self.wrapper.style.cssText = oldWrapperCSS;
                te.style.cssText = oldCSS;
                if (browser.ie && browser.ie_version < 9)
                    display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
                if (te.selectionStart != null) {
                    if (!browser.ie || browser.ie && browser.ie_version < 9)
                        prepareSelectAllHack();
                    let i = 0, poll = () => {
                            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && self.prevInput == '\u200B') {
                                operations.operation(cm, selection_updates.selectAll)(cm);
                            } else if (i++ < 10) {
                                display.detectingSelectAll = setTimeout(poll, 500);
                            } else {
                                display.selForContextMenu = null;
                                display.input.reset();
                            }
                        };
                    display.detectingSelectAll = setTimeout(poll, 200);
                }
            }
            if (browser.ie && browser.ie_version >= 9)
                prepareSelectAllHack();
            if (browser.captureRightClick) {
                event.e_stop(e);
                let mouseup = () => {
                    event.off(window, 'mouseup', mouseup);
                    setTimeout(rehide, 20);
                };
                event.on(window, 'mouseup', mouseup);
            } else {
                setTimeout(rehide, 50);
            }
        }
        readOnlyChanged(val) {
            if (!val)
                this.reset();
            this.textarea.disabled = val == 'nocursor';
        }
        setUneditable() {
        }
    };
    TextareaInput.prototype.needsContentAttribute = false;

    return TextareaInput;

});
define('skylark-codemirror/primitives/edit/fromTextArea',[
    './CodeMirror',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (CodeMirror, dom, events, misc) {
    'use strict';
    function fromTextArea(textarea, options) {
        options = options ? misc.copyObj(options) : {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabIndex)
            options.tabindex = textarea.tabIndex;
        if (!options.placeholder && textarea.placeholder)
            options.placeholder = textarea.placeholder;
        if (options.autofocus == null) {
            let hasFocus = dom.activeElt();
            options.autofocus = hasFocus == textarea || textarea.getAttribute('autofocus') != null && hasFocus == document.body;
        }
        function save() {
            textarea.value = cm.getValue();
        }
        let realSubmit;
        if (textarea.form) {
            events.on(textarea.form, 'submit', save);
            if (!options.leaveSubmitMethodAlone) {
                let form = textarea.form;
                realSubmit = form.submit;
                try {
                    let wrappedSubmit = form.submit = () => {
                        save();
                        form.submit = realSubmit;
                        form.submit();
                        form.submit = wrappedSubmit;
                    };
                } catch (e) {
                }
            }
        }
        options.finishInit = cm => {
            cm.save = save;
            cm.getTextArea = () => textarea;
            cm.toTextArea = () => {
                cm.toTextArea = isNaN;
                save();
                textarea.parentNode.removeChild(cm.getWrapperElement());
                textarea.style.display = '';
                if (textarea.form) {
                    events.off(textarea.form, 'submit', save);
                    if (typeof textarea.form.submit == 'function')
                        textarea.form.submit = realSubmit;
                }
            };
        };
        textarea.style.display = 'none';
        let cm = CodeMirror(node => textarea.parentNode.insertBefore(node, textarea.nextSibling), options);
        return cm;
    }
    return { fromTextArea: fromTextArea };
});
define('skylark-codemirror/primitives/edit/legacy',[
    '../display/scrollbars',
    '../display/scroll_events',
    '../input/keymap',
    '../input/keynames',
    '../line/line_data',
    '../line/pos',
    '../model/change_measurement',
    '../model/Doc',
    '../model/line_widget',
    '../model/mark_text',
    '../modes',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../util/StringStream',
    './commands'
], function (a, b, c, d, e, f, g, Doc, h, i, j, k, l, m, n, StringStream, o) {
    'use strict';
    function addLegacyProps(CodeMirror) {
        CodeMirror.off = l.off;
        CodeMirror.on = l.on;
        CodeMirror.wheelEventPixels = b.wheelEventPixels;
        CodeMirror.Doc = Doc;
        CodeMirror.splitLines = m.splitLinesAuto;
        CodeMirror.countColumn = n.countColumn;
        CodeMirror.findColumn = n.findColumn;
        CodeMirror.isWordChar = n.isWordCharBasic;
        CodeMirror.Pass = n.Pass;
        CodeMirror.signal = l.signal;
        CodeMirror.Line = e.Line;
        CodeMirror.changeEnd = g.changeEnd;
        CodeMirror.scrollbarModel = a.scrollbarModel;
        CodeMirror.Pos = f.Pos;
        CodeMirror.cmpPos = f.cmp;
        CodeMirror.modes = j.modes;
        CodeMirror.mimeModes = j.mimeModes;
        CodeMirror.resolveMode = j.resolveMode;
        CodeMirror.getMode = j.getMode;
        CodeMirror.modeExtensions = j.modeExtensions;
        CodeMirror.extendMode = j.extendMode;
        CodeMirror.copyState = j.copyState;
        CodeMirror.startState = j.startState;
        CodeMirror.innerMode = j.innerMode;
        CodeMirror.commands = o.commands;
        CodeMirror.keyMap = c.keyMap;
        CodeMirror.keyName = c.keyName;
        CodeMirror.isModifierKey = c.isModifierKey;
        CodeMirror.lookupKey = c.lookupKey;
        CodeMirror.normalizeKeyMap = c.normalizeKeyMap;
        CodeMirror.StringStream = StringStream;
        CodeMirror.SharedTextMarker = i.SharedTextMarker;
        CodeMirror.TextMarker = i.TextMarker;
        CodeMirror.LineWidget = h.LineWidget;
        CodeMirror.e_preventDefault = l.e_preventDefault;
        CodeMirror.e_stopPropagation = l.e_stopPropagation;
        CodeMirror.e_stop = l.e_stop;
        CodeMirror.addClass = k.addClass;
        CodeMirror.contains = k.contains;
        CodeMirror.rmClass = k.rmClass;
        CodeMirror.keyNames = d.keyNames;
    }
    return { addLegacyProps: addLegacyProps };
});
define('skylark-codemirror/primitives/edit/main',[
    './CodeMirror',
    '../util/event',
    '../util/misc',
    './options',
    './methods',
    '../model/Doc',
    '../input/ContentEditableInput',
    '../input/TextareaInput',
    '../modes',
    './fromTextArea',
    './legacy'
], function (CodeMirror, events, misc, options, addEditorMethods, Doc, ContentEditableInput, TextareaInput, modes, m_fromTextArea, legacy) {
    'use strict';
    options.defineOptions(CodeMirror);

    addEditorMethods(CodeMirror);

    let dontDelegate = 'iter insert remove copy getEditor constructor'.split(' ');
    for (let prop in Doc.prototype)
        if (Doc.prototype.hasOwnProperty(prop) && misc.indexOf(dontDelegate, prop) < 0)
            CodeMirror.prototype[prop] = function (method) {
                return function () {
                    return method.apply(this.doc, arguments);
                };
            }(Doc.prototype[prop]);

    events.eventMixin(Doc);

    CodeMirror.inputStyles = {
        'textarea': TextareaInput,
        'contenteditable': ContentEditableInput
    };

    CodeMirror.defineMode = function (name) {
        if (!CodeMirror.defaults.mode && name != 'null')
            CodeMirror.defaults.mode = name;
        modes.defineMode.apply(this, arguments);
    };

    CodeMirror.defineMIME = modes.defineMIME;

    CodeMirror.defineMode('null', () => ({ token: stream => stream.skipToEnd() }));

    CodeMirror.defineMIME('text/plain', 'null');

    CodeMirror.defineExtension = (name, func) => {
        CodeMirror.prototype[name] = func;
    };

    CodeMirror.defineDocExtension = (name, func) => {
        Doc.prototype[name] = func;
    };

    CodeMirror.fromTextArea = m_fromTextArea.fromTextArea;

    legacy.addLegacyProps(CodeMirror);
    CodeMirror.version = '5.45.0';
    return { 
        CodeMirror : CodeMirror 
    };
});
define('skylark-codemirror/CodeMirror',[
	'./cm',
	'./primitives/edit/main'
], function (cm,_main) {
    'use strict';
    return cm.CodeMirror = _main.CodeMirror;
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
define('skylark-widgets-coder/Addon',[
	"skylark-domx-styler",
	"skylark-widgets-base/Addon"
],function(styler,_Addon){
	return class Addon extends _Addon {
		_init() {
            this.coder = this._widget;

            this.options.pluginCssClass = this.options.pluginClass || ("coder-plugin-" + this.constructor.addonName);

			if (this.options.pluginCssClass) {
	            styler.addClass(this._widget._elm, this.options.pluginCssClass);			
			}

		}

	}
});
define('skylark-widgets-coder/addons/edit/codemirror',[
    'skylark-langx/langx',
    'skylark-domx-data',
    'skylark-codemirror/CodeMirror',
    "../../Addon",
    '../../util',
    "../../Coder"    
], function (langx,datax,CodeMirror,Addon,util,Coder) {
    'use strict';
    class AddonCodeMirror  extends Addon{
        //constructor(coder, options) 

        get options() {
            return {
               lineNumbers: true,
               pluginCssClass : "coder-plugin-codemirror"
            }
        }

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;

            var priority = 1;
            var i;
            this.editor = {};
            //this.coder = coder;
            var modemap = { 'html': 'htmlmixed' };
            var options = this.options;
            //if (typeof window.CodeMirror === 'undefined') {
            //    return;
            //}
            var $editors = coder.$container.querySelectorAll('.coder-editor');
            for (i = 0; i < $editors.length; i++) {
                let $textarea = $editors[i].querySelector('textarea');
                let type = datax.data($textarea, 'coder-type');
                let file = datax.data($textarea, 'coder-file');
                this.editor[type] = CodeMirror.fromTextArea($textarea, options);
                this.editor[type].setOption('mode', util.getMode(type, file, modemap));
            }
            coder.on('change', this.change.bind(this), priority);
        }
        editorChange(params) {
            return () => {
                this.coder.emit('change', params);
            };
        }
        change(e, callback) {
            var params = e.data,
                editor = this.editor[params.type];
            if (!params.cmEditor) {
                editor.setValue(params.content);
                params.cmEditor = editor;
                editor.on('change', this.editorChange(params));
            }
            params.content = editor.getValue();
            //callback(null, params);
        }


        static get categoryName() {
            return "edit";
        }

        static get addonName(){
            return "codemirror";
        }        
    };

    AddonCodeMirror.register(Coder);

    return AddonCodeMirror;
});
define('skylark-widgets-coder/addons/general/console',[
    'skylark-langx/langx',
    "skylark-domx-styler",
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,styler,Addon,util,Coder) {
    'use strict';
    
    class AddonConsole  extends Addon{
        //constructor(coder, options) 

        get options() {
            return {
               autoClear: false 
            }
        }

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;
            
            var priority = 30;
            var history = [];
            var historyIndex = 0;
            var logCaptureSnippet = `(function ${ this.capture.toString() })();`;
            var contentCache = {
                html: '',
                css: '',
                js: ''
            };
            var $nav = document.createElement('li');
            styler.addClass($nav, 'coder-nav-item coder-nav-item-console');
            $nav.innerHTML = '<a href="#" data-coder-type="console">JS Console</a>';
            var $pane = document.createElement('div');
            styler.addClass($pane, 'coder-pane coder-pane-console');
            $pane.innerHTML = `
              <div class="coder-console-container">
                <ul class="coder-console-output"></ul>
                <form class="coder-console-input">
                  <input type="text">
                </form>
              </div>
              <button class="coder-button coder-console-clear">Clear</button>
            `;

            coder._velm.append($pane);
            coder._velm.find('.coder-nav').append($nav);
            var $container = coder.$container.querySelector('.coder-console-container');
            var $output = coder.$container.querySelector('.coder-console-output');
            var $input = coder.$container.querySelector('.coder-console-input input');
            var $inputForm = coder.$container.querySelector('.coder-console-input');
            var $clear = coder.$container.querySelector('.coder-console-clear');
            $inputForm.addEventListener('submit', this.submit.bind(this));
            $input.addEventListener('keydown', this.history.bind(this));
            $clear.addEventListener('click', this.clear.bind(this));
            if (options.autoClear === true) {
                coder.on('change', this.autoClear.bind(this), priority - 1);
            }
            coder.on('change', this.change.bind(this), priority);
            window.addEventListener('message', this.getMessage.bind(this));
            this.$coderContainer = coder.$container;
            this.$container = $container;
            this.$input = $input;
            this.$output = $output;
            this.history = history;
            this.historyIndex = historyIndex;
            this.logCaptureSnippet = logCaptureSnippet;
            this.contentCache = contentCache;
            this.getIframe = this.getIframe.bind(this);
        }
        getIframe() {
            return this.$coderContainer.querySelector('.coder-pane-result iframe');
        }
        getMessage(e) {
            if (e.source !== this.getIframe().contentWindow) {
                return;
            }
            var data = {};
            try {
                data = JSON.parse(e.data);
            } catch (err) {
            }
            if (data.type === 'coder-console-log') {
                this.log(data.message);
            }
        }
        autoClear(params, callback) {
            var snippetlessContent = params.content;
            if (params.type === 'js') {
                snippetlessContent = snippetlessContent.replace(this.logCaptureSnippet, '');
            }
            if (params.forceRender === true || this.contentCache[params.type] !== snippetlessContent) {
                this.clear();
            }
            this.contentCache[params.type] = snippetlessContent;
            //callback(null, params);
        }
        change(e) {
            var params = e.data;
            if (params.type !== 'js') {
                return //callback(null, params);
            }
            if (params.content.indexOf(this.logCaptureSnippet) === -1) {
                params.content = `${ this.logCaptureSnippet }${ params.content }`;
            }
            //callback(null, params);
        }
        capture() {
            if (typeof window.console === 'undefined' || typeof window.console.log === 'undefined') {
                window.console = {
                    log: function () {
                    }
                };
            }
            var oldConsoleLog = Function.prototype.bind.call(window.console.log, window.console);
            window.console.log = function () {
                [].slice.call(arguments).forEach(function (message) {
                    window.parent.postMessage(JSON.stringify({
                        type: 'coder-console-log',
                        message: message
                    }), '*');
                });
                oldConsoleLog.apply(oldConsoleLog, arguments);
            };
        }
        log(message = '', type) {
            var $log = document.createElement('li');
            styler.addClass($log, 'coder-console-log');
            if (typeof type !== 'undefined') {
                styler.addClass($log, `coder-console-log-${ type }`);
            }
            $log.innerHTML = message;
            this.$output.appendChild($log);
        }
        submit(e) {
            var inputValue = this.$input.value.trim();
            if (inputValue === '') {
                return e.preventDefault();
            }
            this.history.push(inputValue);
            this.historyIndex = this.history.length;
            this.log(inputValue, 'history');
            if (inputValue.indexOf('return') !== 0) {
                inputValue = 'return ' + inputValue;
            }
            try {
                var scriptOutput = this.getIframe().contentWindow.eval(`(function() {${ inputValue }})()`);
                this.log(scriptOutput);
            } catch (err) {
                this.log(err, 'error');
            }
            this.$input.value = '';
            this.$container.scrollTop = this.$container.scrollHeight;
            e.preventDefault();
        }
        clear() {
            this.$output.innerHTML = '';
        }
        history(e) {
            var UP = 38;
            var DOWN = 40;
            var gotHistory = false;
            var selectionStart = this.$input.selectionStart;
            if (e.keyCode === UP && this.historyIndex !== 0 && selectionStart === 0) {
                this.historyIndex--;
                gotHistory = true;
            }
            if (e.keyCode === DOWN && this.historyIndex !== this.history.length - 1 && selectionStart === this.$input.value.length) {
                this.historyIndex++;
                gotHistory = true;
            }
            if (gotHistory) {
                this.$input.value = this.history[this.historyIndex];
            }
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "console";
        }
        
    };

    AddonConsole.register(Coder);

    return AddonConsole;
});
define('skylark-widgets-coder/addons/general/play',[
    'skylark-langx/langx',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,Addon,util,Coder) {
    class AddonPlay  extends Addon{
        //constructor(coder, options) 

        get options() {
            return {
               firstRun: true 
            }
        }

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;
            
            var priority = 10;
            var cache = {};
            var code = {};
            if (options.firstRun === false) {
                cache = {
                    html: {
                        type: 'html',
                        content: ''
                    },
                    css: {
                        type: 'css',
                        content: ''
                    },
                    js: {
                        type: 'js',
                        content: ''
                    }
                };
            }
            var $button = document.createElement('button');
            $button.className = 'coder-button coder-button-play';
            $button.innerHTML = 'Run';
            coder.$container.appendChild($button);
            $button.addEventListener('click', this.run.bind(this));
            coder.on('change', this.change.bind(this), priority);
            this.cache = cache;
            this.code = code;
            this.coder = coder;
        }
        change(e) {
            var params = e.data;
            this.code[params.type] = langx.clone(params);
            if (typeof this.cache[params.type] !== 'undefined') {
                callback(null, this.cache[params.type]);
                this.cache[params.type].forceRender = null;
            } else {
                this.cache[params.type] = langx.clone(params);
                //callback(null, params);
            }
        }
        run() {
            for (let type in this.code) {
                this.cache[type] = langx.mixin({ forceRender: true },this.code[type]);
                this.coder.emit('change', this.cache[type]);
            }
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "play";
        }

    };

    AddonPlay.register(Coder);

    return AddonPlay;
});
define('skylark-widgets-coder/addons/general/render',[
    'skylark-langx/langx',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,Addon,util,Coder) {
    'use strict';
    class AddonRender  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;


            var supportSrcdoc = !!('srcdoc' in document.createElement('iframe'));
            var $resultFrame = coder.$container.querySelector('.coder-pane-result iframe');
            var frameContent = '';
            var content = {
                html: '',
                css: '',
                js: ''
            };
            window.addEventListener('message', this.domready.bind(this));
            coder.on('change', this.change.bind(this), 100);
            this.supportSrcdoc = supportSrcdoc;
            this.content = content;
            this.frameContent = frameContent;
            this.$resultFrame = $resultFrame;
            this.callbacks = [];
            this.index = 0;
            this.lastCallback = () => {
            };
        }
        template(style = '', body = '', script = '') {
            return `
      <!doctype html>
      <html>
        <head>
          <script>
            (function () {
              window.addEventListener('DOMContentLoaded', function () {
                window.parent.postMessage(JSON.stringify({
                  type: 'coder-dom-ready'
                }), '*')
              })
            }())
          </script>

          <style>${ style }</style>
        </head>
        <body>
          ${ body }

          <!--
            Coder:
            Empty script tag prevents malformed HTML from breaking the next script.
          -->
          <script></script>
          <script>${ script }</script>
        </body>
      </html>
    `;
        }
        change(e) {
            var params = e.data;
            this.content[params.type] = params.content;
            var oldFrameContent = this.frameContent;
            this.frameContent = this.template(this.content['css'], this.content['html'], this.content['js']);
            this.lastCallback = () => {
                this.lastCallback = () => {
                };
                //callback(null, params);
            };
            if (params.forceRender !== true && this.frameContent === oldFrameContent) {
                //callback(null, params);
                return;
            }
            if (this.supportSrcdoc) {
                var $newResultFrame = document.createElement('iframe');
                this.$resultFrame.parentNode.replaceChild($newResultFrame, this.$resultFrame);
                this.$resultFrame = $newResultFrame;
                this.$resultFrame.contentWindow.document.open();
                this.$resultFrame.contentWindow.document.write(this.frameContent);
                this.$resultFrame.contentWindow.document.close();
            } else {
                this.$resultFrame.setAttribute('data-srcdoc', this.frameContent);
                var jsUrl = 'javascript:window.frameElement.getAttribute("data-srcdoc");';
                this.$resultFrame.setAttribute('src', jsUrl);
                if (this.$resultFrame.contentWindow) {
                    this.$resultFrame.contentWindow.location = jsUrl;
                }
            }
        }
        domready(e) {
            if (e.source !== this.$resultFrame.contentWindow) {
                return;
            }
            var data = {};
            try {
                data = JSON.parse(e.data);
            } catch (e) {
            }
            if (data.type === 'coder-dom-ready') {
                this.lastCallback();
            }
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "render";
        }

    };

    AddonRender.register(Coder);

    return AddonRender;
});
define('skylark-widgets-coder/main',[
	"./Coder",
	"./addons/edit/codemirror",
	"./addons/general/console",
	"./addons/general/play",
	"./addons/general/render"
],function(Coder){

	return Coder;
});
define('skylark-widgets-coder', ['skylark-widgets-coder/main'], function (main) { return main; });


},this);