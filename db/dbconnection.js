const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('lnfans', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    query: {
        raw: true
    },
    dialectOptions: {
        charset: 'utf8'
    }
});

sequelize.authenticate().then(() => {
    console.log("connect to database!");
}).catch(err => {
    console.log(err);
})

module.exports = sequelize