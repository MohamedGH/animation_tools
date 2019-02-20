// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js',
    paths: 
    {
        app: './',
		LIB: "./lib",
		widget_manager: "widgets/manager/widget_manager",
		widget: "widgets/widget",
		WIDGETS: "./widgets",


		COMPOSANTS : "./composants",
		CONTEXTED : "widgets/contexted",
		MODULES: "widgets/modules",
		MANAGERS: "./widgets/manager/contexted",
		ACTORS: "./actors",
		REACT: "./react",
		ASYNC: "./async",
		NAVIGATION : "./navigation",
		SESSION: "./session",
		POLYFILLS : "./polyfills",
		TOOLS:"tools",
		MODEL:"./model",
		DB: "./persistence",
		UTILS: "./utils",
		HELPERS:"./helpers",
		INPUT: "./input",
		jquery: "./lib/jquery/jquery",
		handlebars : "handlebars-v4.0.5",
		zingChart: "./lib/zingchart_trial/zingcharttest",
		fastdom: "../node_modules/fastdom/fastdom",
		d3: "./lib/d3/d3v3",
		d3v4: "./lib/d3/d3",
		xlsx: "./lib/js-xlsx-master/dist/xlsx",
		jszip: "./lib/js-xlsx-master/dist/jszip",

    }
});

// Start loading the main app file. Put all of
// your application logic in there.
	requirejs(['./main']);
	//requirejs(['app_replayer/pre-load']);
