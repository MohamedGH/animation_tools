requirejs.config({
    baseUrl: 'js',
    paths: 
    {
        app: './',
	UTILS: "./utils",
    }
});

requirejs(['./main']);
