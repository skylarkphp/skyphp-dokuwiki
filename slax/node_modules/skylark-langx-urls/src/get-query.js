define([
    './urls'
], function (urls) {
    'use strict';
	function getQuery(querystring) {
		var query = {};

		var pairs = querystring.split('&'),
		    length = pairs.length,
		    keyval = [],
		    i = 0;

		for (; i < length; i++) {
		  keyval = pairs[i].split('=', 2);
		  try {
		    keyval[0] = decodeURIComponent(keyval[0]); // key
		    keyval[1] = decodeURIComponent(keyval[1]); // value
		  } catch (e) {}

		  if (query[keyval[0]] === undefined) {
		    query[keyval[0]] = keyval[1];
		  } else {
		    query[keyval[0]] += ',' + keyval[1];
		  }
		}

		return query;
	}

	return urls.getQuery = getQuery;

});