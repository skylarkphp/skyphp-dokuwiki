/**
 * skylark-domx-contents - A dom plugin for  editing  the content of html element.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
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

define('skylark-domx-contents/contents',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data"
], function(skylark, langx, noder,datax) {
    "use strict";

    var contents = function() {
        return contents;
    };


    return skylark.attach("domx.contents",contents);

});
define('skylark-domx-contents/hotkeys',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 


  var Hotkeys = langx.Evented.inherit({

  });


  Hotkeys.count = 0;

  Hotkeys.keyNameMap = {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Esc",
    32: "Spacebar",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    45: "Insert",
    46: "Del",
    91: "Meta",
    93: "Meta",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    96: "0",
    97: "1",
    98: "2",
    99: "3",
    100: "4",
    101: "5",
    102: "6",
    103: "7",
    104: "8",
    105: "9",
    106: "Multiply",
    107: "Add",
    109: "Subtract",
    110: "Decimal",
    111: "Divide",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",
    59: ";",
    61: "=",
    186: ";",
    187: "=",
    188: ",",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
  };

  Hotkeys.aliases = {
    "escape": "esc",
    "delete": "del",
    "return": "enter",
    "ctrl": "control",
    "space": "spacebar",
    "ins": "insert",
    "cmd": "meta",
    "command": "meta",
    "wins": "meta",
    "windows": "meta"
  };

  Hotkeys.normalize = function(shortcut) {
    var i, j, key, keyname, keys, len;
    keys = shortcut.toLowerCase().replace(/\s+/gi, "").split("+");
    for (i = j = 0, len = keys.length; j < len; i = ++j) {
      key = keys[i];
      keys[i] = this.aliases[key] || key;
    }
    keyname = keys.pop();
    keys.sort().push(keyname);
    return keys.join("_");
  };

  Hotkeys.prototype.opts = {
    el: document
  };

  Hotkeys.prototype.init = function() {
    this.id = ++this.constructor.count;
    this._map = {};
    this._delegate = typeof this.opts.el === "string" ? document : this.opts.el;
    $(this._delegate).on("keydown.simple-hotkeys-" + this.id, this.opts.el, (function(_this) {
      return function(e) {
        var ref;
        return (ref = _this._getHander(e)) != null ? ref.call(_this, e) : void 0;
      };
    })(this));
  };

  Hotkeys.prototype._getHander = function(e) {
    var keyname, shortcut;
    if (!(keyname = this.constructor.keyNameMap[e.which])) {
      return;
    }
    shortcut = "";
    if (e.altKey) {
      shortcut += "alt_";
    }
    if (e.ctrlKey) {
      shortcut += "control_";
    }
    if (e.metaKey) {
      shortcut += "meta_";
    }
    if (e.shiftKey) {
      shortcut += "shift_";
    }
    shortcut += keyname.toLowerCase();
    return this._map[shortcut];
  };

  Hotkeys.prototype.respondTo = function(subject) {
    if (typeof subject === 'string') {
      return this._map[this.constructor.normalize(subject)] != null;
    } else {
      return this._getHander(subject) != null;
    }
  };

  Hotkeys.prototype.add = function(shortcut, handler) {
    this._map[this.constructor.normalize(shortcut)] = handler;
    return this;
  };

  Hotkeys.prototype.remove = function(shortcut) {
    delete this._map[this.constructor.normalize(shortcut)];
    return this;
  };

  Hotkeys.prototype.destroy = function() {
    $(this._delegate).off(".simple-hotkeys-" + this.id);
    this._map = {};
    return this;
  };

  return  contents.Hotkeys = Hotkeys;

});


define('skylark-domx-contents/util',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 

  var Util = langx.Evented.inherit({
    init : function(editor,opts) {
      this.editor = editor; // this._module;
      this.opts = langx.extend({}, this.opts, opts);
      if (this.browser.msie && this.browser.version < 11) {
        return this.phBr = '';
      }
    }

  });

  Util.pluginName = 'Util';

  Util.prototype.phBr = '<br/>';

  Util.prototype.os = (function() {
    var os;
    os = {};
    if (/Mac/.test(navigator.appVersion)) {
      os.mac = true;
    } else if (/Linux/.test(navigator.appVersion)) {
      os.linux = true;
    } else if (/Win/.test(navigator.appVersion)) {
      os.win = true;
    } else if (/X11/.test(navigator.appVersion)) {
      os.unix = true;
    }
    if (/Mobi/.test(navigator.appVersion)) {
      os.mobile = true;
    }
    return os;
  })();

  Util.prototype.browser = (function() {
    var chrome, edge, firefox, ie, ref, ref1, ref2, ref3, ref4, safari, ua;
    ua = navigator.userAgent;
    ie = /(msie|trident)/i.test(ua);
    chrome = /chrome|crios/i.test(ua);
    safari = /safari/i.test(ua) && !chrome;
    firefox = /firefox/i.test(ua);
    edge = /edge/i.test(ua);
    if (ie) {
      return {
        msie: true,
        version: ((ref = ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)) != null ? ref[2] : void 0) * 1
      };
    } else if (edge) {
      return {
        edge: true,
        webkit: true,
        version: ((ref1 = ua.match(/edge\/(\d+(\.\d+)?)/i)) != null ? ref1[1] : void 0) * 1
      };
    } else if (chrome) {
      return {
        webkit: true,
        chrome: true,
        version: ((ref2 = ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)) != null ? ref2[1] : void 0) * 1
      };
    } else if (safari) {
      return {
        webkit: true,
        safari: true,
        version: ((ref3 = ua.match(/version\/(\d+(\.\d+)?)/i)) != null ? ref3[1] : void 0) * 1
      };
    } else if (firefox) {
      return {
        mozilla: true,
        firefox: true,
        version: ((ref4 = ua.match(/firefox\/(\d+(\.\d+)?)/i)) != null ? ref4[1] : void 0) * 1
      };
    } else {
      return {};
    }
  })();

  Util.prototype.support = (function() {
    return {
      onselectionchange: (function() {
        var e, onselectionchange;
        onselectionchange = document.onselectionchange;
        if (onselectionchange !== void 0) {
          try {
            document.onselectionchange = 0;
            return document.onselectionchange === null;
          } catch (_error) {
            e = _error;
          } finally {
            document.onselectionchange = onselectionchange;
          }
        }
        return false;
      })(),
      oninput: (function() {
        return !/(msie|trident)/i.test(navigator.userAgent);
      })()
    };
  })();

  Util.prototype.reflow = function(el) {
    if (el == null) {
      el = document;
    }
    return $(el)[0].offsetHeight;
  };

  Util.prototype.metaKey = function(e) {
    var isMac;
    isMac = /Mac/.test(navigator.userAgent);
    if (isMac) {
      return e.metaKey;
    } else {
      return e.ctrlKey;
    }
  };

  Util.prototype.isEmptyNode = function(node) {
    var $node;
    $node = $(node);
    return $node.is(':empty') || (!$node.text() && !$node.find(':not(br, span, div)').length);
  };

  Util.prototype.isDecoratedNode = function(node) {
    return $(node).is('[class^="' + this.opts.classPrefix + '"]');
  };

  Util.prototype.blockNodes = ["div", "p", "ul", "ol", "li", "blockquote", "hr", "pre", "h1", "h2", "h3", "h4", "h5", "table"];

  Util.prototype.isBlockNode = function(node) {
    node = $(node)[0];
    if (!node || node.nodeType === 3) {
      return false;
    }
    return new RegExp("^(" + (this.blockNodes.join('|')) + ")$").test(node.nodeName.toLowerCase());
  };

  Util.prototype.getNodeLength = function(node) {
    node = $(node)[0];
    switch (node.nodeType) {
      case 7:
      case 10:
        return 0;
      case 3:
      case 8:
        return node.length;
      default:
        return node.childNodes.length;
    }
  };

  Util.prototype.dataURLtoBlob = function(dataURL) {
    var BlobBuilder, arrayBuffer, bb, blobArray, byteString, hasArrayBufferViewSupport, hasBlobConstructor, i, intArray, k, mimeString, ref, supportBlob;
    hasBlobConstructor = window.Blob && (function() {
      var e;
      try {
        return Boolean(new Blob());
      } catch (_error) {
        e = _error;
        return false;
      }
    })();
    hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && (function() {
      var e;
      try {
        return new Blob([new Uint8Array(100)]).size === 100;
      } catch (_error) {
        e = _error;
        return false;
      }
    })();
    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    supportBlob = hasBlobConstructor || BlobBuilder;
    if (!(supportBlob && window.atob && window.ArrayBuffer && window.Uint8Array)) {
      return false;
    }
    if (dataURL.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURL.split(',')[1]);
    } else {
      byteString = decodeURIComponent(dataURL.split(',')[1]);
    }
    arrayBuffer = new ArrayBuffer(byteString.length);
    intArray = new Uint8Array(arrayBuffer);
    for (i = k = 0, ref = byteString.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      intArray[i] = byteString.charCodeAt(i);
    }
    mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    if (hasBlobConstructor) {
      blobArray = hasArrayBufferViewSupport ? intArray : arrayBuffer;
      return new Blob([blobArray], {
        type: mimeString
      });
    }
    bb = new BlobBuilder();
    bb.append(arrayBuffer);
    return bb.getBlob(mimeString);
  };

  Util.prototype.throttle = function(func, wait) {
    var args, call, ctx, last, rtn, throttled, timeoutID;
    last = 0;
    timeoutID = 0;
    ctx = args = rtn = null;
    call = function() {
      timeoutID = 0;
      last = +new Date();
      rtn = func.apply(ctx, args);
      ctx = null;
      return args = null;
    };
    throttled = function() {
      var delta;
      ctx = this;
      args = arguments;
      delta = new Date() - last;
      if (!timeoutID) {
        if (delta >= wait) {
          call();
        } else {
          timeoutID = setTimeout(call, wait - delta);
        }
      }
      return rtn;
    };
    throttled.clear = function() {
      if (!timeoutID) {
        return;
      }
      clearTimeout(timeoutID);
      return call();
    };
    return throttled;
  };

  Util.prototype.formatHTML = function(html) {
    var cursor, indentString, lastMatch, level, match, re, repeatString, result, str;
    re = /<(\/?)(.+?)(\/?)>/g;
    result = '';
    level = 0;
    lastMatch = null;
    indentString = '  ';
    repeatString = function(str, n) {
      return new Array(n + 1).join(str);
    };
    while ((match = re.exec(html)) !== null) {
      match.isBlockNode = langx.inArray(match[2], this.blockNodes) > -1;
      match.isStartTag = match[1] !== '/' && match[3] !== '/';
      match.isEndTag = match[1] === '/' || match[3] === '/';
      cursor = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
      if ((str = html.substring(cursor, match.index)).length > 0 && langx.trim(str)) {
        result += str;
      }
      if (match.isBlockNode && match.isEndTag && !match.isStartTag) {
        level -= 1;
      }
      if (match.isBlockNode && match.isStartTag) {
        if (!(lastMatch && lastMatch.isBlockNode && lastMatch.isEndTag)) {
          result += '\n';
        }
        result += repeatString(indentString, level);
      }
      result += match[0];
      if (match.isBlockNode && match.isEndTag) {
        result += '\n';
      }
      if (match.isBlockNode && match.isStartTag) {
        level += 1;
      }
      lastMatch = match;
    }
    return langx.trim(result);
  };

  return contents.Util = Util;
});
define('skylark-domx-contents/input-manager',[
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

define('skylark-domx-contents/selection',[
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
  "./contents"
],function(langx,noder,$,contents){ 

  var Selection = langx.Evented.inherit({
    _range : null,

    _startNodes : null,

    _endNodes : null,

    _containerNode : null,

    _nodes : null,

    _blockNodes : null,

    _rootNodes : null,

    init : function(editable,opts) {
      var self = this;
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);
      this._selection = document.getSelection();

      this.editable.on('selectionchanged', function(e) {
        console.log("selectionchanged");
        self.reset();
        return self._range = self._selection.getRangeAt(0);
      });

      this.editable.on('blur', function(e) {
        return self.reset();
      });

      this.editable.on('focus', function(e) {
        self.reset();
        return self._range = self._selection.getRangeAt(0);
      });
    },

    reset : function() {
      this._range = null;
      this._startNodes = null;
      this._endNodes = null;
      this._containerNode = null;
      this._nodes = null;
      this._blockNodes = null;

      return this._rootNodes = null;
    },

    clear : function() {
      var e;
      try {
        this._selection.removeAllRanges();
        console.log("clear");
      } catch (_error) {
        e = _error;
      }
      return this.reset();
    },

    range : function(range) {
      var ffOrIE;
      if (range) {
        this.clear();
        this._selection.addRange(range);
        this._range = range;
 //       ffOrIE = this.editable.util.browser.firefox || this.editable.util.browser.msie;
        ffOrIE = langx.hoster.browser.mozilla || langx.hoster.browser.msie;
        if (!this.editable.inputManager.focused && ffOrIE) {
          this.editable.body.focus();
        }
      } else if (!this._range && this.editable.inputManager.focused && this._selection.rangeCount) {
        this._range = this._selection.getRangeAt(0);
      }
      return this._range;
    },

    startNodes : function() {
      if (this._range) {
        if (!this._startNodes) {
          this._startNodes = (function(self) {
            return function() {
              var startNodes;
              startNodes = $(self._range.startContainer).parentsUntil(self.editable.body).get();
              startNodes.unshift(self._range.startContainer);
              return $(startNodes);
            };
          })(this)();
        } 

      }
      return this._startNodes;
    },

    endNodes : function() {
      var endNodes;
      if (this._range) {
        this._endNodes || (this._endNodes = this._range.collapsed ? this.startNodes() : (endNodes = $(this._range.endContainer).parentsUntil(this.editable.body).get(), endNodes.unshift(this._range.endContainer), $(endNodes)));
      }
      return this._endNodes;
    },

    containerNode : function() {
      if (this._range) {
        this._containerNode || (this._containerNode = $(this._range.commonAncestorContainer));
      }
      return this._containerNode;
    },

    nodes : function() {
      if (this._range) {
        this._nodes || (this._nodes = (function(self) {
          return function() {
            var nodes;
            nodes = [];
            if (self.startNodes().first().is(self.endNodes().first())) {
              nodes = self.startNodes().get();
            } else {
              self.startNodes().each(function(i, node) {
                var $endNode, $node, $nodes, endIndex, index, sharedIndex, startIndex;
                $node = $(node);
                if (self.endNodes().index($node) > -1) {
                  return nodes.push(node);
                } else if ($node.parent().is(self.editable.body) || (sharedIndex = self.endNodes().index($node.parent())) > -1) {
                  if (sharedIndex && sharedIndex > -1) {
                    $endNode = self.endNodes().eq(sharedIndex - 1);
                  } else {
                    $endNode = self.endNodes().last();
                  }
                  $nodes = $node.parent().contents();
                  startIndex = $nodes.index($node);
                  endIndex = $nodes.index($endNode);
                  return langx.merge(nodes, $nodes.slice(startIndex, endIndex).get());
                } else {
                  $nodes = $node.parent().contents();
                  index = $nodes.index($node);
                  return langx.merge(nodes, $nodes.slice(index).get());
                }
              });
              self.endNodes().each(function(i, node) {
                var $node, $nodes, index;
                $node = $(node);
                if ($node.parent().is(self.editable.body) || self.startNodes().index($node.parent()) > -1) {
                  nodes.push(node);
                  return false;
                } else {
                  $nodes = $node.parent().contents();
                  index = $nodes.index($node);
                  return langx.merge(nodes, $nodes.slice(0, index + 1));
                }
              });
            }
            return $(langx.uniq(nodes));
          };
        })(this)());
      }
      return this._nodes;
    },

    blockNodes : function() {
      if (!this._range) {
        return;
      }

      this._blockNodes || (this._blockNodes = (function(self) {
        return function() {
          return self.nodes().filter(function(i, node) {
            return self.editable.util.isBlockNode(node);
          });
        };
      })(this)());

      return this._blockNodes;
    },

    rootNodes : function() {
      if (!this._range) {
        return;
      }
      this._rootNodes || (this._rootNodes = (function(self) {
        return function() {
          return self.nodes().filter(function(i, node) {
            var $parent;
            $parent = $(node).parent();
            return $parent.is(self.editable.body) || $parent.is('blockquote');
          });
        };
      })(this)());

      return this._rootNodes;
    },

    rangeAtEndOf : function(node, range) {
      var afterLastNode, beforeLastNode, endNode, endNodeLength, lastNodeIsBr, result;
      if (range == null) {
        range = this.range();
      }
      if (!(range && range.collapsed)) {
        return;
      }
      node = $(node)[0];
      endNode = range.endContainer;
      endNodeLength = this.editable.util.getNodeLength(endNode);
      beforeLastNode = range.endOffset === endNodeLength - 1;
      lastNodeIsBr = $(endNode).contents().last().is('br');
      afterLastNode = range.endOffset === endNodeLength;
      if (!((beforeLastNode && lastNodeIsBr) || afterLastNode)) {
        return false;
      }
      if (node === endNode) {
        return true;
      } else if (!noder.contains(node, endNode)) {
        return false;
      }
      result = true;
      $(endNode).parentsUntil(node).addBack().each(function(i, n) {
        var $lastChild, beforeLastbr, isLastNode, nodes;
        nodes = $(n).parent().contents().filter(function() {
          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
        });
        $lastChild = nodes.last();
        isLastNode = $lastChild.get(0) === n;
        beforeLastbr = $lastChild.is('br') && $lastChild.prev().get(0) === n;
        if (!(isLastNode || beforeLastbr)) {
          result = false;
          return false;
        }
      });
      return result;
    },

    rangeAtStartOf : function(node, range) {
      var result, startNode;
      if (range == null) {
        range = this.range();
      }
      if (!(range && range.collapsed)) {
        return;
      }
      node = $(node)[0];
      startNode = range.startContainer;
      if (range.startOffset !== 0) {
        return false;
      }
      if (node === startNode) {
        return true;
      } else if (!noder.contains(node, startNode)) {
        return false;
      }
      result = true;
      $(startNode).parentsUntil(node).addBack().each(function(i, n) {
        var nodes;
        nodes = $(n).parent().contents().filter(function() {
          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
        });
        if (nodes.first().get(0) !== n) {
          return result = false;
        }
      });
      return result;
    },

    insertNode : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (!range) {
        return;
      }
      node = $(node)[0];
      range.insertNode(node);
      return this.setRangeAfter(node, range);
    },

    setRangeAfter : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (range == null) {
        return;
      }
      node = $(node)[0];
      range.setEndAfter(node);
      range.collapse(false);
      return this.range(range);
    },

    setRangeBefore : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      if (range == null) {
        return;
      }
      node = $(node)[0];
      range.setEndBefore(node);
      range.collapse(false);
      return this.range(range);
    },

    setRangeAtStartOf : function(node, range) {
      if (range == null) {
        range = this.range();
      }
      node = $(node).get(0);
      range.setEnd(node, 0);
      range.collapse(false);
      return this.range(range);
    },

    setRangeAtEndOf : function(node, range) {
      var $lastNode, $node, contents, lastChild, lastChildLength, lastText, nodeLength;
      if (range == null) {
        range = this.range();
      }
      $node = $(node);
      node = $node[0];
      if (!node) {
        return;
      }
      if ($node.is('pre')) {
        contents = $node.contents();
        if (contents.length > 0) {
          lastChild = contents.last();
          lastText = lastChild.text();
          lastChildLength = this.editable.util.getNodeLength(lastChild[0]);
          if (lastText.charAt(lastText.length - 1) === '\n') {
            range.setEnd(lastChild[0], lastChildLength - 1);
          } else {
            range.setEnd(lastChild[0], lastChildLength);
          }
        } else {
          range.setEnd(node, 0);
        }
      } else {
        nodeLength = this.editable.util.getNodeLength(node);
        if (node.nodeType !== 3 && nodeLength > 0) {
          $lastNode = $(node).contents().last();
          if ($lastNode.is('br')) {
            nodeLength -= 1;
          } else if ($lastNode[0].nodeType !== 3 && this.editable.util.isEmptyNode($lastNode)) {
            $lastNode.append(this.editable.util.phBr);
            node = $lastNode[0];
            nodeLength = 0;
          }
        }
        range.setEnd(node, nodeLength);
      }
      range.collapse(false);
      return this.range(range);
    },

    deleteRangeContents : function(range) {
      var atEndOfBody, atStartOfBody, endRange, startRange;
      if (range == null) {
        range = this.range();
      }
      startRange = range.cloneRange();
      endRange = range.cloneRange();
      startRange.collapse(true);
      endRange.collapse(false);
      atStartOfBody = this.rangeAtStartOf(this.editable.body, startRange);
      atEndOfBody = this.rangeAtEndOf(this.editable.body, endRange);
      if (!range.collapsed && atStartOfBody && atEndOfBody) {
        this.editable.body.empty();
        range.setStart(this.editable.body[0], 0);
        range.collapse(true);
        this.range(range);
      } else {
        range.deleteContents();
      }
      return range;
    },

    breakBlockEl : function(el, range) {
      var $el;
      if (range == null) {
        range = this.range();
      }
      $el = $(el);
      if (!range.collapsed) {
        return $el;
      }
      range.setStartBefore($el.get(0));
      if (range.collapsed) {
        return $el;
      }
      return $el.before(range.extractContents());
    },

    save : function(range) {
      var endCaret, endRange, startCaret;
      if (range == null) {
        range = this.range();
      }
      if (this._selectionSaved) {
        return;
      }
      endRange = range.cloneRange();
      endRange.collapse(false);
      startCaret = $('<span/>').addClass(this.opts.classPrefix +'caret-start');
      endCaret = $('<span/>').addClass(this.opts.classPrefix +'caret-end');
      endRange.insertNode(endCaret[0]);
      range.insertNode(startCaret[0]);
      this.clear();
      return this._selectionSaved = true;
    },

    restore : function() {
      var endCaret, endContainer, endOffset, range, startCaret, startContainer, startOffset;
      if (!this._selectionSaved) {
        return false;
      }
      startCaret = this.editable.body.find('.' + this.opts.classPrefix +'caret-start');
      endCaret = this.editable.body.find('.' + this.opts.classPrefix +'caret-end');
      if (startCaret.length && endCaret.length) {
        startContainer = startCaret.parent();
        startOffset = startContainer.contents().index(startCaret);
        endContainer = endCaret.parent();
        endOffset = endContainer.contents().index(endCaret);
        if (startContainer[0] === endContainer[0]) {
          endOffset -= 1;
        }
        range = document.createRange();
        range.setStart(startContainer.get(0), startOffset);
        range.setEnd(endContainer.get(0), endOffset);
        startCaret.remove();
        endCaret.remove();
        this.range(range);
      } else {
        startCaret.remove();
        endCaret.remove();
      }
      this._selectionSaved = false;
      return range;
    },
  });

  Selection.pluginName = 'Selection';


  return contents.Selection = Selection;

});
define('skylark-domx-contents/undo-manager',[
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
define('skylark-domx-contents/keystroke',[
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
        if ($blockEl.is('.' + _this.opts.classPrefix + 'resize-handle') && $rootBlock.is('.' + _this.opts.classPrefix + 'table')) {
          e.preventDefault();
          $rootBlock.remove();
          _this.editable.selection.setRangeAtEndOf($prevBlockEl);
        }
        if ($prevBlockEl.is('.' + _this.opts.classPrefix + 'table') && !$blockEl.is('table') && _this.editable.util.isEmptyNode($blockEl)) {
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
        if ($node.is('.' + _this.opts.classPrefix + 'table')) {
          $blockEl = _this.editable.selection.blockNodes().last();
          if ($blockEl.is('.' + _this.opts.classPrefix + 'resize-handle')) {
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

define('skylark-domx-contents/formatter',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "./contents"
],function(langx,$,contents){ 


  var indexOf = [].indexOf ;

  var Formatter = langx.Evented.inherit({
    opts : {
      allowedTags: [],
      allowedAttributes: {},
      allowedStyles: {}
    },

    init : function(editable,opts) {
      this.editable = editable; //this._module;
      this.opts = langx.extend({}, this.opts, opts);

      this._allowedTags = langx.merge(['br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr'], this.opts.allowedTags);
      this._allowedAttributes = langx.extend({
        img: ['src', 'alt', 'width', 'height', 'data-non-image'],
        a: ['href', 'target','download'],
        font: ['color'],
        code: ['class']
      }, this.opts.allowedAttributes);
      this._allowedStyles = langx.extend({
        span: ['color', 'font-size','background-color','background'],
        b: ['color', 'font-size','background-color','background'],
        i: ['color', 'font-size','background-color','background'],
        strong: ['color', 'font-size','background-color','background'],
        strike: ['color', 'font-size','background-color','background'],
        u: ['color', 'font-size','background-color','background'],
        p: ['margin-left', 'text-align','background-color','background'],
        h1: ['margin-left', 'text-align'],
        h2: ['margin-left', 'text-align'],
        h3: ['margin-left', 'text-align'],
        h4: ['margin-left', 'text-align']
      }, this.opts.allowedStyles);
      this.editable.body.on('click', 'a', function(e) {
        return false;
      });
    },

    decorate : function($el) {
      if ($el == null) {
        $el = this.editable.body;
      }
      this.editable.trigger('decorate', [$el]);
      return $el;
    },

    undecorate : function($el) {
      if ($el == null) {
        $el = this.editable.body.clone();
      }
      this.editable.trigger('undecorate', [$el]);
      return $el;
    },

    autolink : function($el) {
      var $link, $node, findLinkNode, k, lastIndex, len, linkNodes, match, re, replaceEls, subStr, text, uri;
      if ($el == null) {
        $el = this.editable.body;
      }
      linkNodes = [];
      findLinkNode = function($parentNode) {
        return $parentNode.contents().each(function(i, node) {
          var $node, text;
          $node = $(node);
          if ($node.is('a') || $node.closest('a, pre', $el).length) {
            return;
          }
          if (!$node.is('iframe') && $node.contents().length) {
            return findLinkNode($node);
          } else if ((text = $node.text()) && /https?:\/\/|www\./ig.test(text)) {
            return linkNodes.push($node);
          }
        });
      };
      findLinkNode($el);
      re = /(https?:\/\/|www\.)[\w\-\.\?&=\/#%:,@\!\+]+/ig;
      for (k = 0, len = linkNodes.length; k < len; k++) {
        $node = linkNodes[k];
        text = $node.text();
        replaceEls = [];
        match = null;
        lastIndex = 0;
        while ((match = re.exec(text)) !== null) {
          subStr = text.substring(lastIndex, match.index);
          replaceEls.push(document.createTextNode(subStr));
          lastIndex = re.lastIndex;
          uri = /^(http(s)?:\/\/|\/)/.test(match[0]) ? match[0] : 'http://' + match[0];
          $link = $("<a href=\"" + uri + "\" rel=\"nofollow\"></a>").text(match[0]);
          replaceEls.push($link[0]);
        }
        replaceEls.push(document.createTextNode(text.substring(lastIndex)));
        $node.replaceWith($(replaceEls));
      }
      return $el;
    },

    format : function($el) {
      var $node, blockNode, k, l, len, len1, n, node, ref, ref1;
      if ($el == null) {
        $el = this.editable.body;
      }
      if ($el.is(':empty')) {
        //$el.append('<p>' + this.editable.util.phBr + '</p>'); // modified by lwf
        $el.append('<p>' + '</p>'); // modified by lwf
        return $el;
      }
      ref = $el.contents();
      for (k = 0, len = ref.length; k < len; k++) {
        n = ref[k];
        this.cleanNode(n, true);
      }
      ref1 = $el.contents();
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        node = ref1[l];
        $node = $(node);
        if ($node.is('br')) {
          if (typeof blockNode !== "undefined" && blockNode !== null) {
            blockNode = null;
          }
          $node.remove();
        } else if (this.editable.util.isBlockNode(node)) {
          if ($node.is('li')) {
            if (blockNode && blockNode.is('ul, ol')) {
              blockNode.append(node);
            } else {
              blockNode = $('<ul/>').insertBefore(node);
              blockNode.append(node);
            }
          } else {
            blockNode = null;
          }
        } else {
          if (!blockNode || blockNode.is('ul, ol')) {
            blockNode = $('<p/>').insertBefore(node);
          }
          blockNode.append(node);
          if (this.editable.util.isEmptyNode(blockNode)) {
            blockNode.append(this.editable.util.phBr);
          }
        }
      }
      return $el;
    },

    cleanNode : function(node, recursive) {
      var $blockEls, $childImg, $node, $p, $td, allowedAttributes, attr, contents, isDecoration, k, l, len, len1, n, ref, ref1, text, textNode;
      $node = $(node);
      if (!($node.length > 0)) {
        return;
      }
      if ($node[0].nodeType === 3) {
        text = $node.text().replace(/(\r\n|\n|\r)/gm, '');
        if (text) {
          textNode = document.createTextNode(text);
          $node.replaceWith(textNode);
        } else {
          $node.remove();
        }
        return;
      }
      contents = $node.is('iframe') ? null : $node.contents();
      isDecoration = this.editable.util.isDecoratedNode($node);
      if ($node.is(this._allowedTags.join(',')) || isDecoration) {
        if ($node.is('a') && ($childImg = $node.find('img')).length > 0) {
          $node.replaceWith($childImg);
          $node = $childImg;
          contents = null;
        }
        if ($node.is('td') && ($blockEls = $node.find(this.editable.util.blockNodes.join(','))).length > 0) {
          $blockEls.each((function(_this) {
            return function(i, blockEl) {
              return $(blockEl).contents().unwrap();
            };
          })(this));
          contents = $node.contents();
        }
        if ($node.is('img') && $node.hasClass('uploading')) {
          $node.remove();
        }
        if (!isDecoration) {
          allowedAttributes = this._allowedAttributes[$node[0].tagName.toLowerCase()];
          ref = langx.makeArray($node[0].attributes);
          for (k = 0, len = ref.length; k < len; k++) {
            attr = ref[k];
            if (attr.name === 'style') {
              continue;
            }
            if (!((allowedAttributes != null) && (ref1 = attr.name, indexOf.call(allowedAttributes, ref1) >= 0))) {
              $node.removeAttr(attr.name);
            }
          }
          this._cleanNodeStyles($node);
          if ($node.is('span')) {
            if ($node[0].attributes.length === 0) {
              $node.contents().first().unwrap();
            }
            if ($node[0].style.length === 2 && $node[0].style.color === 'rgb(51, 51, 51)' && $node[0].style.fontSize === '16px') {
              $node.contents().unwrap();
            }
          }
        }
      } else if ($node[0].nodeType === 1 && !$node.is(':empty')) {
        if ($node.is('div, article, dl, header, footer, tr')) {
          $node.append('<br/>');
          contents.first().unwrap();
        } else if ($node.is('table')) {
          $p = $('<p/>');
          $node.find('tr').each(function(i, tr) {
            return $p.append($(tr).text() + '<br/>');
          });
          $node.replaceWith($p);
          contents = null;
        } else if ($node.is('thead, tfoot')) {
          $node.remove();
          contents = null;
        } else if ($node.is('th')) {
          $td = $('<td/>').append($node.contents());
          $node.replaceWith($td);
        } else {
          contents.first().unwrap();
        }
      } else {
        $node.remove();
        contents = null;
      }
      if (recursive && (contents != null) && !$node.is('pre')) {
        for (l = 0, len1 = contents.length; l < len1; l++) {
          n = contents[l];
          this.cleanNode(n, true);
        }
      }
      return null;
    },

    _cleanNodeStyles : function($node) {
      var allowedStyles, k, len, pair, ref, ref1, style, styleStr, styles;
      styleStr = $node.attr('style');
      if (!styleStr) {
        return;
      }
      $node.removeAttr('style');
      allowedStyles = this._allowedStyles[$node[0].tagName.toLowerCase()];
      if (!(allowedStyles && allowedStyles.length > 0)) {
        return $node;
      }
      styles = {};
      ref = styleStr.split(';');
      for (k = 0, len = ref.length; k < len; k++) {
        style = ref[k];
        style = langx.trim(style);
        pair = style.split(':');
        if (pair.length !== 2) {
          continue;
        }
        if (pair[0] === 'font-size' && pair[1].indexOf('px') > 0) {
          if (parseInt(pair[1], 10) < 12) {
            continue;
          }
        }
        if (ref1 = pair[0], indexOf.call(allowedStyles, ref1) >= 0) {
          styles[langx.trim(pair[0])] = langx.trim(pair[1]);
        }
      }
      if (Object.keys(styles).length > 0) {
        $node.css(styles);
      }
      return $node;
    },

    clearHtml : function(html, lineBreak) {
      var container, contents, result;
      if (lineBreak == null) {
        lineBreak = true;
      }
      container = $('<div/>').append(html);
      contents = container.contents();
      result = '';
      contents.each((function(_this) {
        return function(i, node) {
          var $node, children;
          if (node.nodeType === 3) {
            return result += node.nodeValue;
          } else if (node.nodeType === 1) {
            $node = $(node);
            children = $node.is('iframe') ? null : $node.contents();
            if (children && children.length > 0) {
              result += _this.clearHtml(children);
            }
            if (lineBreak && i < contents.length - 1 && $node.is('br, p, div, li,tr, pre, address, artticle, aside, dl, figcaption, footer, h1, h2,h3, h4, header')) {
              return result += '\n';
            }
          }
        };
      })(this));
      return result;
    },

    beautify : function($contents) {
      var uselessP,
          _this = this;
      uselessP = function($el) {
        return !!($el.is('p') && !$el.text() && $el.children(':not(br)').length < 1);
      };
      return $contents.each(function(i, el) {
        var $el, invalid;
        $el = $(el);
        invalid = $el.is(':not(img, br, col, td, hr, [class^="' + _this.opts.classPrefix + '"]):empty');
        if (invalid || uselessP($el)) {
          $el.remove();
        }
        return $el.find(':not(img, br, col, td, hr, [class^="' + _this.opts.classPrefix + '"]):empty').remove();
      });
    }

  });

  Formatter.pluginName = 'Formatter';

  return contents.Formatter = Formatter;

});
define('skylark-domx-contents/indentation',[
  "skylark-langx/langx",
  "skylark-domx-noder",
  "skylark-domx-query",
  "./contents"
],function(langx,noder,$,contents){ 


  var Indentation = langx.Evented.inherit({

  });


  Indentation.pluginName = 'Indentation';

  Indentation.prototype.opts = {
    tabIndent: true,
    indentWidth: 40
   
  };

  Indentation.prototype.init = function(editable,opts) {
    this.editable = editable; // this._module;
    this.opts = langx.extend({}, this.opts, opts);

    this.editable.keystroke.add('tab', '*', (function(_this) {
      return function(e) {
        var codeButton;
        codeButton = _this.editable.toolbar.findButton('code');
        if (!(_this.opts.tabIndent || (codeButton && codeButton.active))) {
          return;
        }
        return _this.indent(e.shiftKey);
      };
    })(this));
  };

  Indentation.prototype.indent = function(isBackward) {
    var $blockNodes, $endNodes, $startNodes, nodes, result;
    $startNodes = this.editable.selection.startNodes();
    $endNodes = this.editable.selection.endNodes();
    $blockNodes = this.editable.selection.blockNodes();
    nodes = [];
    $blockNodes = $blockNodes.each(function(i, node) {
      var include, j, k, len, n;
      include = true;
      for (j = k = 0, len = nodes.length; k < len; j = ++k) {
        n = nodes[j];
        if (noder.contains(node, n)) {
          include = false;
          break;
        } else if (noder.contains(n, node)) {
          nodes.splice(j, 1, node);
          include = false;
          break;
        }
      }
      if (include) {
        return nodes.push(node);
      }
    });
    $blockNodes = $(nodes);
    result = false;
    $blockNodes.each((function(_this) {
      return function(i, blockEl) {
        var r;
        r = isBackward ? _this.outdentBlock(blockEl) : _this.indentBlock(blockEl);
        if (r) {
          return result = r;
        }
      };
    })(this));
    return result;
  };

  Indentation.prototype.indentBlock = function(blockEl) {
    var $blockEl, $childList, $nextTd, $nextTr, $parentLi, $pre, $td, $tr, marginLeft, tagName;
    $blockEl = $(blockEl);
    if (!$blockEl.length) {
      return;
    }
    if ($blockEl.is('pre')) {
      $pre = this.editable.selection.containerNode();
      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
        return;
      }
      this.indentText(this.editable.selection.range());
    } else if ($blockEl.is('li')) {
      $parentLi = $blockEl.prev('li');
      if ($parentLi.length < 1) {
        return;
      }
      this.editable.selection.save();
      tagName = $blockEl.parent()[0].tagName;
      $childList = $parentLi.children('ul, ol');
      if ($childList.length > 0) {
        $childList.append($blockEl);
      } else {
        $('<' + tagName + '/>').append($blockEl).appendTo($parentLi);
      }
      this.editable.selection.restore();
    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
      marginLeft = (Math.round(marginLeft / this.opts.indentWidth) + 1) * this.opts.indentWidth;
      $blockEl.css('margin-left', marginLeft);
    } else if ($blockEl.is('table') || $blockEl.is('.' + this.opts.classPrefix +'table')) {
      $td = this.editable.selection.containerNode().closest('td, th');
      $nextTd = $td.next('td, th');
      if (!($nextTd.length > 0)) {
        $tr = $td.parent('tr');
        $nextTr = $tr.next('tr');
        if ($nextTr.length < 1 && $tr.parent().is('thead')) {
          $nextTr = $tr.parent('thead').next('tbody').find('tr:first');
        }
        $nextTd = $nextTr.find('td:first, th:first');
      }
      if (!($td.length > 0 && $nextTd.length > 0)) {
        return;
      }
      this.editable.selection.setRangeAtEndOf($nextTd);
    } else {
      return false;
    }
    return true;
  };

  Indentation.prototype.indentText = function(range) {
    var text, textNode;
    text = range.toString().replace(/^(?=.+)/mg, '\u00A0\u00A0');
    textNode = document.createTextNode(text || '\u00A0\u00A0');
    range.deleteContents();
    range.insertNode(textNode);
    if (text) {
      range.selectNode(textNode);
      return this.editable.selection.range(range);
    } else {
      return this.editable.selection.setRangeAfter(textNode);
    }
  };

  Indentation.prototype.outdentBlock = function(blockEl) {
    var $blockEl, $parent, $parentLi, $pre, $prevTd, $prevTr, $td, $tr, marginLeft, range;
    $blockEl = $(blockEl);
    if (!($blockEl && $blockEl.length > 0)) {
      return;
    }
    if ($blockEl.is('pre')) {
      $pre = this.editable.selection.containerNode();
      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
        return;
      }
      this.outdentText(range);
    } else if ($blockEl.is('li')) {
      $parent = $blockEl.parent();
      $parentLi = $parent.parent('li');
      this.editable.selection.save();
      if ($parentLi.length < 1) {
        range = document.createRange();
        range.setStartBefore($parent[0]);
        range.setEndBefore($blockEl[0]);
        $parent.before(range.extractContents());
        $('<p/>').insertBefore($parent).after($blockEl.children('ul, ol')).append($blockEl.contents());
        $blockEl.remove();
      } else {
        if ($blockEl.next('li').length > 0) {
          $('<' + $parent[0].tagName + '/>').append($blockEl.nextAll('li')).appendTo($blockEl);
        }
        $blockEl.insertAfter($parentLi);
        if ($parent.children('li').length < 1) {
          $parent.remove();
        }
      }
      this.editable.selection.restore();
    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
      marginLeft = Math.max(Math.round(marginLeft / this.opts.indentWidth) - 1, 0) * this.opts.indentWidth;
      $blockEl.css('margin-left', marginLeft === 0 ? '' : marginLeft);
    } else if ($blockEl.is('table') || $blockEl.is('.' + this.opts.classPrefix + 'table')) {
      $td = this.editable.selection.containerNode().closest('td, th');
      $prevTd = $td.prev('td, th');
      if (!($prevTd.length > 0)) {
        $tr = $td.parent('tr');
        $prevTr = $tr.prev('tr');
        if ($prevTr.length < 1 && $tr.parent().is('tbody')) {
          $prevTr = $tr.parent('tbody').prev('thead').find('tr:first');
        }
        $prevTd = $prevTr.find('td:last, th:last');
      }
      if (!($td.length > 0 && $prevTd.length > 0)) {
        return;
      }
      this.editable.selection.setRangeAtEndOf($prevTd);
    } else {
      return false;
    }
    return true;
  };

  Indentation.prototype.outdentText = function(range) {};

  return contents.Indentation = Indentation;

});

define('skylark-domx-contents/clipboard',[
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


define('skylark-domx-contents/editable',[
	"skylark-langx/langx",
	"skylark-domx-noder",
	"skylark-domx-query",
	"./contents",
	"./hotkeys",
	"./util",
	"./input-manager", 
	"./selection", 
	"./undo-manager", 
	"./keystroke",
	"./formatter", 
	"./indentation", 
	"./clipboard"
],function(langx, noder, $, contents,Hotkeys,Util,InputManager,Selection,UndoManager,Keystroke,Formatter,Indentation,Clipboard){
  var Editable = langx.Evented.inherit({
    init : function(el,opts) {
    	this.$el = $(el);
    	this.textarea = $(opts.textarea);
    	this.body = $(opts.body);

    	var pluginOpts = {
    		classPrefix : opts.classPrefix
    	};

        this.util = new Util(this,pluginOpts);

		this.hotkeys = new Hotkeys({
		  el: this.body
		});

      this.inputManager = new InputManager(this,pluginOpts);
      this.selection = new Selection(this,pluginOpts);
      this.undoManager = new UndoManager(this,pluginOpts);
      this.keystroke = new Keystroke(this,pluginOpts);
      this.formatter = new Formatter(this,pluginOpts);
      this.indentation = new Indentation(this,pluginOpts);
      this.clipboard = new Clipboard(this,pluginOpts);

		if (this.util.os.mac) {
		  this.$el.addClass(opts.classPrefix + 'mac');
		} else if (this.util.os.linux) {
		  this.$el.addClass(opts.classPrefix + 'linux');
		}
		if (this.util.os.mobile) {
		  this.$el.addClass(opts.classPrefix + 'mobile');
		}

      if (this.util.browser.mozilla) {
        this.util.reflow();
        try {
          document.execCommand('enableObjectResizing', false, false);
          return document.execCommand('enableInlineTableEditing', false, false);
        } catch (_error) {
          e = _error;
        }
      }

    },

	setValue : function(val) {
		this.textarea.val(val);
		this.body.get(0).innerHTML = val;
		this.formatter.format();
		this.formatter.decorate();
		this.util.reflow(this.body);
		this.inputManager.lastCaretPosition = null;
	},

	getValue : function() {
		return this.sync();
	},

	sync : function() {
		var children, cloneBody, emptyP, firstP, lastP, val;
		cloneBody = this.body.clone();
		this.formatter.undecorate(cloneBody);
		this.formatter.format(cloneBody);
		this.formatter.autolink(cloneBody);
		children = cloneBody.children();
		lastP = children.last('p');
		firstP = children.first('p');
		while (lastP.is('p') && this.util.isEmptyNode(lastP)) {
		  emptyP = lastP;
		  lastP = lastP.prev('p');
		  emptyP.remove();
		}
		while (firstP.is('p') && this.util.isEmptyNode(firstP)) {
		  emptyP = firstP;
		  firstP = lastP.next('p');
		  emptyP.remove();
		}
		cloneBody.find('img.uploading').remove();
		val = langx.trim(cloneBody.html());
		this.textarea.val(val);
		return val;
	},

	focus : function() {
		var $blockEl, range;
		if (!(this.body.is(':visible') && this.body.is('[contenteditable]'))) {
		  this.$el.find('textarea:visible').focus();
		  return;
		}
		if (this.inputManager.lastCaretPosition) {
		  this.undoManager.caretPosition(this.inputManager.lastCaretPosition);
		  return this.inputManager.lastCaretPosition = null;
		} else {
		  $blockEl = this.body.children().last();
		  if (!$blockEl.is('p')) {
		    $blockEl = $('<p/>').append(this.util.phBr).appendTo(this.body);
		  }
		  range = document.createRange();
		  return this.selection.setRangeAtEndOf($blockEl, range);
		}
	},

	blur : function() {
		if (this.body.is(':visible') && this.body.is('[contenteditable]')) {
		  return this.body.blur();
		} else {
		  return this.body.find('textarea:visible').blur();
		}
	},

	isActive : function(state) {
		return document.queryCommandState(state) === true; //'bold'
	},

	status : function(cmd,htmlTag) {
		if (cmd === "alignment") {
		    var nodes = this.selection.nodes().filter(htmlTag);
		    if (nodes.length < 1) {
		    	return null;
		    } else {
		      return nodes.first().css('text-align');
		    }

		}
	},

	alignment : function(align,htmlTag) {
	    if (align !== 'left' && align !== 'center' && align !== 'right') {
	      throw new Error("simditor alignment button: invalid align " + align);
	    }
    	var nodes = this.selection.nodes().filter(htmlTag);
	    nodes.css({
	      'text-align': align === 'left' ? '' : align
	    });
	    this.trigger('valuechanged');
	    return this.inputManager.throttledSelectionChanged();

	},

	blockquote : function(disableTag) {
	    var $rootNodes, clearCache, nodeCache;
	    $rootNodes = this.selection.rootNodes();
	    $rootNodes = $rootNodes.filter(function(i, node) {
	      return !$(node).parent().is('blockquote');
	    });
	    this.selection.save();
	    nodeCache = [];
	    clearCache = function() {
	        if (nodeCache.length > 0) {
	          $("<blockquote/>").insertBefore(nodeCache[0]).append(nodeCache);
	          return nodeCache.length = 0;
	        }
	    };
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if (!$node.parent().is(_this.body)) {
	          return;
	        }
	        if ($node.is('blockquote')) {
	          clearCache();
	          return $node.children().unwrap();
	        } else if ($node.is(disableTag) || _this.util.isDecoratedNode($node)) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.selection.restore();
	    return this.trigger('valuechanged');

	},

	blockCode : function(htmlTag,disableTag) {
	    var $rootNodes, clearCache, nodeCache, resultNodes;
	    $rootNodes = this.selection.rootNodes();
	    nodeCache = [];
	    resultNodes = [];
	    clearCache = (function(_this) {
	      return function() {
	        var $pre;
	        if (!(nodeCache.length > 0)) {
	          return;
	        }
	        $pre = $("<" + htmlTag + "/>").insertBefore(nodeCache[0]).text(_this.formatter.clearHtml(nodeCache));
	        resultNodes.push($pre[0]);
	        return nodeCache.length = 0;
	      };
	    })(this);
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node, $p;
	        $node = $(node);
	        if ($node.is(htmlTag)) {
	          clearCache();
	          $p = $('<p/>').append($node.html().replace('\n', '<br/>')).replaceAll($node);
	          return resultNodes.push($p[0]);
	        } else if ($node.is(disableTag) || _this.util.isDecoratedNode($node) || $node.is('blockquote')) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.selection.setRangeAtEndOf($(resultNodes).last());
	    return this.trigger('valuechanged');

	},

	fontColor : function(hex,isDefault,coloredText) {
        var range = this.selection.range();
        if (!isDefault && range.collapsed) {
          textNode = document.createTextNode(coloredText);
          range.insertNode(textNode);
          range.selectNodeContents(textNode);
        }
        this.selection.range(range);
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, hex);
        document.execCommand('styleWithCSS', false, false);
        if (!this.util.support.oninput) {
          return this.trigger('valuechanged');
        }

	},

	fontScale : function(param,sizeMap) {
  		if (!sizeMap){
  			sizeMap = {
			    'x-large': '1.5em',
			    'large': '1.25em',
			    'small': '.75em',
			    'x-small': '.5em'
		   };
		}

	    var $scales, containerNode, range;
	    range = this.selection.range();
	    if (range.collapsed) {
	      return;
	    }
	    this.selection.range(range);
	    document.execCommand('styleWithCSS', false, true);
	    document.execCommand('fontSize', false, param);
	    document.execCommand('styleWithCSS', false, false);
	    this.selection.reset();
	    this.selection.range();
	    containerNode = this.selection.containerNode();
	    if (containerNode[0].nodeType === Node.TEXT_NODE) {
	      $scales = containerNode.closest('span[style*="font-size"]');
	    } else {
	      $scales = containerNode.find('span[style*="font-size"]');
	    }
	    $scales.each((function(_this) {
	      return function(i, n) {
	        var $span, size;
	        $span = $(n);
	        size = n.style.fontSize;
	        if (/large|x-large|small|x-small/.test(size)) {
	          return $span.css('fontSize', sizeMap[size]);
	        } else if (size === 'medium') {
	          if ($span[0].style.length > 1) {
	            return $span.css('fontSize', '');
	          } else {
	            return $span.replaceWith($span.contents());
	          }
	        }
	      };
	    })(this));
	    return this.trigger('valuechanged');
	},

	hr : function() {
	    var $hr, $newBlock, $nextBlock, $rootBlock;
	    $rootBlock = this.selection.rootNodes().first();
	    $nextBlock = $rootBlock.next();
	    if ($nextBlock.length > 0) {
	      this.selection.save();
	    } else {
	      $newBlock = $('<p/>').append(this.util.phBr);
	    }
	    $hr = $('<hr/>').insertAfter($rootBlock);
	    if ($newBlock) {
	      $newBlock.insertAfter($hr);
	      this.selection.setRangeAtStartOf($newBlock);
	    } else {
	      this.selection.restore();
	    }
	    return this.trigger('valuechanged');
	},

	inlineCode : function(active) {
	    var $code, $contents, range;
	    range = this.selection.range();
	    if (this.active) {
	      range.selectNodeContents(this.node[0]);
	      this.selection.save(range);
	      this.node.contents().unwrap();
	      this.selection.restore();
	    } else {
	      $contents = $(range.extractContents());
	      $code = $("<" + this.htmlTag + "/>").append($contents.contents());
	      range.insertNode($code[0]);
	      range.selectNodeContents($code[0]);
	      this.selection.range(range);
	    }
	    return this.trigger('valuechanged');

	},

	indent : function() {
	    return this.indentation.indent();
	},

	link : function(active,defaultLinkText) {
	    var $contents, $link, $newBlock, linkText, range, txtNode;
	    range = this.selection.range();
	    if (active) {
		  var node = this.selection.startNodes();
	      txtNode = document.createTextNode(node.text());
	      node.replaceWith(txtNode);
	      range.selectNode(txtNode);
	    } else {
	      $contents = $(range.extractContents());
	      linkText = this.formatter.clearHtml($contents.contents(), false);
	      $link = $('<a/>', {
	        href: '',
	        target: '_blank',
	        text: linkText || defaultLinkText
	      });
	      if (this.selection.blockNodes().length > 0) {
	        range.insertNode($link[0]);
	      } else {
	        $newBlock = $('<p/>').append($link);
	        range.insertNode($newBlock[0]);
	      }
	      range.selectNodeContents($link[0]);
	    }
	    this.selection.range(range);
	    return this.trigger('valuechanged');

	},

	list : function(type,param,disableTag) {
      var $list, $rootNodes, anotherType;
      $rootNodes = this.selection.blockNodes();
      anotherType = type === 'ul' ? 'ol' : 'ul';
      this.selection.save();
      $list = null;
      $rootNodes.each((function(_this) {
        return function(i, node) {
          var $node;
          $node = $(node);
          if ($node.is('blockquote, li') || $node.is(disableTag) || _this.util.isDecoratedNode($node) || !noder.contains(document, node)) {
            return;
          }
          if ($node.is(type)) {
            $node.children('li').each(function(i, li) {
              var $childList, $li;
              $li = $(li);
              $childList = $li.children('ul, ol').insertAfter($node);
              return $('<p/>').append($(li).html() || _this.util.phBr).insertBefore($node);
            });
            return $node.remove();
          } else if ($node.is(anotherType)) {
            return $('<' + type + '/>').append($node.contents()).replaceAll($node);
          } else if ($list && $node.prev().is($list)) {
            $('<li/>').append($node.html() || _this.util.phBr).appendTo($list);
            return $node.remove();
          } else {
            $list = $("<" + type + "><li></li></" + type + ">");
            $list.find('li').append($node.html() || _this.util.phBr);
            return $list.replaceAll($node);
          }
        };
      })(this));
      this.selection.restore();
      return this.trigger('valuechanged');

	},

	outdent : function() {
	    return this.indentation.indent(true);
	},

	// toggle
	title : function(param,disableTag) {
		document.execCommand('formatBlock', false, param);

		/*
	    var $rootNodes;
	    $rootNodes = this.selection.rootNodes();
	    this.selection.save();
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if ($node.is('blockquote') || $node.is(param) || $node.is(disableTag) || _this.util.isDecoratedNode($node)) {
	          return;
	        }
	        return $('<' + param + '/>').append($node.contents()).replaceAll($node);
	      };
	    })(this));
	    this.selection.restore();
	    */
	    return this.trigger('valuechanged');

	}



  });

	var commands =  [
		"bold", // toggle 
		"insertImage",
		"insertorderedlist",
		"insertunorderedlist",
		"italic", // toggle
		"justifyLeft",
		"justifyCenter",
		"justifyFull",
		"justifyRight",
		"strikethrough",
		"underline",
		"undo"
	];

	commands.forEach(function(cmd){
		Editable.prototype[cmd] = function() {
	      document.execCommand(cmd,false,null);
	      if (!this.util.support.oninput) {
	        this.trigger('valuechanged');
	      }
	      return $(document).trigger('selectionchange');					
		};
	});


	function editable(el,opts) {

		/*	
		if (value === undefined) {
   			return node.contentEditable == "true"
		} else {
			if (!value) {
				value = null;
			} else {
				value = "true";
			}
			datax.attr(node,"contentEditable",value);
		}
		*/
		return new Editable(el,opts);
		
	};


	return contents.Editable  = Editable;
	
});
define('skylark-domx-contents/main',[
	"./contents",
	"./editable"
],function(contents){

	return contents;
});
define('skylark-domx-contents', ['skylark-domx-contents/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-contents.js.map
