define([
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