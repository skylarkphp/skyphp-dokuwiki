define([
    'skylark-langx/langx',
    'skylark-domx-data',
    'skylark-codemirror/CodeMirror',
    "../../Addon",
    '../../util',
    "../../Coder",
    "skylark-codemirror/mode/xml/xml",
    "skylark-codemirror/mode/css/css",
    "skylark-codemirror/mode/javascript/javascript",
    "skylark-codemirror/mode/htmlmixed/htmlmixed",
    "skylark-codemirror/mode/markdown/markdown",

    "skylark-codemirror/addon/comment/comment",

    "skylark-codemirror/addon/selection/active-line",

    "skylark-codemirror/addon/fold/foldcode",
    "skylark-codemirror/addon/fold/foldgutter",
    "skylark-codemirror/addon/fold/brace-fold",
    "skylark-codemirror/addon/fold/xml-fold",
    "skylark-codemirror/addon/fold/indent-fold",
    "skylark-codemirror/addon/fold/markdown-fold",
    "skylark-codemirror/addon/fold/comment-fold",

    "skylark-codemirror/addon/edit/matchbrackets",
    "skylark-codemirror/addon/edit/closebrackets",
    "skylark-codemirror/addon/edit/trailingspace",

    "skylark-codemirror/addon/search/searchcursor",
    "skylark-codemirror/addon/search/search",
    "skylark-codemirror/addon/search/match-highlighter",


    ///"skylark-codemirror/addon/keymap/emacs",
    ///"skylark-codemirror/addon/keymap/sublime",

    "skylark-codemirror/addon/dialog/dialog",

    "skylark-codemirror/addon/hint/anyword-hint",
    "skylark-codemirror/addon/hint/javascript-hint",

    "skylark-codemirror/addon/lint/javascript-lint",
    "skylark-codemirror/addon/lint/lint",

    "skylark-codemirror/addon/tern/tern"
], function (langx,datax,CodeMirror,Addon,util,Coder) {
    'use strict';
    class AddonCodeMirror  extends Addon{
        //constructor(coder, options) 

        get options() {
            return {
                highlightLine: true,

                lineNumbers: true,
                lineWrapping: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

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
                var editor = this.editor[params.type];
                params.content = editor.getValue();
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
            //params.content = editor.getValue();
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