const logger = require('./logger.js').logger('数据库操作');

const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

connection.connect();
logger.info('连接成功')

//查询操作
exports.query = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function(err, result) {
            if (err) {
                logger.error('[SELECT ERROR] - ', err.message);
                reject(err.message)
                return;
            }
            resolve(result);
        });
    })
}

exports.insert = (sql, data) => {
    return new Promise((resolve, reject) => {
        logger.debug('执行插入操作')
        connection.query(sql, data, function(err, result) {
            if (err) {
                logger.error('[INSERT ERROR] - ', err.message);
                reject(err.message)
                return;
            }
            logger.debug('数据插入成功')
            resolve(result);
        });
    })
}