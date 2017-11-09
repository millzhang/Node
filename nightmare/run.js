const Nightmare = require('nightmare');
const nm = Nightmare({
    // openDevTools: {
    //     mode: 'detach'
    // },
    show: true
});

import helper from '../helper.js'

let title = '自动化测试';

const run = async() => {
    await helper.runTimes(login, 3, 10000);
    await newActivity();
    await close();
}

/**
 * 登录
 * @return {[type]} [description]
 */
const login = async() => {
    console.log('开始登录...', '>>>>>>>>')
    await nm.goto('http://demo.timepack.cn/web');
    await nm.click('.tab :nth-child(7)');
    await nm.wait('#inputForm');
    await nm.type('#account', 'dik@beumu.com');
    await nm.type('#password', 'timepack206');
    const code = await nm.evaluate(() => {
        return document.querySelector('#v-code').innerText;
    })
    console.log(`code:${code}`)
    await nm.type('#code', code);
    await nm.click('.pw-loginBtn');
    console.log('登录成功...', '>>>>>>>>');
}

/**
 * 新建活动
 * @return {[type]} [description]
 */
const newActivity = async() => {
    console.log('开始创建新的活动...', '>>>>>>>>');
    await nm.wait(3000);
    await nm.click('#activity_id');
    await nm.wait('#activityList');
    await nm.click('.title>.button');
    await nm.wait('#inputForm');
    await nm.type('#title', `${title}标题${new Date().getTime()}`);
    await nm.type('#content', `${title}内容${new Date().getTime()}`);
    await nm.type('#start', `2017-01-01`);
    await nm.type('#end', `2017-12-31`);
    await nm.type('#upperLimit', 188);
    await nm.click('.personal-edit>a:first-child');
    await nm.wait('#activityList');
    console.log('创建活动完成...', '>>>>>>>>');
}

const close = async() => {
    console.log('测试完成...', '>>>>>>');
    await nm.end();
}

run();