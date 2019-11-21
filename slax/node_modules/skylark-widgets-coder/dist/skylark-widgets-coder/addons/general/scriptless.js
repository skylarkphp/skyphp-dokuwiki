/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","../../Addon","../../util","../../Coder"],function(t,e,i,a){"use strict";class r extends e{_init(){super._init();var t=this.coder;this.options;t.on("change",this.change.bind(this)),this.runScriptTypes=["application/javascript","application/ecmascript","application/x-ecmascript","application/x-javascript","text/ecmascript","text/javascript","text/javascript1.0","text/javascript1.1","text/javascript1.2","text/javascript1.3","text/javascript1.4","text/javascript1.5","text/jscript","text/livescript","text/x-ecmascript","text/x-javascript"]}change(t){var e=t.data;if("html"===e.type){var i=document.createElement("div");i.innerHTML=e.content;var a=null,r=i.querySelectorAll("script");for(let t=0;t<r.length;t++)(a=r[t].getAttribute("type"))&&-1===this.runScriptTypes.indexOf(a)||r[t].parentNode.removeChild(r[t]);e.content=i.innerHTML}}static get categoryName(){return"general"}static get addonName(){return"scriptless"}}return r.register(a),r});
//# sourceMappingURL=../../sourcemaps/addons/general/scriptless.js.map
