/**
 * 百度图片获取
 * @authors Mill (876753183@qq.com)
 * @date    2017-11-08 13:42:57
 * @version 0.0.1
 */

const Nightmare = require('nightmare')
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

import helper from '../helper.js'
import config from './config.js'

const nm = Nightmare({
    show: true
});

const run = async() => {
    await nm.goto(config.website);
    await nm.type('#kw', config.keywords);
    await nm.click('.s_btn');
    await nm.wait('#imgContainer');
    await autoSroll();
    await logger.debug(`屏幕滚动完了!`);
    await nm.wait(1200);
    await logger.debug(`开始获取图片!`);
    let list = await getImageList();
    logger.debug(`一共获取到${list.length}张图片`)
    helper.download(`${config.diskPath}/${config.keywords}`, list);
    await close();
}

/**
 * 自动滚动
 */
const autoSroll = async() => {
    logger.debug(`开始滚动屏幕`);
    for (let i = 0; i < config.scroll.times; i++) {
        let newPos = config.scroll.start + config.scroll.step * i;
        await outTime(newPos, config.scroll.interval);
    }
}

/**
 * 滚动间隔时间控制
 * @param  {[type]} pos     [description]
 * @param  {Number} timeout [description]
 * @return {[type]}         [description]
 */
const outTime = (pos, timeout = 500) => {
    return Promise.all([
        nm.scrollTo(pos, 0),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        })
    ])
}

/**
 * 获取图片列表
 * @return {[type]} [description]
 */
const getImageList = async() => {
    return await nm.evaluate(() => {
        let elements = document.querySelectorAll('.main_img');
        let result = [];
        for (var i = 0; i < elements.length; ++i) {
            var item = elements[i];
            result.push(item.getAttribute('data-imgurl'));
        }
        return result;
    });
}

/**
 * 关闭
 * @return {[type]} [description]
 */
const close = async() => {
    logger.debug('运行结束,关闭窗口!')
    await nm.end();
}

run();