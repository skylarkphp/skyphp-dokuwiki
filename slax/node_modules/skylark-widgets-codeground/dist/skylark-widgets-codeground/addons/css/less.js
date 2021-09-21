/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","../../addon","../../util","../../codeground"],function(s,e,t,i){"use strict";class n extends e{_init(){super._init();var s=this.coder;this.options;void 0!==window.less&&(s.$('a[data-codeg-type="css"]').html("Less"),this.listenTo(s,"changed",this.update))}isLess(s){return"css"===s.type&&(-1!==s.file.indexOf(".less")||""===s.file)}update(s){var e=s.data;this.isLess(e)&&window.less.render(e.content,this.options,(s,t)=>{if(s)return callback(s,e);e.content=t.css})}static get categoryName(){return"css"}static get addonName(){return"less"}}return n.register(i),n});
//# sourceMappingURL=../../sourcemaps/addons/css/less.js.map
