var log4js = require('log4js');

log4js.configure({
    appenders: {
        out: { type: 'console' }, // 控制台输出
        app: {
            type: 'dateFile', // 文件输出
            filename: 'logs/', // 需要手动创建此文件夹
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            maxLogSize: 1024,
            backups: 4, // 日志备份数量，大于该数则自动删除
            category: 'logInfo' // 记录器名  
        }
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'debug' }
    },
    replaceConsole: true // 替换 console.log
});

const levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

exports.logger = function(name, level) {
    var logger = log4js.getLogger(name);
    logger.level = levels[level] || levels['debug']
    return logger;
};

// 配合 express 使用的方法
exports.use = function(app, level) {
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: levels[level] || levels['debug'],
        format: ':method :url :status'
    }));
};