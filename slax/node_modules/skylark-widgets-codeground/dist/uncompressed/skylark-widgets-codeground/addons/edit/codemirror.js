define([
    'skylark-langx/langx',
    'skylark-domx-query',

    'skylark-codemirror/CodeMirror',
    "../../addon",
    '../../util',
    "../../codeground",
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
], function (langx,$,CodeMirror,Addon,util,CodeGround) {
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

                pluginCssClass : "codeg-plugin-codemirror"
            }
        }

        _init() {
            super._init();
            var coder = this.coder,
                options = this.options;

            var priority = 1;
            var i;
            this.editors = {};
            //this.coder = coder;
            var modemap = { 'html': 'htmlmixed' };
            var options = this.options;
            //if (typeof window.CodeMirror === 'undefined') {
            //    return;
            //}
            var $editors = coder.$('.codeg-editor');
            for (i = 0; i < $editors.length; i++) {
                let $textarea = $($editors[i]).find('textarea');
                let type = $textarea.data('codeg-type');
                let editor = this.editors[type] = CodeMirror.fromTextArea($textarea[0], options);
                editor.setOption('mode', util.getMode(type, '', modemap));
                editor.$textarea = $textarea;
                editor.on('change', this.editorChange({
                    type
                }));

            }
            this.listenTo(coder,"reseted",this.update);
        }

        editorChange(params) {
            return () => {
                var editor = this.editors[params.type];
                editor.$textarea.val(editor.getValue());
                editor.$textarea.trigger("change");
            };
        }

        update(e) {
            var codes = this.coder.getCodes();
            for (let type in this.editors) {
                let editor = this.editors[type],
                    code = codes[type],
                    content;
                if (langx.isString(code)) {
                    content = code;
                } else {
                    content = code.content || "";
                }
                editor.setValue(content);
            }

        }


        static get categoryName() {
            return "edit";
        }

        static get addonName(){
            return "codemirror";
        }        
    };

    AddonCodeMirror.register(CodeGround);

    return AddonCodeMirror;
});