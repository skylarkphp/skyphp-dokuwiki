/**
 * skylark-langx-logging - The skylark JavaScript language extension library.
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

define('skylark-langx-logging/logging',[
  "skylark-langx-ns"
],function(skylark){


    return skylark.attach("langx.logging",{

    });
});
define('skylark-langx-logging/levels',[
	"./logging"
],function(logging){
    return logging.levels = {
	    all: 'debug|info|warn|error',
	    off: '',
	    debug: 'debug|info|warn|error',
	    info: 'info|warn|error',
	    warn: 'warn|error',
	    error: 'error',
	    DEFAULT: "info"
    };	
});
define('skylark-langx-logging/Logger',[
    "skylark-langx-objects",
    "skylark-langx-constructs/klass",
    "./logging",
    "./levels"
],function(objects,klass,logging,levels){
    'use strict';

    let history = [];
 
    const LogByTypeFactory = (name) => (type, level, args) => {
        const lvl = levels[level];
        const lvlRegExp = new RegExp(`^(${ lvl })$`);
        if (type !== 'debug') {
            args.unshift(type.toUpperCase() + ':');
        }
        args.unshift(name + ':');
        if (history) {
            history.push([].concat(args));
            const splice = history.length - 1000;
            history.splice(0, splice > 0 ? splice : 0);
        }
        if (!window.console) {
            return;
        }
        let fn = window.console[type];
        if (!fn && type === 'debug') {
            fn = window.console.info || window.console.log;
        }
        if (!fn || !lvl || !lvlRegExp.test(type)) {
            return;
        }
        fn[Array.isArray(args) ? 'apply' : 'call'](window.console, args);
    };

    var Logger = klass({
        _level : "info",

        _construct : function(name) {
            this.name = name;

            this._logByType = LogByTypeFactory(name);
        },

        level : function(lvl) {
            if (typeof lvl === 'string') {
                if (!levels.hasOwnProperty(lvl)) {
                    throw new Error(`"${ lvl }" in not a valid log level`);
                }
                this._level = lvl;
            }
            return this._level;
        },

        error : function(...args){ 
            this._logByType('error', this._level, args);
        },

        warn : function(...args){ 
            this._logByType('warn', this._level, args);
        },

        debug : function(...args){ 
            this._logByType('debug', this._level, args);
        },

        info : function(...args){ 
            this._logByType('info', this._level, args);
        },

        history : function() {
            return history ? [].concat(history) : [];
        },

        createLogger : function(subname) {
            return new Logger(this.name ? this.name  + ': ' + subname : subname);   
        }

    });


    objects.mixin(Logger.prototype.history,{
        enable : function() {
           if (history === null) {
                history = [];
            }            
        },
        
        filter : function(fname) {
            return (history || []).filter(historyItem => {
                return new RegExp(`.*${ fname }.*`).test(historyItem[0]);
            });
        },
        clear : function() {
            if (history) {
                history.length = 0;
            }
        },
        disable : function()  {
            if (history !== null) {
                history.length = 0;
                history = null;
            }
        }
    });

    Logger.root = new Logger("");

    return logging.Logger = Logger;

});
define('skylark-langx-logging/main',[
	"./logging",
	"./Logger"
],function(logging,Logger){
	let rootLogger = Logger.root;

	logging.debug = function(...args) {
		rootLogger.debug(...args);
	};

	logging.info = function(...args) {
		rootLogger.debug(...args);
	};

	logging.warn = function(...args) {
		rootLogger.debug(...args);
	};

	logging.error = function(...args) {
		rootLogger.debug(...args);
	};


	return logging;
});
define('skylark-langx-logging', ['skylark-langx-logging/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-langx-logging.js.map
