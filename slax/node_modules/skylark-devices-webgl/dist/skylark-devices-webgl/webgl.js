/**
 * skylark-devices-webgl - The webgl  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(e){function t(){var e=document.createElement("canvas"),t=null;return e.getContext&&["webgl","experimental-webgl","moz-webgl","webkit-3d"].some(function(n){try{return(t=e.getContext(n))&&"function"==typeof t.getParameter}catch(e){return!1}})?t:null}return e.attach("devices.webgl",{getWebGLCtx:t,isWebGLSupported:function(){return!!window.WebGLRenderingContext&&null!==t()},getMaxTextureWidth:function(){var e=t();return null!==e?e.getParameter(e.MAX_TEXTURE_SIZE):0}})});
//# sourceMappingURL=sourcemaps/webgl.js.map
