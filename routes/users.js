var express = require('express');
var router = express.Router();
var RSA = require('../utils/rsa')

var User = require('../model/userdao')
const bcrypt = require('bcrypt')
const JWT = require('../utils/jwt')
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getPublicKey', function (req, res, next) {
    //console.log(RSA.getPublicKey());
    res.json({ publicKey: RSA.getPublicKey() });
})

router.post('/register', function (req, res, next) {
    const username = RSA.decrypt(req.body.username);
    console.log(username)
    const password = RSA.decrypt(req.body.password);
    console.log(password)
    User.findAll({
        attributes: ['password'],
        where: {
            username: username
        }
    }).then((list) => {
        if (list.length === 0) {
            //这里使用了硬编码，以后要改
            bcrypt.hash(password, 10, (err, encrypted) => {
                User.create({
                    username: username,
                    password: encrypted
                });
                res.json({
                    success: 1
                })
            })
        }
        else {
            res.json({
                success: 0,
                msg: '该用户已被注册'
            })
        }
    })
})

router.post('/login', function (req, res, next) {
    const username = RSA.decrypt(req.body.username);
    const password = RSA.decrypt(req.body.password);
    User.findAll({
        where: {
            username: username
        }
    }).then((list) => {
        if (list.length === 0) {
            res.json({
                status: "fail",
                msg: "no such user"
            })
        }
        else {
            bcrypt.compare(password, list[0].password).then((same) => {
                if (!same) {
                    res.json({
                        status: "fail",
                        msg: "please input the correct password"
                    })
                }
                else {
                    const token = JWT.generateToken(username, "mysecretkey");
                    res.json({
                        status: "success",
                        token: token,
                        power: list[0].power,
                        username: list[0].username
                    })
                }
            })
        }
    })
})

module.exports = router;
