const jwt = require('jsonwebtoken')

function generateToken(username, secret) {
    return jwt.sign({
        username: username
    }, secret)
}

function verify(token, secret) {
    return jwt.verify(token, secret)
}

module.exports = {
    generateToken,
    verify
}