/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";var t=require("../lib/event"),i=require("../lib/useragent"),e=exports.MouseEvent=function(t,i){this.domEvent=t,this.editor=i,this.x=this.clientX=t.clientX,this.y=this.clientY=t.clientY,this.$pos=null,this.$inSelection=null,this.propagationStopped=!1,this.defaultPrevented=!1};(function(){this.stopPropagation=function(){t.stopPropagation(this.domEvent),this.propagationStopped=!0},this.preventDefault=function(){t.preventDefault(this.domEvent),this.defaultPrevented=!0},this.stop=function(){this.stopPropagation(),this.preventDefault()},this.getDocumentPosition=function(){return this.$pos?this.$pos:(this.$pos=this.editor.renderer.screenToTextCoordinates(this.clientX,this.clientY),this.$pos)},this.inSelection=function(){if(null!==this.$inSelection)return this.$inSelection;var t=this.editor.getSelectionRange();if(t.isEmpty())this.$inSelection=!1;else{var i=this.getDocumentPosition();this.$inSelection=t.contains(i.row,i.column)}return this.$inSelection},this.getButton=function(){return t.getButton(this.domEvent)},this.getShiftKey=function(){return this.domEvent.shiftKey},this.getAccelKey=i.isMac?function(){return this.domEvent.metaKey}:function(){return this.domEvent.ctrlKey}}).call(e.prototype)});
//# sourceMappingURL=../sourcemaps/mouse/mouse_event.js.map
