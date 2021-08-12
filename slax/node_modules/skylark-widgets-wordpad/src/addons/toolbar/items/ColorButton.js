define([
  "skylark-domx-query",
  "skylark-widgets-toolbars/ToolbarItem",
  "../../../i18n",
  "../../../addons"
],function($,ToolButton,i18n,addons){ 
  

   var ColorButton = ToolButton.inherit({
    render : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      return ToolButton.prototype.render.apply(this, args);
    },

    renderMenu : function() {
      var editor = this.action.editor;
      $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default"></a></li>\n</ul>').appendTo(this.menuWrapper);
      this.menuWrapper.on('mousedown', '.color-list', function(e) {
        return false;
      });
      return this.menuWrapper.on('click', '.font-color', (function(_this) {
        return function(e) {
          var $link, $p, hex, range, rgb, textNode;
          _this.wrapper.removeClass('menu-on');
          $link = $(e.currentTarget);
          if ($link.hasClass('font-color-default')) {
            $p = editor.body.find('p, li');
            if (!($p.length > 0)) {
              return;
            }
            rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
            hex = _this._convertRgbToHex(rgb);
          } else {
            rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
            hex = _this._convertRgbToHex(rgb);
          }
          if (!hex) {
            return;
          }

          return editor.editable.fontColor(hex,$link.hasClass('font-color-default'),i18n.translate('coloredText'));
        };
      })(this));
    },

    _convertRgbToHex : function(rgb) {
      var match, re, rgbToHex;
      re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
      match = re.exec(rgb);
      if (!match) {
        return '';
      }
      rgbToHex = function(r, g, b) {
        var componentToHex;
        componentToHex = function(c) {
          var hex;
          hex = c.toString(16);
          if (hex.length === 1) {
            return '0' + hex;
          } else {
            return hex;
          }
        };
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      };
      return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
    }

   });

   
   addons.toolbar.items.color = ColorButton; 


   return ColorButton;
	
});