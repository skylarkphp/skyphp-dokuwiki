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
//# sourceMappingURL=sourcemaps/skylark-widgets-coder.js.map
