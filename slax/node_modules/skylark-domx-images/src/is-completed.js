define([
	"./images"
],function(images){
  function isCompleted(img) {
     return img.complete && img.naturalWidth !== undefined;
  }

  return images.isCompleted = isCompleted;
});