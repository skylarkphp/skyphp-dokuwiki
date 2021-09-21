define([
],function(){	
	"use strict";

	function SkinManager(){}

	var list = [],
		skins = [];

	//Add skin to list
	function register(skin, name) {
		list.push(name);
		skins[name] = skin;
	}

	//Get a skin instance
	function get(name) {
		if (!name) {
			name = list[0];
		}

		return skins[name];
	};

	function getList() {
		return list.slice();
	}

	return {
		register,
		get,
		getList
	};
});