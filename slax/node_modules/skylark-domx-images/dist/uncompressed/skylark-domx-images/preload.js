define([
    "skylark-langx/langx",
	"./images",
	"./watch"
],function(langx,images,watch){
  function preload(urls,options) {
      if (langx.isString(urls)) {
        urls = [urls];
      }
      var images = [];

      urls.forEach(function(url){
        var img = new Image();
        img.src = url;
        images.push(img);
      });

      return watch(images);
  }

  return images.preload = preload;
});