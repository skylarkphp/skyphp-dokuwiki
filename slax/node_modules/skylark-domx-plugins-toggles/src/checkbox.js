define([
  "skylark-langx/langx",
  "skylark-domx/browser",
  "skylark-domx/eventer",
  "skylark-domx/noder",
  "skylark-domx/geom",
  "skylark-domx/query",
  "skylark-domx-plugins-base",
  "./toggles"
],function(langx,browser,eventer,noder,geom,$,plugins,toggles){

  var Checkbox = plugins.Plugin.inherit({
    klassName: "Checkbox",

    pluginName : "lark.toggles.checkbox",

    options : {
      ignoreVisibilityCheck: false
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      var $element = this.$();

      if (elm.tagName.toLowerCase() !== 'label') {
        throw new Error('Checkbox must be initialized on the `label` that wraps the `input` element. See https://github.com/ExactTarget/fuelux/blob/master/reference/markup/checkbox.html for example of proper markup. Call `.checkbox()` on the `<label>` not the `<input>`');
        return;
      }

      // cache elements
      this.$label = $element;
      this.$chk = this.$label.find('input[type="checkbox"]');
      this.$container = $element.parent('.checkbox'); // the container div

      if (!this.options.ignoreVisibilityCheck && this.$chk.css('visibility').match(/hidden|collapse/)) {
        throw new Error('For accessibility reasons, in order for tab and space to function on checkbox, checkbox `<input />`\'s `visibility` must not be set to `hidden` or `collapse`. See https://github.com/ExactTarget/fuelux/pull/1996 for more details.');
      }

      // determine if a toggle container is specified
      var containerSelector = this.$chk.attr('data-toggle');
      this.$toggleContainer = $(containerSelector);

      // handle internal events
      this.$chk.on('change', langx.proxy(this.itemchecked, this));

      // set default state
      this.setInitialState();
    },

    setInitialState: function setInitialState () {
      var $chk = this.$chk;

      // get current state of input
      var checked = $chk.prop('checked');
      var disabled = $chk.prop('disabled');

      // sync label class with input state
      this.setCheckedState($chk, checked);
      this.setDisabledState($chk, disabled);
    },

    setCheckedState: function setCheckedState (element, checked) {
      var $chk = element;
      var $lbl = this.$label;
      var $containerToggle = this.$toggleContainer;

      if (checked) {
        $chk.prop('checked', true);
        $lbl.addClass('checked');
        $containerToggle.removeClass('hide hidden');
        $lbl.trigger('checked.lark.toggles.checkbox');
      } else {
        $chk.prop('checked', false);
        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
        $lbl.trigger('unchecked.lark.toggles.checkbox');
      }

      $lbl.trigger('changed.lark.toggles.checkbox', checked);
    },

    setDisabledState: function (element, disabled) {
      var $chk = $(element);
      var $lbl = this.$label;

      if (disabled) {
        $chk.prop('disabled', true);
        $lbl.addClass('disabled');
        $lbl.trigger('disabled.lark.toggles.checkbox');
      } else {
        $chk.prop('disabled', false);
        $lbl.removeClass('disabled');
        $lbl.trigger('enabled.lark.toggles.checkbox');
      }

      return $chk;
    },

    itemchecked: function (evt) {
      var $chk = $(evt.target);
      var checked = $chk.prop('checked');

      this.setCheckedState($chk, checked);
    },

    toggle: function () {
      var checked = this.isChecked();

      if (checked) {
        this.uncheck();
      } else {
        this.check();
      }
    },

    check: function () {
      this.setCheckedState(this.$chk, true);
    },

    uncheck: function () {
      this.setCheckedState(this.$chk, false);
    },

    isChecked: function () {
      var checked = this.$chk.prop('checked');
      return checked;
    },

    enable: function () {
      this.setDisabledState(this.$chk, false);
    },

    disable: function () {
      this.setDisabledState(this.$chk, true);
    },

    destroy: function () {
      this.$label.remove();
      return this.$label[0].outerHTML;
    }
  });


  Checkbox.prototype.getValue = Checkbox.prototype.isChecked;

  plugins.register(Checkbox);

  return toggles.Checkbox = Checkbox;
});
