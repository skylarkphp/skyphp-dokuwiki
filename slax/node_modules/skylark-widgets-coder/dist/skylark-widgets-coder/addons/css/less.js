/**
 * skylark-widgets-coder - The skylark code editor widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-coder/
 * @license MIT
 */
define(["skylark-langx/langx","../../Addon","../../util","../../Coder"],function(e,s,t,n){"use strict";class i extends s{_init(){super._init();var e=this.coder;this.options;void 0!==window.less&&(e.$container.querySelector('a[data-coder-type="css"]').innerHTML="Less",e.on("change",this.change.bind(this),20))}isLess(e){return"css"===e.type&&(-1!==e.file.indexOf(".less")||""===e.file)}change(e){var s=e.data;this.isLess(s)&&window.less.render(s.content,this.options,(e,t)=>{if(e)return callback(e,s);s.content=t.css})}static get categoryName(){return"css"}static get addonName(){return"less"}}return i.register(n),i});
//# sourceMappingURL=../../sourcemaps/addons/css/less.js.map
