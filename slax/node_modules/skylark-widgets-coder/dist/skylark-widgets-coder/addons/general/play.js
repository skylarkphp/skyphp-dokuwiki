/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","../../Addon","../../util","../../Coder"],function(e,t,n,c){class i extends t{get options(){return{firstRun:!0}}_init(){super._init();var e=this.coder,t={};!1===this.options.firstRun&&(t={html:{type:"html",content:""},css:{type:"css",content:""},js:{type:"js",content:""}});var n=document.createElement("button");n.className="coder-button coder-button-play",n.innerHTML="Run",e.$container.appendChild(n),n.addEventListener("click",this.run.bind(this)),e.on("change",this.change.bind(this),10),this.cache=t,this.code={},this.coder=e}change(t){var n=t.data;this.code[n.type]=e.clone(n),void 0!==this.cache[n.type]?this.cache[n.type].forceRender=null:this.cache[n.type]=e.clone(n)}run(){for(let t in this.code)this.cache[t]=e.mixin({forceRender:!0},this.code[t]),this.coder.emit("change",this.cache[t])}static get categoryName(){return"general"}static get addonName(){return"play"}}return i.register(c),i});
//# sourceMappingURL=../../sourcemaps/addons/general/play.js.map
