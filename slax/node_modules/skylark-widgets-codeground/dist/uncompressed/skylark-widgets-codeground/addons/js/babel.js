define([
    'skylark-langx/langx',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,Addon,util,CodeGround) {
    'use strict';
    
    class AddonBabel  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;

            //this.options = langx.clone(options);
            if (typeof window.Babel !== 'undefined') {
                this.babel = window.Babel;
            } else if (typeof window.babel !== 'undefined') {
                this.babel = { transform: window.babel };
            } else {
                return;
            }
            coder.$('a[data-codeg-type="js"]').html('ES2015');
            this.listenTo(coder,"changed",this.update);
        }
        update(e) {
            var params = e.data;
            if (params.type === 'js') {
                try {
                    params.content = this.babel.transform(params.content, this.options).code;
                } catch (err) {
                    return callback(err, params);
                }
                //callback(null, params);
            } else {
                //callback(null, params);
            }
        }

        static get categoryName() {
            return "js";
        }

        static get addonName(){
            return "babel";
        }

    };

    AddonBabel.register(CodeGround);

    return AddonBabel;
});