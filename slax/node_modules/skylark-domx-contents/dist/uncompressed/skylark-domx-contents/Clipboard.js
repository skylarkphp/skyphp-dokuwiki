define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Clipboard = langx.Evented.inherit({

  });


  Clipboard.pluginName = 'Clipboard';

  Clipboard.prototype.opts = {
    pasteImage: false,
    cleanPaste: false
  };

  Clipboard.prototype.init = function(editable,opts) {
    this.editable = editable; //this._module;
    this.opts = langx.extend({}, this.opts, opts);
    if (this.opts.pasteImage && typeof this.opts.pasteImage !== 'string') {
      this.opts.pasteImage = 'inline';
    }
    this.editable.body.on('paste', (function(_this) {
      return function(e) {
        var range;
        if (_this.pasting || _this._pasteBin) {
          return;
        }
        if (_this.editable.trigger(e) === false) {
          return false;
        }
        range = _this.editable.selection.deleteRangeContents();
        if (_this.editable.body.html()) {
          if (!range.collapsed) {
            range.collapse(true);
          }
        } else {
          _this.editable.formatter.format();
          _this.editable.selection.setRangeAtStartOf(_this.editable.body.find('p:first'));
        }
        if (_this._processPasteByClipboardApi(e)) {
          return false;
        }
        _this.editable.inputManager.throttledValueChanged.clear();
        _this.editable.inputManager.throttledSelectionChanged.clear();
        _this.editable.undoManager.throttledPushState.clear();
        _this.editable.selection.reset();
        _this.editable.undoManager.resetCaretPosition();
        _this.pasting = true;
        return _this._getPasteContent(function(pasteContent) {
          _this._processPasteContent(pasteContent);
          _this._pasteInBlockEl = null;
          _this._pastePlainText = null;
          return _this.pasting = false;
        });
      };
    })(this));
  };

  Clipboard.prototype._processPasteByClipboardApi = function(e) {
    var imageFile, pasteItem, ref, uploadOpt;
    if (this.editable.util.browser.edge) {
      return;
    }
    if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.items && e.originalEvent.clipboardData.items.length > 0) {
      pasteItem = e.originalEvent.clipboardData.items[0];
      if (/^image\//.test(pasteItem.type)) {
        imageFile = pasteItem.getAsFile();
        if (!((imageFile != null) && this.opts.pasteImage)) {
          return;
        }
        if (!imageFile.name) {
          imageFile.name = "Clipboard Image.png";
        }
        if (this.editable.triggerHandler('pasting', [imageFile]) === false) {
          return;
        }
        uploadOpt = {};
        uploadOpt[this.opts.pasteImage] = true;
        if ((ref = this.editable.uploader) != null) {
          ref.upload(imageFile, uploadOpt);
        }
        return true;
      }
    }
  };

  Clipboard.prototype._getPasteContent = function(callback) {
    var state;
    this._pasteBin = $('<div contenteditable="true" />').addClass('paste-bin').attr('tabIndex', '-1').appendTo(this.editable.$el);
    state = {
      html: this.editable.body.html(),
      caret: this.editable.undoManager.caretPosition()
    };
    this._pasteBin.focus();
    return setTimeout((function(_this) {
      return function() {
        var pasteContent;
        //_this.editable.hidePopover();
        _this.editable.body.get(0).innerHTML = state.html;
        _this.editable.undoManager.caretPosition(state.caret);
        _this.editable.body.focus();
        _this.editable.selection.reset();
        _this.editable.selection.range();
        _this._pasteInBlockEl = _this.editable.selection.blockNodes().last();
        _this._pastePlainText = _this.opts.cleanPaste || _this._pasteInBlockEl.is('pre, table');
        if (_this._pastePlainText) {
          pasteContent = _this.editable.formatter.clearHtml(_this._pasteBin.html(), true);
        } else {
          pasteContent = $('<div/>').append(_this._pasteBin.contents());
          pasteContent.find('style').remove();
          pasteContent.find('table colgroup').remove();
          _this._cleanPasteFontSize(pasteContent);
          _this.editable.formatter.format(pasteContent);
          _this.editable.formatter.decorate(pasteContent);
          _this.editable.formatter.beautify(pasteContent.children());
          pasteContent = pasteContent.contents();
        }
        _this._pasteBin.remove();
        _this._pasteBin = null;
        return callback(pasteContent);
      };
    })(this), 0);
  };

  Clipboard.prototype._processPasteContent = function(pasteContent) {
    var $blockEl, $img, blob, children, dataURLtoBlob, img, insertPosition, k, l, lastLine, len, len1, len2, len3, len4, line, lines, m, node, o, q, ref, ref1, ref2, uploadOpt, uploader;
    if (this.editable.trigger('pasting', [pasteContent]) === false) {
      return;
    }
    $blockEl = this._pasteInBlockEl;
    if (!pasteContent) {
      return;
    }
    if (this._pastePlainText) {
      if ($blockEl.is('table')) {
        lines = pasteContent.split('\n');
        lastLine = lines.pop();
        for (k = 0, len = lines.length; k < len; k++) {
          line = lines[k];
          this.editable.selection.insertNode(document.createTextNode(line));
          this.editable.selection.insertNode($('<br/>'));
        }
        this.editable.selection.insertNode(document.createTextNode(lastLine));
      } else {
        pasteContent = $('<div/>').text(pasteContent);
        ref = pasteContent.contents();
        for (l = 0, len1 = ref.length; l < len1; l++) {
          node = ref[l];
          this.editable.selection.insertNode($(node)[0]);
        }
      }
    } else if ($blockEl.is(this.editable.body)) {
      for (m = 0, len2 = pasteContent.length; m < len2; m++) {
        node = pasteContent[m];
        this.editable.selection.insertNode(node);
      }
    } else if (pasteContent.length < 1) {
      return;
    } else if (pasteContent.length === 1) {
      if (pasteContent.is('p')) {
        children = pasteContent.contents();
        if ($blockEl.is('h1, h2, h3, h4, h5')) {
          if (children.length) {
            children.css('font-size', '');
          }
        }
        if (children.length === 1 && children.is('img')) {
          $img = children;
          if (/^data:image/.test($img.attr('src'))) {
            if (!this.opts.pasteImage) {
              return;
            }
            blob = this.editable.util.dataURLtoBlob($img.attr("src"));
            blob.name = "Clipboard Image.png";
            uploadOpt = {};
            uploadOpt[this.opts.pasteImage] = true;
            if ((ref1 = this.editable.uploader) != null) {
              ref1.upload(blob, uploadOpt);
            }
            return;
          } else if (new RegExp('^blob:' + location.origin + '/').test($img.attr('src'))) {
            if (!this.opts.pasteImage) {
              return;
            }
            uploadOpt = {};
            uploadOpt[this.opts.pasteImage] = true;
            dataURLtoBlob = this.editable.util.dataURLtoBlob;
            uploader = this.editable.uploader;
            img = new Image;
            img.onload = function() {
              var canvas;
              canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              canvas.getContext('2d').drawImage(img, 0, 0);
              blob = dataURLtoBlob(canvas.toDataURL('image/png'));
              blob.name = 'Clipboard Image.png';
              if (uploader !== null) {
                uploader.upload(blob, uploadOpt);
              }
            };
            img.src = $img.attr('src');
            return;
          } else if ($img.is('img[src^="webkit-fake-url://"]')) {
            return;
          }
        }
        for (o = 0, len3 = children.length; o < len3; o++) {
          node = children[o];
          this.editable.selection.insertNode(node);
        }
      } else if ($blockEl.is('p') && this.editable.util.isEmptyNode($blockEl)) {
        $blockEl.replaceWith(pasteContent);
        this.editable.selection.setRangeAtEndOf(pasteContent);
      } else if (pasteContent.is('ul, ol')) {
        if (pasteContent.find('li').length === 1) {
          pasteContent = $('<div/>').text(pasteContent.text());
          ref2 = pasteContent.contents();
          for (q = 0, len4 = ref2.length; q < len4; q++) {
            node = ref2[q];
            this.editable.selection.insertNode($(node)[0]);
          }
        } else if ($blockEl.is('li')) {
          $blockEl.parent().after(pasteContent);
          this.editable.selection.setRangeAtEndOf(pasteContent);
        } else {
          $blockEl.after(pasteContent);
          this.editable.selection.setRangeAtEndOf(pasteContent);
        }
      } else {
        $blockEl.after(pasteContent);
        this.editable.selection.setRangeAtEndOf(pasteContent);
      }
    } else {
      if ($blockEl.is('li')) {
        $blockEl = $blockEl.parent();
      }
      if (this.editable.selection.rangeAtStartOf($blockEl)) {
        insertPosition = 'before';
      } else if (this.editable.selection.rangeAtEndOf($blockEl)) {
        insertPosition = 'after';
      } else {
        this.editable.selection.breakBlockEl($blockEl);
        insertPosition = 'before';
      }
      $blockEl[insertPosition](pasteContent);
      this.editable.selection.setRangeAtEndOf(pasteContent.last());
    }
    return this.editable.inputManager.throttledValueChanged();
  };

  Clipboard.prototype._cleanPasteFontSize = function(node) {
    var $node, sizeMap;
    $node = $(node);
    if (!($node.length > 0)) {
      return;
    }
    sizeMap = ['1.5em', '1.25em', '0.75em', '0.5em'];
    return $node.find('[style*="font-size"]').map(function(i, el) {
      var $el;
      $el = $(el);
      if (langx.inArray($el.css('font-size'), sizeMap) < 0) {
        return $el.css('font-size', '');
      }
    });
  };

  return contents.Clipboard = Clipboard;

});

