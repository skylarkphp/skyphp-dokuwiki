/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","../../addon","../../util","../../codeground"],function(t,e,a,i){"use strict";class n extends e{_init(){super._init();var t=this.coder;this.options;if(void 0!==window.Babel)this.babel=window.Babel;else{if(void 0===window.babel)return;this.babel={transform:window.babel}}t.$('a[data-codeg-type="js"]').html("ES2015"),this.listenTo(t,"changed",this.update)}update(t){var e=t.data;if("js"===e.type)try{e.content=this.babel.transform(e.content,this.options).code}catch(t){return callback(t,e)}}static get categoryName(){return"js"}static get addonName(){return"babel"}}return n.register(i),n});
//# sourceMappingURL=../../sourcemaps/addons/js/babel.js.map
