define([
	"skylark-domx-query",
	"skylark-domx-velm",
	"./images",
	"./is-completed",
	"./is-loaded",
	"./loaded",
	"./preload",
	"./transform",
	"./viewer",
	"./watch"
],function($,elmx,images,isCompleted,isLoaded,loaded,preload,transform,viewer,watch){

  elmx.delegate([
  	"imageIsCompleted",
  	"imageIsLoaded",
  	"imageLoaded",
  	"imageViewer"
  ],images,{
  	"imageIsCompleted" : "isCompleted",
  	"imageIsLoaded" : "isLoaded",
  	"imageLoaded" : "loaded",
  	"imageViewer" : "viewer"  	
  });

	return images;
});