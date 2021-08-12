define([
	"skylark-langx/langx",
	"skylark-domx-noder",
	"skylark-domx-query",
	"./contents",
	"./Hotkeys",
	"./Util",
	"./InputManager", 
	"./Selection", 
	"./UndoManager", 
	"./Keystroke",
	"./Formatter", 
	"./Indentation", 
	"./Clipboard"
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