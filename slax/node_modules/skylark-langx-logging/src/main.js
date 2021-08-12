define([
	"./logging",
	"./Logger"
],function(logging,Logger){
	let rootLogger = Logger.root;

	logging.debug = function(...args) {
		rootLogger.debug(...args);
	};

	logging.info = function(...args) {
		rootLogger.debug(...args);
	};

	logging.warn = function(...args) {
		rootLogger.debug(...args);
	};

	logging.error = function(...args) {
		rootLogger.debug(...args);
	};


	return logging;
});