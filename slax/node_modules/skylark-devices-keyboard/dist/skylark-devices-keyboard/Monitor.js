/**
 * skylark-devices-keyboard - The keyboard  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-klass","./keyboard","./KeyState"],function(t,e,s){"use strict";var i=t({_construct:function(t){this.keyStates=[],this.actions=[];var e=this,s=this.actions;this.handlers={keydown:function(t){s.push(t.keyCode),s.push(Key.DOWN)},keyup:function(t){s.push(t.keyCode),s.push(Key.UP)},focus:function(t){e.reset()}},!0!==t&&this.create()},update:function(){for(var t=0;this.actions.length>t;){var e=this.actions.shift(),s=this.actions.shift();void 0===this.keyStates[e]&&(this.keyStates[e]=new Key),this.keyStates[e].update(s),(this.keyStates[e].justReleased||this.keyStates[e].justPressed)&&(this.actions.push(e),this.actions.push(Key.RESET),t+=2)}},reset:function(){for(var t=0;t<this.keyStates.length;t++)void 0!==this.keyStates[t]&&this.keyStates[t].reset()},keyPressed:function(t){return void 0!==this.keyStates[t]&&this.keyStates[t].pressed},keyJustPressed:function(t){return void 0!==this.keyStates[t]&&this.keyStates[t].justPressed},keyJustReleased:function(t){return void 0!==this.keyStates[t]&&this.keyStates[t].justReleased},create:function(){for(var t in this.handlers)window.addEventListener(t,this.handlers[t])},dispose:function(){for(var t in this.handlers)window.removeEventListener(t,this.handlers[t])}});return e.Monitor=i});
//# sourceMappingURL=sourcemaps/Monitor.js.map
