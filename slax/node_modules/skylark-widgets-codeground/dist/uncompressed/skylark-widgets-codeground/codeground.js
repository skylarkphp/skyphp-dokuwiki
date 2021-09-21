define([
    'skylark-langx/skylark',
    'skylark-langx/langx',
    'skylark-widgets-base/widget',
    "skylark-domx-styler",
    "skylark-domx-data",
    "skylark-domx-noder",
    './util',
    './template',
    "./addons"
], function (skylark,langx,Widget, styler,datax,noder,util, template,addons) {
    'use strict';

    class Codeground extends Widget{
        get klassName() {
          return "Codeground";
        } 

        get pluginName(){
          return "lark.Codeground";
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

        _init () {
  
            var options = this.options;
            if (options.runScripts === false) {
                options.addons.gerneral.push('scriptless');
            }

            super._init();

            this._cached =  {
                html: null,
                css: null,
                js: null
            };

            var $container = this.$container = this._elm;

            var paneActive = this._paneActive = options.pane;

            var velm = this._velm;
            velm.html(template.container())
                .addClass(template.containerClass())
                .addClass(template.paneActiveClass(paneActive))
                ///.on('keyup', langx.debounce(this.change.bind(this), options.debounce))
                .on('change', langx.debounce(this.change.bind(this), options.debounce))
                .on('click', this.pane.bind(this));

            this._$status =  {};

            for (let type of [
                    'html',
                    'css',
                    'js'
                ]) {
                if (this.options.codes[type] !== false) {
                    this._markup(type);
                }
            }
            this._setCodes(this.options.codes);
        }

        _startup() {
            var options = this.options;
            this.paneActive = this._paneActive;

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

        _markup(type) {
            var $container = this._elm;
            var $parent = this.$().find(`.codeg-pane-${ type }`);

            $parent.append(noder.createElement("div",{
                innerHTML : template.editorContent(type),
                className : template.editorClass(type)
            }));
            this._$status[type] = $parent.find('.codeg-status');
             styler.addClass($container, template.hasFileClass(type));
        }

        _load(type) {
            var cached = this._cached,
                code = cached[type] || {},
                content;

            if (langx.isString(code)) {
                content = code;
            } else {
                content = code.content || "";
            }
            var $textarea = this.$(`.codeg-pane-${ type } textarea`);
            $textarea.val(content);
        }


        change(e) {
            var type = datax.data(e.target, 'codeg-type');
            if (!type) {
                return;
            }
            var cached = this._cached;
            if (cached[type] === e.target.value) {
                return;
            }
            cached[type] = e.target.value;
            this.emit('changed', {
                type: type,
                file: datax.data(e.target, 'codeg-file'),
                content: cached[type]
            });
        }

        getCodes() {
            return langx.clone(this._cached);
        }

        _setCodes(codes) {
            var cached = this._cached;
            cached.html = codes.html || null;
            cached.css = codes.css || null;
            cached.js = codes.js || null;

            for (let type of [
                    'html',
                    'css',
                    'js'
                ]) {
                this._load(type);
            }
        }

        resetCodes(codes) {
            this._setCodes(codes);
            this.emit("reseted");
            return this;
        }

        errors(errs, params) {
            this.status('error', errs, params);
        }

        pane(e) {
            if (!datax.data(e.target, 'codeg-type')) {
                return;
            }
           let oldPaneActive = this._paneActive,
                paneActive = this._paneActive = datax.data(e.target, 'codeg-type');
            this.elmx().removeClass(template.paneActiveClass(oldPaneActive))
                       .addClass(template.paneActiveClass(paneActive));
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
    Codeground.addons = addons;

    return skylark.attach("widgets.Codeground",Codeground);
});