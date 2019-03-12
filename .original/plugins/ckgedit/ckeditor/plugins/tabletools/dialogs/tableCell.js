CKEDITOR.dialog.add("cellProperties",function(g){var c=g.lang.table,e=c.cell,d=g.lang.common,k=CKEDITOR.dialog.validate,l=/^(\d+(?:\.\d+)?)(px|%)$/,h={type:"html",html:"&nbsp;"},b,j=g.lang.dir=="rtl",a=g.plugins.colordialog;function i(m){return function(n){var p=m(n[0]);for(var o=1;o<n.length;o++){if(m(n[o])!==p){p=null;break}}if(typeof p!="undefined"){this.setValue(p);if(CKEDITOR.env.gecko&&this.type=="select"&&!p){this.getInputElement().$.selectedIndex=-1}}}}function f(m){var n=l.exec(m.getStyle("width")||m.getAttribute("width"));if(n){return n[2]}}return{title:e.title,minWidth:CKEDITOR.env.ie&&CKEDITOR.env.quirks?450:410,minHeight:CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.quirks)?230:220,contents:[{id:"info",label:e.title,accessKey:"I",elements:[{type:"hbox",widths:["40%","5%","40%"],children:[{type:"vbox",padding:0,children:[b={type:"html",id:"hiddenSpacer",html:"&nbsp;",style:"display: none"},h,{type:"select",id:"hAlign",label:e.hAlign,"default":"",items:[[d.notSet,""],[d.left,"left"],[d.center,"center"],[d.right,"right"]],setup:i(function(n){var o=n.getAttribute("align"),m=n.getStyle("text-align");return m||o||""}),commit:function(m){var n=this.getValue();if(n){m.setStyle("text-align",n);m.setAttribute("class",n+"align")}else{m.removeStyle("text-align");m.removeAttribute("align")}}}]},h,{type:"vbox",padding:0,children:[{type:"select",id:"cellType",label:e.cellType,"default":"td",items:[[e.data,"td"],[e.header,"th"]],setup:i(function(m){return m.getName()}),commit:function(m){m.renameNode(this.getValue())}},h,{type:"text",id:"rowSpan",label:e.rowSpan,"default":"",validate:k.integer(e.invalidRowSpan),setup:i(function(m){var n=parseInt(m.getAttribute("rowSpan"),10);if(n&&n!=1){return n}}),commit:function(m){var n=parseInt(this.getValue(),10);if(n&&n!=1){m.setAttribute("rowSpan",this.getValue())}else{m.removeAttribute("rowSpan")}}},{type:"text",id:"colSpan",label:e.colSpan,"default":"",validate:k.integer(e.invalidColSpan),setup:i(function(n){var m=parseInt(n.getAttribute("colSpan"),10);if(m&&m!=1){return m}}),commit:function(m){var n=parseInt(this.getValue(),10);if(n&&n!=1){m.setAttribute("colSpan",this.getValue())}else{m.removeAttribute("colSpan")}}}]}]}]}],onShow:function(){this.cells=CKEDITOR.plugins.tabletools.getSelectedCells(this._.editor.getSelection());this.setupContent(this.cells)},onOk:function(){var p=this._.editor.getSelection(),o=p.createBookmarks();var m=this.cells;for(var n=0;n<m.length;n++){this.commitContent(m[n])}this._.editor.forceNextSelectionCheck();p.selectBookmarks(o);this._.editor.selectionChange()},onLoad:function(){var m={};this.foreach(function(n){if(!n.setup||!n.commit){return}n.setup=CKEDITOR.tools.override(n.setup,function(o){return function(){o.apply(this,arguments);m[n.id]=n.getValue()}});n.commit=CKEDITOR.tools.override(n.commit,function(o){return function(){if(m[n.id]!==n.getValue()){o.apply(this,arguments)}}})})}}});