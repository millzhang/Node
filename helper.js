/**
 * 多次操作控制器
 * @authors Mill (876753183@qq.com)
 * @date    2017-11-08 11:14:17
 * @version 0.0.1
 */

var fs = require("fs");
var path = require('path');
var request = require('request');
const uuidV4 = require('uuid/v4');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';


var Bagpipe = require('bagpipe');
var bagpipe = new Bagpipe(10);


var index = 0;
/**
 * 控制执行函数的次数和超时
 * @param  {Function} fn      [description]
 * @param  {[type]}   times   [description]
 * @param  {[type]}   timeout [description]
 * @return {[type]}           [description]
 */
const runTimes = async(fn, times, timeout) => {
    for (let i = 0; i < times; i++) {
        try {
            return await outTime(fn, timeout);
        } catch (e) {
            logger.warn(e.message);
        }
    }
}

const outTime = (fn, timeout) => {
    return Promise.race([
        fn(),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('操作超时了!!!'));
            }, timeout);
        })
    ])
}

let total = 0;
const download = (target, list) => {
    total = list.length;
    if (!fs.existsSync(target)) {
        logger.info('创建新的目录!');
        fs.mkdirSync(target);
    }
    list.forEach((item, index) => {
        var destImage = path.resolve(target, uuidV4() + '.jpg');
        bagpipe.push(saveImageFlie, item, destImage, function(err, data) {});
    });
}

const saveImageFlie = (src, dest, callback) => {
    request.head(src, function(err, res, body) {
        if (src) {
            request(src).pipe(fs.createWriteStream(dest)).on('close', function() {
                index++
                if (index == (total - 1)) {
                    logger.info(total + `张图片下载完成`);
                }
                callback(null, dest);
            });
        }

    });
};


const writeFile = (readmePath, fileContent) => {
    fs.writeFile(readmePath, fileContent, function(err) {
        if (!err) {
            console.log("文件创建成功");
        } else {
            console.log("文件创建失败！");
        }
    });
}

export default { runTimes, download, writeFile };