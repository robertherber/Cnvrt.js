var UglifyJS = require("uglify-js"),
	fs = require('fs');

console.log("Starting minification..");

var minified = UglifyJS.minify(["../src/Cnvrt.js", "../src/config.js"], { mangle: false, compress: false});

console.log("Minification done..");

console.log("Saving..");

fs.writeFile("../bin/Cnvrt.js", minified.code, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 