//a minimal node.js server

var express = require('express');
var app = express();

var config = {
	allowedDomains: "http://finance.yahoo.com"
};

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
}

app.use(allowCrossDomain)
app.use(express.static(__dirname + '/../..'));

app.listen(3000);