define([
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