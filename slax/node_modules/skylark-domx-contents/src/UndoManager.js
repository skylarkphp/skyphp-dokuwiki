define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var UndoManager = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable;
      this.opts = langx.extend({}, this.opts, opts);

      var redoShortcut, undoShortcut;
      this._stack = [];
      if (this.editable.util.os.mac) {
        undoShortcut = 'cmd+z';
        redoShortcut = 'shift+cmd+z';
      } else if (this.editable.util.os.win) {
        undoShortcut = 'ctrl+z';
        redoShortcut = 'ctrl+y';
      } else {
        undoShortcut = 'ctrl+z';
        redoShortcut = 'shift+ctrl+z';
      }
      this.editable.hotkeys.add(undoShortcut, (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.undo();
          return false;
        };
      })(this));
      this.editable.hotkeys.add(redoShortcut, (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.redo();
          return false;
        };
      })(this));
      this.throttledPushState = this.editable.util.throttle((function(_this) {
        return function() {
          return _this._pushUndoState();
        };
      })(this), 2000);
      this.editable.on('valuechanged', (function(_this) {
        return function(e, src) {
          if (src === 'undo' || src === 'redo') {
            return;
          }
          return _this.throttledPushState();
        };
      })(this));
      this.editable.on('selectionchanged', (function(_this) {
        return function(e) {
          _this.resetCaretPosition();
          return _this.update();
        };
      })(this));
      this.editable.on('focus', (function(_this) {
        return function(e) {
          if (_this._stack.length === 0) {
            return _this._pushUndoState();
          }
        };
      })(this));
      this.editable.on('blur', (function(_this) {
        return function(e) {
          return _this.resetCaretPosition();
        };
      })(this));
    }

  });

  UndoManager.pluginName = 'UndoManager';

  UndoManager.prototype._index = -1;

  UndoManager.prototype._capacity = 20;

  UndoManager.prototype._startPosition = null;

  UndoManager.prototype._endPosition = null;

  UndoManager.prototype.resetCaretPosition = function() {
    this._startPosition = null;
    return this._endPosition = null;
  };

  UndoManager.prototype.startPosition = function() {
    if (this.editable.selection._range) {
      this._startPosition || (this._startPosition = this._getPosition('start'));
    }
    return this._startPosition;
  };

  UndoManager.prototype.endPosition = function() {
    if (this.editable.selection._range) {
      this._endPosition || (this._endPosition = (function(_this) {
        return function() {
          var range;
          range = _this.editable.selection.range();
          if (range.collapsed) {
            return _this._startPosition;
          }
          return _this._getPosition('end');
        };
      })(this)());
    }
    return this._endPosition;
  };

  UndoManager.prototype._pushUndoState = function() {
    var caret;
    if (this.editable.trigger('pushundostate') === false) {
      return;
    }
    caret = this.caretPosition();
    if (!caret.start) {
      return;
    }
    this._index += 1;
    this._stack.length = this._index;
    this._stack.push({
      html: this.editable.body.html(),
      caret: this.caretPosition()
    });
    if (this._stack.length > this._capacity) {
      this._stack.shift();
      return this._index -= 1;
    }
  };

  UndoManager.prototype.currentState = function() {
    if (this._stack.length && this._index > -1) {
      return this._stack[this._index];
    } else {
      return null;
    }
  };

  UndoManager.prototype.undo = function() {
    var state;
    if (this._index < 1 || this._stack.length < 2) {
      return;
    }
    //this.editable.hidePopover();
    this._index -= 1;
    state = this._stack[this._index];
    this.editable.body.get(0).innerHTML = state.html;
    this.caretPosition(state.caret);
    this.editable.body.find('.selected').removeClass('selected');
    this.editable.sync();
    return this.editable.trigger('valuechanged', ['undo']);
  };

  UndoManager.prototype.redo = function() {
    var state;
    if (this._index < 0 || this._stack.length < this._index + 2) {
      return;
    }
    //this.editable.hidePopover();
    this._index += 1;
    state = this._stack[this._index];
    this.editable.body.get(0).innerHTML = state.html;
    this.caretPosition(state.caret);
    this.editable.body.find('.selected').removeClass('selected');
    this.editable.sync();
    return this.editable.trigger('valuechanged', ['redo']);
  };

  UndoManager.prototype.update = function() {
    var currentState;
    currentState = this.currentState();
    if (!currentState) {
      return;
    }
    currentState.html = this.editable.body.html();
    return currentState.caret = this.caretPosition();
  };

  UndoManager.prototype._getNodeOffset = function(node, index) {
    var $parent, merging, offset;
    if (langx.isNumber(index)) {
      $parent = $(node);
    } else {
      $parent = $(node).parent();
    }
    offset = 0;
    merging = false;
    $parent.contents().each(function(i, child) {
      if (node === child || (index === i && i === 0)) {
        return false;
      }
      if (child.nodeType === Node.TEXT_NODE) {
        if (!merging && child.nodeValue.length > 0) {
          offset += 1;
          merging = true;
        }
      } else {
        offset += 1;
        merging = false;
      }
      if (index - 1 === i) {
        return false;
      }
      return null;
    });
    return offset;
  };

  UndoManager.prototype._getPosition = function(type) {
    var $nodes, node, nodes, offset, position, prevNode, range;
    if (type == null) {
      type = 'start';
    }
    range = this.editable.selection.range();
    offset = range[type + "Offset"];
    $nodes = this.editable.selection[type + "Nodes"]();
    node = $nodes.first()[0];
    if (node.nodeType === Node.TEXT_NODE) {
      prevNode = node.previousSibling;
      while (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
        node = prevNode;
        offset += this.editable.util.getNodeLength(prevNode);
        prevNode = prevNode.previousSibling;
      }
      nodes = $nodes.get();
      nodes[0] = node;
      $nodes = $(nodes);
    } else {
      offset = this._getNodeOffset(node, offset);
    }
    position = [offset];
    $nodes.each((function(_this) {
      return function(i, node) {
        return position.unshift(_this._getNodeOffset(node));
      };
    })(this));
    return position;
  };

  UndoManager.prototype._getNodeByPosition = function(position) {
    var child, childNodes, i, k, len, node, offset, ref;
    node = this.editable.body[0];
    ref = position.slice(0, position.length - 1);
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      offset = ref[i];
      childNodes = node.childNodes;
      if (offset > childNodes.length - 1) {
        if (i === position.length - 2 && $(node).is(':empty')) {
          child = document.createTextNode('');
          node.appendChild(child);
          childNodes = node.childNodes;
        } else {
          node = null;
          break;
        }
      }
      node = childNodes[offset];
    }
    return node;
  };

  UndoManager.prototype.caretPosition = function(caret) {
    var endContainer, endOffset, range, startContainer, startOffset;
    if (!caret) {
      range = this.editable.selection.range();
      caret = this.editable.inputManager.focused && (range != null) ? {
        start: this.startPosition(),
        end: this.endPosition(),
        collapsed: range.collapsed
      } : {};
      return caret;
    } else {
      if (!caret.start) {
        return;
      }
      startContainer = this._getNodeByPosition(caret.start);
      startOffset = caret.start[caret.start.length - 1];
      if (caret.collapsed) {
        endContainer = startContainer;
        endOffset = startOffset;
      } else {
        endContainer = this._getNodeByPosition(caret.end);
        endOffset = caret.start[caret.start.length - 1];
      }
      if (!startContainer || !endContainer) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn('simditor: invalid caret state');
          }
        }
        return;
      }
      range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      return this.editable.selection.range(range);
    }
  };

  return contents.UndoManager = UndoManager;

});