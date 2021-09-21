/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(t){"use strict";return t.createValidAbsoluteUrl=function(t,e){if(!t)return null;try{const r=e?new URL(t,e):new URL(t);if(function(t){if(!t)return!1;switch(t.protocol){case"http:":case"https:":case"ftp:":case"mailto:":case"tel:":return!0;default:return!1}}(r))return r}catch(t){}return null}});
//# sourceMappingURL=sourcemaps/create_valid_absolute_url.js.map
