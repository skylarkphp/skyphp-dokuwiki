/**
 * skylark-widgets-textpad - The skylark text editor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-textpad/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-textpad/textpad',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("widgets.textpad",{});
});
define('skylark-widgets-textpad/Preview',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-data",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-velm",
  "skylark-domx-query",
  "skylark-widgets-base/widget"
],function(langx,browser,datax,eventer,noder,geom,elmx,$,Widget){

    'use strict';

    var Preview = Widget.inherit({
        klassName: "Preview",

        pluginName : "lark.codeeditor.preview",

        options : {
            className : 'easyeditor',
            css : null,
            onLoaded : null,
            theme : null
        },

        _init :   function ( ){
            this.elem = this._elm;
            this.className = this.options.className ;

            this.css = this.options.css;
            this.onLoaded = this.options.onLoaded;

            this.randomString = "Cls"+Math.random().toString(36).substring(7);
            this.theme = this.options.theme;

            var doc = this.doc = this._elm.ownerDocument;
            this.win = doc.defaultView || doc.parentWindow;

            this.attachEvents();
        },


        attachEvents : function() {
            this.bootstrap();
            this.handleKeypress();
            this.handleResizeImage();
            this.utils();

            if(this.onLoaded !== null) {
                this.onLoaded.call(this);
            }
        },

        // destory editor
        detachEvents : function() {
            var _this = this;

            $(_this.elem).removeClass(_this.className).removeAttr('contenteditable').unwrap();
        },

        // Adding necessary classes and attributes in editor
        bootstrap : function() {
            var _this = this;
            $(_this.elem).attr('contentEditable', true).addClass(_this.className).wrap('<div class="'+ _this.className +'-wrapper"></div>');

            this.$wrapperElem = $(_this.elem).parent();

            if(_this.css !== null) {
                $(_this.elem).css(_this.css);
            }

            this.containerClass = '.' + _this.className +'-wrapper';

            if(typeof _this.elem === 'string') {
                _this.elem = $(_this.elem).get(0);
            }

            if(_this.theme !== null) {
                $(_this.elem).closest(_this.containerClass).addClass(_this.theme);
            }
        },


        // enter and paste key handler
        handleKeypress : function(){
            var _this = this;

            $(_this.elem).keydown(function(e) {
                if(e.keyCode === 13 && _this.isSelectionInsideElement('li') === false) {
     //               e.preventDefault();
    //
    //                if(e.shiftKey === true) {
    //                    document.execCommand('insertHTML', false, '<br>');
    //                }
    //                else {
    //                    document.execCommand('insertHTML', false, '<br><br>');
    //                }
    //
    //                return false;
                }
            });

            _this.elem.addEventListener('paste', function(e) {
                e.preventDefault();
                var text = e.clipboardData.getData('text/plain').replace(/\n/ig, '<br>');
                //document.execCommand('insertHTML', false, text);
                _this.doc.execCommand('insertHTML', false, text);
            });

        },

        isSelectionInsideElement : function(tagName) {
            var sel, containerNode;
            var win = this.win,
                doc = this.doc;
            tagName = tagName.toUpperCase();
            if (win.getSelection) {
                sel = win.getSelection();
                if (sel.rangeCount > 0) {
                    containerNode = sel.getRangeAt(0).commonAncestorContainer;
                }
            } else if ( (sel = doc.selection) && sel.type != "Control" ) {
                containerNode = sel.createRange().parentElement();
            }
            while (containerNode) {
                if (containerNode.nodeType == 1 && containerNode.tagName == tagName) {
                    return true;
                }
                containerNode = containerNode.parentNode;
            }
            return false;
        },

        // allowing resizing image
        handleResizeImage : function(){
            var _this = this;

            $('html').on(_this.containerClass + ' figure', 'click', function(event) {
                event.stopPropagation();
                $(this).addClass('is-resizable');
            });

            $('html').on(_this.containerClass + ' figure.is-resizable', 'mousemove', function(event) {
                $(this).find('img').css({ 'width' : $(this).width() + 'px' });
            });

            $(_this.doc).click(function() {
                $(_this.elem).find('figure').removeClass('is-resizable');
            });
        },

        // get selection
        getSelection : function(){
            if (this.win.getSelection) {
                var selection = this.win.getSelection();

                if (selection.rangeCount) {
                    return selection;
                }
            }

            return false;
        },

        // remove formatting
        removeFormatting : function(arg){
            var _this = this;
            var inFullArea = arg.inFullArea;

            if(_this.isSelectionOutsideOfEditor() === true) {
                return false;
            }

            if(inFullArea === false) {
                var selection = _this.getSelection();
                var selectedText = selection.toString();

                if(selection && selectedText.length > 0) {

                    var range = selection.getRangeAt(0);
                    var $parent = $(range.commonAncestorContainer.parentNode);

                    if($parent.attr('class') === _this.className || $parent.attr('class') === _this.className + '-wrapper') {
                        var node = _this.doc.createElement('span');
                        $(node).attr('data-value', 'temp').html(selectedText.replace(/\n/ig, '<br>'));
                        range.deleteContents();
                        range.insertNode(node);

                        $('[data-value="temp"]').contents().unwrap();
                    }
                    else {

                        var topMostParent;
                        var hasParentNode = false;
                        $.each($parent.parentsUntil(_this.elem), function(index, el) {
                            topMostParent = el;
                            hasParentNode = true;
                        });

                        if(hasParentNode === true) {
                            $(topMostParent).html($(topMostParent).text().replace(/\n/ig, '<br>')).contents().unwrap();
                        }
                        else {
                            $parent.contents().unwrap();
                        }

                    }

                }
            }
            else {
                $(_this.elem).html($(_this.elem).text().replace(/\n/ig, '<br>'));
            }

            // _this.removeEmptyTags();
        },

        // removing empty tags
        removeEmptyTags : function(){
            var _this = this;
            $(_this.elem).html( $(_this.elem).html().replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, '') );
        },

        // remove block elemenet from selection
        removeBlockElementFromSelection : function(selection, removeBr){
            var _this = this;
            var result;

            removeBr = removeBr === undefined ? false : removeBr;
            var removeBrNode = '';
            if(removeBr === true) {
                removeBrNode = ', br';
            }

            var range = selection.getRangeAt(0);
            var selectedHtml = range.cloneContents();
            var temp = _this.doc.createElement('temp');
            $(temp).html(selectedHtml);
            $(temp).find('h1, h2, h3, h4, h5, h6, p, div' + removeBrNode).each(function() { $(this).replaceWith(this.childNodes); });
            result = $(temp).html();

            return result;
        },

        // wrap selction with a tag
        wrapSelectionWithNodeName : function(arg){
            var _this = this;
            if(_this.isSelectionOutsideOfEditor() === true) {
                return false;
            }

            var node = {
                name: 'span',
                blockElement: false,
                style: null,
                class: null,
                attribute: null,
                keepHtml: false
            };

            if(typeof arg === 'string') {
                node.name = arg;
            }
            else {
                node.name = arg.nodeName || node.name;
                node.blockElement = arg.blockElement || node.blockElement;
                node.style = arg.style || node.style;
                node.class = arg.class || node.class;
                node.attribute = arg.attribute || node.attribute;
                node.keepHtml = arg.keepHtml || node.keepHtml;
            }

            var selection = _this.getSelection();

            if(selection && selection.toString().length > 0 && selection.rangeCount) {
                // checking if already wrapped
                var isWrapped = _this.isAlreadyWrapped(selection, node);

                // wrap node
                var range = selection.getRangeAt(0).cloneRange();
                var tag = _this.doc.createElement(node.name);

                    // adding necessary attribute to tag
                    if(node.style !== null || node.class !== null || node.attribute !== null) {
                        tag = _this.addAttribute(tag, node);
                    }

                // if selection contains html, surround contents has some problem with pre html tag and raw text selection
                if(_this.selectionContainsHtml(range)) {
                    range = selection.getRangeAt(0);

                    if(node.keepHtml === true) {
                        var clonedSelection = range.cloneContents();
                        var div = _this.doc.createElement('div');
                        div.appendChild(clonedSelection);
                        $(tag).html(div.innerHTML);
                    }
                    else {
                        tag.textContent = selection.toString();
                    }

                    range.deleteContents();
                    range.insertNode(tag);

                    if(range.commonAncestorContainer.localName === node.name) {
                        $(range.commonAncestorContainer).contents().unwrap();
                        _this.removeEmptyTags();
                    }
                }
                else {
                    range.surroundContents(tag);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

                if(isWrapped === true) {
                    _this.removeWrappedDuplicateTag(tag);
                }

                _this.removeEmptyTags();
                //selection.removeAllRanges();
                selection.select();
                range.select();
            }
        },

        // wrap selection with unordered list
        wrapSelectionWithList : function(tagname){
            var _this = this;
            tagname = tagname || 'ul';

            // preventing outside selection
            if(_this.isSelectionOutsideOfEditor() === true) {
                return false;
            }

            // if text selected
            var selection = _this.getSelection();
            if(selection && selection.toString().length > 0 && selection.rangeCount) {
                var selectedHtml = _this.removeBlockElementFromSelection(selection, true);
                var listArray = selectedHtml.split('\n').filter(function(v){return v!=='';});
                var wrappedListHtml = $.map(listArray, function(item) {
                    return '<li>' + $.trim(item) + '</li>';
                });

                var node = _this.doc.createElement(tagname);
                $(node).html(wrappedListHtml);

                var range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(node);

                selection.removeAllRanges();
            }

        },

        // if selection contains html tag, surround content fails if selection contains html
        selectionContainsHtml : function(range){
            var _this = this;
            if(range.startContainer.parentNode.className === _this.className + '-wrapper') return false;
            else return true;
        },

        // if already wrapped with same tag
        isAlreadyWrapped : function(selection, node){
            var _this = this;
            var range = selection.getRangeAt(0);
            var el = $(range.commonAncestorContainer);
            var result = false;

            if( el.parent().prop('tagName').toLowerCase() === node.name && el.parent().hasClass(_this.className) === false ) {
                result = true;
            }
            else if(node.blockElement === true) {
                $.each(el.parentsUntil(_this.elem), function(index, el) {
                    var tag = el.tagName.toLowerCase();
                    if( $.inArray(tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) !== -1 ) {
                        result = true;
                    }
                });
            }
            else {
                $.each(el.parentsUntil(_this.elem), function(index, el) {
                    var tag = el.tagName.toLowerCase();
                    if( tag === node.name ) {
                        result = true;
                    }
                });
            }

            return result;
        },

        // remove wrap if already wrapped with same tag
        removeWrappedDuplicateTag : function(tag){
            var _this = this;
            var tagName = tag.tagName;

            $(tag).unwrap();

            if($(tag).prop('tagName') === tagName && $(tag).parent().hasClass(_this.className) === false && $(tag).parent().hasClass(_this.className + '-wrapper')) {
                $(tag).unwrap();
            }
        },

        // adding attribute in tag
        addAttribute : function(tag, node){
            if(node.style !== null) {
                $(tag).attr('style', node.style);
            }

            if(node.class !== null) {
                $(tag).addClass(node.class);
            }

            if(node.attribute !== null) {
                if($.isArray(node.attribute) === true) {
                    $(tag).attr(node.attribute[0], node.attribute[1]);
                }
                else {
                    $(tag).attr(node.attribute);
                }
            }

            return tag;
        },

        // insert a node into cursor point in editor
        insertAtCaret : function(node){
            var _this = this;
            if(_this.isSelectionOutsideOfEditor() === true) {
                return false;
            }

            if(_this.getSelection()) {
                var range = _this.getSelection().getRangeAt(0);
                range.insertNode(node);
            }
            else {
                $(node).appendTo(_this.elem);
            }
        },

        // checking if selection outside of editor or not
        isSelectionOutsideOfEditor : function(){
            //return false;
            return !this.elementContainsSelection(this.elem);
        },

        isActive : function(){
            //return false;
            return this.elementContainsSelection(this.elem);
        },

        readonly : function(readonly) {
            if (readonly === undefined) {
                return $(this.elem).attr('contentEditable');
            } else {
                $(this.elem).attr('contentEditable', readonly && true);
                return this;
            }
        },

        // node contains in containers or not
        isOrContains : function(node, container) {
            while (node) {
                if (node === container) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        },

        // selected text is inside container
        elementContainsSelection : function(el) {
            var _this = this;
            var sel;
            if (this.win.getSelection) {
                sel = this.win.getSelection();
                if (sel.rangeCount > 0) {
                    for (var i = 0; i < sel.rangeCount; ++i) {
                        if (!_this.isOrContains(sel.getRangeAt(i).commonAncestorContainer, el)) {
                            return false;
                        }
                    }
                    return true;
                }
            } else if ( (sel = _this.doc.selection) && sel.type !== "Control") {
                return _this.isOrContains(sel.createRange().parentElement(), el);
            }
            return false;
        },

        // insert html chunk into editor's temp tag
        insertHtml : function(html){
            var _this = this;
            $(_this.elem).find('temp').html(html);
        },

        // utility of editor
        utils : function(){
            var _this = this;

            $('html').on('.'+ _this.className +'-modal-close', 'click', function(event) {
                event.preventDefault();
                _this.closeModal('#' + $(this).closest('.'+ _this.className + '-modal').attr('id'));
            });

            if( $('.' + _this.randomString + '-bind').length > 0 ) {
                var bindData;
                $('html').on(_this.elem, 'click keyup', function() {
                    var el = _this.elem;
                    clearTimeout(bindData);
                    bindData = setTimeout(function(){ $('.' + _this.randomString + '-bind').html( $(el).html() ); }, 250);
                });
            }

            $(_this.doc).click(function(event) {
                $('.' + _this.className).closest('.' + _this.className + '-wrapper').find('.' + _this.className + '-toolbar > ul > li > ul').hide();
            });
        },

        // youtube video id from url
        getYoutubeVideoIdFromUrl : function(url){
            if(url.length === 0) return false;
            var videoId = '';
            url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(url[2] !== undefined) {
                videoId = url[2].split(/[^0-9a-z_\-]/i);
                videoId = videoId[0];
            }
            else {
                videoId = url;
            }
            return videoId;
        },

        // opening modal window
        openModal : function(selector){
            var temp = this.doc.createElement('temp');
            temp.textContent = '.';
            this.insertAtCaret(temp);

            $(selector).removeClass('is-hidden');
        },

        // closing modal window
        closeModal : function(selector){
            var _this = this;

            $(selector).addClass('is-hidden').find('input').val('');
            $(selector).find('.' + _this.className + '-modal-content-body-loader').css('width', '0');
            var $temp = $(this.elem).find('temp');

            if($temp.html() === '.') {
                $temp.remove();
            }
            else {
                $temp.contents().unwrap();
            }

            $(this.elem).focus();
        },

        bold : function(){
           this.doc.execCommand("Bold");
           //this.wrapSelectionWithNodeName({ nodeName: 'strong', keepHtml: true });
        },

        italic : function(){
           this.doc.execCommand("Italic");
           //this.wrapSelectionWithNodeName({ nodeName: 'em', keepHtml: true });
        },

        strike : function(){
           this.doc.execCommand("strikethrough");
           //this.wrapSelectionWithNodeName({ nodeName: 'strong', keepHtml: true });
        },

        listOl : function(){
           this.doc.execCommand("insertorderedlist");
           //this.wrapSelectionWithNodeName({ nodeName: 'strong', keepHtml: true });
        },

        listUl : function(){
           this.doc.execCommand("insertunorderedlist");
           //this.wrapSelectionWithNodeName({ nodeName: 'strong', keepHtml: true });
        },

        h2 : function(){
           this.doc.execCommand("h2");
            //this.wrapSelectionWithNodeName({ nodeName: 'h2', blockElement: true });
        },

        h3 : function(){
           this.doc.execCommand("h3");
            //this.wrapSelectionWithNodeName({ nodeName: 'h3', blockElement: true });
        },

        h4 : function(){
           this.doc.execCommand("h4");
            //this.wrapSelectionWithNodeName({ nodeName: 'h4', blockElement: true });
        },

        x : function(){
           this.doc.execCommand("h4");
        },

        alignleft : function(){
           this.doc.execCommand("justifyleft");
            //this.wrapSelectionWithNodeName({ nodeName: 'p', style: 'text-align: left', class: 'text-left', keepHtml: true });
        },

        aligncenter : function(){
           this.doc.execCommand("justifycenter");
            //this.wrapSelectionWithNodeName({ nodeName: 'p', style: 'text-align: center', class: 'text-center', keepHtml: true });
        },

        alignright : function(){
           this.doc.execCommand("justifyright");
            //this.wrapSelectionWithNodeName({ nodeName: 'p', style: 'text-align: right', class: 'text-right', keepHtml: true });
        },

        alignfull : function(){
           this.doc.execCommand("justifyfull");
            //this.wrapSelectionWithNodeName({ nodeName: 'p', style: 'text-align: right', class: 'text-right', keepHtml: true });
        },

        blockquote : function(){
           this.doc.execCommand("blockquote");
            //this.wrapSelectionWithNodeName({ nodeName: 'blockquote' });
        },

        code : function(){
           this.doc.execCommand("p");
            //this.wrapSelectionWithNodeName({ nodeName: 'pre' });
        },

        inserthorizontalrule : function(){
           this.doc.execCommand("inserthorizontalrule");
        },


        image : function(){
           var url = prompt('Insert Image URL','http://');
           var urlRegex = new RegExp('^((http|https)://|(mailto:)|(//))[a-z0-9]', 'i');
           if (url !== null && url !== '' && url !== 'http://' && urlRegex.test(url)) {
               this.doc.execCommand("insertimage", false, url);
           }
        },

        link : function(){
            var url = prompt('Insert URL','http://');
            var urlRegex = new RegExp('^((http|https)://|(mailto:)|(//))[a-z0-9]', 'i');
            if (url !== null && url !== '' && url !== 'http://' && urlRegex.test(url)) {
               this.doc.execCommand("createlink", false, url);
            }
            //this.wrapSelectionWithNodeName({ nodeName: 'a', attribute: ['href', prompt('Insert link', '')] });
        },

        indent : function(){
           this.doc.execCommand("indent");
        },

        outdent : function(){
           this.doc.execCommand("outdent");
        },


        toMd : function() {
            return  toMarkdown(this.elem.innerHTML);
        }
    });

    return Preview;
});

define('skylark-widgets-textpad/helper',[
    "skylark-langx/langx",
    "skylark-domx-query",
	"./textpad"
],function(langx,$,textpad) {
    var helper = {
        debounce : function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        options : function(string) {

            if (langx.type(string)!='string') return string;

            if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
                string = '{'+string+'}';
            }

            var start = (string ? string.indexOf("{") : -1), options = {};

            if (start != -1) {
                try {
                    options = helper.str2json(string.substr(start));
                } catch (e) {}
            }

            return options;
        },
        str2json : function(str, notevil) {
            try {
                if (notevil) {
                    return JSON.parse(str
                        // wrap keys without quote with valid double quote
                        .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                        // replacing single quote wrapped ones to double quote
                        .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
                    );
                } else {
                    return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
                }
            } catch(e) { return false; }
        }
    };


    return textpad.helper = helper;

  	
 });
define('skylark-widgets-textpad/editor',[
    "skylark-langx/langx",
    "skylark-domx-query",
    "skylark-widgets-base/widget",
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


define('skylark-widgets-textpad/main',[
    "./textpad",
    "./editor"
], function(textpad) {
    return textpad;
});
define('skylark-widgets-textpad', ['skylark-widgets-textpad/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-textpad.js.map
