define([
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
        $el.append('<p>' + this.editable.util.phBr + '</p>');
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