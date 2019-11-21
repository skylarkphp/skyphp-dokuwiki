define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Keystroke = langx.Evented.inherit({
    init : function(editable,opts) {
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);

      this._keystrokeHandlers = {};
      this._initKeystrokeHandlers();
    }
  });


  Keystroke.pluginName = 'Keystroke';


  Keystroke.prototype.add = function(key, node, handler) {
    key = key.toLowerCase();
    key = this.editable.hotkeys.constructor.aliases[key] || key;
    if (!this._keystrokeHandlers[key]) {
      this._keystrokeHandlers[key] = {};
    }
    return this._keystrokeHandlers[key][node] = handler;
  };

  Keystroke.prototype.respondTo = function(e) {
    var base, key, ref, result;
    key = (ref = this.editable.hotkeys.constructor.keyNameMap[e.which]) != null ? ref.toLowerCase() : void 0;
    if (!key) {
      return;
    }
    if (key in this._keystrokeHandlers) {
      result = typeof (base = this._keystrokeHandlers[key])['*'] === "function" ? base['*'](e) : void 0;
      if (!result) {
        this.editable.selection.startNodes().each((function(_this) {
          return function(i, node) {
            var handler, ref1;
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return;
            }
            handler = (ref1 = _this._keystrokeHandlers[key]) != null ? ref1[node.tagName.toLowerCase()] : void 0;
            result = typeof handler === "function" ? handler(e, $(node)) : void 0;
            if (result === true || result === false) {
              return false;
            }
          };
        })(this));
      }
      if (result) {
        return true;
      }
    }
  };

  Keystroke.prototype._initKeystrokeHandlers = function() {
    var titleEnterHandler;
    if (this.editable.util.browser.safari) {
      this.add('enter', '*', (function(_this) {
        return function(e) {
          var $blockEl, $br;
          if (!e.shiftKey) {
            return;
          }
          $blockEl = _this.editable.selection.blockNodes().last();
          if ($blockEl.is('pre')) {
            return;
          }
          $br = $('<br/>');
          if (_this.editable.selection.rangeAtEndOf($blockEl)) {
            _this.editable.selection.insertNode($br);
            _this.editable.selection.insertNode($('<br/>'));
            _this.editable.selection.setRangeBefore($br);
          } else {
            _this.editable.selection.insertNode($br);
          }
          return true;
        };
      })(this));
    }
    if (this.editable.util.browser.webkit || this.editable.util.browser.msie) {
      titleEnterHandler = (function(_this) {
        return function(e, $node) {
          var $p;
          if (!_this.editable.selection.rangeAtEndOf($node)) {
            return;
          }
          $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
          _this.editable.selection.setRangeAtStartOf($p);
          return true;
        };
      })(this);
      this.add('enter', 'h1', titleEnterHandler);
      this.add('enter', 'h2', titleEnterHandler);
      this.add('enter', 'h3', titleEnterHandler);
      this.add('enter', 'h4', titleEnterHandler);
      this.add('enter', 'h5', titleEnterHandler);
      this.add('enter', 'h6', titleEnterHandler);
    }
    this.add('backspace', '*', (function(_this) {
      return function(e) {
        var $blockEl, $prevBlockEl, $rootBlock, isWebkit;
        $rootBlock = _this.editable.selection.rootNodes().first();
        $prevBlockEl = $rootBlock.prev();
        if ($prevBlockEl.is('hr') && _this.editable.selection.rangeAtStartOf($rootBlock)) {
          _this.editable.selection.save();
          $prevBlockEl.remove();
          _this.editable.selection.restore();
          return true;
        }
        $blockEl = _this.editable.selection.blockNodes().last();
        if ($blockEl.is('.' + this.opts.classPrefix + 'resize-handle') && $rootBlock.is('.' + this.opts.classPrefix + 'table')) {
          e.preventDefault();
          $rootBlock.remove();
          _this.editable.selection.setRangeAtEndOf($prevBlockEl);
        }
        if ($prevBlockEl.is('.' + this.opts.classPrefix + 'table') && !$blockEl.is('table') && _this.editable.util.isEmptyNode($blockEl)) {
          e.preventDefault();
          $blockEl.remove();
          _this.editable.selection.setRangeAtEndOf($prevBlockEl);
        }
        isWebkit = _this.editable.util.browser.webkit;
        if (isWebkit && _this.editable.selection.rangeAtStartOf($blockEl)) {
          _this.editable.selection.save();
          _this.editable.formatter.cleanNode($blockEl, true);
          _this.editable.selection.restore();
          return null;
        }
      };
    })(this));
    this.add('enter', 'div', (function(_this) {
      return function(e, $node) {
        var $blockEl, $p;
        if ($node.is('.' + this.opts.classPrefix + 'table')) {
          $blockEl = _this.editable.selection.blockNodes().last();
          if ($blockEl.is('.' + this.opts.classPrefix + 'resize-handle')) {
            e.preventDefault();
            $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
            return _this.editable.selection.setRangeAtStartOf($p);
          }
        }
      };
    })(this));
    this.add('enter', 'li', (function(_this) {
      return function(e, $node) {
        var $cloneNode, listEl, newBlockEl, newListEl;
        $cloneNode = $node.clone();
        $cloneNode.find('ul, ol').remove();
        if (!(_this.editable.util.isEmptyNode($cloneNode) && $node.is(_this.editable.selection.blockNodes().last()))) {
          return;
        }
        listEl = $node.parent();  
        if ($node.next('li').length > 0) {
          if (!_this.editable.util.isEmptyNode($node)) {
            return;
          }
          if (listEl.parent('li').length > 0) {
            newBlockEl = $('<li/>').append(_this.editable.util.phBr).insertAfter(listEl.parent('li'));
            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
            newBlockEl.append(newListEl);
          } else {
            newBlockEl = $('<p/>').append(_this.editable.util.phBr).insertAfter(listEl);
            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
            newBlockEl.after(newListEl);
          }
        } else {
          if (listEl.parent('li').length > 0) {
            newBlockEl = $('<li/>').insertAfter(listEl.parent('li'));
            if ($node.contents().length > 0) {
              newBlockEl.append($node.contents());
            } else {
              newBlockEl.append(_this.editable.util.phBr);
            }
          } else {
            newBlockEl = $('<p/>').append(_this.editable.util.phBr).insertAfter(listEl);
            if ($node.children('ul, ol').length > 0) {
              newBlockEl.after($node.children('ul, ol'));
            }
          }
        }
        if ($node.prev('li').length) {
          $node.remove();
        } else {
          if ($node.prev('ul').length || $node.prev('ol').length) {
            $node.remove();
          } else {
            listEl.remove();
          }
        }
        _this.editable.selection.setRangeAtStartOf(newBlockEl);
        return true;
      };
    })(this));
    this.add('enter', 'pre', (function(_this) {
      return function(e, $node) {
        var $p, breakNode, range;
        e.preventDefault();
        if (e.shiftKey) {
          $p = $('<p/>').append(_this.editable.util.phBr).insertAfter($node);
          _this.editable.selection.setRangeAtStartOf($p);
          return true;
        }
        range = _this.editable.selection.range();
        breakNode = null;
        range.deleteContents();
        if (!_this.editable.util.browser.msie && _this.editable.selection.rangeAtEndOf($node)) {
          breakNode = document.createTextNode('\n\n');
        } else {
          breakNode = document.createTextNode('\n');
        }
        range.insertNode(breakNode);
        range.setEnd(breakNode, 1);
        range.collapse(false);
        _this.editable.selection.range(range);
        return true;
      };
    })(this));
    this.add('enter', 'blockquote', (function(_this) {
      return function(e, $node) {
        var $closestBlock, range;
        $closestBlock = _this.editable.selection.blockNodes().last();
        if (!($closestBlock.is('p') && !$closestBlock.next().length && _this.editable.util.isEmptyNode($closestBlock))) {
          return;
        }
        $node.after($closestBlock);
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($closestBlock, range);
        return true;
      };
    })(this));
    this.add('backspace', 'li', (function(_this) {
      return function(e, $node) {
        var $br, $childList, $newLi, $prevChildList, $prevNode, $textNode, isFF, range, text;
        $childList = $node.children('ul, ol');
        $prevNode = $node.prev('li');
        if (!($childList.length > 0 && $prevNode.length > 0)) {
          return false;
        }
        text = '';
        $textNode = null;
        $node.contents().each(function(i, n) {
          if (n.nodeType === 1 && /UL|OL/.test(n.nodeName)) {
            return false;
          }
          if (n.nodeType === 1 && /BR/.test(n.nodeName)) {
            return;
          }
          if (n.nodeType === 3 && n.nodeValue) {
            text += n.nodeValue;
          } else if (n.nodeType === 1) {
            text += $(n).text();
          }
          return $textNode = $(n);
        });
        isFF = _this.editable.util.browser.firefox && !$textNode.next('br').length;
        if ($textNode && text.length === 1 && isFF) {
          $br = $(_this.editable.util.phBr).insertAfter($textNode);
          $textNode.remove();
          _this.editable.selection.setRangeBefore($br);
          return true;
        } else if (text.length > 0) {
          return false;
        }
        range = document.createRange();
        $prevChildList = $prevNode.children('ul, ol');
        if ($prevChildList.length > 0) {
          $newLi = $('<li/>').append(_this.editable.util.phBr).appendTo($prevChildList);
          $prevChildList.append($childList.children('li'));
          $node.remove();
          _this.editable.selection.setRangeAtEndOf($newLi, range);
        } else {
          _this.editable.selection.setRangeAtEndOf($prevNode, range);
          $prevNode.append($childList);
          $node.remove();
          _this.editable.selection.range(range);
        }
        return true;
      };
    })(this));
    this.add('backspace', 'pre', (function(_this) {
      return function(e, $node) {
        var $newNode, codeStr, range;
        if (!_this.editable.selection.rangeAtStartOf($node)) {
          return;
        }
        codeStr = $node.html().replace('\n', '<br/>') || _this.editable.util.phBr;
        $newNode = $('<p/>').append(codeStr).insertAfter($node);
        $node.remove();
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($newNode, range);
        return true;
      };
    })(this));
    return this.add('backspace', 'blockquote', (function(_this) {
      return function(e, $node) {
        var $firstChild, range;
        if (!_this.editable.selection.rangeAtStartOf($node)) {
          return;
        }
        $firstChild = $node.children().first().unwrap();
        range = document.createRange();
        _this.editable.selection.setRangeAtStartOf($firstChild, range);
        return true;
      };
    })(this));
  };

  return contents.Keystroke = Keystroke;

});
