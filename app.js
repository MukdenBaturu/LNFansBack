var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article')
var imgRouter = require('./routes/img')
var matchRouter = require('./routes/match')
var labelRouter = require('./routes/label')

var RSA = require('./utils/rsa');

console.log(RSA);

RSA.generateKeys();
publicKey = RSA.getPublicKey();
privateKey = RSA.getPrivateKey();
const cypher = RSA.encrypt('hello');
const plain = RSA.decrypt(cypher);
console.log(cypher);
console.log(plain);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.all('/*', function (request, response, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Method:POST,GET');
//     next();
// })

app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type,Authorization");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/article', articleRouter);
app.use('/imgs', imgRouter)
app.use('/match', matchRouter)
app.use('/label', labelRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
