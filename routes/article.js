var express = require('express');
var router = express.Router();
var RSA = require('../utils/rsa')

var User = require('../model/userdao')
const bcrypt = require('bcrypt')
const JWT = require('../utils/jwt')
/* GET users listing. */


const Article = require('../model/articledao')
const ArticleLabel = require('../model/articlelabeldao')
const Label = require('../model/labeldao')
const auth = require('../middleware/auth');

const multer = require('multer')
const path = require('path');
const fs = require('fs');
const sequelize = require("../db/dbconnection")

const sd = require('silly-datetime');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'imgs', 'article'))
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname)
        const filename = sd.format(new Date(), 'YYYYMMDDHHmmss') + '-' + req.body.username + extname
        cb(null, filename)
    }
})

const uploader = multer({
    storage: storage
})

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.use(auth.verify)

router.get('/getPublicKey', function (req, res, next) {
    //console.log(RSA.getPublicKey());
    res.json({ publicKey: RSA.getPublicKey() });
})

router.post('/getArticles', function (req, res, next) {
    const pageNum = req.body.page
    const pageLen = req.body.pageLen
    Article.findAll({
        attributes: ['articleId', 'title', 'author'],
        order: [['createdAt', 'DESC']],
        offset: pageLen * (pageNum - 1),
        limit: pageLen
    }).then((lst) => {
        res.json({
            curList: lst
        })
    })
})

router.post('/getPageCount', function (req, res, next) {
    const pageLen = req.body.pageLen
    Article.count().then((num) => {
        res.json({
            pageCount: num
        })
    })
})

function getLabelById(labelId, lst) {
    return Label.findByPk(labelId).then((rst) => {
        new Promise(() => {
            lst.push(rst)
        })
    })
}

router.post('/getArticleById', function (req, res, next) {
    const id = req.body.articleId;
    Article.findAll({
        where: {
            articleId: id
        }
    }).then((article) => {
        ArticleLabel.findAll({
            where: {
                articleId: id
            }
        }).then((rst) => {
            let ans = []
            if (rst.length > 0) {
                //let cur = getLabelById(rst[0].labelId, ans)
                const sqlLst = []
                for (let i = 0; i < rst.length; i++) {
                    const curId = rst[i].labelId
                    console.log(curId)
                    sqlLst.push(Label.findByPk(curId).then((rst) => {
                        return new Promise((resolve, reject) => {
                            console.log(i)
                            ans.push(rst)
                            resolve()
                        }
                        )
                    })
                    )
                }
                Promise.all(sqlLst).then(() => {
                    console.log(ans)
                    res.json({
                        article: article[0],
                        labels: ans
                    })
                })
                // for (let i = 1; i < rst.length; i++) {
                //     cur = cur.then(() => getLabelById(rst[i].labelId, ans))
                // }
                // cur.then((response) => {
                //     res.json({
                //         article: article[0],
                //         labels: ans
                //     })
                // })
            }
            else {
                res.json({
                    article: article[0],
                    labels: ans
                })
            }
        })
    })
})

router.post('/edit', function (req, res, nexxt) {
    const author = req.body.author
    if (author != req.body.username) {
        res.json({
            status: 'fail',
            msg: '别瞎鸡巴搞奥'
        })
        return
    }
    const articleId = req.body.articleId
    const title = req.body.title
    const text = req.body.text
    console.log(articleId)
    console.log(title)
    console.log(text)
    Article.update({
        title: title,
        articleText: text
    }, {
        where: {
            articleId: articleId
        }
    }).then((rst) => {
        console.log(rst)
        res.json({
            status: 'success'
        })
    })
})

router.post('/submit', function (req, res, next) {
    const username = req.body.username
    const title = req.body.title
    const text = req.body.text
    const labels = req.body.labels
    Article.create({
        title: title,
        articleText: text,
        author: username,
        createTime: new Date()
    }).then((a) => {
        let curSQL = null
        for (var i = 0; i < labels.length; i++) {
            const curLabel = labels[i]
            Label.findAll({
                attributes: ['labelId'],
                where: {
                    labelText: curLabel
                }
            }).then(function (lst) {
                var curLabelId
                console.log(curLabel)
                if (lst.length === 0) {

                    Label.create({
                        labelText: curLabel
                    }).then((curLabel) => {
                        curLabelId = curLabel.labelId
                        ArticleLabel.create({
                            labelId: curLabelId,
                            articleId: a.articleId
                        })
                    })
                } else {
                    curLabelId = lst[0].labelId
                    ArticleLabel.create({
                        labelId: curLabelId,
                        articleId: a.articleId
                    })
                }
            })
        }
        res.json({
            status: 1
        })
    })
})


router.post('/addimg', uploader.single('img'), function (req, res, next) {
    const file = req.file
    console.log('here')
    res.json({
        picUrl: 'http://localhost:3000/imgs/article?img=' + file.filename
    })
})

router.post('/delete', function (req, res, next) {
    if (req.body.author !== req.body.username) {
        console.log(req.body.author + ' ' + req.body.username)
        res.json({
            status: "fail",
            msg: "别跟我瞎胡闹奥"
        })
        return
    }
    console.log('into delete')

    sequelize.transaction({ autocommit: true }, (t) => {
        return Promise.all([
            Article.destroy({
                where: {
                    articleId: req.body.articleId
                }
            }),
            ArticleLabel.destroy({
                where: {
                    articleId: req.body.articleId
                }
            })
        ])
    }).then(() => {
        res.json({
            status: "success"
        })
    })
})


module.exports = router