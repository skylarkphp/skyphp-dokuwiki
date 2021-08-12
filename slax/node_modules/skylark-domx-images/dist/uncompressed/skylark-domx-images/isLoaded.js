define([
	"./images"
],function(images){

  function isLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  }
  return images.isLoaded = isLoaded;
});