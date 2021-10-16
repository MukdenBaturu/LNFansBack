var express = require('express');
var router = express.Router();
var RSA = require('../utils/rsa')

var User = require('../model/userdao')
const bcrypt = require('bcrypt')
const JWT = require('../utils/jwt')
const auth = require('../middleware/auth')

const matchlabeldao = require('../model/matchlabel')
const matchinfodao = require('../model/matchinfodao');
const sequelize = require('../db/dbconnection');
const matchtolabeldao = require('../model/matchtolabel');


router.use(auth.verify)

router.post('/addLabel', function (req, res, next) {
    const labelText = req.body.labelText
    matchlabeldao.findAll({
        where: {
            LabelText: labelText
        }
    }).then((lst) => {
        console.log(lst)
        if (lst.length != 0 && lst[0].valid == 1) {
            res.json({
                status: "failed",
                msg: "same label already exist"
            })
            return
        }
        if (lst.length == 0) {
            matchlabeldao.create({
                LabelText: labelText,
                valid: 1
            }).then((a) => {
                if (a) {
                    res.json({
                        status: "success",
                    })
                }
                else {
                    res.json({
                        status: "failed",
                        msg: "fail when creating match label"
                    })
                }
            })
        }
        else {
            matchlabeldao.update({
                valid: 1
            }, {
                where: {
                    LabelText: labelText
                }
            }).then((rst) => {
                if (rst) {
                    res.json({
                        status: "success",
                    })
                }
                else {
                    res.json({
                        status: "failed",
                        msg: "fail when creating match label"
                    })
                }
            })
        }
    })
})

router.post('/getLabelByName', function (req, res, next) {
    const labelText = req.body.labelText
    matchlabeldao.findAll({
        where: {
            LabelText: labelText,
            valid: 1
        }
    }).then((lst) => {
        if (lst.length != 0) {
            res.json({
                status: "success",
                matchLabelId: lst[0].MatchLabelId,
                labelText: lst[0].LabelText
            })
        } else {
            res.json({
                status: "failed"
            })
        }
    })
})

router.post('/changeLabel', function (req, res, next) {
    const labelId = req.body.matchLabelId
    const newText = req.body.labelText
    matchlabeldao.findByPk(labelId).then((lst) => {
        if (lst.length == 0) {
            res.json({
                status: "fail",
                msg: "label does not exist"
            })
            return
        }
        if (lst[0].LabelText == newText) {
            res.json({
                status: "fail",
                msg: "no need to change"
            })
        }
        matchinfodao.update({
            LabelText: newText
        }, {
            where: {
                MatchLabelId: labelId
            }
        }).then((rst) => {
            if (rst) {
                res.json({
                    status: "success"
                })
            } else {
                res.json({
                    status: "fail",
                    msg: "internal error"
                })
            }
        }).catch((err) => {
            res.json({
                status: "fail",
                msg: err
            })
        })
    })
})

router.post('/deleteLabel', function (req, res, next) {
    const matchLabelId = req.body.matchLabelId
    matchlabeldao.update({
        valid: 0
    }, {
        where: {
            MatchLabelId: matchLabelId
        }
    }).then((a) => {
        res.json({
            status: 'success',
        })
    }
    ).catch((err) => {
        res.json({
            status: 'failed',
            msg: err
        })
    })
})




//添加比赛信息
router.post('/addmatch', function (req, res, next) {
    const matchDate = req.body.matchDate
    const homeTeam = req.body.homeTeam
    const guestTeam = req.body.guestTeam
    const videoLink = req.body.videoLink
    const videocode = req.body.videocode
    const homeGoal = req.body.homeGoal
    const guestGoal = req.body.guestGoal
    const matchComment = req.body.matchComment
    const MatchLabelIds = req.body.matchLabelIds

    console.log(req.body)

    //matchlabel这里的逻辑存在问题，目前不存在直接添加的方法，先这么写，需要再考虑一下
    matchinfodao.create({
        matchDate: matchDate,
        homeTeam: homeTeam,
        guestTeam: guestTeam,
        videoLink: videoLink,
        videocode: videocode,
        homeGoal: homeGoal,
        guestGoal: guestGoal,
        matchComment: matchComment
    }
    ).then((matchinfo) => {
        for (var i = 0; i < MatchLabelIds.length; i++) {
            matchtolabeldao.create({
                matchInfoId: matchinfo.matchInfoId,
                matchLabelId: MatchLabelIds[i]
            })
        }
        res.json({
            status: 'success'
        })
    }).catch((err) => {
        res.json({
            status: 'fail',
            msg: err
        })
    })
})

router.post('/getLabels', function (req, res, next) {
    matchlabeldao.findAll({
        where: {}
    }).then((lst) => {
        res.json({
            status: 'success',
            labels: lst
        })
    })
})

function getMatchInfo(matchid, lst) {
    return matchinfodao.findByPk(matchid).then((rst) => {
        new Promise(() => {
            lst.push(rst)
        })
    })
}

router.post('/getMatchesByLabel', function (req, res, next) {
    const LabelId = req.body.LabelId
    matchtolabeldao.findAll({
        where: {
            matchLabelId: LabelId
        }
    }).then((lst) => {
        console.log(lst)
        if (lst.length == 0) {
            res.json({
                status: 'success',
                lst: []
            })
            return
        }
        let ans = []
        let cur = getMatchInfo(lst[0].matchInfoId, ans)
        for (let i = 1; i < lst.length; i++) {
            cur = cur.then(() => getMatchInfo(lst[i].matchInfoId, ans))
        }
        cur.then((rst) => {
            res.json({
                status: 'success',
                lst: ans
            })
        }).catch((err) => {
            res.json({
                status: 'fail',
                err: err
            })
        })
    })
})


module.exports = router