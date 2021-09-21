define([
    'skylark-langx/langx',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,Addon,util,CodeGround) {
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
            coder.$('a[data-codeg-type="js"]').html('CoffeeScript');
            this.listenTo(coder,"changed",this.update);
        }
        isCoffee(params) {
            if (params.type !== 'js') {
                return false;
            }
            return params.file.indexOf('.coffee') !== -1 || params.file === '';
        }
        update(e) {
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

    AddonCoffeeScript.register(CodeGround);

    return AddonCoffeeScript;
});