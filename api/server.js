var express = require('express');
var app = express();
//从post请求中解析参数
var parser = require('body-parser');
//mongodb
var mongoose = require('mongoose');
//morgan: 日志处理
var morgan = require('morgan');
//生成和确认token数据
var jwt = require('jsonwebtoken');


//配置文件
const config = require('./config');
var userRoute = require('./routes/userRoute')
const logger = require('../logger.js').logger('API-Server');

//定义端口号
var port = process.env.PORT || 4546;

//连接数据库
var db = mongoose.connect(config.database);
db.connection.on("error", function (error) {
    logger.debug("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    logger.debug("------数据库连接成功！------");
});


//用body parser 来解析post和url信息中的参数
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use('/user',userRoute);



app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);