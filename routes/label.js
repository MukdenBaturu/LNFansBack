var express = require('express')
var router = express.Router()
const auth = require('../middleware/auth')
const Label = require('../model/labeldao')

router.use(auth.verify)

router.post('/getAllLabels', function (req, res, next) {
    Label.findAll({}).then((labels) => {
        res.json({
            status: "success",
            labels: labels
        })
    })
})

module.exports = router