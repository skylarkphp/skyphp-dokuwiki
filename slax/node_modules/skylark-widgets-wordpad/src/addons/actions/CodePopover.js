define([
  "skylark-domx-query",
  "../../addons",
  "../../Popover"
],function($,addons,Popover){ 
  
   var CodePopover = Popover.inherit({
     render : function() {
      var $option, k, lang, len, ref;
      this._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">" + (this._t('selectLanguage')) + "</option>\n    </select>\n  </div>\n</div>";
      this.langs = this.editor.options.codeLanguages || [
        {
          name: 'Bash',
          value: 'bash'
        }, {
          name: 'C++',
          value: 'c++'
        }, {
          name: 'C#',
          value: 'cs'
        }, {
          name: 'CSS',
          value: 'css'
        }, {
          name: 'Erlang',
          value: 'erlang'
        }, {
          name: 'Less',
          value: 'less'
        }, {
          name: 'Sass',
          value: 'sass'
        }, {
          name: 'Diff',
          value: 'diff'
        }, {
          name: 'CoffeeScript',
          value: 'coffeescript'
        }, {
          name: 'HTML,XML',
          value: 'html'
        }, {
          name: 'JSON',
          value: 'json'
        }, {
          name: 'Java',
          value: 'java'
        }, {
          name: 'JavaScript',
          value: 'js'
        }, {
          name: 'Markdown',
          value: 'markdown'
        }, {
          name: 'Objective C',
          value: 'oc'
        }, {
          name: 'PHP',
          value: 'php'
        }, {
          name: 'Perl',
          value: 'parl'
        }, {
          name: 'Python',
          value: 'python'
        }, {
          name: 'Ruby',
          value: 'ruby'
        }, {
          name: 'SQL',
          value: 'sql'
        }
      ];
      this.el.addClass('code-popover').append(this._tpl);
      this.selectEl = this.el.find('.select-lang');
      ref = this.langs;
      for (k = 0, len = ref.length; k < len; k++) {
        lang = ref[k];
        $option = $('<option/>', {
          text: lang.name,
          value: lang.value
        }).appendTo(this.selectEl);
      }
      this.selectEl.on('change', (function(_this) {
        return function(e) {
          var selected;
          _this.lang = _this.selectEl.val();
          selected = _this.target.hasClass('selected');
          _this.target.removeClass().removeAttr('data-lang');
          if (_this.lang !== -1) {
            _this.target.attr('data-lang', _this.lang);
          }
          if (selected) {
            _this.target.addClass('selected');
          }
          return _this.editor.trigger('valuechanged');
        };
      })(this));
      return this.editor.on('valuechanged', (function(_this) {
        return function(e) {
          if (_this.active) {
            return _this.refresh();
          }
        };
      })(this));
    },

    show : function() {
      var args;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      Popover.prototype.show.apply(this, args);
      this.lang = this.target.attr('data-lang');
      if (this.lang != null) {
        return this.selectEl.val(this.lang);
      } else {
        return this.selectEl.val(-1);
      }
    }
   });

  return CodePopover;
});