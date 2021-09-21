define([
    'skylark-langx/langx',
    'skylark-domx-data',
    'skylark-ace',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,datax,ace,Addon,util,CodeGround) {
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
            var $editors = coder.$('.codeg-editor');
            for (i = 0; i < $editors.length; i++) {
                let $textarea = $editors[i].querySelector('textarea');
                let type = datax.data($textarea, 'codeg-type');
                let file = datax.data($textarea, 'codeg-file');
                let $aceContainer = document.createElement('div');
                $editors[i].appendChild($aceContainer);
                this.editor[type] = ace.edit($aceContainer);
                let editor = this.editor[type];
                let editorOptions = langx.clone(options);
                editor.getSession().setMode('ace/mode/' + util.getMode(type, file));
                editor.getSession().setOptions(editorOptions);
                editor.$blockScrolling = Infinity;
            }
            this.listenTo(coder,"reseted",this.update);
        }
        
        editorChange(params) {
            return () => {
                var editor = this.editor[params.type];
                params.content = editor.getValue();
                this.coder.emit('change', params);
            };
        }
        update(e,) {
            var params = e.data,
                editor = this.editor[params.type];
            editor.getSession().setValue(params.content);
        }


        static get categoryName() {
            return "edit";
        }

        static get addonName(){
            return "ace";
        }        
    };

    AddonAce.register(CodeGround);
    
    return AddonAce;
});