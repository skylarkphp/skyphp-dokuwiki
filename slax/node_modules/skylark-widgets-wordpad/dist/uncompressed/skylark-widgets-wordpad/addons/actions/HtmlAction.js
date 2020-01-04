define([
  "skylark-domx-query",
  "skylark-codemirror/CodeMirror",
  "../../addons",
  "../../Action",
//  "skylark-codemirror/addon/fold/foldcode",
//  "skylark-codemirror/addon/fold/foldgutter",
//  "skylark-codemirror/addon/fold/brace-fold",
//  "skylark-codemirror/addon/fold/xml-fold",
//  "skylark-codemirror/addon/fold/indent-fold",
//  "skylark-codemirror/addon/fold/markdown-fold",
//  "skylark-codemirror/addon/fold/comment-fold",  
  "skylark-parsers-html",
  "skylark-codemirror/addon/beautify/beautify",  
  "skylark-codemirror/mode/xml/xml",
  "skylark-codemirror/mode/css/css",
  "skylark-codemirror/mode/javascript/javascript",
  "skylark-codemirror/mode/htmlmixed/htmlmixed"
],function($,CodeMirror,addons,Action,html){ 
   var  hasProp = {}.hasOwnProperty,
        slice = [].slice;
  

   var HtmlAction = Action.inherit({
    name : 'html',

    icon : 'html',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);
      this.editor.textarea.on('focus', (function(_this) {
        return function(e) {
          return _this.editor.el.addClass('focus').removeClass('error');
        };
      })(this));
      this.editor.textarea.on('blur', (function(_this) {
        return function(e) {
          _this.editor.el.removeClass('focus');
          return _this.editor.setValue(_this.editor.textarea.val());
        };
      })(this));
      return this.editor.textarea.on('input', (function(_this) {
        return function(e) {
          return _this._resizeTextarea();
        };
      })(this));
    },

    status : function() {},

    _execute : function() {
      var action, i, len, ref,
          self = this;
      this.editor.blur();
      this.editor.el.toggleClass('wordpad-html');
      this.editor.htmlMode = this.editor.el.hasClass('wordpad-html');
      if (this.editor.htmlMode) {
        this.editor.hidePopover();
        //this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val()));
        var  codemirrorOptions =  { 
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
          },
          beautify : {
            html : {
              beautifyFunc: html.beautify
            }
          },
          
  //        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
  //        foldGutter: true,
  //        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineNumbers: true
  
        };
       this.editor.sync(); 
       if (!this.CodeMirrorEditor) {
         this.CodeMirrorEditor = CodeMirror.fromTextArea(this.editor.textarea[0], codemirrorOptions);
         this.CodeMirrorEditor.on("blur",function(){
           self.editor.setValue(self.CodeMirrorEditor.getValue());
         })
       } else {
         this.CodeMirrorEditor.setValue(this.editor.textarea.val());
         this.CodeMirrorEditor.beautify();
       }
       //this._resizeTextarea();

      } else {
        this.editor.setValue(this.CodeMirrorEditor.getValue());
        //this.editor.setValue(this.editor.textarea.val());
      }
      ref = this.editor._actions;
      for (i = 0, len = ref.length; i < len; i++) {
        action = ref[i];
        if (action.name === 'html') {
          action.setActive(this.editor.htmlMode);
        } else {
          action.setDisabled(this.editor.htmlMode);
        }
      }
      return null;
    },

    beautifyHTML : function() {
      return arguments[0];
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (beautify.html) {
        return beautify.html.apply(beautify, args);
      } else {
        return beautify.apply(null, args);
      }
    },

    _resizeTextarea : function() {
      this._textareaPadding || (this._textareaPadding = this.editor.textarea.innerHeight() - this.editor.textarea.height());
      return this.editor.textarea.height(this.editor.textarea[0].scrollHeight - this._textareaPadding);
    }

   });


   addons.actions.html = HtmlAction; 

   return HtmlAction;
});