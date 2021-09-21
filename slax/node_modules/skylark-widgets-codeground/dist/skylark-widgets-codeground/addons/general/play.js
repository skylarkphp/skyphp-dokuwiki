/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-noder","skylark-domx-eventer","skylark-domx-query","../../addon","../../util","../../codeground"],function(t,e,n,s,r,i,o){class c extends r{get options(){return{firstRun:!0}}_init(){super._init();var t=this.coder,e={};!1===this.options.firstRun&&(e={html:{type:"html",content:""},css:{type:"css",content:""},js:{type:"js",content:""}});var n=s("<button/>").prop({className:"codeg-button codeg-button-play",innerHTML:"Run"});t.$().append(n),this.listenTo(n,"click",this.run),this.listenTo(t,"changed",this.update),this.cache=e,this.code={},this.coder=t}update(e){var n=e.data;this.code[n.type]=t.clone(n),void 0!==this.cache[n.type]?this.cache[n.type].forceRender=null:this.cache[n.type]=t.clone(n)}run(){this.coder.emit("reseted")}static get categoryName(){return"general"}static get addonName(){return"play"}}return c.register(o),c});
//# sourceMappingURL=../../sourcemaps/addons/general/play.js.map
