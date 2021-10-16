var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');

/* GET home page. */
router.get('/article', function (req, res, next) {
    const filename = req.query.img
    console.log(filename)
    const curPath = path.join(path.dirname(__dirname), 'imgs', 'article', filename)
    console.log(curPath)
    fs.readFile(curPath, function (err, data) {
        if (err) {
            res.send('读取错误')
        }
        else {
            res.send(data)
        }
    })
});

module.exports = router;