define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-widgets-toolbars/ToolbarItem",
  "../../../i18n",
  "../../../addons"
],function(langx, $,ToolButton,i18n,addons){ 

  var EmojiButton = ToolButton.inherit({

    renderMenu : function() {
      var editor = this.action.editor;
      var $list, dir, html, name, opts, src, tpl, _i, _len, _ref;
      tpl = '<ul class="emoji-list">\n</ul>'; 
      opts = langx.extend({
        imagePath: 'images/emoji/',
        images: EmojiButton.images
      }, editor.options.addons.toolbar.items.emoji || {});
      html = "";
      dir = opts.imagePath.replace(/\/$/, '') + '/';
      _ref = opts.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        src = "" + dir + name;
        name = name.split('.')[0];
        html += "<li data-name='" + name + "'><img src='" + src + "' width='20' height='20' alt='" + name + "' /></li>";
      }
      $list = $(tpl);
      $list.html(html).appendTo(this.menuWrapper);
      return $list.on('mousedown', 'li', (function(_this) {
        return function(e) {
          var $img;
          _this.wrapper.removeClass('menu-on');
          if (!editor.editable.inputManager.focused) {
            return;
          }
          $img = $(e.currentTarget).find('img').clone().attr({
            'data-emoji': true,
            'data-non-image': true
          });
          editor.editable.selection.insertNode($img);
          editor.trigger('valuechanged');
          editor.trigger('selectionchanged');
          return false;
        };
      })(this));
    }

  });


  EmojiButton.i18n = {
    'zh-CN': {
      emoji: '表情'
    },
    'en-US': {
      emoji: 'emoji'
    }
  };

  EmojiButton.images = ['smile.png', 'smiley.png', 'laughing.png', 'blush.png', 'heart_eyes.png', 'smirk.png', 'flushed.png', 'grin.png', 'wink.png', 'kissing_closed_eyes.png', 'stuck_out_tongue_winking_eye.png', 'stuck_out_tongue.png', 'sleeping.png', 'worried.png', 'expressionless.png', 'sweat_smile.png', 'cold_sweat.png', 'joy.png', 'sob.png', 'angry.png', 'mask.png', 'scream.png', 'sunglasses.png', 'heart.png', 'broken_heart.png', 'star.png', 'anger.png', 'exclamation.png', 'question.png', 'zzz.png', 'thumbsup.png', 'thumbsdown.png', 'ok_hand.png', 'punch.png', 'v.png', 'clap.png', 'muscle.png', 'pray.png', 'skull.png', 'trollface.png'];


  addons.toolbar.items.emoji = EmojiButton; 

  return EmojiButton;
	
});