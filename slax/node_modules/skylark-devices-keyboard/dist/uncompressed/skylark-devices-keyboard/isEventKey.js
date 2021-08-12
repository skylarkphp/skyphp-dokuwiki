define([
  "skylark-langx-types",
  "./keyboard",
  "./aliases",
  "./codes",
  "./names"
],function(types,keyboard,aliases,codes,names){

  /**
   * Compares a keyboard event with a given keyCode or keyName.
   *
   * @param {Event} event Keyboard event that should be tested
   * @param {Mixed} keyCode {Number} or keyName {String}
   * @return {Boolean}
   * @api public
   */
   function isEventKey(event, nameOrCode) {
      var keyCode = event.which || event.keyCode || event.charCode;
      if (keyCode === null || keyCode === undefined) { 
        return false; 
      }

      if (types.isString(nameOrCode)) {
        // check codes
        var foundNamedKey = codes[nameOrCode.toLowerCase()]
        if (foundNamedKey) { return foundNamedKey === keyCode; }
      
        // check aliases
        var foundNamedKey = aliases[nameOrCode.toLowerCase()]
        if (foundNamedKey) { return foundNamedKey === keyCode; }
      } else if (types.isNumber(nameOrCode)) {
        return nameOrCode === keyCode;
      }
      return false;
  }

  return keyboard.isEventKey = isEventKey;

});
