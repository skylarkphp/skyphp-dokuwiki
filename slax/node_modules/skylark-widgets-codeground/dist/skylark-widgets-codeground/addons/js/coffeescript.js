/**
 * skylark-widgets-codeground - The skylark code playground widget for showcasing html/css/js.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-codeground/
 * @license MIT
 */
define(["skylark-langx/langx","../../addon","../../util","../../codeground"],function(e,t,i,n){"use strict";class r extends t{_init(){super._init();var e=this.coder;this.options;void 0!==window.CoffeeScript&&(e.$('a[data-codeg-type="js"]').html("CoffeeScript"),this.listenTo(e,"changed",this.update))}isCoffee(e){return"js"===e.type&&(-1!==e.file.indexOf(".coffee")||""===e.file)}update(e){var t=e.data;if(this.isCoffee(t))try{t.content=window.CoffeeScript.compile(t.content)}catch(e){return callback(e,t)}}static get categoryName(){return"js"}static get addonName(){return"coffeescript"}}return r.register(n),r});
//# sourceMappingURL=../../sourcemaps/addons/js/coffeescript.js.map
