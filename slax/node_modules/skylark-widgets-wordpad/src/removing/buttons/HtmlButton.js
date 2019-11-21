define([
  "skylark-domx-query",
  "../Toolbar",
  "../Wordpad",
  "../Button"
],function($,Toolbar,Wordpad,Button){ 
   var  hasProp = {}.hasOwnProperty,
        slice = [].slice;
  

   var HtmlButton = Button.inherit({

   });

  HtmlButton.prototype.name = 'html';

  HtmlButton.prototype.icon = 'html5';

  HtmlButton.prototype.needFocus = false;

  HtmlButton.prototype._init = function() {
    Button.prototype._init.call(this);
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
  };

  HtmlButton.prototype.status = function() {};

  HtmlButton.prototype.command = function() {
    var button, i, len, ref;
    this.editor.blur();
    this.editor.el.toggleClass('wordpad-html');
    this.editor.htmlMode = this.editor.el.hasClass('wordpad-html');
    if (this.editor.htmlMode) {
      this.editor.hidePopover();
      this.editor.textarea.val(this.beautifyHTML(this.editor.textarea.val()));
      this._resizeTextarea();
    } else {
      this.editor.setValue(this.editor.textarea.val());
    }
    ref = this.editor.toolbar.buttons;
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      if (button.name === 'html') {
        button.setActive(this.editor.htmlMode);
      } else {
        button.setDisabled(this.editor.htmlMode);
      }
    }
    return null;
  };

  HtmlButton.prototype.beautifyHTML = function() {
    return arguments[0];
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (beautify.html) {
      return beautify.html.apply(beautify, args);
    } else {
      return beautify.apply(null, args);
    }
  };

  HtmlButton.prototype._resizeTextarea = function() {
    this._textareaPadding || (this._textareaPadding = this.editor.textarea.innerHeight() - this.editor.textarea.height());
    return this.editor.textarea.height(this.editor.textarea[0].scrollHeight - this._textareaPadding);
  };
  Wordpad.Toolbar.addButton(HtmlButton);

  return HtmlButton;
	
});