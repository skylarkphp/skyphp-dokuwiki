define([
    "skylark-domx-query",
    "../Editor"
],function($,Editor){
    Editor.addon('base', {
        init: function(editor) {

            addAction('bold', '<strong>$1</strong>');
            addAction('italic', '<em>$1</em>');
            addAction('strike', '<del>$1</del>');
            addAction('blockquote', '<blockquote><p>$1</p></blockquote>', 'replaceLine');
            addAction('link', '<a href="http://">$1</a>');
            addAction('image', '<img src="http://" alt="$1">');

            var listfn = function(tag) {
                if (editor.getCursorMode() == 'html') {

                    tag = tag || 'ul';

                    var cm        = editor.editor,
                        doc       = cm.getDoc(),
                        pos       = doc.getCursor(true),
                        posend    = doc.getCursor(false),
                        im        = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(cm.getCursor()).state),
                        inList    = im && im.state && im.state.context && ['ul','ol'].indexOf(im.state.context.tagName) != -1;

                    for (var i=pos.line; i<(posend.line+1);i++) {
                        cm.replaceRange('<li>'+cm.getLine(i)+'</li>', { line: i, ch: 0 }, { line: i, ch: cm.getLine(i).length });
                    }

                    if (!inList) {
                        cm.replaceRange('<'+tag+'>'+"\n"+cm.getLine(pos.line), { line: pos.line, ch: 0 }, { line: pos.line, ch: cm.getLine(pos.line).length });
                        cm.replaceRange(cm.getLine((posend.line+1))+"\n"+'</'+tag+'>', { line: (posend.line+1), ch: 0 }, { line: (posend.line+1), ch: cm.getLine((posend.line+1)).length });
                        cm.setCursor({ line: posend.line+1, ch: cm.getLine(posend.line+1).length });
                    } else {
                        cm.setCursor({ line: posend.line, ch: cm.getLine(posend.line).length });
                    }

                    cm.focus();
                }
            };

            editor.on('action.listUl', function() {
                listfn('ul');
            });

            editor.on('action.listOl', function() {
                listfn('ol');
            });

            editor.htmleditor.on('click', 'a[data-htmleditor-button="fullscreen"]', function() {
                editor.htmleditor.toggleClass('uk-htmleditor-fullscreen');

                var wrap = editor.editor.getWrapperElement();

                if (editor.htmleditor.hasClass('uk-htmleditor-fullscreen')) {

                    editor.editor.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset, width: wrap.style.width, height: wrap.style.height};
                    wrap.style.width  = '';
                    wrap.style.height = editor.content.height()+'px';
                    document.documentElement.style.overflow = 'hidden';

                } else {

                    document.documentElement.style.overflow = '';
                    var info = editor.editor.state.fullScreenRestore;
                    wrap.style.width = info.width; wrap.style.height = info.height;
                    window.scrollTo(info.scrollLeft, info.scrollTop);
                }

                setTimeout(function() {
                    editor.fit();
                    $(window).trigger('resize');
                }, 50);
            });

            editor.addShortcut(['Ctrl-S', 'Cmd-S'], function() { editor.element.trigger('htmleditor-save', [editor]); });
            editor.addShortcutAction('bold', ['Ctrl-B', 'Cmd-B']);

            function addAction(name, replace, mode) {
                editor.on('action.'+name, function() {
                    if (editor.getCursorMode() == 'html') {
                        editor[mode == 'replaceLine' ? 'replaceLine' : 'replaceSelection'](replace);
                    }
                });
            }
        }
    });

});
