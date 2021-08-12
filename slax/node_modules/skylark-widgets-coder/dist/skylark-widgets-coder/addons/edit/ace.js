/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-data","skylark-ace","../../Addon","../../util","../../Coder"],function(e,t,i,r,o,a){"use strict";class n extends r{_init(){super._init();var r,a=this.coder,n=this.options;this.editor={};n=this.options;var d=a.$container.querySelectorAll(".coder-editor");for(r=0;r<d.length;r++){let a=d[r].querySelector("textarea"),s=t.data(a,"coder-type"),c=t.data(a,"coder-file"),l=document.createElement("div");d[r].appendChild(l),this.editor[s]=i.edit(l);let h=this.editor[s],g=e.clone(n);h.getSession().setMode("ace/mode/"+o.getMode(s,c)),h.getSession().setOptions(g),h.$blockScrolling=1/0}a.on("change",this.change.bind(this),1)}editorChange(e){return()=>{var t=this.editor[e.type];e.content=t.getValue(),this.coder.emit("change",e)}}change(e,t){var i=e.data,r=this.editor[i.type];i.aceEditor||(r.getSession().setValue(i.content),i.aceEditor=r,r.on("change",this.editorChange(i)))}static get categoryName(){return"edit"}static get addonName(){return"ace"}}return n.register(a),n});
//# sourceMappingURL=../../sourcemaps/addons/edit/ace.js.map
