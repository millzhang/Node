var express = require("express");
var User = require("../model/user");

var router = express.Router();

router.post('/add', function (req, res) {
    var admin = new User({
        name: "张2四",
        age: 19,
        telephone: "1589543226833",
        avatar: "http://www.cnplugins.com/uploads/nologo.jpg",
    });

    //保存用户
    admin.save(function (err) {
        if (err) {
            console.log(err)
            res.json({
                success: false,
                message: '用户创建失败'
            });
            return;
        }
        res.json({ success: true, message: "用户创建成功" })
    })
});

router.get('/list', function (req, res) {
    User.find({}, function (err, userList) {
        res.json({
            success: true,
            data: userList
        })
    })
});

module.exports = router; //导出路由