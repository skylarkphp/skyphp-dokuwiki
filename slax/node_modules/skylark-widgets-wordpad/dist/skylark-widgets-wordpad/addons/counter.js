/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
!function(t){t.Redactor.prototype.counter=function(){return{init:function(){void 0!==this.opts.callbacks.counter&&this.core.editor().on("keyup.redactor-plugin-counter",t.proxy(this.counter.count,this))},count:function(){var e=0,c=0,r=0,o=this.code.get().replace(/<\/(.*?)>/gi," ");if(o=(o=(o=(o=(o=o.replace(/<(.*?)>/gi,"")).replace(/\t/gi,"")).replace(/\n/gi," ")).replace(/\r/gi," ")).replace(/\u200B/g,""),""!==(o=t.trim(o))){var i=o.split(/\s+/),n=o.match(/\s/g);e=i?i.length:0,r=n?n.length:0,c=o.length}this.core.callback("counter",{words:e,characters:c,spaces:r})}}}}(jQuery);
//# sourceMappingURL=../sourcemaps/addons/counter.js.map
