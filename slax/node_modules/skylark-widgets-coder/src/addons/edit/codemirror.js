define([
    'skylark-langx/langx',
    'skylark-domx-data',
    'skylark-codemirror/CodeMirror',
    "../../Addon",
    '../../util',
    "../../Coder"    
], function (langx,datax,CodeMirror,Addon,util,Coder) {
    'use strict';
    class AddonCodeMirror  extends Addon{
        //constructor(coder, options) 

        get options() {
            return {
               lineNumbers: true,
               pluginCssClass : "coder-plugin-codemirror"
            }
        }

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;

            var priority = 1;
            var i;
            this.editor = {};
            //this.coder = coder;
            var modemap = { 'html': 'htmlmixed' };
            var options = this.options;
            //if (typeof window.CodeMirror === 'undefined') {
            //    return;
            //}
            var $editors = coder.$container.querySelectorAll('.coder-editor');
            for (i = 0; i < $editors.length; i++) {
                let $textarea = $editors[i].querySelector('textarea');
                let type = datax.data($textarea, 'coder-type');
                let file = datax.data($textarea, 'coder-file');
                this.editor[type] = CodeMirror.fromTextArea($textarea, options);
                this.editor[type].setOption('mode', util.getMode(type, file, modemap));
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
            if (!params.cmEditor) {
                editor.setValue(params.content);
                params.cmEditor = editor;
                editor.on('change', this.editorChange(params));
            }
            params.content = editor.getValue();
            //callback(null, params);
        }


        static get categoryName() {
            return "edit";
        }

        static get addonName(){
            return "codemirror";
        }        
    };

    AddonCodeMirror.register(Coder);

    return AddonCodeMirror;
});