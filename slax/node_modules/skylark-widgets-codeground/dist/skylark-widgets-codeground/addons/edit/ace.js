/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-data","skylark-ace","../../addon","../../util","../../codeground"],function(e,t,i,o,a,d){"use strict";class r extends o{_init(){super._init();var o,d=this.coder,r=this.options;this.editor={};r=this.options;var s=d.$(".codeg-editor");for(o=0;o<s.length;o++){let d=s[o].querySelector("textarea"),n=t.data(d,"codeg-type"),c=t.data(d,"codeg-file"),l=document.createElement("div");s[o].appendChild(l),this.editor[n]=i.edit(l);let g=this.editor[n],h=e.clone(r);g.getSession().setMode("ace/mode/"+a.getMode(n,c)),g.getSession().setOptions(h),g.$blockScrolling=1/0}this.listenTo(d,"reseted",this.update)}editorChange(e){return()=>{var t=this.editor[e.type];e.content=t.getValue(),this.coder.emit("change",e)}}update(e){var t=e.data;this.editor[t.type].getSession().setValue(t.content)}static get categoryName(){return"edit"}static get addonName(){return"ace"}}return r.register(d),r});
//# sourceMappingURL=../../sourcemaps/addons/edit/ace.js.map
