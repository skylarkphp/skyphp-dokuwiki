define([
    'skylark-langx/langx',
    "skylark-domx-noder",
    "skylark-domx-eventer",
    "skylark-domx-query",
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,noder,eventer,$,Addon,util,CodeGround) {
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
            var $button = $('<button/>').prop({
                className : 'codeg-button codeg-button-play',
                innerHTML : 'Run'
            });

            coder.$().append($button);

            this.listenTo($button,"click",this.run);

            this.listenTo(coder,"changed",this.update);
            
            this.cache = cache;
            this.code = code;
            this.coder = coder;
        }

        update(e) {
            var params = e.data;
            this.code[params.type] = langx.clone(params);
            if (typeof this.cache[params.type] !== 'undefined') {
                //callback(null, this.cache[params.type]);
                this.cache[params.type].forceRender = null;
            } else {
                this.cache[params.type] = langx.clone(params);
                //callback(null, params);
            }
        }

        run() {
            this.coder.emit('reseted');
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "play";
        }

    };

    AddonPlay.register(CodeGround);

    return AddonPlay;
});