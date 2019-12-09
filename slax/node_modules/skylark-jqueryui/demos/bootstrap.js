/* globals window, document */
( function() {

// Find the script element
var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];

// Read the modules
var modules = script.getAttribute( "data-modules" );
var composite = script.getAttribute( "data-composite" ) || false;
var pathParts = window.location.pathname.split( "/" );
var effectsAll = [
	"effects/effect-blind",
	"effects/effect-bounce",
	"effects/effect-clip",
	"effects/effect-drop",
	"effects/effect-explode",
	"effects/effect-fade",
	"effects/effect-fold",
	"effects/effect-highlight",
	"effects/effect-puff",
	"effects/effect-pulsate",
	"effects/effect-scale",
	"effects/effect-shake",
	"effects/effect-size",
	"effects/effect-slide",
	"effects/effect-transfer"
];
var widgets = [
	"accordion",
	"autocomplete",
	"button",
	"checkboxradio",
	"controlgroup",
	"datepicker",
	"dialog",
	"draggable",
	"droppable",
	"menu",
	"mouse",
	"progressbar",
	"resizable",
	"selectable",
	"selectmenu",
	"slider",
	"sortable",
	"spinner",
	"tabs",
	"tooltip"
];

function getPath( module ) {
	for ( var i = 0; i < widgets.length; i++ ) {
		if ( widgets[ i ] === module ) {
			return "skylark-jqueryui/widgets/" + module;
		}
	}
	for ( var j = 0; j < effectsAll.length; j++ ) {
		if ( module !== "effect" ) {
			if ( effectsAll[ j ] === module ) {
				return "skylark-jqueryui/"+module;
			}
			if ( effectsAll[ j ].indexOf( module ) !== -1 ) {
				return "skylark-jqueryui/effects/" + module;
			}
		}
	}
	if (module.indexOf("external") == -1) {
		return "skylark-jqueryui/"+module;
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
	    {name : "skylark-langx-arrays", location : "../node_modules/skylark-langx-arrays/dist/uncompressed/skylark-langx-arrays"},
	    {name : "skylark-langx-aspect",location : "../node_modules/skylark-langx-aspect/dist/uncompressed/skylark-langx-aspect"},
	    {name : "skylark-langx-async",location : "../node_modules/skylark-langx-async/dist/uncompressed/skylark-langx-async"},
	    {name : "skylark-langx-datetimes",location : "../node_modules/skylark-langx-datetimes/dist/uncompressed/skylark-langx-datetimes"},
	    {name : "skylark-langx-emitter",location : "../node_modules/skylark-langx-emitter/dist/uncompressed/skylark-langx-emitter"},
	    {name : "skylark-langx-funcs",location : "../node_modules/skylark-langx-funcs/dist/uncompressed/skylark-langx-funcs"},
	    {name : "skylark-langx-hoster",location : "../node_modules/skylark-langx-hoster/dist/uncompressed/skylark-langx-hoster"},
	    {name : "skylark-langx-klass",location : "../node_modules/skylark-langx-klass/dist/uncompressed/skylark-langx-klass"},
	    {name : "skylark-langx-ns",location : "../node_modules/skylark-langx-ns/dist/uncompressed/skylark-langx-ns"},
	    {name : "skylark-langx-numbers",location : "../node_modules/skylark-langx-numbers/dist/uncompressed/skylark-langx-numbers"},
	    {name : "skylark-langx-objects",location : "../node_modules/skylark-langx-objects/dist/uncompressed/skylark-langx-objects"},
	    {name : "skylark-langx-strings",location : "../node_modules/skylark-langx-strings/dist/uncompressed/skylark-langx-strings"},
	    {name : "skylark-langx-topic",location : "../node_modules/skylark-langx-topic/dist/uncompressed/skylark-langx-topic"},
	    {name : "skylark-langx-types",location : "../node_modules/skylark-langx-types/dist/uncompressed/skylark-langx-types"},
	    {name : "skylark-net-http",location : "../node_modules/skylark-net-http/dist/uncompressed/skylark-net-http"},
	    {name : "skylark-domx-browser",location : "../node_modules/skylark-domx-browser/dist/uncompressed/skylark-domx-browser"},
	    {name : "skylark-domx-css",location : "../node_modules/skylark-domx-css/dist/uncompressed/skylark-domx-css"},
	    {name : "skylark-domx-browser",location : "../node_modules/skylark-domx-browser/dist/uncompressed/skylark-domx-browser"},
	    {name : "skylark-domx-data",location : "../node_modules/skylark-domx-data/dist/uncompressed/skylark-domx-data"},
	    {name : "skylark-domx-eventer",location : "../node_modules/skylark-domx-eventer/dist/uncompressed/skylark-domx-eventer"},
	    {name : "skylark-domx-finder",location : "../node_modules/skylark-domx-finder/dist/uncompressed/skylark-domx-finder"},
	    {name : "skylark-domx-fx",location : "../node_modules/skylark-domx-fx/dist/uncompressed/skylark-domx-fx"},
	    {name : "skylark-domx-geom",location : "../node_modules/skylark-domx-geom/dist/uncompressed/skylark-domx-geom"},
	    {name : "skylark-domx-images",location : "../node_modules/skylark-domx-images/dist/uncompressed/skylark-domx-images"},
	    {name : "skylark-domx-noder",location : "../node_modules/skylark-domx-noder/dist/uncompressed/skylark-domx-noder"},
	    {name : "skylark-domx-plugins",location : "../node_modules/skylark-domx-plugins/dist/uncompressed/skylark-domx-plugins"},
	    {name : "skylark-domx-query",location : "../node_modules/skylark-domx-query/dist/uncompressed/skylark-domx-query"},
	    {name : "skylark-domx-scripter",location : "../node_modules/skylark-domx-scripter/dist/uncompressed/skylark-domx-scripter"},
	    {name : "skylark-domx-files",location : "../node_modules/skylark-domx-files/dist/uncompressed/skylark-domx-files"},
	    {name : "skylark-domx-styler",location : "../node_modules/skylark-domx-styler/dist/uncompressed/skylark-domx-styler"},
	    {name : "skylark-domx-tables",location : "../node_modules/skylark-domx-tables/dist/uncompressed/skylark-domx-tables"},
	    {name : "skylark-domx-transforms",location : "../node_modules/skylark-domx-transforms/dist/uncompressed/skylark-domx-transforms"},
	    {name : "skylark-domx-velm",location : "../node_modules/skylark-domx-velm/dist/uncompressed/skylark-domx-velm"},
	    {name : "skylark-data-collection" ,location : "../node_modules/skylark-data-collection/dist/uncompressed/skylark-data-collection"},
	    {name : "skylark-storages-diskfs" ,location : "../node_modules/skylark-storages-diskfs/dist/uncompressed/skylark-storages-diskfs"},
	    { name: "skylark-langx", location: "../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
      { name: "skylark-jquery", location: "../node_modules/skylark-jquery/dist/uncompressed/skylark-jquery" },
      { name: "skylark-jqueryui-interact", location: "../node_modules/skylark-jqueryui-interact/dist/uncompressed/skylark-jqueryui-interact" },
      { name: "skylark-jqueryui", location: "../src" }

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

// Replace effects all shortcut modules with all the effects modules
if ( modules && modules.indexOf( "effects-all" ) !== -1 ) {
	modules = modules.replace( /effects-all/, effectsAll.join( " " ) );
}

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
