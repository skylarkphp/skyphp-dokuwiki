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


  var Radio = plugins.Plugin.inherit({
    klassName: "Radio",

    pluginName : "lark.toggles.radio",

    options : {
      ignoreVisibilityCheck: false
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      if (elm.tagName.toLowerCase() !== 'label') {
        throw new Error('Radio must be initialized on the `label` that wraps the `input` element. See https://github.com/ExactTarget/fuelux/blob/master/reference/markup/radio.html for example of proper markup. Call `.radio()` on the `<label>` not the `<input>`');
      }

      // cache elements
      this.$label = this.$();
      this.$radio = this.$label.find('input[type="radio"]');
      this.groupName = this.$radio.attr('name'); // don't cache group itself since items can be added programmatically

      if (!this.options.ignoreVisibilityCheck && this.$radio.css('visibility').match(/hidden|collapse/)) {
        throw new Error('For accessibility reasons, in order for tab and space to function on radio, `visibility` must not be set to `hidden` or `collapse`. See https://github.com/ExactTarget/fuelux/pull/1996 for more details.');
      }

      // determine if a toggle container is specified
      var containerSelector = this.$radio.attr('data-toggle');
      this.$toggleContainer = $(containerSelector);

      // handle internal events
      this.$radio.on('change', langx.proxy(this.itemchecked, this));

      // set default state
      this.setInitialState();
    },

    setInitialState: function () {
      var $radio = this.$radio;

      // get current state of input
      var checked = $radio.prop('checked');
      var disabled = $radio.prop('disabled');

      // sync label class with input state
      this.setCheckedState($radio, checked);
      this.setDisabledState($radio, disabled);
    },

    resetGroup: function () {
      var $radios = $('input[name="' + this.groupName + '"]');
      $radios.each(function resetRadio (index, item) {
        var $radio = $(item);
        var $lbl = $radio.parent();
        var containerSelector = $radio.attr('data-toggle');
        var $containerToggle = $(containerSelector);


        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
      });
    },

    setCheckedState: function (element, checked) {
      var $radio = element;
      var $lbl = $radio.parent();
      var containerSelector = $radio.attr('data-toggle');
      var $containerToggle = $(containerSelector);

      if (checked) {
        // reset all items in group
        this.resetGroup();

        $radio.prop('checked', true);
        $lbl.addClass('checked');
        $containerToggle.removeClass('hide hidden');
        $lbl.trigger('checked.lark.toggles.radio');
      } else {
        $radio.prop('checked', false);
        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
        $lbl.trigger('unchecked.lark.toggles.radio');
      }

      $lbl.trigger('changed.lark.toggles.radio', checked);
    },

    setDisabledState: function (element, disabled) {
      var $radio = $(element);
      var $lbl = this.$label;

      if (disabled) {
        $radio.prop('disabled', true);
        $lbl.addClass('disabled');
        $lbl.trigger('disabled.lark.toggles.radio');
      } else {
        $radio.prop('disabled', false);
        $lbl.removeClass('disabled');
        $lbl.trigger('enabled.lark.toggles.radio');
      }

      return $radio;
    },

    itemchecked: function (evt) {
      var $radio = $(evt.target);
      this.setCheckedState($radio, true);
    },

    check: function () {
      this.setCheckedState(this.$radio, true);
    },

    uncheck: function () {
      this.setCheckedState(this.$radio, false);
    },

    isChecked: function () {
      var checked = this.$radio.prop('checked');
      return checked;
    },

    enable: function () {
      this.setDisabledState(this.$radio, false);
    },

    disable: function () {
      this.setDisabledState(this.$radio, true);
    },

    destroy: function () {
      this.$label.remove();
      return this.$label[0].outerHTML;
    }

  });


  Radio.prototype.getValue = Radio.prototype.isChecked;

  plugins.register(Radio);

  return toggles.Radio = Radio;
});
