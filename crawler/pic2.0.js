/**
 * 更清析的图片获取
 * @authors Mill (876753183@qq.com)
 * @date    2017-11-09 16:12:32
 * @version 0.0.1
 */

const Nightmare = require('nightmare')
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

import helper from '../helper.js'
import config from './config.js'

let list = [];

const nm = Nightmare({
    show: true
});

const run = async() => {
    await nm.goto(config.website);
    await nm.type('#kw', config.keywords);
    await nm.click('.s_btn');
    await nm.wait('#imgContainer');
    let link = await nm.evaluate(() => {
        let link = document.querySelector('.imgbox>a').href;
        return link;
    });
    await nm.goto(link);
    await gainImage(config.page.size, config.page.timeout);
    logger.debug(`一共获取到${list.length}张图片`)
    await helper.download(`${config.diskPath}/${config.keywords}`, list);
    await close();
}

const gainImage = async(times, timeout) => {
    while (times > 0) {
        await nm.wait(1000)
        await nm.wait('#srcPic');
        let imageUrl = await nm.evaluate(() => {
            return document.querySelector('#srcPic>img').src
        });
        list.push(imageUrl);
        times--;
        logger.debug(times);
        await nm.click('.img-next');
    }
}


const outTime = (fn, timeout = 500) => {
    return Promise.all([
        fn(),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        })
    ])
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