define([
	"skylark-langx-ns"
],function(skylark){
	"use strict";
	let caches = skylark.attach("io.caches");
	caches.storages =  caches.storages || {};
	return caches;
})