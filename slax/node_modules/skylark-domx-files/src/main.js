define([
	"./files",
	"skylark-domx-velm",
	"skylark-domx-query",
	"./dropzone",
	"./pastezone",
	"./picker"
],function(files,velm,$){
	velm.delegate([
		"dropzone",
		"pastezone",
		"picker"
	],files);

    $.fn.pastezone = $.wraps.wrapper_every_act(files.pastezone, files);
    $.fn.dropzone = $.wraps.wrapper_every_act(files.dropzone, files);
    $.fn.picker = $.wraps.wrapper_every_act(files.picker, files);

	return files;
});