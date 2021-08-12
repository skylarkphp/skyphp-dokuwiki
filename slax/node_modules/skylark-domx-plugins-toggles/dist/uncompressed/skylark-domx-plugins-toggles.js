/**
 * skylark-domx-plugins-toggles - The skylark toggle plugin library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx-plugins/skylark-domx-plugins-toggles/
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

define('skylark-domx-plugins-toggles/toggles',[
    "skylark-domx-plugins-base/plugins"
], function(plugins) {
    'use strict';

	return plugins.toggles = {};
});
define('skylark-domx-plugins-toggles/checkbox',[
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

define('skylark-domx-plugins-toggles/collapse',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-eventer",
    "skylark-domx-query",
    "skylark-domx-plugins-base",
    "./toggles"
], function(langx, browser, eventer,  $, plugins, toggles) {


  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse =  plugins.Plugin.inherit({
    klassName: "Collapse",

    pluginName : "lark.toggles.collapse",

    options : {
      toggle: true
    },

    _construct : function(elm,options) {
      ////options = langx.mixin({}, Collapse.DEFAULTS, $(element).data(), options)
      this.overrided(elm,options);
      this.$element      = this.$();
      //this.$trigger      = $('[data-toggle="collapse"][href="#' + elm.id + '"],' +
      //                     '[data-toggle="collapse"][data-target="#' + elm.id + '"]')
      this.transitioning = null

      //if (this.options.parent) {
      //  this.$parent = this.getParent()
      //} else {
      //  this.addAriaAndCollapsedClass(this.$element, this.$trigger)
      //}

      if (this.options.toggle) {
        this.toggle();
      }
    },

    dimension : function () {
      var hasWidth = this.$element.hasClass('width');
      return hasWidth ? 'width' : 'height';
    },

    show : function () {
      if (this.transitioning || this.$element.hasClass('in')) {
        return;
      }

      //var activesData;
      //var actives = this.$parent && this.$parent.children('.collapsable').children('.in, .collapsing')

      //if (actives && actives.length) {
      //  activesData = actives.data('collapse')
      //  if (activesData && activesData.transitioning) return
      //}

      var startEvent = eventer.create('show.collapse');
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      //if (actives && actives.length) {
      //  //Plugin.call(actives, 'hide')
      //  actives.plugin("domx.collapse").hide();
      //  activesData || actives.data('collapse', null)
      //}

      var dimension = this.dimension();

      this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)
        .attr('aria-expanded', true)

      //this.$trigger
      //  .removeClass('collapsed')
      //  .attr('aria-expanded', true)

      this.transitioning = 1

      var complete = function () {
        this.$element
          .removeClass('collapsing')
          .addClass('collapse in')[dimension]('')
        this.transitioning = 0
        this.$element
          .trigger('shown.collapse')
      }

      if (!browser.support.transition) {
        return complete.call(this);
      }

      var scrollSize = langx.camelCase(['scroll', dimension].join('-'));

      this.$element
        .one('transitionEnd', langx.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    },

    hide : function () {
      if (this.transitioning || !this.$element.hasClass('in')) {
        return ;
      }

      var startEvent = eventer.create('hide.collapse');
      this.$element.trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return ;
      } 

      var dimension = this.dimension();

      this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

      this.$element
        .addClass('collapsing')
        .removeClass('collapse in')
        .attr('aria-expanded', false);

      //this.$trigger
      //  .addClass('collapsed')
      //  .attr('aria-expanded', false);

      this.transitioning = 1;

      var complete = function () {
        this.transitioning = 0;
        this.$element
          .removeClass('collapsing')
          .addClass('collapse')
          .trigger('hidden.collapse');
      }

      if (!browser.support.transition) {
        return complete.call(this);
      }

      this.$element
        [dimension](0)
        .one('transitionEnd', langx.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    },

    toggle : function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }

    /*
    getParent : function () {
      return $(this.options.parent)
        .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
        .each(langx.proxy(function (i, element) {
          var $element = $(element)
          this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this))
        .end()
    },

    addAriaAndCollapsedClass : function ($element, $trigger) {
      var isOpen = $element.hasClass('in');

      $element.attr('aria-expanded', isOpen);
      $trigger
        .toggleClass('collapsed', !isOpen)
        .attr('aria-expanded', isOpen);
    }
    */
  });

  Collapse.TRANSITION_DURATION = 350;

  /*
  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }
  */

  plugins.register(Collapse);

  return toggles.Collapse = Collapse;

});

define('skylark-domx-plugins-toggles/radio',[
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

define('skylark-domx-plugins-toggles/tab',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./toggles"
],function(langx,browser,eventer,noder,geom,$,plugins,toggles){

  'use strict';

  // TAB CLASS DEFINITION
  // ====================


  var Tab =  plugins.Plugin.inherit({
    klassName: "Tab",

    pluginName : "lark.toggles.tab",

    _construct : function(element,options) {
      // jscs:disable requireDollarBeforejQueryAssignment
      this.element = $(element)
      this.target = options && options.target;

      // jscs:enable requireDollarBeforejQueryAssignment
      this.element.on("click.lark.toggles.tab",langx.proxy(function(e){
        e.preventDefault()
        this.show();
      },this));    
    },

    show : function () {
      var $this    = this.element
      var $ul      = $this.closest('ul:not(.dropdown-menu)')
      var selector = this.target || $this.data('target');

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      if ($this.parent('li').hasClass('active')) return

      var $previous = $ul.find('.active:last a')
      var hideEvent = eventer.create('hide.lark.toggles.tab', {
        relatedTarget: $this[0]
      })
      var showEvent = eventer.create('show.lark.toggles.tab', {
        relatedTarget: $previous[0]
      })

      $previous.trigger(hideEvent);
      $this.trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

      var $target = $(selector);

      this.activate($this.closest('li'), $ul);
      this.activate($target, $target.parent(), function () {
        $previous.trigger({
          type: 'hidden.lark.toggles.tab',
          relatedTarget: $this[0]
        })
        $this.trigger({
          type: 'shown.lark.toggles.tab',
          relatedTarget: $previous[0]
        })
      })
    },

    activate : function (element, container, callback) {
      var $active    = container.find('> .active')
      var transition = callback
        && browser.support.transition
        && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
            .removeClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', false)

        element
          .addClass('active')
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if (element.parent('.dropdown-menu').length) {
          element
            .closest('li.dropdown')
              .addClass('active')
            .end()
            .find('[data-toggle="tab"]')
              .attr('aria-expanded', true)
        }

        callback && callback()
      }

      $active.length && transition ?
        $active
          .one('transitionEnd', next)
          .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
        next()

      $active.removeClass('in')
    }


  });


  Tab.TRANSITION_DURATION = 150


  plugins.register(Tab);

  return toggles.Tab = Tab;
});

define('skylark-domx-plugins-toggles/main',[
	"./toggles",
	"./checkbox",
	"./collapse",
	"./radio",
	"./tab"
],function(toggles){
	return toggles;
});
define('skylark-domx-plugins-toggles', ['skylark-domx-plugins-toggles/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-toggles.js.map
