/**
 * skylark-domx-plugins-uploads - The file upload plugin library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-emitter","skylark-langx-async/deferred","skylark-domx-velm","skylark-domx-plugins-base","./uploads"],function(e,l,s,i,t){return t.SingleUploader=class extends i.Plugin{get klassName(){return"SingleUploader"}get pluginName(){return"lark.uploads.single"}get options(){return{selectors:{picker:".file-picker",dropzone:".file-dropzone",pastezone:".file-pastezone",startUploads:".start-uploads",cancelUploads:".cancel-uploads"}}}constructor(e,l){super(e,l),this._velm=s(this._elm),this._initFileHandlers()}_initFileHandlers(){var e=this,l=this.options.selectors,s=l.dropzone,i=l.pastezone,t=l.picker;s&&this._velm.$(s).dropzone({dropped:function(l){e._addFile(l[0])}}),i&&this._velm.$(i).pastezone({pasted:function(l){e._addFile(l[0])}}),t&&this._velm.$(t).picker({multiple:!0,picked:function(l){e._addFile(l[0])}})}_addFile(e){this.emit("added",e)}destroy(){}}});
//# sourceMappingURL=sourcemaps/single-uploader.js.map
