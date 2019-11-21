/* globals window, document */
( function() {

// Find the script element
var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];

// Read the modules
var modules = script.getAttribute( "data-modules" );
var composite = script.getAttribute( "data-composite" ) || false;
var pathParts = window.location.pathname.split( "/" );
var widgets = [
	"Draggable",
	"Droppable",
	"Mouse",
	"Resizable",
	"Selectable",
	"Sortable"
];

function getPath( module ) {
	for ( var i = 0; i < widgets.length; i++ ) {
		if ( widgets[ i ] === module ) {
			return "skylark-jqueryui-interact/" + module;
		}
	}
	return module;
}
function fixPaths( modules ) {
	for ( var i = 0; i < modules.length; i++ ) {
		modules[ i ] = getPath( modules[ i ] );
	}
	return modules;
}

// Hide the page while things are loading to prevent a FOUC
document.documentElement.className = "demo-loading";

require.config( {
	baseUrl: window.location.pathname.indexOf( "demos/" ) !== -1 ? ".." : "../..",
	packages : [
      { name: "skylark-langx", location: "../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
      { name: "skylark-utils", location: "../node_modules/skylark-utils/dist/uncompressed/skylark-utils" },
      { name: "skylark-utils-dom", location: "../node_modules/skylark-utils-dom/dist/uncompressed/skylark-utils-dom" },
      { name: "skylark-jqueryui-interact", location: "../src" }

	],
	paths: {
		"external": "../external/"
	},
	shim: {
		"external/globalize/globalize.culture.de-DE": [ "external/globalize/globalize" ],
		"external/globalize/globalize.culture.ja-JP": [ "external/globalize/globalize" ]
	},
    "map": {
        "*": {
            "jquery": "skylark-jquery"
        }
    }	
} );


modules = modules ? modules.replace( /^\s+|\s+$/g, "" ).split( /\s+/ ) : [];
if ( !composite ) {
	modules.push( pathParts[ pathParts.length - 2 ] );
}
modules = fixPaths( modules );

require( modules, function() {
	var newScript = document.createElement( "script" );

	document.documentElement.className = "";

	newScript.text = "( function() { " + script.innerHTML + " } )();";
	document.body.appendChild( newScript ).parentNode.removeChild( newScript );
} );

} )();
