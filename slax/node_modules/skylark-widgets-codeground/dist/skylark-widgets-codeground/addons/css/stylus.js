/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","../../addon","../../util","../../codeground"],function(t,s,e,i){"use strict";class n extends s{_init(){super._init();var t=this.coder;this.options;void 0!==window.stylus&&(t.$('a[data-codeg-type="css"]').html("Stylus"),this.listenTo(t,"changed",this.update))}isStylus(t){return"css"===t.type&&(-1!==t.file.indexOf(".styl")||""===t.file)}update(t){var s=t.data;this.isStylus(s)&&window.stylus(s.content,this.options).render((t,e)=>{if(t)return callback(t,s);s.content=e})}static get categoryName(){return"css"}static get addonName(){return"stylus"}}return n.register(i),n});
//# sourceMappingURL=../../sourcemaps/addons/css/stylus.js.map
