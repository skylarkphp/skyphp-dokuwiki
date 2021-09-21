/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","../../addon","../../util","../../codeground"],function(t,e,a,i){"use strict";class r extends e{_init(){super._init();var t=this.coder;this.options;this.listenTo(t,"changed",this.update),this.runScriptTypes=["application/javascript","application/ecmascript","application/x-ecmascript","application/x-javascript","text/ecmascript","text/javascript","text/javascript1.0","text/javascript1.1","text/javascript1.2","text/javascript1.3","text/javascript1.4","text/javascript1.5","text/jscript","text/livescript","text/x-ecmascript","text/x-javascript"]}update(t){var e=t.data;if("html"===e.type){var a=document.createElement("div");a.innerHTML=e.content;var i=null,r=a.querySelectorAll("script");for(let t=0;t<r.length;t++)(i=r[t].getAttribute("type"))&&-1===this.runScriptTypes.indexOf(i)||r[t].parentNode.removeChild(r[t]);e.content=a.innerHTML}}static get categoryName(){return"general"}static get addonName(){return"scriptless"}}return r.register(i),r});
//# sourceMappingURL=../../sourcemaps/addons/general/scriptless.js.map
