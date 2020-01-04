/**
 * skylark-domx-forms - The skylark html form library for dom api extension.
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
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-forms/forms',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("domx.forms",{});
});
define('skylark-domx-forms/deserialize',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./forms"
],function(langx,$,forms){
  /**
   * Updates a key/valueArray with the given property and value. Values will always be stored as arrays.
   *
   * @param prop The property to add the value to.
   * @param value The value to add.
   * @param obj The object to update.
   * @returns {object} Updated object.
   */
  function updateKeyValueArray( prop, value, obj ) {
    var current = obj[ prop ];

    if ( current === undefined ) {
      obj[ prop ] = [ value ];
    } else {
      current.push( value );
    }

    return obj;
  }

  /**
   * Get all of the fields contained within the given elements by name.
   *
   * @param formElm The form element.
   * @param filter Custom filter to apply to the list of fields.
   * @returns {object} All of the fields contained within the given elements, keyed by name.
   */
  function getFieldsByName(formElm, filter ) {
    var elementsByName = {};

    // Extract fields from elements
    var fields = $(formElm)
      .map(function convertFormToElements() {
        return this.elements ? langx.makeArray( this.elements ) : this;
      })
      .filter( filter || ":input:not(:disabled)" )
      .get();

    langx.each( fields, function( index, field ) {
      updateKeyValueArray( field.name, field, elementsByName );
    });

    return elementsByName;
  }

  /**
   * Figure out the type of an element. Input type will be used first, falling back to nodeName.
   *
   * @param element DOM element to check type of.
   * @returns {string} The element's type.
   */
  function getElementType( element ) {
    return ( element.type || element.nodeName ).toLowerCase();
  }

  /**
   * Normalize the provided data into a key/valueArray store.
   *
   * @param data The data provided by the user to the plugin.
   * @returns {object} The data normalized into a key/valueArray store.
   */
  function normalizeData( data ) {
    var normalized = {};
    var rPlus = /\+/g;

    // Convert data from .serializeObject() notation
    if ( langx.isPlainObject( data ) ) {
      langx.extend( normalized, data );

      // Convert non-array values into an array
      langx.each( normalized, function( name, value ) {
        if ( !langx.isArray( value ) ) {
          normalized[ name ] = [ value ];
        }
      });

    // Convert data from .serializeArray() notation
    } else if ( langx.isArray( data ) ) {
      langx.each( data, function( index, field ) {
        updateKeyValueArray( field.name, field.value, normalized );
      });

    // Convert data from .serialize() notation
    } else if ( typeof data === "string" ) {
      langx.each( data.split( "&" ), function( index, field ) {
        var current = field.split( "=" );
        var name = decodeURIComponent( current[ 0 ].replace( rPlus, "%20" ) );
        var value = decodeURIComponent( current[ 1 ].replace( rPlus, "%20" ) );
        updateKeyValueArray( name, value, normalized );
      });
    }

    return normalized;
  }

  /**
   * Map of property name -> element types.
   *
   * @type {object}
   */
  var updateTypes = {
    checked: [
      "radio",
      "checkbox"
    ],
    selected: [
      "option",
      "select-one",
      "select-multiple"
    ],
    value: [
      "button",
      "color",
      "date",
      "datetime",
      "datetime-local",
      "email",
      "hidden",
      "month",
      "number",
      "password",
      "range",
      "reset",
      "search",
      "submit",
      "tel",
      "text",
      "textarea",
      "time",
      "url",
      "week"
    ]
  };

  /**
   * Get the property to update on an element being updated.
   *
   * @param element The DOM element to get the property for.
   * @returns The name of the property to update if element is supported, otherwise `undefined`.
   */
  function getPropertyToUpdate( element ) {
    var type = getElementType( element );
    var elementProperty = undefined;

    langx.each( updateTypes, function( property, types ) {
      if ( langx.inArray( type, types ) > -1 ) {
        elementProperty = property;
        return false;
      }
    });

    return elementProperty;
  }

  /**
   * Update the element based on the provided data.
   *
   * @param element The DOM element to update.
   * @param elementIndex The index of this element in the list of elements with the same name.
   * @param value The serialized element value.
   * @param valueIndex The index of the value in the list of values for elements with the same name.
   * @param callback A function to call if the value of an element was updated.
   */
  function update( element, elementIndex, value, valueIndex, callback ) {
    var property = getPropertyToUpdate( element );

    // Handle value inputs
    // If there are multiple value inputs with the same name, they will be populated by matching indexes.
    if ( property == "value" && elementIndex == valueIndex ) {
      element.value = value;
      callback.call( element, value );

    // Handle select menus, checkboxes and radio buttons
    } else if ( property == "checked" || property == "selected" ) {
      var fields = [];

      // Extract option fields from select menus
      if ( element.options ) {
        langx.each( element.options, function( index, option ) {
          fields.push( option );
        });

      } else {
        fields.push( element );
      }

      // #37: Remove selection from multiple select menus before deserialization
      if ( element.multiple && valueIndex == 0 ) {
        element.selectedIndex = -1;
      }

      langx.each( fields, function( index, field ) {
        if ( field.value == value ) {
          field[ property ] = true;
          callback.call( field, value );
        }
      });
    }
  }

  /**
   * Default plugin options.
   *
   * @type {object}
   */
  var defaultOptions = {
    change: langx.noop,
    complete: langx.noop
  };

  /**
   * The $.deserialize function.
   *
   * @param data The data to deserialize.
   * @param options Additional options.
   * @returns {jQuery} The jQuery object that was provided to the plugin.
   */
  function deserialize(formElm,data, options ) {

    // Backwards compatible with old arguments: data, callback
    if ( langx.isFunction( options ) ) {
      options = { complete: options };
    }

    options = langx.extend( defaultOptions, options || {} );
    data = normalizeData( data );

    var elementsByName = getFieldsByName( formElm, options.filter );

    langx.each( data, function( name, values ) {
      langx.each( elementsByName[ name ], function( elementIndex, element ) {
        langx.each( values, function( valueIndex, value ) {
          update( element, elementIndex, value, valueIndex, options.change );
        });
      });
    });

    options.complete.call( formElm );

    return this;
  };

  return forms.deserialize = deserialize;
});
define('skylark-domx-forms/serializeArray',[
  "skylark-langx/langx",
  "skylark-domx-data",
  "./forms"
],function(langx,datax,forms){
    function serializeArray(formElm) {
        var name, type, result = [],
            add = function(value) {
                if (value.forEach) return value.forEach(add)
                result.push({ name: name, value: value })
            }
        langx.each(formElm.elements, function(_, field) {
            type = field.type, name = field.name
            if (name && field.nodeName.toLowerCase() != 'fieldset' &&
                !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
                ((type != 'radio' && type != 'checkbox') || field.checked))
                add(datax.val(field))
        })
        return result
    };

    return forms.serializeArray = serializeArray;
});

define('skylark-domx-forms/serializeObject',[
  "skylark-langx/langx",
  "./forms",
  "./serializeArray"
],function(langx,forms,serializeArray){

  function serializeObject(formElm){
    var obj = {};
    
    langx.each(serializeArray(formElm), function(i,o){
      var n = o.name,
        v = o.value;
        
        obj[n] = obj[n] === undefined ? v
          : langx.isArray( obj[n] ) ? obj[n].concat( v )
          : [ obj[n], v ];
    });
    
    return obj;
  }

  return forms.serializeObject = serializeObject;
});  
define('skylark-domx-forms/serialize',[
  "skylark-langx/langx",
  "./forms",
  "./serializeArray"
],function(langx,forms,serializeArray){
    function serialize(formElm) {
        var result = []
        serializeArray(formElm).forEach(function(elm) {
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
    }

    return forms.serialize = serialize;
});
define('skylark-domx-forms/main',[
	"./forms",
    "skylark-domx-velm",
    "skylark-domx-query",
    "./deserialize",
    "./serializeArray",
    "./serializeObject",
    "./serialize"
],function(forms,velm,$){

    // from ./data
    velm.delegate([
        "deserialize",
        "serializeArray",
        "serializeObject",
        "serialize"
    ], forms);

    $.fn.deserialize = $.wraps.wrapper_value(forms.deserialize, forms, forms.deserialize);
    $.fn.serializeArray = $.wraps.wrapper_value(forms.serializeArray, forms, forms.serializeArray);
    $.fn.serializeObject = $.wraps.wrapper_value(forms.serializeObject, forms, forms.serializeObject);
    $.fn.serialize = $.wraps.wrapper_value(forms.serialize, forms, forms.serialize);


	return forms;
});
define('skylark-domx-forms', ['skylark-domx-forms/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-forms.js.map
