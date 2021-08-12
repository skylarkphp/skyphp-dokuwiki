define([
    "skylark-domx-transforms",
    "./images"
], function(transforms,images) {


  function transform(el,options) {
  }

  ["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout","reset"].forEach(
    function(name){
      transform[name] = transforms[name];
    }
  );



  return images.transform = transform;
});
