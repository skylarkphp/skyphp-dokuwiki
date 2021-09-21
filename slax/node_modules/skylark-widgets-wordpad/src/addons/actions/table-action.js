define([
  "skylark-langx/langx",
  "skylark-domx-tables",
  "skylark-domx-query",
  "../../addons",
  "../../action"
],function(langx,tables,$,addons,Action){ 
  var TableAction = Action.inherit({
    name : 'table',

    icon : 'table',

    htmlTag : 'table',

    disableTag : 'pre, li, blockquote',

    menu : true,

    _init : function() {
      Action.prototype._init.call(this);
      langx.merge(this.editor.editable.formatter._allowedTags, ['thead', 'th', 'tbody', 'tr', 'td', 'colgroup', 'col']);
      langx.extend(this.editor.editable.formatter._allowedAttributes, {
        td: ['rowspan', 'colspan'],
        th: ['rowspan', 'colspan'],
        col: ['width']
      });
      langx.extend(this.editor.editable.formatter._allowedStyles, {
        td: ['text-align'],
        th: ['text-align']
      });
      this._initShortcuts();
      this._initResize();
      this.editor.on('decorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.decorate($(table));
          });
        };
      })(this));
      this.editor.on('undecorate', (function(_this) {
        return function(e, $el) {
          return $el.find('table').each(function(i, table) {
            return _this.undecorate($(table));
          });
        };
      })(this));
      this.editor.on('selectionchanged.table', (function(_this) {
        return function(e) {
          var $container, range;
          _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
          range = _this.editor.editable.selection.range();
          if (!range) {
            return;
          }
          $container = _this.editor.editable.selection.containerNode();
          if (range.collapsed && $container.is('.wordpad-table')) {
            _this.editor.editable.selection.setRangeAtEndOf($container);
          }
          return $container.closest('td, th', _this.editor.body).addClass('active');
        };
      })(this));
      this.editor.on('blur.table', (function(_this) {
        return function(e) {
          return _this.editor.body.find('.wordpad-table td, .wordpad-table th').removeClass('active');
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('up', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'up');
          return true;
        };
      })(this));
      this.editor.editable.keystroke.add('down', 'td', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
      return this.editor.editable.keystroke.add('down', 'th', (function(_this) {
        return function(e, $node) {
          _this._tdNav($node, 'down');
          return true;
        };
      })(this));
    },

    _tdNav : function($td, direction) {
      var $anotherTr, $tr, action, anotherTag, index, parentTag, ref;
      if (direction == null) {
        direction = 'up';
      }
      action = direction === 'up' ? 'prev' : 'next';
      ref = direction === 'up' ? ['tbody', 'thead'] : ['thead', 'tbody'], parentTag = ref[0], anotherTag = ref[1];
      $tr = $td.parent('tr');
      $anotherTr = this["_" + action + "Row"]($tr);
      if (!($anotherTr.length > 0)) {
        return true;
      }
      index = $tr.find('td, th').index($td);
      return this.editor.editable.selection.setRangeAtEndOf($anotherTr.find('td, th').eq(index));
    },

    _initResize : function() {

      tables.resizable(document,{
        cssClasses : {
          resizeHandle : "wordpad-resize-handle",
          wrapper : "wordpad-table"
        }
      });

    },

    _initShortcuts : function() {
      this.editor.editable.hotkeys.add('ctrl+alt+up', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+down', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
          return false;
        };
      })(this));
      this.editor.editable.hotkeys.add('ctrl+alt+left', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
          return false;
        };
      })(this));
      return this.editor.editable.hotkeys.add('ctrl+alt+right', (function(_this) {
        return function(e) {
          _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
          return false;
        };
      })(this));
    },

    renderMenu : function() {
      var $table;
      $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (this._t('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (this._t('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (this._t('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
      this.createMenu = this.menuWrapper.find('.menu-create-table');
      this.editMenu = this.menuWrapper.find('.menu-edit-table');
      $table = this.createTable(6, 6).appendTo(this.createMenu);
      this.createMenu.on('mouseenter', 'td, th', (function(_this) {
        return function(e) {
          var $td, $tr, $trs, num;
          _this.createMenu.find('td, th').removeClass('selected');
          $td = $(e.currentTarget);
          $tr = $td.parent();
          num = $tr.find('td, th').index($td) + 1;
          $trs = $tr.prevAll('tr').addBack();
          if ($tr.parent().is('tbody')) {
            $trs = $trs.add($table.find('thead tr'));
          }
          return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
        };
      })(this));
      this.createMenu.on('mouseleave', function(e) {
        return $(e.currentTarget).find('td, th').removeClass('selected');
      });
      return this.createMenu.on('mousedown', 'td, th', (function(_this) {
        return function(e) {
          var $closestBlock, $td, $tr, colNum, rowNum;
          _this.wrapper.removeClass('menu-on');
          if (!_this.editor.editable.inputManager.focused) {
            return;
          }
          $td = $(e.currentTarget);
          $tr = $td.parent();
          colNum = $tr.find('td').index($td) + 1;
          rowNum = $tr.prevAll('tr').length + 1;
          if ($tr.parent().is('tbody')) {
            rowNum += 1;
          }
          $table = _this.createTable(rowNum, colNum, true);
          $closestBlock = _this.editor.editable.selection.blockNodes().last();
          if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
            $closestBlock.replaceWith($table);
          } else {
            $closestBlock.after($table);
          }
          _this.decorate($table);
          _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
          _this.editor.trigger('valuechanged');
          return false;
        };
      })(this));
    },

    decorate : function($table) {
      return $(tables.decorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },

    undecorate : function($table) {
      return $(tables.undecorate($table[0],{
        tableDecorate : 'wordpad-table',
        resizeHandle : 'wordpad-resize-handle'
      }));

    },

    createTable : function(row, col, phBr) {
      return $(tables.createTable(row,col,phBr ? this.editor.editable.util.phBr : null));
    },

    refreshTableWidth : function($table) {
      return table.refreshTableWidth($table[0]);
    },

    deleteRow : function($td) {
      var self = this,
          ret; 

      tables.deleteRow($td[0],function(newTr,index){
        if (newTr) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTr).find('td, th').eq(index));
        }
      })

      return ret;
    },

    insertRow : function($td, direction) {
      var self = this,
          ret; 

      tables.insertRow($td[0],direction,self.editor.editable.util.phBr,function(newTr,index){
        ret =  self.editor.editable.selection.setRangeAtStartOf($(newTr).find('td, th').eq(index));
      })

      return ret;

    },

    deleteCol : function($td) {
      var self = this,
          ret; 

      tables.deleteCol($td[0],function(newTd){
        if (newTd) {
          ret = self.editor.editable.selection.setRangeAtEndOf($(newTd));
        }
      })

      return ret;
    },

    insertCol : function($td, direction) {
      var self = this,
          ret; 

      tables.insertCol($td[0],direction,self.editor.editable.util.phBr,function(newTd){
        ret = self.editor.editable.selection.setRangeAtStartOf($(newTd));
      })

      return ret;
    },

    deleteTable : function($td) {
      var self = this;
      tables.deleteTable($td[0],function($block){
        if ($block.length > 0) {
          return self.editor.editable.selection.setRangeAtStartOf($block);
        }
      });
    },

    _execute : function(param) {
      var $td;
      $td = this.editor.editable.selection.containerNode().closest('td, th');
      if (!($td.length > 0)) {
        return;
      }
      if (param === 'deleteRow') {
        this.deleteRow($td);
      } else if (param === 'insertRowAbove') {
        this.insertRow($td, 'before');
      } else if (param === 'insertRowBelow') {
        this.insertRow($td);
      } else if (param === 'deleteCol') {
        this.deleteCol($td);
      } else if (param === 'insertColLeft') {
        this.insertCol($td, 'before');
      } else if (param === 'insertColRight') {
        this.insertCol($td);
      } else if (param === 'deleteTable') {
        this.deleteTable($td);
      } else {
        return;
      }
      return this.editor.trigger('valuechanged');
    }

   });


  addons.actions.table = TableAction;

  return TableAction;

});