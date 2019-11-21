define([
    'skylark-langx/langx',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,Addon,util,Coder) {
    'use strict';
    class AddonCoffeeScript  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;
            
            var priority = 20;
            if (typeof window.CoffeeScript === 'undefined') {
                return;
            }
            coder.$container.querySelector('a[data-coder-type="js"]').innerHTML = 'CoffeeScript';
            coder.on('change', this.change.bind(this), priority);
        }
        isCoffee(params) {
            if (params.type !== 'js') {
                return false;
            }
            return params.file.indexOf('.coffee') !== -1 || params.file === '';
        }
        change(e) {
            var params = e.data;
            if (this.isCoffee(params)) {
                try {
                    params.content = window.CoffeeScript.compile(params.content);
                } catch (err) {
                    return callback(err, params);
                }
            }
            //callback(null, params);
        }

        static get categoryName() {
            return "js";
        }

        static get addonName(){
            return "coffeescript";
        }

    };

    AddonCoffeeScript.register(Coder);

    return AddonCoffeeScript;
});