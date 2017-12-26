/**
 * 使用cheerio+axios结合进行爬虫
 * @authors Mill (876753183@qq.com)
 * @date    2017-11-10 09:21:05
 * @version 0.0.1
 */

const cheerio = require('cheerio');
const axios = require('axios');

const logger = require('../logger.js').logger('axios爬虫');
const db = require('../db.js')

import config from './config.js'
import helper from '../helper.js'

let pageNum = config.page.num,
    pageSize = config.page.size;
let imageList = new Set(),
    hostList = new Set();
const run = async() => {
    //发送一个请求
    startCrawler()
}



const startCrawler = async() => {
    for (let i = 0; i < config.page.times; i++) {
        logger.debug(`开始第${i+1}次请求`)
        if (await getImageByPage(pageNum)) {
            pageNum += pageSize;
        } else {
            logger.debug('没有了,终止循环');
            break;
        }
    }
    logger.debug('开始记录文件*********');
    logger.debug(`一共获取到${imageList.size}张图片`);
    helper.writeFile('G:/logger/images.txt', [...imageList].join('\n'));
    helper.writeFile('G:/logger/host.txt', [...hostList].join('\n'));
}


const getImageByPage = async(page) => {
    return axios.get('https://image.baidu.com/search/acjson', {
        params: {
            tn: 'resultjson_com',
            ipn: 'rj',
            queryWord: config.keywords,
            word: config.keywords,
            pn: page,
            rn: pageSize
        }
    }).then(response => {
        logger.info(`请求成功,开始解析数据,当前是第${page}页......`);
        let resData = response.data,
            lazyData = resData.data;
        logger.debug(`请求成功,数据长度为${undefined == lazyData ? 0 : lazyData.length}`);
        if (undefined == lazyData) true;
        let result = [];
        lazyData.forEach(item => {
            if (undefined != item.thumbURL) {
                imageList.add(item.thumbURL);
                hostList.add(item.fromURLHost);
                result.push(item.thumbURL);
                db.insert(`insert into baidu_image(host,url) values("${item.fromURLHost}","${item.thumbURL}")`);
            }
        });

        // logger.info(`数据解析完成,分页下载图片,共${result.length}张>>>>>>>>`);
        // helper.download(`${config.diskPath}/${config.keywords}`, result);
        return true;
    }).catch(e => {
        logger.error(e.message);
        return false;
    });
}


run();
// export default { run }