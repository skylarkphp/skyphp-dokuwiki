define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 
 

  var indexOf = [].indexOf ;

  var InputManager = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable;
      this.opts = langx.extend({}, this.opts, opts);

      var selectAllKey, submitKey;
      this.throttledValueChanged = this.editable.util.throttle((function(_this) {
        return function(params) {
          return setTimeout(function() {
            return _this.editable.trigger('valuechanged', params);
          }, 10);
        };
      })(this), 300);
      this.throttledSelectionChanged = this.editable.util.throttle((function(_this) {
        return function() {
          return _this.editable.trigger('selectionchanged');
        };
      })(this), 50);
      $(document).on('selectionchange.simditor' + this.editable.id, (function(_this) {
        return function(e) {
          var triggerEvent;
          if (!(_this.focused && !_this.editable.clipboard.pasting)) {
            return;
          }
          triggerEvent = function() {
            if (_this._selectionTimer) {
              clearTimeout(_this._selectionTimer);
              _this._selectionTimer = null;
            }
            if (_this.editable.selection._selection.rangeCount > 0) {
              return _this.throttledSelectionChanged();
            } else {
              return _this._selectionTimer = setTimeout(function() {
                _this._selectionTimer = null;
                if (_this.focused) {
                  return triggerEvent();
                }
              }, 10);
            }
          };
          return triggerEvent();
        };
      })(this));
      this.editable.on('valuechanged', (function(_this) {
        return function() {
          var $rootBlocks;
          _this.lastCaretPosition = null;
          $rootBlocks = _this.editable.body.children().filter(function(i, node) {
            return _this.editable.util.isBlockNode(node);
          });
          if (_this.focused && $rootBlocks.length === 0) {
            _this.editable.selection.save();
            _this.editable.formatter.format();
            _this.editable.selection.restore();
          }
          _this.editable.body.find('hr, pre, .' + _this.opts.classPrefix + 'table').each(function(i, el) {
            var $el, formatted;
            $el = $(el);
            if ($el.parent().is('blockquote') || $el.parent()[0] === _this.editable.body[0]) {
              formatted = false;
              if ($el.next().length === 0) {
                $('<p/>').append(_this.editable.util.phBr).insertAfter($el);
                formatted = true;
              }
              if ($el.prev().length === 0) {
                $('<p/>').append(_this.editable.util.phBr).insertBefore($el);
                formatted = true;
              }
              if (formatted) {
                return _this.throttledValueChanged();
              }
            }
          });
          _this.editable.body.find('pre:empty').append(_this.editable.util.phBr);
          if (!_this.editable.util.support.onselectionchange && _this.focused) {
            return _this.throttledSelectionChanged();
          }
        };
      })(this));
      this.editable.body.on('keydown', langx.proxy(this._onKeyDown, this)).on('keypress', langx.proxy(this._onKeyPress, this)).on('keyup', langx.proxy(this._onKeyUp, this)).on('mouseup', langx.proxy(this._onMouseUp, this)).on('focus', langx.proxy(this._onFocus, this)).on('blur', langx.proxy(this._onBlur, this)).on('drop', langx.proxy(this._onDrop, this)).on('input', langx.proxy(this._onInput, this));
      if (this.editable.util.browser.firefox) {
        this.editable.hotkeys.add('cmd+left', (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.editable.selection._selection.modify('move', 'backward', 'lineboundary');
            return false;
          };
        })(this));
        this.editable.hotkeys.add('cmd+right', (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.editable.selection._selection.modify('move', 'forward', 'lineboundary');
            return false;
          };
        })(this));
        selectAllKey = this.editable.util.os.mac ? 'cmd+a' : 'ctrl+a';
        this.editable.hotkeys.add(selectAllKey, (function(_this) {
          return function(e) {
            var $children, firstBlock, lastBlock, range;
            $children = _this.editable.body.children();
            if (!($children.length > 0)) {
              return;
            }
            firstBlock = $children.first().get(0);
            lastBlock = $children.last().get(0);
            range = document.createRange();
            range.setStart(firstBlock, 0);
            range.setEnd(lastBlock, _this.editable.util.getNodeLength(lastBlock));
            _this.editable.selection.range(range);
            return false;
          };
        })(this));
      }
      submitKey = this.editable.util.os.mac ? 'cmd+enter' : 'ctrl+enter';
      this.editable.hotkeys.add(submitKey, (function(_this) {
        return function(e) {
          _this.editable.$el.closest('form').find('button:submit').click();
          return false;
        };
      })(this));
    }

  });

  InputManager.pluginName = 'InputManager';

  InputManager.prototype._modifierKeys = [16, 17, 18, 91, 93, 224];

  InputManager.prototype._arrowKeys = [37, 38, 39, 40];


  InputManager.prototype._onFocus = function(e) {
    if (this.editable.clipboard.pasting) {
      return;
    }
    this.editable.$el.addClass('focus').removeClass('error');
    this.focused = true;
    return setTimeout((function(_this) {
      return function() {
        var $blockEl, range;
        range = _this.editable.selection._selection.getRangeAt(0);
        if (range.startContainer === _this.editable.body[0]) {
          if (_this.lastCaretPosition) {
            _this.editable.undoManager.caretPosition(_this.lastCaretPosition);
          } else {
            $blockEl = _this.editable.body.children().first();
            range = document.createRange();
            _this.editable.selection.setRangeAtStartOf($blockEl, range);
            console.log("aaaaaa");
          }
        }
        _this.lastCaretPosition = null;
        _this.editable.trigger('focus');
        if (!_this.editable.util.support.onselectionchange) {
          return _this.throttledSelectionChanged();
        }
      };
    })(this), 0);
  };

  InputManager.prototype._onBlur = function(e) {
    var ref;
    if (this.editable.clipboard.pasting) {
      return;
    }
    this.editable.$el.removeClass('focus');
    this.editable.sync();
    this.focused = false;
    this.lastCaretPosition = (ref = this.editable.undoManager.currentState()) != null ? ref.caret : void 0;
    return this.editable.trigger('blur');
  };

  InputManager.prototype._onMouseUp = function(e) {
    if (!this.editable.util.support.onselectionchange) {
      return this.throttledSelectionChanged();
    }
  };

  InputManager.prototype._onKeyDown = function(e) {
    var ref, ref1;
    if (this.editable.trigger(e) === false) {
      return false;
    }
    if (this.editable.hotkeys.respondTo(e)) {
      return;
    }
    if (this.editable.keystroke.respondTo(e)) {
      this.throttledValueChanged();
      return false;
    }
    if ((ref = e.which, indexOf.call(this._modifierKeys, ref) >= 0) || (ref1 = e.which, indexOf.call(this._arrowKeys, ref1) >= 0)) {
      return;
    }
    if (this.editable.util.metaKey(e) && e.which === 86) {
      return;
    }
    if (!this.editable.util.support.oninput) {
      this.throttledValueChanged(['typing']);
    }
    return null;
  };

  InputManager.prototype._onKeyPress = function(e) {
    if (this.editable.trigger(e) === false) {
      return false;
    }
  };

  InputManager.prototype._onKeyUp = function(e) {
    var p, ref;
    if (this.editable.trigger(e) === false) {
      return false;
    }
    if (!this.editable.util.support.onselectionchange && (ref = e.which, indexOf.call(this._arrowKeys, ref) >= 0)) {
      this.throttledValueChanged();
      return;
    }
    if ((e.which === 8 || e.which === 46) && this.editable.util.isEmptyNode(this.editable.body)) {
      this.editable.body.empty();
      p = $('<p/>').append(this.editable.util.phBr).appendTo(this.editable.body);
      this.editable.selection.setRangeAtStartOf(p);
    }
  };

  InputManager.prototype._onDrop = function(e) {
    if (this.editable.trigger(e) === false) {
      return false;
    }
    return this.throttledValueChanged();
  };

  InputManager.prototype._onInput = function(e) {
    return this.throttledValueChanged(['oninput']);
  };

  return contents.InputManager = InputManager;

});
