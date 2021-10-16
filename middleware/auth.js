var User = require('../model/userdao')
var JWT = require('../utils/jwt')

const multiparty = require('multiparty')

function jwtVerify(req, res, next) {
    var raw = req.body.jwt
    console.log('1 ' + raw)
    if (raw === null || raw === undefined) {
        //console.log(req.headers)
        raw = req.headers.authorization
    }
    console.log('2 ' + raw)
    if (raw === null || raw === undefined) {
        console.log('no token')
        res.send({
            status: 'fail',
            msg: 'no token'
        })
        return
    }
    const { username } = JWT.verify(raw, 'mysecretkey');
    User.findAll({
        where: {
            username: username
        }
    }).then((list) => {
        if (list.length === 0) {
            res.send({
                status: 'fail',
                msg: 'no token'
            })
        }
        else {
            req.body.username = username;
            next();
        }
    })
}

exports.verify = jwtVerify;