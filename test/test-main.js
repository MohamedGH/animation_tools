var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

var tests = [];
for (var file in window.__karma__.files) {

  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/test\.js$/.test(file)) {
      var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
      tests.push(file);
    }
  }
}


require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/js',

    paths: 
    {
      ASYNC: "async",
      UTILS: "utils",
    },
  // dynamically load all test files
  deps: tests,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})



