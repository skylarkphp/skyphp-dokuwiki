define([
    "skylark-langx/langx",
    "skylark-domx-query",
    "skylark-widgets-swt/Widget",
    "skylark-codemirror/CodeMirror",
    "skylark-easyeditor/EasyEditor",
    "./textpad",
    "./Preview",
    "./helper"
],function(langx, $, Widget,CodeMirror,EasyEditor,textpad,Preview,helper){
    var Editor = Widget.inherit({
        options: {
            addons       : [],
            iframe       : false,
            mode         : 'split',
            markdown     : false,
            autocomplete : true,
            height       : 500,
            maxsplitsize : 1000,
            codemirror   : { 
                            mode: 'htmlmixed', 
                            lineWrapping: true, 
                            dragDrop: false, 
                            autoCloseTags: true, 
                            matchTags: true, 
                            autoCloseBrackets: true, 
                            matchBrackets: true, 
                            indentUnit: 4, 
                            indentWithTabs: false, 
                            tabSize: 4, 
                            hintOptions: {
                                completionSingle:
                                false
                            } 
                            },
            toolbar      : [ 
                            'bold', 
                            'italic', 
                            'strike', 
                            'link', 
                            'image', 
                            'blockquote', 
                            'listUl', 
                            'listOl' 
                            ],
            lblPreview   : 'Preview',
            lblCodeview  : 'HTML',
            lblMarkedview: 'Markdown',

            template : [
                '<div class="uk-htmleditor uk-clearfix" data-mode="split">',
                    '<div class="uk-htmleditor-navbar">',
                        '<ul class="uk-htmleditor-navbar-nav uk-htmleditor-toolbar"></ul>',
                        '<div class="uk-htmleditor-navbar-flip">',
                            '<ul class="uk-htmleditor-navbar-nav">',
                                '<li class="uk-htmleditor-button-code"><a>{:lblCodeview}</a></li>',
                                '<li class="uk-htmleditor-button-preview"><a>{:lblPreview}</a></li>',
                                '<li><a data-htmleditor-button="fullscreen"><i class="fa fa-expand"></i></a></li>',
                            '</ul>',
                        '</div>',
                    '</div>',
                    '<div class="uk-htmleditor-content">',
                        '<div class="uk-htmleditor-code"></div>',
                        '<div class="uk-htmleditor-preview"><div></div></div>',
                    '</div>',
                '</div>'
            ].join('')

        },


        _init: function() {

            var $this = this, 
                tpl = this.options.template;

            this.element = $(this._elm); // TODO

            this.options.iframe = true;
            this.CodeMirror = this.options.CodeMirror || CodeMirror;
            this.buttons    = {};


            this.addButtons({
                fullscreen: {
                    title  : 'Fullscreen',
                    label  : '<i class="fa fa-expand"></i>'
                },
                bold : {
                    title  : 'Bold',
                    label  : '<i class="fa fa-bold"></i>'
                },
                italic : {
                    title  : 'Italic',
                    label  : '<i class="fa fa-italic"></i>'
                },
                strike : {
                    title  : 'Strikethrough',
                    label  : '<i class="fa fa-strikethrough"></i>'
                },
                blockquote : {
                    title  : 'Blockquote',
                    label  : '<i class="fa fa-quote-right"></i>'
                },
                link : {
                    title  : 'Link',
                    label  : '<i class="fa fa-link"></i>'
                },
                image : {
                    title  : 'Image',
                    label  : '<i class="fa fa-image"></i>'
                },
                listUl : {
                    title  : 'Unordered List',
                    label  : '<i class="fa fa-list-ul"></i>'
                },
                listOl : {
                    title  : 'Ordered List',
                    label  : '<i class="fa fa-list-ol"></i>'
                }

            });


            tpl = tpl.replace(/\{:lblPreview}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{:lblCodeview}/g, this.options.lblCodeview);

            this.htmleditor = $(tpl);
            this.content    = this.htmleditor.find('.uk-htmleditor-content');
            this.toolbar    = this.htmleditor.find('.uk-htmleditor-toolbar');
            $(this.toolbar)
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
            this.preview    = this.htmleditor.find('.uk-htmleditor-preview').children().eq(0);
            this.code       = this.htmleditor.find('.uk-htmleditor-code');

            this.element.before(this.htmleditor).appendTo(this.code);
            this.editor = this.CodeMirror.fromTextArea(this.element[0], this.options.codemirror);
            this.editor.htmleditor = this;
            this.editor.on('change', helper.debounce(function() { $this.render(); }, 150));
            this.editor.on('change', function() {
                $this.editor.save();
                $this.element.trigger('input');
            });
            this.code.find('.CodeMirror').css('height', this.options.height);

            // iframe mode?
            if (this.options.iframe) {

                this.iframe = $('<iframe class="uk-htmleditor-iframe" frameborder="0" scrolling="auto" height="100" width="100%"></iframe>');
                this.preview.append(this.iframe);

                // must open and close document object to start using it!
                this.iframe[0].contentWindow.document.open();
                this.iframe[0].contentWindow.document.close();

                this.preview.container = $(this.iframe[0].contentWindow.document).find('body');

                // append custom stylesheet
                if (typeof(this.options.iframe) === 'string') {
                    this.preview.container.parent().append('<link rel="stylesheet" href="'+this.options.iframe+'">');
                }

            } else {
                this.preview.container = this.preview;
            }
            this.previewer   = this.preview.container.plugin("lark.codeeditor.preview");

            //$win.on('resize load', helper.debounce(function() { $this.fit(); }, 200));
            $(window).on('resize load', helper.debounce(function() { $this.fit(); }, 200));

            var previewContainer = this.iframe ? this.preview.container:$this.preview.parent(),
                codeContent      = this.code.find('.CodeMirror-sizer'),
                codeScroll       = this.code.find('.CodeMirror-scroll').on('scroll', helper.debounce(function() {

                    if ($this.htmleditor.attr('data-mode') == 'tab') return;

                    // calc position
                    var codeHeight      = codeContent.height() - codeScroll.height(),
                        previewHeight   = previewContainer[0].scrollHeight - ($this.iframe ? $this.iframe.height() : previewContainer.height()),
                        ratio           = previewHeight / codeHeight,
                        previewPosition = codeScroll.scrollTop() * ratio;

                    // apply new scroll
                    previewContainer.scrollTop(previewPosition);

                }, 10));

            this.htmleditor.on('click', '.uk-htmleditor-button-code, .uk-htmleditor-button-preview', function(e) {

                e.preventDefault();

                if ($this.htmleditor.attr('data-mode') == 'tab') {

                    $this.htmleditor.find('.uk-htmleditor-button-code, .uk-htmleditor-button-preview').removeClass('uk-active').filter(this).addClass('uk-active');

                    $this.activetab = $(this).hasClass('uk-htmleditor-button-code') ? 'code' : 'preview';

                    if ($this.activetab == 'code') {
                        //var visualEditor = $this.$preview.data('plugin_easyEditor');
                        $this.editor.setValue($this.previewer.toMd());

                    }
                    $this.htmleditor.attr('data-active-tab', $this.activetab);
                    $this.editor.refresh();
                }
            });

            // toolbar actions
            this.htmleditor.on('click', 'a[data-htmleditor-button]', function() {

                if (!$this.code.is(':visible')) {
                    //var editor = $this.$preview.data('plugin_easyEditor');
                    $this.previewer[ $(this).data('htmleditor-button')]();
                    return;
                }

                $this.trigger('action.' + $(this).data('htmleditor-button'), [$this.editor]);
            });

            this.preview.parent().css('height', this.code.height());

            // autocomplete
            if (this.options.autocomplete && this.CodeMirror.showHint && this.CodeMirror.hint && this.CodeMirror.hint.html) {

                this.editor.on('inputRead', helper.debounce(function() {
                    var doc = $this.editor.getDoc(), POS = doc.getCursor(), mode = $this.CodeMirror.innerMode($this.editor.getMode(), $this.editor.getTokenAt(POS).state).mode.name;

                    if (mode == 'xml') { //html depends on xml

                        var cur = $this.editor.getCursor(), token = $this.editor.getTokenAt(cur);

                        if (token.string.charAt(0) == '<' || token.type == 'attribute') {
                            $this.CodeMirror.showHint($this.editor, $this.CodeMirror.hint.html, { completeSingle: false });
                        }
                    }
                }, 100));
            }

            this.addons = [];
            (this.options.addons.length ? this.options.addons : Object.keys(addons)).forEach(function(addon) {

                if (addons[addon].init) {
                    addons[addon].init($this);
                    $this.addons[addon] = true;
                }

            });


            this.debouncedRedraw = helper.debounce(function () { $this.redraw(); }, 5);

            //this.on('init.uk.component', function() {
                $this.debouncedRedraw();
            //});

            this.element.attr('data-uk-check-display', 1).on('display.uk.check', function(e) {
                if (this.htmleditor.is(":visible")) this.fit();
            }.bind(this));

            //editors.push(this);
        },

        addButton: function(name, button) {
            this.buttons[name] = button;
        },

        addButtons: function(buttons) {
            langx.extend(this.buttons, buttons);
        },

        replaceInPreview: function(regexp, callback) {

            var editor = this.editor, results = [], value = editor.getValue(), offset = -1, index = 0;

            this.currentvalue = this.currentvalue.replace(regexp, function() {

                offset = value.indexOf(arguments[0], ++offset);

                var match  = {
                    matches: arguments,
                    from   : translateOffset(offset),
                    to     : translateOffset(offset + arguments[0].length),
                    replace: function(value) {
                        editor.replaceRange(value, match.from, match.to);
                    },
                    inRange: function(cursor) {

                        if (cursor.line === match.from.line && cursor.line === match.to.line) {
                            return cursor.ch >= match.from.ch && cursor.ch < match.to.ch;
                        }

                        return  (cursor.line === match.from.line && cursor.ch   >= match.from.ch) ||
                                (cursor.line >   match.from.line && cursor.line <  match.to.line) ||
                                (cursor.line === match.to.line   && cursor.ch   <  match.to.ch);
                    }
                };

                var result = typeof(callback) === 'string' ? callback : callback(match, index);

                if (!result && result !== '') {
                    return arguments[0];
                }

                index++;

                results.push(match);
                return result;
            });

            function translateOffset(offset) {
                var result = editor.getValue().substring(0, offset).split('\n');
                return { line: result.length - 1, ch: result[result.length - 1].length }
            }

            return results;
        },

        _buildtoolbar: function() {

            if (!(this.options.toolbar && this.options.toolbar.length)) return;

            var $this = this, bar = [];

            this.toolbar.empty();

            this.options.toolbar.forEach(function(button) {
                if (!$this.buttons[button]) return;

                var title = $this.buttons[button].title ? $this.buttons[button].title : button;

                bar.push('<li><a data-htmleditor-button="'+button+'" title="'+title+'" data-uk-tooltip>'+$this.buttons[button].label+'</a></li>');
            });

            this.toolbar.html(bar.join('\n'));
        },

        fit: function() {

            var mode = this.options.mode;

            if (mode == 'split' && this.htmleditor.width() < this.options.maxsplitsize) {
                mode = 'tab';
            }

            if (mode == 'tab') {
                if (!this.activetab) {
                    this.activetab = 'code';
                    this.htmleditor.attr('data-active-tab', this.activetab);
                }

                this.htmleditor.find('.uk-htmleditor-button-code, .uk-htmleditor-button-preview').removeClass('uk-active')
                    .filter(this.activetab == 'code' ? '.uk-htmleditor-button-code' : '.uk-htmleditor-button-preview')
                    .addClass('uk-active');
            }

            //var visualEditor = this.$preview.data('plugin_easyEditor');
            this.previewer.readonly(mode == 'tab');

            this.editor.refresh();
            this.preview.parent().css('height', this.code.height());

            this.htmleditor.attr('data-mode', mode);
        },

        redraw: function() {
            this._buildtoolbar();
            this.render();
            this.fit();
        },

        getMode: function() {
            return this.editor.getOption('mode');
        },

        getCursorMode: function() {
            var param = { mode: 'html'};
            this.trigger('cursorMode', [param]);
            return param.mode;
        },

        render: function() {

            this.currentvalue = this.editor.getValue();

            // empty code
            if (!this.currentvalue) {

                this.element.val('');
                this.preview.container.html('');

                return;
            }

            this.trigger('render', [this]);
            this.trigger('renderLate', [this]);

            this.preview.container.html(this.currentvalue);
        },

        addShortcut: function(name, callback) {
            var map = {};
            if (!langx.isArray(name)) {
                name = [name];
            }

            name.forEach(function(key) {
                map[key] = callback;
            });

            this.editor.addKeyMap(map);

            return map;
        },

        addShortcutAction: function(action, shortcuts) {
            var editor = this;
            this.addShortcut(shortcuts, function() {
                editor.element.trigger('action.' + action, [editor.editor]);
            });
        },

        insertImage : function(url,text) {
            if (!this.code.is(':visible')) {
                //var editor = this.$preview.data('plugin_easyEditor');
                var html = "<img src=\""+url+"\" alt=\""+text+"\">";
                this.previewer.insertAtCaret($(html)[0]);
                return;
            }
            var text = '\n![' + text + '](' + url + ')\n';
            this.replaceSelection(text);
        },
        
        replaceSelection: function(replace) {

            var text = this.editor.getSelection();

            if (!text.length) {

                var cur     = this.editor.getCursor(),
                    curLine = this.editor.getLine(cur.line),
                    start   = cur.ch,
                    end     = start;

                while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) ++end;
                while (start && /[\w$]+/.test(curLine.charAt(start - 1))) --start;

                var curWord = start != end && curLine.slice(start, end);

                if (curWord) {
                    this.editor.setSelection({ line: cur.line, ch: start}, { line: cur.line, ch: end });
                    text = curWord;
                }
            }

            var html = replace.replace('$1', text);

            this.editor.replaceSelection(html, 'end');
            this.editor.focus();
        },

        replaceLine: function(replace) {
            var pos  = this.editor.getDoc().getCursor(),
                text = this.editor.getLine(pos.line),
                html = replace.replace('$1', text);

            this.editor.replaceRange(html , { line: pos.line, ch: 0 }, { line: pos.line, ch: text.length });
            this.editor.setCursor({ line: pos.line, ch: html.length });
            this.editor.focus();
        },

        save: function() {
            this.editor.save();
        },
        _setPreviewFocus : function(){
            //var editor = this.$preview.data('plugin_easyEditor')
            this.previewr.win.focus();
            var range = this.range;
            if (!range) {
                if(editor.doc.selection)
                {
                    range = editor.doc.selection.createRange();
                }

            } else {
                range.select();
                range = this.range = null;

            }

        }
    });

    var addons = {};

    Editor.addon = function(name,def) {
       addons[name] = def;

    }


    return textpad.Editor = Editor;


});

