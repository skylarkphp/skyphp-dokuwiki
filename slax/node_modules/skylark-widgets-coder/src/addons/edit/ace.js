define([
    'skylark-langx/langx',
    'skylark-domx-data',
    'skylark-ace',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,datax,Addon,ace,util,Coder) {
    'use strict';
    class AddonAce extends Addon {
        //constructor(coder, options) 

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;

            var priority = 1;
            var i;
            this.editor = {};
            //this.coder = coder;
            //options = langx.clone(options);
            //if (typeof //window.ace === 'undefined') {
            //    retur//n;
            // }
            var options = this.options;
            var $editors = coder.$container.querySelectorAll('.coder-editor');
            for (i = 0; i < $editors.length; i++) {
                let $textarea = $editors[i].querySelector('textarea');
                let type = datax.data($textarea, 'coder-type');
                let file = datax.data($textarea, 'coder-file');
                let $aceContainer = document.createElement('div');
                $editors[i].appendChild($aceContainer);
                this.editor[type] = ace.edit($aceContainer);
                let editor = this.editor[type];
                let editorOptions = langx.clone(options);
                editor.getSession().setMode('ace/mode/' + util.getMode(type, file));
                editor.getSession().setOptions(editorOptions);
                editor.$blockScrolling = Infinity;
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
            if (!params.aceEditor) {
                editor.getSession().setValue(params.content);
                params.aceEditor = editor;
                editor.on('change', this.editorChange(params));
            }
            params.content = editor.getValue();
            //callback(null, params);
        }


        static get categoryName() {
            return "edit";
        }

        static get addonName(){
            return "ace";
        }        
    };

    AddonAce.register(Coder);
    
    return AddonAce;
});