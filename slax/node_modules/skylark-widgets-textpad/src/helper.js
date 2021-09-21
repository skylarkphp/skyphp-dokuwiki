define([
    "skylark-langx/langx",
    "skylark-domx-query",
	"./textpad"
],function(langx,$,textpad) {
    var helper = {
        debounce : function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        options : function(string) {

            if (langx.type(string)!='string') return string;

            if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
                string = '{'+string+'}';
            }

            var start = (string ? string.indexOf("{") : -1), options = {};

            if (start != -1) {
                try {
                    options = helper.str2json(string.substr(start));
                } catch (e) {}
            }

            return options;
        },
        str2json : function(str, notevil) {
            try {
                if (notevil) {
                    return JSON.parse(str
                        // wrap keys without quote with valid double quote
                        .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                        // replacing single quote wrapped ones to double quote
                        .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
                    );
                } else {
                    return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
                }
            } catch(e) { return false; }
        }
    };


    return textpad.helper = helper;

  	
 });