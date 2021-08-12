define([
	"./logging"
],function(logging){
    return logging.levels = {
	    all: 'debug|info|warn|error',
	    off: '',
	    debug: 'debug|info|warn|error',
	    info: 'info|warn|error',
	    warn: 'warn|error',
	    error: 'error',
	    DEFAULT: "info"
    };	
});