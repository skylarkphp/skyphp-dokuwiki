define([
  "skylark-domx-query",
  "../../addons",
  "../../action",
  "./code-popover"
],function($,addons,Action,CodePopover){ 
  

   var CodeAction = Action.inherit({
      name : 'code',

      icon : 'code',

      htmlTag : 'pre',

      disableTag : 'ul, ol, table',

      _init : function() {
        Action.prototype._init.call(this);
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.decorate($(pre));
            });
          };
        })(this));
        return this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('pre').each(function(i, pre) {
              return _this.undecorate($(pre));
            });
          };
        })(this));
      },

      _checkMode : function() {
        var $blockNodes, range;
        range = this.editor.editable.selection.range();
        if (($blockNodes = $(range.cloneContents()).find(this.editor.editable.util.blockNodes.join(','))) > 0 || (range.collapsed && this.editor.editable.selection.startNodes().filter('code').length === 0)) {
          this.inlineMode = false;
          return this.htmlTag = 'pre';
        } else {
          this.inlineMode = true;
          return this.htmlTag = 'code';
        }
      },

      _status : function() {
        this._checkMode();
        Action.prototype._status.call(this);
        if (this.inlineMode) {
          return;
        }
        if (this.active) {
          if (!this.popover) {
            this.popover = new CodePopover({
              action: this
            });
          }
          return this.popover.show(this.node);
        } else {
          if (this.popover) {
            return this.popover.hide();
          }
        }
      },

      decorate : function($pre) {
        var $code, lang, ref, ref1;
        $code = $pre.find('> code');
        if ($code.length > 0) {
          lang = (ref = $code.attr('class')) != null ? (ref1 = ref.match(/lang-(\S+)/)) != null ? ref1[1] : void 0 : void 0;
          $code.contents().unwrap();
          if (lang) {
            return $pre.attr('data-lang', lang);
          }
        }
      },

      undecorate : function($pre) {
        var $code, lang;
        lang = $pre.attr('data-lang');
        $code = $('<code/>');
        if (lang && lang !== -1) {
          $code.addClass('lang-' + lang);
        }
        return $pre.wrapInner($code).removeAttr('data-lang');
      },

      _execute : function() {
        if (this.inlineMode) {
          return this._inlineCommand();
        } else {
          return this._blockCommand();
        }
      },

      _blockCommand : function() {
        return this.editor.editable.blockCode(this.htmlTag,this.disableTag);
      },

      _inlineCommand : function() {
        return this.editor.editable.inlineCode(this.active);
      }
   });


   addons.actions.code = CodeAction; 

   return CodeAction;

});