/**
 * skylark-ace - A version of ace v1.4.3 that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(require,exports,module){"use strict";require("./lib/oop");var t=require("./lib/dom");function e(t){this.isOpen=!1,this.$element=null,this.$parentNode=t}(function(){this.$init=function(){return this.$element=t.createElement("div"),this.$element.className="ace_tooltip",this.$element.style.display="none",this.$parentNode.appendChild(this.$element),this.$element},this.getElement=function(){return this.$element||this.$init()},this.setText=function(t){this.getElement().textContent=t},this.setHtml=function(t){this.getElement().innerHTML=t},this.setPosition=function(t,e){this.getElement().style.left=t+"px",this.getElement().style.top=e+"px"},this.setClassName=function(e){t.addCssClass(this.getElement(),e)},this.show=function(t,e,i){null!=t&&this.setText(t),null!=e&&null!=i&&this.setPosition(e,i),this.isOpen||(this.getElement().style.display="block",this.isOpen=!0)},this.hide=function(){this.isOpen&&(this.getElement().style.display="none",this.isOpen=!1)},this.getHeight=function(){return this.getElement().offsetHeight},this.getWidth=function(){return this.getElement().offsetWidth},this.destroy=function(){this.isOpen=!1,this.$element&&this.$element.parentNode&&this.$element.parentNode.removeChild(this.$element)}}).call(e.prototype),exports.Tooltip=e});
//# sourceMappingURL=sourcemaps/tooltip.js.map
