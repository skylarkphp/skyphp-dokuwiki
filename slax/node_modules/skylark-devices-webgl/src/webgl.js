define([
	"skylark-langx-ns"
],function(skylark){

  /**
   * @summary Tries to return a canvas webgl context
   * @returns {WebGLRenderingContext}
   */
  function getWebGLCtx() {
    var canvas = document.createElement('canvas');
    var names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
    var context = null;

    if (!canvas.getContext) {
      return null;
    }

    if (names.some(function(name) {
        try {
          context = canvas.getContext(name);
          return (context && typeof context.getParameter === 'function');
        } catch (e) {
          return false;
        }
      })) {
      return context;
    }
    else {
      return null;
    }
  }

  /**
   * @summary Detects if WebGL is supported
   * @returns {boolean}
   */
  function isWebGLSupported() {
    return !!window.WebGLRenderingContext && getWebGLCtx() !== null;
  };


  /**
   * @summary Gets max texture width in WebGL context
   * @returns {int}
   */
   function getMaxTextureWidth() {
    var ctx = getWebGLCtx();
    if (ctx !== null) {
      return ctx.getParameter(ctx.MAX_TEXTURE_SIZE);  
    }
    else {
      return 0;
    }
  };

  return skylark.attach("devices.webgl",{
  	getWebGLCtx,
  	isWebGLSupported,
  	getMaxTextureWidth
  })
	
});