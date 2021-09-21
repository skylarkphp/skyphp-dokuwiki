define([
    'skylark-langx/langx',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,Addon,util,CodeGround) {
    'use strict';

    class AddonScriptless  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;

            var runScriptTypes = [
                'application/javascript',
                'application/ecmascript',
                'application/x-ecmascript',
                'application/x-javascript',
                'text/ecmascript',
                'text/javascript',
                'text/javascript1.0',
                'text/javascript1.1',
                'text/javascript1.2',
                'text/javascript1.3',
                'text/javascript1.4',
                'text/javascript1.5',
                'text/jscript',
                'text/livescript',
                'text/x-ecmascript',
                'text/x-javascript'
            ];
            this.listenTo(coder,"changed",this.update);
            this.runScriptTypes = runScriptTypes;
        }

        update(e) {
            var params = e.data;
            if (params.type !== 'html') {
                return //callback(null, params);
            }
            var fragment = document.createElement('div');
            fragment.innerHTML = params.content;
            var typeAttr = null;
            var $scripts = fragment.querySelectorAll('script');
            for (let i = 0; i < $scripts.length; i++) {
                typeAttr = $scripts[i].getAttribute('type');
                if (!typeAttr || this.runScriptTypes.indexOf(typeAttr) !== -1) {
                    $scripts[i].parentNode.removeChild($scripts[i]);
                }
            }
            params.content = fragment.innerHTML;
            //callback(null, params);
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "scriptless";
        }

    };

    AddonScriptless.register(CodeGround);

    return AddonScriptless;
});