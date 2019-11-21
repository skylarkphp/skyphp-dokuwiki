define([
    'skylark-langx/langx',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,Addon,util,Coder) {
    'use strict';
    
    class AddonMarkdown  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;

            var priority = 20;
            if (typeof window.marked === 'undefined') {
                return;
            }
            window.marked.setOptions(options);
            coder.$container.querySelector('a[data-coder-type="html"]').innerHTML = 'Markdown';
            coder.on('change', this.change.bind(this), priority);
        }
        change(e) {
            var params = e.data;
            if (params.type === 'html') {
                try {
                    params.content = window.marked(params.content);
                } catch (err) {
                    return callback(err, params);
                }
                //callback(null, params);
            } else {
                //callback(null, params);
            }
        }

        static get categoryName() {
            return "html";
        }

        static get addonName(){
            return "markdown";
        }

    };

    AddonMarkdown.register(Coder);

    return AddonMarkdown;
});