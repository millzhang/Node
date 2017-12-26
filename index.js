require("babel-register");
require("babel-polyfill");

// require('./crawler/cheerio.js')
// var express = require('express');
// var app = express();

// const PORT = 9527;
// var server = app.listen(PORT, function() {
//     var host = server.address().address;
//     var port = server.address().port;

//     console.log('Example app listening at http://localhost:' + PORT);
// });

// app.use(express.static('./plublic/'));


require('./api/server.js');