/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","skylark-widgets-base/Addon","../Toolbar","../Wordpad","../i18n"],function(e,t,n,r,o){var i=t.inherit({});return i.categoryName="genernal",i.addonName="dropzone",i.prototype._entered=0,i.prototype._init=function(){var t;if(this.editor=this._widget,null!=this.editor.uploader)return e(document.body).on("dragover",function(e){return e.originalEvent.dataTransfer.dropEffect="none",e.preventDefault()}),e(document.body).on("drop",function(e){return e.preventDefault()}),this.imageBtn=this.editor.toolbar.findButton("image"),this.editor.body.on("dragover",function(e){return e.originalEvent.dataTransfer.dropEffect="copy",e.stopPropagation(),e.preventDefault()}).on("dragenter",(t=this,function(e){return 1===(t._entered+=1)&&t.show(),e.preventDefault(),e.stopPropagation()})).on("dragleave",function(e){return function(t){return(e._entered-=1)<=0&&e.hide(),t.preventDefault(),t.stopPropagation()}}(this)).on("drop",function(e){return function(t){var n,r,o,i,a,d,u;for(r=[],o=0,a=(u=t.originalEvent.dataTransfer.files).length;o<a;o++){if(n=u[o],!e.validFile(n))return alert("「"+n.name+"]」文件不是图片。"),e.hide(),!1;r.push(n)}for(i=0,d=r.length;i<d;i++)n=r[i],e.editor.uploader.upload(n,{inline:!0});return e.hide(),t.stopPropagation(),t.preventDefault()}}(this))},i.prototype.show=function(){return this.imageBtn.setActive(!0)},i.prototype.hide=function(){return this.imageBtn.setActive(!1),this._entered=0},i.prototype.validFile=function(e){return e.type.indexOf("image/")>-1},r.addons.general.dropzone=i});
//# sourceMappingURL=../sourcemaps/addons/Dropzone.js.map
