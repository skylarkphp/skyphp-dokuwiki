/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-data","skylark-ace","../../Addon","../../util","../../Coder"],function(e,t,i,o,r,a){"use strict";class n extends i{_init(){super._init();var i,a=this.coder,n=this.options;this.editor={};n=this.options;var d=a.$container.querySelectorAll(".coder-editor");for(i=0;i<d.length;i++){let a=d[i].querySelector("textarea"),s=t.data(a,"coder-type"),c=t.data(a,"coder-file"),l=document.createElement("div");d[i].appendChild(l),this.editor[s]=o.edit(l);let g=this.editor[s],h=e.clone(n);g.getSession().setMode("ace/mode/"+r.getMode(s,c)),g.getSession().setOptions(h),g.$blockScrolling=1/0}a.on("change",this.change.bind(this),1)}editorChange(e){return()=>{this.coder.emit("change",e)}}change(e,t){var i=e.data,o=this.editor[i.type];i.aceEditor||(o.getSession().setValue(i.content),i.aceEditor=o,o.on("change",this.editorChange(i))),i.content=o.getValue()}static get categoryName(){return"edit"}static get addonName(){return"ace"}}return n.register(a),n});
//# sourceMappingURL=../../sourcemaps/addons/edit/ace.js.map
