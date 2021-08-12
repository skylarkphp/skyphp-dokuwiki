/**
 * skylark-devices-keyboard - The keyboard  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-klass","./keyboard"],function(s,e){"use strict";var t=s({_construct:function(){this.pressed=!1,this.justPressed=!1,this.justReleased=!1},update:function(s){this.justPressed=!1,this.justReleased=!1,s===t.DOWN?(!1===this.pressed&&(this.justPressed=!0),this.pressed=!0):s===t.UP?(this.pressed&&(this.justReleased=!0),this.pressed=!1):s===t.RESET&&(this.justReleased=!1,this.justPressed=!1)},set:function(s,e,t){this.justPressed=s,this.pressed=e,this.justReleased=t},reset:function(){this.justPressed=!1,this.pressed=!1,this.justReleased=!1}});return t.DOWN=-1,t.UP=1,t.RESET=0,e.KeyState=t});
//# sourceMappingURL=sourcemaps/KeyState.js.map
