const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const Jsencrypt = require('node-jsencrypt')

var pubKey;
var priKey;
var jsencrypt;

function generateKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: 'top secret'
        }
    });
    pubKey = publicKey;
    priKey = privateKey;
    jsencrypt = new Jsencrypt();
    jsencrypt.setPublicKey(pubKey);
    jsencrypt.setPrivateKey(priKey);
}

function encrypt(plain) {
    return jsencrypt.encrypt(plain);
}

function decrypt(cipher) {
    return jsencrypt.decrypt(cipher);
}

function getPublicKey() {
    return pubKey;
}

function getPrivateKey() {
    return priKey;
}


module.exports = {
    generateKeys,
    encrypt,
    decrypt,
    getPublicKey,
    getPrivateKey
};