define([
    'skylark-langx/langx',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,Addon,util,CodeGround) {

    'use strict';
    
    class AddonStylus  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;

            var priority = 20;
            if (typeof window.stylus === 'undefined') {
                return;
            }
            coder.$('a[data-codeg-type="css"]').html('Stylus');
            this.listenTo(coder,"changed",this.update);
        }
        isStylus(params) {
            if (params.type !== 'css') {
                return false;
            }
            return params.file.indexOf('.styl') !== -1 || params.file === '';
        }

        update(e) {
            var params = e.data;
            if (this.isStylus(params)) {
                window.stylus(params.content, this.options).render((err, res) => {
                    if (err) {
                        return callback(err, params);
                    } else {
                        params.content = res;
                    }
                    //callback(null, params);
                });
            } else {
                //callback(null, params);
            }
        }

        static get categoryName() {
            return "css";
        }

        static get addonName(){
            return "stylus";
        }
        
    };

    AddonStylus.register(CodeGround);

    return AddonStylus;
});