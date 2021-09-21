/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(e){"use strict";return e.getFileExtension=function(e){if("string"==typeof e){const t=/^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/.exec(e);if(t)return t.pop().toLowerCase()}return""}});
//# sourceMappingURL=sourcemaps/get-file-extension.js.map
